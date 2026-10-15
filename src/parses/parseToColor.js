import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian3, Cartesian4, Color, DeveloperError } from "cesium";

/**
 * 把字符串、数字、笛卡尔坐标或数组解析为颜色（{@link Color}）。
 * @param {Color|string|number|Cartesian3|Cartesian4|Array} value 待解析的值，字符串按 CSS 颜色、数字按 RGBA 解析
 * @param {Color} [result] 用于存储结果的可选对象
 * @returns {Color} 解析后的颜色
 */
function parseToColor(value, result) {
    Check.defined('value', value);
    if (value instanceof Color) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (typeof value === 'string') {
        return Color.fromCssColorString(value, result);
    } else if (typeof value === 'number') {
        return Color.fromRgba(value, result);
    } else if (value instanceof Cartesian3) {
        return Color.fromCartesian3(value, result);
    } else if (value instanceof Cartesian4) {
        return Color.fromCartesian4(value, result);
    } else if (Array.isArray(value)) {
        return Color.unpack(value, 0, result);
    } else {
        console.error('unsupported color value:', value);
        throw new DeveloperError('unsupported color value:' + value);
    }
};

export default parseToColor;
export { parseToColor };
