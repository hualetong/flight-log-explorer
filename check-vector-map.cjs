'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||undefined});try{
 const context=await browser.newContext({viewport:{width:1440,height:1050}}),page=await context.newPage(),requests=[],errors=[];let failing=false;
 page.on('pageerror',e=>errors.push(e.message));
 const style={version:8,sources:{roads:{type:'geojson',data:{type:'FeatureCollection',features:[{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[[.995,1],[1.005,1]]}}]}}},layers:[{id:'background',type:'background',paint:{'background-color':'#cfe1bd'}},{id:'roads',type:'line',source:'roads',paint:{'line-color':'#647480','line-width':5}}]};
 await context.route('**/*',route=>{if(!route.request().url().startsWith('https://'))return route.continue();requests.push(route.request().url());return route.request().url()==='https://tiles.openfreemap.org/styles/liberty'&&!failing?route.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(style)}):route.abort();});
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href);await page.locator('#demo').click();assert.equal(requests.length,0);
 // Select through the visible control; selected/unselected colors must be reversed.
 assert.equal(await page.locator('#map-provider-button').isDisabled(),true);await page.locator('#map-enabled').check();await page.locator('#map-provider-button').click();const options=page.locator('#map-provider-list').getByRole('option');
 assert.deepEqual(await options.evaluateAll(nodes=>nodes.map(n=>({selected:n.getAttribute('aria-selected'),bg:getComputedStyle(n).backgroundColor,color:getComputedStyle(n).color}))),[
  {selected:'true',bg:'rgb(202, 202, 202)',color:'rgb(17, 17, 17)'},{selected:'false',bg:'rgb(25, 42, 59)',color:'rgb(255, 255, 255)'},{selected:'false',bg:'rgb(25, 42, 59)',color:'rgb(255, 255, 255)'}]);
 await page.screenshot({path:'test-results/map-picker-preview.png'});
 await page.keyboard.press('End');await page.keyboard.press('Enter');assert.equal(await page.locator('#map-provider').inputValue(),'openfreemap');
 await page.evaluate(()=>{applyRange(200,800);setSelected(400);});const selection=await page.evaluate(()=>[rangeStart,rangeEnd,selected]);await page.locator('#map-enabled').check();
 await page.waitForFunction(()=>vectorMap?.loaded()&&vectorFrameReady);assert.ok(requests.includes('https://tiles.openfreemap.org/styles/liberty'));
 async function aligned(){await page.waitForFunction(()=>vectorMap?.loaded()&&vectorFrameReady);assert.ok(await page.evaluate(()=>{const p=log.points[400],actual=vectorMap.project([p.lon,p.lat]),expected=screen(p);return Math.hypot(actual.x-expected.x,actual.y-expected.y)<.01;}),'vector map and track must share screen coordinates');}
 await aligned();await page.evaluate(()=>{view.cx+=32;view.cy-=18;view.scale*=1.8;draw();});await aligned();await page.setViewportSize({width:1150,height:900});await aligned();assert.deepEqual(await page.evaluate(()=>[rangeStart,rangeEnd,selected]),selection);
 const download=page.waitForEvent('download');await page.locator('#export').click();assert.equal((await download).suggestedFilename(),'flight-track.png');assert.equal(await page.evaluate(()=>!!canvas.toDataURL()),true);
 await context.setOffline(true);await page.waitForFunction(()=>!navigator.onLine&&vectorMap===null);assert.ok(await page.evaluate(()=>!!vectorSnapshot));assert.match(await page.locator('#map-status').innerText(),/网络已断开/);await context.setOffline(false);await aligned();
 failing=true;await page.locator('#map-retry').click();await page.waitForFunction(()=>vectorError&&document.querySelector('#map-status').textContent.includes('加载失败'));assert.match(await page.locator('#map-status').innerText(),/加载失败/);failing=false;await page.locator('#map-retry').click();await aligned();
 await page.locator('#map-enabled').uncheck();assert.equal(await page.evaluate(()=>vectorMap),null);assert.equal(await page.locator('#vector-map-renderer').count(),0);const count=requests.length;await page.locator('#fit').click();assert.equal(requests.length,count);
 await page.locator('#language').selectOption('en');await page.waitForFunction(()=>document.querySelector('#map-provider-button').textContent.includes('Street map · OpenFreeMap (OSM)'));await page.locator('#map-enabled').check();await aligned();
 await page.locator('#map-provider-button').click();await page.keyboard.press('Home');await page.keyboard.press('Enter');assert.equal(await page.locator('#map-provider').inputValue(),'imagery');await page.locator('#map-provider-button').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#map-provider-button').getAttribute('aria-expanded'),'false');
 await page.setViewportSize({width:390,height:844});await page.locator('#map-provider-button').click();assert.ok(await page.locator('#map-provider-list').evaluate(el=>el.getBoundingClientRect().right<=innerWidth));assert.deepEqual(errors,[]);
 console.log('PASS: offline default, custom picker colors/keyboard/language/mobile, vector alignment under zoom/pan/resize, safe PNG, offline snapshot, retry and renderer cleanup.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
