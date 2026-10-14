import { ColorBlendMode, DeveloperError } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link ColorBlendMode} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'replace'、'mix'、'highlight'
 * @returns {ColorBlendMode} 解析后的 ColorBlendMode
 */
function parseColorBlendMode(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'replace':
                return ColorBlendMode.REPLACE;
            case 'mix':
                return ColorBlendMode.MIX;
            case 'highlight':
            default:
                return ColorBlendMode.HIGHLIGHT;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to ColorBlendMode.');
};

export default parseColorBlendMode;
export { parseColorBlendMode };
