const assert = require('node:assert/strict');
const { operatingPoint } = require('../pressure.js');
for (const resistance of [.015, .03, .06, .09]) {
  for (const lift of [0, 4, 12]) {
    const {flow, head} = operatingPoint(resistance, lift);
    assert.ok(Math.abs(head - (lift + resistance * flow ** 2)) < 1e-10,
      'The operating point must balance supplied and required head');
    assert.ok(flow > 0 && head >= lift);
  }
}
const baseline = operatingPoint(.03), obstructed = operatingPoint(.06);
assert.equal(baseline.flow, 20);
assert.equal(baseline.head, 12);
assert.ok(obstructed.flow < baseline.flow && obstructed.head > baseline.head,
  'With this fixed-speed pump, added resistance reduces flow and raises head');
assert.ok(operatingPoint(.03, 4).flow < baseline.flow);
assert.throws(() => operatingPoint(0));
assert.throws(() => operatingPoint(.03, 20));
assert.throws(() => operatingPoint(NaN));
console.log('Passed: pressure lesson operating points, head balance, obstruction, static lift and input bounds.');
