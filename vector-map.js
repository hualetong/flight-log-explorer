'use strict';
// MapLibre is bundled locally; its network-backed renderer exists only while opted in.
let vectorMap=null,vectorViewKey='',vectorFrameReady=false,vectorError=false,vectorSnapshot=null;
function stopVectorMap(retain=false){
 if(vectorMap&&retain&&vectorFrameReady){const source=vectorMap.getCanvas(),image=document.createElement('canvas');image.width=source.width;image.height=source.height;image.getContext('2d').drawImage(source,0,0);vectorSnapshot={image,key:vectorViewKey};}
 else if(!retain)vectorSnapshot=null;
 if(vectorMap){vectorMap.remove();vectorMap=null;}vectorViewKey='';vectorFrameReady=false;vectorError=false;
 document.getElementById('vector-map-renderer')?.remove();
}
function drawVectorMap(g){
 const cx=mapOrigin.x+view.cx/mapOrigin.factor,cy=mapOrigin.y+view.cy/mapOrigin.factor,longitude=((cx/mapRadius*180/Math.PI+540)%360)-180,latitude=(2*Math.atan(Math.exp(cy/mapRadius))-Math.PI/2)*180/Math.PI;
 const desiredZoom=Math.log2(mapWorld*mapOrigin.factor*view.scale/512),zoom=Math.max(-2,Math.min(24,desiredZoom)),ratio=2**(desiredZoom-zoom),key=[longitude,latitude,zoom,W,H,ratio].join('/');
 if(!navigator.onLine){if(vectorSnapshot?.key===key)g.drawImage(vectorSnapshot.image,W/2-W*ratio/2,H/2-H*ratio/2,W*ratio,H*ratio);mapStatus('网络已断开：保留已加载底图，轨迹仍可使用。');return;}
 if(!vectorMap){
  if(typeof maplibregl==='undefined'){mapStatus('矢量底图加载失败，轨迹仍可使用；可点击重试。');return;}
  const container=document.createElement('div');container.id='vector-map-renderer';container.className='vector-map-renderer';container.setAttribute('aria-hidden','true');container.style.width=W+'px';container.style.height=H+'px';document.getElementById('plot').append(container);
  try{
   vectorMap=new maplibregl.Map({container,style:'https://tiles.openfreemap.org/styles/liberty',center:[longitude,latitude],zoom,minZoom:-2,maxZoom:24,bearing:0,pitch:0,interactive:false,attributionControl:false,trackResize:false,renderWorldCopies:true,fadeDuration:0,preserveDrawingBuffer:true,maxTileCacheSize:128});
   vectorMap.on('render',()=>{if(vectorMap?.isStyleLoaded()){vectorFrameReady=true;scheduleMapDraw();}});
   vectorMap.on('error',()=>{vectorError=true;scheduleMapDraw();});
  }catch{stopVectorMap();mapStatus('矢量底图加载失败，轨迹仍可使用；可点击重试。');return;}
 }
 if(vectorViewKey!==key){vectorViewKey=key;vectorFrameReady=false;const container=vectorMap.getContainer();container.style.width=W+'px';container.style.height=H+'px';vectorMap.resize();vectorMap.jumpTo({center:[longitude,latitude],zoom,bearing:0,pitch:0});}
 if(vectorFrameReady)g.drawImage(vectorMap.getCanvas(),W/2-W*ratio/2,H/2-H*ratio/2,W*ratio,H*ratio);
 mapStatus(vectorError?'矢量底图加载失败，轨迹仍可使用；可点击重试。':vectorMap.loaded()?'在线地图已加载。':'正在加载在线地图…');
}
