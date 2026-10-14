import { DeveloperError, HorizontalOrigin } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link HorizontalOrigin} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'left'、'right'、'center'
 * @returns {HorizontalOrigin} 解析后的 HorizontalOrigin
 */
function parseHorizontalOrigin(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'left':
                return HorizontalOrigin.LEFT;
            case 'right':
                return HorizontalOrigin.RIGHT;
            case 'center':
            default:
                return HorizontalOrigin.CENTER;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to HorizontalOrigin.');
};

export default parseHorizontalOrigin;
export { parseHorizontalOrigin };
