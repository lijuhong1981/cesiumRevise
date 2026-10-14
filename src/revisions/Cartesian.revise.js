import toFixed from "@lijuhong1981/jsmath/src/toFixed.js";
import { Cartesian2, Cartesian3, Cartesian4, Cartographic, Check, EllipsoidGeodesic } from "cesium";
import Geographic from "../additions/Geographic.js";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 Cartesian2 类，补充定点数转换等方法。
 * @class Cartesian2
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Cartesian2.html}
*/
/**
 * 扩展 Cesium 的 Cartesian3 类，补充与 Geographic、Cartographic 互转、地表距离、定点数转换等方法。
 * @class Cartesian3
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Cartesian3.html}
*/
/**
 * 扩展 Cesium 的 Cartesian4 类，补充定点数转换等方法。
 * @class Cartesian4
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Cartesian4.html}
*/

/**
 * 将Cartesian2实例转换为定点数（小数点后几位）
 * @param  {Cartesian2} cartesian Cartesian2实例
 * @param  {number} [decimalNumber] 小数位数，默认为2位
 * @param  {Cartesian2} [result] 输出结果的Cartesian2实例
 * @return {Cartesian2} 返回修改后的result实例或创建一个新的Cartesian2实例
 * @memberof Cartesian2
 * @static
 */
Cartesian2.toFixed = function (cartesian, decimalNumber, result = new Cartesian2()) {
    Check.defined('cartesian', cartesian);

    result.x = toFixed(cartesian.x, decimalNumber);
    result.y = toFixed(cartesian.y, decimalNumber);
    return result;
};

/**
 * 将当前Cartesian2实例转换为定点数（小数点后几位）
 * @memberof Cartesian2
 * @see Cartesian2.toFixed
*/
Cartesian2.prototype.toFixed = function (decimalNumber, result) {
    return Cartesian2.toFixed(this, decimalNumber, result ? result : this);
};

/**
 * 从Geographic实例生成Cartesian3实例
 * @param  {Geographic} geographic Geographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartesian3} [result] 输出结果的Cartesian3实例
 * @return {Cartesian3} 返回修改后的result实例或创建一个新的Cartesian3实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.fromGeographic = function (geographic, ellipsoid, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('geographic', geographic);
    //>>includeEnd('debug');

    return Cartesian3.fromDegrees(geographic.longitude, geographic.latitude, geographic.height, ellipsoid, result);
};

/**
 * 从Geographic实例数组生成Cartesian3实例数组
 * @param  {Array<Geographic>} geographics Geographic实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartesian3>} 返回修改后的result实例或创建一个新的Cartesian3数组实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.fromGeographicArray = function (geographics, ellipsoid, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array('geographics', geographics);
    //>>includeEnd('debug');

    for (let i = 0; i < geographics.length; i++) {
        result[i] = Cartesian3.fromGeographic(geographics[i], ellipsoid, result[i]);
    }
    return result;
};

/**
 * 将Cartesian3实例转换为Geographic实例
 * @param  {Cartesian3} cartesian Cartesian3实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.toGeographic = function (cartesian, ellipsoid, result) {
    return Geographic.fromCartesian(cartesian, ellipsoid, result);
};

/**
 * 将当前Cartesian3实例转换为Geographic实例
 * @memberof Cartesian3
 * @see Cartesian3.toGeographic
*/
Cartesian3.prototype.toGeographic = function (ellipsoid, result) {
    return Cartesian3.toGeographic(this, ellipsoid, result);
};

/**
 * Cartesian3实例数组转为Geographic实例数组
 * @param  {Array<Cartesian3>} cartesians Cartesian3实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Geographic>} 返回修改后的result实例或创建一个新的Geographic数组实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.toGeographicArray = function (cartesians, ellipsoid, result) {
    return Geographic.fromCartesianArray(cartesians, ellipsoid, result);
}

/**
 * 从Cartographic实例创建生成Cartesian3实例
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartesian3} [result] 输出结果的Cartesian3实例
 * @return {Cartesian3} 返回修改后的result实例或创建一个新的Cartesian3实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.fromCartographic = function (cartographic, ellipsoid, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('cartographic', cartographic);
    //>>includeEnd('debug');

    return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height, ellipsoid, result);
};

/**
 * 从Cartographic实例数组生成Cartesian3实例数组
 * @param  {Array<Cartographic>} cartographics Cartographic实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartesian3>} 返回修改后的result实例或创建一个新的Cartesian3数组实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.fromCartographicArray = function (cartographics, ellipsoid, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array('cartographics', cartographics);
    //>>includeEnd('debug');

    for (let i = 0; i < cartographics.length; i++) {
        result[i] = Cartesian3.fromCartographic(cartographics[i], ellipsoid, result[i]);
    }
    return result;
};

/**
 * 将Cartesian3实例转换为Cartographic实例
 * @param  {Cartesian3} cartesian Cartesian3实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.toCartographic = function (cartesian, ellipsoid, result) {
    return Cartographic.fromCartesian(cartesian, ellipsoid, result);
};

/**
 * 将当前Cartesian3实例转换为Cartographic实例
 * @memberof Cartesian3
 * @see Cartesian3.toCartographic
*/
Cartesian3.prototype.toCartographic = function (ellipsoid, result) {
    return Cartesian3.toCartographic(this, ellipsoid, result);
};

/**
 * Cartesian3实例数组转为Cartographic实例数组
 * @param  {Array<Cartesian3>} cartesians Cartesian3实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartographic>} 返回修改后的result实例或创建一个新的Cartographic数组实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.toCartographicArray = function (cartesians, ellipsoid, result) {
    return Cartographic.fromCartesianArray(cartesians, ellipsoid, result);
};

/**
 * 计算当前Cartesian3实例与另一个Cartesian3实例之间的直线距离
 * @memberof Cartesian3
 * @see Cartesian3.distance
*/
Cartesian3.prototype.distance = function (other) {
    return Cartesian3.distance(this, other);
};

/**
 * 计算两个Cartesian3实例间的地表距离（不考虑高度）
 * @param  {Cartesian3} left 第一个Cartesian3实例
 * @param  {Cartesian3} right 第二个Cartesian3实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @return {number} 返回两点间的地表距离（不考虑高度）
 * @memberof Cartesian3
 * @static
 */
Cartesian3.surfaceDistance = function (left, right, ellipsoid) {
    Check.defined("left", left);
    Check.defined("right", right);

    const start = Cartesian3.toCartographic(left, ellipsoid, Scratch.scratchLeftCartographic);
    const end = Cartesian3.toCartographic(right, ellipsoid, Scratch.scratchRightCartographic);

    return new EllipsoidGeodesic(start, end, ellipsoid).surfaceDistance;
};

/**
 * 计算当前Cartesian3实例与另一个Cartesian3实例之间的地表距离（不考虑高度）
 * @memberof Cartesian3
 * @see Cartesian3.surfaceDistance
*/
Cartesian3.prototype.surfaceDistance = function (other, ellipsoid) {
    return Cartesian3.surfaceDistance(this, other, ellipsoid);
};

/**
 * 将当前Cartesian3实例转换为数组
 * @param  {Array} [array] 输出结果的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @return {Array<number>} 返回修改后的array数组或创建一个新的数组
 * @memberof Cartesian3
*/
Cartesian3.prototype.toArray = function (array, startingIndex) {
    return Cartesian3.pack(this, array, startingIndex);
};

/**
 * 将当前Cartesian3实例标准化（单位化）
 * @memberof Cartesian3
 * @see Cartesian3.normalize
*/
Cartesian3.prototype.normalize = function (result) {
    return Cartesian3.normalize(this, result ? result : this);
};

/**
 * 将当前Cartesian3实例取反（乘以-1）
 * @memberof Cartesian3
 * @see Cartesian3.negate
*/
Cartesian3.prototype.negate = function (result) {
    return Cartesian3.negate(this, result ? result : this);
};

/**
 * 将Cartesian3实例转换为定点数（小数点后几位）
 * @param  {Cartesian3} cartesian Cartesian3实例
 * @param  {number} [decimalNumber] 小数位数，默认为2位
 * @param  {Cartesian3} [result] 输出结果的Cartesian3实例
 * @return {Cartesian3} 返回修改后的result实例或创建一个新的Cartesian3实例
 * @memberof Cartesian3
 * @static
 */
Cartesian3.toFixed = function (cartesian, decimalNumber, result = new Cartesian3()) {
    Check.defined('cartesian', cartesian);

    result.x = toFixed(cartesian.x, decimalNumber);
    result.y = toFixed(cartesian.y, decimalNumber);
    result.z = toFixed(cartesian.z, decimalNumber);
    return result;
};

/**
 * 将当前Cartesian3实例转换为定点数（小数点后几位）
 * @memberof Cartesian3
 * @see Cartesian3.toFixed
*/
Cartesian3.prototype.toFixed = function (decimalNumber, result) {
    return Cartesian3.toFixed(this, decimalNumber, result ? result : this);
};

/**
 * 将Cartesian4实例转换为定点数（小数点后几位）
 * @param  {Cartesian4} cartesian Cartesian4实例
 * @param  {number} [decimalNumber] 小数位数，默认为2位
 * @param  {Cartesian4} [result] 输出结果的Cartesian4实例
 * @return {Cartesian4} 返回修改后的result实例或创建一个新的Cartesian4实例
 * @memberof Cartesian4
 * @static
 */
Cartesian4.toFixed = function (cartesian, decimalNumber, result = new Cartesian4()) {
    Check.defined('cartesian', cartesian);

    result.x = toFixed(cartesian.x, decimalNumber);
    result.y = toFixed(cartesian.y, decimalNumber);
    result.z = toFixed(cartesian.z, decimalNumber);
    result.w = toFixed(cartesian.w, decimalNumber);
    return result;
};

/**
 * 将当前Cartesian4实例转换为定点数（小数点后几位）
 * @memberof Cartesian4
 * @see Cartesian4.toFixed
*/
Cartesian4.prototype.toFixed = function (decimalNumber, result) {
    return Cartesian4.toFixed(this, decimalNumber, result ? result : this);
};

export { Cartesian2, Cartesian3, Cartesian4 };