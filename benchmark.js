import { sum, max, matrix } from "./gpu.maths";

function closeEnough (v1, v2) {
    return Math.abs(v1 - v2) < 1e-5;
}

const nbItems = 1e5;
const inputs = [...new Array(nbItems)].map(() => Math.random());

{ /* SUM */
    console.time("Sum");
    const sum1 = sum(inputs);
    console.timeEnd("Sum");

    console.time("Native sum");
    const sum2 = inputs.reduce((acc, val) => acc + val, 0);
    console.timeEnd("Native sum");

    console.assert(closeEnough(sum1, sum2), `Sum results aren't similar. Diff: ${Math.abs(sum1 - sum2)}`);
    console.log();
}

{ /* MAX */
    console.time("Max");
    const max1 = max(inputs);
    console.timeEnd("Max");

    console.time("Native max");
    const max2 = Math.max(...inputs);
    console.timeEnd("Native max");

    console.assert(closeEnough(max1, max2), `Max results aren't similar. Diff: ${Math.abs(max1 - max2)}`);
    console.log();
}

const size1 = [1e2, 1e3];
const size2 = [size1[1], 2e2];
const m1 = [...new Array(size1[0])].map(() => [...new Array(size1[1])].map(() => Math.random()));
const m2 = [...new Array(size2[0])].map(() => [...new Array(size2[1])].map(() => Math.random()));

{ /* MATRIX MULT */
    console.time("Matrix mult");
    const mult1 = matrix.mult(m1, m2);
    console.timeEnd("Matrix mult");

    console.time("Native matrix mult");
    const mult2 = [];
    const height = m1.length;
    const width = m2[0].length;
    const depth = m2.length;
    for (let i = 0; i < height; ++i) {
        for (let j = 0; j < width; ++j) {
            let sum = 0;
            for (let n = 0; n < depth; ++n) {
                sum += m1[i][n] * m2[n][j];
            }
            if (!mult2[i]) mult2[i] = [];
            mult2[i][j] = sum;
        }
    }
    console.timeEnd("Native matrix mult");

    let ok = true;
    let i = 0;
    while (i < width * height && ok) {
        const x = Math.floor(i / width);
        const y = i % width;
        ok = closeEnough(mult1[y][x], mult2[y][x]);
        ++i;
    }
    console.assert(ok, "Matrix multiplication results aren't similar.");
    console.log();
}
