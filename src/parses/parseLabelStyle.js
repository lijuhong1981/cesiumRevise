import { DeveloperError, LabelStyle } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link LabelStyle} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'outline'、'fill_and_outline'、'fill'
 * @returns {LabelStyle} 解析后的 LabelStyle
 */
function parseLabelStyle(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'outline':
                return LabelStyle.OUTLINE;
            case 'fill_and_outline':
                return LabelStyle.FILL_AND_OUTLINE;
            case 'fill':
            default:
                return LabelStyle.FILL;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to LabelStyle.');
};

export default parseLabelStyle;
export { parseLabelStyle };
