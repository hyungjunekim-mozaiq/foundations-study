const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs');
const {thermal,checkNumber,schedule}=require('../core.js');
const base=thermal(2,200,5),twice=thermal(4,200,5),insulated=thermal(2,200,2.5);
assert.equal(base.T(0),20);assert.equal(base.eq,60);assert.equal(base.tau,1672);
assert.equal(twice.eq,base.eq);assert.equal(twice.tau,2*base.tau);
assert(Math.abs(base.T(base.tau)-(20+40*(1-Math.exp(-1))))<1e-10);
assert(insulated.tau>base.tau);assert(insulated.T(1200)>base.T(1200));
assert(Math.abs(-base.tau*Math.log(.1)/60-64.2)<.05);
for(const m of [1,2,4])for(const p of [100,200,300])for(const g of [2.5,5,10]){
 const a=thermal(m,p,g);let last=20;
 for(let t=0;t<7200;t+=60){const temp=a.T(t);assert(temp>=last&&temp<=a.eq);last=temp;}
}
assert.throws(()=>thermal(0,200,5));assert(!checkNumber('',0,.1));assert(!checkNumber('Infinity',3,.1));assert(checkNumber('19.3',19.3157,.2));assert(!checkNumber('1159',19.3157,.2));
const now=1791982800000;
assert.equal(schedule(0,'good',now).due,now+86400000);
assert.equal(schedule(1,'good',now).due,now+3*86400000);
assert.equal(schedule(5,'good',now).due,now+30*86400000);
assert.equal(schedule(4,'again',now).due,now+600000);assert.equal(schedule(4,'hard',now).step,0);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(require.resolve('../lessons.js'),'utf8'),ctx);
const lessons=ctx.window.LESSONS;assert.equal(lessons.length,3);
const ids=new Set();let sections=0,problems=0,reviews=0;
for(const l of lessons){assert(!ids.has(l.id));ids.add(l.id);sections+=l.sections.length;problems+=l.problems.length;reviews+=l.review.length;assert(l.sources.length);for(const group of [l.sections,l.problems,l.review])assert.equal(new Set(group.map(x=>x.id)).size,group.length);for(const p of l.problems){assert(p.hint&&p.solution&&p.rubric.length);if(p.kind==='number')assert(checkNumber(p.value,p.value,p.tolerance));}}
assert.equal(lessons[2].problems.find(p=>p.id==='target').value.toFixed(1),(-836*Math.log(.25)/60).toFixed(1));
console.log(`Passed: physical invariants, numeric grading, review scheduling, ${sections} sections / ${problems} problems / ${reviews} review questions.`);
const {validateBackup}=require('../core.js');
const sample={version:3,units:{systems:{notes:{boundary:'a note'},read:['boundary'],problems:{tank:{answer:'660',reason:'900-6*40',attempts:1,helped:false}},questions:[],prediction:'',updated:now}},reviews:{'systems:stock':{answer:'',step:0,due:now,history:[]}}};
assert(validateBackup(sample,lessons));
const broken=structuredClone(sample);broken.units.systems.problems.tank.answer=660;assert.throws(()=>validateBackup(broken,lessons));
const unknown=structuredClone(sample);unknown.units.systems.read.push('missing-section');assert.throws(()=>validateBackup(unknown,lessons));
console.log('Passed: backup validation rejects incompatible records before merge.');
