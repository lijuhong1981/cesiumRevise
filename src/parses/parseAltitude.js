import parseNumber from '@lijuhong1981/jsmath/src/parseNumber.js';

/**
 * 把数字、字符串或含高度信息的数组/对象解析为高度值。
 * @param {number|string|Array|object} value 待解析的值，支持以第 2 个分量表示的数组或含 altitude/alt/height/Alt 字段的对象
 * @returns {number} 解析后的高度值，无法解析时返回 0
 */
function parseAltitude(value) {
    if (!value)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[2] !== undefined)
        return parseNumber(value[2]);
    else if (value.altitude !== undefined)
        return parseNumber(value.altitude);
    else if (value.alt !== undefined)
        return parseNumber(value.alt);
    else if (value.height !== undefined)
        return parseNumber(value.height);
    else if (value.Alt !== undefined)
        return parseNumber(value.Alt);
    // else if (value.z !== undefined)
    //     return value.z;
    else
        return 0;
}

export default parseAltitude;
export { parseAltitude, parseAltitude as parseHeight };