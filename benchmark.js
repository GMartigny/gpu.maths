import { sum, max } from "./gpu.maths";

function closeEnough (v1, v2) {
    return Math.abs(v1 - v2) < 1e-5;
}

const nbItems = 1e5;
const inputs = [...new Array(nbItems)].map(() => Math.random());
console.log(`Finish create ${nbItems} items.`);


/* SUM */
console.time("Sum");
const sum1 = sum(inputs);
console.timeEnd("Sum");

console.time("Native sum");
const sum2 = inputs.reduce((acc, val) => acc + val, 0);
console.timeEnd("Native sum");

console.assert(closeEnough(sum1, sum2), `Sum results aren't similar. Diff: ${Math.abs(sum1 - sum2)}`);


/* MAX */
console.time("Max");
const max1 = max(inputs);
console.timeEnd("Max");

console.time("Native max");
const max2 = Math.max(...inputs);
console.timeEnd("Native max");

console.assert(closeEnough(max1, max2), `Max results aren't similar. Diff: ${Math.abs(max1 - max2)}`);
