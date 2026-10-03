'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,channel:'msedge'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href);
 await page.locator('#file').setInputFiles(path.join(__dirname,'examples/simulated-flight.json'));
 await page.waitForFunction(()=>document.querySelector('#status').className==='success');
 if(await page.evaluate(()=>log.points.length)!==1001)throw Error('sample import failed');
 await page.screenshot({path:'docs/images/track.png'});
 await page.locator('#range-from').fill('50');await page.locator('#range-from').dispatchEvent('change');
 await page.locator('#range-to').fill('170');await page.locator('#range-to').dispatchEvent('change');
 await page.screenshot({path:'docs/images/range-selection.png'});
 await page.locator('#chart-add').click();await page.getByLabel('纵轴参数 3',{exact:true}).selectOption('voltage');
 await page.locator('#chart-add').click();await page.getByLabel('纵轴参数 4',{exact:true}).selectOption('raw:CTUN:ThO');
 await page.locator('.chart-panel').screenshot({path:'docs/images/parameter-chart.png'});
 fs.mkdirSync('test-results/demo-frames',{recursive:true});
 await page.locator('#range-reset').click();await page.evaluate(()=>scrollTo(0,0));
 for(let i=0;i<12;i++){
  if(i===4){await page.evaluate(()=>applyRange(250,850));}
  await page.evaluate(i=>setSelected(Math.min(rangeEnd,rangeStart+i*65)),i);
  await page.screenshot({path:`test-results/demo-frames/${String(i).padStart(2,'0')}.png`});
 }
 await page.locator('.chart-panel').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/demo-frames/12.png'});
 console.log('PASS: distributable synthetic log imported; screenshots and animation frames captured.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
