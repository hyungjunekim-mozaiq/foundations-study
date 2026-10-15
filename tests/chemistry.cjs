const assert=require('node:assert/strict');const {bufferPH,alkalinity}=require('../chemistry.js');
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
near(bufferPH(7,10,10,0),7);near(bufferPH(7,10,10,.5),6.95653430621891);near(bufferPH(7,1,1,.5),6.522878745280337);assert.equal(bufferPH(7,1,1,1),null);assert.equal(bufferPH(7,1,1,2),null);
for(let a=0;a<=.85;a+=.05){assert.ok(bufferPH(7,1,1,a+.01)<bufferPH(7,1,1,a));near(bufferPH(7,1,1,a),bufferPH(7,10,10,10*a));assert.ok(bufferPH(7,10,10,a)>=bufferPH(7,1,1,a));}
near(alkalinity(.02,8,100),80);near(alkalinity(.01,6,50),60);assert.throws(()=>alkalinity(.01,6,0));assert.throws(()=>bufferPH(7,0,1,.5));
near(-Math.log10((1e-3+1e-5)/2),3.2967086218813386);near(6.8+Math.log10(5/3),7.021848749616356);near(7.2+Math.log10(4/6),7.023908740944319);
console.log('Buffer monotonicity, scale invariance, exhaustion bounds, titration units and worked answers passed');
