import { GPU } from "gpu.js";

// Shared GPU instance
const gpu = new GPU();

/**
 * Sum all numbers
 * @param {Array<Number>} numbers - List of items
 * @return {Number}
 */
export const sum = (() => {
    // Create "private" kernel
    const kernel = gpu.createKernel(
        function (values) {
            const size = this.constants.size;
            let sum = 0;
            for (var i = 0; i < size; ++i) {
                sum += values[i];
            }
            return sum;
        }
    ).setOutput([1]);

    return (numbers) => {
        // Dynamically set constants ¯\_(ツ)_/¯
        kernel.constants = {};
        kernel.constants.size = numbers.length;

        return kernel(numbers)[0];
    };
})();

/**
 * Find the largest number
 * @param {Array<Number>} numbers - List of items
 * @return {Number}
 */
export const max = (() => {
    // Create "private" kernel
    const kernel = gpu.createKernel(
        function (values) {
            const size = this.constants.size;
            let max = values[0];
            for (let i = 1; i < size; ++i) {
                if (max < values[i]) {
                    max = values[i];
                }
            }
            return max;
        }
    ).setOutput([1]);

    return (numbers) => {
        // Dynamically set constants ¯\_(ツ)_/¯
        kernel.constants = {};
        kernel.constants.size = numbers.length;

        return kernel(numbers)[0];
    }
})();

export const matrix = {
    /**
     * Multiply two matrices
     * @param {Array<Array<Number>>} matrix1 - Two dimension array with size n.p
     * @param {Array<Array<Number>>} matrix2 - Two dimension array with size p.m
     * @return {Array<Array<Number>>}
     */
    mult: (() => {
        // Create "private" kernel
        const kernel = gpu.createKernel(
            function (m1, m2) {
                var sum = 0;
                for (let i = 0; i < this.constants.size; ++i) {
                    sum += m1[this.thread.y][i] * m2[i][this.thread.x];
                }
                return sum;
            }
        );

        return (matrix1, matrix2) => {
            if (matrix2.length !== matrix1[0].length) {
                throw new RangeError("Both matrix should have a common size.");
            }

            // Dynamically set constants ¯\_(ツ)_/¯ and outputs size
            kernel.setOutput([matrix1.length, matrix2[0].length]);
            kernel.constants = {};
            kernel.constants.size = matrix2.length;

            return kernel(matrix1, matrix2);
        };
    })(),
};
