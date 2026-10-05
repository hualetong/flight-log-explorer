'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),WaypointFile=require('./waypoint-parser.js');
const sample=fs.readFileSync('examples/simulated-flight.waypoints','utf8'),mission=WaypointFile.parse(sample);
assert.equal(mission.items.length,7);assert.deepEqual(mission.points.map(p=>p.seq),[0,1,2,4,5]);assert.ok(mission.items[0].home);assert.ok(Number.isNaN(mission.items[1].params[3]));assert.equal(mission.items[3].command,178);assert.equal(mission.items[6].plotted,false);
assert.equal(WaypointFile.parse('\uFEFF'+sample.replaceAll('\n','\r\n')).items.length,7);
for(const text of ['QGC WPL 100\n','QGC WPL 110\n','QGC WPL 110\n0 1 0 16 0 0','QGC WPL 110\n0 1 0 16 0 0 0 0 91 120 30 1',sample+'\n6 0 3 16 0 0 0 0 1 1 50 1',sample.replace('nan','Infinity'),sample.replace('0\t1\t0\t16','0\t2\t0\t16')])assert.throws(()=>WaypointFile.parse(text));
const special=WaypointFile.parse('QGC WPL 110\n0 0 1 16 0 0 0 0 12 15 -10 1\n1 0 3 16 0 0 0 0 0 0 20 1\n2 0 10 16 0 0 0 nan 0 1 50 1\n3 0 3 177 2 5 0 0 0 0 0 1\n4 0 3 999 0 0 0 0 1 1 0 1');
assert.equal(special.items[0].reason,'局部坐标暂不叠加');assert.equal(special.items[1].reason,'位置未指定');assert.deepEqual(special.points.map(p=>p.seq),[2]);assert.ok(special.items[3].breakRoute);assert.equal(special.items[4].name,'MAV_CMD_999');
console.log('PASS: WPL 110/BOM/CRLF, Home, navigation vs DO/RTL, NaN defaults, local/unspecified positions, terrain frame, jumps, unknown commands and malformed-file validation.');
