import { ArcType } from 'cesium';

/**
 * 把字符串或数字解析为 Cesium 的 {@link ArcType} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'rhumb'、'geodesic'、'none'
 * @returns {ArcType} 解析后的 ArcType，无法识别时返回 ArcType.NONE
 */
function parseArcType(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'rhumb':
                return ArcType.RHUMB;
            case 'geodesic':
                return ArcType.GEODESIC;
            case 'none':
            default:
                return ArcType.NONE;
        }
    } else if (typeof value === 'number')
        return value;
    else
        return ArcType.NONE;
};

export default parseArcType;
export { parseArcType };