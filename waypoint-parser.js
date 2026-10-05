'use strict';
// QGC WPL 110: https://mavlink.io/en/file_formats/ . Text coordinates are degrees.
(function(root){
 const commands={16:'NAV_WAYPOINT',17:'NAV_LOITER_UNLIM',18:'NAV_LOITER_TURNS',19:'NAV_LOITER_TIME',20:'NAV_RETURN_TO_LAUNCH',21:'NAV_LAND',22:'NAV_TAKEOFF',23:'NAV_LAND_LOCAL',24:'NAV_TAKEOFF_LOCAL',30:'NAV_CONTINUE_AND_CHANGE_ALT',31:'NAV_LOITER_TO_ALT',36:'NAV_ARC_WAYPOINT',82:'NAV_SPLINE_WAYPOINT',84:'NAV_VTOL_TAKEOFF',85:'NAV_VTOL_LAND',93:'NAV_DELAY',94:'NAV_PAYLOAD_PLACE',177:'DO_JUMP',178:'DO_CHANGE_SPEED',201:'DO_SET_ROI',206:'DO_SET_CAM_TRIGG_DIST',600:'JUMP_TAG',601:'DO_JUMP_TAG'};
 const destinations=new Set([16,17,18,19,21,22,31,36,82,84,85,94]),globalFrames=new Set([0,3,5,6,10,11]);
 function parse(text){
  const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/);if(lines[0].trim()!=='QGC WPL 110')throw Error('仅支持 QGC WPL 110 航点文件。');
  const items=[];let previous=-1;
  for(let i=1;i<lines.length;i++){
   const line=lines[i].trim();if(!line||line.startsWith('#'))continue;const fields=line.split(/\s+/),fail=()=>{throw Error('航点文件第 '+(i+1)+' 行无效。');};
   if(fields.length!==12)fail();const values=fields.map(v=>/^nan$/i.test(v)?NaN:/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(v)?Number(v):Infinity);
   if(values.some(v=>!Number.isFinite(v)&&!Number.isNaN(v)))fail();
   for(const k of [0,1,2,3,11])if(!Number.isInteger(values[k])||values[k]<0||values[k]>65535)fail();
   const [seq,current,frame,command,p1,p2,p3,p4,lat,lon,alt,autocontinue]=values;
   if(seq<=previous||![0,1].includes(current)||![0,1].includes(autocontinue))fail();previous=seq;
   const destination=destinations.has(command),global=globalFrames.has(frame),hasCoordinates=Number.isFinite(lat)&&Number.isFinite(lon)&&(lat!==0||lon!==0);
   if(destination&&global&&hasCoordinates&&(Math.abs(lat)>90||Math.abs(lon)>180))fail();
   const plotted=destination&&global&&hasCoordinates,home=seq===0&&command===16;
   const reason=plotted?'':!destination?'不含可绘制的导航位置':!global?'局部坐标暂不叠加':'位置未指定';
   items.push({seq,current,frame,command,params:[p1,p2,p3,p4],lat,lon,alt,autocontinue,plotted,home,reason,name:commands[command]||'MAV_CMD_'+command,breakRoute:!plotted&&(command<96||command===177||command===601)});
  }
  if(!items.length)throw Error('航点文件没有任务项。');return {items,points:items.filter(p=>p.plotted)};
 }
 const api={parse};if(typeof module==='object'&&module.exports)module.exports=api;else root.WaypointFile=api;
})(typeof globalThis!=='undefined'?globalThis:this);
