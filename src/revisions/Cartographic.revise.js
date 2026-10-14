import convertToLatitudeRange from "@lijuhong1981/jsmath/src/convertToLatitudeRange.js";
import convertToLongitudeRange from "@lijuhong1981/jsmath/src/convertToLongitudeRange.js";
import { Cartesian3, Cartographic, Check, EllipsoidGeodesic } from "cesium";
import Geographic from "../additions/Geographic.js";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 Cartographic 类，补充与 Geographic、Cartesian3 的互转、距离计算、
 * 沿地表方向移动、打包解包等方法。
 * @class Cartographic
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Cartographic.html}
*/

Object.defineProperties(Cartographic.prototype, {
    /**
     * 添加altitude属性，等同于height属性
     * @type {number}
     * @default 0.0
     * @memberof Cartographic
    */
    altitude: {
        set: function (value) {
            this.height = value;
        },
        get: function () {
            return this.height;
        }
    },
});

/**
 * 从Geographic实例生成Cartographic实例
 * @param  {Geographic} geographic [Geographic实例]
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartographic
 * @static
 */
Cartographic.fromGeographic = function (geographic, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('geographic', geographic);
    //>>includeEnd('debug');

    return Cartographic.fromDegrees(geographic.longitude, geographic.latitude, geographic.altitude, result);
};

/**
 * 从Geographic实例数组生成Cartographic实例数组
 * @param  {Array<Geographic>} geographics Geographic实例数组
 * @param  {Array} [result] 输出结果的Cartographic实例数组
 * @return {Array<Cartographic>} 返回修改后的result实例数组或创建一个新的Cartographic实例数组
 * @memberof Cartographic
 * @static
 */
Cartographic.fromGeographicArray = function (geographics, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array('geographics', geographics);
    //>>includeEnd('debug');

    for (let i = 0; i < geographics.length; i++) {
        result[i] = Cartographic.fromGeographic(geographics[i], result[i]);
    }
    return result;
};

/**
 * 将Cartographic实例转换为Geographic实例
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 * @memberof Cartographic
 * @static
 */
Cartographic.toGeographic = function (cartographic, result) {
    return Geographic.fromCartographic(cartographic, result);
};

/**
 * 将当前Cartographic实例转换为Geographic实例
 * @memberof Cartographic
 * @see Cartographic.toGeographic
*/
Cartographic.prototype.toGeographic = function (result) {
    return Cartographic.toGeographic(this, result);
};

/**
 * 将Cartographic实例数组转换为Geographic实例数组
 * @param  {Array<Cartographic>} cartographics Cartographic实例数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Geographic>} 返回修改后的result实例数组或创建一个新的Geographic实例数组
 * @memberof Cartographic
 * @static
 */
Cartographic.toGeographicArray = function (cartographics, result) {
    return Geographic.fromCartographicArray(cartographics, result);
};

/**
 * 从Cartesian3实例数组生成Cartographic实例数组
 * @param  {Array<Cartesian3>} cartesians Cartesian3实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体对象，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartographic>} 返回修改后的result实例数组或创建一个新的Cartographic实例数组
 * @memberof Cartographic
 * @static
 */
Cartographic.fromCartesianArray = function (cartesians, ellipsoid, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array('cartesians', cartesians);
    //>>includeEnd('debug');

    for (let i = 0; i < cartesians.length; i++) {
        result[i] = Cartographic.fromCartesian(cartesians[i], ellipsoid, result[i]);
    }
    return result;
};

/**
 * 将当前Cartographic实例转换为Cartesian3实例
 * @memberof Cartographic
 * @see Cartographic.toCartesian
*/
Cartographic.prototype.toCartesian = function (ellipsoid, result) {
    return Cartographic.toCartesian(this, ellipsoid, result);
};

/**
 * 将Cartographic实例数组转换为Cartesian3实例数组
 * @param  {Array<Cartographic>} cartographics Cartesian3实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体对象，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartesian3>} 返回修改后的result实例数组或创建一个新的Cartesian3实例数组
 * @memberof Cartographic
 * @static
 */
Cartographic.toCartesianArray = function (cartographics, ellipsoid, result) {
    return Cartesian3.fromCartographicArray(cartographics, ellipsoid, result);
};

/**
 * 计算两个Cartographic实例之间的直线距离
 * @param  {Cartographic} left 第一个Cartographic实例
 * @param  {Cartographic} right 第二个Cartographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @return {number} 两点之间的直线距离（单位：米）
 * @memberof Cartographic
 * @static
 */
Cartographic.distance = function (left, right, ellipsoid) {
    Check.defined("left", left);
    Check.defined("right", right);

    const leftCartesian = Cartographic.toCartesian(left, ellipsoid, Scratch.scratchLeftCartesian3);
    const rightCartesian = Cartographic.toCartesian(right, ellipsoid, Scratch.scratchRightCartesian3);

    return Cartesian3.distance(leftCartesian, rightCartesian);
};

/**
 * 计算当前Cartographic实例与另一个Cartographic实例之间的直线距离
 * @memberof Cartographic
 * @see Cartographic.distance
*/
Cartographic.prototype.distance = function (other, ellipsoid) {
    return Cartographic.distance(this, other, ellipsoid);
};

/**
 * 计算两个Cartographic实例之间的地表距离（不考虑高度）
 * @param  {Cartographic} left 第一个Cartographic实例
 * @param  {Cartographic} right 第二个Cartographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @return {number} 两点之间的地表距离（单位：米）
 * @memberof Cartographic
 * @static
*/
Cartographic.surfaceDistance = function (left, right, ellipsoid) {
    Check.defined("left", left);
    Check.defined("right", right);

    return new EllipsoidGeodesic(left, right, ellipsoid).surfaceDistance;
};

/**
 * 计算当前Cartographic实例与另一个Cartographic实例之间的地表距离（不考虑高度）
 * @memberof Cartographic
 * @see Cartographic.surfaceDistance
*/
Cartographic.prototype.surfaceDistance = function (other, ellipsoid) {
    return Cartographic.surfaceDistance(this, other, ellipsoid);
};

/**
 * Cartographic实例沿地表向正北方向移动一定距离（不考虑高度）
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartographic
 * @static
*/
Cartographic.moveToNorth = function (cartographic, distance, ellipsoid, result) {
    Check.defined('cartographic', cartographic);
    Check.typeOf.number('distance', distance);

    const endCar = Cartographic.fromRadians(cartographic.longitude, convertToLatitudeRange(cartographic.latitude + 0.0001, false), cartographic.height, Scratch.scratchEndCartographic);
    const geodesic = new EllipsoidGeodesic(cartographic, endCar, ellipsoid);
    result = geodesic.interpolateUsingSurfaceDistance(distance, result);
    result.height = cartographic.height;
    return result;
};

/**
 * 当前Cartographic实例沿地表向正北方向移动一定距离（不考虑高度）
 * @memberof Cartographic
 * @see Cartographic.moveToNorth
*/
Cartographic.prototype.moveToNorth = function (distance, ellipsoid, result) {
    return Cartographic.moveToNorth(this, distance, ellipsoid, result ? result : this);
};

/**
 * Cartographic实例沿地表向正南方向移动一定距离（不考虑高度）
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartographic
 * @static
*/
Cartographic.moveToSouth = function (cartographic, distance, ellipsoid, result) {
    Check.defined('cartographic', cartographic);
    Check.typeOf.number('distance', distance);

    const endCar = Cartographic.fromRadians(cartographic.longitude, convertToLatitudeRange(cartographic.latitude - 0.0001, false), cartographic.height, Scratch.scratchEndCartographic);
    const geodesic = new EllipsoidGeodesic(cartographic, endCar, ellipsoid);
    result = geodesic.interpolateUsingSurfaceDistance(distance, result);
    result.height = cartographic.height;
    return result;
};

/**
 * 当前Cartographic实例沿地表向正南方向移动一定距离（不考虑高度）
 * @memberof Cartographic
 * @see Cartographic.moveToSouth
*/
Cartographic.prototype.moveToSouth = function (distance, ellipsoid, result) {
    return Cartographic.moveToSouth(this, distance, ellipsoid, result ? result : this);
};

/**
 * Cartographic实例沿地表向正东方向移动一定距离（不考虑高度）
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartographic
 * @static
*/
Cartographic.moveToEast = function (cartographic, distance, ellipsoid, result) {
    Check.defined('cartographic', cartographic);
    Check.typeOf.number('distance', distance);

    const endCar = Cartographic.fromRadians(convertToLongitudeRange(cartographic.longitude + 0.0001, false), cartographic.latitude, cartographic.height, Scratch.scratchEndCartographic);
    const geodesic = new EllipsoidGeodesic(cartographic, endCar, ellipsoid);
    result = geodesic.interpolateUsingSurfaceDistance(distance, result);
    result.height = cartographic.height;
    return result;
};

/**
 * 当前Cartographic实例沿地表向正东方向移动一定距离（不考虑高度）
 * @memberof Cartographic
 * @see Cartographic.moveToEast
*/
Cartographic.prototype.moveToEast = function (distance, ellipsoid, result) {
    return Cartographic.moveToEast(this, distance, ellipsoid, result ? result : this);
};

/**
 * Cartographic实例沿地表向正西方向移动一定距离（不考虑高度）
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartographic
 * @static
*/
Cartographic.moveToWest = function (cartographic, distance, ellipsoid, result) {
    Check.defined('cartographic', cartographic);
    Check.typeOf.number('distance', distance);

    const endCar = Cartographic.fromRadians(convertToLongitudeRange(cartographic.longitude - 0.0001, false), cartographic.latitude, cartographic.height, Scratch.scratchEndCartographic);
    const geodesic = new EllipsoidGeodesic(cartographic, endCar, ellipsoid);
    result = geodesic.interpolateUsingSurfaceDistance(distance, result);
    result.height = cartographic.height;
    return result;
};

/**
 * 当前Cartographic实例沿地表向正西方向移动一定距离（不考虑高度）
 * @memberof Cartographic
 * @see Cartographic.moveToWest
*/
Cartographic.prototype.moveToWest = function (distance, ellipsoid, result) {
    return Cartographic.moveToWest(this, distance, ellipsoid, result ? result : this);
};

/**
 * The number of elements used to pack the object into an array.
 * @type {number}
 * @constant
 * @memberof Cartographic
*/
Cartographic.packedLength = 3;

/**
 * 将Cartographic实例打包到数组中
 * @param  {Cartographic} value Cartographic实例
 * @param  {Array} [array] 输出结果的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @return {Array} 返回修改后的array数组或创建一个新的数组
 * @memberof Cartographic
 * @static
*/
Cartographic.pack = function (value, array = [], startingIndex = 0) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("value", value);
    //>>includeEnd('debug');

    array[startingIndex++] = value.longitude;
    array[startingIndex++] = value.latitude;
    array[startingIndex] = value.height;

    return array;
};

/**
 * 将数组解包为Cartographic实例
 * @param  {Array} array 输入的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 * @memberof Cartographic
 * @static
*/
Cartographic.unpack = function (array, startingIndex = 0, result = new Cartographic()) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("array", array);
    //>>includeEnd('debug');

    result.longitude = array[startingIndex++];
    result.latitude = array[startingIndex++];
    result.height = array[startingIndex];
    return result;
};

/**
 * 将Cartographic实例数组打包到数组中
 * @param  {Array<Cartographic>} cartographics Cartographic实例数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<number>} 返回修改后的result数组或创建一个新的数组
 * @memberof Cartographic
 * @static
*/
Cartographic.packArray = function (cartographics, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("cartographics", cartographics);
    //>>includeEnd('debug');        

    let startingIndex = 0;
    for (let i = 0; i < cartographics.length; i++) {
        Cartographic.pack(cartographics[i], result, startingIndex);
        startingIndex += Cartographic.packedLength;
    }
    return result;
};

/**
 * 将数组解包为Cartographic实例数组
 * @param  {Array} array 输入的数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartographic>} 返回修改后的result数组或创建一个新的数组
 * @memberof Cartographic
 * @static
*/
Cartographic.unpackArray = function (array, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    result.length = array.length / Cartographic.packedLength;

    let startingIndex = 0;
    for (let i = 0; i < result.length; i++) {
        result[i] = Cartographic.unpack(array, startingIndex);
        startingIndex += Cartographic.packedLength;
    }
    return result;
};

/**
 * 从数组生成Cartographic实例
 * @memberof Cartographic
 * @see Cartographic.unpack
*/
Cartographic.fromArray = Cartographic.unpack;

/**
 * 将当前Cartographic实例转换为数组
 * @param  {Array} [array] 输出结果的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @return {Array<number>} 返回修改后的array数组或创建一个新的数组
 * @memberof Cartographic
*/
Cartographic.prototype.toArray = function (result, startingIndex) {
    return Cartographic.unpack(this, result, startingIndex);
};

/**
 * 将Cartographic实例数组打包到二维数组中
 * @param  {Array<Cartographic>} cartographics Cartographic实例数组
 * @param  {Array<number>} [result] 输出结果的二维数组
 * @return {Array<number>} 返回修改后的result数组或创建一个新的数组
 * @memberof Cartographic
 * @static
*/
Cartographic.pack2DArray = function (cartographics, result = []) {
    Check.typeOf.array('cartographics', cartographics);

    for (let i = 0; i < cartographics.length; i++) {
        result[i] = Cartographic.pack(cartographics[i], result[i]);
    }
    return result;
};

export default Cartographic;
export { Cartographic };
