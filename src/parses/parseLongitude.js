import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseNumber from '@lijuhong1981/jsmath/src/parseNumber.js';

/**
 * 把数字、字符串或数组/对象解析为经度数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 0 个分量表示的数组或含 longitude/lng/Lon 字段的对象
 * @returns {number} 解析后的经度值
 */
function parseLongitude(value) {
    Check.defined('value', value);
    if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[0] !== undefined)
        return parseNumber(value[0]);
    else if (value.longitude !== undefined)
        return parseNumber(value.longitude);
    else if (value.lng !== undefined)
        return parseNumber(value.lng);
    else if (value.Lon !== undefined)
        return parseNumber(value.Lon);
    // else if (value.x !== undefined)
    //     return value.x;
}

export default parseLongitude;
export { parseLongitude };
