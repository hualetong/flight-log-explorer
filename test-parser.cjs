'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {parseBin,normalize,latest}=require('./log-parser.js');
const root=process.env.FLIGHT_LOG_DIR||path.join(__dirname,'..','10.1');
if(fs.existsSync(path.join(root,'20261001_1602_log75_parsed.json'))){
for(const name of ['20261001_1602_log75','20261001_1620_log76']){
 const bytes=fs.readFileSync(path.join(root,'fc_logs_20261001_flight(1)',name+'.BIN'));
 const data=parseBin(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
 const expected=JSON.parse(fs.readFileSync(path.join(root,name+'_parsed.json'),'utf8').replace(/^\uFEFF/,''));
 for(const type of ['GPS','MODE','POS']){
  assert.equal(data[type].length,expected[type].length,type+' count');
  for(let i=0;i<data[type].length;i++)for(const k of ['TimeUS','Lat','Lng','Spd','Alt','RelHomeAlt','ModeNum']){
   if(typeof expected[type][i][k]==='number')assert.ok(Math.abs(data[type][i][k]-expected[type][i][k])<1e-4,`${name} ${type} ${i} ${k}`);
  }
 }
 const a=normalize(data),b=normalize(expected);assert.equal(a.points.length,b.points.length);
 for(let i=0;i<a.points.length;i++){assert.equal(a.points[i].mode,b.points[i].mode);assert.ok(Math.abs(a.points[i].relativeAlt-b.points[i].relativeAlt)<1e-4);}
 console.log(name+': BIN/JSON match, '+a.points.length+' points; vehicle='+a.vehicle);
}
const no=fs.readFileSync(path.join(root,'fc_logs_20261001_flight(1)','20261001_1622_log77_noGPS.BIN'));
assert.equal(normalize(parseBin(no.buffer.slice(no.byteOffset,no.byteOffset+no.byteLength))).points.length,274);
}else console.log('SKIP: optional real-log fixtures unavailable.');
assert.throws(()=>normalize({GPS:[{TimeUS:1000000,Status:1,Lat:30,Lng:120}]}),/没有有效 GPS/);
assert.throws(()=>parseBin(new ArrayBuffer(10)),/无法识别/);
assert.equal(latest([{t:10},{t:20}],19),null);
assert.equal(latest([{t:10},{t:20}],19,Infinity).t,10);
const joined=normalize({GPS:[{TimeUS:1000000,Status:3,Lat:30,Lng:120},{TimeUS:2000000,Status:1,Lat:30,Lng:120},{TimeUS:3000000,Status:3,Lat:30.001,Lng:120}],MODE:[{TimeUS:1500000,ModeNum:10}],POS:[{TimeUS:500000,RelHomeAlt:12}]});
assert.equal(joined.points[0].mode,null);assert.equal(joined.points[1].mode,10);assert.equal(joined.points[1].relativeAlt,null);assert.equal(joined.points[1].break,true);
console.log('PASS: real logs, invalid GPS, time matching, stale values and fix-loss gaps.');
