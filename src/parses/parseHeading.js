/**
 * 把数字、字符串或数组/对象解析为偏航角（heading）数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 0 个分量表示的数组或含 heading/yaw/z/Yaw 字段的对象
 * @returns {number} 解析后的偏航角，无法解析时返回 0
 */
function parseHeading(value) {
    if (value === undefined)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[0] !== undefined)
        return value[0];
    else if (value.heading !== undefined)
        return value.heading;
    else if (value.yaw !== undefined)
        return value.yaw;
    else if (value.z !== undefined)
        return value.z;
    else if (value.Yaw !== undefined)
        return value.Yaw;
    else
        return 0;
};

export default parseHeading;
export { parseHeading };