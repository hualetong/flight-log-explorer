'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const select=document.getElementById('map-provider'),wrapper=document.createElement('div'),button=document.createElement('button'),list=document.createElement('div');
 wrapper.className='map-picker';select.before(wrapper);wrapper.append(select);select.classList.add('map-provider-native');select.setAttribute('aria-hidden','true');select.tabIndex=-1;
 button.id='map-provider-button';button.type='button';button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','map-provider-list');
 list.id='map-provider-list';list.className='map-provider-list';list.setAttribute('role','listbox');list.setAttribute('aria-label',select.getAttribute('aria-label'));list.hidden=true;wrapper.append(button,list);
 const options=[...select.options].map(option=>{const el=document.createElement('button');el.type='button';el.setAttribute('role','option');el.tabIndex=-1;el.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));close();button.focus();};list.append(el);return el;});
 function sync(){button.disabled=select.disabled;list.setAttribute('aria-label',select.getAttribute('aria-label'));button.textContent=select.selectedOptions[0].textContent+' ▾';options.forEach((el,i)=>{el.textContent=select.options[i].textContent;el.setAttribute('aria-selected',String(select.options[i].selected));});if(select.disabled)close();}
 function close(){list.hidden=true;button.setAttribute('aria-expanded','false');}
 function open(){if(button.disabled)return;list.hidden=false;button.setAttribute('aria-expanded','true');options[select.selectedIndex].focus();}
 button.onclick=()=>list.hidden?open():close();button.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open();}};
 list.onkeydown=e=>{const current=options.indexOf(document.activeElement);if(e.key==='Escape'){e.preventDefault();close();button.focus();}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?options.length-1:(current+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next].focus();}else if(e.key==='Tab')close();};
 document.addEventListener('pointerdown',e=>{if(!wrapper.contains(e.target))close();});select.addEventListener('change',sync);
 new MutationObserver(sync).observe(select,{attributes:true,attributeFilter:['disabled','aria-label'],subtree:true,childList:true,characterData:true});sync();
});
