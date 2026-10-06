(function factory(root) {
  'use strict';
  const sizes = {b:1,B:1,M:1,h:2,H:2,c:2,C:2,i:4,I:4,e:4,E:4,L:4,f:4,d:8,q:8,Q:8,n:4,N:16,Z:64,a:64};
  // Static configuration and embedded files are not point-in-time telemetry.
  const excluded = new Set(['FILE','FMTU','UNIT','MULT','PARM','VER']);
  function parseBin(buffer) {
    const v = new DataView(buffer), bytes = new Uint8Array(buffer), formats = new Map(), data = {};
    let skipped = 0, truncated = false;
    const str = (o,n) => new TextDecoder().decode(bytes.subarray(o,o+n)).replace(/\0.*$/s,'').trim();
    function value(c,o) {
      switch(c) {
        case 'b': return v.getInt8(o);
        case 'B': case 'M': return v.getUint8(o);
        case 'h': return v.getInt16(o,true);
        case 'H': return v.getUint16(o,true);
        case 'c': return v.getInt16(o,true)/100;
        case 'C': return v.getUint16(o,true)/100;
        case 'i': return v.getInt32(o,true);
        case 'I': return v.getUint32(o,true);
        case 'e': return v.getInt32(o,true)/100;
        case 'E': return v.getUint32(o,true)/100;
        case 'L': return v.getInt32(o,true)/1e7;
        case 'f': return v.getFloat32(o,true);
        case 'd': return v.getFloat64(o,true);
        case 'q': return Number(v.getBigInt64(o,true));
        case 'Q': return Number(v.getBigUint64(o,true));
        case 'n': case 'N': case 'Z': return str(o,sizes[c]);
        case 'a': return null;
      }
    }
    for(let o=0;o+3<=v.byteLength;) {
      if(bytes[o]!==0xa3 || bytes[o+1]!==0x95) {o++; skipped++; continue;}
      const id=bytes[o+2];
      if(id===128) {
        if(o+89>v.byteLength) {truncated=true;break;}
        const f={length:bytes[o+4],name:str(o+5,4),format:str(o+9,16),labels:str(o+25,64).split(',')};
        if(f.length>=3) formats.set(bytes[o+3],f);
        o+=89; continue;
      }
      const f=formats.get(id);
      if(!f) {o++;skipped++;continue;}
      if(o+f.length>v.byteLength) {truncated=true;break;}
      if(!excluded.has(f.name)) {
        let p=o+3; const row={}; let valid=true;
        for(let k=0;k<f.format.length;k++) {
          const c=f.format[k], size=sizes[c];
          if(!size || p+size>o+f.length) {valid=false;break;}
          row[f.labels[k]]=value(c,p); p+=size;
        }
        if(valid) (data[f.name] ||= []).push(row);
      }
      o+=f.length;
    }
    if(!formats.size) throw new Error('无法识别 ArduPilot DataFlash BIN 日志（缺少 FMT 格式定义）。');
    data._warnings=[];
    if(skipped>1024) data._warnings.push(`有 ${skipped.toLocaleString()} 字节未识别，日志可能含填充或损坏。`);
    if(truncated) data._warnings.push('日志末尾不完整，已读取完整记录。');
    return data;
  }
  const num = x => x===null || x===undefined || x==='' ? null : Number.isFinite(Number(x)) ? Number(x) : null;
  const time = r => num(r.TimeUS)!==null ? num(r.TimeUS)/1e6 : num(r.TimeMS)!==null ? num(r.TimeMS)/1e3 : null;
  const sorted = rows => (Array.isArray(rows)?rows:[]).map(r=>({...r,t:time(r)})).filter(r=>r.t!==null).sort((a,b)=>a.t-b.t);
  function latest(rows,t,maxAge=2) {
    let lo=0,hi=rows.length;
    while(lo<hi) {const m=(lo+hi)>>1;if(rows[m].t<=t)lo=m+1;else hi=m;}
    const r=rows[lo-1];return r && t-r.t<=maxAge ? r : null;
  }
  function normalize(data) {
    if(!data || typeof data!=='object') throw new Error('JSON 必须包含 GPS、MODE、POS 等消息数组。');
    const gps=sorted(data.GPS), pos=sorted(data.POS), modes=sorted(data.MODE), att=sorted(data.ATT), arsp=sorted(data.ARSP), ctun=sorted(data.CTUN), bat=sorted(data.BAT);
    const receivers=[...new Set(gps.filter(r=>num(r.Status)>=3).map(r=>num(r.I)??num(r.Inst)??0))].sort((a,b)=>a-b);
    const receiver=receivers[0]??0;
    let previousValid=null;
    const points=[];
    for(const g of gps) {
      if((num(g.I)??num(g.Inst)??0)!==receiver) continue;
      const lat=num(g.Lat),lon=num(g.Lng??g.Lon);
      if(!(num(g.Status)>=3 && lat!==null && lon!==null && Math.abs(lat)<=90 && Math.abs(lon)<=180 && (lat!==0||lon!==0))) {previousValid=null;continue;}
      const p=latest(pos,g.t),m=latest(modes,g.t,Infinity),a=latest(att,g.t),air=latest(arsp,g.t),c=latest(ctun,g.t),b=latest(bat,g.t);
      points.push({t:g.t,lat,lon,speed:num(g.Spd),alt:num(g.Alt),relativeAlt:num(p?.RelHomeAlt),mode:m ? m.ModeNum??m.Mode : null,roll:num(a?.Roll),pitch:num(a?.Pitch),yaw:num(a?.Yaw)===null?null:((num(a.Yaw)%360)+360)%360,airspeed:num(air?.Airspeed??c?.As),voltage:num(b?.Volt),satellites:num(g.NSats),hdop:num(g.HDop),break:previousValid===null || g.t-previousValid>3});
      previousValid=g.t;
    }
    if(!points.length) throw new Error('日志中没有有效 GPS 定位点（需要 Status ≥ 3）。无法生成地理轨迹；请检查 GPS 是否连接并获得定位。');
    const origin=points[0], rad=Math.PI/180, R=6371008.8;
    for(const p of points) {let dl=p.lon-origin.lon;dl=((dl+540)%360)-180;p.x=R*dl*rad*Math.cos(origin.lat*rad);p.y=R*(p.lat-origin.lat)*rad;p.elapsed=p.t-origin.t;}
    const msgs=(data.MSG||[]).map(r=>r.Message??r.Msg??'').join(' ');
    const vehicle=/ArduCopter/i.test(msgs)?'copter':/ArduPlane/i.test(msgs)?'plane':/ArduRover/i.test(msgs)?'rover':'unknown';
    const streams={};
    for(const [type,records] of Object.entries(data)) {
      if(excluded.has(type)||type.startsWith('_')||!Array.isArray(records)) continue;
      const rows=sorted(records);if(!rows.length)continue;
      // PID/TECS fields named I are integrator values, not sensor instance IDs.
      const instanceCandidates=type==='VIBE'?['IMU']:/^XK/.test(type)?['C']:['GPS','GPA','IMU','MAG','BARO','ARSP','UART','CANS'].includes(type)?['I','Instance']:['Inst','Instance'];
      const instanceKey=instanceCandidates.find(k=>rows.some(r=>num(r[k])!==null));
      for(const r of rows) {
        const instance=instanceKey?String(r[instanceKey]??'未知'):null;
        const id=instanceKey?`${type}:${instanceKey}:${instance}`:type;
        if(!streams[id])streams[id]={type,instanceKey,instance,rows:[]};
        streams[id].rows.push(r);
      }
    }
    return {points,vehicle,receiver,warnings:data._warnings||[],modes,streams};
  }
  const api={parseBin,normalize,latest};
  api.workerSource='('+factory.toString()+')(self);';
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.FlightLog=api;
})(typeof self!=='undefined'?self:globalThis);
