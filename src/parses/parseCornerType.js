import { CornerType, DeveloperError } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link CornerType} 枚举值。
 * @param {string|number} value 待解析的值，字符串包含 'bevel' 返回 BEVELED、包含 'miter' 返回 MITERED
 * @returns {CornerType} 解析后的 CornerType
 */
function parseCornerType(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value.match('bevel'))
            return CornerType.BEVELED;
        else if (value.match('miter'))
            return CornerType.MITERED;
        else
            return CornerType.ROUNDED;
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to CornerType.');
};

export default parseCornerType;
export { parseCornerType };
