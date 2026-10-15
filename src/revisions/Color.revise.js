import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian3, Cartesian4, Color, defined, DeveloperError } from "cesium";

/**
 * 扩展 Cesium 的 Color 类，补充 rgb 复制比较、与 Byte 数组的打包解包、
 * CSS 字符串转换、与 Cartesian 互转等方法。
 * @class Color
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Color.html}
*/

/**
 * 复制一个 Color 的 rgb 分量（不包含 alpha）。
 *
 * @param {Color} color 待复制的 Color 对象。
 * @param {Color} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Color} 修改后的 result 或新建的实例；若 color 未定义则返回 undefined。
 * @memberof Color
 * @static
 */
Color.cloneRgb = function (color, result) {
    if (!defined(color)) {
        return undefined;
    }
    if (!defined(result)) {
        return new Color(color.red, color.green, color.blue);
    }
    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    return result;
};

/**
 * 判断两个 Color 的 rgb 分量是否相等。
 *
 * @param {Color} [left] 待比较的第一个 Color 对象。
 * @param {Color} [right] 待比较的第二个 Color 对象。
 * @returns {boolean} 两个 Color 的 rgb 相等返回 <code>true</code>，否则返回 <code>false</code>。
 * @memberof Color
 * @static
 */
Color.equalsRgb = function (left, right) {
    return (
        left === right || //
        (defined(left) && //
            defined(right) && //
            left.red === right.red && //
            left.green === right.green && //
            left.blue === right.blue)
    );
};

/**
 * 复制当前 Color 的 rgb 分量（不包含 alpha）。
 *
 * @param {Color} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Color} 修改后的 result 或新建的实例。
 * @memberof Color
 */
Color.prototype.cloneRgb = function (result) {
    return Color.cloneRgb(this, result);
};

/**
 * 判断当前 Color 的 rgb 分量是否与 other 相等。
 *
 * @param {Color} [other] 待比较的 Color 对象。
 * @returns {boolean} 两个 Color 的 rgb 相等返回 <code>true</code>，否则返回 <code>false</code>。
 * @memberof Color
 */
Color.prototype.equalsRgb = function (other) {
    return Color.equalsRgb(this, other);
};

/**
 * 将一个Color对象属性转换为Byte，并打包入一个数组中。
 * @param {Color} color Color对象
 * @param {Array} [array] 存放结果的数组，如果未指定则创建一个新的数组
 * @param {number} [startingIndex=0] 开始存放的位置，默认为0
 * @returns {Array<number>} 返回存放结果的数组
 * @memberof Color
 * @static
 */
Color.packToBytes = function (color, array = [], startingIndex = 0) {
    Check.typeOf.object("color", color);

    array[startingIndex] = Color.floatToByte(color.red);
    array[startingIndex + 1] = Color.floatToByte(color.green);
    array[startingIndex + 2] = Color.floatToByte(color.blue);
    array[startingIndex + 3] = Color.floatToByte(color.alpha);

    return array;
};

/**
 * 将一个Color对象数组属性转换为Byte，并打包入一个数组中。
 * @param {Array<Color>} array Color对象数组
 * @param {Array} [result] 存放结果的数组，如果未指定则创建一个新的数组
 * @returns {Array<number>} 返回存放结果的数组
 * @memberof Color
 * @static
 */
Color.packArrayToBytes = function (array, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    const length = array.length;
    const resultLength = length * 4;
    if (!defined(result)) {
        result = new Array(resultLength);
    } else if (!Array.isArray(result) && result.length !== resultLength) {
        throw new DeveloperError(
            "If result is a typed array, it must have exactly array.length * 4 elements"
        );
    } else if (result.length !== resultLength) {
        result.length = resultLength;
    }

    for (let i = 0; i < length; ++i) {
        Color.packToBytes(array[i], result, i * 4);
    }
    return result;
};

/**
 * 从一个Byte数组中解包出Color对象。
 * @param {Array<number>} array 存放Color属性的Byte数组
 * @param {number} [startingIndex=0] 开始读取的位置，默认为0
 * @param {Color} [result] 存放结果的Color对象，如果未指定则创建一个新的Color对象
 * @returns {Color} 返回存放结果的Color对象
 * @memberof Color
 * @static
 */
Color.unpackFromBytes = function (array, startingIndex = 0, result) {
    Check.defined("array", array);

    return Color.fromBytes(array[startingIndex], array[startingIndex + 1], array[startingIndex + 2], array[startingIndex + 3], result);;
};

/**
 * 从一个Byte数组中解包出Color对象数组。
 * @param {Array<number>} array 存放Color属性的Byte数组
 * @param {Array<Color>} [result] 存放结果的Color对象数组，如果未指定则创建一个新的Color对象数组
 * @returns {Array<Color>} 返回存放结果的Color对象数组
 * @memberof Color
 * @static
 */
Color.unpackArrayFromBytes = function (array, result) {
    Check.defined("array", array);

    if (array.length % 4 !== 0) {
        throw new DeveloperError("array length must be a multiple of 4.");
    }
    //>>includeEnd('debug');

    var length = array.length;
    if (!defined(result)) {
        result = new Array(length / 4);
    } else {
        result.length = length / 4;
    }

    for (var i = 0; i < length; i += 4) {
        var index = i / 4;
        result[index] = Color.unpackFromBytes(array, i, result[index]);
    }
    return result;
};

/**
 * 从数组生成Color对象，等同于 Color.unpack。
 * @memberof Color
 * @static
 * @see Color.unpack
*/
Color.fromArray = Color.unpack;

/**
 * 从Byte数组生成Color对象，等同于 Color.unpackFromBytes。
 * @memberof Color
 * @static
 * @see Color.unpackFromBytes
*/
Color.fromBytesArray = Color.unpackFromBytes;

/**
 * 从CSS颜色字符串创建一个Color对象。
 * @param {string} color CSS颜色字符串
 * @param {number} [alpha] 透明度，如果指定则覆盖CSS颜色字符串中的透明度
 * @param {Color} [result] 存放结果的Color对象，如果未指定则创建一个新的Color对象
 * @returns {Color} 返回存放结果的Color对象
 * @memberof Color
 * @static
 */
Color.fromCssColorWithAlpha = function (color, alpha, result) {
    result = Color.fromCssColorString(color, result);
    if (defined(alpha))
        result.alpha = alpha;
    return result;
};

/**
 * 将当前Color对象转换为CSS rgb颜色字符串。
 * @return {string} CSS rgb颜色字符串，例如"rgb(255,0,0)"
 * @memberof Color
*/
Color.prototype.toCssRgbString = function () {
    const red = Color.floatToByte(this.red);
    const green = Color.floatToByte(this.green);
    const blue = Color.floatToByte(this.blue);
    return `rgb(${red},${green},${blue})`;
};

/**
 * 将当前Color对象转换为CSS rgba颜色字符串。
 * @return {string} CSS rgba颜色字符串，例如"rgba(255,0,0,0.5)"
 * @memberof Color
*/
Color.prototype.toCssRgbaString = function () {
    const red = Color.floatToByte(this.red);
    const green = Color.floatToByte(this.green);
    const blue = Color.floatToByte(this.blue);
    return `rgba(${red},${green},${blue},${this.alpha})`;
};

/**
 * 从Cartesian3对象创建一个Color对象。
 * @param {Cartesian3} cartesian 输入的Cartesian3对象
 * @param {Color} [result] 存放结果的Color对象，如果未指定则创建一个新的Color对象
 * @returns {Color} 返回存放结果的Color对象
 * @memberof Color
 * @static
 */
Color.fromCartesian3 = function (cartesian, result = new Color()) {
    Check.typeOf.object('cartesian', cartesian);

    result.red = cartesian.x;
    result.green = cartesian.y;
    result.blue = cartesian.z;
    return result;
};

/**
 * 将当前Color对象转换为Cartesian3对象。
 * @param {Cartesian3} [result] 存放结果的Cartesian3对象，如果未指定则创建一个新的Cartesian3对象
 * @returns {Cartesian3} 返回存放结果的Cartesian3对象
 * @memberof Color
*/
Color.prototype.toCartesian3 = function (result = new Cartesian3()) {
    result.x = this.red;
    result.y = this.green;
    result.z = this.blue;
    return result;
};

/**
 * 将当前Color对象转换为Cartesian4对象。
 * @param {Cartesian4} [result] 存放结果的Cartesian4对象，如果未指定则创建一个新的Cartesian4对象
 * @returns {Cartesian4} 返回存放结果的Cartesian4对象
 * @memberof Color
*/
Color.prototype.toCartesian4 = function (result = new Cartesian4()) {
    result.x = this.red;
    result.y = this.green;
    result.z = this.blue;
    result.w = this.alpha;
    return result;
};

export default Color;
export { Color };