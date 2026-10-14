import { DeveloperError, VerticalOrigin } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link VerticalOrigin} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'top'、'bottom'、'baseline'、'center'
 * @returns {VerticalOrigin} 解析后的 VerticalOrigin
 */
function parseVerticalOrigin(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'top':
                return VerticalOrigin.TOP;
            case 'bottom':
                return VerticalOrigin.BOTTOM;
            case 'baseline':
                return VerticalOrigin.BASELINE;
            case 'center':
            default:
                return VerticalOrigin.CENTER;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to VerticalOrigin.');
};

export default parseVerticalOrigin;
export { parseVerticalOrigin };
