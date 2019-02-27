import { GPU } from "gpu.js";

const gpu = new GPU();

/**
 * Sum all numbers
 * @param {Array<Number>} numbers - List of items
 * @return {Number}
 */
export const sum = (() => {
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
        kernel.constants = {};
        kernel.constants.size = numbers.length;
        return kernel(numbers)[0];
    }
})();
