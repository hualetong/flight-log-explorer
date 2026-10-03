'use strict';
// Artificial coordinates and relative timestamps; no real flight or device data.
function createDemoLog(){
 const data={_description:'Synthetic demonstration only; artificial coordinates, no device IDs or real flight data.',GPS:[],POS:[],ATT:[],ARSP:[],BAT:[],CTUN:[],VIBE:[],MODE:[{TimeUS:0,ModeNum:5},{TimeUS:50000000,ModeNum:10},{TimeUS:170000000,ModeNum:11}],MSG:[{TimeUS:0,Message:'ArduPlane synthetic demo'}]};
 for(let i=0;i<=1000;i++){
  const t=i*.2,theta=i/1000*Math.PI*5,x=95*Math.sin(theta)+t*.9,y=75*(Math.cos(theta)-1),TimeUS=Math.round(t*1e6),speed=14+4*Math.sin(theta),height=20+12*Math.sin(theta/2);
  data.GPS.push({TimeUS,Lat:1+y/111195,Lng:1+x/111178,Status:3,Spd:speed,Alt:40+12*Math.sin(theta/2),NSats:19,HDop:.7});
  data.POS.push({TimeUS,RelHomeAlt:height});
  data.ATT.push({TimeUS,Roll:18*Math.sin(theta),Pitch:4*Math.cos(theta/2),Yaw:(t*4)%360});
  data.ARSP.push({TimeUS,I:0,Airspeed:speed+1.5});
  data.BAT.push({TimeUS,Inst:0,Volt:16.8-t*.006,Curr:8+3*Math.sin(theta)**2});
  data.CTUN.push({TimeUS,ThO:45+12*Math.sin(theta/2)});
  data.VIBE.push({TimeUS,IMU:0,VibeX:3+Math.sin(theta),VibeY:2+.5*Math.cos(theta),VibeZ:4+Math.sin(theta/2)});
 }
 return data;
}
if(typeof module!=='undefined'&&module.exports)module.exports=createDemoLog;
