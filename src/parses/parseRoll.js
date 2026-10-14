/**
 * 把数字、字符串或数组/对象解析为翻滚角（roll）数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 2 个分量表示的数组或含 roll/x/Roll 字段的对象
 * @returns {number} 解析后的翻滚角，无法解析时返回 0
 */
function parseRoll(value) {
    if (value === undefined)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[2] !== undefined)
        return value[2];
    else if (value.roll !== undefined)
        return value.roll;
    else if (value.x !== undefined)
        return value.x;
    else if (value.Roll !== undefined)
        return value.Roll;
    else
        return 0;
};

export default parseRoll;
export { parseRoll };