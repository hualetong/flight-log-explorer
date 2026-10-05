'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const plot=document.getElementById('plot'),slider=document.getElementById('plot-height'),output=document.getElementById('plot-height-value'),key='flight-log-explorer.plot-height.v1';
 try{const saved=localStorage.getItem(key),height=Number(saved);if(saved!==null&&Number.isFinite(height)&&height>=400&&height<=1400)plot.style.setProperty('--track-height',height+'px');}catch{}
 function sync(){const height=Math.round(plot.getBoundingClientRect().height);slider.value=String(height);output.value=height+' px';}
 slider.oninput=()=>{const height=Number(slider.value);plot.style.setProperty('--track-height',height+'px');try{localStorage.setItem(key,String(height));}catch{}sync();};
 document.getElementById('plot-height-reset').onclick=()=>{plot.style.removeProperty('--track-height');try{localStorage.removeItem(key);}catch{}sync();};
 new ResizeObserver(sync).observe(plot);sync();
});
