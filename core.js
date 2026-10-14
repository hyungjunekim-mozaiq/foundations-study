(function(root){
'use strict';
const core={
 validateBackup(data,lessons){
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const textMap=x=>object(x)&&Object.values(x).every(v=>typeof v==='string');
  const fail=()=>{throw new TypeError('Invalid study backup');};
  if(!object(data)||data.version!==3||!object(data.units)||!object(data.reviews))fail();
  for(const [id,r] of Object.entries(data.units)){
   const l=lessons.find(l=>l.id===id);
   if(!l||!object(r)||!textMap(r.notes)||!Array.isArray(r.read)||!r.read.every(k=>l.sections.some(s=>s.id===k))||!object(r.problems)||!Array.isArray(r.questions)||!Number.isFinite(r.updated))fail();
   if(r.takeaway!==undefined&&!textMap(r.takeaway))fail();
   for(const key of ['draft','prediction'])if(r[key]!==undefined&&typeof r[key]!=='string')fail();
   for(const [pid,p]of Object.entries(r.problems))if(!l.problems.some(p=>p.id===pid)||!object(p)||typeof p.answer!=='string'||typeof p.reason!=='string'||!Number.isInteger(p.attempts)||p.attempts<0||typeof p.helped!=='boolean')fail();
   if(!r.questions.every(q=>object(q)&&typeof q.question==='string'&&Number.isFinite(q.at)))fail();
  }
  for(const [id,r]of Object.entries(data.reviews)){
   if(!lessons.some(l=>l.review.some(c=>id===l.id+':'+c.id))||!object(r)||!Number.isFinite(r.due)||!Number.isInteger(r.step)||r.step<0||r.step>5||typeof r.answer!=='string'||!Array.isArray(r.history))fail();
  }
  return true;
 },
 thermal(m,p,g){
  if(![m,p,g].every(Number.isFinite)||m<=0||g<=0)throw new RangeError('Positive mass and loss coefficient required.');
  const C=4180*m,tau=C/g,eq=20+p/g;
  return {C,tau,eq,T:t=>eq+(20-eq)*Math.exp(-t/tau)};
 },
 checkNumber(answer,value,tolerance){return String(answer).trim()!==''&&Number.isFinite(Number(answer))&&Math.abs(Number(answer)-value)<=tolerance;},
 schedule(step,grade,now){
  if(!['again','hard','good'].includes(grade))throw new RangeError('Unknown grade');
  const intervals=[1,3,7,14,30],day=86400000;
  if(grade==='again')return{step:0,due:now+600000};
  if(grade==='hard')return{step:0,due:now+day};
  return{step:Math.min(step+1,5),due:now+intervals[Math.min(Math.max(step,0),4)]*day};
 }
};
if(typeof module!=='undefined')module.exports=core;else root.StudyCore=core;
})(typeof window!=='undefined'?window:globalThis);
