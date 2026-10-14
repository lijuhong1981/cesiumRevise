import { Cartesian3, Cartographic, Math as CesiumMath, Check, defined, EllipsoidGeodesic } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 因Cesium的Cartographic对象保存的经纬度值是Radius，而不是常用的Degrees，使用起来并不方便，
 * 所以自定义了一个Geographic对象用来保存Degrees值的经纬度。
 * 同时添加了Geographic、Cartographic、Cartesian3三种对象之间的相互转换方法。
 * 
 * @param {number} [longitude = 0] [经度] The longitude, in degrees.
 * @param {number} [latitude = 0] [纬度] The latitude, in degrees.
 * @param {number} [altitude = 0] [高度] The altitude, in meters, above the ellipsoid.
 */
function Geographic(longitude = 0, latitude = 0, altitude = 0) {

    /**
     * The longitude, in degrees.
     * @type {number}
     * @default 0.0
     */
    this.longitude = longitude;

    /**
     * The latitude, in degrees.
     * @type {number}
     * @default 0.0
     */
    this.latitude = latitude;

    /**
     * The altitude, in meters, above the ellipsoid.
     * @type {number}
     * @default 0.0
     */
    this.altitude = altitude;

};

Object.defineProperties(Geographic.prototype, {
    /**
     * height属性，等同于altitude属性
     * @type {number}
     * @default 0.0
     */
    height: {
        set: function (value) {
            this.altitude = value;
        },
        get: function () {
            return this.altitude;
        }
    }
});

/**
 * 从Degrees经纬度生成Geographic实例
 * @param  {number} longitude [经度] The longitude, in degrees.
 * @param  {number} latitude [纬度] The latitude, in degrees.
 * @param  {number} [altitude = 0] [高度] The altitude, in meters, above the ellipsoid.
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.fromDegrees = function (longitude, latitude, altitude = 0, result = new Geographic()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.number('longitude', longitude);
    Check.typeOf.number('latitude', latitude);
    //>>includeEnd('debug');

    result.longitude = longitude;
    result.latitude = latitude;
    result.altitude = altitude;
    return result;
};

/**
 * 从Radius经纬度生成Geographic实例
 * @param  {number} longitude [经度] The longitude, in radius.
 * @param  {number} latitude [纬度] The latitude, in radius.
 * @param  {number} height [高度] The height, in meters, above the ellipsoid.
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.fromRadians = function (longitude, latitude, height, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.number('longitude', longitude);
    Check.typeOf.number('latitude', latitude);
    //>>includeEnd('debug');
    longitude = CesiumMath.toDegrees(longitude);
    latitude = CesiumMath.toDegrees(latitude);

    return Geographic.fromDegrees(longitude, latitude, height, result);
};

/**
 * 从Cartographic实例生成Geographic实例
 * @param  {Cartographic} cartographic Cartographic实例
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.fromCartographic = function (cartographic, result = new Geographic()) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('cartographic', cartographic);
    //>>includeEnd('debug');

    result.longitude = CesiumMath.toDegrees(cartographic.longitude);
    result.latitude = CesiumMath.toDegrees(cartographic.latitude);
    result.height = cartographic.height;
    return result;
};

/**
 * 从Cartographic实例数组生成Geographic实例数组
 * @param  {Array<Cartographic>} cartographics Cartographic实例数组
 * @param  {Array} [result] 输出结果的Geographic实例数组
 * @return {Array<Geographic>} 返回修改后的result实例数组或创建一个新的Geographic实例数组
 */
Geographic.fromCartographicArray = function (cartographics, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array('cartographics', cartographics);
    //>>includeEnd('debug');

    for (let i = 0; i < cartographics.length; i++) {
        result[i] = Geographic.fromCartographic(cartographics[i], result[i]);
    }
    return result;
};

/**
 * 将Geographic实例转换为Cartographic实例
 * @param  {Geographic} geographic Geographic实例
 * @param  {Cartographic} [result] 输出结果的Cartographic实例
 * @return {Cartographic} 返回修改后的result实例或创建一个新的Cartographic实例
 */
Geographic.toCartographic = function (geographic, result) {
    return Cartographic.fromGeographic(geographic, result);
};

/**
 * 将当前Geographic实例转换为Cartographic实例
 * @see Geographic.toCartographic
 */
Geographic.prototype.toCartographic = function (result) {
    return Geographic.toCartographic(this, result);
};

/**
 * 将Geographic实例数组转换为Cartographic实例数组
 * @param  {Array<Geographic>} geographics Geographic实例数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Geographic>} 返回修改后的result实例数组或创建一个新的Cartographic实例数组
 */
Geographic.toCartographicArray = function (geographics, result) {
    return Cartographic.fromGeographicArray(geographics, result);
};

/**
 * 从Cartesian3实例生成Geographic实例
 * @param  {Cartesian3} cartesian Cartesian3实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.fromCartesian = function (cartesian, ellipsoid, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('cartesian', cartesian);
    //>>includeEnd('debug');
    const cartographic = Cartographic.fromCartesian(cartesian, ellipsoid, Scratch.scratchCartographic);
    if (defined(cartographic))
        return Geographic.fromCartographic(cartographic, result);
};

/**
 * 从Cartesian3实例数组生成Geographic实例数组
 * @param  {Array<Cartesian3>} cartesians Cartesian3实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Geographic>} 返回修改后的result实例数组或创建一个新的Geographic实例数组
 */
Geographic.fromCartesianArray = function (cartesians, ellipsoid, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array('cartesians', cartesians);
    //>>includeEnd('debug');

    for (let i = 0; i < cartesians.length; i++) {
        result[i] = Geographic.fromCartesian(cartesians[i], ellipsoid, result[i]);
    }

    return result;
};

/**
 * 将Geographic转换为Cartesian3实例
 * @param  {Geographic} geographic Geographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Cartesian3} [result] 输出结果的Cartesian3实例
 * @return {Cartesian3} 返回修改后的result实例或创建一个新的Cartesian3实例
 */
Geographic.toCartesian = function (geographic, ellipsoid, result) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined('geographic', geographic);
    //>>includeEnd('debug');

    return Cartesian3.fromDegrees(geographic.longitude, geographic.latitude, geographic.altitude, ellipsoid, result);
};

/**
 * 将当前Geographic实例转换为Cartesian3实例
 * @see Geographic.toCartesian
*/
Geographic.prototype.toCartesian = function (ellipsoid, result) {
    return Geographic.toCartesian(this, ellipsoid, result);
};

/**
 * 将Geographic实例数组转换为Cartesian3实例数组
 * @param  {Array<Geographic>} geographics Geographic实例数组
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Cartesian3>} 返回修改后的result实例数组或创建一个新的Cartesian3实例数组
 */
Geographic.toCartesianArray = function (geographics, ellipsoid, result) {
    return Cartesian3.fromGeographicArray(geographics, ellipsoid, result);
};

/**
 * 计算两个Geographic实例之间的直线距离
 * @param  {Geographic} left 第一个Geographic实例
 * @param  {Geographic} right 第二个Geographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @return {number} 两点之间的直线距离（单位：米）
 */
Geographic.distance = function (left, right, ellipsoid) {
    Check.defined("left", left);
    Check.defined("right", right);

    const leftCartesian = Geographic.toCartesian(left, ellipsoid, Scratch.scratchLeftCartesian3);
    const rightCartesian = Geographic.toCartesian(right, ellipsoid, Scratch.scratchRightCartesian3);

    return Cartesian3.distance(leftCartesian, rightCartesian);
};

/**
 * 计算当前Geographic实例与另一个Geographic实例之间的直线距离
 * @see Geographic.distance
*/
Geographic.prototype.distance = function (other, ellipsoid) {
    return Geographic.distance(this, other, ellipsoid);
};

/**
 * 计算两个Geographic实例间的地表距离（不考虑高度）
 * @param  {Geographic} left 第一个Geographic实例
 * @param  {Geographic} right 第二个Geographic实例
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @return {number} 两点之间的地表距离（单位：米）
 */
Geographic.surfaceDistance = function (left, right, ellipsoid) {
    Check.defined("left", left);
    Check.defined("right", right);

    const start = Geographic.toCartographic(left, Scratch.scratchLeftCartographic);
    const end = Geographic.toCartographic(right, Scratch.scratchRightCartographic);

    return new EllipsoidGeodesic(start, end, ellipsoid).surfaceDistance;
};

/**
 * 计算当前Geographic实例与另一个Geographic实例之间的地表距离（不考虑高度）
 * @see Geographic.surfaceDistance
 */
Geographic.prototype.surfaceDistance = function (other, ellipsoid) {
    return Geographic.surfaceDistance(this, other, ellipsoid);
};

/**
 * Geographic实例沿地表向正北方向移动一定距离（不考虑高度）
 * @param  {Geographic} geographic Geographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.moveToNorth = function (geographic, distance, ellipsoid, result) {
    Check.defined('geographic', geographic);
    Check.typeOf.number('distance', distance);

    const cartographic = Cartographic.fromGeographic(geographic, Scratch.scratchCartographic);
    cartographic.moveToNorth(distance, ellipsoid);
    return cartographic.toGeographic(result);
};

/**
 * 当前Geographic实例沿地表向正北方向移动一定距离（不考虑高度）
 * @see Geographic.moveToNorth
*/
Geographic.prototype.moveToNorth = function (distance, ellipsoid, result) {
    return Geographic.moveToNorth(this, distance, ellipsoid, result ? result : this);
};

/**
 * Geographic实例沿地表向正南方向移动一定距离（不考虑高度）
 * @param  {Geographic} geographic Geographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.moveToSouth = function (geographic, distance, ellipsoid, result) {
    Check.defined('geographic', geographic);
    Check.typeOf.number('distance', distance);

    const cartographic = Cartographic.fromGeographic(geographic, Scratch.scratchCartographic);
    cartographic.moveToSouth(distance, ellipsoid);
    return cartographic.toGeographic(result);
};

/**
 * 当前Geographic实例沿地表向正南方向移动一定距离（不考虑高度）
 * @see Geographic.moveToSouth
*/
Geographic.prototype.moveToSouth = function (distance, ellipsoid, result) {
    return Geographic.moveToSouth(this, distance, ellipsoid, result ? result : this);
};

/**
 * Geographic实例沿地表向正东方向移动一定距离（不考虑高度）
 * @param  {Geographic} geographic Geographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.moveToEast = function (geographic, distance, ellipsoid, result) {
    Check.defined('geographic', geographic);
    Check.typeOf.number('distance', distance);

    const cartographic = Cartographic.fromGeographic(geographic, Scratch.scratchCartographic);
    cartographic.moveToEast(distance, ellipsoid);
    return cartographic.toGeographic(result);
};

/**
 * 当前Geographic实例沿地表向正东方向移动一定距离（不考虑高度）
 * @see Geographic.moveToEast
*/
Geographic.prototype.moveToEast = function (distance, ellipsoid, result) {
    return Geographic.moveToEast(this, distance, ellipsoid, result ? result : this);
};

/**
 * Geographic实例沿地表向正西方向移动一定距离（不考虑高度）
 * @param  {Geographic} geographic Geographic实例
 * @param  {number} distance 移动的距离（单位：米）
 * @param  {Ellipsoid} [ellipsoid=Ellipsoid.default] 椭球体，默认为WGS84椭球体
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.moveToWest = function (geographic, distance, ellipsoid, result) {
    Check.defined('geographic', geographic);
    Check.typeOf.number('distance', distance);

    const cartographic = Cartographic.fromGeographic(geographic, Scratch.scratchCartographic);
    cartographic.moveToWest(distance, ellipsoid);
    return cartographic.toGeographic(result);
};

/**
 * 当前Geographic实例沿地表向正西方向移动一定距离（不考虑高度）
 * @see Geographic.moveToWest
*/
Geographic.prototype.moveToWest = function (distance, ellipsoid, result) {
    return Geographic.moveToWest(this, distance, ellipsoid, result ? result : this);
};

/**
 * 克隆Geographic实例
 * @param  {Geographic} geographic Geographic实例
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.clone = function (geographic, result = new Geographic()) {
    Check.defined('geographic', geographic);

    result.longitude = geographic.longitude;
    result.latitude = geographic.latitude;
    result.altitude = geographic.altitude;
    return result;
};

/**
 * 克隆当前Geographic实例
 * @see Geographic.clone
*/
Geographic.prototype.clone = function (result) {
    return Geographic.clone(this, result);
};

/**
 * 判断两个Geographic实例是否相等
 * @param  {Geographic} left 第一个Geographic实例
 * @param  {Geographic} right 第二个Geographic实例
 * @return {boolean} 返回判断结果
 */
Geographic.equals = function (left, right) {
    return (left === right) ||
        ((defined(left)) &&
            (defined(right)) &&
            (left.longitude === right.longitude) &&
            (left.latitude === right.latitude) &&
            (left.altitude === right.altitude));
};

/**
 * 当前Geographic实例是否与另一个Geographic实例相等
 * @see Geographic.equals
*/
Geographic.prototype.equals = function (other) {
    return Geographic.equals(this, other);
};

/**
 * 判断两个Geographic实例是否在指定误差范围内相等
 * @param  {Geographic} left 第一个Geographic实例
 * @param  {Geographic} right 第二个Geographic实例
 * @param  {number} [epsilon = 0] 误差范围，默认为0
 * @return {boolean} 返回判断结果
 */
Geographic.equalsEpsilon = function (left, right, epsilon = 0) {
    return (
        left === right ||
        (defined(left) &&
            defined(right) &&
            Math.abs(left.longitude - right.longitude) <= epsilon &&
            Math.abs(left.latitude - right.latitude) <= epsilon &&
            Math.abs(left.altitude - right.altitude) <= epsilon)
    );
};

/**
 * 当前Geographic实例是否与另一个Geographic实例在指定误差范围内相等
 * @see Geographic.equalsEpsilon
*/
Geographic.prototype.equalsEpsilon = function (other, epsilon) {
    return Geographic.equalsEpsilon(other, epsilon);
};

/**
 * The number of elements used to pack the object into an array.
 * @type {number}
*/
Geographic.packedLength = 3;

/**
 * 将Geographic实例打包到数组中
 * @param  {Geographic} value Geographic实例
 * @param  {Array} [array] 输出结果的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @return {Array} 返回修改后的array数组或创建一个新的数组
 */
Geographic.pack = function (value, array = [], startingIndex = 0) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("value", value);
    //>>includeEnd('debug');

    array[startingIndex++] = value.longitude;
    array[startingIndex++] = value.latitude;
    array[startingIndex] = value.altitude;
    return array;
};

/**
 * 将数组解包为Geographic实例
 * @param  {Array} array 输入的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @param  {Geographic} [result] 输出结果的Geographic实例
 * @return {Geographic} 返回修改后的result实例或创建一个新的Geographic实例
 */
Geographic.unpack = function (array, startingIndex = 0, result = new Geographic()) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("array", array);
    //>>includeEnd('debug');

    result.longitude = array[startingIndex++];
    result.latitude = array[startingIndex++];
    result.altitude = array[startingIndex];
    return result;
};

/**
 * 从数组生成Geographic实例
 * @see Geographic.unpack
*/
Geographic.fromArray = Geographic.unpack;

/**
 * 将当前Geographic实例转换为数组
 * @param  {Array} [array] 输出结果的数组
 * @param  {number} [startingIndex = 0] 数组开始索引
 * @return {Array<number>} 返回修改后的array数组或创建一个新的数组
*/
Geographic.prototype.toArray = function (array, startingIndex) {
    return Geographic.unpack(this, array, startingIndex);
};

/**
 * 将Geographic实例数组打包到数组中
 * @param  {Array<Geographic>} geographics Geographic实例数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<number>} 返回修改后的result数组或创建一个新的数组
 */
Geographic.packArray = function (geographics, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("geographics", geographics);
    //>>includeEnd('debug');

    let startingIndex = 0;
    for (let i = 0; i < geographics.length; i++) {
        Geographic.pack(geographics[i], result, startingIndex);
        startingIndex += Geographic.packedLength;
    }
    return result;
};

/**
 * 将数组解包为Geographic实例数组
 * @param  {Array<number>} array 输入的数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Geographic>} 返回修改后的result数组或创建一个新的数组
 */
Geographic.unpackArray = function (array, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    result.length = array.length / Geographic.packedLength;

    let startingIndex = 0;
    for (let i = 0; i < result.length; i++) {
        result[i] = Geographic.unpack(array, startingIndex);
        startingIndex += Geographic.packedLength;
    }
    return result;
};

/**
 * 从数组生成Geographic实例数组
 * @see Geographic.unpackArray
*/
Geographic.fromArray = Geographic.unpackArray;

/**
 * 将Geographic实例数组打包到二维数组中
 * @param  {Array<Geographic>} geographics Geographic实例数组
 * @param  {Array<Array<number>>} [result] 输出结果的二维数组
 * @return {Array<Array<number>>} 返回修改后的result数组或创建一个新的数组
 */
Geographic.pack2DArray = function (geographics, result = []) {
    Check.typeOf.array('geographics', geographics);

    for (let i = 0; i < geographics.length; i++) {
        result[i] = Geographic.pack(geographics[i], result[i]);
    }
    return result;
};

/**
 * 将二维数组解包为Geographic实例数组
 * @param  {Array<Array<number>>} array 输入的二维数组
 * @param  {Array} [result] 输出结果的数组
 * @return {Array<Geographic>} 返回修改后的result数组或创建一个新的数组
 */
Geographic.unpack2DArray = function (array, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    for (let i = 0; i < array.length; i++) {
        result[i] = Geographic.unpack(array[i]);
    }
    return result;
};

/**
 * 从二维数组生成Geographic实例数组
 * @see Geographic.unpack2DArray
*/
Geographic.from2DArray = Geographic.unpack2DArray;

/**
 * 一个不可修改的，初始化值为(0.0, 0.0, 0.0)的Geographic实例
 * @type {Geographic}
 */
Geographic.ZERO = Object.freeze(new Geographic(0.0, 0.0, 0.0));

/**
 * 将当前Geographic实例转换为字符串
 * @returns {string} A string representing this Cartesian in the format 'Geographic(longitude, latitude, altitude)'.
*/
Geographic.prototype.toString = function () {
    return `Geographic(${this.longitude}, ${this.latitude}, ${this.altitude})`;
};

export default Geographic;
export { Geographic };
