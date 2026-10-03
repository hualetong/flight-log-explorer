'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href);await page.locator('#demo').click();
 const drag=async(from,to,y=40)=>{await page.locator('#profile').scrollIntoViewIfNeeded();const r=await page.locator('#profile').boundingBox(),x=t=>r.x+20+t/200*(r.width-40);await page.mouse.move(x(from),r.y+y);await page.mouse.down();await page.mouse.move(x(to),r.y+y,{steps:12});await page.mouse.up();};
 await page.evaluate(()=>setSelected(250));await drag(50,100);assert.equal(await page.locator('#seek').inputValue(),'500');assert.match(await page.locator('#pointstate').innerText(),/501/);assert.deepEqual(await page.evaluate(()=>[rangeStart,rangeEnd]),[0,1000]);
 await page.evaluate(()=>{applyRange(200,700);setSelected(400);});const summary=await page.locator('.summary').innerText();await drag(80,190);assert.equal(await page.locator('#seek').inputValue(),'700');assert.deepEqual(await page.evaluate(()=>[rangeStart,rangeEnd]),[200,700]);assert.equal(await page.locator('.summary').innerText(),summary);
 // The top grip selects the playhead when it overlaps a range edge.
 await drag(140,20,8);assert.equal(await page.locator('#seek').inputValue(),'200');assert.deepEqual(await page.evaluate(()=>[rangeStart,rangeEnd]),[200,700]);
 await drag(40,90,8);assert.equal(await page.locator('#seek').inputValue(),'450');assert.deepEqual(await page.evaluate(()=>[rangeStart,rangeEnd]),[200,700]);
 await drag(65,110);assert.equal(await page.locator('#seek').inputValue(),'450');assert.deepEqual(await page.evaluate(()=>[rangeStart,rangeEnd]),[200,700]);
 await page.evaluate(()=>{applyRange(0,1000);setSelected(100);});await page.locator('#play').click();await page.locator('#profile').scrollIntoViewIfNeeded();const r=await page.locator('#profile').boundingBox();await page.evaluate(()=>{stop();setSelected(250);playing=true;});await page.mouse.move(r.x+20+50/200*(r.width-40),r.y+40);assert.equal(await page.locator('#profile').evaluate(el=>getComputedStyle(el).cursor),'grab');await page.mouse.down();assert.equal(await page.evaluate(()=>playing),false);assert.equal(await page.locator('#profile').evaluate(el=>getComputedStyle(el).cursor),'grabbing');await page.mouse.move(r.x+20+75/200*(r.width-40),r.y+40);await page.mouse.up();assert.equal(await page.locator('#seek').inputValue(),'375');
 assert.deepEqual(errors,[]);console.log('PASS: playhead seeking, range clamping, edge overlap grip, ignored distant drags, pause on drag and linked point details.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
