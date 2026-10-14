import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import { Check, defined, DeveloperError, Rectangle } from "cesium";

/**
 * 把数组或对象解析为矩形（{@link Rectangle}）。
 * @param {Rectangle|Array|object} value 待解析的值，支持 [west,south,east,north] 数组或含 west/south/east/north 字段的对象
 * @param {Rectangle} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees=true] 输入是否为角度制，为 true 时按角度解析
 * @returns {Rectangle} 解析后的矩形
 */
function parseToRectangle(value, result, isDegrees = true) {
    Check.defined('value', value);
    if (value instanceof Rectangle) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    }
    const west = getValidValue(value[0], value.west);
    const south = getValidValue(value[1], value.south);
    const east = getValidValue(value[2], value.east);
    const north = getValidValue(value[3], value.north);
    if (!defined(west) || !defined(south) || !defined(east) || !defined(north))
        throw new DeveloperError('the west or south or east or north is undefined.');
    if (isDegrees)
        return Rectangle.fromDegrees(west, south, east, north, result);
    else
        return Rectangle.fromRadians(west, south, east, north, result);
}

export default parseToRectangle;
export { parseToRectangle };
