'use strict';
// Optional raster tiles. No requests are made until the user enables the basemap.
const mapProviders={
 imagery:{service:'World_Imagery',credit:'Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community'},
 street:{service:'World_Street_Map',credit:'Sources: Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community'}
};
let mapEnabled=false,mapProvider='imagery',mapOrigin=null,mapPoints=new WeakMap(),mapFrame=0,mapVisible=[],mapActive=0;
const mapTiles=new Map(),mapRadius=6378137,mapWorld=2*Math.PI*mapRadius;
function mercatorY(lat){return mapRadius*Math.log(Math.tan(Math.PI/4+Math.max(-85.05112878,Math.min(85.05112878,lat))*Math.PI/360));}
function prepareMap(){const first=log.points[0];if(mapOrigin?.point===first)return;mapOrigin={point:first,x:first.lon*Math.PI/180*mapRadius,y:mercatorY(first.lat),factor:Math.max(.001,Math.cos(first.lat*Math.PI/180))};mapPoints=new WeakMap();}
function mapPoint(p){prepareMap();if(mapPoints.has(p))return mapPoints.get(p);const longitude=((p.lon-mapOrigin.point.lon+540)%360)-180,result={x:longitude*Math.PI/180*mapRadius*mapOrigin.factor,y:(mercatorY(p.lat)-mapOrigin.y)*mapOrigin.factor};mapPoints.set(p,result);return result;}
function displayPoint(p){return mapEnabled&&log&&Number.isFinite(p.lat)?mapPoint(p):p;}
function scheduleMapDraw(){if(mapFrame)return;mapFrame=requestAnimationFrame(()=>{mapFrame=0;if(mapEnabled&&log)draw();});}
function mapStatus(text){const el=document.getElementById('map-status');if(el&&el.textContent!==text)el.textContent=text;}
function stopMapRequests(){for(const tile of mapTiles.values())if(tile.state==='loading'){tile.image.onload=tile.image.onerror=null;tile.image.removeAttribute('src');tile.state='idle';}mapActive=0;mapVisible=[];}
function pumpMapTiles(){
 if(!mapEnabled||!navigator.onLine)return;
 for(const tile of mapVisible){if(mapActive>=6)break;if(tile.state!=='idle')continue;
  tile.state='loading';mapActive++;const image=new Image();tile.image=image;image.crossOrigin='anonymous';
  const finish=ok=>{mapActive--;tile.state=ok?'loaded':'error';tile.used=performance.now();image.onload=image.onerror=null;scheduleMapDraw();pumpMapTiles();};
  image.onload=()=>finish(true);image.onerror=()=>finish(false);
  image.src=`https://server.arcgisonline.com/ArcGIS/rest/services/${mapProviders[tile.provider].service}/MapServer/tile/${tile.z}/${tile.y}/${tile.x}`;
 }
}
function drawOnlineMap(g){
 if(!mapEnabled||!log)return;prepareMap();
 const factor=mapOrigin.factor,z=Math.max(0,Math.min(19,Math.floor(Math.log2(mapWorld*factor*view.scale/256)))),n=2**z,unit=mapWorld/n,tilePixels=unit*factor*view.scale;
 const centerX=mapOrigin.x+view.cx/factor,centerY=mapOrigin.y+view.cy/factor;
 const minX=Math.floor((centerX-W/(2*view.scale*factor)+mapWorld/2)/unit),maxX=Math.floor((centerX+W/(2*view.scale*factor)+mapWorld/2)/unit);
 const minY=Math.max(0,Math.floor((mapWorld/2-centerY-H/(2*view.scale*factor))/unit)),maxY=Math.min(n-1,Math.floor((mapWorld/2-centerY+H/(2*view.scale*factor))/unit));
 mapVisible=[];let loaded=0,failed=0;g.save();g.beginPath();g.rect(0,0,W,H);g.clip();
 for(let tx=minX;tx<=maxX;tx++)for(let ty=minY;ty<=maxY;ty++){
  const wrapped=((tx%n)+n)%n,key=`${mapProvider}/${z}/${wrapped}/${ty}`;
  let tile=mapTiles.get(key);if(!tile){tile={provider:mapProvider,z,x:wrapped,y:ty,state:'idle',used:performance.now()};mapTiles.set(key,tile);}mapVisible.push(tile);tile.used=performance.now();
  const px=W/2+(tx*unit-mapWorld/2-centerX)*factor*view.scale,py=H/2+(centerY-(mapWorld/2-ty*unit))*factor*view.scale;
  if(tile.state==='loaded'){g.drawImage(tile.image,px,py,tilePixels+.5,tilePixels+.5);loaded++;}else if(tile.state==='error')failed++;
 }
 g.restore();
 if(mapTiles.size>256){const visible=new Set(mapVisible);for(const [key,tile] of [...mapTiles].sort((a,b)=>a[1].used-b[1].used)){if(mapTiles.size<=256)break;if(!visible.has(tile)&&tile.state!=='loading')mapTiles.delete(key);}}
 pumpMapTiles();
 mapStatus(!navigator.onLine?'网络已断开：保留已加载底图，轨迹仍可使用。':failed?'部分地图加载失败，轨迹仍可使用；可点击重试。':loaded===mapVisible.length?'在线地图已加载。':'正在加载在线地图…');
}
function drawMapCredit(g,width,height){if(!mapEnabled)return;g.save();g.font='10px Segoe UI';g.textAlign='left';const lines=[];let line='';for(const word of mapProviders[mapProvider].credit.split(' ')){const next=line?line+' '+word:word;if(line&&g.measureText(next).width>width-16){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);const top=height-lines.length*12-8;g.fillStyle='#0b121ce6';g.fillRect(0,top,width,height-top);g.fillStyle='#e7f0f7';lines.forEach((text,i)=>g.fillText(text,8,top+13+i*12));g.restore();}
function updateMapCredit(){const el=document.getElementById('map-attribution');el.hidden=!mapEnabled;el.textContent=mapProviders[mapProvider].credit;}
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.getElementById('map-enabled'),provider=document.getElementById('map-provider');
 toggle.onchange=()=>{
  mapEnabled=toggle.checked;provider.disabled=!mapEnabled;document.getElementById('map-retry').disabled=!mapEnabled;stopMapRequests();updateMapCredit();
  if(mapEnabled&&!log)mapStatus('请先导入日志或查看示例轨迹。');else if(!mapEnabled)mapStatus('底图已关闭：当前为离线轨迹视图。');
  if(log)fit();else draw();
 };
 provider.onchange=()=>{mapProvider=provider.value;stopMapRequests();updateMapCredit();if(log)draw();};
 document.getElementById('map-retry').onclick=()=>{stopMapRequests();for(const tile of mapTiles.values())if(tile.state==='error')tile.state='idle';if(log)draw();};
 window.addEventListener('offline',()=>{stopMapRequests();if(mapEnabled){mapStatus('网络已断开：保留已加载底图，轨迹仍可使用。');if(log)draw();}});
 window.addEventListener('online',()=>{if(mapEnabled){for(const tile of mapTiles.values())if(tile.state==='error')tile.state='idle';if(log)draw();}});
});
