'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
 const tile=Buffer.from(await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#647f46';g.fillRect(0,0,256,256);g.fillStyle='#d8b87a';g.fillRect(128,0,128,128);return c.toDataURL().split(',')[1];}),'base64');
 await page.route('https://server.arcgisonline.com/**',route=>{const url=new URL(route.request().url()),z=Number(url.pathname.split('/').at(-3));requests.push(url);return z>14?route.fulfill({status:404,headers:z>16?{}:{'access-control-allow-origin':'*'},body:''}):route.fulfill({contentType:'image/png',headers:{'access-control-allow-origin':'*'},body:tile});});
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href);await page.locator('#demo').click();await page.evaluate(()=>{applyRange(200,800);setSelected(400);});await page.locator('#map-provider').evaluate(el=>el.value='street');await page.evaluate(()=>mapProvider='street');await page.locator('#map-enabled').check();
 const state=await page.evaluate(()=>({view:{...view},range:[rangeStart,rangeEnd],selected}));
 await page.waitForFunction(()=>document.querySelector('#map-status').textContent.includes('较低级别')&&mapActive===0&&mapVisible.every(t=>t.state==='loaded'||t.state==='missing'||t.state==='error'));
 assert.deepEqual(await page.evaluate(()=>({view:{...view},range:[rangeStart,rangeEnd],selected})),state);
 assert.ok(requests.every(url=>url.searchParams.get('blankTile')==='false'));assert.ok(requests.some(url=>url.pathname.includes('/tile/14/')));
 assert.equal(new Set(requests.map(u=>u.href)).size,requests.length,'shared parent tiles should be fetched only once');
 const crops=await page.evaluate(()=>{const results=[],original=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(...args){if(args.length===9)results.push(args.slice(1,5));return original.apply(this,args);};draw();CanvasRenderingContext2D.prototype.drawImage=original;return results;});assert.ok(crops.length>0);assert.ok(crops.every(([x,y,w,h])=>w<256&&h<256&&x>=0&&y>=0&&x+w<=256&&y+h<=256),'fallback must crop the corresponding parent quadrant');
 const download=page.waitForEvent('download');await page.locator('#export').click();assert.equal((await download).suggestedFilename(),'flight-track.png');
 await page.locator('#language').selectOption('en');assert.match(await page.locator('#map-status').innerText(),/lower-resolution basemap/);
 assert.deepEqual(errors,[]);console.log('PASS: missing detailed tiles use cached parent crops, retain track scale/range/progress, avoid placeholder tiles, preserve PNG and explain resolution in both languages.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
