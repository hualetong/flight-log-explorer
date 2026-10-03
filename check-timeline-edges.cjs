'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href);await page.locator('#demo').click();await page.locator('#profile').evaluate(c=>{c.style.width='calc(100% - 0.4px)';});
 for(const width of [1280,1281,1365,1366,1440,1441,1919,1920,390]){
  await page.setViewportSize({width,height:1050});await page.evaluate(()=>{resetProfileZoom();applyRange(0,1000);setSelected(1000);});await page.locator('#profile').scrollIntoViewIfNeeded();
  const r=await page.locator('#profile').boundingBox(),edge=await page.evaluate(()=>profileX(log.points[rangeEnd].elapsed));
  const target=await page.evaluate(({x,y})=>profileTarget({clientX:x,clientY:y}),{x:r.x+r.width-20,y:r.y+40});
  assert.equal(target,'right',`right endpoint must be draggable at viewport width ${width}; drawn=${edge}, visible=${r.width-20}`);
  await page.mouse.move(r.x+r.width-20,r.y+40);await page.mouse.down();await page.mouse.move(r.x+20+.75*(r.width-40),r.y+40,{steps:10});await page.mouse.up();assert.ok(Math.abs(await page.evaluate(()=>rangeEnd)-750)<=Math.ceil(1000/(r.width-40)),`right edge drag at width ${width}`);
  await page.evaluate(()=>applyRange(0,1000));await page.mouse.move(r.x+20,r.y+40);await page.mouse.down();await page.mouse.move(r.x+20+.25*(r.width-40),r.y+40,{steps:10});await page.mouse.up();assert.ok(Math.abs(await page.evaluate(()=>rangeStart)-250)<=Math.ceil(1000/(r.width-40))); 
 }
 assert.deepEqual(errors,[]);console.log('PASS: both timeline endpoints drag at fractional desktop widths and mobile width, including playhead overlap.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
