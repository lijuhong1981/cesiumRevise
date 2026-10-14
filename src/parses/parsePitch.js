/**
 * 把数字、字符串或数组/对象解析为俯仰角（pitch）数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 1 个分量表示的数组或含 pitch/y/Pitch 字段的对象
 * @returns {number} 解析后的俯仰角，无法解析时返回 0
 */
function parsePitch(value) {
    if (value === undefined)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[1] !== undefined)
        return value[1];
    else if (value.pitch !== undefined)
        return value.pitch;
    else if (value.y !== undefined)
        return value.y;
    else if (value.Pitch !== undefined)
        return value.Pitch;
    else
        return 0;
};

export default parsePitch;
export { parsePitch };