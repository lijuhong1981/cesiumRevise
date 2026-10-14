import { HeightReference } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link HeightReference} 枚举值。
 * @param {string|number} value 待解析的值，字符串包含 'clamp' 返回 CLAMP_TO_GROUND、包含 'relative' 返回 RELATIVE_TO_GROUND
 * @returns {HeightReference} 解析后的 HeightReference，无法识别时返回 HeightReference.NONE
 */
function parseHeightReference(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value.match('clamp'))
            return HeightReference.CLAMP_TO_GROUND;
        else if (value.match('relative'))
            return HeightReference.RELATIVE_TO_GROUND;
        else
            return HeightReference.NONE;
    } else if (typeof value === 'number')
        return value;
    else
        return HeightReference.NONE;
};

export default parseHeightReference;
export { parseHeightReference };
