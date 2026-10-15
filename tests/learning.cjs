const assert=require('node:assert/strict');
const {heatModel,queueModel}=require('../learning.js');
const C=10000*4.18/3600;
for(const p of [10,30,60])for(const g of [.5,1,3]){const m=heatModel(p,g);assert.equal(m.T(0),20);assert.ok(Math.abs(m.T(1e5)-m.eq)<1e-8);const derivative=(m.T(.00001)-m.T(0))/.00001;assert.ok(Math.abs(C*derivative-(p-g*10))<.001);if(m.targetTime!==null)assert.ok(Math.abs(m.T(m.targetTime)-30)<1e-8);else assert.ok(m.eq<=30);}
assert.equal(queueModel('batch',1).meanWait,140);assert.equal(queueModel('batch',2).meanWait,60);assert.equal(queueModel('spaced',1).meanWait,0);
for(const mode of ['batch','pairs','spaced'])for(const workers of [1,2,3]){const q=queueModel(mode,workers);assert.equal(q.jobs.reduce((n,j)=>n+j.end-j.start,0),320);for(const j of q.jobs){assert.ok(j.start>=j.arrival);assert.equal(j.end-j.start,40);}for(let w=0;w<workers;w++){const jobs=q.jobs.filter(j=>j.worker===w);for(let i=1;i<jobs.length;i++)assert.ok(jobs[i].start>=jobs[i-1].end);}}
console.log('Heat balance, limiting temperatures, queue capacity and scheduling invariants passed');
