import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseNumber from '@lijuhong1981/jsmath/src/parseNumber.js';

/**
 * 把数字、字符串或数组/对象解析为纬度数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 1 个分量表示的数组或含 latitude/lat/Lat 字段的对象
 * @returns {number} 解析后的纬度值
 */
function parseLatitude(value) {
    Check.defined('value', value);
    if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[1] !== undefined)
        return parseNumber(value[1]);
    else if (value.latitude !== undefined)
        return parseNumber(value.latitude);
    else if (value.lat !== undefined)
        return parseNumber(value.lat);
    else if (value.Lat !== undefined)
        return parseNumber(value.Lat);
    // else if (value.y !== undefined)
    //     return value.y;
}

export default parseLatitude;
export { parseLatitude };