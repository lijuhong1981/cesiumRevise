import { ClassificationType, DeveloperError } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link ClassificationType} 枚举值。
 * @param {string|number} value 待解析的值，字符串包含 'terrain' 返回 TERRAIN、包含 '3dtile' 返回 CESIUM_3D_TILE
 * @returns {ClassificationType} 解析后的 ClassificationType
 */
function parseClassificationType(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value.match('terrain'))
            return ClassificationType.TERRAIN;
        else if (value.match('3dtile'))
            return ClassificationType.CESIUM_3D_TILE;
        else
            return ClassificationType.BOTH;
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to ClassificationType.');
};

export default parseClassificationType;
export { parseClassificationType };
