
import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseToCartesian3 from "./parseToCartesian3.js";

/**
 * 把数组批量解析为三维笛卡尔坐标数组（{@link Cartesian3}）。
 * @param {Array} array 待解析的数组
 * @param {Array} [result=[]] 用于存储结果的数组
 * @param {number} [defaultValue] 缺省分量的默认值
 * @returns {Array} 解析后的三维笛卡尔坐标数组
 */
function parseToCartesian3Array(array, result = [], defaultValue) {
    Check.typeOf.array('array', array);

    for (let i = 0; i < array.length; i++) {
        result[i] = parseToCartesian3(array[i], result[i], defaultValue);
    }
    return result;
};

export default parseToCartesian3Array;
export { parseToCartesian3Array };
