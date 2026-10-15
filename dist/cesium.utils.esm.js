import { Check, Cartesian3, Cartographic, defined as defined$1, EllipsoidGeodesic, Math as Math$1, Cartesian2, Cartesian4, Matrix3, Matrix4, BoundingRectangle, BoundingSphere, Color, DistanceDisplayCondition, HeadingPitchRange, HeadingPitchRoll, Interval as Interval$1, NearFarScalar, PerspectiveFrustum, Plane, Quaternion, Ray, Rectangle, DeveloperError, Transforms, Camera, Ellipsoid, IntersectionTests, Geometry as Geometry$1, PrimitiveType, GeometryPipeline, GlobeSurfaceTileProvider, Globe, JulianDate, MaterialProperty, Material, Event, TranslationRotationScale, Billboard, BillboardCollection, BoundingSphereState, Label, LabelCollection, PointPrimitive, PointPrimitiveCollection, PolylinePipeline, PostProcessStage, PostProcessStageLibrary, createGuid, PostProcessStageComposite, Primitive, GroundPrimitive, ClassificationPrimitive, GroundPolylinePrimitive, Property, SceneTransforms, Spherical, ArcType, ClassificationType, ClockRange, ColorBlendMode, CornerType, CullFace, HeightReference, HorizontalOrigin, LabelStyle, ShadowMode, PolygonHierarchy, TimeInterval, VerticalOrigin, EllipseGeometryLibrary, GeometryAttribute, ComponentDatatype, GeometryAttributes, ShowGeometryInstanceAttribute, ColorGeometryInstanceAttribute, DistanceDisplayConditionGeometryInstanceAttribute, defer, RuntimeError, BoxOutlineGeometry, BoxGeometry, CylinderOutlineGeometry, CylinderGeometry, EllipsoidOutlineGeometry, EllipsoidGeometry, destroyObject as destroyObject$1, GeometryInstance, PlaneGeometryUpdater, PlaneOutlineGeometry, PlaneGeometry } from 'cesium';
export { Billboard, BillboardCollection, BoundingSphere, Camera, Cartesian2, Cartesian3, Cartesian4, Cartographic, Math as CesiumMath, Check, ClassificationPrimitive, Color, DistanceDisplayCondition, Ellipsoid, Geometry, Globe, GlobeSurfaceTileProvider, GroundPolylinePrimitive, GroundPrimitive, HeadingPitchRoll, JulianDate, Label, LabelCollection, Material, MaterialProperty, Matrix3, Matrix4, Plane, PointPrimitive, PointPrimitiveCollection, PolylinePipeline, PostProcessStage, PostProcessStageLibrary, Primitive, Property, Quaternion, Rectangle, SceneTransforms, Spherical } from 'cesium';

/**
 * 自动判断传入的数值类型并转换为数字
 * @param {Number|String} value
 * @returns {Number}
 */
function parseNumber(value) {
    if (typeof value === 'string') {
        return parseFloat(value);
    } else if (typeof value === 'number') {
        return value;
    } else {
        throw new Error('unable parse the ' + value + ' to number.');
    }
}

/**
 * 把数字、字符串或含高度信息的数组/对象解析为高度值。
 * @param {number|string|Array|object} value 待解析的值，支持以第 2 个分量表示的数组或含 altitude/alt/height/Alt 字段的对象
 * @returns {number} 解析后的高度值，无法解析时返回 0
 */
function parseAltitude(value) {
    if (!value)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[2] !== undefined)
        return parseNumber(value[2]);
    else if (value.altitude !== undefined)
        return parseNumber(value.altitude);
    else if (value.alt !== undefined)
        return parseNumber(value.alt);
    else if (value.height !== undefined)
        return parseNumber(value.height);
    else if (value.Alt !== undefined)
        return parseNumber(value.Alt);
    // else if (value.z !== undefined)
    //     return value.z;
    else
        return 0;
}

/**
 * 把数字、字符串或数组/对象解析为纬度数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 1 个分量表示的数组或含 latitude/lat/Lat 字段的对象
 * @returns {number} 解析后的纬度值
 */
function parseLatitude(value) {
    Check.defined('value', value);
    if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[1] !== undefined)
        return parseNumber(value[1]);
    else if (value.latitude !== undefined)
        return parseNumber(value.latitude);
    else if (value.lat !== undefined)
        return parseNumber(value.lat);
    else if (value.Lat !== undefined)
        return parseNumber(value.Lat);
    // else if (value.y !== undefined)
    //     return value.y;
}

/**
 * 把数字、字符串或数组/对象解析为经度数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 0 个分量表示的数组或含 longitude/lng/Lon 字段的对象
 * @returns {number} 解析后的经度值
 */
function parseLongitude(value) {
    Check.defined('value', value);
    if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[0] !== undefined)
        return parseNumber(value[0]);
    else if (value.longitude !== undefined)
        return parseNumber(value.longitude);
    else if (value.lng !== undefined)
        return parseNumber(value.lng);
    else if (value.Lon !== undefined)
        return parseNumber(value.Lon);
    // else if (value.x !== undefined)
    //     return value.x;
}

/**
 * 把地理坐标解析为笛卡尔坐标（{@link Cartesian3}），输入按经度/纬度角度制处理。
 * @param {Array|object} geographic 待解析的地理坐标，含经度/纬度/高度信息
 * @param {Cartesian3} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Cartesian3} 解析后的笛卡尔坐标
 */
function parseGeographicToCartesian(geographic, result, ellipsoid) {
    const longitude = parseLongitude(geographic);
    const latitude = parseLatitude(geographic);
    const height = parseAltitude(geographic);
    return Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result);
}

/**
 * 把地理坐标数组批量解析为笛卡尔坐标数组（{@link Cartesian3}），输入按角度制处理。
 * @param {Array} geographics 地理坐标数组
 * @param {Array} [result=[]] 用于存储结果的数组
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Array} 解析后的笛卡尔坐标数组
 */
function parseGeographicsToPositions(geographics, result = [], ellipsoid) {
    Check.typeOf.array('geographics', geographics);
    for (let i = 0; i < geographics.length; i++) {
        result[i] = parseGeographicToCartesian(geographics[i], result[i], ellipsoid);
    }
    return result;
}

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

}
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
    longitude = Math$1.toDegrees(longitude);
    latitude = Math$1.toDegrees(latitude);

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

    result.longitude = Math$1.toDegrees(cartographic.longitude);
    result.latitude = Math$1.toDegrees(cartographic.latitude);
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
    if (defined$1(cartographic))
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
        ((defined$1(left)) &&
            (defined$1(right)) &&
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
        (defined$1(left) &&
            defined$1(right) &&
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

// --Cartesian2--
const scratchCanvasCoordinates = new Cartesian2(), // Cartesian2 画布坐标缓存
    scratchCartesian2 = new Cartesian2(), // Cartesian2 二维笛卡尔坐标缓存
    scratchPixelSize = new Cartesian2(), // Cartesian2 像素尺寸缓存
    scratchRepeat = new Cartesian2(1, 1), // Cartesian2 纹理重复次数缓存（默认 1,1）
    scratchScale2 = new Cartesian2(1, 1), // Cartesian2 二维缩放缓存（默认 1,1）
    scratchWindowPosition = new Cartesian2(); // Cartesian2 窗口坐标缓存

// --Cartesian3--
const scratchCartesian3 = new Cartesian3(), // Cartesian3 三维笛卡尔坐标缓存
    scratchDepthPosition = new Cartesian3(), // Cartesian3 深度位置缓存
    scratchEllipsoidPosition = new Cartesian3(), // Cartesian3 椭球位置缓存
    scratchEuler = new Cartesian3(), // Cartesian3 欧拉角缓存
    scratchGlobePosition = new Cartesian3(), // Cartesian3 地球表面位置缓存
    scratchPositionWC = new Cartesian3(), // Cartesian3 世界坐标位置缓存
    scratchScale3 = new Cartesian3(1, 1, 1), // Cartesian3 三维缩放缓存（默认 1,1,1）
    scratchTranslate = new Cartesian3(), // Cartesian3 平移量缓存
    scratchTranslation = new Cartesian3(), // Cartesian3 平移量缓存
    scratchCenter = new Cartesian3(), // Cartesian3 中心点缓存
    scratchDirection = new Cartesian3(), // Cartesian3 方向向量缓存
    scratchForward = new Cartesian3(), // Cartesian3 前方向向量缓存
    scratchNormal = new Cartesian3(), // Cartesian3 法线向量缓存
    scratchUp = new Cartesian3(), // Cartesian3 上方向向量缓存
    scratchUpCartesian3 = new Cartesian3(), // Cartesian3 上方向向量缓存
    scratchDownCartesian3 = new Cartesian3(), // Cartesian3 下方向向量缓存
    scratchLeftCartesian3 = new Cartesian3(), // Cartesian3 左方向向量缓存
    scratchLeftDirection = new Cartesian3(), // Cartesian3 左方向向量缓存
    scratchLeftNormal = new Cartesian3(), // Cartesian3 左法线向量缓存
    scratchRightCartesian3 = new Cartesian3(), // Cartesian3 右方向向量缓存
    scratchRightDirection = new Cartesian3(), // Cartesian3 右方向向量缓存
    scratchRightNormal = new Cartesian3(); // Cartesian3 右法线向量缓存

// --Cartesian4--
const scratchCartesian4 = new Cartesian4(), // Cartesian4 四维笛卡尔坐标缓存
    scratchNDC = new Cartesian4(); // Cartesian4 归一化设备坐标缓存

// --Cartographic--
const scratchCartographic = new Cartographic(), // Cartographic 制图坐标（经度、纬度、高度）缓存
    scratchLeftCartographic = new Cartographic(), // Cartographic 左侧制图坐标缓存
    scratchRightCartographic = new Cartographic(), // Cartographic 右侧制图坐标缓存
    scratchStartCartographic = new Cartographic(), // Cartographic 起点制图坐标缓存
    scratchEndCartographic = new Cartographic(); // Cartographic 终点制图坐标缓存

// --Matrix3--
const scratchMatrix3 = new Matrix3(), // Matrix3 三维矩阵缓存
    scratchRotationMatrix = new Matrix3(); // Matrix3 旋转矩阵缓存

// --Matrix4--
const scratchMatrix4 = new Matrix4(), // Matrix4 四维矩阵缓存
    scratchTransform = new Matrix4(), // Matrix4 变换矩阵缓存
    scratchViewMatrix = new Matrix4(); // Matrix4 视图矩阵缓存

// --Others--
const scratchBoundingRectangle = new BoundingRectangle(), // BoundingRectangle 包围矩形缓存
    scratchBoundingSphere = new BoundingSphere(), // BoundingSphere 包围球缓存
    scratchColor = new Color(), // Color 颜色缓存
    scratchDistanceDisplayCondition = new DistanceDisplayCondition(), // DistanceDisplayCondition 距离显示条件缓存
    scratchGeographic = new Geographic(), // Geographic 地理坐标缓存
    scratchHeadingPitchRange = new HeadingPitchRange(), // HeadingPitchRange 航向俯仰距离缓存
    scratchHeadingPitchRoll = new HeadingPitchRoll(), // HeadingPitchRoll 航向俯仰翻滚缓存
    scratchInterval = new Interval$1(), // Interval 区间缓存
    scratchTiltRestriction = new Interval$1(), // Interval 倾斜限制区间缓存
    scratchNearFarScalar = new NearFarScalar(), // NearFarScalar 近远标量缓存
    scratchPerspective = new PerspectiveFrustum(), // PerspectiveFrustum 透视视锥体缓存
    scratchPlane = new Plane(Cartesian3.UNIT_Z, 0), // Plane 平面缓存（法线为 UNIT_Z）
    scratchOrientation = new Quaternion(), // Quaternion 姿态四元数缓存
    scratchQuaternion = new Quaternion(), // Quaternion 四元数缓存
    scratchRay = new Ray(), // Ray 射线缓存
    scratchRectangle = new Rectangle(); // Rectangle 矩形缓存

let _scratchCamera;

/**
 * Cesium 常用临时对象的统一 scratch 缓存集合。
 * 集中存放各类可复用的临时对象（Cartesian2/3/4、Cartographic、Matrix3/4、Color 等），
 * 供内部计算复用以减少运行时对象创建与垃圾回收开销。
 * 使用约定：仅在同步计算过程中临时占用，不要长期持有其引用。
 */
const Scratch = {
    // --Cartesian2--
    scratchCartesian2,
    scratchPixelSize,
    scratchScale2,
    scratchCanvasCoordinates,
    scratchWindowPosition,
    scratchRepeat,
    // --Cartesian3--
    scratchCartesian3,
    scratchCenter,
    scratchLeftCartesian3,
    scratchRightCartesian3,
    scratchUpCartesian3,
    scratchDownCartesian3,
    scratchPositionWC,
    scratchTranslation,
    scratchTranslate,
    scratchEuler,
    scratchDirection,
    scratchLeftDirection,
    scratchRightDirection,
    scratchUp,
    scratchNormal,
    scratchLeftNormal,
    scratchRightNormal,
    scratchForward,
    scratchScale3,
    scratchEllipsoidPosition,
    scratchGlobePosition,
    scratchDepthPosition,
    // --Cartesian4--
    scratchCartesian4,
    scratchNDC,
    // --Cartographic--
    scratchCartographic,
    scratchLeftCartographic,
    scratchRightCartographic,
    scratchStartCartographic,
    scratchEndCartographic,
    // --Matrix3--
    scratchMatrix3,
    scratchRotationMatrix,
    // --Matrix4--
    scratchMatrix4,
    scratchTransform,
    scratchViewMatrix,
    // --Others--
    scratchBoundingRectangle,
    scratchBoundingSphere,
    scratchColor,
    scratchDistanceDisplayCondition,
    scratchGeographic,
    scratchHeadingPitchRange,
    scratchHeadingPitchRoll,
    scratchNearFarScalar,
    scratchQuaternion,
    scratchRay,
    scratchInterval,
    scratchTiltRestriction,
    scratchPlane,
    scratchRectangle,
    scratchOrientation,
    scratchPerspective,
};

Object.defineProperties(Scratch, {
    // Camera 相机实例的临时缓存（通过 get/set 访问）
    scratchCamera: {
        set: function (value) {
            _scratchCamera = value;
        },
        get: function () {
            return _scratchCamera;
        }
    }
});

/**
 * 扩展 Cesium 的 BoundingSphere 类，补充从中心点/半径、地理坐标、模型矩阵创建包围球，
 * 以及计算到世界坐标点、相机的距离等方法。
 * @class BoundingSphere
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/BoundingSphere.html}
*/

/**
 * 从中心点与半径创建包围球。
 * @param {Cartesian3} center 包围球中心点（世界坐标）。
 * @param {number} [radius=0] 包围球半径，单位米。
 * @param {BoundingSphere} [result=new BoundingSphere()] 用于存储结果的可选对象。
 * @returns {BoundingSphere} 生成或填充后的包围球。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.fromElements = function (center, radius = 0, result = new BoundingSphere()) {
    result.center = center;
    result.radius = radius;
    return result;
};

/**
 * 从一组地理坐标创建包围球，通过计算这些点在世界坐标系下的包围范围得到。
 * @param {Array|object} geographics 地理坐标点集合。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @param {BoundingSphere} [result] 用于存储结果的可选对象。
 * @returns {BoundingSphere} 包含所有点的包围球。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.fromGeographics = function (geographics, ellipsoid, result) {
    const positions = parseGeographicsToPositions(geographics, undefined, ellipsoid);
    return BoundingSphere.fromPoints(positions, result);
};

/**
 * 从模型矩阵与半径创建包围球，中心点取矩阵的平移分量。
 * @param {Matrix4} modelMatrix 模型矩阵。
 * @param {number} [radius] 包围球半径；未提供时保留结果对象原有的半径。
 * @param {BoundingSphere} [result=new BoundingSphere()] 用于存储结果的可选对象。
 * @returns {BoundingSphere} 生成或填充后的包围球。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.fromModelMatrix = function (modelMatrix, radius, result = new BoundingSphere()) {
    Check.defined("modelMatrix", modelMatrix);
    const center = Matrix4.getTranslation(modelMatrix, Scratch.scratchCenter);
    result.center = Cartesian3.clone(center, result.center);
    if (defined$1(radius))
        result.radius = radius;
    return result;
};

/**
 * 计算某个世界坐标位置到包围球表面的距离，若点在球内则返回 0。
 * @param {BoundingSphere} boundingSphere 目标包围球。
 * @param {Cartesian3} positionWC 世界坐标位置。
 * @returns {number} 位置到球表面的距离，单位米。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.distanceToCartesian = function (boundingSphere, positionWC) {
    Check.defined("boundingSphere", boundingSphere);
    Check.defined("positionWC", positionWC);
    return Math.max(0.0, Cartesian3.distance(boundingSphere.center, positionWC) - boundingSphere.radius);
};

/**
 * 计算某个世界坐标位置到包围球表面的距离，若点在球内则返回 0。
 * @param {Cartesian3} positionWC 世界坐标位置。
 * @returns {number} 位置到球表面的距离，单位米。
 * @memberof BoundingSphere
*/
BoundingSphere.prototype.distanceToCartesian = function (positionWC) {
    return BoundingSphere.distanceToCartesian(this, positionWC);
};

/**
 * 计算相机到包围球表面的距离，若相机在球内则返回 0。
 * @param {BoundingSphere} boundingSphere 目标包围球。
 * @param {Camera} camera 相机。
 * @returns {number} 相机到球表面的距离，单位米。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.distanceToCamera = function (boundingSphere, camera) {
    Check.defined("camera", camera);
    return BoundingSphere.distanceToCartesian(boundingSphere, camera.positionWC);
};

/**
 * 计算相机到包围球表面的距离，若相机在球内则返回 0。
 * @param {Camera} camera 相机。
 * @returns {number} 相机到球表面的距离，单位米。
 * @memberof BoundingSphere
*/
BoundingSphere.prototype.distanceToCamera = function (camera) {
    return BoundingSphere.distanceToCamera(this, camera);
};

/**
 * 把数字、字符串或数组/对象解析为偏航角（heading）数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 0 个分量表示的数组或含 heading/yaw/z/Yaw 字段的对象
 * @returns {number} 解析后的偏航角，无法解析时返回 0
 */
function parseHeading(value) {
    if (value === undefined)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[0] !== undefined)
        return value[0];
    else if (value.heading !== undefined)
        return value.heading;
    else if (value.yaw !== undefined)
        return value.yaw;
    else if (value.z !== undefined)
        return value.z;
    else if (value.Yaw !== undefined)
        return value.Yaw;
    else
        return 0;
}

/**
 * 把数字、字符串或数组/对象解析为俯仰角（pitch）数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 1 个分量表示的数组或含 pitch/y/Pitch 字段的对象
 * @returns {number} 解析后的俯仰角，无法解析时返回 0
 */
function parsePitch(value) {
    if (value === undefined)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[1] !== undefined)
        return value[1];
    else if (value.pitch !== undefined)
        return value.pitch;
    else if (value.y !== undefined)
        return value.y;
    else if (value.Pitch !== undefined)
        return value.Pitch;
    else
        return 0;
}

/**
 * 把数字、字符串或数组/对象解析为翻滚角（roll）数值。
 * @param {number|string|Array|object} value 待解析的值，支持第 2 个分量表示的数组或含 roll/x/Roll 字段的对象
 * @returns {number} 解析后的翻滚角，无法解析时返回 0
 */
function parseRoll(value) {
    if (value === undefined)
        return 0;
    else if (typeof value === 'number')
        return value;
    else if (typeof value === 'string')
        return parseFloat(value);
    else if (value[2] !== undefined)
        return value[2];
    else if (value.roll !== undefined)
        return value.roll;
    else if (value.x !== undefined)
        return value.x;
    else if (value.Roll !== undefined)
        return value.Roll;
    else
        return 0;
}

/**
 * 把姿态值解析为 {@link HeadingPitchRoll} 对象（角度制）。
 * @param {HeadingPitchRoll|Array|object|string|number} value 待解析的姿态值
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象
 * @returns {HeadingPitchRoll} 解析后的 HeadingPitchRoll
 */
function parseAttitudeToHeadingPitchRoll(value, result) {
    if (value instanceof HeadingPitchRoll) {
        if (result && value !== result)
            return HeadingPitchRoll.clone(value, result);
        else
            return value;
    }
    const heading = parseHeading(value);
    const pitch = parsePitch(value);
    const roll = parseRoll(value);
    return HeadingPitchRoll.fromDegrees(heading, pitch, roll, result);
}

function isValid(value) {
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value)))
        return false;
    return true;
}

function getValidValue(...args) {
    for (let i = 0; i < args.length; i++) {
        if (isValid(args[i]))
            return args[i];
    }
}

/**
 * 把数字、字符串或数组/对象解析为三维笛卡尔坐标（{@link Cartesian3}）。
 * @param {Cartesian3|number|string|Array|object} value 待解析的值，支持 [x,y,z] 数组或含 x/y/z 字段的对象
 * @param {Cartesian3} [result] 用于存储结果的可选对象
 * @param {number} [defaultValue=0.0] 缺省分量的默认值
 * @returns {Cartesian3} 解析后的三维笛卡尔坐标
 */
function parseToCartesian3(value, result, defaultValue = 0.0) {
    if (!defined$1(value)) {
        if (typeof defaultValue === 'number')
            return Cartesian3.fromElements(defaultValue, defaultValue, defaultValue, result);
        else
            throw new DeveloperError('value undefined.');
    } else if (value instanceof Cartesian3) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (typeof value === 'number' || typeof value === 'string') {
        value = parseNumber(value);
        return Cartesian3.fromElements(value, value, value, result);
    }
    const x = getValidValue(value[0], value.x, defaultValue);
    Check.typeOf.number('x', x);
    const y = getValidValue(value[1], value.y, defaultValue);
    Check.typeOf.number('y', y);
    const z = getValidValue(value[2], value.z, defaultValue);
    Check.typeOf.number('z', z);
    return Cartesian3.fromElements(x, y, z, result);
}

/**
 * 把数组或对象解析为 {@link HeadingPitchRange} 对象。
 * @param {HeadingPitchRange|Array|object} value 待解析的值，支持 [heading,pitch,range] 数组或含 heading/pitch/range 字段的对象
 * @param {HeadingPitchRange} [result=new HeadingPitchRange()] 用于存储结果的可选对象
 * @param {boolean} [isDegrees=true] 输入是否为角度制，为 true 时按角度解析
 * @returns {HeadingPitchRange} 解析后的 HeadingPitchRange
 */
function parseToHeadingPitchRange(value, result = new HeadingPitchRange(), isDegrees = true) {
    Check.defined('value', value);

    if (value instanceof HeadingPitchRange) {
        if (value !== result) {
            HeadingPitchRange.clone(value, result);
            return result;
        } else
            return value;
    }

    if (Array.isArray(value)) {
        if (isDegrees) {
            result.heading = Math$1.toRadians(value[0]);
            result.pitch = Math$1.toRadians(value[1]);
        } else {
            result.heading = value[0];
            result.pitch = value[1];
        }
        result.range = value[2];
    } else if (typeof value === 'object') {
        if (isDegrees) {
            result.heading = Math$1.toRadians(value.heading ?? value.yaw);
            result.pitch = Math$1.toRadians(value.pitch);
        } else {
            result.heading = value.heading ?? value.yaw;
            result.pitch = value.pitch;
        }
        result.range = value.range;
    }

    return result;
}

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
    if (!defined$1(west) || !defined$1(south) || !defined$1(east) || !defined$1(north))
        throw new DeveloperError('the west or south or east or north is undefined.');
    if (isDegrees)
        return Rectangle.fromDegrees(west, south, east, north, result);
    else
        return Rectangle.fromRadians(west, south, east, north, result);
}

/**
 * 把姿态值解析为四元数（{@link Quaternion}），可指定参考坐标系原点。
 * @param {HeadingPitchRoll|Array|object|string|number} attitude 待解析的姿态值
 * @param {Cartesian3} [origin] 参考坐标系原点（地心世界坐标），提供时按该点局部坐标系计算
 * @param {Quaternion} [result] 用于存储结果的可选对象
 * @returns {Quaternion} 解析后的四元数
 */
function parseAttitudeToQuaternion(attitude, origin, result) {
    const hpr = parseAttitudeToHeadingPitchRoll(attitude, Scratch.scratchHeadingPitchRoll);
    if (origin)
        return Transforms.headingPitchRollQuaternion(origin, hpr, undefined, undefined, result)
    else
        return Quaternion.fromHeadingPitchRoll(hpr, result);
}

/**
 * 把欧拉角解析为 {@link HeadingPitchRoll} 对象。
 * @param {Array|object|string|number} value 待解析的欧拉角，按 [roll, pitch, yaw] 顺序
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {HeadingPitchRoll} 解析后的 HeadingPitchRoll
 */
function parseEulerToHeadingPitchRoll(value, result, isDegrees) {
    value = parseToCartesian3(value, Scratch.scratchCartesian3, 0.0);
    if (isDegrees)
        return HeadingPitchRoll.fromDegrees(-value.z, -value.y, value.x, result);
    else
        return HeadingPitchRoll.fromRadians(-value.z, -value.y, value.x, result);
}

/**
 * 把欧拉角解析为四元数（{@link Quaternion}）。
 * @param {Array|object|string|number} value 待解析的欧拉角，按 [roll, pitch, yaw] 顺序
 * @param {Quaternion} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {Quaternion} 解析后的四元数
 */
function parseEulerToQuaternion(value, result, isDegrees) {
    const hpr = parseEulerToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, isDegrees);
    return Quaternion.fromHeadingPitchRoll(hpr, result);
}

/**
 * 把多种旋转表示解析为 {@link HeadingPitchRoll} 对象。
 * @param {HeadingPitchRoll|Quaternion|Matrix3|Array|object} value 待解析的旋转值，支持 HeadingPitchRoll、四元数、旋转矩阵、欧拉角数组或对象
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {HeadingPitchRoll} 解析后的 HeadingPitchRoll
 */
function parseRotationToHeadingPitchRoll(value, result, isDegrees) {
    if (value instanceof HeadingPitchRoll) {
        if (result && value !== result)
            return HeadingPitchRoll.clone(value, result);
        else
            return value;
    } else if (value instanceof Quaternion)
        return HeadingPitchRoll.fromQuaternion(value, result);
    else if (value instanceof Matrix3) {
        value = Quaternion.fromRotationMatrix(value, Scratch.scratchQuaternion);
        return HeadingPitchRoll.fromQuaternion(value, result);
    } else if (defined$1(value.heading) || defined$1(value.yaw)) {
        if (isDegrees)
            return HeadingPitchRoll.fromDegrees(getValidValue(value.heading, value.yaw), value.pitch, value.roll, result);
        else
            return HeadingPitchRoll.fromRadians(getValidValue(value.heading, value.yaw), value.pitch, value.roll, result);
    } else if (Array.isArray(value)) {
        if (isDegrees)
            return HeadingPitchRoll.fromDegrees(value[0], value[1], value[2], result);
        else
            return HeadingPitchRoll.fromRadians(value[0], value[1], value[2], result);
    } else {
        return parseEulerToHeadingPitchRoll(value, result, isDegrees);
    }
}

/**
 * 把多种旋转表示解析为四元数（{@link Quaternion}）。
 * @param {Quaternion|HeadingPitchRoll|Matrix3|Array|object} value 待解析的旋转值，未定义时返回单位四元数
 * @param {Quaternion} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {Quaternion} 解析后的四元数
 */
function parseRotationToQuaternion(value, result, isDegrees) {
    if (!defined$1(value))
        return Quaternion.IDENTITY.clone(result);
    else if (value instanceof Quaternion) {
        if (result && value !== result)
            return Quaternion.clone(value, result);
        else
            return value;
    } else {
        const hpr = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, isDegrees);
        return Quaternion.fromHeadingPitchRoll(hpr, result);
    }
}

/**
 * 根据多种来源选项计算模型矩阵（世界坐标到局部坐标的变换矩阵）。
 * 支持通过原点/经纬度/原点矩阵、变换前后矩阵以及平移、旋转/姿态/欧拉角、缩放等组合生成。
 * @param {object} options 参数对象
 * @param {Matrix4|Cartesian3|object} [options.origin] 原点，可为 Matrix4 或可解析为 Cartesian3 的位置
 * @param {Ellipsoid} [options.ellipsoid] 参考椭球体
 * @param {Matrix4} [options.originMatrix] 原点矩阵，也支持 fixedFrame/fixedFrameMatrix/localFrame/localFrameMatrix 别名
 * @param {object} [options.geographic] 地理坐标原点
 * @param {Cartesian3|object} [options.position] 位置原点，也支持 originPosition/center 别名
 * @param {Matrix4} [options.beforeTransform] 前置变换矩阵，也支持 beforeTransformtion/beforeTransformMatrix 别名
 * @param {Matrix4} [options.transform] 变换矩阵，也支持 transformation/transformMatrix/localTransform/localTransformMatrix 别名
 * @param {Cartesian3} [options.translation] 平移量
 * @param {Quaternion|object} [options.rotation] 旋转四元数
 * @param {object} [options.attitude] 姿态
 * @param {object} [options.euler] 欧拉角，也支持 eulerRotation 别名
 * @param {Cartesian3} [options.scale] 缩放
 * @param {Matrix4} [options.afterTransform] 后置变换矩阵，也支持 afterTransformtion/afterTransformMatrix 别名
 * @param {Matrix4} [result] 用于存储结果的矩阵，未提供则新建
 * @returns {Matrix4} 计算得到的模型矩阵
 */
function computeModelMatrix(options, result) {
    Check.typeOf.object('options', options);

    if (result === undefined)
        result = Matrix4.IDENTITY.clone(new Matrix4());
    else
        result = Matrix4.IDENTITY.clone(result);

    if (options.origin) {
        if (options.origin instanceof Matrix4)
            Matrix4.clone(options.origin, result);
        else {
            const origin = parseToCartesian3(options.origin, Scratch.scratchCartesian3, 0.0);
            if (!Cartesian3.equals(Cartesian3.ZERO, origin))
                Transforms.eastNorthUpToFixedFrame(origin, options.ellipsoid, result);
        }
    } else if (options.originMatrix || options.fixedFrame || options.fixedFrameMatrix || options.localFrame || options.localFrameMatrix) {
        const originMatrix = options.originMatrix || options.fixedFrame || options.fixedFrameMatrix || options.localFrame || options.localFrameMatrix;
        Check.instanceOf('originMatrix', originMatrix, Matrix4);
        Matrix4.clone(originMatrix, result);
    } else {
        let origin;
        if (options.geographic)
            origin = parseGeographicToCartesian(options.geographic, Scratch.scratchCartesian3, options.ellipsoid);
        else if (options.position || options.originPosition || options.center) {
            origin = options.position || options.originPosition || options.center;
            origin = parseToCartesian3(origin, Scratch.scratchCartesian3, 0.0);
        }
        if (origin && !Cartesian3.equals(Cartesian3.ZERO, origin))
            Transforms.eastNorthUpToFixedFrame(origin, options.ellipsoid, result);
    }

    if (options.beforeTransform || options.beforeTransformtion || options.beforeTransformMatrix) {
        const beforeTransform = options.beforeTransform || options.beforeTransformtion || options.beforeTransformMatrix;
        Check.instanceOf('beforeTransform', beforeTransform, Matrix4);
        if (!Matrix4.equals(beforeTransform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, beforeTransform, result);
    }

    if (options.transform || options.transformation || options.transformMatrix || options.localTransform || options.localTransformMatrix) {
        const transform = options.transform || options.transformation || options.transformMatrix || options.localTransform || options.localTransformMatrix;
        Check.instanceOf('transform', transform, Matrix4);
        if (!Matrix4.equals(transform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, transform, result);
    } else {
        const transform = Matrix4.IDENTITY.clone(Scratch.scratchTransform);

        const translation = Cartesian3.ZERO.clone(Scratch.scratchTranslation);
        if (options.translation)
            parseToCartesian3(options.translation, translation, 0.0);

        const quaternion = Quaternion.IDENTITY.clone(Scratch.scratchQuaternion);
        if (options.rotation)
            parseRotationToQuaternion(options.rotation, quaternion);
        else if (options.attitude)
            parseAttitudeToQuaternion(options.attitude, quaternion);
        else if (options.euler || options.eulerRotation)
            parseEulerToQuaternion(options.euler || options.eulerRotation, quaternion);

        const scale = Cartesian3.ONE.clone(Scratch.scratchScale3);
        if (options.scale)
            parseToCartesian3(options.scale, scale, 1.0);

        Matrix4.fromTranslationQuaternionRotationScale(translation, quaternion, scale, transform);

        if (!Matrix4.equals(transform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, transform, result);
    }

    if (options.afterTransform || options.afterTransformtion || options.afterTransformMatrix) {
        const afterTransform = options.afterTransform || options.afterTransformtion || options.afterTransformMatrix;
        Check.instanceOf('afterTransform', afterTransform, Matrix4);
        if (!Matrix4.equals(afterTransform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, afterTransform, result);
    }

    return result;
}

/**
 * 扩展 Cesium 的 Camera 类，补充地理坐标、姿态、视线方向等访问属性，
 * 并扩展 setView、flyTo、flyHome 等方法以支持更丰富的参数形式。
 * @class Camera
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Camera.html}
*/

Object.defineProperties(Camera.prototype, {
    /**
     * 获取相机所属的场景对象。
     * @type {Scene}
     * @memberof Camera
    */
    scene: {
        get: function () {
            return this._scene;
        }
    },
    /**
     * 获取相机当前位置对应的地理坐标。
     * @type {Geographic}
     * @memberof Camera
    */
    geographic: {
        get: function () {
            return this.positionCartographic.toGeographic();
        }
    },
    /**
     * 获取相机航向角（角度制，单位度）。
     * @type {number}
     * @memberof Camera
    */
    headingDegrees: {
        get: function () {
            return Math$1.toDegrees(this.heading);
        }
    },
    /**
     * 获取相机俯仰角（角度制，单位度）。
     * @type {number}
     * @memberof Camera
    */
    pitchDegrees: {
        get: function () {
            return Math$1.toDegrees(this.pitch);
        }
    },
    /**
     * 获取相机横滚角（角度制，单位度）。
     * @type {number}
     * @memberof Camera
    */
    rollDegrees: {
        get: function () {
            return Math$1.toDegrees(this.roll);
        }
    },
    /**
     * 获取相机当前姿态对应的 HeadingPitchRoll（弧度制）。
     * @type {HeadingPitchRoll}
     * @memberof Camera
    */
    orientation: {
        get: function () {
            if (!defined$1(this._orientation))
                this._orientation = new HeadingPitchRoll();
            this._orientation.heading = this.heading;
            this._orientation.pitch = this.pitch;
            this._orientation.roll = this.roll;
            return this._orientation;
        }
    },
    /**
     * 获取相机当前姿态的角度制表示（度）。
     * @type {object}
     * @memberof Camera
    */
    orientationDegrees: {
        get: function () {
            return this.orientation.toDegrees();
        }
    },
    /**
     * 获取相机当前姿态的角度制表示（度），等同于 orientationDegrees。
     * @type {object}
     * @memberof Camera
    */
    attitude: {
        get: function () {
            return this.orientationDegrees;
        }
    },
    /**
     * 获取相机视锥体的投影矩阵。
     * @type {Matrix4}
     * @memberof Camera
    */
    projectionMatrix: {
        get: function () {
            return this.frustum.projectionMatrix;
        }
    },
    /**
     * 判断相机当前是否正在执行飞行（视角切换）动画。
     * @type {boolean}
     * @memberof Camera
    */
    isFlighting: {
        get: function () {
            return defined$1(this._currentFlight);
        }
    },
    /**
     * 获取相机所属场景的参考椭球体。
     * @type {Ellipsoid}
     * @memberof Camera
    */
    ellipsoid: {
        get: function () {
            return this._scene.ellipsoid;
        }
    }
});

/**
 * 计算给定距离处每个像素对应的地面米数。
 * @param {number} distance 距离相机的位置距离，单位米。
 * @returns {number} 每个像素对应的米数。
 * @memberof Camera
*/
Camera.prototype.getMetersPerPixel = function (distance) {
    Check.typeOf.number('distance', distance);
    const pixelSize = this.frustum.getPixelDimensions(
        this._scene.drawingBufferWidth,
        this._scene.drawingBufferHeight,
        distance,
        this._scene.pixelRatio,
        Scratch.scratchPixelSize
    );
    return Math.max(pixelSize.x, pixelSize.y);
};

/**
 * 原始 setView 方法的引用，扩展后的 setView 在完成参数处理后调用它。
 * @type {function}
 * @memberof Camera
*/
Camera.prototype.originalSetView = Camera.prototype.setView;

/**
 * 重写 setView，支持通过 geographic、position、rectangle、attitude 等参数形式设置视角。
 * @param {object} options 视角设置项，支持 geographic/position/rectangle/attitude/destination/orientation 等字段。
 * @memberof Camera
*/
Camera.prototype.setView = function (options) {
    if (defined$1(options.geographic) || defined$1(options.position)) {
        const modelMatrix = computeModelMatrix({
            geographic: options.geographic,
            position: options.position,
            translation: options.translation,
            ellipsoid: this.ellipsoid,
        });
        options.destination = Matrix4.getTranslation(modelMatrix, new Cartesian3());
    } else if (defined$1(options.rectangle)) {
        options.destination = parseToRectangle(options.rectangle);
    }
    if (defined$1(options.attitude))
        options.orientation = parseAttitudeToHeadingPitchRoll(options.attitude);
    else if (options.orientation && Array.isArray(options.orientation))
        options.orientation = HeadingPitchRoll.unpack(options.orientation);
    this.originalSetView(options);
};

/**
 * 原始 flyTo 方法的引用，扩展后的 flyTo 在完成参数处理后调用它。
 * @type {function}
 * @memberof Camera
*/
Camera.prototype.originalFlyTo = Camera.prototype.flyTo;

/**
 * 重写 flyTo，支持通过 geographic、position、rectangle、attitude 等参数形式进行视角飞行。
 * @param {object} options 飞行设置项，支持 geographic/position/rectangle/attitude/destination/orientation 等字段。
 * @memberof Camera
*/
Camera.prototype.flyTo = function (options) {
    if (defined$1(options.geographic) || defined$1(options.position)) {
        const modelMatrix = computeModelMatrix({
            geographic: options.geographic,
            position: options.position,
            translation: options.translation,
            ellipsoid: this.ellipsoid,
        });
        options.destination = Matrix4.getTranslation(modelMatrix, new Cartesian3());
    } else if (defined$1(options.rectangle)) {
        options.destination = parseToRectangle(options.rectangle);
    }
    if (defined$1(options.attitude))
        options.orientation = parseAttitudeToHeadingPitchRoll(options.attitude);
    else if (options.orientation && Array.isArray(options.orientation))
        options.orientation = HeadingPitchRoll.unpack(options.orientation);
    this.originalFlyTo(options);
};

/**
 * 设置 HomeView（视角），flyHome 时将优先飞至该设置。
 * @param {object} options 视角设置项，参数参见 flyTo。
 * @memberof Camera
*/
Camera.prototype.setHomeView = function (options) {
    if (!options)
        return;
    this.homeViewOptions = options;
};

/**
 * 设置默认视角，flyHome 时将使用该设置。
 * @param {object} options 视角设置项，参数参见 flyTo。
 * @memberof Camera
 * @deprecated 已废弃，请改用 setHomeView。
*/
Camera.prototype.setDefaultView = function (options) {
    console.warn('setDefaultView function is deprecated, use setHomeView instead.');
    this.setHomeView(options);
};

//记录Camera原始的flyHome方法
/**
 * 原始 flyHome 方法的引用，扩展后的 flyHome 在未设置 homeView 时调用它。
 * @type {function}
 * @memberof Camera
*/
Camera.prototype.originalFlyHome = Camera.prototype.flyHome;

/**
 * 重写 flyHome，优先飞至 homeView 设置，未设置时执行原始的 flyHome。
 * @param {number} [duration] 飞行持续时间，单位秒；未指定时使用默认值。
 * @memberof Camera
*/
Camera.prototype.flyHome = function (duration) {
    if (this.homeViewOptions) {
        const options = Object.assign({}, this.homeViewOptions);
        if (defined$1(duration))
            options.duration = duration;
        this.flyTo(options);
    } else {
        this.originalFlyHome(duration);
    }
};

/**
 * 相机飞至指定的视点。
 * @param {Cartesian3} viewPoint 目标视点（世界坐标）。
 * @param {HeadingPitchRange|Array} offset 视角偏移，可为 HeadingPitchRange 或数组。
 * @param {object} [options={}] 飞行选项，透传给 flyToBoundingSphere。
 * @memberof Camera
*/
Camera.prototype.flyToViewPoint = function (viewPoint, offset, options = {}) {
    Check.defined('viewPoint', viewPoint);
    Check.defined('offset', offset);

    const boundingSphere = BoundingSphere.fromElements(viewPoint, 0, Scratch.scratchBoundingSphere);

    options.offset = parseToHeadingPitchRange(offset, Scratch.scratchHeadingPitchRange, offset.degrees);

    this.flyToBoundingSphere(boundingSphere, options);

};

/**
 * 相机飞至指定的矩形范围。
 * @param {Rectangle} rectangle 目标矩形范围。
 * @param {object} [options={}] 飞行选项，透传给 flyToBoundingSphere。
 * @memberof Camera
*/
Camera.prototype.flyToRectangle = function (rectangle, options = {}) {
    Check.defined('rectangle', rectangle);

    const boundingSphere = BoundingSphere.fromRectangle3D(rectangle, this.ellipsoid, options.surfaceHeight, Scratch.scratchBoundingSphere);
    this.flyToBoundingSphere(boundingSphere, options);
};

/**
 * 相机看向指定的方向。
 * @param {Cartesian3} direction 目标方向。
 * @param {Cartesian3} [up] 上方向；未提供时使用当前位置的椭球法线。
 * @memberof Camera
*/
Camera.prototype.lookAtDirection = function (direction, up) {

    Check.typeOf.object('direction', direction);
    direction = parseToCartesian3(direction, Scratch.scratchDirection, false);
    Cartesian3.normalize(direction, direction);
    if (up) {
        up = parseToCartesian3(up, Scratch.scratchUp, false);
        Cartesian3.normalize(up, up);
    } else {
        up = this.ellipsoid.geodeticSurfaceNormal(this.positionWC, Scratch.scratchUp);
    }

    this.setView({
        orientation: {
            direction: direction,
            up: up,
        }
    });

};

/**
 * 相机看向指定的世界坐标位置。
 * @param {Cartesian3} position 目标位置（世界坐标）。
 * @memberof Camera
*/
Camera.prototype.lookAtPosition = function (position) {

    Check.typeOf.object('position', position);
    position = parseToCartesian3(position, Scratch.scratchPositionWC, false);

    const direction = Cartesian3.subtract(position, this.positionWC, Scratch.scratchDirection);

    this.lookAtDirection(direction);

};

/**
 * 相机看向指定的地理坐标位置。
 * @param {Geographic} geographic 目标地理坐标。
 * @memberof Camera
*/
Camera.prototype.lookAtGeographic = function (geographic) {

    Check.typeOf.object('geographic', geographic);
    const position = parseGeographicToCartesian(geographic, Scratch.scratchPositionWC, this.ellipsoid);

    const direction = Cartesian3.subtract(position, this.positionWC, Scratch.scratchDirection);

    this.lookAtDirection(direction);

};

/**
 * 获取相机当前位置沿当前朝向的射线。
 * @param {Ray} [result] 存放结果的 Ray 对象。
 * @returns {Ray} 相机朝向射线。
 * @memberof Camera
*/
Camera.prototype.getDirectionRay = function (result = new Ray()) {
    result.origin = this.positionWC;
    result.direction = this.directionWC;
    return result;
};

/**
 * 四舍五入一个数值至指定的小数位数
 * @param {Number} value 传入的数值 
 * @param {Number} decimalNumber 小数位数
 * @returns {Number}
 */
function toFixed(value, decimalNumber = 2) {
    return parseFloat(value.toFixed(decimalNumber));
}

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
};

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

const PI = Math.PI;
const PI_OVER_TWO = PI / 2.0;

/**
 * 转换一个纬度值至纬度范围内
 * @param {Number} latitude 需要转换的纬度值
 * @param {Boolean} degrees 单位，true表示角度单位，false表示弧度单位，默认true
 * @returns {Number} 转换后的纬度
 */
function convertToLatitudeRange(latitude, degrees = true) {
    if (degrees) {
        while (latitude > 90 || latitude < -90) {
            if (latitude > 90) {
                latitude = 180 - latitude;
            } else if (latitude < -90) {
                latitude = -180 - latitude;
            }
        }
    } else {
        while (latitude > PI_OVER_TWO || latitude < -PI_OVER_TWO) {
            if (latitude > PI_OVER_TWO) {
                latitude = Math.PI - latitude;
            } else if (latitude < -PI_OVER_TWO) {
                latitude = -Math.PI - latitude;
            }
        }
    }
    return latitude;
}

/**
 * 将一个数值转换至两个数值范围内
 * 如不在范围内则累加或累减范围长度，直至落在范围内
 * @param {Number} value 需要转换的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @returns {Number} 转换后的数值
 */
function convertToRange(value, rangeMinimum, rangeMaximum) {
    const length = rangeMaximum - rangeMinimum;
    if (length === 0)
        return rangeMinimum;
    if (value < rangeMinimum) {
        value += length;
        while (value < rangeMinimum)
            value += length;
    } else if (value > rangeMaximum) {
        value -= length;
        while (value > rangeMaximum)
            value -= length;
    }
    return value;
}

/**
 * 转换一个经度值至经度范围内
 * @param {Number} longitude 需要转换的经度值
 * @param {Boolean} degrees 单位，true表示角度单位，false表示弧度单位，默认true
 * @returns {Number} 转换后的经度
 */
function convertToLongitudeRange(longitude, degrees = true) {
    if (degrees)
        return convertToRange(longitude, -180, 180);
    else
        return convertToRange(longitude, -Math.PI, Math.PI);
}

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

/**
 * 扩展 Cesium 的 Check 类，补充数组、整数、实例类型等校验方法。
 * @class Check
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Check.html}
*/

/**
 * 如果 test 不是 Array 类型则抛出异常。
 *
 * @param  {string} name 被检测变量的名称
 * @param  {*} test 待检测的值
 * @exception {DeveloperError} test 必须为 'Array' 类型
 * @memberof Check
 * @static
 */
Check.typeOf.array = function (name, test) {
    if (Array.isArray(test) === false) {
        throw new DeveloperError(Check.getFailedTypeErrorMessage(typeof test, 'array', name));
    }
};

/**
 * 如果 test 不是整数类型则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @exception {DeveloperError} test 必须为 'integer' 类型
 * @memberof Check
 * @static
 */
Check.typeOf.integer = function (name, test) {
    if (Number.isSafeInteger(test) === false) {
        throw new DeveloperError(Check.getFailedTypeErrorMessage(typeof test, 'integer', name));
    }
};

/**
 * 如果 test 不是整数类型或不小于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的上限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且小于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.lessThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test >= limit) {
        throw new DeveloperError('Expected ' + name + ' to be less than ' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test 不是整数类型或不小于等于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的上限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且小于等于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test > limit) {
        throw new DeveloperError('Expected ' + name + ' to be less than or equal to ' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test 不是整数类型或不大于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的下限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且大于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.greaterThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test <= limit) {
        throw new DeveloperError('Expected ' + name + ' to be greater than ' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test 不是整数类型或不大于等于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的下限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且大于等于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test < limit) {
        throw new DeveloperError('Expected ' + name + ' to be greater than or equal to' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test1 与 test2 不是整数类型或两者值不相等则抛出异常。
 *
 * @param {string} name1 第一个被检测变量的名称
 * @param {string} name2 第二个被检测变量的名称
 * @param {*} test1 待检测的值
 * @param {*} test2 用于比较的值
 * @exception {DeveloperError} test1 与 test2 必须为 'integer' 类型且值相等
 * @memberof Check
 * @static
 */
Check.typeOf.integer.equals = function (name1, name2, test1, test2) {
    Check.typeOf.integer(name1, test1);
    Check.typeOf.integer(name2, test2);
    if (test1 !== test2) {
        throw new DeveloperError(
            name1 + " must be equal to " + name2 + ", the actual values are " + test1 + " and " + test2
        );
    }
};

/**
 * 如果 test 不是 target 的实例则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {*} target instanceof 的目标类型
 * @exception {DeveloperError} test 必须为 target 的实例
 * @memberof Check
 * @static
 */
Check.instanceOf = function (name, test, target) {
    if (test instanceof target === false) {
        throw new DeveloperError(Check.getFailedTypeErrorMessage(false, target.name, name));
    }
};

/**
 * 如果 test1 与 test2 的值不相等则抛出异常。
 *
 * @param {string} name1 第一个被检测变量的名称
 * @param {string} name2 第二个被检测变量的名称
 * @param {*} test1 第一个待检测的值
 * @param {*} test2 第二个用于比较的值
 * @exception {DeveloperError} test1 与 test2 的值必须相等
 * @memberof Check
 * @static
 */
Check.typeOf.number.equals = function (name1, name2, test1, test2) {
    if (test1 !== test2) {
        throw new DeveloperError(
            `${name1} must be equal to ${name2}, the actual values are ${test1} and ${test2}`,
        );
    }
};

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
    if (!defined$1(color)) {
        return undefined;
    }
    if (!defined$1(result)) {
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
        (defined$1(left) && //
            defined$1(right) && //
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
    if (!defined$1(result)) {
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

    return Color.fromBytes(array[startingIndex], array[startingIndex + 1], array[startingIndex + 2], array[startingIndex + 3], result);};

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
    if (!defined$1(result)) {
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
    if (defined$1(alpha))
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

/**
 * 扩展 Cesium 的 DistanceDisplayCondition 类，补充基于距离判断是否显示的方法。
 * @class DistanceDisplayCondition
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/DistanceDisplayCondition.html}
*/

/**
 * 判断给定距离是否位于距离显示条件范围内。
 * @param {DistanceDisplayCondition} distanceDisplayCondition 距离显示条件。
 * @param {number} distance 待判断的距离，单位米。
 * @returns {boolean} 距离位于 near 与 far 之间返回 true，否则返回 false。
 * @memberof DistanceDisplayCondition
 * @static
*/
DistanceDisplayCondition.isDisplay = function (distanceDisplayCondition, distance) {
    Check.defined('distanceDisplayCondition', distanceDisplayCondition);
    return Math$1.between(
        distance,
        Math.min(distanceDisplayCondition.near, distanceDisplayCondition.far),
        Math.max(distanceDisplayCondition.near, distanceDisplayCondition.far)
    );
};

/**
 * 判断给定距离是否位于当前距离显示条件范围内。
 * @param {number} distance 待判断的距离，单位米。
 * @returns {boolean} 距离位于 near 与 far 之间返回 true，否则返回 false。
 * @memberof DistanceDisplayCondition
*/
DistanceDisplayCondition.prototype.isDisplay = function (distance) {
    return DistanceDisplayCondition.isDisplay(this, distance);
};

/**
 * 扩展 Cesium 的 Ellipsoid 类，补充缩放椭球高、高度偏移以及射线求交等方法。
 * @class Ellipsoid
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Ellipsoid.html}
*/

/**
 * 将给定点的高度缩放到指定的椭球高。
 * @param {Cartesian3} cartesian 待处理的点（世界坐标）。
 * @param {number} height 目标椭球高度，单位米。
 * @param {Cartesian3} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof Ellipsoid
*/
Ellipsoid.prototype.scaleToGeodeticHeight = function (cartesian, height, result) {
    Check.defined('cartesian', cartesian);
    Check.typeOf.number('height', height);
    const cartographic = this.cartesianToCartographic(cartesian, Scratch.scratchCartographic);
    cartographic.height = height;
    return this.cartographicToCartesian(cartographic, result);
};

/**
 * 在给定点当前高度的基础上偏移指定高度，返回新的位置。
 * @param {Cartesian3} cartesian 待处理的点（世界坐标）。
 * @param {number} [heightOffset=0] 高度偏移量，单位米。
 * @param {Cartesian3} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof Ellipsoid
*/
Ellipsoid.prototype.scaleGeodeticHeightOffset = function (cartesian, heightOffset = 0, result) {
    Check.defined('cartesian', cartesian);
    Check.typeOf.number('heightOffset', heightOffset);
    if (heightOffset === 0)
        return cartesian.clone(result);
    const cartographic = this.cartesianToCartographic(cartesian, Scratch.scratchCartographic);
    cartographic.height += heightOffset;
    return this.cartographicToCartesian(cartographic, result);
};

/**
 * 计算射线与椭球表面的交点。
 * @param {Ray} ray 射线。
 * @param {Cartesian3} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Cartesian3} 射线与椭球的交点；无交点时返回 undefined。
 * @memberof Ellipsoid
*/
Ellipsoid.prototype.rayPosition = function (ray, result) {
    Check.instanceOf('ray', ray, Ray);

    const intersection = IntersectionTests.rayEllipsoid(ray, this);
    if (!intersection) {
        return undefined;
    }

    const t = intersection.start > 0.0 ? intersection.start : intersection.stop;
    return Ray.getPoint(ray, t, result);
};

/**
 * 扩展 Cesium 的 Geometry 类，补充克隆、转线框以及获取包围球等方法。
 * @class Geometry
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Geometry.html}
*/

/**
 * 克隆一个 Geometry 对象。
 * @param {Geometry} geometry 待克隆的几何体。
 * @returns {Geometry} 克隆得到的新几何体。
 * @memberof Geometry
 * @static
*/
Geometry$1.clone = function (geometry) {
    return new Geometry$1({
        attributes: geometry.attributes,
        indices: geometry.indices,
        primitiveType: geometry.primitiveType,
        boundingSphere: geometry.boundingSphere
    });
};

/**
 * 克隆当前 Geometry 对象。
 * @returns {Geometry} 克隆得到的新几何体。
 * @memberof Geometry
*/
Geometry$1.prototype.clone = function () {
    return Geometry$1.clone(this);
};

/**
 * 将三角形类型的几何体转换为线框几何体；非三角形类型原样返回。
 * @param {Geometry} geometry 待转换的几何体。
 * @returns {Geometry} 转换后的线框几何体或原几何体。
 * @memberof Geometry
 * @static
*/
Geometry$1.toWireframe = function (geometry) {
    if (geometry.primitiveType !== PrimitiveType.TRIANGLES &&
        geometry.primitiveType !== PrimitiveType.TRIANGLE_FAN &&
        geometry.primitiveType !== PrimitiveType.TRIANGLE_STRIP) {
        return geometry;
    }

    return GeometryPipeline.toWireframe(geometry);
};

/**
 * 将当前几何体转换为线框几何体；非三角形类型原样返回。
 * @returns {Geometry} 转换后的线框几何体或原几何体。
 * @memberof Geometry
*/
Geometry$1.prototype.toWireframe = function () {
    return Geometry$1.toWireframe(this);
};

/**
 * 获取当前几何体的包围球，优先使用已计算的 boundingSphere，否则由顶点计算。
 * @param {BoundingSphere} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {BoundingSphere} 几何体的包围球。
 * @memberof Geometry
*/
Geometry$1.prototype.getBoundingSphere = function (result) {
    if (!result)
        result = new BoundingSphere();
    if (this.boundingSphere)
        this.boundingSphere.clone(result);
    else {
        const positions = this.attributes.position.values;
        BoundingSphere.fromVertices(positions, undefined, undefined, result);
    }
    return result;
};

/**
 * 扩展 Cesium 的 GlobeSurfaceTileProvider 类，补充地形分析访问属性与待渲染瓦片帧回调支持。
 * @class GlobeSurfaceTileProvider
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/GlobeSurfaceTileProvider.html}
*/
/**
 * 扩展 Cesium 的 Globe 类，补充地形分析（terrainAnalysis）属性。
 * @class Globe
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Globe.html}
*/

Object.defineProperties(GlobeSurfaceTileProvider.prototype, {
    /**
     * 获取当前的地形分析对象。
     * @type {TerrainAnalysis}
     * @memberof GlobeSurfaceTileProvider
    */
    terrainAnalysis: {
        get: function () {
            return this._terrainAnalysis;
        }
    }
});

let tilesToRender = [];

/**
 * 每帧调用，记录当前待渲染的瓦片；当瓦片集合发生变化时，
 * 通知各影像图层提供者的 onShowTilesToRenderFrame 回调。
 * @param {Array} tiles 本帧待渲染的瓦片数组。
 * @memberof GlobeSurfaceTileProvider
*/
GlobeSurfaceTileProvider.prototype.showTilesToRenderFrame = function (tiles) {
    let changed = false;
    if (tiles.length !== tilesToRender.length) {
        changed = true;
    } else {
        for (let i = tiles.length - 1; i >= 0; i--) {
            let a = tiles[i];
            let finded = false;
            for (let j = tilesToRender.length - 1; j >= 0; j--) {
                let b = tilesToRender[j];
                if (a === b) {
                    finded = true;
                    break;
                }
            }
            if (!finded) {
                changed = true;
                break;
            }
        }
    }
    if (changed) {
        tilesToRender = tiles.slice();
    }
    const imageryLayers = this._imageryLayers;
    for (let i = 0; i < imageryLayers.length; i++) {
        const layer = imageryLayers.get(i);
        const provider = layer.imageryProvider;
        if (provider && typeof provider.onShowTilesToRenderFrame === 'function') {
            provider.onShowTilesToRenderFrame(tiles, changed);
        }
    }
};

Object.defineProperties(Globe.prototype, {
    /**
     * 获取或设置地形分析对象；设置时会将其绑定到当前 Globe。
     * @type {TerrainAnalysis}
     * @memberof Globe
    */
    terrainAnalysis: {
        get: function () {
            return this._surface._tileProvider._terrainAnalysis;
        },
        set: function (value) {
            if (value) {
                Check.instanceOf('terrainAnalysis', value, TerrainAnalysis);
                this._surface._tileProvider._terrainAnalysis = value;
                value.globe = this;
            } else {
                delete this._surface._tileProvider._terrainAnalysis;
            }
        }
    }
});

/**
 * 扩展 Cesium 的 HeadingPitchRoll 类，补充偏航角别名、角度转换，
 * 与四元数/欧拉角互转、取反以及打包解包等方法。
 * @class HeadingPitchRoll
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/HeadingPitchRoll.html}
*/

Object.defineProperties(HeadingPitchRoll.prototype, {
    /**
     * heading 的别名，获取/设置偏航角（弧度制）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    yaw: {
        set: function (value) {
            this.heading = value;
        },
        get: function () {
            return this.heading;
        }
    },
    /**
     * 获取航向角（角度制，单位度）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    headingDegrees: {
        get: function () {
            return Math$1.toDegrees(this.heading);
        }
    },
    /**
     * 获取偏航角（角度制，单位度），等同于 headingDegrees。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    yawDegrees: {
        get: function () {
            return this.headingDegrees;
        }
    },
    /**
     * 获取俯仰角（角度制，单位度）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    pitchDegrees: {
        get: function () {
            return Math$1.toDegrees(this.pitch);
        }
    },
    /**
     * 获取横滚角（角度制，单位度）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    rollDegrees: {
        get: function () {
            return Math$1.toDegrees(this.roll);
        }
    },
});

/**
 * 由航向、俯仰、横滚角（弧度制）创建 HeadingPitchRoll。
 * @param {number} heading 航向角（弧度）。
 * @param {number} pitch 俯仰角（弧度）。
 * @param {number} roll 横滚角（弧度）。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.fromRadians = function (heading, pitch, roll, result = new HeadingPitchRoll()) {
    Check.typeOf.number('heading', heading);
    Check.typeOf.number('pitch', pitch);
    Check.typeOf.number('roll', roll);

    result.heading = heading;
    result.pitch = pitch;
    result.roll = roll;
    return result;
};

/**
 * 由旋转矩阵创建 HeadingPitchRoll。
 * @param {Matrix3} rotationMatrix 旋转矩阵。
 * @param {HeadingPitchRoll} [result] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.fromRotationMatrix = function (rotationMatrix, result) {
    const quaternion = Quaternion.fromRotationMatrix(rotationMatrix, Scratch.scratchQuaternion);
    return HeadingPitchRoll.fromQuaternion(quaternion, result);
};

/**
 * 将 HeadingPitchRoll 转换为四元数。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {Quaternion} [result] 存放结果的对象。
 * @returns {Quaternion} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toQuaternion = function (hpr, result) {
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

/**
 * 将当前 HeadingPitchRoll 转换为四元数。
 * @param {Quaternion} [result] 存放结果的对象。
 * @returns {Quaternion} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toQuaternion = function (result) {
    return HeadingPitchRoll.toQuaternion(this, result);
};

/**
 * 将 HeadingPitchRoll 转换为角度制对象（包含 heading/pitch/roll/yaw，单位度）。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {object} [result={}] 存放结果的对象。
 * @returns {object} 修改后的 result 或新建的对象。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toDegrees = function (hpr, result = {}) {
    Check.defined('headingPitchRoll', hpr);

    result.heading = Math$1.toDegrees(hpr.heading);
    result.pitch = Math$1.toDegrees(hpr.pitch);
    result.roll = Math$1.toDegrees(hpr.roll);
    result.yaw = result.heading;
    return result;
};

/**
 * 将当前 HeadingPitchRoll 转换为角度制对象（包含 heading/pitch/roll/yaw，单位度）。
 * @param {object} [result] 存放结果的对象。
 * @returns {object} 修改后的 result 或新建的对象。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toDegrees = function (result) {
    return HeadingPitchRoll.toDegrees(this, result);
};

/**
 * 将 HeadingPitchRoll 转换为欧拉角（Cartesian3，弧度制）。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toEuler = function (hpr, result) {
    return Cartesian3.fromElements(hpr.roll, -hpr.pitch, -hpr.heading, result);
};

/**
 * 将当前 HeadingPitchRoll 转换为欧拉角（Cartesian3，弧度制）。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toEuler = function (result) {
    return HeadingPitchRoll.toEuler(this, result);
};

/**
 * 将 HeadingPitchRoll 转换为欧拉角（Cartesian3，角度制）。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toEulerDegrees = function (hpr, result) {
    const euler = HeadingPitchRoll.toEuler(hpr, result);
    euler.x = Math$1.toDegrees(euler.x);
    euler.y = Math$1.toDegrees(euler.y);
    euler.z = Math$1.toDegrees(euler.z);
    return euler;
};

/**
 * 将当前 HeadingPitchRoll 转换为欧拉角（Cartesian3，角度制）。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toEulerDegrees = function (result) {
    return HeadingPitchRoll.toEulerDegrees(this, result);
};

/**
 * 计算 HeadingPitchRoll 的逆（航向、俯仰、横滚各角取反）。
 * @param {HeadingPitchRoll} hpr 待取反的 HeadingPitchRoll。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.inverse = function (hpr, result = new HeadingPitchRoll()) {
    Check.defined('headingPitchRoll', hpr);

    result.heading = -hpr.heading;
    result.pitch = -hpr.pitch;
    result.roll = -hpr.roll;
    return result;
};

/**
 * 计算当前 HeadingPitchRoll 的逆（各角取反）。
 * @param {HeadingPitchRoll} [result] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.inverse = function (result) {
    return HeadingPitchRoll.inverse(this, result);
};

/**
 * 打包该对象到数组时占用的元素个数。
 * @type {number}
 * @constant
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.packedLength = 3;

/**
 * 将 HeadingPitchRoll 打包到数组中。
 * @param {HeadingPitchRoll} value 待打包的 HeadingPitchRoll。
 * @param {Array} [array=[]] 输出结果的数组。
 * @param {number} [startingIndex=0] 数组开始索引。
 * @returns {Array} 返回修改后的 array 数组。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.pack = function (value, array = [], startingIndex = 0) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("value", value);
    //>>includeEnd('debug');

    array[startingIndex++] = value.heading;
    array[startingIndex++] = value.pitch;
    array[startingIndex] = value.roll;
    return array;
};

/**
 * 将数组解包为 HeadingPitchRoll。
 * @param {Array} array 输入的数组。
 * @param {number} [startingIndex=0] 数组开始索引。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.unpack = function (array, startingIndex = 0, result = new HeadingPitchRoll()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    result.heading = array[startingIndex++];
    result.pitch = array[startingIndex++];
    result.roll = array[startingIndex];
    return result;
};

/**
 * 将 HeadingPitchRoll 数组打包到数组中。
 * @param {Array<HeadingPitchRoll>} hprs HeadingPitchRoll 数组。
 * @param {Array} [result=[]] 输出结果的数组。
 * @returns {Array} 返回修改后的 result 数组。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.packArray = function (hprs, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("hprs", hprs);
    //>>includeEnd('debug');

    let startingIndex = 0;
    for (let i = 0; i < hprs.length; i++) {
        HeadingPitchRoll.pack(hprs[i], result, startingIndex);
        startingIndex += HeadingPitchRoll.packedLength;
    }
    return result;
};

/**
 * 将数组解包为 HeadingPitchRoll 数组。
 * @param {Array} array 输入的数组。
 * @param {Array} [result=[]] 输出结果的数组。
 * @returns {Array<HeadingPitchRoll>} 返回修改后的 result 数组。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.unpackArray = function (array, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    result.length = array.length / HeadingPitchRoll.packedLength;

    let startingIndex = 0;
    for (let i = 0; i < result.length; i++) {
        result[i] = HeadingPitchRoll.unpack(array, startingIndex);
        startingIndex += HeadingPitchRoll.packedLength;
    }
    return result;
};

/**
 * 值为 (0.0, 0.0, 0.0) 的不可变 HeadingPitchRoll 实例。
 * @type {HeadingPitchRoll}
 * @constant
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.ZERO = Object.freeze(new HeadingPitchRoll(0.0, 0.0, 0.0));

/**
 * 扩展 Cesium 的 JulianDate 类，补充转换为 JavaScript Date 与公历日期的方法。
 * @class JulianDate
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/JulianDate.html}
*/

/**
 * 将当前 JulianDate 转换为 JavaScript Date 对象。
 * @returns {Date} 对应的 JavaScript Date 对象。
 * @memberof JulianDate
*/
JulianDate.prototype.toDate = function () {
    return JulianDate.toDate(this);
};

/**
 * 将当前 JulianDate 转换为公历日期对象。
 * @returns {GregorianDate} 对应的公历日期对象。
 * @memberof JulianDate
*/
JulianDate.prototype.toGregorianDate = function () {
    return JulianDate.toGregorianDate(this);
};

// import setOptions from '@lijuhong1981/jslib/src/setParameters.js';
// import WaterMaterial from '../materials/WaterMaterial.js';

/**
 * 扩展 Cesium 的 Material 类，补充 BasicImage、ConverageArea、PolylineTrail、ImageTransform
 * 等自定义材质类型。
 * @class Material
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Material.html}
*/
/**
 * 扩展 Cesium 的 MaterialProperty 类，补充按材质类型或材质实例创建属性对象的方法。
 * @class MaterialProperty
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/MaterialProperty.html}
*/

// Material.prototype.setOptions = function (options) {
//     setOptions(this, options);
// };

// Material.defaultWaterMaterial = WaterMaterial.default;

/**
 * MaterialProperty 的常量实现：按指定的材质类型与 uniform 直接返回材质参数。
 * @class MaterialPropertyImpl
 * @private
*/
class MaterialPropertyImpl {
    constructor(type, uniforms = {}, isConstent = true) {
        Check.defined('type', type);
        this._type = type;
        this._uniforms = uniforms;
        this._isConstant = isConstent;
        this._definitionChanged = new Event();
    }

    get isConstant() {
        return this._isConstant;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return this._type;
    }

    getValue(time, uniforms) {
        for (const key in this._uniforms) {
            if (Object.hasOwnProperty.call(this._uniforms, key)) {
                uniforms[key] = this._uniforms[key];
            }
        }
        return uniforms;
    }

    equals(other) {
        return (this._type === other._type && this._uniforms === other._uniforms);
    }
}
/**
 * 按材质类型与 uniform 创建 MaterialProperty。
 * @param {string} type 材质类型。
 * @param {object} [uniforms={}] 材质参数（uniform）。
 * @param {boolean} [isConstent=true] 是否为常量材质。
 * @returns {MaterialProperty} 创建的 MaterialProperty 实例。
 * @memberof MaterialProperty
 * @static
*/
MaterialProperty.fromType = function (type, uniforms, isConstent) {
    return new MaterialPropertyImpl(type, uniforms, isConstent);
};

/**
 * MaterialProperty 的实例实现：基于已有的 Material 对象返回材质参数。
 * @class MaterialInstanceProperty
 * @private
*/
class MaterialInstanceProperty {
    constructor(material, uniforms = {}, isConstent = true) {
        Check.defined('material', material);
        this._material = material;
        this._uniforms = uniforms;
        this._isConstant = isConstent;
        this._definitionChanged = new Event();
    }

    get material() {
        return this._material;
    }

    get isConstant() {
        return this._isConstant;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return this._material.type;
    }

    getValue(time, uniforms) {
        for (const key in this._uniforms) {
            if (Object.hasOwnProperty.call(this._uniforms, key)) {
                uniforms[key] = this._uniforms[key];
            }
        }
        return uniforms;
    }

    equals(other) {
        return this._material === other._material;
    }
}

/**
 * 按已有 Material 实例与 uniform 创建 MaterialProperty。
 * @param {Material} material 材质实例。
 * @param {object} [uniforms={}] 材质参数（uniform）。
 * @param {boolean} [isConstent=true] 是否为常量材质。
 * @returns {MaterialProperty} 创建的 MaterialProperty 实例。
 * @memberof MaterialProperty
 * @static
*/
MaterialProperty.fromMaterial = function (material, uniforms, isConstent) {
    return new MaterialInstanceProperty(material, uniforms, isConstent);
};

const BasicImageType = 'BasicImage';

/**
 * BasicImage 材质类型标识（基于 uv 贴图与颜色渲染）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.BasicImageType = BasicImageType;
//添加BasicImageType材质
Material._materialCache.addMaterial(BasicImageType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: BasicImageType, //材质类型
        uniforms: { //接受的参数
            image: Material.DefaultImageId, //普通uv贴图
            color: new Color(), //颜色
            // translucent: true, //是否透明
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n" + //固定写法，重载czm_getMaterial函数
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" + //获取默认材质
            "   vec2 st = materialInput.st;\n" + //获取uv
            "   vec4 imageColor = texture(image, st);\n" + //从uv贴图中获取imageColor
            "   material.diffuse = imageColor.rgb * color.rgb;\n" + //与外部传入color相乘得到最终渲染color，material.diffuse为最终渲染至屏幕上的color
            // "   if (translucent)\n" +
            "       material.alpha = imageColor.a * color.a;\n" + //translucent开启，则alpha值也相乘
            // "   else\n" +
            // "       material.alpha = imageColor.a;\n" + //translucent未开启
            "   return material;\n" +
            "}",
    },
    translucent: function (material) {
        return material.uniforms.color.alpha < 1.0;
    }
});

//定义ConverageAreaType
const ConverageAreaType = 'ConverageArea';

/**
 * ConverageArea 材质类型标识（用于覆盖区域裁剪的材质）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.ConverageAreaType = ConverageAreaType;
//添加Material材质
Material._materialCache.addMaterial(ConverageAreaType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: ConverageAreaType, //材质类型
        uniforms: { //接受的参数
            outsideOfConverageArea: false,
            converageAreaPlanes: Material.DefaultImageId,
            converageAreaPlanesMatrix: Matrix4.IDENTITY.clone(),
        },
        source: "uniform bool outsideOfConverageArea;\n" +
            "uniform highp sampler2D converageAreaPlanes;\n" +
            "uniform mat4 converageAreaPlanesMatrix;\n" +
            '\n' +
            "czm_material czm_getMaterial(czm_materialInput materialInput)\n" +
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" +
            "   bool isConverage = isConverageArea(gl_FragCoord, converageAreaPlanes, converageAreaPlanesMatrix);\n" +
            "   isConverage = (outsideOfConverageArea ? !isConverage : isConverage);\n" +
            "   if (!isConverage)\n" +
            "   {\n" +
            "       material.alpha = 0.0;\n" +
            "       return material;\n" +
            "   }\n" +
            "   return material;\n" +
            "}\n",
    },
    translucent: false,
});

const PolylineTrailType = 'PolylineTrail';

/**
 * PolylineTrail 材质类型标识（用于线尾迹效果的材质）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.PolylineTrailType = PolylineTrailType;

Material._materialCache.addMaterial(PolylineTrailType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: PolylineTrailType, //材质类型
        uniforms: { //接受的参数
            color: new Color(1.0, 1.0, 1.0, 1.0), //颜色
            trailLength: 1.0,
            trailColor: new Color(1.0, 1.0, 1.0, 1.0),
            trailImage: Material.DefaultImageId,
            enableGlow: false,
            glowPower: 0.25,
            offset: 0,
            reverse: false,
            // translucent: true, //是否透明
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n" + //固定写法，重载czm_getMaterial函数
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" + //获取默认材质
            "   material.diffuse = color.rgb;\n" +
            "   material.alpha = color.a;\n" +
            "   vec2 st = materialInput.st;\n" + //获取uv
            "   float s = fract(st.s - offset);\n" +
            "   if (s <= trailLength) {\n" +
            "       st.s = s / trailLength;\n" +
            "       if (reverse) st.s = 1.0 - st.s;\n" +
            "       vec4 imageColor = texture(trailImage, st);\n" + //从uv贴图中获取imageColor
            "       material.diffuse = imageColor.rgb * trailColor.rgb;\n" +
            "       material.alpha = imageColor.a * trailColor.a;\n" +
            "   }\n" +
            "   if (enableGlow) {\n" +
            "       float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);\n" + //计算glow
            "       vec4 glowColor;\n" +
            "       glowColor.rgb = max(vec3(glow - 1.0 + material.diffuse), material.diffuse);\n" +
            "       glowColor.a = clamp(0.0, 1.0, glow) * material.alpha;\n" +
            "       glowColor = czm_gammaCorrect(glowColor);\n" +
            "       material.emission = glowColor.rgb;\n" +
            "       material.alpha = glowColor.a;\n" +
            "   }\n" +
            "   return material;\n" +
            "}",
    },
    translucent: function (material) {
        const uniforms = material.uniforms;
        return uniforms.color.alpha < 1.0 || uniforms.trailColor.alpha < 1.0;
    }
});

//定义ImageTransformType
const ImageTransformType = 'ImageTransform';

/**
 * ImageTransform 材质类型标识（基于贴图变换矩阵的材质）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.ImageTransformType = ImageTransformType;
//添加ImageTransformType材质
Material._materialCache.addMaterial(ImageTransformType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: ImageTransformType, //材质类型
        uniforms: { //接受的参数
            image: Material.DefaultImageId, //普通uv贴图
            stTransform: Matrix3.IDENTITY.clone(), //贴图变换矩阵
            color: new Color(), //颜色
            // translucent: true, //是否透明
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n" + //固定写法，重载czm_getMaterial函数
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" + //获取默认材质
            "   vec2 st = materialInput.st;\n" + //获取uv
            "   st = fract((stTransform * vec3(st, 1.0)).xy);\n" + //计算变换后uv
            "   vec4 imageColor = texture(image, st);\n" + //从uv贴图中获取imageColor
            "   material.diffuse = imageColor.rgb * color.rgb;\n" + //与外部传入color相乘得到最终渲染color，material.diffuse为最终渲染至屏幕上的color
            // "   if (translucent)\n" +
            "       material.alpha = imageColor.a * color.a;\n" + //translucent开启，则alpha值也相乘
            // "   else\n" +
            // "       material.alpha = imageColor.a;\n" + //translucent未开启
            "   return material;\n" +
            "}",
    },
    translucent: function (material) {
        return material.uniforms.color.alpha < 1.0;
    }
});

/**
 * 扩展 Cesium 的 Math（CesiumMath）类，补充 WGS84 相关常量，
 * 以及数值区间判断、随机数等方法。
 * @class CesiumMath
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Math.html}
*/

/**
 * WGS84 椭球体的平均半径，单位米。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
Math$1.WGS84_RADIUS = 6378137.0;

/**
 * WGS84 椭球体的赤道周长，单位米。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
Math$1.WGS84_CIRCUM = 2 * Math.PI * Math$1.WGS84_RADIUS;

/**
 * WGS84 椭球体每米对应的经度/纬度度数。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
Math$1.WGS84_DEGREES_PER_METERS = 360.0 / Math$1.WGS84_CIRCUM;

/**
 * WGS84 椭球体每度对应的米数。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
Math$1.WGS84_METERS_PER_DEGREES = Math$1.WGS84_CIRCUM / 360.0;

/**
 * 判断数值是否在指定的闭区间 [min, max] 内。
 * @param {number} value 待判断的数值。
 * @param {number} min 区间最小值。
 * @param {number} max 区间最大值。
 * @returns {boolean} 若 value 在 [min, max] 内返回 true，否则返回 false。
 * @memberof CesiumMath
 * @static
*/
Math$1.between = function (value, min, max) {
    Check.typeOf.number('value', value);
    Check.typeOf.number('min', min);
    Check.typeOf.number('max', max);
    if (value < min || value > max)
        return false;
    return true;
};

/**
 * 生成 [min, max) 区间内的随机浮点数。
 * @param {number} min 区间最小值（包含）。
 * @param {number} max 区间最大值（不包含）。
 * @returns {number} 随机浮点数。
 * @memberof CesiumMath
 * @static
*/
Math$1.randomNumber = function (min, max) {
    return Math$1.randomBetween(min, max);
};

/**
 * 生成 [min, max] 区间内的随机整数。
 * @param {number} [min=0] 区间最小值（包含）。
 * @param {number} [max=Number.MAX_SAFE_INTEGER-1] 区间最大值（包含）。
 * @returns {number} 随机整数。
 * @memberof CesiumMath
 * @static
*/
Math$1.randomIntegerBetween = function (min = 0, max = Number.MAX_SAFE_INTEGER - 1) {
    const result = Math$1.randomBetween(min, max + 1);
    return Math.floor(result);
};

/**
 * 生成 [min, max] 区间内的随机整数。
 * @param {number} min 区间最小值（包含）。
 * @param {number} max 区间最大值（包含）。
 * @returns {number} 随机整数。
 * @memberof CesiumMath
 * @static
*/
Math$1.randomInteger = function (min, max) {
    return Math$1.randomIntegerBetween(min, max);
};

/**
 * 扩展 Cesium 的 Matrix3 类，补充列/行向量存取、旋转分量、四元数、
 * 航向俯仰横滚角、缩放等便捷方法。
 * @class Matrix3
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Matrix3.html}
*/
/**
 * 扩展 Cesium 的 Matrix4 类，补充从四元数、航向俯仰横滚角、欧拉角创建矩阵，
 * 以及旋转、平移、缩放、四元数、欧拉角等便捷方法。
 * @class Matrix4
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Matrix4.html}
*/

//--Matrix3--

/**
 * 获取矩阵指定列的列向量。
 * @param {number} index 列索引（0、1 或 2）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定列的列向量。
 * @memberof Matrix3
*/
Matrix3.prototype.getColumn = function (index, result = new Cartesian3()) {
    return Matrix3.getColumn(this, index, result);
};

/**
 * 获取矩阵指定行的行向量。
 * @param {number} index 行索引（0、1 或 2）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定行的行向量。
 * @memberof Matrix3
*/
Matrix3.prototype.getRow = function (index, result = new Cartesian3()) {
    return Matrix3.getRow(this, index, result);
};

/**
 * 设置当前矩阵的旋转分量。
 * @param {Matrix3} rotation 旋转矩阵。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setRotation = function (rotation) {
    return Matrix3.setRotation(this, rotation, this);
};

/**
 * 获取当前矩阵的旋转分量。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 旋转矩阵。
 * @memberof Matrix3
*/
Matrix3.prototype.getRotation = function (result = new Matrix3()) {
    return Matrix3.getRotation(this, result);
};

/**
 * 通过四元数设置矩阵的旋转分量。
 * @param {Matrix3} matrix 待修改的矩阵。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 修改或生成后的矩阵。
 * @memberof Matrix3
 * @static
*/
Matrix3.setQuaternion = function (matrix, quaternion, result = new Matrix3()) {
    Check.instanceOf('matrix', matrix, Matrix3);
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const rotation = Matrix3.fromQuaternion(quaternion, Scratch.scratchRotationMatrix);
    return Matrix3.setRotation(matrix, rotation, result);
};

/**
 * 通过四元数设置当前矩阵的旋转分量。
 * @param {Quaternion} quaternion 旋转四元数。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setQuaternion = function (quaternion) {
    return Matrix3.setQuaternion(this, quaternion, this);
};

/**
 * 获取矩阵旋转分量对应的四元数。
 * @param {Matrix3} matrix 目标矩阵。
 * @param {Quaternion} [result=new Quaternion()] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix3
 * @static
*/
Matrix3.getQuaternion = function (matrix, result = new Quaternion()) {
    const rotation = Matrix3.getRotation(matrix, Scratch.scratchRotationMatrix);
    return Quaternion.fromRotationMatrix(rotation, result);
};

/**
 * 获取当前矩阵旋转分量对应的四元数。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix3
*/
Matrix3.prototype.getQuaternion = function (result) {
    return Matrix3.getQuaternion(this, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置矩阵的旋转分量。
 * @param {Matrix3} matrix 待修改的矩阵。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 修改或生成后的矩阵。
 * @memberof Matrix3
 * @static
*/
Matrix3.setHeadingPitchRoll = function (matrix, headingPitchRoll, result = new Matrix3()) {
    Check.instanceOf('matrix', matrix, Matrix3);
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const rotation = Matrix3.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchRotationMatrix);
    return Matrix3.setRotation(matrix, rotation, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置当前矩阵的旋转分量。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setHeadingPitchRoll = function (headingPitchRoll) {
    return Matrix3.setHeadingPitchRoll(this, headingPitchRoll, this);
};

/**
 * 获取矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {Matrix3} matrix 目标矩阵。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix3
 * @static
*/
Matrix3.getHeadingPitchRoll = function (matrix, result = new HeadingPitchRoll()) {
    const rotation = Matrix3.getRotation(matrix, Scratch.scratchRotationMatrix);
    return HeadingPitchRoll.fromRotationMatrix(rotation, result);
};

/**
 * 获取当前矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix3
*/
Matrix3.prototype.getHeadingPitchRoll = function (result) {
    return Matrix3.getHeadingPitchRoll(this, result);
};

/**
 * 设置当前矩阵的缩放分量。
 * @param {Cartesian3} scale 缩放比例。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setScale = function (scale) {
    return Matrix3.setScale(this, scale, this);
};

/**
 * 获取当前矩阵的缩放分量。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 缩放比例。
 * @memberof Matrix3
*/
Matrix3.prototype.getScale = function (result) {
    return Matrix3.getScale(this, result);
};

/**
 * 将当前矩阵转换为按列优先排列的数组。
 * @param {Array} [result] 用于存储结果的数组。
 * @returns {Array} 矩阵元素的数组表示。
 * @memberof Matrix3
*/
Matrix3.prototype.toArray = function (result) {
    return Matrix3.toArray(this, result);
};

//--Matrix4--

/**
 * 从航向、俯仰、横滚（HeadingPitchRoll）创建一个只含旋转分量的 Matrix4。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 生成的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.fromHeadingPitchRoll = function (headingPitchRoll, result = new Matrix4()) {
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const rotation = Matrix3.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchRotationMatrix);
    return Matrix4.fromRotationTranslation(rotation, undefined, result);
};

/**
 * 从四元数创建一个只含旋转分量的 Matrix4。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 生成的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.fromQuaternion = function (quaternion, result = new Matrix4()) {
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const rotation = Matrix3.fromQuaternion(quaternion, Scratch.scratchRotationMatrix);
    return Matrix4.fromRotationTranslation(rotation, undefined, result);
};

/**
 * 获取矩阵指定列的列向量。
 * @param {number} index 列索引（0、1、2 或 3）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定列的列向量。
 * @memberof Matrix4
*/
Matrix4.prototype.getColumn = function (index, result = new Cartesian3()) {
    return Matrix4.getColumn(this, index, result);
};

/**
 * 获取矩阵指定行的行向量。
 * @param {number} index 行索引（0、1、2 或 3）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定行的行向量。
 * @memberof Matrix4
*/
Matrix4.prototype.getRow = function (index, result = new Cartesian3()) {
    return Matrix4.getRow(this, index, result);
};

/**
 * 设置当前矩阵的旋转分量（3x3 部分）。
 * @param {Matrix3} rotation 旋转矩阵。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setRotation = function (rotation) {
    return Matrix4.setRotation(this, rotation, this);
};

/**
 * 获取当前矩阵的旋转分量（3x3 部分）。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 旋转矩阵。
 * @memberof Matrix4
*/
Matrix4.prototype.getRotation = function (result = new Matrix3()) {
    return Matrix4.getRotation(this, result);
};

/**
 * 设置当前矩阵的缩放分量。
 * @param {Cartesian3} scale 缩放比例。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setScale = function (scale) {
    return Matrix4.setScale(this, scale, this);
};

/**
 * 获取当前矩阵的缩放分量。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 缩放比例。
 * @memberof Matrix4
*/
Matrix4.prototype.getScale = function (result = new Cartesian3()) {
    return Matrix4.getScale(this, result);
};

/**
 * 设置当前矩阵的平移分量。
 * @param {Cartesian3} translation 平移量。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setTranslation = function (translation) {
    return Matrix4.setTranslation(this, translation, this);
};

/**
 * 获取当前矩阵的平移分量。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 平移量。
 * @memberof Matrix4
*/
Matrix4.prototype.getTranslation = function (result = new Cartesian3()) {
    return Matrix4.getTranslation(this, result);
};

/**
 * 通过四元数设置矩阵的旋转分量，保留原有的平移与缩放。
 * @param {Matrix4} matrix 待修改的矩阵。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 修改或生成后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.setQuaternion = function (matrix, quaternion, result = new Matrix4()) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const translation = Matrix4.getTranslation(matrix, Scratch.scratchTranslation);
    const scale = Matrix4.getScale(matrix, Scratch.scratchScale3);
    const translationRotationScale = new TranslationRotationScale(translation, quaternion, scale);
    return Matrix4.fromTranslationRotationScale(translationRotationScale, result);
};

/**
 * 通过四元数设置当前矩阵的旋转分量，保留原有的平移与缩放。
 * @param {Quaternion} quaternion 旋转四元数。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setQuaternion = function (quaternion) {
    return Matrix4.setQuaternion(this, quaternion, this);
};

/**
 * 获取矩阵旋转分量对应的四元数。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {Quaternion} [result=new Quaternion()] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix4
 * @static
*/
Matrix4.getQuaternion = function (matrix, result = new Quaternion()) {
    Check.instanceOf('matrix', matrix, Matrix4);

    const rotation = Matrix4.getRotation(matrix, Scratch.scratchRotationMatrix);
    return Quaternion.fromRotationMatrix(rotation, result);
};

/**
 * 获取当前矩阵旋转分量对应的四元数。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix4
*/
Matrix4.prototype.getQuaternion = function (result) {
    return Matrix4.getQuaternion(this, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置矩阵的旋转分量。
 * @param {Matrix4} matrix 待修改的矩阵。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 修改或生成后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.setHeadingPitchRoll = function (matrix, headingPitchRoll, result) {
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const quaternion = Quaternion.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchQuaternion);
    return Matrix4.setQuaternion(matrix, quaternion, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置当前矩阵的旋转分量。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setHeadingPitchRoll = function (headingPitchRoll) {
    return Matrix4.setHeadingPitchRoll(this, headingPitchRoll, this);
};

/**
 * 获取矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix4
 * @static
*/
Matrix4.getHeadingPitchRoll = function (matrix, result = new HeadingPitchRoll()) {
    const quaternion = Matrix4.getQuaternion(matrix, Scratch.scratchQuaternion);
    return HeadingPitchRoll.fromQuaternion(quaternion, result);
};

/**
 * 获取当前矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix4
*/
Matrix4.prototype.getHeadingPitchRoll = function (result) {
    return Matrix4.getHeadingPitchRoll(this, result);
};

/**
 * 通过欧拉角设置矩阵的旋转分量。
 * @param {Matrix4} matrix 待修改的矩阵。
 * @param {object} eulerAngle 欧拉角对象。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 修改或生成后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.setEuler = function (matrix, eulerAngle, result) {
    Check.typeOf.object('eulerAngle', eulerAngle);

    const quaternion = parseEulerToQuaternion(eulerAngle, Scratch.scratchQuaternion);
    return Matrix4.setQuaternion(matrix, quaternion, result);
};

/**
 * 通过欧拉角设置当前矩阵的旋转分量。
 * @param {object} eulerAngle 欧拉角对象。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setEuler = function (eulerAngle) {
    return Matrix4.setEuler(this, eulerAngle, this);
};

/**
 * 获取矩阵旋转分量对应的欧拉角。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 欧拉角。
 * @memberof Matrix4
 * @static
*/
Matrix4.getEuler = function (matrix, result = new Cartesian3()) {
    const hpr = Matrix4.getHeadingPitchRoll(matrix, Scratch.scratchHeadingPitchRoll);
    return hpr.toEuler(result);
};

/**
 * 获取当前矩阵旋转分量对应的欧拉角。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 欧拉角。
 * @memberof Matrix4
*/
Matrix4.prototype.getEuler = function (result) {
    return Matrix4.getEuler(this, result);
};

/**
 * Matrix4.getRotation 的别名，获取矩阵的旋转分量（Matrix3）。
 * @type {function}
 * @memberof Matrix4
 * @static
*/
Matrix4.getRotationMatrix = Matrix4.getRotation;

/**
 * 获取矩阵的平移、旋转、缩放分量并组装为 TranslationRotationScale。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {TranslationRotationScale} [result=new TranslationRotationScale()] 用于存储结果的可选对象。
 * @returns {TranslationRotationScale} 平移、旋转、缩放组合对象。
 * @memberof Matrix4
 * @static
*/
Matrix4.getTranslationRotationScale = function (matrix, result = new TranslationRotationScale()) {
    Check.instanceOf('matrix', matrix, Matrix4);

    Matrix4.getTranslation(matrix, result.translation);
    Matrix4.getQuaternion(matrix, result.rotation);
    Matrix4.getScale(matrix, result.scale);
    return result;
};

/**
 * 获取当前矩阵的平移、旋转、缩放分量并组装为 TranslationRotationScale。
 * @param {TranslationRotationScale} [result] 用于存储结果的可选对象。
 * @returns {TranslationRotationScale} 平移、旋转、缩放组合对象。
 * @memberof Matrix4
*/
Matrix4.prototype.getTranslationRotationScale = function (result) {
    return Matrix4.getTranslationRotationScale(this, result);
};

/**
 * 将矩阵与四元数表示的旋转相乘。
 * @param {Matrix4} matrix 原矩阵。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByQuaternion = function (matrix, quaternion, result = new Matrix4()) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const rotation = Matrix3.fromQuaternion(quaternion, Scratch.scratchRotationMatrix);
    return Matrix4.multiplyByMatrix3(matrix, rotation, result);
};

/**
 * 将矩阵与航向、俯仰、横滚角表示的旋转相乘。
 * @param {Matrix4} matrix 原矩阵。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByHeadingPitchRoll = function (matrix, headingPitchRoll, result = new Matrix4()) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const rotation = Matrix3.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchRotationMatrix);
    return Matrix4.multiplyByMatrix3(matrix, rotation, result);
};

/**
 * 将矩阵与欧拉角表示的旋转相乘。
 * @param {Matrix4} matrix 原矩阵。
 * @param {object} eulerAngle 欧拉角对象。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByEuler = function (matrix, eulerAngle, result) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.typeOf.object('eulerAngle', eulerAngle);

    const hpr = parseEulerToHeadingPitchRoll(eulerAngle, Scratch.scratchHeadingPitchRoll);
    return Matrix4.multiplyByHeadingPitchRoll(matrix, hpr, result);
};

/**
 * 将矩阵与旋转相乘，旋转类型可为 HeadingPitchRoll、Quaternion、Matrix3 或欧拉角。
 * @param {Matrix4} matrix 原矩阵。
 * @param {HeadingPitchRoll|Quaternion|Matrix3|object} rotation 旋转量，支持航向俯仰横滚角、四元数、旋转矩阵或欧拉角。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByRotation = function (matrix, rotation, result) {
    if (rotation instanceof HeadingPitchRoll)
        Matrix4.multiplyByHeadingPitchRoll(matrix, rotation, result);
    else if (rotation instanceof Quaternion)
        Matrix4.multiplyByQuaternion(matrix, rotation, result);
    else if (rotation instanceof Matrix3)
        Matrix4.multiplyByMatrix3(matrix, rotation, result);
    else
        Matrix4.multiplyByEuler(matrix, rotation, result);

    return result;
};

/**
 * 将当前矩阵转换为按列优先排列的数组。
 * @param {Array} [result] 用于存储结果的数组。
 * @returns {Array} 矩阵元素的数组表示。
 * @memberof Matrix4
*/
Matrix4.prototype.toArray = function (result) {
    return Matrix4.toArray(this, result);
};

/**
 * 扩展 Cesium 的 Plane 类，补充通过共面点创建平面、克隆等方法。
 * @class Plane
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Plane.html}
*/

/**
 * 通过三个共面点创建平面。
 * @param {Cartesian3} a 平面上第一个点。
 * @param {Cartesian3} b 平面上第二个点。
 * @param {Cartesian3} c 平面上第三个点。
 * @param {Plane} [result] 用于存储结果的可选对象。
 * @returns {Plane} 生成的平面。
 * @memberof Plane
 * @static
*/
Plane.fromCoplanarPoints = function (a, b, c, result) {

    // from threejs
    // const normal = _vector1.subVectors(c, b).cross(_vector2.subVectors(a, b)).normalize();
    const vectorA = Cartesian3.subtract(c, b, Scratch.scratchLeftCartesian3);
    const vectorB = Cartesian3.subtract(a, b, Scratch.scratchRightCartesian3);
    const normal = Cartesian3.cross(vectorA, vectorB, Scratch.scratchNormal);
    normal.normalize();

    return Plane.fromPointNormal(a, normal, result);
};

/**
 * 克隆当前平面。
 * @param {Plane} [result] 用于存储结果的可选对象。
 * @returns {Plane} 克隆得到的平面。
 * @memberof Plane
*/
Plane.prototype.clone = function (result) {
    return Plane.clone(this, result);
};

/**
 * 扩展 Cesium 的 Billboard 类，补充类型标识与从集合移除的便捷方法。
 * @class Billboard
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Billboard.html}
*/
/**
 * 扩展 Cesium 的 BillboardCollection 类，补充计算包围球的方法。
 * @class BillboardCollection
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/BillboardCollection.html}
*/
/**
 * 扩展 Cesium 的 Label 类，补充类型标识与从集合移除的便捷方法。
 * @class Label
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Label.html}
*/
/**
 * 扩展 Cesium 的 LabelCollection 类，补充计算包围球的方法。
 * @class LabelCollection
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/LabelCollection.html}
*/
/**
 * 扩展 Cesium 的 PointPrimitive 类，补充类型标识与从集合移除的便捷方法。
 * @class PointPrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PointPrimitive.html}
*/
/**
 * 扩展 Cesium 的 PointPrimitiveCollection 类，补充计算包围球的方法。
 * @class PointPrimitiveCollection
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PointPrimitiveCollection.html}
*/

/**
 * Billboard 实例的 isBillboard 标识属性，值恒为 true。
 * @name isBillboard
 * @type {boolean}
 * @memberof Billboard
*/
Object.defineProperties(Billboard.prototype, {
    isBillboard: {
        writable: false,
        configurable: false,
        value: true,
    }
});

/**
 * 将当前 Billboard 从其所属的 BillboardCollection 中移除。
 * @memberof Billboard
*/
Billboard.prototype._removeFromCollection = function () {
    if (this._billboardCollection)
        this._billboardCollection.remove(this);
};

/**
 * 计算 BillboardCollection 的包围球。
 * @param {boolean} [allowPartial=false] 是否允许仅使用部分已就绪的图元计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof BillboardCollection
*/
BillboardCollection.prototype.getBoundingSphere = function (allowPartial = false, result) {
    Check.defined('result', result);

    const length = this.length;
    if (length === 0)
        return BoundingSphereState.FAILED;

    const boundingSpheres = [];
    for (let i = length - 1; i >= 0; i--) {
        const billboard = this.get(i);
        boundingSpheres[i] = new BoundingSphere(billboard.position);
    }

    BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
    // console.log('getBoundingSphere:', this.id, result);
    return BoundingSphereState.DONE;
};

/**
 * Label 实例的 isLabel 标识属性，值恒为 true。
 * @name isLabel
 * @type {boolean}
 * @memberof Label
*/
Object.defineProperties(Label.prototype, {
    isLabel: {
        writable: false,
        configurable: false,
        value: true,
    }
});

/**
 * 将当前 Label 从其所属的 LabelCollection 中移除。
 * @memberof Label
*/
Label.prototype._removeFromCollection = function () {
    if (this._labelCollection)
        this._labelCollection.remove(this);
};

/**
 * 计算 LabelCollection 的包围球。
 * @param {boolean} [allowPartial=false] 是否允许仅使用部分已就绪的图元计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof LabelCollection
*/
LabelCollection.prototype.getBoundingSphere = function (allowPartial = false, result) {
    Check.defined('result', result);

    const length = this.length;
    if (length === 0)
        return BoundingSphereState.FAILED;

    const boundingSpheres = [];
    for (let i = length - 1; i >= 0; i--) {
        const label = this.get(i);
        boundingSpheres[i] = new BoundingSphere(label.position);
    }

    BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
    // console.log('getBoundingSphere:', this.id, result);
    return BoundingSphereState.DONE;
};

/**
 * PointPrimitive 实例的 isPointPrimitive 标识属性，值恒为 true。
 * @name isPointPrimitive
 * @type {boolean}
 * @memberof PointPrimitive
*/
Object.defineProperties(PointPrimitive.prototype, {
    isPointPrimitive: {
        writable: false,
        configurable: true,
        value: true,
    }
});

/**
 * 将当前 PointPrimitive 从其所属的 PointPrimitiveCollection 中移除。
 * @memberof PointPrimitive
*/
PointPrimitive.prototype._removeFromCollection = function () {
    if (this._pointPrimitiveCollection)
        this._pointPrimitiveCollection.remove(this);
};

/**
 * 计算 PointPrimitiveCollection 的包围球。
 * @param {boolean} [allowPartial=false] 是否允许仅使用部分已就绪的图元计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof PointPrimitiveCollection
*/
PointPrimitiveCollection.prototype.getBoundingSphere = function (allowPartial = false, result) {
    Check.defined('result', result);

    const length = this.length;
    if (length === 0)
        return BoundingSphereState.FAILED;

    const boundingSpheres = [];
    for (let i = length - 1; i >= 0; i--) {
        const point = this.get(i);
        boundingSpheres[i] = new BoundingSphere(point.position);
    }

    BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
    // console.log('getBoundingSphere:', this.id, result);
    return BoundingSphereState.DONE;
};

/**
 * 扩展 Cesium 的 PolylinePipeline 类，补充计算线段空间长度与地面长度的方法。
 * @class PolylinePipeline
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PolylinePipeline.html}
*/

/**
 * 计算线段的空间长度，即各顶点间的直线距离之和。
 * @param {Array} positions 构成线段的笛卡尔坐标点数组（Cartesian3 数组）。
 * @returns {number} 线段的空间长度，单位米。
 * @memberof PolylinePipeline
 * @static
*/
PolylinePipeline.computeLength = function (positions) {
    Check.typeOf.array('positions', positions);
    if (positions.length < 2)
        return 0;
    let length = 0,
        a, b, distance;
    for (let i = 1; i < positions.length; i++) {
        a = positions[i - 1];
        b = positions[i];
        distance = Cartesian3.distance(a, b);
        length += distance;
    }
    return length;
};

/**
 * 计算线段的地面长度，即各顶点间沿地表（椭球面）距离之和。
 * @param {Array} positions 构成线段的笛卡尔坐标点数组（Cartesian3 数组）。
 * @returns {number} 线段的地面长度，单位米。
 * @memberof PolylinePipeline
 * @static
*/
PolylinePipeline.computeSurfaceLength = function (positions) {
    Check.typeOf.array('positions', positions);
    if (positions.length < 2)
        return 0;
    let length = 0,
        a, b, distance;
    for (let i = 1; i < positions.length; i++) {
        a = positions[i - 1];
        b = positions[i];
        distance = Cartesian3.surfaceDistance(a, b);
        length += distance;
    }
    return length;
};

/**
 * 获取对象中某属性的描述
 * @param {Object} object 对象
 * @param {String} propertyName 属性名
 * @returns {Object} 获取到的属性描述结果对象
 */
function getPropertyDescriptor(object, propertyName) {
    if (object == null)
        return undefined;
    let __proto__ = object;
    let descriptor = Object.getOwnPropertyDescriptor(__proto__, propertyName);
    while (!descriptor && __proto__.__proto__) {
        __proto__ = __proto__.__proto__;
        descriptor = Object.getOwnPropertyDescriptor(__proto__, propertyName);
    }
    return descriptor;
}

/**
 * 为对象设置参数
 * @param {Object} target 设置的对象
 * @param {Object} parameters 设置的参数
 * @returns {Object} 设置后的对象
 */
function setParameters(target, parameters) {
    if (!target || !parameters)
        return target;
    // console.log('target:', target, 'parameters:', parameters);

    Object.keys(parameters).forEach((key) => {
        if (!parameters.hasOwnProperty(key)) //过滤继承变量
            return;
        if (key.startsWith('_')) //过滤私有变量
            return;

        const value = parameters[key];

        /**
         * 这里要先获取变量描述信息，以判断该变量是否可赋值
         * 可赋值的变量直接赋值
         * 不可赋值的变量再判断是否存在setParameters或setOptions函数，存在则通过调用这2个函数赋值
        */
        const descriptor = getPropertyDescriptor(target, key);//获取变量描述信息
        // console.log(key, descriptor);
        if (!descriptor || descriptor.writable || descriptor.set)
            target[key] = value;
        else if (target[key]) {
            if (typeof target[key].setParameters === 'function') {
                target[key].setParameters(value);
            } else if (typeof target[key].setOptions === 'function') {//兼容以前的setOptions
                target[key].setOptions(value);
            }
        }
    });

    return target;
}

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
}

/**
 * 扩展 Cesium 的 PostProcessStage 类，补充批量设置选项的方法。
 * @class PostProcessStage
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PostProcessStage.html}
*/
/**
 * 扩展 Cesium 的 PostProcessStageLibrary 类，补充圆形扫描、迷雾、高亮、天际线等后处理阶段创建方法。
 * @class PostProcessStageLibrary
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PostProcessStageLibrary.html}
*/

/**
 * 批量设置当前后处理阶段的选项与属性。
 * @param {object} options 选项对象，其属性将被设置到当前 stage 上。
 * @memberof PostProcessStage
*/
PostProcessStage.prototype.setOptions = function (options) {
    setParameters(this, options);
};

//解析和检测圆环设置
function parseAndCheckCircle(circle, defaultColor, defaultPower) {
    circle.color = parseToColor(circle.color) ?? defaultColor;
    Check.typeOf.number.greaterThan('radius', circle.radius, 0);
    circle.power = circle.power ?? defaultPower;
    Check.typeOf.number.greaterThanOrEquals('power', circle.power, 0);
    // console.log('circle:', circle);
}

//解析和检测多重圆环设置
function parseAndCheckCircles(circles, defaultColor, defaultPower) {
    for (let i = circles.length - 1; i >= 0; i--) {
        parseAndCheckCircle(circles[i], defaultColor, defaultPower);
    }
}

//多重圆环排序，按半径大小升序排列
function sortCircles(circles) {
    let temp;
    for (let i = 1; i < circles.length; i++) {
        for (let j = i; j > 0; j--) {
            if (circles[j].radius < circles[j - 1].radius) {
                temp = circles[j];
                circles[j] = circles[j - 1];
                circles[j - 1] = temp;
            }
        }
    }
    // console.log('sortCircles:', circles);
}

//将多重圆环设置项分解至数组
function decomposeCircles(circles, outColors, outRadii, outPowers) {
    for (let i = 0; i < circles.length; i++) {
        outColors[i] = circles[i].color;
        outRadii[i] = circles[i].radius;
        outPowers[i] = circles[i].power;
    }
    // console.log('outColors:', outColors, 'outRadii:', outRadii);
}

/**
 * 创建圆形扩散扫描后处理阶段。
 * @param {object} options 配置项。
 * @param {object} [options.map] Viewer 或 Scene 对象（与 scene 二选一），必需项之一。
 * @param {object} [options.scene] Viewer 或 Scene 对象。
 * @param {Geographic|Cartesian3|Cartographic|Array} [options.geographic] 圆心地理坐标。
 * @param {Cartesian3} [options.position] 圆心位置。
 * @param {Cartesian3} [options.center] 圆心位置（与 position 等效）。
 * @param {string} [options.name] 阶段名称。
 * @param {object} [options.properties] 自定义属性。
 * @param {boolean} [options.circleDiffuse=true] 是否开启圆形扩散动画。
 * @param {number} [options.radius=100] 扩散半径，单位米，须大于 0。
 * @param {number} [options.duration=2.0] 扩散动画持续时间，单位秒。
 * @param {Color|string} [options.color='#ff0000'] 扩散颜色。
 * @param {number} [options.opacity=1] 透明度，取值 0 到 1。
 * @param {boolean} [options.gradientColor=false] 是否启用渐变色。
 * @param {Color|string} [options.startColor] 渐变起始颜色。
 * @param {Color|string} [options.endColor] 渐变结束颜色。
 * @param {number} [options.power=3.0] 扩散指数，值越小扩散环越厚。
 * @param {boolean} [options.multiple=false] 是否开启多重圆环。
 * @param {Array} [options.multiCircles=[]] 多重圆环设置数组。
 * @param {boolean} [options.radarScan=false] 是否开启雷达扫描动画。
 * @param {Color|string} [options.scanColor] 雷达扫描线颜色。
 * @param {number} [options.scanPower=3.0] 雷达扫描线扩散指数。
 * @param {number} [options.scanDuration=2.0] 雷达扫描动画持续时间，单位秒。
 * @returns {PostProcessStage} 生成的圆形扩散扫描后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createCircleScanStage = function (options) {
    Check.defined('options', options);

    //Viewer或Scene对象，必需项
    const scene = options.map ?? options.scene;
    Check.defined('scene', scene);

    const name = options.name ?? 'CircleScan_' + createGuid();
    const properties = options.properties;

    //获取圆心点位置，Cartesian3对象
    let center;
    if (defined$1(options.geographic))
        center = parseGeographicToCartesian(options.geographic, undefined, scene.ellipsoid);
    else if (defined$1(options.position) || defined$1(options.center))
        center = parseToCartesian3(options.position || options.center);
    else
        throw new DeveloperError('geographic or postition or center undefined.');

    //圆心位置，Cartesian4对象
    const cartesian4Center = new Cartesian4();
    //高度+500后的圆心位置，Cartesian4对象
    const cartesian4CenterByHigher = new Cartesian4();
    //经度+0.001后的圆心位置，Cartesian4对象
    const cartesian4CenterByRight = new Cartesian4();

    //更新圆心相关参数
    function updateCenterCoordinates() {
        cartesian4Center.x = center.x;
        cartesian4Center.y = center.y;
        cartesian4Center.z = center.z;
        cartesian4Center.w = 1;

        //获得当前圆心位置的地理坐标
        const geographic = center.toGeographic();
        //高度+500，用于计算平面法线
        const geographicByHigher = Geographic.fromDegrees(geographic.longitude, geographic.latitude, geographic.height + 500);
        const centerByHigher = geographicByHigher.toCartesian();
        cartesian4CenterByHigher.x = centerByHigher.x;
        cartesian4CenterByHigher.y = centerByHigher.y;
        cartesian4CenterByHigher.z = centerByHigher.z;
        cartesian4CenterByHigher.w = 1;
        //经度+0.001，用于计算平面法线
        const geographicByRight = Geographic.fromDegrees(geographic.longitude + 0.001, geographic.latitude, geographic.height);
        const centerByRight = geographicByRight.toCartesian();
        cartesian4CenterByRight.x = centerByRight.x;
        cartesian4CenterByRight.y = centerByRight.y;
        cartesian4CenterByRight.z = centerByRight.z;
        cartesian4CenterByRight.w = 1;
    }

    updateCenterCoordinates();

    const scratchViewMatrix = new Matrix4();
    const scratchCartesian4Center = new Cartesian4();
    const scratchCartesian4CenterByHigher = new Cartesian4();
    const scratchCartesian4CenterByRight = new Cartesian4();
    const scratchCartesian3Normal = new Cartesian3();
    const scratchCartesian3Direction = new Cartesian3();
    const scratchCartesian3RotateDirection = new Cartesian3();
    const scratchQuaternion = new Quaternion();
    const scratchMatrix3 = new Matrix3();

    //转换至相机视图位置
    function updateCenterCoordinatesToEye() {
        if (!Matrix4.equals(scene.camera.viewMatrix, scratchViewMatrix)) {
            Matrix4.clone(scene.camera.viewMatrix, scratchViewMatrix);

            Matrix4.multiplyByVector(scratchViewMatrix, cartesian4Center, scratchCartesian4Center);
            Matrix4.multiplyByVector(scratchViewMatrix, cartesian4CenterByHigher, scratchCartesian4CenterByHigher);
            Matrix4.multiplyByVector(scratchViewMatrix, cartesian4CenterByRight, scratchCartesian4CenterByRight);

            Cartesian3.subtract(scratchCartesian4CenterByHigher, scratchCartesian4Center, scratchCartesian3Normal);
            Cartesian3.normalize(scratchCartesian3Normal, scratchCartesian3Normal);

            Cartesian3.subtract(scratchCartesian4CenterByRight, scratchCartesian4Center, scratchCartesian3Direction);
            Cartesian3.normalize(scratchCartesian3Direction, scratchCartesian3Direction);
            // console.log('center:', scratchCartesian4Center);
            // console.log('ndc:', Matrix4.multiplyByVector(map.camera.frustum.projectionMatrix, scratchCartesian4Center, new Cartesian4()));
        }
    }

    updateCenterCoordinatesToEye();

    //是否开启圆形扩散动画
    let circleDiffuse = options.circleDiffuse ?? true;
    Check.typeOf.bool('circleDiffuse', circleDiffuse);
    //半径，单位米，必须大于0
    let radius = options.radius ?? 100;
    Check.typeOf.number.greaterThan('radius', radius, 0);
    //动画持续时间，单位秒
    let duration = options.duration ?? 2.0;
    Check.typeOf.number('duration', duration);
    let milliDuration = duration * 1000;
    //颜色设置
    let color = parseToColor(options.color ?? '#ff0000');
    //透明度设置
    let opacity = options.opacity ?? 1;
    Check.typeOf.number.greaterThanOrEquals('opacity', opacity, 0);
    Check.typeOf.number.lessThanOrEquals('opacity', opacity, 1);
    color = color.withAlpha(opacity, color);
    //是否启用渐变色
    let gradientColor = options.gradientColor ?? false;
    Check.typeOf.bool('gradientColor', gradientColor);
    //开始颜色
    let startColor;
    if (options.startColor)
        startColor = parseToColor(options.startColor);
    //结束颜色
    let endColor;
    if (options.endColor)
        endColor = parseToColor(options.endColor);
    //扩散指数，值越小扩散环越厚，最小值0
    let power = options.power ?? 3.0;
    Check.typeOf.number.greaterThanOrEquals('power', power, 0);
    //是否开启多重圆环
    let multiple = options.multiple ?? false;
    Check.typeOf.bool('multiple', multiple);
    //多重圆环设置数组
    let multiCircles = options.multiCircles ?? new Array();
    Check.typeOf.array('multiCircles', multiCircles);
    let numberOfMultiple = 1,
        maxRadius;
    let colors = new Array();
    let radii = new Array();
    let powers = new Array();
    handleCircles(multiCircles);
    //是否开启雷达扫描动画
    let radarScan = options.radarScan ?? false;
    Check.typeOf.bool('radarScan', radarScan);
    //雷达扫描线颜色
    let scanColor;
    if (options.scanColor)
        scanColor = parseToColor(options.scanColor);
    //雷达扫描线扩散指数，值越小扩散环越厚，最小值0
    let scanPower = options.scanPower ?? 3.0;
    Check.typeOf.number.greaterThanOrEquals('scanPower', scanPower, 0);
    //雷达扫描动画持续时间，单位秒
    let scanDuration = options.scanDuration ?? 2.0;
    Check.typeOf.number.greaterThan('scanDuration', scanDuration, 0);
    let milliScanDuration = scanDuration * 1000;

    //记录当前时间
    const startTime = (new Date()).getTime();

    //分解多重圆环
    function resolveCircles(circles) {
        colors = new Array();
        radii = new Array();
        powers = new Array();
        decomposeCircles(circles, colors, radii, powers);

        //获取最大半径
        maxRadius = radii[radii.length - 1];
        //获取多重圆环数量
        numberOfMultiple = circles.length;
    }

    //处理多重圆环
    function handleCircles(circles) {
        if (circles.length > 0) {
            parseAndCheckCircles(circles, color, power);
            sortCircles(circles);
            resolveCircles(circles);
        } else {
            multiple = false;
        }
    }

    const fragmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "in vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_centerEC;\n" +
        "uniform vec3 u_planeNormalEC;\n" +
        "uniform vec3 u_scanLineDirectionEC;\n" +
        "uniform bool u_circleDiffuse;\n" +
        "uniform float u_radius;\n" +
        "uniform float u_maxRadius;\n" +
        "uniform vec4 u_diffuseColor;\n" +
        "uniform bool u_gradientColor;\n" +
        "uniform vec4 u_startColor;\n" +
        "uniform vec4 u_endColor;\n" +
        "uniform float u_power;\n" +
        "uniform bool u_multiple;\n" +
        "uniform vec4 u_diffuseColors[" + numberOfMultiple + "];\n" +
        "uniform float u_radii[" + numberOfMultiple + "];\n" +
        "uniform float u_powers[" + numberOfMultiple + "];\n" +
        "uniform bool u_radarScan;\n" +
        "uniform vec4 u_scanColor;\n" +
        "uniform float u_scanPower;\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
        "   float z_window = czm_unpackDepth(depth);\n" +
        "   z_window = czm_reverseLogDepth(z_window);\n" +
        "   float near = czm_depthRange.near;\n" +
        "   float far = czm_depthRange.far;\n" +
        "   return (2.0 * z_window - near - far) / (far - near);\n" +
        "}\n" +

        "vec4 textureCoordinatesToEye(in vec2 uv, in float depth)\n" +
        "{\n" +
        "   vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));\n" +
        "   vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        "   posInCamera = posInCamera / posInCamera.w;\n" +
        "   return posInCamera;\n" +
        "}\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
        "   vec3 v01 = point - planeOrigin;\n" +
        "   float d = dot(planeNormal, v01) ;\n" +
        "   return (point - planeNormal * d);\n" +
        "}\n" +

        "bool isPointOnLineRight(in vec3 lineOrigin, in vec3 lineDirection, in vec3 lineNormal, in vec3 testPoint)\n" +
        "{\n" +
        "   vec3 direction = testPoint - lineOrigin;\n" +
        "   normalize(direction);\n" +
        "   vec3 temp = cross(direction, lineDirection);\n" +
        "   float d = dot(temp, lineNormal);\n" +
        "   return d > 0.5;\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
        "   out_FragColor = texture(colorTexture, v_textureCoordinates);\n" +
        "   float depth = getDepth(texture(depthTexture, v_textureCoordinates));\n" +
        "   vec4 eyePos = textureCoordinatesToEye(v_textureCoordinates, depth);\n" +
        "   vec3 projectOnPlane = pointProjectOnPlane(u_planeNormalEC.xyz, u_centerEC.xyz, eyePos.xyz);\n" +
        "   float dis = length(projectOnPlane.xyz - u_centerEC.xyz);\n" +
        "   if (u_circleDiffuse && dis <= u_radius)\n" +
        "   {\n" +
        "       if(u_multiple && " + numberOfMultiple + " > 0)\n" +
        "       {\n" +
        "           for(int i = 0; i < " + numberOfMultiple + "; i++)\n" +
        "           {\n" +
        "               float radius = u_radii[i];\n" +
        "               if(dis <= radius)\n" +
        "               {\n" +
        "                   float f = 1.0 - abs(radius - dis) / radius;\n" +
        "                   f = pow(f, u_powers[i]);\n" +
        "                   vec4 diffuseColor = u_diffuseColors[i];\n" +
        "                   out_FragColor = mix(out_FragColor, diffuseColor, f);\n" +
        "                   break;\n" +
        "               }\n" +
        "           }\n" +
        "       }\n" +
        "       else\n" +
        "       {\n" +
        "           float f = 1.0 - abs(u_radius - dis) / u_radius;\n" +
        "           f = pow(f, u_power);\n" +
        "           if (u_gradientColor)\n" +
        "           {\n" +
        "               float p = dis / u_maxRadius;\n" +
        "               vec4 diffuseColor = mix(u_startColor, u_endColor, p);\n" +
        "               out_FragColor = mix(out_FragColor, diffuseColor, f);\n" +
        "           }\n" +
        "           else\n" +
        "           {\n" +
        "               out_FragColor = mix(out_FragColor, u_diffuseColor, f);\n" +
        "           }\n" +
        "       }\n" +
        "   }\n" +
        "   if (u_radarScan && dis <= u_maxRadius)\n" +
        "   {\n" +
        "       float diameter = u_maxRadius * 2.0;\n" +
        "       if(isPointOnLineRight(u_centerEC.xyz, u_scanLineDirectionEC.xyz, u_planeNormalEC.xyz, projectOnPlane.xyz))\n" +
        "       {\n" +
        "           vec3 lineEndPoint = vec3(u_centerEC.xyz) + u_scanLineDirectionEC * u_maxRadius;\n" +
        "           float dis1 = length(projectOnPlane.xyz - lineEndPoint);\n" +
        "           float f = abs(diameter - dis1) / diameter;\n" +
        "           f = pow(f, u_scanPower);\n" +
        "           out_FragColor = mix(out_FragColor, u_scanColor, f);\n" +
        "       }\n" +
        "   }\n" +
        "}\n";

    const stage = new PostProcessStage({
        name: name,
        fragmentShader: fragmentShader,
        uniforms: {
            u_centerEC: function () {
                updateCenterCoordinatesToEye();
                return scratchCartesian4Center;
            },
            u_planeNormalEC: function () {
                return scratchCartesian3Normal;
            },
            u_scanLineDirectionEC: function () {
                const normal = scratchCartesian3Normal;
                const direction = scratchCartesian3Direction.clone(scratchCartesian3RotateDirection);

                const percent = (((new Date()).getTime() - startTime) % milliScanDuration) / milliScanDuration;
                Quaternion.fromAxisAngle(normal, percent * Math$1.TWO_PI, scratchQuaternion);
                Matrix3.fromQuaternion(scratchQuaternion, scratchMatrix3);
                Matrix3.multiplyByVector(scratchMatrix3, direction, direction);
                Cartesian3.normalize(direction, direction);
                return direction;
            },
            u_circleDiffuse: function () {
                return circleDiffuse;
            },
            u_radius: function () {
                if (milliDuration <= 0) {
                    if (multiple)
                        return maxRadius;
                    else
                        return radius;
                } else {
                    const percent = (((new Date()).getTime() - startTime) % milliDuration) / milliDuration;
                    if (multiple)
                        return maxRadius * percent;
                    else
                        return radius * percent;
                }
            },
            u_maxRadius: function () {
                if (multiple)
                    return maxRadius;
                else
                    return radius;
            },
            u_diffuseColor: color,
            u_gradientColor: function () {
                if (gradientColor) {
                    //开启渐变色时判断下startColor与endColor是否存在
                    return defined$1(startColor) || defined$1(endColor);
                }
                return gradientColor;
            },
            u_startColor: function () {
                return startColor || color;
            },
            u_endColor: function () {
                return endColor || color;
            },
            u_power: function () {
                return power;
            },
            u_multiple: function () {
                return multiple;
            },
            u_diffuseColors: function () {
                return colors;
            },
            u_radii: function () {
                return radii;
            },
            u_powers: function () {
                return powers;
            },
            u_radarScan: function () {
                return radarScan;
            },
            u_scanColor: function () {
                return scanColor || color;
            },
            u_scanPower: function () {
                return scanPower;
            }
        }
    });

    Object.defineProperties(stage, {
        properties: {
            get: function () {
                return properties;
            }
        },
        geographic: {
            set: function (value) {
                this.center = parseGeographicToCartesian(value, center);
            },
            get: function () {
                return this.center.toGeographic();
            }
        },
        position: {
            set: function (value) {
                this.center = parseToCartesian3(value);
            },
            get: function () {
                return this.center;
            }
        },
        center: {
            set: function (value) {
                value = parseToCartesian3(value);
                if (!Cartesian3.equals(value, center)) {
                    center = value.clone(center);
                    updateCenterCoordinates();
                }
            },
            get: function () {
                return center;
            }
        },
        circleDiffuse: {
            set: function (value) {
                Check.typeOf.bool('circleDiffuse', value);
                circleDiffuse = value;
            },
            get: function () {
                return circleDiffuse;
            }
        },
        color: {
            set: function (value) {
                value = parseToColor(value);
                if (!Color.equals(value, color)) {
                    color = value.clone(color);
                    color = color.withAlpha(opacity, color);
                }
            },
            get: function () {
                return color;
            }
        },
        opacity: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
                if (opacity !== value) {
                    opacity = value;
                    color = color.withAlpha(opacity, color);
                }
            },
            get: function () {
                return opacity;
            }
        },
        gradientColor: {
            set: function (value) {
                Check.typeOf.bool('gradientColor', value);
                gradientColor = value;
            }
        },
        startColor: {
            set: function (value) {
                if (!defined$1(value)) {
                    startColor = undefined;
                    return;
                }
                value = parseToColor(value);
                if (!Color.equals(value, startColor)) {
                    startColor = value.clone(startColor);
                }
            },
            get: function () {
                return startColor;
            }
        },
        endColor: {
            set: function (value) {
                if (!defined$1(value)) {
                    endColor = undefined;
                    return;
                }
                value = parseToColor(value);
                if (!Color.equals(value, endColor)) {
                    endColor = value.clone(endColor);
                }
            },
            get: function () {
                return endColor;
            }
        },
        radius: {
            set: function (value) {
                Check.typeOf.number.greaterThan('radius', value, 0);
                if (radius !== value)
                    radius = value;
            },
            get: function () {
                return radius;
            }
        },
        duration: {
            set: function (value) {
                Check.typeOf.number('duration', value);
                if (duration !== value) {
                    duration = value;
                    milliDuration = duration * 1000;
                }
            },
            get: function () {
                return duration;
            }
        },
        power: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('power', value, 0);
                if (power !== value)
                    power = value;
            },
            get: function () {
                return power;
            }
        },
        multiple: {
            set: function (value) {
                Check.typeOf.bool('multiple', value);
                multiple = value;
            },
            get: function () {
                return multiple;
            }
        },
        multiCircles: {
            set: function (value) {
                Check.typeOf.array('multiCircles', value);
                multiCircles = value;
                handleCircles(multiCircles);
            },
            get: function () {
                return multiCircles;
            }
        },
        radarScan: {
            set: function (value) {
                Check.typeOf.bool('radarScan', value);
                radarScan = value;
            },
            get: function () {
                return radarScan;
            }
        },
        scanColor: {
            set: function (value) {
                if (!defined$1(value)) {
                    scanColor = undefined;
                    return;
                }
                value = parseToColor(value);
                if (!Color.equals(value, scanColor)) {
                    endColor = value.clone(scanColor);
                }
            },
            get: function () {
                return scanColor || color;
            }
        },
        scanDuration: {
            set: function (value) {
                Check.typeOf.number.greaterThan('scanDuration', value, 0);
                if (scanDuration !== value) {
                    scanDuration = value;
                    milliScanDuration = scanDuration * 1000;
                }
            },
            get: function () {
                return scanDuration;
            }
        },
        scanPower: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('scanPower', value, 0);
                if (scanPower !== value)
                    scanPower = value;
            },
            get: function () {
                return scanPower;
            }
        }
    });

    /**
     * 向圆形扫描阶段添加一个圆环。
     * @param {object} circle 圆环设置，包含 color、radius、power 属性。
     * @memberof PostProcessStage
    */
    stage.addCircle = function (circle) {
        parseAndCheckCircle(circle, color);
        multiCircles.push(circle);
        sortCircles(multiCircles);
        resolveCircles(multiCircles);
    };

    /**
     * 移除圆形扫描阶段指定索引的圆环。
     * @param {number} index 待移除圆环的索引。
     * @memberof PostProcessStage
    */
    stage.removeCircleAt = function (index) {
        Check.typeOf.integer.greaterThanOrEquals('index', index, 0);
        Check.typeOf.integer.lessThan('index', index, multiCircles.length);
        multiCircles.splice(index, 1);
        if (multiCircles.length === 0)
            multiple = false;
        else
            numberOfMultiple = multiCircles.length;
    };

    /**
     * 移除圆形扫描阶段的全部圆环。
     * @memberof PostProcessStage
    */
    stage.removeAllCircles = function () {
        multiple = false;
        multiCircles = new Array();
    };

    stage.setOptions(options);
    return stage;
};

const NearFarScalarFogFragmentShaderSource =
    "float getDistance(sampler2D depthTexture, vec2 texCoords) \n" +
    "{ \n" +
    "    float depth = czm_unpackDepth(texture(depthTexture, texCoords)); \n" +
    "    if (depth == 0.0) { \n" +
    "        return czm_infinity; \n" +
    "    } \n" +
    "    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); \n" +
    "    return -eyeCoordinate.z / eyeCoordinate.w; \n" +
    "} \n" +

    "float interpolateByDistance(vec4 nearFarScalar, float distance) \n" +
    "{ \n" +
    "    float startDistance = nearFarScalar.x; \n" +
    "    float startValue = nearFarScalar.y; \n" +
    "    float endDistance = nearFarScalar.z; \n" +
    "    float endValue = nearFarScalar.w; \n" +
    "    float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); \n" +
    "    return mix(startValue, endValue, t); \n" +
    "} \n" +

    "vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) \n" +
    "{ \n" +
    "    return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); \n" +
    "} \n" +

    "uniform sampler2D colorTexture; \n" +
    "uniform sampler2D depthTexture; \n" +
    "uniform bool u_fogEnable; \n" +
    "uniform vec4 u_fogByDistance; \n" +
    "uniform vec4 u_fogColor; \n" +
    "in vec2 v_textureCoordinates; \n" +

    "void main(void) \n" +
    "{ \n" +
    "    if (u_fogEnable) { \n" +
    "       float distance = getDistance(depthTexture, v_textureCoordinates); \n" +
    "       vec4 sceneColor = texture(colorTexture, v_textureCoordinates); \n" +
    "       float blendAmount = interpolateByDistance(u_fogByDistance, distance); \n" +
    "       vec4 finalFogColor = vec4(u_fogColor.rgb, u_fogColor.a * blendAmount); \n" +
    "       out_FragColor = alphaBlend(finalFogColor, sceneColor); \n" +
    "    } else { \n" +
    "       out_FragColor = texture(colorTexture, v_textureCoordinates); \n" +
    "    } \n" +
    "} \n";

/**
 * 创建基于近远距离线性插值的迷雾后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {string} [options.name] 阶段名称。
 * @param {object} [options.properties] 自定义属性。
 * @param {boolean} [options.enable=true] 是否开启迷雾。
 * @param {Color|string} [options.color='#fff'] 迷雾颜色。
 * @param {number} [options.near=10] 近距。
 * @param {number} [options.nearValue=0.0] 近距插值。
 * @param {number} [options.far=500] 远距。
 * @param {number} [options.farValue=1.0] 远距插值。
 * @returns {PostProcessStage} 生成的迷雾后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createNearFarScalarFogStage = function (options = {}) {
    const name = options.name ?? 'NearFarScalarFog_' + createGuid();
    const properties = options.properties;

    //是否开启迷雾
    let fogEnable = options.enable ?? true;
    //颜色设置
    let fogColor = parseToColor(options.color ?? '#fff');
    //近距
    let near = options.near ?? 10;
    //近距插入值
    let nearValue = options.nearValue ?? 0.0;
    //远距
    let far = options.far ?? 500;
    //远距插入值
    let farValue = options.farValue ?? 1.0;

    const fogByDistance = new Cartesian4(near, nearValue, far, farValue);

    const stage = new PostProcessStage({
        name: name,
        fragmentShader: NearFarScalarFogFragmentShaderSource,
        uniforms: {
            u_fogEnable: function () {
                return fogEnable;
            },
            u_fogColor: fogColor,
            u_fogByDistance: fogByDistance,
        }
    });

    Object.defineProperties(stage, {
        properties: {
            get: function () {
                return properties;
            }
        },
        enable: {
            set: function (value) {
                Check.typeOf.bool('enable', value);
                fogEnable = value;
            },
            get: function () {
                return fogEnable;
            }
        },
        color: {
            set: function (value) {
                value = parseToColor(value);
                Color.clone(value, fogColor);
            },
            get: function () {
                return fogColor;
            }
        },
        near: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.x = value;
            },
            get: function () {
                return fogByDistance.x;
            }
        },
        nearValue: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.y = value;
            },
            get: function () {
                return fogByDistance.y;
            }
        },
        far: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.z = value;
            },
            get: function () {
                return fogByDistance.z;
            }
        },
        farValue: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.w = value;
            },
            get: function () {
                return fogByDistance.w;
            }
        }
    });

    stage.setOptions(options);
    return stage;
};

const Exp2FogFragmentShaderSource =
    "uniform sampler2D colorTexture;\n" +
    "uniform sampler2D depthTexture;\n" +
    "in vec2 v_textureCoordinates;\n" +
    "uniform bool u_fogEnable;\n" +
    "uniform vec4 u_fogColor;\n" +
    "uniform float u_fogDensity;\n" +

    "float getDepth(in vec4 depth)\n" +
    "{\n" +
    "   float z_window = czm_unpackDepth(depth);\n" +
    "   z_window = czm_reverseLogDepth(z_window);\n" +
    "   float near = czm_depthRange.near;\n" +
    "   float far = czm_depthRange.far;\n" +
    "   return (2.0 * z_window - near - far) / (far - near);\n" +
    "}\n" +

    "vec4 textureCoordinatesToEye(in vec2 uv, in float depth)\n" +
    "{\n" +
    "   vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));\n" +
    "   vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
    "   posInCamera = posInCamera / posInCamera.w;\n" +
    "   return posInCamera;\n" +
    "}\n" +

    "void main()\n" +
    "{\n" +
    "   out_FragColor = texture(colorTexture, v_textureCoordinates);\n" +
    "   if (u_fogEnable && u_fogDensity > 0.0)\n" +
    "   {\n" +
    "       float depth = getDepth(texture(depthTexture, v_textureCoordinates));\n" +
    "       vec4 eyePos = textureCoordinatesToEye(v_textureCoordinates, depth);\n" +
    "       float fogDepth = -eyePos.z;" +
    "       float fogFactor = 1.0 - exp(-u_fogDensity * u_fogDensity * fogDepth * fogDepth);\n" +
    "       fogFactor = clamp(fogFactor, 0.0, 1.0);\n" +
    "       out_FragColor.rgb = mix(out_FragColor.rgb, u_fogColor.rgb, fogFactor);\n" +
    "   }\n" +
    "}";

/**
 * 创建指数平方（Exp2）浓淡效果的迷雾后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {string} [options.name] 阶段名称。
 * @param {object} [options.properties] 自定义属性。
 * @param {boolean} [options.enable=true] 是否开启迷雾。
 * @param {Color|string} [options.color='#fff'] 迷雾颜色。
 * @param {number} [options.density=1] 迷雾密度。
 * @returns {PostProcessStage} 生成的迷雾后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createExp2FogStage = function (options = {}) {
    const name = options.name ?? 'Exp2Fog_' + createGuid();
    const properties = options.properties;

    //是否开启迷雾
    let fogEnable = options.enable ?? true;
    //颜色设置
    let fogColor = parseToColor(options.color ?? '#fff');
    //密度设置
    let fogDensity = options.density ?? 1;

    const stage = new PostProcessStage({
        name: name,
        fragmentShader: Exp2FogFragmentShaderSource,
        uniforms: {
            u_fogEnable: function () {
                return fogEnable;
            },
            u_fogColor: fogColor,
            u_fogDensity: function () {
                return fogDensity / 500;
            },
        }
    });

    Object.defineProperties(stage, {
        properties: {
            get: function () {
                return properties;
            }
        },
        enable: {
            set: function (value) {
                Check.typeOf.bool('enable', value);
                fogEnable = value;
            },
            get: function () {
                return fogEnable;
            }
        },
        color: {
            set: function (value) {
                value = parseToColor(value);
                Color.clone(value, fogColor);
            },
            get: function () {
                return fogColor;
            }
        },
        density: {
            set: function (value) {
                value = parseNumber(value);
                fogDensity = value;
            },
            get: function () {
                return fogDensity;
            }
        },
    });

    stage.setOptions(options);
    return stage;
};

/**
 * 迷雾类型枚举。
 * @type {object}
 * @constant
*/
const FogType = Object.freeze({
    NearFarScalar: 'NearFarScalar',
    Exp2: 'Exp2',
});

/**
 * 根据类型创建迷雾后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {string} [options.type=FogType.NearFarScalar] 迷雾类型，取值见 FogType。
 * @returns {PostProcessStage} 生成的迷雾后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createFogStage = function (options = {}) {
    const type = (options.type ?? FogType.NearFarScalar).toLocaleString();
    switch (type) {
        case FogType.Exp2:
            return PostProcessStageLibrary.createExp2FogStage(options);
        default:
            return PostProcessStageLibrary.createNearFarScalarFogStage(options);
    }
};

const HighlightFragmentShaderSource =
    "uniform sampler2D colorTexture;\n" +
    "in vec2 v_textureCoordinates;\n" +
    "uniform vec4 highlight;\n" +
    "void main() {\n" +
    "    vec4 color = texture(colorTexture, v_textureCoordinates);\n" +
    "    if (czm_selected()) {\n" +
    "        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n" +
    "        out_FragColor = vec4(highlighted, color.a);\n" +
    "    } else { \n" +
    "        out_FragColor = color;\n" +
    "    }\n" +
    "}\n";

/**
 * 创建高亮后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {Color|string} [options.color] 高亮颜色。
 * @param {number} [options.intensity] 高亮强度，取值 0 到 1。
 * @returns {PostProcessStage} 生成的高亮后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createHighlightStage = function (options = {}) {
    const guid = createGuid();

    const highlight = new Color(1.0, 1.0, 1.0, 0.5);

    const stage = new PostProcessStage({
        name: "czm_highlight_" + guid,
        fragmentShader: HighlightFragmentShaderSource,
        uniforms: {
            highlight: function () {
                return highlight;
            },
        },
    });

    Object.defineProperties(stage, {
        color: {
            set: function (value) {
                value = parseToColor(value);
                Color.cloneRgb(value, highlight);
            },
            get: function () {
                return highlight;
            }
        },
        intensity: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('intensity', 0);
                Check.typeOf.number.lessThanOrEquals('intensity', 1);
                highlight.alpha = value;
            },
            get: function () {
                return highlight.alpha;
            }
        }
    });

    stage.setOptions(options);
    return stage;
};

const SkylineFragmentShaderSource =
    "uniform sampler2D colorTexture;\n" +
    "uniform sampler2D depthTexture;\n" +
    "uniform sampler2D silhouetteTexture;\n" +
    "in vec2 v_textureCoordinates;\n" +
    "void main() {\n" +
    "    float depth = czm_readDepth(depthTexture, v_textureCoordinates);" +
    "    vec4 silhouetteColor = texture(silhouetteTexture, v_textureCoordinates);" +
    "    vec4 color = texture(colorTexture, v_textureCoordinates);\n" +
    "    if(depth >= 1.0 - 0.000001) {\n" +
    "        out_FragColor = mix(color, silhouetteColor, silhouetteColor.a);\n" +
    "    } else { \n" +
    "        out_FragColor = color;\n" +
    "    }\n" +
    "}\n";

/**
 * 创建天际线（轮廓线）检测的后处理阶段组合。
 * @param {object} [options={}] 配置项。
 * @param {boolean} [options.enabled=true] 是否启用。
 * @param {Color|string} [options.color=Color.RED] 轮廓线颜色。
 * @param {number} [options.lineWidth=1.0] 轮廓线宽度，须大于 0。
 * @returns {PostProcessStageComposite} 生成的天际线后处理阶段组合。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createSkylineState = function (options = {}) {
    const edgeDetection = PostProcessStageLibrary.createEdgeDetectionStage();
    const skilneStage = new PostProcessStage({
        fragmentShader: SkylineFragmentShaderSource,
        uniforms: {
            silhouetteTexture: edgeDetection.name
        }
    });

    const composite = new PostProcessStageComposite({
        //PostProcessStage要按顺序执行 的stage或组合的数组。
        stages: [edgeDetection, skilneStage],
        //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
        inputPreviousStageTexture: false,
    });

    Object.defineProperties(composite, {
        lineWidth: {
            get: function () {
                return edgeDetection.uniforms.lineWidth;
            },
            set: function (value) {
                Check.typeOf.number.greaterThan('lineWidth', value, 0);
                edgeDetection.uniforms.lineWidth = value;
            }
        },
        color: {
            get: function () {
                return edgeDetection.uniforms.color;
            },
            set: function (value) {
                value = parseToColor(value);
                Color.cloneRgb(value, edgeDetection.uniforms.color);
            }
        },
    });

    composite.enabled = options.enabled ?? true;
    composite.color = options.color ?? Color.RED;
    composite.lineWidth = options.lineWidth ?? 1.0;

    return composite;
};

/**
 * 扩展 Cesium 的 Primitive 类，补充获取包围球的方法。
 * @class Primitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Primitive.html}
*/
/**
 * 扩展 Cesium 的 GroundPrimitive 类，补充获取包围球的方法。
 * @class GroundPrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/GroundPrimitive.html}
*/
/**
 * 扩展 Cesium 的 ClassificationPrimitive 类，补充获取包围球的方法。
 * @class ClassificationPrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/ClassificationPrimitive.html}
*/
/**
 * 扩展 Cesium 的 GroundPolylinePrimitive 类，补充获取包围球的方法。
 * @class GroundPolylinePrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/GroundPolylinePrimitive.html}
*/

/**
 * 获取当前图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof Primitive
*/
Primitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready || this._recomputeBoundingSpheres)
        return BoundingSphereState.PENDING;
    BoundingSphere.fromBoundingSpheres(this._boundingSphereWC, result);
    return BoundingSphereState.DONE;
};

/**
 * 获取当前地面图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof GroundPrimitive
*/
GroundPrimitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready)
        return BoundingSphereState.PENDING;
    BoundingSphere.fromBoundingSpheres(this._boundingSpheres, result);
    return BoundingSphereState.DONE;};

/**
 * 获取当前分类图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof ClassificationPrimitive
*/
ClassificationPrimitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready || !this._primitive || !this._primitive._ready)
        return BoundingSphereState.PENDING;
    return this._primitive.getBoundingSphere(allowPartial, result);
};

/**
 * 获取当前地面线图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof GroundPolylinePrimitive
*/
GroundPolylinePrimitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready || !this._primitive || !this._primitive._ready)
        return BoundingSphereState.PENDING;
    return this._primitive.getBoundingSphere(allowPartial, result);
};

/**
 * 扩展 Cesium 的 Property 类，补充属性判断与取值的方法。
 * @class Property
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Property.html}
*/

/**
 * 判断给定对象是否为一个 Property（具有 getValue 方法且定义了 isConstant）。
 * @param {object} property 待判断的对象。
 * @returns {boolean} 若为 Property 返回 true；否则返回 undefined。
 * @memberof Property
 * @static
*/
Property.isProperty = function (property) {
    if (typeof property.getValue === 'function' && defined$1(property.isConstant))
        return true;
};

/**
 * 获取属性在指定时间的值，若对象非 Property 则直接返回其本身。
 * @param {object|Property} property 属性对象或普通值。
 * @param {JulianDate} [time] 取值的时间。
 * @param {object} [result] 用于存储结果的可选对象。
 * @returns {object} 属性在指定时间的值。
 * @memberof Property
 * @static
*/
Property.getValue = function (property, time, result) {
    if (typeof property.getValue === 'function')
        return property.getValue(time, result);
    return property;
};

/**
 * 扩展 Cesium 的 Quaternion 类，补充通过航向俯仰横滚角创建四元数、
 * 四元数向量变换以及转换为航向俯仰横滚角的方法。
 * @class Quaternion
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Quaternion.html}
*/

/**
 * 从以角度表示的航向、俯仰、横滚角创建四元数。
 * @param {number} heading 航向角，单位度。
 * @param {number} pitch 俯仰角，单位度。
 * @param {number} roll 横滚角，单位度。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 生成的四元数。
 * @memberof Quaternion
 * @static
*/
Quaternion.fromDegrees = function (heading, pitch, roll, result) {
    const hpr = HeadingPitchRoll.fromDegrees(heading, pitch, roll, Scratch.scratchHeadingPitchRoll);
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

/**
 * 从以弧度表示的航向、俯仰、横滚角创建四元数。
 * @param {number} heading 航向角，单位弧度。
 * @param {number} pitch 俯仰角，单位弧度。
 * @param {number} roll 横滚角，单位弧度。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 生成的四元数。
 * @memberof Quaternion
 * @static
*/
Quaternion.fromRadians = function (heading, pitch, roll, result) {
    const hpr = HeadingPitchRoll.fromRadians(heading, pitch, roll, Scratch.scratchHeadingPitchRoll);
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

/**
 * 使用四元数表示的旋转对笛卡尔坐标向量进行变换。
 * @param {Quaternion} quaterion 旋转四元数。
 * @param {Cartesian3} cartesian 待变换的向量。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 变换后的向量。
 * @memberof Quaternion
 * @static
*/
Quaternion.multiplyByVector = function (quaterion, cartesian, result) {
    const rotationMatrix = Matrix3.fromQuaternion(quaterion, Scratch.scratchMatrix3);
    return Matrix3.multiplyByVector(rotationMatrix, cartesian, result);
};

/**
 * 将当前四元数转换为航向、俯仰、横滚角。
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 对应的航向俯仰横滚角。
 * @memberof Quaternion
*/
Quaternion.prototype.toHeadingPitchRoll = function (result) {
    return HeadingPitchRoll.fromQuaternion(this, result);
};

/**
 * 把地理坐标解析为 {@link Cartographic} 对象，输入按经度/纬度角度制处理。
 * @param {Cartographic|Geographic|Cartesian3|Array|object} value 待解析的值
 * @param {Cartographic} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Cartographic} 解析后的 Cartographic
 */
function parseToCartographic(value, result, ellipsoid) {
    if (value instanceof Cartographic) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof Geographic)
        return value.toCartographic(result);
    else if (value instanceof Cartesian3)
        return value.toCartographic(ellipsoid, result);
    const longitude = parseLongitude(value);
    const latitude = parseLatitude(value);
    const height = parseAltitude(value);
    return Cartographic.fromDegrees(longitude, latitude, height, result);
}

/**
 * 把地理坐标解析为 {@link Geographic} 对象，输入按角度制处理。
 * @param {Geographic|Cartographic|Cartesian3|Array|object} value 待解析的值
 * @param {Geographic} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Geographic} 解析后的 Geographic
 */
function parseToGeographic(value, result, ellipsoid) {
    if (value instanceof Geographic) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof Cartographic)
        return value.toGeographic(result);
    else if (value instanceof Cartesian3)
        return value.toGeographic(ellipsoid, result);
    const longitude = parseLongitude(value);
    const latitude = parseLatitude(value);
    const altitude = parseAltitude(value);
    return Geographic.fromDegrees(longitude, latitude, altitude, result);
}

/**
 * 扩展 Cesium 的 Rectangle 类，补充以度/米为单位的边界与尺寸属性，
 * 以及从中心与宽高、地理坐标创建矩形，编辑矩形、点包含判断等方法。
 * @class Rectangle
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Rectangle.html}
*/

Object.defineProperties(Rectangle.prototype, {
    /**
     * 矩形西边界经度，单位度。
     * @name westDegrees
     * @type {number}
     * @memberof Rectangle
    */
    westDegrees: {
        get: function () {
            return Math$1.toDegrees(this.west);
        }
    },
    /**
     * 矩形东边界经度，单位度。
     * @name eastDegrees
     * @type {number}
     * @memberof Rectangle
    */
    eastDegrees: {
        get: function () {
            return Math$1.toDegrees(this.east);
        }
    },
    /**
     * 矩形南边界纬度，单位度。
     * @name southDegrees
     * @type {number}
     * @memberof Rectangle
    */
    southDegrees: {
        get: function () {
            return Math$1.toDegrees(this.south);
        }
    },
    /**
     * 矩形北边界纬度，单位度。
     * @name northDegrees
     * @type {number}
     * @memberof Rectangle
    */
    northDegrees: {
        get: function () {
            return Math$1.toDegrees(this.north);
        }
    },
    /**
     * 矩形经度跨度，单位度。
     * @name widthInDegrees
     * @type {number}
     * @memberof Rectangle
    */
    widthInDegrees: {
        get: function () {
            return Math$1.toDegrees(this.width);
        }
    },
    /**
     * 矩形纬度跨度，单位度。
     * @name heightInDegrees
     * @type {number}
     * @memberof Rectangle
    */
    heightInDegrees: {
        get: function () {
            return Math$1.toDegrees(this.height);
        }
    },
    /**
     * 矩形中心线处的宽度，单位米。
     * @name centreWidthInMeters
     * @type {number}
     * @memberof Rectangle
    */
    centreWidthInMeters: {
        get: function () {
            return Rectangle.computeCentreWidthInMeters(this);
        }
    },
    /**
     * 矩形中心线处的高度，单位米。
     * @name centreHeightInMeters
     * @type {number}
     * @memberof Rectangle
    */
    centreHeightInMeters: {
        get: function () {
            return Rectangle.computeCentreHeightInMeters(this);
        }
    },
    /**
     * 矩形宽度，单位米（等同 centreWidthInMeters）。
     * @name widthInMeters
     * @type {number}
     * @memberof Rectangle
    */
    widthInMeters: {
        get: function () {
            return Rectangle.computeCentreWidthInMeters(this);
        }
    },
    /**
     * 矩形高度，单位米（等同 centreHeightInMeters）。
     * @name heightInMeters
     * @type {number}
     * @memberof Rectangle
    */
    heightInMeters: {
        get: function () {
            return Rectangle.computeCentreHeightInMeters(this);
        }
    },
    /**
     * 矩形北边宽度，单位米。
     * @name northWidthInMeters
     * @type {number}
     * @memberof Rectangle
    */
    northWidthInMeters: {
        get: function () {
            return Rectangle.computeNorthWidthInMeters(this);
        }
    },
    /**
     * 矩形南边宽度，单位米。
     * @name southWidthInMeters
     * @type {number}
     * @memberof Rectangle
    */
    southWidthInMeters: {
        get: function () {
            return Rectangle.computeSouthWidthInMeters(this);
        }
    },
    /**
     * 矩形西边高度，单位米。
     * @name westHeightInMeters
     * @type {number}
     * @memberof Rectangle
    */
    westHeightInMeters: {
        get: function () {
            return Rectangle.computeWestHeightInMeters(this);
        }
    },
    /**
     * 矩形东边高度，单位米。
     * @name eastHeightInMeters
     * @type {number}
     * @memberof Rectangle
    */
    eastHeightInMeters: {
        get: function () {
            return Rectangle.computeEastHeightInMeters(this);
        }
    },
    /**
     * 矩形中心点。
     * @name center
     * @type {Cartographic}
     * @memberof Rectangle
    */
    center: {
        get: function () {
            return Rectangle.center(this, new Cartographic());
        }
    },
    /**
     * 矩形中心点的地理坐标。
     * @name centerGeographic
     * @type {Geographic}
     * @memberof Rectangle
    */
    centerGeographic: {
        get: function () {
            return this.center.toGeographic();
        }
    },
    /**
     * 矩形东北角坐标。
     * @name northeast
     * @type {Cartographic}
     * @memberof Rectangle
    */
    northeast: {
        get: function () {
            return Rectangle.northeast(this, new Cartographic());
        }
    },
    /**
     * 矩形西北角坐标。
     * @name northwest
     * @type {Cartographic}
     * @memberof Rectangle
    */
    northwest: {
        get: function () {
            return Rectangle.northwest(this, new Cartographic());
        }
    },
    /**
     * 矩形东南角坐标。
     * @name southeast
     * @type {Cartographic}
     * @memberof Rectangle
    */
    southeast: {
        get: function () {
            return Rectangle.southeast(this, new Cartographic());
        }
    },
    /**
     * 矩形西南角坐标。
     * @name southwest
     * @type {Cartographic}
     * @memberof Rectangle
    */
    southwest: {
        get: function () {
            return Rectangle.southwest(this, new Cartographic());
        }
    },
});

/**
 * 计算矩形北边的地面宽度。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {number} 北边宽度，单位米。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeNorthWidthInMeters = function (rectangle, ellipsoid) {
    return Cartographic.surfaceDistance(rectangle.northwest, rectangle.northeast, ellipsoid);
};

/**
 * 计算矩形南边的地面宽度。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {number} 南边宽度，单位米。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeSouthWidthInMeters = function (rectangle, ellipsoid) {
    return Cartographic.surfaceDistance(rectangle.southwest, rectangle.southeast, ellipsoid);
};

/**
 * 计算矩形西边的地面高度。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {number} 西边高度，单位米。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeWestHeightInMeters = function (rectangle, ellipsoid) {
    return Cartographic.surfaceDistance(rectangle.northwest, rectangle.southwest, ellipsoid);
};

/**
 * 计算矩形东边的地面高度。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {number} 东边高度，单位米。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeEastHeightInMeters = function (rectangle, ellipsoid) {
    return Cartographic.surfaceDistance(rectangle.northeast, rectangle.southeast, ellipsoid);
};

/**
 * 计算矩形中心线处的宽度。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {number} 中心线处的宽度，单位米。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeCentreWidthInMeters = function (rectangle, ellipsoid) {
    const center = rectangle.center;
    const left = new Cartographic(rectangle.west, center.latitude);
    const right = new Cartographic(rectangle.east, center.latitude);
    return Cartographic.surfaceDistance(left, right, ellipsoid);
};

/**
 * 计算矩形中心线处的高度。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {number} 中心线处的高度，单位米。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeCentreHeightInMeters = function (rectangle, ellipsoid) {
    const center = rectangle.center;
    const top = new Cartographic(center.longitude, rectangle.north);
    const bottom = new Cartographic(center.longitude, rectangle.south);
    return Cartographic.surfaceDistance(top, bottom, ellipsoid);
};

/**
 * 计算包含一组矩形的最小外接矩形（并集）。
 * @param {Rectangle[]} rectangles 矩形数组。
 * @param {Rectangle} [result] 用于存储结果的可选对象。
 * @returns {Rectangle} 包含所有矩形的最小外接矩形。
 * @memberof Rectangle
 * @static
*/
Rectangle.fromRectangles = function (rectangles, result) {
    Check.typeOf.array('rectangles', rectangles);
    if (!result)
        result = new Rectangle();
    for (let i = 1; i < rectangles.length; i++) {
        const rectangle = rectangles[i];
        if (i === 1)
            Rectangle.union(rectangles[0], rectangle, result);
        else
            Rectangle.union(result, rectangle, result);
    }
    return result;
};

/**
 * 从中心点与宽、高（单位米）创建矩形。
 * @param {Cartographic|Cartesian3|Geographic} center 矩形中心点。
 * @param {number} width 矩形宽度，单位米，须大于 0。
 * @param {number} height 矩形高度，单位米，须大于 0。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @param {Rectangle} [result] 用于存储结果的可选对象。
 * @returns {Rectangle} 生成的矩形。
 * @memberof Rectangle
 * @static
*/
Rectangle.fromCenterWidthHeight = function (center, width, height, ellipsoid, result) {
    Check.defined('center', center);
    Check.typeOf.number.greaterThan('width', width, 0);
    Check.typeOf.number.greaterThan('height', height, 0);

    let centerCar;
    if (center instanceof Cartographic)
        centerCar = center;
    else if (center instanceof Cartesian3 || center instanceof Geographic)
        centerCar = center.toCartographic(ellipsoid);
    else
        throw new DeveloperError('illegal center value.');

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const northCar = Cartographic.moveToNorth(centerCar, halfHeight, ellipsoid);
    const southCar = Cartographic.moveToSouth(centerCar, halfHeight, ellipsoid);
    const eastCar = Cartographic.moveToEast(centerCar, halfWidth, ellipsoid);
    const westCar = Cartographic.moveToWest(centerCar, halfWidth, ellipsoid);

    return Rectangle.fromCartographicArray([northCar, southCar, eastCar, westCar], result);
};

/**
 * 从中心点与尺寸对象（x 为宽、y 为高，单位米）创建矩形。
 * @param {Cartographic|Cartesian3|Geographic} center 矩形中心点。
 * @param {Cartesian2} dimensions 尺寸对象，x 为宽度、y 为高度，单位米。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @param {Rectangle} [result] 用于存储结果的可选对象。
 * @returns {Rectangle} 生成的矩形。
 * @memberof Rectangle
 * @static
*/
Rectangle.fromCenterDimensions = function (center, dimensions, ellipsoid, result) {
    Check.defined('dimensions', dimensions);
    return Rectangle.fromCenterWidthHeight(center, dimensions.x, dimensions.y, ellipsoid, result);
};

/**
 * 从一组地理坐标点创建包含这些点的矩形。
 * @param {Array} geographics 地理坐标点数组。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @param {Rectangle} [result] 用于存储结果的可选对象。
 * @returns {Rectangle} 包含所有点的矩形。
 * @memberof Rectangle
 * @static
*/
Rectangle.fromGeographicArray = function (geographics, ellipsoid, result) {
    const cartesians = Cartesian3.fromGeographicArray(geographics, ellipsoid);
    return Rectangle.fromCartesianArray(cartesians, ellipsoid, result);
};

/**
 * 计算矩形四个角点的地理坐标（按西北、东北、东南、西南顺序）。
 * @param {Rectangle|object} options 矩形对象，或包含 rectangle 与可选 height 的配置对象。
 * @param {Array} [result=[]] 用于存储结果的数组。
 * @returns {Array} 矩形四个角点的 Cartographic 数组。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeRectangleCartographics = function (options, result = []) {
    Check.defined('options', options);
    if (options instanceof Rectangle)
        options = {
            rectangle: options
        };
    Check.defined('options.rectangle', options.rectangle);

    const rectangle = options.rectangle;
    const height = options.height;

    result[0] = rectangle.northwest;
    result[1] = rectangle.northeast;
    result[2] = rectangle.southeast;
    result[3] = rectangle.southwest;

    if (defined$1(height)) {
        result[0].height = height;
        result[1].height = height;
        result[2].height = height;
        result[3].height = height;
    }

    return result;
};

/**
 * 计算矩形四个角点的地理坐标数组。
 * @param {Rectangle|object} options 矩形对象，或包含 rectangle 与可选 height 的配置对象。
 * @param {Array} [result] 用于存储结果的数组。
 * @returns {Array} 矩形四个角点的 Geographic 数组。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeRectangleGeographics = function (options, result) {
    const cartographics = Rectangle.computeRectangleCartographics(options);

    return Geographic.fromCartographicArray(cartographics, result);
};

/**
 * 计算矩形四个角点的世界坐标数组。
 * @param {Rectangle|object} options 矩形对象，或包含 rectangle 与可选 height 的配置对象。
 * @param {Array} [result] 用于存储结果的数组。
 * @returns {Array} 矩形四个角点的 Cartesian3 数组。
 * @memberof Rectangle
 * @static
*/
Rectangle.computeRectanglePositions = function (options, result) {
    const cartographics = Rectangle.computeRectangleCartographics(options);

    return Cartesian3.fromCartographicArray(cartographics, result);
};

/**
 * 判断给定的地理坐标（Cartographic）是否位于矩形范围内。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Cartographic} cartographic 待判断的地理坐标。
 * @returns {boolean} 若点在矩形内返回 true，否则返回 false。
 * @memberof Rectangle
 * @static
*/
Rectangle.containsCartographicPoint = function (rectangle, cartographic) {
    Check.defined('rectangle', rectangle);
    Check.defined('cartographic', cartographic);
    cartographic = parseToCartographic(cartographic);
    let east = rectangle.east;
    const west = rectangle.west;
    if (east < west) {
        east += Math$1.TWO_PI;
    }
    const south = rectangle.south;
    const north = rectangle.north;
    if (cartographic.longitude < west || cartographic.longitude > east || cartographic.latitude < south || cartographic.latitude > north)
        return false;
    return true;
};

/**
 * 判断给定的地理坐标（Cartographic）是否位于当前矩形范围内。
 * @param {Cartographic} cartographic 待判断的地理坐标。
 * @returns {boolean} 若点在矩形内返回 true，否则返回 false。
 * @memberof Rectangle
*/
Rectangle.prototype.containsCartographicPoint = function (cartographic) {
    return Rectangle.containsCartographicPoint(this, cartographic);
};

/**
 * 判断给定的地理坐标（Geographic）是否位于矩形范围内。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Geographic} geographic 待判断的地理坐标。
 * @returns {boolean} 若点在矩形内返回 true，否则返回 false。
 * @memberof Rectangle
 * @static
*/
Rectangle.containsGeographicPoint = function (rectangle, geographic) {
    Check.defined('rectangle', rectangle);
    Check.defined('geographic', geographic);
    geographic = parseToGeographic(geographic);
    const cartographic = geographic.toCartographic();
    return Rectangle.containsCartographicPoint(rectangle, cartographic);
};

/**
 * 判断给定的地理坐标（Geographic）是否位于当前矩形范围内。
 * @param {Geographic} geographic 待判断的地理坐标。
 * @returns {boolean} 若点在矩形内返回 true，否则返回 false。
 * @memberof Rectangle
*/
Rectangle.prototype.containsGeographicPoint = function (geographic) {
    return Rectangle.containsGeographicPoint(this, geographic);
};

/**
 * 判断给定的世界坐标位置是否位于矩形范围内。
 * @param {Rectangle} rectangle 目标矩形。
 * @param {Cartesian3} position 待判断的世界坐标位置。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {boolean} 若点在矩形内返回 true，否则返回 false。
 * @memberof Rectangle
 * @static
*/
Rectangle.containsPoint = function (rectangle, position, ellipsoid) {
    Check.defined('rectangle', rectangle);
    Check.defined('position', position);
    position = parseToCartesian3(position);
    const cartographic = position.toCartographic(ellipsoid);
    return Rectangle.containsCartographicPoint(rectangle, cartographic);
};

/**
 * 判断给定的世界坐标位置是否位于当前矩形范围内。
 * @param {Cartesian3} position 待判断的世界坐标位置。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @returns {boolean} 若点在矩形内返回 true，否则返回 false。
 * @memberof Rectangle
*/
Rectangle.prototype.containsPoint = function (position, ellipsoid) {
    return Rectangle.containsPoint(this, position, ellipsoid);
};

/**
 * 将当前矩形各边界以角度值输出到对象中。
 * @param {object} [result={}] 用于存储结果的对象。
 * @returns {object} 包含 west、south、east、north（单位度）的对象。
 * @memberof Rectangle
*/
Rectangle.prototype.toDegrees = function (result = {}) {
    result.west = this.westDegrees;
    result.south = this.southDegrees;
    result.east = this.eastDegrees;
    result.north = this.northDegrees;
    // result.northwest = this.northwest.toGeographic();
    // result.northeast = this.northeast.toGeographic();
    // result.southwest = this.southwest.toGeographic();
    // result.southeast = this.southeast.toGeographic();
    return result;
};

/**
 * 扩展 Cesium 的 SceneTransforms 类，补充 NDC 与世界坐标互转、
 * 以及世界坐标转视空间坐标的方法。
 * @class SceneTransforms
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/SceneTransforms.html}
*/

/**
 * 将归一化设备坐标（NDC）转换为世界坐标。
 * @param {Scene} scene 场景对象。
 * @param {Cartesian4} ndcPosition 归一化设备坐标位置。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 转换后的世界坐标。
 * @memberof SceneTransforms
 * @static
*/
SceneTransforms.ndcToWorldCoordinates = function (scene, ndcPosition, result) {
    const context = scene.context;
    const uniformState = context.uniformState;
    let worldCoords;
    let frustum = scene.camera.frustum;
    if (!defined$1(frustum.fovy)) {
        if (defined$1(frustum._offCenterFrustum)) {
            frustum = frustum._offCenterFrustum;
        }
        worldCoords = Scratch.scratchCartesian4;
        worldCoords.x = (ndcPosition.x * (frustum.right - frustum.left) + frustum.left + frustum.right) * 0.5;
        worldCoords.y = (ndcPosition.y * (frustum.top - frustum.bottom) + frustum.bottom + frustum.top) * 0.5;
        worldCoords.z = (ndcPosition.z * (near - far) - near - far) * 0.5;
        worldCoords.w = 1.0;

        worldCoords = Matrix4.multiplyByVector(uniformState.inverseView, worldCoords, worldCoords);
    } else {
        const ndc = Cartesian4.fromElements(ndcPosition.x, ndcPosition.y, ndcPosition.z, 1, Scratch.scratchNDC);
        worldCoords = Matrix4.multiplyByVector(uniformState.inverseViewProjection, ndc, Scratch.scratchCartesian4);

        // Reverse perspective divide
        const w = 1.0 / worldCoords.w;
        Cartesian3.multiplyByScalar(worldCoords, w, worldCoords);
    }
    return Cartesian3.fromCartesian4(worldCoords, result);
};

/**
 * 将世界坐标位置转换为归一化设备坐标（NDC）。
 * @param {Scene} scene 场景对象。
 * @param {Cartesian3} position 世界坐标位置。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 转换后的归一化设备坐标。
 * @memberof SceneTransforms
 * @static
*/
SceneTransforms.cartesianToNDC = function (scene, position, result = new Cartesian3()) {
    const context = scene.context;
    const uniformState = context.uniformState;
    const worldCoords = Cartesian4.fromElements(position.x, position.y, position.z, 1, Scratch.scratchCartesian4);
    const ndc = Matrix4.multiplyByVector(uniformState.viewProjection, worldCoords, Scratch.scratchNDC);
    return Cartesian3.divideByScalar(ndc, ndc.w, result);
};

/**
 * 将世界坐标位置转换为相机视空间坐标。
 * @param {Scene} scene 场景对象。
 * @param {Cartesian3} position 世界坐标位置。
 * @param {Cartesian4} [result=new Cartesian4()] 用于存储结果的可选对象。
 * @returns {Cartesian4} 相机视空间坐标。
 * @memberof SceneTransforms
 * @static
*/
SceneTransforms.cartesianToEyeCoordinates = function (scene, position, result = new Cartesian4()) {
    const camera = scene.camera;
    const viewMatrix = camera.viewMatrix;
    const worldCoords = Cartesian4.fromElements(position.x, position.y, position.z, 1, Scratch.scratchCartesian4);
    Matrix4.multiplyByVector(viewMatrix, worldCoords, result);
    return result;
};

/**
 * 扩展 Cesium 的 Spherical 类，补充以角度表示的 clock、cone 属性。
 * @class Spherical
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Spherical.html}
*/

Object.defineProperties(Spherical.prototype, {
    /**
     * 绕 z 轴的旋转角（clock），单位度。
     * @name clockDegrees
     * @type {number}
     * @memberof Spherical
    */
    clockDegrees: {
        get: function () {
            return Math$1.toDegrees(this.clock);
        }
    },
    /**
     * 与 z 轴的夹角（cone），单位度。
     * @name coneDegrees
     * @type {number}
     * @memberof Spherical
    */
    coneDegrees: {
        get: function () {
            return Math$1.toDegrees(this.cone);
        }
    },
});

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
}

/**
 * 把姿态值解析为 3x3 旋转矩阵（{@link Matrix3}）。
 * @param {HeadingPitchRoll|Array|object|string|number} attitude 待解析的姿态值
 * @param {Matrix3} [result] 用于存储结果的可选对象
 * @returns {Matrix3} 解析后的旋转矩阵
 */
function parseAttitudeToMatrix3(attitude, result) {
    const hpr = parseAttitudeToHeadingPitchRoll(attitude, Scratch.scratchHeadingPitchRoll);
    return Matrix3.fromHeadingPitchRoll(hpr, result);
}

/**
 * 把地理坐标解析为笛卡尔坐标（{@link Cartesian3}），输入按弧度处理。
 * @param {Cartographic|Array|object} cartographic 待解析的地理坐标，含经度/纬度/高度信息
 * @param {Cartesian3} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Cartesian3} 解析后的笛卡尔坐标
 */
function parseCartographicToCartesian(cartographic, result, ellipsoid) {
    const longitude = parseLongitude(cartographic);
    const latitude = parseLatitude(cartographic);
    const height = parseAltitude(cartographic);
    return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
}

/**
 * 把地理坐标数组批量解析为笛卡尔坐标数组（{@link Cartesian3}），输入按弧度处理。
 * @param {Array} cartographics 地理坐标数组
 * @param {Array} [result=[]] 用于存储结果的数组
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Array} 解析后的笛卡尔坐标数组
 */
function parseCartographicsToPositions(cartographics, result = [], ellipsoid) {
    Check.typeOf.array('cartographics', cartographics);
    for (let i = 0; i < cartographics.length; i++) {
        result[i] = parseCartographicToCartesian(cartographics[i], result[i], ellipsoid);
    }
    return result;
}

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
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link ClockRange} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'clamped'、'loop_stop'、'unbounded'
 * @returns {ClockRange} 解析后的 ClockRange
 */
function parseClockRange(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'clamped':
                return ClockRange.CLAMPED;
            case 'loop_stop':
                return ClockRange.LOOP_STOP;
            case 'unbounded':
            default:
                return ClockRange.UNBOUNDED;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to ClockRange.');
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link ColorBlendMode} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'replace'、'mix'、'highlight'
 * @returns {ColorBlendMode} 解析后的 ColorBlendMode
 */
function parseColorBlendMode(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'replace':
                return ColorBlendMode.REPLACE;
            case 'mix':
                return ColorBlendMode.MIX;
            case 'highlight':
            default:
                return ColorBlendMode.HIGHLIGHT;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to ColorBlendMode.');
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link CornerType} 枚举值。
 * @param {string|number} value 待解析的值，字符串包含 'bevel' 返回 BEVELED、包含 'miter' 返回 MITERED
 * @returns {CornerType} 解析后的 CornerType
 */
function parseCornerType(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value.match('bevel'))
            return CornerType.BEVELED;
        else if (value.match('miter'))
            return CornerType.MITERED;
        else
            return CornerType.ROUNDED;
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to CornerType.');
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link CullFace} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'front'、'back'、'front_and_back'、'none'
 * @returns {CullFace} 解析后的 CullFace，无法识别时返回 CullFace.NONE
 */
function parseCullFace(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'front':
                return CullFace.FRONT;
            case 'back':
                return CullFace.BACK;
            case 'front_and_back':
                return CullFace.FRONT_AND_BACK;
            case 'none':
            default:
                return CullFace.NONE;
        }
    } else if (typeof value === 'number')
        return value;
    else
        return CullFace.NONE;
}

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
}

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
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link LabelStyle} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'outline'、'fill_and_outline'、'fill'
 * @returns {LabelStyle} 解析后的 LabelStyle
 */
function parseLabelStyle(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'outline':
                return LabelStyle.OUTLINE;
            case 'fill_and_outline':
                return LabelStyle.FILL_AND_OUTLINE;
            case 'fill':
            default:
                return LabelStyle.FILL;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to LabelStyle.');
}

/**
 * 把多种旋转表示解析为 3x3 旋转矩阵（{@link Matrix3}）。
 * @param {Matrix3|HeadingPitchRoll|Quaternion|Array|object} value 待解析的旋转值
 * @param {Matrix3} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {Matrix3} 解析后的旋转矩阵
 */
function parseRotationToMatrix3(value, result, isDegrees) {
    if (value instanceof Matrix3) {
        if (result && value !== result)
            return Matrix3.clone(value, result);
        else
            return value;
    } else {
        const hpr = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, isDegrees);
        return Matrix3.fromHeadingPitchRoll(hpr, result);
    }
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link ShadowMode} 枚举值。
 * @param {string|number} value 待解析的值，字符串包含 'cast' 返回 CAST_ONLY、'receive' 返回 RECEIVE_ONLY、'enable' 返回 ENABLED
 * @returns {ShadowMode} 解析后的 ShadowMode
 */
function parseShadowMode(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value.match('cast'))
            return ShadowMode.CAST_ONLY;
        else if (value.match('receive'))
            return ShadowMode.RECEIVE_ONLY;
        else if (value.match('enable'))
            return ShadowMode.ENABLED;
        else
            return ShadowMode.DISABLED;
    } else if (typeof value === 'number')
        return value;
    else
        return ShadowMode.DISABLED;
}

/**
 * 把数组或对象解析为包围矩形（{@link BoundingRectangle}）。
 * @param {BoundingRectangle|Array|object} value 待解析的值
 * @param {BoundingRectangle} [result] 用于存储结果的可选对象
 * @returns {BoundingRectangle} 解析后的包围矩形
 */
function parseToBoundingRectangle(value, result) {
    if (value instanceof BoundingRectangle) {
        if (result && value !== result) {
            BoundingRectangle.clone(value, result);
            return result;
        } else
            return value;
    }

    if (result === undefined)
        result = new BoundingRectangle();

    if (Array.isArray(value)) {
        BoundingRectangle.unpack(value, 0, result);
    } else if (typeof value === 'object') {
        BoundingRectangle.clone(value, result);
    } else {
        throw new DeveloperError('can not parse the ' + value + ' to BoundingRectangle.');
    }

    return result;
}

/**
 * 把数字、字符串或数组/对象解析为二维笛卡尔坐标（{@link Cartesian2}）。
 * @param {Cartesian2|number|string|Array|object} value 待解析的值，支持 [x,y] 数组或含 x/y 字段的对象
 * @param {Cartesian2} [result] 用于存储结果的可选对象
 * @param {number} [defaultValue=0.0] 缺省分量的默认值
 * @returns {Cartesian2} 解析后的二维笛卡尔坐标
 */
function parseToCartesian2(value, result, defaultValue = 0.0) {
    if (!defined$1(value)) {
        if (typeof defaultValue === 'number')
            return Cartesian2.fromElements(defaultValue, defaultValue, result);
        else
            throw new DeveloperError('value undefined.');
    } else if (value instanceof Cartesian2) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (typeof value === 'number' || typeof value === 'string') {
        value = parseNumber(value);
        return Cartesian2.fromElements(value, value, result);
    }
    const x = getValidValue(value[0], value.x, defaultValue);
    Check.typeOf.number('x', x);
    const y = getValidValue(value[1], value.y, defaultValue);
    Check.typeOf.number('y', y);
    return Cartesian2.fromElements(x, y, result);
}

/**
 * 把数组批量解析为三维笛卡尔坐标数组（{@link Cartesian3}）。
 * @param {Array} array 待解析的数组
 * @param {Array} [result=[]] 用于存储结果的数组
 * @param {number} [defaultValue] 缺省分量的默认值
 * @returns {Array} 解析后的三维笛卡尔坐标数组
 */
function parseToCartesian3Array(array, result = [], defaultValue) {
    Check.typeOf.array('array', array);

    for (let i = 0; i < array.length; i++) {
        result[i] = parseToCartesian3(array[i], result[i], defaultValue);
    }
    return result;
}

/**
 * 把数字、字符串或数组/对象解析为四维笛卡尔坐标（{@link Cartesian4}）。
 * @param {Cartesian4|number|string|Array|object} value 待解析的值，支持 [x,y,z,w] 数组或含 x/y/z/w 字段的对象
 * @param {Cartesian4} [result] 用于存储结果的可选对象
 * @param {number} [defaultValue=0.0] 缺省分量的默认值
 * @returns {Cartesian4} 解析后的四维笛卡尔坐标
 */
function parseToCartesian4(value, result, defaultValue = 0.0) {
    if (!defined$1(value)) {
        if (typeof defaultValue === 'number')
            return Cartesian4.fromElements(defaultValue, defaultValue, defaultValue, defaultValue, result);
        else
            throw new DeveloperError('value undefined.');
    } else if (value instanceof Cartesian4) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (typeof value === 'number' || typeof value === 'string') {
        value = parseNumber(value);
        return Cartesian4.fromElements(value, value, value, value, result);
    }
    const x = getValidValue(value[0], value.x, defaultValue);
    Check.typeOf.number('x', x);
    const y = getValidValue(value[1], value.y, defaultValue);
    Check.typeOf.number('y', y);
    const z = getValidValue(value[2], value.z, defaultValue);
    Check.typeOf.number('z', z);
    const w = getValidValue(value[3], value.w, defaultValue);
    Check.typeOf.number('w', w);
    return Cartesian4.fromElements(x, y, z, w, result);
}

/**
 * 把数组、对象、数字或字符串解析为 {@link DistanceDisplayCondition} 对象。
 * @param {DistanceDisplayCondition|Array|object|number|string} value 待解析的值，数字/字符串时以 near=0、该值为 far 处理
 * @param {DistanceDisplayCondition} [result] 用于存储结果的可选对象
 * @returns {DistanceDisplayCondition} 解析后的距离显示条件
 */
function parseToDistanceDisplayCondition(value, result) {
    if (!value) return;

    if (value instanceof DistanceDisplayCondition) {
        if (result && value !== result) {
            DistanceDisplayCondition.clone(value, result);
            return result;
        } else
            return value;
    }

    if (result === undefined)
        result = new DistanceDisplayCondition();

    if (Array.isArray(value)) {
        DistanceDisplayCondition.unpack(value, 0, result);
    } else if (typeof value === 'object') {
        DistanceDisplayCondition.clone(value, result);
    } else if (typeof value === 'number') {
        result.near = 0;
        result.far = value;
    } else if (typeof value === 'string') {
        result.near = 0;
        result.far = parseFloat(value);
    } else {
        throw new DeveloperError('can not parse the ' + value + ' to DistanceDisplayCondition.');
    }

    return result;
}

/**
 * 把日期字符串、数字时间戳、Date 或 {@link JulianDate} 解析为儒略日期。
 * @param {JulianDate|string|number|Date} value 待解析的值
 * @param {JulianDate} [result] 用于存储结果的可选对象
 * @returns {JulianDate} 解析后的儒略日期
 */
function parseToJulianDate(value, result) {
    if (value instanceof JulianDate) {
        if (result && value !== result)
            return JulianDate.clone(value, result);
        else
            return value;
    } else if (typeof value === 'string' || typeof value === 'number') {
        return JulianDate.fromDate(new Date(value), result);
    } else if (value instanceof Date) {
        return JulianDate.fromDate(value, result);
    }
}

/**
 * 把数组或对象解析为 {@link NearFarScalar} 对象。
 * @param {NearFarScalar|Array|object} value 待解析的值
 * @param {NearFarScalar} [result] 用于存储结果的可选对象
 * @returns {NearFarScalar} 解析后的 NearFarScalar
 */
function parseToNearFarScalar(value, result) {
    if (value instanceof NearFarScalar) {
        if (result && value !== result) {
            NearFarScalar.clone(value, result);
            return result;
        } else
            return value;
    }

    if (result === undefined)
        result = new NearFarScalar();

    if (Array.isArray(value)) {
        NearFarScalar.unpack(value, 0, result);
    } else if (typeof value === 'object') {
        NearFarScalar.clone(value, result);
    } else {
        throw new DeveloperError('can not parse the ' + value + ' to NearFarScalar.');
    }

    return result;
}

/**
 * 把对象或数组解析为平面（{@link Plane}）。
 * @param {Plane|Array|object} value 待解析的值，支持 [x,y,z,w] 数组、含 point/normal 或 normal/distance 字段的对象
 * @param {Plane} [result] 用于存储结果的可选对象
 * @returns {Plane} 解析后的平面
 */
function parseToPlane(value, result) {
    Check.defined('value', value);
    if (value instanceof Plane) {
        if (result && value !== result)
            return Plane.clone(value, result);
        else
            return value;
    } else if (defined$1(value.point) && defined$1(value.normal)) {
        return Plane.fromPointNormal(value.point, value.normal, result);
    } else if (defined$1(value.normal) && defined$1(value.distance)) {
        if (!result)
            result = new Plane();
        Cartesian3.clone(value.normal, result.normal);
        result.distance = value.distance;
        return result;
    }

    const x = getValidValue(value[0], value.x);
    const y = getValidValue(value[1], value.y);
    const z = getValidValue(value[2], value.z);
    const w = getValidValue(value[3], value.w);
    const coefficients = Cartesian4.fromElements(x, y, z, w, Scratch.scratchCartesian4);
    return Plane.fromCartesian4(coefficients, result);
}

/**
 * 把洞信息解析为 {@link PolygonHierarchy} 数组。
 * @param {PolygonHierarchy|Array|object} holes 待解析的洞信息
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Array} 解析后的 PolygonHierarchy 数组
 */
function parseHoles(holes, ellipsoid) {
    if (holes instanceof PolygonHierarchy)
        return [holes];
    else if (Array.isArray(holes)) {
        if (holes[0] instanceof Cartesian3 || defined$1(holes[0].x))
            return [parseToPolygonHierarchy(holes, undefined)];
        else if (holes[0] instanceof PolygonHierarchy)
            return holes;
        const result = [];
        for (let i = 0; i < holes.length; i++) {
            const hierarchy = parseToPolygonHierarchy(holes[i].positions, holes[i].holes);
            result.push(hierarchy);
        }
        return result;
    } else if (typeof holes === 'object') {
        const result = [];
        const hierarchy = parseToPolygonHierarchy(holes.positions, holes.holes);
        result.push(hierarchy);
        return result;
    } else {
        throw new DeveloperError('unsupported holes: ' + holes);
    }
}
/**
 * 把顶点坐标与洞信息解析为多边形层级（{@link PolygonHierarchy}）。
 * @param {Array} positions 多边形顶点坐标
 * @param {PolygonHierarchy|Array|object} [holes] 洞信息
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {PolygonHierarchy} 解析后的多边形层级
 */
function parseToPolygonHierarchy(positions, holes, ellipsoid) {
    if (defined$1(holes)) {
        holes = parseHoles(holes);
    }
    return new PolygonHierarchy(positions, holes);
}

/**
 * 判断一个数值是否在两个数值之间
 * @param {Number} value 需要判断的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @param {Boolean} equalsMinimum 可否等于较小数，默认true
 * @param {Boolean} equalsMaximum 可否等于较大数，默认true
 * @returns {Boolean} 判断结果
 */
function isBetween(value, rangeMinimum, rangeMaximum, equalsMinimum = true, equalsMaximum = true) {
    if (equalsMinimum ? value < rangeMinimum : value <= rangeMinimum)
        return false;
    if (equalsMaximum ? value > rangeMaximum : value >= rangeMaximum)
        return false;
    return true;
}

/**
 * 将一个数值约束在两个数值之间
 * @param {Number} value 需要约束的数值
 * @param {Number} min 较小数
 * @param {Number} max 较大数
 * @returns {Number} 约束后的数值
 */
function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}

/**
 * 在两个数值之间线性插值
 * @param {Number} start 开始数值
 * @param {Number} end 结束数值
 * @param {Number} scalar 插值标量，needClamp为true时约束在[0,1]区间内，为false时可超出[0,1]区间
 * @param {Boolean} needClamp 是否需要约束插值，默认true
 * @returns {Number} 插值结果
 */
function lerp(start, end, scalar, needClamp = true) {
    if (needClamp)
        scalar = clamp(scalar, 0, 1);
    return start + (end - start) * scalar;
}

/**
 * 计算一个数值在两个数值范围内的线性插值标量
 * @param {Number} value 需要计算的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @param {Boolean} needClamp 是否需要约束至0到1之间，默认false
 * @returns {Number} 插值标量
 */
function scalarInRange(value, rangeMinimum, rangeMaximum, needClamp = false) {
    let scalar = (value - rangeMinimum) / (rangeMaximum - rangeMinimum);
    if (needClamp)
        scalar = clamp(scalar, 0, 1);
    return scalar;
}

/**
 * 数学上的区间对象
*/
class Interval {
    /**
     * 构造函数
     * @param {Number} start 区间开始值，默认0
     * @param {Number} end 区间结束值，默认1
     * @param {Boolean} equalsStart 区间范围是否可等于开始值，默认true
     * @param {Boolean} equalsEnd 区间范围是否可等于结束值，默认true
     */
    constructor(start = 0, end = 1, equalsStart = true, equalsEnd = true) {
        this.setValues(start, end, equalsStart, equalsEnd);
    }

    /**
     * 设置区间参数值
     * @param {Number} start 区间开始值，默认0
     * @param {Number} end 区间结束值，默认1
     * @param {Boolean} equalsStart 区间范围是否可等于开始值，默认true
     * @param {Boolean} equalsEnd 区间范围是否可等于结束值，默认true
     * @returns {Interval} 返回自身
     */
    setValues(start = 0, end = 1, equalsStart = true, equalsEnd = true) {
        if (start > end)
            throw new Error('the start value must be less than or equals end value.');

        this.start = start;
        this.end = end;
        this.equalsStart = equalsStart;
        this.equalsEnd = equalsEnd;

        return this;
    }

    /**
     * 判断该区间是否为空集
     * @returns {Boolean}
     */
    isEmpty() {
        return this.start === this.end;
    }

    /**
     * 获取区间长度
     * @returns {Number}
     */
    get length() {
        return this.end - this.start;
    }

    set minimum(value) {
        this.start = value;
    }

    get minimum() {
        return this.start;
    }

    set maximum(value) {
        this.end = value;
    }

    get maximum() {
        return this.end;
    }

    /**
     * 判断一个数值是否处于该区间内
     * @param {Number} 需要判断的数值
     * @returns {Boolean} 判断结果
     */
    isBetween(value) {
        return isBetween(value, this.start, this.end, this.equalsStart, this.equalsEnd);
    }

    between(value) {
        return this.isBetween(value);
    }

    /**
     * 在该区间内线性插值
     * @param {Number} scalar 插值标量，needClamp为true时约束在[0,1]区间内，为false时可超出[0,1]区间
     * @param {Boolean} needClamp 是否需要约束插值，默认true
     * @returns {Number} 插值结果
     */
    lerp(scalar, needClamp = true) {
        return lerp(this.start, this.end, scalar, needClamp);
    }

    /**
     * 计算一个数值在当前区间内的线性插值标量
     * @param {Number} value 需要计算的数值
     * @param {Boolean} needClamp 是否需要约束至0到1之间，默认true
     * @returns {Number} 插值标量
     */
    scalar(value, needClamp = true) {
        return scalarInRange(value, this.start, this.end, needClamp);
    }

    /**
     * 判断两个区间对象是否相等
     * @param {Interval} left
     * @param {Interval} right
     * @returns {Boolean}
     */
    static equals(left, right) {
        if (left === right)
            return true;
        if (left && right
            && left.start === right.start
            && left.end === right.end
            && left.equalsStart === right.equalsStart
            && left.equalsEnd === right.equalsEnd)
            return true;
        return false;
    }

    /**
     * 判断当前区间是否与另一个区间相等
     * @param {Interval} other
     * @returns {Boolean}
     */
    equals(other) {
        return Interval.equals(this, other);
    }

    /**
     * 两个区间相加，left + right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static add(left, right, result = new Interval()) {
        result.start = left.start + right.start;
        result.end = left.end + right.end;
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间与另一个区间相加
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    add(other, result) {
        return Interval.add(this, other, result || this);
    }

    /**
     * 两个区间相减，left - right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static subtract(left, right, result = new Interval()) {
        result.start = left.start - right.start;
        result.end = left.end - right.end;
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间减去另一个区间
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    subtract(other, result) {
        return Interval.subtract(this, other, result || this);
    }

    /**
     * 两个区间相乘，left x right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static multiply(left, right, result = new Interval()) {
        const ac = left.start * right.start;
        const ad = left.start * right.end;
        const bc = left.end * right.start;
        const bd = left.end * right.end;
        result.start = Math.min(ac, ad, bc, bd);
        result.end = Math.max(ac, ad, bc, bd);
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间乘以另一个区间
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    multiply(other, result) {
        return Interval.multiply(this, other, result || this);
    }

    /**
     * 两个区间相除，left / right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static divide(left, right, result = new Interval()) {
        const ac = left.start / right.start;
        const ad = left.start / right.end;
        const bc = left.end / right.start;
        const bd = left.end / right.end;
        result.start = Math.min(ac, ad, bc, bd);
        result.end = Math.max(ac, ad, bc, bd);
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间除以另一个区间
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    divide(other, result) {
        return Interval.divide(this, other, result || this);
    }

    /**
     * 克隆一个区间对象
     * @param {Interval} interval 需要克隆的区间对象
     * @param {Interval} result 结果区间对象，可不设置
     * @returns {Interval} 结果区间对象
     */
    static clone(interval, result = new Interval()) {
        result.start = interval.start;
        result.end = interval.end;
        result.equalsStart = interval.equalsStart;
        result.equalsEnd = interval.equalsEnd;

        return result;
    }

    /**
     * 克隆当前区间对象
     * @param {Interval} result 结果区间对象，可不设置
     * @returns {Interval} 结果区间对象
     */
    clone(result) {
        return Interval.clone(this, result);
    }

    /**
     * 将一个区间对象的所有属性打包到一个数组中
     * @param {Interval} interval 需要打包的区间对象
     * @param {Array} array 打包到的目标数组，可不填
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @returns {Array} 打包后的数组
     */
    static pack(interval, array = [], startingIndex = 0) {
        array[startingIndex++] = interval.start;
        array[startingIndex++] = interval.end;
        array[startingIndex++] = interval.equalsStart;
        array[startingIndex++] = interval.equalsEnd;

        return array;
    }

    /**
     * 将当前区间对象属性打包至数组
     * @param {Array} array 打包到的目标数组，可不填
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @returns {Array} 打包后的数组
     */
    toArray(array, startingIndex = 0) {
        return Interval.pack(this, array, startingIndex);
    }

    /**
     * 从一个数组中提取一个区间对象的所有属性
     * @param {Array} array 提取属性的数组
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static unpack(array, startingIndex = 0, result = new Interval()) {
        result.start = array[startingIndex++];
        result.end = array[startingIndex++];
        result.equalsStart = array[startingIndex++];
        result.equalsEnd = array[startingIndex++];

        return result;
    }

    /**
     * 等同于Interval.unpack
     * 
     * @see Interval.unpack
    */
    static fromArray(array, startingIndex, result) {
        return Interval.unpack(array, startingIndex, result);
    }

    /**
     * 从一个数组给当前区间对象赋值
     * @param {Array} array 提取属性的数组
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @returns {Interval} 当前区间对象
     */
    setFromArray(array, startingIndex = 0) {
        return Interval.unpack(array, startingIndex, this);
    }

    toString() {
        return 'Interval:' + (this.equalsStart ? '[' : '(') + this.start + ', ' + this.end + (this.equalsEnd ? ']' : ')');
    }
}
Interval.packedLength = 4;

/**
 * 把数组或对象解析为区间（Interval）。
 * @param {Interval|Array|object} value 待解析的值，支持 [minimum,maximum] 数组或含 start/end/min/max 等字段的对象
 * @param {Interval} [result=new Interval()] 用于存储结果的可选对象
 * @returns {Interval} 解析后的区间对象
 */
function parseToRange(value, result = new Interval()) {
    Check.defined('value', value);
    if (value instanceof Interval) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    }
    const minimum = getValidValue(value[0], value.start, value.minimum, value.min, value.x);
    const maximum = getValidValue(value[1], value.end, value.maximum, value.max, value.y);
    result.setValues(minimum, maximum);
    return result;
}

/**
 * 把字符串、数组或对象解析为时间区间（{@link TimeInterval}）。
 * @param {TimeInterval|string|Array|object} value 待解析的值，字符串按 ISO8601 解析，数组为 [start,stop]
 * @param {TimeInterval} [result] 用于存储结果的可选对象
 * @returns {TimeInterval} 解析后的时间区间
 */
function parseToTimeInterval(value, result) {
    if (value instanceof TimeInterval) {
        if (result && value !== result)
            return TimeInterval.clone(value, result);
        else
            return value;
    } else if (typeof value === 'string')
        return TimeInterval.fromIso8601(value, result);

    if (result === undefined)
        result = new TimeInterval();

    if (Array.isArray(value)) {
        let start = parseToJulianDate(value[0]);
        let stop = parseToJulianDate(value[1]);
        result.start = start;
        result.stop = stop;
    } else if (typeof value === 'object') {
        let start = value.start || value.startTime;
        start = parseToJulianDate(start);
        let stop = value.stop || value.stopTime;
        stop = parseToJulianDate(stop);
        result.start = start;
        result.stop = stop;
        if (value.data !== undefined)
            result.data = value.data;
        if (value.isStartIncluded)
            result.isStartIncluded = value.isStartIncluded;
        if (value.isStopIncluded)
            result.isStopIncluded = value.isStopIncluded;
    }
    return result;
}

/**
 * 把字符串或数字解析为 Cesium 的 {@link VerticalOrigin} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'top'、'bottom'、'baseline'、'center'
 * @returns {VerticalOrigin} 解析后的 VerticalOrigin
 */
function parseVerticalOrigin(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'top':
                return VerticalOrigin.TOP;
            case 'bottom':
                return VerticalOrigin.BOTTOM;
            case 'baseline':
                return VerticalOrigin.BASELINE;
            case 'center':
            default:
                return VerticalOrigin.CENTER;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to VerticalOrigin.');
}

/**
 * 在椭球面上按给定中心、半径与分段数计算圆（环）上的点集。
 * @param {object} options 参数对象
 * @param {Cartesian3} options.center 圆心（世界坐标，决定圆所在的椭球面位置）
 * @param {number} options.radius 圆半径，单位米，需大于 0
 * @param {number} [options.rotation=0] 圆的旋转角，单位弧度
 * @param {number} [options.rotationDegrees] 圆的旋转角，单位度；提供时覆盖 rotation
 * @param {number} [options.numberOfSegments=64] 圆周分段数，需为不小于 3 的整数
 * @returns {Cartesian3[]} 圆周上的点集
 */
function computeCirclePositions(options) {
    const center = options.center;
    Check.typeOf.object('center', center);
    const radius = options.radius;
    Check.typeOf.number.greaterThan('radius', radius, 0);
    let rotation = options.rotation ?? 0;
    if (defined$1(options.rotationDegrees))
        rotation = Math$1.toRadians(options.rotationDegrees);
    const numberOfSegments = options.numberOfSegments ?? 64;
    Check.typeOf.integer.greaterThanOrEquals('numberOfSegments', numberOfSegments, 3);

    const rSqr = radius * radius;

    const mag = Cartesian3.magnitude(center);

    const unitPos = Cartesian3.normalize(center, new Cartesian3());
    const eastVec = Cartesian3.cross(Cartesian3.UNIT_Z, center, new Cartesian3());
    Cartesian3.normalize(eastVec, eastVec);
    const northVec = Cartesian3.cross(unitPos, eastVec, new Cartesian3());

    const deltaTheta = Math$1.TWO_PI / numberOfSegments;

    let theta = 0;
    const result = [];
    for (let i = 0; i < numberOfSegments; i++) {
        const position = EllipseGeometryLibrary.pointOnEllipsoid(theta, rotation, northVec, eastVec, rSqr, rSqr, rSqr, mag, unitPos, new Cartesian3());
        result.push(position);

        theta += deltaTheta;
    }

    return result;
}

/**
 * 计算一组圆周点到首点（圆心）的最大距离，即圆的半径。
 * @param {Cartesian3[]} positions 圆周上的点集，首个元素视为圆心
 * @returns {number} 圆的半径，单位米
 */
function computeCircleRadius(positions) {
    let result = 0;
    for (let i = 1; i < positions.length; i++) {
        let radius = Cartesian3.distance(positions[0], positions[i]);
        if (radius > result)
            result = radius;
    }
    return result;
}

/**
 * 由偏移、重复、旋转与中心参数构建纹理坐标（st）变换矩阵。
 * @param {object} [stOffset={x:0,y:0}] 纹理坐标偏移
 * @param {object} [stRepeat={x:1,y:1}] 纹理坐标重复（缩放）
 * @param {number} [stRotation=0] 纹理坐标旋转角，单位弧度
 * @param {object} [stCenter={x:0.5,y:0.5}] 纹理坐标旋转中心
 * @param {Matrix3} [result] 用于存储结果的矩阵，未提供则新建
 * @returns {Matrix3} 纹理坐标变换矩阵
 */
function computeStTransform(stOffset = {
    x: 0,
    y: 0
}, stRepeat = {
    x: 1,
    y: 1
}, stRotation = 0, stCenter = {
    x: 0.5,
    y: 0.5,
}, result = new Matrix3()) {
    const tx = stOffset.x,
        ty = stOffset.y,
        sx = stRepeat.x,
        sy = stRepeat.y,
        cx = stCenter.x,
        cy = stCenter.y,
        c = Math.cos(stRotation),
        s = Math.sin(stRotation);
    //sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
    //- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
    //0, 0, 1
    const n11 = sx * c,
        n12 = sx * s,
        n13 = -sx * (c * cx + s * cy) + cx - tx,
        n21 = -sy * s,
        n22 = sy * c,
        n23 = -sy * (-s * cx + c * cy) + cy - ty,
        n31 = 0,
        n32 = 0,
        n33 = 1;

    result[0] = n11;
    result[1] = n21;
    result[2] = n31;
    result[3] = n12;
    result[4] = n22;
    result[5] = n32;
    result[6] = n13;
    result[7] = n23;
    result[8] = n33;

    return result;
}

/**
 * 根据 TypedArray 的类型推断对应的 Cesium 组件数据类型（ComponentDatatype）。
 * @param {ArrayBufferView} array 顶点属性数组
 * @returns {ComponentDatatype} 对应的组件数据类型，无法识别时返回 SHORT
 */
function getAttributeComponentType(array) {
    var attributeComponentType = ComponentDatatype.SHORT;
    if (array instanceof Int8Array) {
        attributeComponentType = ComponentDatatype.BYTE;
    } else if (array instanceof Uint8Array || array instanceof Uint8ClampedArray) {
        attributeComponentType = ComponentDatatype.UNSIGNED_BYTE;
    } else if (array instanceof Int16Array) {
        attributeComponentType = ComponentDatatype.SHORT;
    } else if (array instanceof Uint16Array) {
        attributeComponentType = ComponentDatatype.UNSIGNED_SHORT;
    } else if (array instanceof Int32Array) {
        attributeComponentType = ComponentDatatype.INT;
    } else if (array instanceof Uint32Array) {
        attributeComponentType = ComponentDatatype.UNSIGNED_INT;
    } else if (array instanceof Float32Array) {
        attributeComponentType = ComponentDatatype.FLOAT;
    } else if (array instanceof Float64Array) {
        attributeComponentType = ComponentDatatype.DOUBLE;
    }
    return attributeComponentType;
}

/**
 * 将 three.js 的 BufferGeometry 转换为 Cesium 的 Geometry。
 * @param {object} geometry three.js BufferGeometry 对象
 * @returns {Geometry} 转换后的 Cesium 几何对象
 */
function threeGeometryToCesiumGeometry(geometry) {
    Check.defined('geometry', geometry);

    let attributes = {};
    if (!geometry.attributes.normal && typeof geometry.computeVertexNormals === 'function') {
        geometry.computeVertexNormals();
    }

    let positions;
    for (let attrName in geometry.attributes) {
        if (geometry.attributes.hasOwnProperty(attrName)) {
            let attr = geometry.getAttribute(attrName);
            if (attr && attr.array.length > 0) {
                if (attrName === 'position') {
                    positions = new Float64Array(attr.array);
                    attributes[attrName] = new GeometryAttribute({
                        componentDatatype: ComponentDatatype.DOUBLE,
                        componentsPerAttribute: attr.itemSize,
                        values: positions,
                        normalize: attr.normalized
                    });
                } else {
                    if (attrName === 'uv')
                        attrName = 'st';
                    attributes[attrName] = new GeometryAttribute({
                        componentDatatype: getAttributeComponentType(attr.array),
                        componentsPerAttribute: attr.itemSize,
                        values: attr.array,
                        normalize: attr.normalized
                    });
                }
            }
        }
    }

    let indices = [];
    if (geometry.index)
        indices = geometry.index.array;
    else if (geometry.groups && geometry.groups.length > 0) {
        geometry.groups.forEach(function (group) {
            for (let i = 0; i < group.count; i++) {
                indices.push(i + group.start);
            }
        });
        indices = new Int32Array(indices);
    } else {
        const length = geometry.attributes.position.count;
        for (let i = 0; i < length; i++) {
            indices.push(i);
        }
        indices = new Int32Array(indices);
    }

    return new Geometry$1({
        attributes: attributes,
        indices: indices,
        primitiveType: PrimitiveType.TRIANGLES,
        boundingSphere: BoundingSphere.fromVertices(positions)
    });
}
/**
 * 将多种几何类型统一转换为 Cesium 的 Geometry 对象。
 * 支持已为 Geometry 的对象、three.js BufferGeometry，以及构造函数带 createGeometry 静态方法的几何对象。
 * @param {Geometry|object} geometry 待转换的几何对象
 * @returns {Geometry} Cesium 几何对象
 */
function createGeometry(geometry) {
    Check.defined('geometry', geometry);
    if (geometry instanceof Geometry$1)
        return geometry;
    if (geometry.isBufferGeometry)
        return threeGeometryToCesiumGeometry(geometry);
    if (typeof geometry.constructor.createGeometry === 'function')
        return geometry.constructor.createGeometry(geometry);
    throw new DeveloperError('Unable to identify geometry.');
}

function isTypedArray(value) {
    if (value instanceof Int8Array ||
        value instanceof Uint8Array ||
        value instanceof Uint8ClampedArray ||
        value instanceof Int16Array ||
        value instanceof Uint16Array ||
        value instanceof Int32Array ||
        value instanceof Uint32Array ||
        value instanceof Float32Array ||
        value instanceof Float64Array ||
        value instanceof BigInt64Array ||
        value instanceof BigUint64Array)
        return true;
    return false;
}

/**
 * 根据位置与可选颜色数据创建 Cesium 点云几何体（PrimitiveType.POINTS）。
 * @param {object} [options={}] 参数对象
 * @param {ArrayBuffer|Array|ArrayBufferView} options.positions 位置数据，可为 Cartesian3 数组、扁平数值数组或 TypedArray
 * @param {ArrayBuffer|Array|ArrayBufferView} [options.colors] 颜色数据，缺省时全部使用深灰色
 * @returns {Geometry} 点云几何体
 */
function createPointCloudGeometry(options = {}) {
    Check.defined('positions', options.positions);
    const positions = options.positions;
    let positionsArray;
    if (positions instanceof ArrayBuffer) {
        positionsArray = new Float64Array(positions);
    } else if (Array.isArray(positions))
        if (typeof positions[0] === 'number')
            positionsArray = positions;
        else
            positionsArray = Cartesian3.packArray(positions);
    else if (isTypedArray(positions))
        positionsArray = positions;
    else {
        throw new DeveloperError('positions must be Cartesian`s Array or TypedArray object.');
    }
    const positionsLength = positionsArray.length / 3;

    let colors, colorsArray;
    if (options.colors) {
        colors = options.colors;
    } else {
        colors = new Array();
        for (let i = 0; i < positionsLength; i++) {
            colors[i] = Color.DARKGRAY.clone();
        }
    }
    if (colors instanceof ArrayBuffer) {
        colorsArray = new Uint8Array(colors);
    } else if (Array.isArray(colors)) {
        if (typeof colors[0] === 'number')
            colorsArray = colors;
        else
            colorsArray = Color.packArrayToBytes(colors);
    } else if (isTypedArray(colors))
        colorsArray = colors;
    else {
        throw new DeveloperError('colors must be Color`s Array or TypedArray object.');
    }
    const colorsLength = colorsArray.length / 4;

    if (positionsLength !== colorsLength) {
        throw new DeveloperError('the positionsLength must be equal to colorsLength.');
    }

    const attributes = new GeometryAttributes();

    attributes.position = new GeometryAttribute({
        componentDatatype: ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(positionsArray),
    });

    attributes.color = new GeometryAttribute({
        componentDatatype: ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 4,
        values: new Uint8Array(colorsArray),
        normalize: true,
    });

    return new Geometry({
        attributes: attributes,
        primitiveType: PrimitiveType.POINTS,
        boundingSphere: BoundingSphere.fromVertices(positionsArray),
    });
}

/**
 * 以下三个类是从 Cesium 源码（packages/engine/Source/Core/）中恢复的
 * `GeometryInstanceAttribute` 派生类。它们在 npm 版 `cesium` 中已被移除，
 * 但 pci-map-3d 的定制 Cesium 构建仍保留，故在此作为库的扩展提供。
 */

/**
 * 布尔型几何体实例属性，以无符号字节（Uint8Array）存储布尔值。
 * 该类从 Cesium 源码恢复，npm 版 cesium 中已移除。
 * @param {boolean} [value=true] 初始布尔值
 */
function BooleanGeometryInstanceAttribute(value = true) {
    this.value = BooleanGeometryInstanceAttribute.toValue(value);
}
Object.defineProperties(BooleanGeometryInstanceAttribute.prototype, {
    /** 组件数据类型，固定为无符号字节 */
    componentDatatype: { get: function () { return ComponentDatatype.UNSIGNED_BYTE; } },
    /** 每个属性的组件数量，固定为 1 */
    componentsPerAttribute: { get: function () { return 1; } },
    /** 是否归一化，固定为 false */
    normalize: { get: function () { return false; } },
});
/**
 * 从布尔值创建布尔型几何体实例属性（静态方法）。
 * @param {boolean} value 布尔值
 * @returns {BooleanGeometryInstanceAttribute} 新的布尔型几何体实例属性
 */
BooleanGeometryInstanceAttribute.fromBoolean = function (value) {
    if (!defined$1(value))
        throw new DeveloperError("value is required.");
    return new BooleanGeometryInstanceAttribute(value);
};
/**
 * 将布尔值转换为无符号字节数组（静态方法）。
 * @param {boolean} value 布尔值
 * @param {Uint8Array} [result] 用于存储结果的数组，未提供则新建
 * @returns {Uint8Array} 转换后的无符号字节数组
 */
BooleanGeometryInstanceAttribute.toValue = function (value, result) {
    if (!defined$1(value))
        throw new DeveloperError("value is required.");
    if (!defined$1(result))
        return new Uint8Array([value]);
    result[0] = value;
    return result;
};
/**
 * 判断两个布尔型几何体实例属性是否相等（静态方法）。
 * @param {BooleanGeometryInstanceAttribute} left 第一个属性
 * @param {BooleanGeometryInstanceAttribute} right 第二个属性
 * @returns {boolean} 是否相等
 */
BooleanGeometryInstanceAttribute.equals = function (left, right) {
    return left === right || defined$1(left) && defined$1(right) && left.value[0] === right.value[0];
};

/**
 * 三维向量型几何体实例属性，以 Float32Array 存储 x、y、z 分量。
 * 该类从 Cesium 源码恢复，npm 版 cesium 中已移除。
 * @param {number} [x=0] x 分量
 * @param {number} [y=0] y 分量
 * @param {number} [z=0] z 分量
 */
function Cartesian3GeometryInstanceAttribute(x = 0, y = 0, z = 0) {
    this.value = new Float32Array([x, y, z]);
}
Object.defineProperties(Cartesian3GeometryInstanceAttribute.prototype, {
    /** 组件数据类型，固定为浮点型 */
    componentDatatype: { get: function () { return ComponentDatatype.FLOAT; } },
    /** 每个属性的组件数量，固定为 3 */
    componentsPerAttribute: { get: function () { return 3; } },
    /** 是否归一化，固定为 false */
    normalize: { get: function () { return false; } },
});
/**
 * 从 Cartesian3 创建三维向量型几何体实例属性（静态方法）。
 * @param {Cartesian3} cartesian Cartesian3 实例
 * @returns {Cartesian3GeometryInstanceAttribute} 新的三维向量型几何体实例属性
 */
Cartesian3GeometryInstanceAttribute.fromCartesian3 = function (cartesian) {
    Check.defined("cartesian", cartesian);
    return new Cartesian3GeometryInstanceAttribute(cartesian.x, cartesian.y, cartesian.z);
};
/**
 * 将 Cartesian3 转换为 Float32Array（静态方法）。
 * @param {Cartesian3} cartesian Cartesian3 实例
 * @param {Float32Array|Array} [result] 用于存储结果的数组，未提供则新建
 * @returns {Float32Array|Array} 转换后的浮点数组
 */
Cartesian3GeometryInstanceAttribute.toValue = function (cartesian, result) {
    Check.defined("cartesian", cartesian);
    if (!defined$1(result))
        return new Float32Array([cartesian.x, cartesian.y, cartesian.z]);
    result[0] = cartesian.x;
    result[1] = cartesian.y;
    result[2] = cartesian.z;
    return result;
};
/**
 * 判断两个三维向量型几何体实例属性是否相等（静态方法）。
 * @param {Cartesian3GeometryInstanceAttribute} left 第一个属性
 * @param {Cartesian3GeometryInstanceAttribute} right 第二个属性
 * @returns {boolean} 是否相等
 */
Cartesian3GeometryInstanceAttribute.equals = function (left, right) {
    return left === right || defined$1(left) && defined$1(right)
        && left.value[0] === right.value[0]
        && left.value[1] === right.value[1]
        && left.value[2] === right.value[2];
};

/**
 * 浮点型几何体实例属性，以 Float32Array 存储单个浮点数。
 * 该类从 Cesium 源码恢复，npm 版 cesium 中已移除。
 * @param {number} [value=1] 初始浮点值
 */
function FloatGeometryInstanceAttribute(value = 1) {
    this.value = FloatGeometryInstanceAttribute.toValue(value);
}
Object.defineProperties(FloatGeometryInstanceAttribute.prototype, {
    /** 组件数据类型，固定为浮点型 */
    componentDatatype: { get: function () { return ComponentDatatype.FLOAT; } },
    /** 每个属性的组件数量，固定为 1 */
    componentsPerAttribute: { get: function () { return 1; } },
    /** 是否归一化，固定为 false */
    normalize: { get: function () { return false; } },
});
/**
 * 从浮点数创建浮点型几何体实例属性（静态方法）。
 * @param {number} value 浮点值
 * @returns {FloatGeometryInstanceAttribute} 新的浮点型几何体实例属性
 */
FloatGeometryInstanceAttribute.fromFloat = function (value) {
    if (!defined$1(value))
        throw new DeveloperError("value is required.");
    return new FloatGeometryInstanceAttribute(value);
};
/**
 * 将浮点数转换为 Float32Array（静态方法）。
 * @param {number} value 浮点值
 * @param {Float32Array|Array} [result] 用于存储结果的数组，未提供则新建
 * @returns {Float32Array|Array} 转换后的浮点数组
 */
FloatGeometryInstanceAttribute.toValue = function (value, result) {
    if (!defined$1(value))
        throw new DeveloperError("value is required.");
    if (!defined$1(result))
        return new Float32Array([value]);
    result[0] = value;
    return result;
};
/**
 * 判断两个浮点型几何体实例属性是否相等（静态方法）。
 * @param {FloatGeometryInstanceAttribute} left 第一个属性
 * @param {FloatGeometryInstanceAttribute} right 第二个属性
 * @returns {boolean} 是否相等
 */
FloatGeometryInstanceAttribute.equals = function (left, right) {
    return left === right || defined$1(left) && defined$1(right) && left.value[0] === right.value[0];
};

/**
 * 根据各项参数构建几何实例属性集合（GeometryInstanceAttributes）。
 * @param {boolean} show 是否显示
 * @param {Color} color 材质颜色
 * @param {DistanceDisplayCondition} distanceDisplayCondition 距离显示条件
 * @param {Matrix3} stTransform 纹理坐标变换矩阵，按列拆分为三个 Cartesian3 分别存储
 * @param {number} pointSize 点大小
 * @param {boolean} perVertexColors 是否使用逐顶点颜色
 * @param {Color} instanceColor 实例颜色
 * @returns {object} 几何实例属性集合
 */
function getGeometryInstanceAttributes(show, color, distanceDisplayCondition, stTransform, pointSize, perVertexColors, instanceColor) {
    const attributes = {};
    if (defined$1(show))
        attributes.show = new ShowGeometryInstanceAttribute(show);
    if (defined$1(color))
        attributes.color = ColorGeometryInstanceAttribute.fromColor(color);
    if (defined$1(distanceDisplayCondition))
        attributes.distanceDisplayCondition = DistanceDisplayConditionGeometryInstanceAttribute.fromDistanceDisplayCondition(distanceDisplayCondition);
    if (defined$1(stTransform)) {
        //stTransform是一个Matrix3对象，但是GeometryInstanceAttribute最多只支持到Cartesian4对象，所以这里将Matrix3按列拆分成3个Cartesian3对象分别传入，然后在shader中再合成为mat3数据
        const scratchCartesian3 = new Cartesian3();
        const column0 = stTransform.getColumn(0, scratchCartesian3);
        attributes.stTransformColumn0 = Cartesian3GeometryInstanceAttribute.fromCartesian3(column0);
        const column1 = stTransform.getColumn(1, scratchCartesian3);
        attributes.stTransformColumn1 = Cartesian3GeometryInstanceAttribute.fromCartesian3(column1);
        const column2 = stTransform.getColumn(2, scratchCartesian3);
        attributes.stTransformColumn2 = Cartesian3GeometryInstanceAttribute.fromCartesian3(column2);
    }
    if (defined$1(pointSize))
        attributes.pointSize = FloatGeometryInstanceAttribute.fromFloat(pointSize);
    if (defined$1(perVertexColors))
        attributes.perVertexColors = BooleanGeometryInstanceAttribute.fromBoolean(perVertexColors);
    if (defined$1(instanceColor))
        attributes.instanceColor = ColorGeometryInstanceAttribute.fromColor(instanceColor);
    return attributes;
}

/**
 * 获取目标对象在指定时刻的世界坐标位置。
 * 目标本身可直接是位置，也可通过其 position 属性获取；若为 Property 则按时刻求值。
 * @param {object|Cartesian3} target 目标对象或位置
 * @param {JulianDate} time 查询时刻
 * @param {Cartesian3} result 用于存储结果的对象
 * @returns {Cartesian3} 获取到的世界坐标位置
 */
function getPositionFromTarget(target, time, result) {
    Check.defined('target', target);
    let position;
    if (defined$1(target.position))
        position = target.position;
    else
        position = target;

    if (typeof position.getValue === 'function')
        position = position.getValue(time, result);
    else
        position = parseToCartesian3(position, result, false);

    return position;
}

/**
 * 根据选项构建 Cesium 渲染状态对象（RenderState）。
 * @param {object} options 参数对象
 * @param {boolean} [options.depthTest] 是否启用深度测试
 * @param {CullFace} [options.cullFace] 背面剔除模式
 * @param {object} [result={}] 用于存储结果的渲染状态对象
 * @returns {object} 构建的渲染状态对象
 */
function getRenderState(options, result = {}) {
    Check.defined('options', options);

    if (defined$1(options.depthTest)) {
        result.depthTest = {
            enabled: options.depthTest,
        };
    }
    if (defined$1(options.cullFace)) {
        if (options.cullFace !== CullFace.NONE)
            result.cull = {
                enabled: true,
                face: options.cullFace,
            };
        else {
            result.cull = {
                enabled: false,
            };
        }
    }
    return result;
}

/**
 * 判断材质是否为颜色材质（未定义或类型为 Material.ColorType）。
 * @param {Material} material 待判断的材质
 * @returns {boolean} 是否为颜色材质
 */
function isColorMaterial(material) {
    return !defined$1(material) || material.type === Material.ColorType;
}

/**
 * 判断颜色是否为半透明（存在且 alpha 小于 1）。
 * @param {Color} color 待判断的颜色
 * @returns {boolean} 是否半透明
 */
function isTranslucent(color) {
    return defined$1(color) && (typeof color.alpha === 'number') && color.alpha < 1.0;
}

/**
 * 将世界坐标下的模型矩阵分解为固定参考系下的位置、缩放与航向俯仰翻滚。
 * @param {Matrix4} modelMatrix 待分解的模型矩阵
 * @param {Ellipsoid} ellipsoid 参考椭球体
 * @param {Matrix4} fixedFrameTransform 固定参考系到世界坐标的变换矩阵
 * @param {object} [result={}] 用于存储结果的对象
 * @returns {object} 含 position（Cartesian3）、scale（Cartesian3）、rotation（HeadingPitchRoll）的结果对象
 */
function resolveModelMatrixByFixedFrame(modelMatrix, ellipsoid, fixedFrameTransform, result = {}) {
    Check.instanceOf('modelMatrix', modelMatrix, Matrix4);

    if (!result.position)
        result.position = new Cartesian3();
    result.position = Matrix4.getTranslation(modelMatrix, result.position);

    if (!result.scale)
        result.scale = new Cartesian3();
    result.scale = Matrix4.getScale(modelMatrix, result.scale);

    if (!result.rotation)
        result.rotation = new HeadingPitchRoll();
    result.rotation = Transforms.fixedFrameToHeadingPitchRoll(modelMatrix, ellipsoid, fixedFrameTransform, result.rotation);

    return result;
}

function destroyHTMLElementImpl(element, deepChildren) {
    if (deepChildren) {
        while (element.lastChild) {
            destroyHTMLElementImpl(element.lastChild, deepChildren);
        }
    }
    if (element.parentNode)
        element.parentNode.removeChild(element);
    if (element instanceof HTMLVideoElement) {
        if (element.hlsPlayer) {
            element.hlsPlayer.destroy();
            delete element.hlsPlayer;
        }
        if (element.flvPlayer) {
            try {
                element.flvPlayer.unload();
                element.flvPlayer.detachMediaElement();
            } catch (error) {
                console.error(error);
            }
            element.flvPlayer.destroy();
            delete element.flvPlayer;
        }
        try {
            element.pause();
            element.loop = false;
            element.removeAttribute('src');
            element.load();
        } catch (error) {
            console.error(error);
        }
    } else if (element instanceof HTMLImageElement) {
        //指向一张空白图片以释放之前的图片
        element.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    } else if (element instanceof HTMLCanvasElement) {
        //移除apng动画
        if (element.apngPlayer) {
            element.apngPlayer.stop();
            delete element.apngPlayer;
        }
        //移除gif动画
        if (element.gifPlayer) {
            element.gifPlayer.stop();
            delete element.gifPlayer;
        }
        //修改canvas尺寸为0可以释放之前的绘制结果
        element.width = element.height = 0;
    }
}

/**
 * 销毁HTMLElement对象
 * @param {HTMLElement} element HTMLElement对象
 * @param {Boolean} deepChildren 是否向下执行深度销毁
 * @returns {void}
 */
function destroyHTMLElement(element, deepChildren) {
    if (typeof HTMLElement === 'undefined' || element instanceof HTMLElement === false) {
        console.warn('The element must be instanceof HTMLElement.');
        return;
    }
    destroyHTMLElementImpl(element, deepChildren);
}

/**
 * 判断对象是否已被销毁过
 * @param {object} object
 * @returns {Boolean}
 */
function isDestroyed(object) {
    if (object == null)
        return false;
    if (typeof object.isDestroyed !== 'undefined') {
        if (typeof object.isDestroyed === 'function')
            return object.isDestroyed();
        else
            return object.isDestroyed;
    }
    return false;
}

function returnTrue() {
    return true;
}

function warnOnDestroyed(object) {
    return function () {
        console.warn('The object isDestroyed, call function is invalid.', object);
    };
}

/**
 * 销毁一个对象下所有属性和方法
 * 销毁完成后会设置object.isDestroyed = function() { return true; };
 * @param {object} object 销毁对象
 * @param {object} config 销毁配置
 * @param {boolean} config.deleteProperty 是否删除对象属性，默认true
 * @param {Array<string>} config.ignoreProperties 需要忽略的属性数组
 * @param {boolean} config.ignoreUnderlinePrefixProperty 是否忽略下划线前缀的属性，默认false
 * @param {boolean} config.overwriteFunction 是否覆盖对象方法，默认true
 * @param {boolean} config.releaseArray 是否释放数组内容，默认true，为true时会执行array.length = 0
 * @param {boolean} config.destroyHTMLElement 是否销毁HTMLElement，默认true
 * @param {boolean} config.deep 是否向下执行深度销毁，默认false
 * @returns {void}
 */
function destroyObject(object, config = {}) {
    if (isDestroyed(object) || object.isDestroying) {
        // console.warn('The object isDestroyed or isDestroying, repeated call destroyObject function are not required.', object);
        return;
    }
    if (object.dontDestroy || object.isCached || object.isProtected) {
        // console.warn('The object has dontDestroy or isCached or isProtected flag, dont execute destroy.', object);
        return;
    }

    config = Object.assign({
        deleteProperty: true,
        ignoreProperties: [],
        ignoreUnderlinePrefixProperty: false,
        overwriteFunction: true,
        releaseArray: true,
        destroyHTMLElement: true,
    }, config);

    config.ignoreProperties.push('isDestroying', 'isDestroyed', 'destroy', 'destroyConfigure', 'undeletable');

    //标记正在执行销毁
    object.isDestroying = true;

    const hasIgnoreProperties = Array.isArray(config.ignoreProperties) && config.ignoreProperties.length > 0;

    for (const key in object) {
        //过滤属性
        if (hasIgnoreProperties && config.ignoreProperties.indexOf(key) !== -1)
            continue;
        if (config.ignoreUnderlinePrefixProperty === true && key.startsWith('_'))
            continue;
        try {
            const value = object[key];
            if (value) {
                //有不可销毁或缓存或受保护标记，不执行销毁
                if (value.dontDestroy || value.isCached || value.isProtected)
                    continue;
                if (typeof value === 'function' && config.overwriteFunction === true)
                    object[key] = warnOnDestroyed(object);
                else if (Array.isArray(value) && config.releaseArray === true)
                    value.length = 0;
                else if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement && config.destroyHTMLElement === true)
                    destroyHTMLElement(value, config.deep);
                //如果value是对象且deep为true
                else if (typeof value === 'object' && config.deep === true) {
                    if (typeof value.destroy === 'function')
                        value.destroy();
                    else
                        destroyObject(value, config);
                }
                if (value.undeletable) //有不可删除标记，不执行delete操作
                    continue;
            }
        } catch (error) {
            console.warn(error);
        }
        try {
            if (config.deleteProperty === true)
                delete object[key];
        } catch (error) {
            // console.warn(error);
        }
    }

    object.isDestroyed = returnTrue;

    delete object.isDestroying;

    return object;
}

/**
 * Destroyable是一个包含了destroy相关Property的class，可用于继承
 * 
 * @abstract
 * @class
*/
class Destroyable {
    /**
     * 获取销毁配置，由子类实现
     * @type {object|void}
     * @abstract
    */
    get destroyConfigure() { }

    isDestroyed() {
        return false;
    }

    /**
     * 执行销毁，由子类实现
     * @abstract
     */
    onDestroy(...args) {
        // console.warn('onDestroy must be overwrited by subclass.');
    }

    /**
     * 销毁自身
     * @returns {this}
     */
    destroy(...args) {
        if (this.isDestroyed()) {
            console.warn('This object was destroyed.', this);
        } else if (this.isDestroying) {
            console.warn('This object is destroying.', this);
        } else {
            this.onDestroy(...args);
            destroyObject(this, this.destroyConfigure);
        }
        return this;
    }
}

/**
 * 属性变更监听器基类，继承自 Destroyable。
 * 提供统一的属性变更事件（Event）触发与回调机制，供各类 Transform 组件复用。
 */
class PropertyChangedListener extends Destroyable {
    /**
     * 创建属性变更监听器实例。
     * @param {function} [onPropertyValueChanged] 属性值变更时的回调函数，签名为 (name, value, type)
     */
    constructor(onPropertyValueChanged) {
        super();

        this._propertyChanged = new Event();
        this.onPropertyValueChanged = onPropertyValueChanged || this.onPropertyValueChanged.bind(this);
    }

    // @deprecated
    /**
     * 获取属性变更事件对象。
     * @deprecated 已废弃，请使用 propertyChanged 替代
     * @returns {Event} 属性变更事件对象
     */
    get propertyChangeEvent() {
        return this._propertyChanged;
    }

    /**
     * 获取属性变更事件对象。
     * @returns {Event} 属性变更事件对象
     */
    get propertyChanged() {
        return this._propertyChanged;
    }

    /**
     * 属性值发生变更时的回调钩子，子类可重写以处理变更通知。
     * @param {string} name 属性名称
     * @param {*} value 变更后的属性值
     * @param {string} type 属性类型，取值参考 PropertyType
     * @returns {void}
     */
    onPropertyValueChanged(name, value, type) { }

    /**
     * 触发属性变更事件并调用属性变更回调。
     * @param {string} name 属性名称
     * @param {*} value 变更后的属性值
     * @param {string} type 属性类型，取值参考 PropertyType
     * @returns {void}
     */
    raisePropertyChangeEvent(name, value, type) {
        if (this.isDestroyed())
            return;
        this._propertyChanged.raiseEvent(this, name, value, type);
        this.onPropertyValueChanged(name, value, type);
    }

    /**
     * 销毁实例时清理资源，清空属性变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._propertyChanged.clear();
        super.onDestroy();
    }
}

/**
 * 地理坐标变换类，继承自 PropertyChangedListener。
 * 通过经纬高（Geographic）或世界坐标（Cartesian3）设置位置，维护东-北-天（ENU）固定坐标系变换矩阵，
 * 支持逐帧自动更新，并在位置或地理坐标变化时触发属性变更事件。
 */
class GeographicTransform extends PropertyChangedListener {
    /**
     * 创建地理坐标变换实例。
     * @param {object} [options={}] 配置项
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体，未提供时取宿主对象的 ellipsoid
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     * @param {Cartesian3|object} [options.position] 初始世界坐标位置
     * @param {Geographic|object} [options.geographic] 初始地理坐标
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        this.owner = options.owner ?? this;
        this.ellipsoid = options.ellipsoid ?? this.owner.ellipsoid;
        this.updateByPerFrame = options.updateByPerFrame ?? true;

        this._matrix = Matrix4.IDENTITY.clone();
        this._position = new Cartesian3();
        this._geographic = undefined;
        this._matrixChangeEvent = new Event();

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置位置或地理坐标。
     * @param {object} transforms 变换配置，可包含 position 或 geographic
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        if (transforms.position)
            this.position = transforms.position;
        else if (transforms.geographic)
            this.geographic = transforms.geographic;
    }

    /**
     * 获取矩阵变更事件对象，矩阵更新时触发。
     * @returns {Event} 矩阵变更事件对象
     */
    get matrixChangeEvent() {
        return this._matrixChangeEvent;
    }

    /**
     * 设置世界坐标位置，位置发生变化时触发属性变更事件，并同步更新地理坐标状态。
     * @param {Cartesian3|object} value 世界坐标位置
     * @returns {void}
     */
    set position(value) {
        Check.typeOf.object('position', value);
        value = parseToCartesian3(value, Scratch.scratchPositionWC, 0.0);
        if (!Cartesian3.equals(value, this._position)) {
            this._position = value.clone(this._position);
            this.positionChanged = true;
            this.geographicChanged = false;
            this.raisePropertyChangeEvent('position', this._position);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
        }
    }

    /**
     * 获取当前世界坐标位置。
     * @returns {Cartesian3} 当前世界坐标位置
     */
    get position() {
        return this._position;
    }

    /**
     * 设置世界坐标位置，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setPosition(x, y, z) {
        if (typeof x === 'object')
            this.position = x;
        else
            this.position = Cartesian3.fromElements(x, y, z, Scratch.scratchPositionWC);
    }

    /**
     * 获取当前世界坐标位置的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 当前世界坐标位置的副本
     */
    getPosition(result) {
        return this._position.clone(result);
    }

    /**
     * 设置地理坐标（经纬高），发生变化时触发属性变更事件，并同步更新世界坐标状态。
     * @param {Geographic|object} value 地理坐标
     * @returns {void}
     */
    set geographic(value) {
        Check.typeOf.object('geographic', value);
        value = parseToGeographic(value, Scratch.scratchGeographic);
        if (!Geographic.equals(value, this._geographic)) {
            this._geographic = value.clone(this._geographic);
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
        }
    }

    /**
     * 获取当前地理坐标。
     * @returns {Geographic} 当前地理坐标
     */
    get geographic() {
        return this._geographic;
    }

    /**
     * 设置地理坐标，支持传入 Geographic 对象或经纬高数值。
     * @param {Geographic|number} longitude Geographic 对象或经度
     * @param {number} [latitude] 纬度
     * @param {number} [altitude] 高度，单位米
     * @param {boolean} [degrees=true] 传入的经纬度是否为角度制，false 表示弧度制
     * @returns {void}
     */
    setGeographic(longitude, latitude, altitude, degrees = true) {
        if (typeof longitude === 'object')
            this.geographic = longitude;
        else if (degrees)
            this.geographic = Geographic.fromDegrees(longitude, latitude, altitude, Scratch.scratchGeographic);
        else
            this.geographic = Geographic.fromRadians(longitude, latitude, altitude, Scratch.scratchGeographic);
    }

    /**
     * 获取当前地理坐标的克隆。
     * @param {Geographic} [result] 用于存储结果的 Geographic 实例
     * @returns {Geographic} 当前地理坐标的副本
     */
    getGeographic(result) {
        return this._geographic.clone(result);
    }

    /**
     * 沿经度方向平移指定数值，并自动将经度限制在 [-180, 180] 范围内。
     * @param {number} value 平移量，正数向东、负数向西
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLongitude(value, degrees = true) {
        value = parseNumber(value);
        if (value !== 0) {
            if (degrees === false)
                value = Math$1.toDegrees(value);
            let longitude = this._geographic.longitude + value;
            if (longitude > 180)
                longitude -= 360;
            else if (longitude < -180)
                longitude += 360;
            this._geographic.longitude = longitude;
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
        }
    }

    /**
     * 沿纬度方向平移指定数值，并自动将纬度限制在 [-90, 90] 范围内。
     * @param {number} value 平移量，正数向北、负数向南
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLatitude(value, degrees = true) {
        value = parseNumber(value);
        if (value !== 0) {
            if (degrees === false)
                value = Math$1.toDegrees(value);
            let latitude = this._geographic.latitude + value;
            if (latitude > 90)
                latitude = 90;
            else if (latitude < -90)
                latitude = -90;
            this._geographic.latitude = latitude;
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
        }
    }

    /**
     * 平移高度（海拔）。
     * @param {number} value 高度平移量，单位米
     * @param {boolean} [degrees=true] 是否为角度制，false 时会将 value 由弧度换算为角度
     * @returns {void}
     */
    translateAltitude(value, degrees = true) {
        value = parseNumber(value);
        if (value !== 0) {
            if (degrees === false)
                value = Math$1.toDegrees(value);
            this._geographic.altitude += value;
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
        }
    }

    /**
     * 获取当前的固定坐标系变换矩阵。
     * @returns {Matrix4} 东-北-天固定坐标系变换矩阵
     */
    get matrix() {
        return this._matrix;
    }

    // getMatrix(result) {
    //     return this._matrix.clone(result);
    // }

    /**
     * 根据当前状态重新计算变换矩阵。
     * 若地理坐标或位置发生变化则先同步二者，随后在需要或强制时重建东-北-天矩阵并触发变更事件。
     * @param {boolean} [force] 是否强制更新矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateMatrix(force) {
        if (this.geographicChanged) {
            this._position = this._geographic.toCartesian(this.ellipsoid, this._position);
            this.geographicChanged = false;
            this.needsUpdate = true;
        } else if (this.positionChanged) {
            this._geographic = this._position.toGeographic(this.ellipsoid, this._geographic);
            this.positionChanged = false;
            this.needsUpdate = true;
        }
        if (force || this.needsUpdate) {
            this._matrix = Transforms.eastNorthUpToFixedFrame(this._position, this.ellipsoid, this._matrix);
            this._matrixChangeEvent.raiseEvent(this.owner, this._matrix);
            this.needsUpdate = false;
            return true;
        }
    }

    /**
     * 每帧更新，同步场景椭球体信息并按需更新矩阵。
     * @param {object} [frameState] 帧状态对象
     * @returns {boolean|undefined} 逐帧更新时返回矩阵更新结果
     */
    update(frameState) {
        if (this.isDestroyed())
            return;
        if (frameState)
            this.ellipsoid = frameState.scene.ellipsoid;
        // else
        //     this.ellipsoid = this.owner.ellipsoid;
        if (this.updateByPerFrame)
            return this.updateMatrix();
    }

    /**
     * 销毁实例时清理资源，清空矩阵变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._matrixChangeEvent.clear();
        super.onDestroy();
    }
}

/**
 * 属性类型枚举，用于标识属性变更事件中属性所属的业务类别（材质、外观、几何体、模型矩阵等）。
 * 该对象已被 Object.freeze 冻结，不可修改。
 */
const PropertyType = Object.freeze({
    /** 材质类型 */
    MATERIAL: 'material',
    /** 外观类型 */
    APPEARANCE: 'appearance',
    /** 填充外观类型 */
    FILLAPPEARANCE: 'fillAppearance',
    /** 图元类型 */
    PRIMITIVE: 'primitive',
    /** 填充图元类型 */
    FILLPRIMITIVE: 'fillPrimitive',
    // PRIMITIVE_TYPE: 'primitiveType',
    /** 模型矩阵类型 */
    MODELMATRIX: 'modelMatrix',
    /** 几何体类型 */
    GEOMETRY: 'geometry',
    /** 填充几何体类型 */
    FILLGEOMETRY: 'fillGeometry',
    /** 轮廓几何体类型 */
    OUTLINEGEOMETRY: 'outlineGeometry',
    /** 属性类型（如纹理坐标相关的属性） */
    ATTRIBUTE: 'attribute',
});

/**
 * 旋转参考系类型枚举，用于指定旋转所基于的坐标系。
 * 该对象已被 Object.freeze 冻结，不可修改。
 */
const RotationFrameType = Object.freeze({
    /** 无特殊参考系，使用标准东-北-天坐标系 */
    NONE: 0x00,
    /** 相机参考系 */
    CAMERA: 0x01,
    /** 三维文本参考系 */
    TEXT3D: 0x02,
});

/**
 * 将变换矩阵分解为平移、旋转（朝向/俯仰/翻滚）、缩放分量，并按参考系类型对俯仰与翻滚进行换算。
 * @param {Matrix4} matrix 待分解的变换矩阵
 * @param {Cartesian3} translation 输出参数，接收平移分量
 * @param {HeadingPitchRoll} headingPitchRoll 输出参数，接收旋转分量
 * @param {Cartesian3} scale 输出参数，接收缩放分量
 * @param {number} rotationFrameType 旋转参考系类型，取值参考 RotationFrameType
 * @returns {void}
 */
function decompose(matrix, translation, headingPitchRoll, scale, rotationFrameType) {
    Matrix4.getTranslation(matrix, translation);
    Matrix4.getHeadingPitchRoll(matrix, headingPitchRoll);
    if (rotationFrameType === RotationFrameType.CAMERA) {
        const pitch = headingPitchRoll.roll;
        const roll = -headingPitchRoll.pitch;
        headingPitchRoll.pitch = pitch;
        headingPitchRoll.roll = roll;
    } else if (rotationFrameType === RotationFrameType.TEXT3D) {
        const pitch = headingPitchRoll.roll;
        const roll = headingPitchRoll.pitch;
        headingPitchRoll.pitch = pitch;
        headingPitchRoll.roll = roll;
    }
    Matrix4.getScale(matrix, scale);
}

/**
 * 平移-旋转-缩放变换类，继承自 PropertyChangedListener。
 * 以平移、旋转（HeadingPitchRoll / 四元数 / 欧拉角 / 姿态）、缩放维护 4x4 变换矩阵，
 * 支持多种旋转表示方式以及本地/世界坐标下的平移与旋转操作，并在变化时触发相应事件。
 */
class TranslationRotationScaleTransform extends PropertyChangedListener {
    /**
     * 创建平移-旋转-缩放变换实例。
     * @param {object} [options={}] 配置项
     * @param {Matrix4} [options.matrix] 初始变换矩阵，默认单位矩阵
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {number} [options.rotationFrameType] 旋转参考系类型，取值参考 RotationFrameType
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        const matrix = options.matrix ?? Matrix4.IDENTITY.clone(new Matrix4());
        Check.instanceOf('matrix', matrix, Matrix4);
        this.owner = options.owner ?? this;
        this.updateByPerFrame = options.updateByPerFrame ?? true;

        this._matrix = matrix;
        this._translation = new Cartesian3();
        this._rotation = new HeadingPitchRoll();
        this._rotationFrameType = options.rotationFrameType ?? RotationFrameType.NONE;
        this._scale = new Cartesian3(1, 1, 1);

        this.matrixChanged = new Event();

        decompose(this._matrix, this._translation, this._rotation, this._scale, this._rotationFrameType);

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置平移、旋转、缩放等变换参数。
     * @param {object} transforms 变换配置，可包含 translation、attitude、rotation、scale、scale3
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        if (transforms.translation)
            this.translation = transforms.translation;
        if (transforms.attitude)
            this.attitude = transforms.attitude;
        else if (transforms.rotation)
            this.rotation = transforms.rotation;
        if (transforms.scale)
            this.scale = transforms.scale;
        else if (transforms.scale3)
            this.scale = transforms.scale3;
    }

    /**
     * @deprecated The matrixChangeEvent property has deprecated, use matrixChanged instead.
    */
    get matrixChangeEvent() {
        console.warn("The matrixChangeEvent property has deprecated, use matrixChanged instead.");
        return this.matrixChanged;
    }

    /**
     * 设置平移分量。
     * @param {Cartesian3|Array|object} value 平移分量
     * @returns {void}
     */
    set translation(value) {
        value = parseToCartesian3(value, Scratch.scratchTranslation, 0.0);
        if (!Cartesian3.equals(value, this._translation)) {
            value.clone(this._translation);
            this.raisePropertyChangeEvent('translation', this._translation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取平移分量。
     * @returns {Cartesian3} 平移分量
     */
    get translation() {
        return this._translation;
    }

    /**
     * 设置旋转参考系类型。
     * @param {number} value 旋转参考系类型，取值参考 RotationFrameType
     * @returns {void}
     */
    set rotationFrameType(value) {
        if (this._rotationFrameType !== value) {
            this._rotationFrameType = value;
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取旋转参考系类型。
     * @returns {number} 旋转参考系类型，取值参考 RotationFrameType
     */
    get rotationFrameType() {
        return this._rotationFrameType;
    }

    /**
     * 以 HeadingPitchRoll 形式设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量
     * @returns {void}
     */
    set rotation(value) {
        value = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll);
        if (!HeadingPitchRoll.equals(value, this._rotation)) {
            value.clone(this._rotation);
            this.raisePropertyChangeEvent('rotation', this._rotation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取旋转量（HeadingPitchRoll 形式）。
     * @returns {HeadingPitchRoll} 旋转量
     */
    get rotation() {
        return this._rotation;
    }

    /**
     * 以角度制设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量（角度制）
     * @returns {void}
     */
    set rotationDegrees(value) {
        value = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, true);
        this.rotation = value;
    }

    /**
     * 获取角度制表示的旋转量。
     * @returns {HeadingPitchRoll|undefined} 旋转量（角度制）
     */
    get rotationDegrees() {
        if (this._rotation)
            return this._rotation.toDegrees();
    }

    /**
     * 以姿态（yaw、pitch、roll）设置旋转量。
     * @param {Array|object} value 姿态数据
     * @returns {void}
     */
    set attitude(value) {
        value = parseAttitudeToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll);
        this.rotation = value;
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @returns {HeadingPitchRoll|undefined} 姿态数据
     */
    get attitude() {
        return this.rotationDegrees;
    }

    /**
     * 以欧拉角（弧度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（弧度制）
     * @returns {void}
     */
    set euler(value) {
        value = parseEulerToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, false);
        this.rotation = value;
    }

    /**
     * 获取欧拉角（弧度制）表示的旋转量。
     * @returns {Cartesian3|undefined} 欧拉角（弧度制）
     */
    get euler() {
        if (this._rotation)
            return this._rotation.toEuler();
    }

    /**
     * 以欧拉角（角度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（角度制）
     * @returns {void}
     */
    set eulerDegrees(value) {
        value = parseEulerToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, true);
        this.rotation = value;
    }

    /**
     * 获取欧拉角（角度制）表示的旋转量。
     * @returns {Cartesian3|undefined} 欧拉角（角度制）
     */
    get eulerDegrees() {
        if (this._rotation)
            return this._rotation.toEulerDegrees();
    }

    /**
     * 以四元数设置旋转量。
     * @param {Quaternion} value 四元数
     * @returns {void}
     */
    set quaternion(value) {
        value = HeadingPitchRoll.fromQuaternion(value, Scratch.scratchHeadingPitchRoll);
        this.rotation = value;
    }

    /**
     * 获取四元数表示的旋转量。
     * @returns {Quaternion|undefined} 四元数
     */
    get quaternion() {
        if (this._rotation)
            return Quaternion.fromHeadingPitchRoll(this._rotation);
    }

    /**
     * 设置缩放分量。
     * @param {Cartesian3|Array|object} value 缩放分量
     * @returns {void}
     */
    set scale(value) {
        value = parseToCartesian3(value, Scratch.scratchScale3, 1.0);
        if (!Cartesian3.equals(value, this._scale)) {
            value.clone(this._scale);
            this.raisePropertyChangeEvent('scale', this._scale);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取缩放分量。
     * @returns {Cartesian3} 缩放分量
     */
    get scale() {
        return this._scale;
    }

    /**
     * 设置平移分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setTranslation(x, y, z) {
        if (typeof x === 'object') {
            this.translation = x;
        } else {
            this.translation = Cartesian3.fromElements(x, y, z, Scratch.scratchTranslation);
        }
    }

    /**
     * 获取平移分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 平移分量副本
     */
    getTranslation(result) {
        return this._translation.clone(result);
    }

    /**
     * 平移变换。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 local
     * @param {number} [z] z 分量
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translate(x, y, z, local = true) {
        let translate;
        if (typeof x === 'object') {
            local = y ?? true;
            translate = parseToCartesian3(x, Scratch.scratchTranslate, 0.0);
        } else {
            translate = Cartesian3.fromElements(x, y, z, Scratch.scratchTranslate);
        }
        if (Cartesian3.equals(translate, Cartesian3.ZERO))
            return;
        if (local) {
            Matrix4.multiplyByTranslation(this._matrix, translate, this._matrix);
            Matrix4.getTranslation(this._matrix, this._translation);
            this.raisePropertyChangeEvent('translation', this._translation);
            if (!this.updateByPerFrame)
                this.matrixChanged.raiseEvent(this.owner, this._matrix);
            else
                this.needsUpdate = true;
        } else {
            Cartesian3.add(this._translation, translate, this._translation);
            this.raisePropertyChangeEvent('translation', this._translation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 沿指定轴平移指定距离。
     * @param {Cartesian3} axis 平移轴方向
     * @param {number} distance 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateOnAxis(axis, distance, local = true) {
        distance = parseNumber(distance);
        if (distance !== 0) {
            Cartesian3.normalize(axis, axis);
            const translate = Cartesian3.multiplyByScalar(axis, distance, Scratch.scratchTranslate);
            this.translate(translate, local);
        }
    }

    /**
     * 沿 X 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateX(value, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.translate(value, 0, 0, local);
        }
    }

    /**
     * 沿 Y 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateY(value, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.translate(0, value, 0, local);
        }
    }

    /**
     * 沿 Z 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateZ(value, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.translate(0, 0, value, local);
        }
    }

    /**
     * 设置旋转量，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @returns {void}
     */
    setRotation(heading, pitch, roll, degrees) {
        let rotation;
        if (typeof heading === 'object') {
            rotation = heading;
            degrees = pitch;
        } else {
            rotation = {
                heading: heading,
                pitch: pitch,
                roll: roll,
            };
        }
        this.rotation = parseRotationToHeadingPitchRoll(rotation, Scratch.scratchHeadingPicthRoll, degrees);
    }

    /**
     * 获取旋转量的克隆。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 旋转量副本
     */
    getRotation(result) {
        return this._rotation.clone(result);
    }

    /**
     * 设置姿态（yaw、pitch、roll），支持传入对象或数值。
     * @param {object|number} yaw 姿态对象或 yaw 分量
     * @param {number} [pitch] pitch 分量
     * @param {number} [roll] roll 分量
     * @returns {void}
     */
    setAttitude(yaw, pitch, roll) {
        if (typeof yaw === 'object')
            this.attitude = yaw;
        else
            this.rotation = HeadingPitchRoll.fromDegrees(yaw, pitch, roll, Scratch.scratchHeadingPicthRoll);
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 姿态数据
     */
    getAttitude(result) {
        return this._rotation.toDegrees(result);
    }

    /**
     * 设置欧拉角，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @returns {void}
     */
    setEuler(x, y, z, degrees) {
        let euler;
        if (typeof x === 'object') {
            euler = x;
            degrees = y;
        } else {
            euler = Cartesian3.fromElements(x, y, z, Scratch.scratchEuler);
        }
        this.rotation = parseEulerToHeadingPitchRoll(euler, Scratch.scratchHeadingPicthRoll, degrees);
    }

    /**
     * 获取欧拉角。
     * @param {Cartesian3} [result] 用于存储结果的实例
     * @returns {Cartesian3} 欧拉角
     */
    getEuler(result) {
        return this._rotation.toEuler(result);
    }

    /**
     * 旋转，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotate(heading, pitch, roll, degrees, local = true) {
        let rotate;
        if (typeof heading === 'object') {
            rotate = heading;
            degrees = pitch;
        } else {
            rotate = {
                heading: heading,
                pitch: pitch,
                roll: roll,
            };
        }
        rotate = parseRotationToHeadingPitchRoll(rotate, Scratch.scratchHeadingPicthRoll, degrees);
        if (HeadingPitchRoll.equals(rotate, HeadingPitchRoll.ZERO))
            return;
        if (local) {
            if (this._rotationFrameType === RotationFrameType.CAMERA) {
                const pitch = rotate.pitch;
                const roll = rotate.roll;
                rotate.pitch = -roll;
                rotate.roll = pitch;
            } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
                const pitch = rotate.pitch;
                const roll = rotate.roll;
                rotate.pitch = roll;
                rotate.roll = pitch;
            }
            Matrix4.multiplyByHeadingPitchRoll(this._matrix, rotate, this._matrix);
            Matrix4.getHeadingPitchRoll(this._matrix, this._rotation);
            if (this._rotationFrameType === RotationFrameType.CAMERA) {
                const pitch = this._rotation.roll;
                const roll = -this._rotation.pitch;
                this._rotation.pitch = pitch;
                this._rotation.roll = roll;
            } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
                const pitch = this._rotation.roll;
                const roll = this._rotation.pitch;
                this._rotation.pitch = pitch;
                this._rotation.roll = roll;
            }
            this.raisePropertyChangeEvent('rotation', this._rotation);
            if (!this.updateByPerFrame)
                this.matrixChanged.raiseEvent(this.owner, this._matrix);
            else
                this.needsUpdate = true;
        } else {
            this._rotation.heading += rotate.heading;
            this._rotation.pitch += rotate.pitch;
            this._rotation.roll += rotate.roll;
            this.raisePropertyChangeEvent('rotation', this._rotation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 按欧拉角旋转，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateByEuler(x, y, z, degrees, local = true) {
        let rotate;
        if (typeof x === 'object') {
            rotate = x;
            degrees = y;
        } else {
            rotate = Cartesian3.fromElements(x, y, z, Scratch.scratchEuler);
        }
        rotate = parseEulerToHeadingPitchRoll(rotate, Scratch.scratchHeadingPicthRoll, degrees);
        if (this._rotationFrameType === RotationFrameType.CAMERA) {
            const pitch = rotate.pitch;
            const roll = rotate.roll;
            rotate.pitch = -roll;
            rotate.roll = pitch;
        } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
            const pitch = rotate.pitch;
            const roll = rotate.roll;
            rotate.pitch = roll;
            rotate.roll = pitch;
        }
        this.rotate(rotate, degrees, local);
    }

    /**
     * 绕指定轴旋转指定角度。
     * @param {Cartesian3} axis 旋转轴方向
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateOnAxis(axis, value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            axis = Cartesian3.normalize(axis, Scratch.scratchNormal);
            if (degrees)
                value = Math$1.toRadians(value);
            const quaternion = Quaternion.fromAxisAngle(axis, value, Scratch.scratchQuaternion);
            const rotate = HeadingPitchRoll.fromQuaternion(quaternion, Scratch.scratchHeadingPicthRoll);
            this.rotate(rotate, degrees, local);
        }
    }

    /**
     * 绕朝向（Heading）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateHeading(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.rotate(value, 0, 0, degrees, local);
        }
    }

    /**
     * 绕俯仰（Pitch）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotatePitch(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.rotate(0, value, 0, degrees, local);
        }
    }

    /**
     * 绕翻滚（Roll）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateRoll(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.rotate(0, 0, value, degrees, local);
        }
    }

    /**
     * 绕 X 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateX(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            // this.rotateOnAxis(Cartesian3.UNIT_X, value, degrees);
            this.rotateByEuler(value, 0, 0, degrees, local);
        }
    }

    /**
     * 绕 Y 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateY(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            // this.rotateOnAxis(Cartesian3.UNIT_Y, value, degrees);
            this.rotateByEuler(0, value, 0, degrees, local);
        }
    }

    /**
     * 绕 Z 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateZ(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            // this.rotateOnAxis(Cartesian3.UNIT_Z, value, degrees);
            this.rotateByEuler(0, 0, value, degrees, local);
        }
    }

    /**
     * 设置缩放分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setScale(x, y, z) {
        if (typeof x === 'object')
            this.scale = x;
        else
            this.scale = Cartesian3.fromElements(x, y, z, Scratch.scratchScale3);
    }

    /**
     * 获取缩放分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 缩放分量副本
     */
    getScale(result) {
        return this._scale.clone(result);
    }

    // set matrix(value) {
    //     Check.instanceOf('matrix', value, Matrix4);
    //     if (!Matrix4.equals(value, this._matrix)) {
    //         value.clone(this._matrix);

    //         decompose(this._matrix, this._translation, this._rotation, this._scale, this._rotationFrameType);

    //         this.matrixChanged.raiseEvent(this.owner, this._matrix);
    //     }
    // }

    /**
     * 获取当前的 4x4 变换矩阵。
     * @returns {Matrix4} 变换矩阵
     */
    get matrix() {
        return this._matrix;
    }

    // getMatrix(result) {
    //     return this._matrix.clone(result);
    // }

    /**
     * 根据当前平移、旋转、缩放重新计算变换矩阵。
     * @param {boolean} [force] 是否强制更新矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateMatrix(force) {
        if (force || this.needsUpdate) {
            let rotation;
            if (this._rotationFrameType === RotationFrameType.CAMERA) {
                rotation = this._rotation.clone(Scratch.scratchHeadingPicthRoll);
                rotation.pitch = -this._rotation.roll;
                rotation.roll = this._rotation.pitch;
            } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
                rotation = this._rotation.clone(Scratch.scratchHeadingPicthRoll);
                rotation.pitch = this._rotation.roll;
                rotation.roll = this._rotation.pitch;
            } else {
                rotation = this._rotation;
            }
            const quaternion = Quaternion.fromHeadingPitchRoll(rotation, Scratch.scratchQuaternion);
            Matrix4.fromTranslationQuaternionRotationScale(this._translation, quaternion, this._scale, this._matrix);
            this.matrixChanged.raiseEvent(this.owner, this._matrix);
            this.needsUpdate = false;
            return true;
        }
    }

    /**
     * 每帧更新，逐帧模式下按需更新变换矩阵。
     * @param {object} [frameState] 帧状态对象
     * @returns {boolean|undefined} 逐帧更新时返回矩阵更新结果
     */
    update(frameState) {
        if (this.isDestroyed())
            return;
        // if (frameState)
        //     this.ellipsoid = frameState.scene.ellipsoid;
        // else
        //     this.ellipsoid = this.owner.ellipsoid;
        if (this.updateByPerFrame)
            return this.updateMatrix();
    }

    /**
     * 销毁实例时清理资源，清空矩阵变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this.matrixChanged.clear();
        super.onDestroy();
    }
}

/**
 * 模型矩阵变换类，继承自 PropertyChangedListener。
 * 组合地理坐标变换（GeographicTransform）与平移-旋转-缩放变换（TranslationRotationScaleTransform），
 * 通过固定坐标系矩阵与本地变换矩阵计算最终模型矩阵，并支持前置/后置变换矩阵，变化时触发相应事件。
 */
class ModelMatrixTransforms extends PropertyChangedListener {
    /**
     * 创建模型矩阵变换实例。
     * @param {object} [options={}] 配置项
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体，未提供时取宿主对象的 ellipsoid
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {function} [options.onModelMatrixChanged] 模型矩阵变更回调函数
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        this.owner = options.owner ?? this;
        this.ellipsoid = options.ellipsoid ?? this.owner.ellipsoid;
        this._updateByPerFrame = options.updateByPerFrame ?? true;
        this.onModelMatrixChanged = options.onModelMatrixChanged ?? this.onModelMatrixChanged.bind(this.owner);
        // this.updateByPerFrame = options.updateByPerFrame;

        this._modelMatrix = Matrix4.IDENTITY.clone(new Matrix4());
        this._modelMatrixChanged = new Event();

        this._geographicTransform = new GeographicTransform({
            owner: this.owner,
            ellipsoid: this.ellipsoid,
            updateByPerFrame: this.updateByPerFrame,
        });
        this._geographicTransform.undeletable = true;
        this._geographicTransform.propertyChanged.addEventListener((raiser, name, value, type) => {
            if (!this.isDestroyed()) {
                this.raisePropertyChangeEvent(name, value, type);
                this.needsUpdateModelMatrix = true;
            }
        });
        this._trsTransform = new TranslationRotationScaleTransform({
            owner: this.owner,
            ellipsoid: this.ellipsoid,
            updateByPerFrame: this.updateByPerFrame,
        });
        this._trsTransform.undeletable = true;
        this._trsTransform.propertyChanged.addEventListener((raiser, name, value, type) => {
            if (!this.isDestroyed()) {
                this.raisePropertyChangeEvent(name, value, type);
                this.needsUpdateModelMatrix = true;
            }
        });

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置位置、变换矩阵等参数。
     * @param {object} transforms 变换配置
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        this._geographicTransform.setTransforms(transforms);
        this._trsTransform.setTransforms(transforms);
        if (transforms.beforeTransformMatrix)
            this.beforeTransformMatrix = transforms.beforeTransformMatrix;
        if (transforms.afterTransformMatrix)
            this.afterTransformMatrix = transforms.afterTransformMatrix;
        if (transforms.modelMatrix)
            this.modelMatrix = transforms.modelMatrix;
    }

    /**
     * 设置是否逐帧自动更新矩阵，并同步到内部的坐标与变换对象。
     * @param {boolean} value 是否逐帧自动更新
     * @returns {void}
     */
    set updateByPerFrame(value) {
        Check.typeOf.bool('updateByPerFrame', value);
        if (this._updateByPerFrame !== value) {
            this._updateByPerFrame = value;
            this._geographicTransform.updateByPerFrame = value;
            this._trsTransform.updateByPerFrame = value;
        }
    }

    /**
     * 获取是否逐帧自动更新矩阵。
     * @returns {boolean} 是否逐帧自动更新
     */
    get updateByPerFrame() {
        return this._updateByPerFrame;
    }

    /**
     * 获取模型矩阵变更事件对象。
     * @returns {Event} 模型矩阵变更事件对象
     */
    get modelMatrixChanged() {
        return this._modelMatrixChanged;
    }

    /**
     * @deprecated use modelMatrixChanged instead
    */
    get modelMatrixChangeEvent() {
        console.warn("modelMatrixChangeEvent is deprecated. Use modelMatrixChanged instead.");
        return this.modelMatrixChanged;
    }

    /**
     * 模型矩阵发生变更时的回调钩子，子类可重写。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    onModelMatrixChanged(modelMatrix) { }

    /**
     * 触发模型矩阵变更事件并调用对应回调。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    raiseModelMatrixChangeEvent(modelMatrix) {
        this._modelMatrixChanged.raiseEvent(this.owner, modelMatrix);
        this.onModelMatrixChanged(modelMatrix);
    }

    /**
     * 设置世界坐标位置（委托给内部地理坐标变换对象）。
     * @param {Cartesian3|object} value 世界坐标位置
     * @returns {void}
     */
    set position(value) {
        this._geographicTransform.position = value;
    }

    /**
     * 获取世界坐标位置。
     * @returns {Cartesian3} 世界坐标位置
     */
    get position() {
        return this._geographicTransform.position;
    }

    /**
     * 设置世界坐标位置，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setPosition(x, y, z) {
        this._geographicTransform.setPosition(x, y, z);
    }

    /**
     * 获取世界坐标位置的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 世界坐标位置副本
     */
    getPosition(result) {
        return this._geographicTransform.getPosition(result);
    }

    /**
     * 设置地理坐标（经纬高）。
     * @param {Geographic|object} value 地理坐标
     * @returns {void}
     */
    set geographic(value) {
        this._geographicTransform.geographic = value;
    }

    /**
     * 获取地理坐标。
     * @returns {Geographic} 地理坐标
     */
    get geographic() {
        return this._geographicTransform.geographic;
    }

    /**
     * 设置地理坐标，支持传入 Geographic 对象或经纬高数值。
     * @param {Geographic|number} longitude Geographic 对象或经度
     * @param {number} [latitude] 纬度
     * @param {number} [altitude] 高度，单位米
     * @param {boolean} [degrees=true] 传入的经纬度是否为角度制
     * @returns {void}
     */
    setGeographic(longitude, latitude, altitude, degrees) {
        this._geographicTransform.setGeographic(longitude, latitude, altitude, degrees);
    }

    /**
     * 获取地理坐标的克隆。
     * @param {Geographic} [result] 用于存储结果的 Geographic 实例
     * @returns {Geographic} 地理坐标副本
     */
    getGeographic(result) {
        return this._geographicTransform.getGeographic(result);
    }

    /**
     * 沿经度方向平移指定数值。
     * @param {number} value 平移量
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLongitude(value, degrees) {
        this._geographicTransform.translateLongitude(value, degrees);
    }

    /**
     * 沿纬度方向平移指定数值。
     * @param {number} value 平移量
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLatitude(value, degrees) {
        this._geographicTransform.translateLatitude(value, degrees);
    }

    /**
     * 平移高度（海拔）。
     * @param {number} value 高度平移量，单位米
     * @param {boolean} [degrees=true] 是否为角度制，false 时会将 value 由弧度换算为角度
     * @returns {void}
     */
    translateAltitude(value, degrees) {
        this._geographicTransform.translateAltitude(value, degrees);
    }

    /**
     * 获取固定坐标系（东-北-天）变换矩阵。
     * @returns {Matrix4} 固定坐标系变换矩阵
     */
    get fixedFrameMatrix() {
        return this._geographicTransform.matrix;
    }

    /**
     * 设置相对于本地坐标系的平移分量。
     * @param {Cartesian3|Array|object} value 平移分量
     * @returns {void}
     */
    set translation(value) {
        this._trsTransform.translation = value;
    }

    /**
     * 获取相对于本地坐标系的平移分量。
     * @returns {Cartesian3} 平移分量
     */
    get translation() {
        return this._trsTransform.translation;
    }

    /**
     * 设置平移分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setTranslation(x, y, z) {
        this._trsTransform.setTranslation(x, y, z);
    }

    /**
     * 获取平移分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 平移分量副本
     */
    getTranslation(result) {
        return this._trsTransform.getTranslation(result);
    }

    /**
     * 平移变换，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 local
     * @param {number} [z] z 分量
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translate(x, y, z, local) {
        this._trsTransform.translate(x, y, z, local);
    }

    /**
     * 沿指定轴平移指定距离。
     * @param {Cartesian3} axis 平移轴方向
     * @param {number} distance 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateOnAxis(axis, distance, local) {
        this._trsTransform.translateOnAxis(axis, distance, local);
    }

    /**
     * 沿 X 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateX(value, local) {
        this._trsTransform.translateX(value, local);
    }

    /**
     * 沿 Y 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateY(value, local) {
        this._trsTransform.translateY(value, local);
    }

    /**
     * 沿 Z 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateZ(value, local) {
        this._trsTransform.translateZ(value, local);
    }

    /**
     * 设置旋转参考系类型。
     * @param {number} value 旋转参考系类型，取值参考 RotationFrameType
     * @returns {void}
     */
    set rotationFrameType(value) {
        this._trsTransform.rotationFrameType = value;
    }

    /**
     * 获取旋转参考系类型。
     * @returns {number} 旋转参考系类型，取值参考 RotationFrameType
     */
    get rotationFrameType() {
        return this._trsTransform.rotationFrameType;
    }

    /**
     * 以 HeadingPitchRoll 形式设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量
     * @returns {void}
     */
    set rotation(value) {
        this._trsTransform.rotation = value;
    }

    /**
     * 获取旋转量（HeadingPitchRoll 形式）。
     * @returns {HeadingPitchRoll} 旋转量
     */
    get rotation() {
        return this._trsTransform.rotation;
    }

    /**
     * 以角度制设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量（角度制）
     * @returns {void}
     */
    set rotationDegrees(value) {
        this._trsTransform.rotationDegrees = value;
    }

    /**
     * 获取角度制表示的旋转量。
     * @returns {HeadingPitchRoll} 旋转量（角度制）
     */
    get rotationDegrees() {
        return this._trsTransform.rotationDegrees;
    }

    /**
     * 设置旋转量，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @returns {void}
     */
    setRotation(heading, pitch, roll, degrees) {
        this._trsTransform.setRotation(heading, pitch, roll, degrees);
    }

    /**
     * 获取旋转量的克隆。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 旋转量副本
     */
    getRotation(result) {
        return this._trsTransform.getRotation(result);
    }

    /**
     * 以姿态（yaw、pitch、roll）设置旋转量。
     * @param {Array|object} value 姿态数据
     * @returns {void}
     */
    set attitude(value) {
        this._trsTransform.attitude = value;
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @returns {HeadingPitchRoll} 姿态数据
     */
    get attitude() {
        return this._trsTransform.attitude;
    }

    /**
     * 设置姿态，支持传入对象或数值。
     * @param {object|number} yaw 姿态对象或 yaw 分量
     * @param {number} [pitch] pitch 分量
     * @param {number} [roll] roll 分量
     * @returns {void}
     */
    setAttitude(yaw, pitch, roll) {
        this._trsTransform.setAttitude(yaw, pitch, roll);
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 姿态数据
     */
    getAttitude(result) {
        return this._trsTransform.getAttitude(result);
    }

    /**
     * 以欧拉角（弧度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（弧度制）
     * @returns {void}
     */
    set euler(value) {
        this._trsTransform.euler = value;
    }

    /**
     * 获取欧拉角（弧度制）表示的旋转量。
     * @returns {Cartesian3} 欧拉角（弧度制）
     */
    get euler() {
        return this._trsTransform.euler;
    }

    /**
     * 以欧拉角（角度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（角度制）
     * @returns {void}
     */
    set eulerDegrees(value) {
        this._trsTransform.eulerDegrees = value;
    }

    /**
     * 获取欧拉角（角度制）表示的旋转量。
     * @returns {Cartesian3} 欧拉角（角度制）
     */
    get eulerDegrees() {
        return this._trsTransform.eulerDegrees;
    }

    /**
     * 设置欧拉角，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @returns {void}
     */
    setEuler(x, y, z, degrees) {
        this._trsTransform.setEuler(x, y, z, degrees);
    }

    /**
     * 获取欧拉角。
     * @param {Cartesian3} [result] 用于存储结果的实例
     * @returns {Cartesian3} 欧拉角
     */
    getEuler(result) {
        return this._trsTransform.getEuler(result);
    }

    /**
     * 旋转，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @returns {void}
     */
    rotate(heading, pitch, roll, degrees) {
        this._trsTransform.rotate(heading, pitch, roll, degrees);
    }

    /**
     * 按欧拉角旋转，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @returns {void}
     */
    rotateByEuler(x, y, z, degrees) {
        this._trsTransform.rotateByEuler(x, y, z, degrees);
    }

    /**
     * 绕指定轴旋转指定角度。
     * @param {Cartesian3} axis 旋转轴方向
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateOnAxis(axis, value, degrees) {
        this._trsTransform.rotateOnAxis(axis, value, degrees);
    }

    /**
     * 绕朝向（Heading）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateHeading(value, degrees) {
        this._trsTransform.rotateHeading(value, degrees);
    }

    /**
     * 绕俯仰（Pitch）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotatePitch(value, degrees) {
        this._trsTransform.rotatePitch(value, degrees);
    }

    /**
     * 绕翻滚（Roll）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateRoll(value, degrees) {
        this._trsTransform.rotateRoll(value, degrees);
    }

    /**
     * 绕 X 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateX(value, degrees) {
        this._trsTransform.rotateX(value, degrees);
    }

    /**
     * 绕 Y 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateY(value, degrees) {
        this._trsTransform.rotateY(value, degrees);
    }

    /**
     * 绕 Z 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateZ(value, degrees) {
        this._trsTransform.rotateZ(value, degrees);
    }

    /**
     * 以四元数设置旋转量。
     * @param {Quaternion} value 四元数
     * @returns {void}
     */
    set quaternion(value) {
        this._trsTransform.quaternion = value;
    }

    /**
     * 获取四元数表示的旋转量。
     * @returns {Quaternion} 四元数
     */
    get quaternion() {
        return this._trsTransform.quaternion;
    }

    /**
     * 设置缩放分量。
     * @param {Cartesian3|Array|object} value 缩放分量
     * @returns {void}
     */
    set scale(value) {
        this._trsTransform.scale = value;
    }

    /**
     * 获取缩放分量。
     * @returns {Cartesian3} 缩放分量
     */
    get scale() {
        return this._trsTransform.scale;
    }

    /**
     * 设置缩放分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setScale(x, y, z) {
        this._trsTransform.setScale(x, y, z);
    }

    /**
     * 获取缩放分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 缩放分量副本
     */
    getScale(result) {
        return this._trsTransform.getScale(result);
    }

    /**
     * 获取本地坐标系下的变换矩阵。
     * @returns {Matrix4} 本地变换矩阵
     */
    get localTransformMatrix() {
        return this._trsTransform.matrix;
    }

    /**
     * 设置前置变换矩阵，在本地变换之前应用；传入 undefined 表示清除。
     * @param {Matrix4} value 前置变换矩阵
     * @returns {void}
     */
    set beforeTransformMatrix(value) {
        if (defined(value)) {
            Check.instanceOf('beforeTransformMatrix', value, Matrix4);
            if (!Matrix4.equals(value, this._beforeTransformMatrix)) {
                this._beforeTransformMatrix = Matrix4.clone(value, this._beforeTransformMatrix);
                this.needsUpdateModelMatrix = true;
                this.raisePropertyChangeEvent('beforeTransformMatrix', value);
            }
        } else if (defined(this._beforeTransformMatrix)) {
            this._beforeTransformMatrix = undefined;
            this.needsUpdateModelMatrix = true;
            this.raisePropertyChangeEvent('beforeTransformMatrix', value);
        }
    }

    /**
     * 获取前置变换矩阵。
     * @returns {Matrix4} 前置变换矩阵
     */
    get beforeTransformMatrix() {
        return this._beforeTransformMatrix;
    }

    /**
     * 设置后置变换矩阵，在本地变换之后应用；传入 undefined 表示清除。
     * @param {Matrix4} value 后置变换矩阵
     * @returns {void}
     */
    set afterTransformMatrix(value) {
        if (defined(value)) {
            Check.instanceOf('afterTransformMatrix', value, Matrix4);
            if (!Matrix4.equals(value, this._afterTransformMatrix)) {
                this._afterTransformMatrix = Matrix4.clone(value, this._afterTransformMatrix);
                this.needsUpdateModelMatrix = true;
                this.raisePropertyChangeEvent('afterTransformMatrix', value);
            }
        } else if (defined(this._afterTransformMatrix)) {
            this._afterTransformMatrix = undefined;
            this.needsUpdateModelMatrix = true;
            this.raisePropertyChangeEvent('afterTransformMatrix', value);
        }
    }

    /**
     * 获取后置变换矩阵。
     * @returns {Matrix4} 后置变换矩阵
     */
    get afterTransformMatrix() {
        return this._afterTransformMatrix;
    }

    /**
     * 通过完整模型矩阵反解出位置、旋转、缩放并应用到各变换分量。
     * @param {Matrix4} value 模型矩阵
     * @returns {void}
     */
    set modelMatrix(value) {
        Check.instanceOf('modelMatrix', value, Matrix4);
        if (!Matrix4.equals(value, this._modelMatrix)) {
            const result = resolveModelMatrixByFixedFrame(value, this.ellipsoid);
            this.position = result.position;
            this.translation = Cartesian3.ZERO;
            this.rotation = result.rotation;
            this.scale = result.scale;
            this.beforeTransformMatrix = undefined;
            this.afterTransformMatrix = undefined;
        }
    }

    /**
     * 获取当前的模型矩阵。
     * @returns {Matrix4} 模型矩阵
     */
    get modelMatrix() {
        return this._modelMatrix;
    }

    /**
     * 异步获取模型矩阵中的实际世界坐标位置，会等待位置与模型矩阵更新完成后返回。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Promise<Cartesian3>} 解析为实际世界坐标位置的 Promise
     */
    getActualPosition(result) {
        return new Promise((resolve, reject) => {

            const doGetActualPosition = () => {
                if (this._geographicTransform.positionChanged || this._geographicTransform.geographicChanged || this.needsUpdateModelMatrix) {
                    setTimeout(doGetActualPosition, 10);
                    return;
                }

                if (!result)
                    result = new Cartesian3();
                Matrix4.getTranslation(this.modelMatrix, result);
                resolve(result);
            };

            doGetActualPosition();
        });
    }

    /**
     * 根据固定坐标系矩阵与各级变换矩阵重新计算模型矩阵，并触发相应变更事件。
     * @param {boolean} [force] 是否强制更新模型矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateModelMatrix(force) {
        if (force || this.needsUpdateModelMatrix) {
            this._modelMatrix = computeModelMatrix({
                fixedFrameMatrix: this.fixedFrameMatrix,
                beforeTransformMatrix: this.beforeTransformMatrix,
                localTransformMatrix: this.localTransformMatrix,
                afterTransformMatrix: this.afterTransformMatrix,
                ellipsoid: this.ellipsoid,
            }, this._modelMatrix);
            this.raisePropertyChangeEvent('modelMatrix', this._modelMatrix, PropertyType.MODELMATRIX);
            this.raiseModelMatrixChangeEvent(this._modelMatrix);
            this.needsUpdateModelMatrix = false;
            // console.log('computeModelMatrix:', this._modelMatrix);
            return true;
        }
    }

    /**
     * 每帧更新，先更新内部坐标与变换对象，再按需更新模型矩阵。
     * @param {object} [frameState] 帧状态对象
     * @returns {boolean|undefined} 模型矩阵更新结果
     */
    update(frameState) {
        if (this.isDestroyed())
            return;
        if (frameState)
            this.ellipsoid = frameState.scene.ellipsoid;
        if (this._geographicTransform.update(frameState)) {
            this.needsUpdateModelMatrix = true;
        }
        if (this._trsTransform.update(frameState)) {
            this.needsUpdateModelMatrix = true;
        }
        return this.updateModelMatrix();
    }

    /**
     * 销毁实例时清理资源，清空事件并销毁内部坐标与变换对象。
     * @returns {void}
     */
    onDestroy() {
        this._modelMatrixChanged.clear();
        this._geographicTransform.destroy();
        this._trsTransform.destroy();
        super.onDestroy();
    }
}

/**
 * 纹理坐标（s、t）变换类，继承自 PropertyChangedListener。
 * 通过偏移（stOffset）、重复（stRepeat）、旋转（stRotation）、中心（stCenter）等参数维护二维纹理坐标变换矩阵，
 * 支持逐帧自动更新，并在参数变化时触发属性变更事件。
 */
class StTransforms extends PropertyChangedListener {
    /**
     * 创建纹理坐标变换实例。
     * @param {object} [options={}] 配置项
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     * @param {function} [options.onStTransformChanged] 纹理坐标变换变更回调函数
     * @param {Cartesian2|object} [options.stOffset] 初始纹理坐标偏移
     * @param {Cartesian2|object} [options.stRepeat] 初始纹理坐标重复次数
     * @param {number} [options.stRotation] 初始纹理坐标旋转量（弧度）
     * @param {number} [options.stRotationDegrees] 初始纹理坐标旋转量（角度）
     * @param {Cartesian2|object} [options.stCenter] 初始纹理坐标旋转中心
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        this.owner = options.owner ?? this;
        this.updateByPerFrame = options.updateByPerFrame ?? true;
        this.onStTransformChanged = options.onStTransformChanged || this.onStTransformChanged.bind(this.owner);

        this._stOffset = new Cartesian2();
        this._stRepeat = new Cartesian2(1, 1);
        this._stRotation = 0;
        this._stCenter = new Cartesian2(0.5, 0.5);
        this._stCenterRotation = new Cartesian3(0.5, 0.5, 0);

        this._transform = new Matrix3();
        this._stTransformChangeEvent = new Event();

        this.updateTransform(true);

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置纹理坐标变换参数。
     * @param {object} transforms 变换配置，可包含 stOffset、stRepeat、stRotation、stRotationDegrees、stCenter
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        if (transforms.stOffset)
            this.stOffset = transforms.stOffset;
        else if (transforms.stRepeat)
            this.stRepeat = transforms.stRepeat;
        if (defined$1(transforms.stRotation))
            this.stRotation = transforms.stRotation;
        else if (defined$1(transforms.stRotationDegrees))
            this.stRotationDegrees = transforms.stRotationDegrees;
        if (transforms.stCenter)
            this.stCenter = transforms.stCenter;
    }

    /**
     * 获取纹理坐标变换变更事件对象。
     * @returns {Event} 纹理坐标变换变更事件对象
     */
    get stTransformChangeEvent() {
        return this._stTransformChangeEvent;
    }

    /**
     * 纹理坐标变换发生变更时的回调钩子，子类可重写。
     * @param {Matrix3} transform 变换后的纹理坐标矩阵
     * @returns {void}
     */
    onStTransformChanged(transform) { }

    /**
     * 触发纹理坐标变换变更事件并调用对应回调。
     * @param {Matrix3} transform 变换后的纹理坐标矩阵
     * @returns {void}
     */
    raiseStTransformChangeEvent(transform) {
        this._stTransformChangeEvent.raiseEvent(transform);
        this.onStTransformChanged(transform);
    }

    /**
     * 设置纹理坐标偏移量。
     * @param {Cartesian2|object} value 纹理坐标偏移
     * @returns {void}
     */
    set stOffset(value) {
        value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
        if (!Cartesian2.equals(this._stOffset, value)) {
            this._stOffset = value.clone(this._stOffset);
            this.raisePropertyChangeEvent('stOffset', this._stOffset, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标偏移量。
     * @returns {Cartesian2} 纹理坐标偏移
     */
    get stOffset() {
        return this._stOffset;
    }

    /**
     * 设置纹理坐标重复次数。
     * @param {Cartesian2|object} value 纹理坐标重复次数
     * @returns {void}
     */
    set stRepeat(value) {
        value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
        if (!Cartesian2.equals(this._stRepeat, value)) {
            this._stRepeat = value.clone(this._stRepeat);
            this.raisePropertyChangeEvent('stRepeat', this._stRepeat, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标重复次数。
     * @returns {Cartesian2} 纹理坐标重复次数
     */
    get stRepeat() {
        return this._stRepeat;
    }

    /**
     * 设置纹理坐标旋转量（弧度制）。
     * @param {number} value 旋转量，单位弧度
     * @returns {void}
     */
    set stRotation(value) {
        Check.typeOf.number('stRotation', value);
        if (this._stRotation !== value) {
            this._stRotation = value;
            this._stCenterRotation.z = value;
            this.raisePropertyChangeEvent('stRotation', this._stRotation, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标旋转量（弧度制）。
     * @returns {number} 旋转量，单位弧度
     */
    get stRotation() {
        return this._stRotation;
    }

    /**
     * 设置纹理坐标旋转量（角度制）。
     * @param {number} value 旋转量，单位角度
     * @returns {void}
     */
    set stRotationDegrees(value) {
        this.stRotation = Math$1.toRadians(value);
    }

    /**
     * 获取纹理坐标旋转量（角度制）。
     * @returns {number|undefined} 旋转量，单位角度
     */
    get stRotationDegrees() {
        if (defined$1(this._stRotation))
            return Math$1.toDegrees(this._stRotation);
    }

    /**
     * 设置纹理坐标旋转中心。
     * @param {Cartesian2|object} value 纹理坐标旋转中心
     * @returns {void}
     */
    set stCenter(value) {
        value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
        if (!Cartesian2.equals(this._stCenter, value)) {
            this._stCenter = value.clone(this._stCenter);
            this._stCenterRotation = value.clone(this._stCenterRotation);
            this.raisePropertyChangeEvent('stCenter', this._stCenter, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标旋转中心。
     * @returns {Cartesian2} 纹理坐标旋转中心
     */
    get stCenter() {
        return this._stCenter;
    }

    /**
     * 获取带旋转量的纹理坐标旋转中心（z 分量为旋转弧度）。
     * @returns {Cartesian3} 纹理坐标旋转中心及旋转量
     */
    get stCenterRotation() {
        return this._stCenterRotation;
    }

    /**
     * 获取当前的纹理坐标变换矩阵。
     * @returns {Matrix3} 纹理坐标变换矩阵
     */
    get transform() {
        return this._transform;
    }

    /**
     * 根据当前参数重新计算纹理坐标变换矩阵。
     * @param {boolean} [force] 是否强制更新矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateTransform(force) {
        if (force || this.needsUpdate) {
            this._transform = computeStTransform(this._stOffset, this._stRepeat, this._stRotation, this._stCenter, this._transform);
            this.raisePropertyChangeEvent('stTransform', this._transform, PropertyType.ATTRIBUTE);
            this.raiseStTransformChangeEvent(this._transform);
            this.needsUpdate = false;
            return true;
        }
    }

    /**
     * 每帧更新，逐帧模式下按需更新纹理坐标变换矩阵。
     * @returns {boolean|undefined} 逐帧更新时返回矩阵更新结果
     */
    update() {
        if (this.updateByPerFrame)
            return this.updateTransform();
    }

    /**
     * 销毁实例时清理资源，清空纹理坐标变换变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._stTransformChangeEvent.clear();
        super.onDestroy();
    }
}

/**
 * 图元基类，继承自 PropertyChangedListener。
 * 统一管理图元的 id、name、显示状态、拾取、就绪状态与高度显示条件等公共属性，
 * 并约定 onInit / onUpdate 生命周期钩子供子类实现。
 */
class BasePrimitive extends PropertyChangedListener {
    /**
     * 创建图元实例。
     * @param {object} [options={}] 配置项
     */
    constructor(options = {}) {
        super();
        this._init(options);
    }

    /**
     * 初始化图元的各项公共属性并调用 onInit 钩子。
     * @param {object} options 配置项
     * @param {string} [options.id] 图元唯一标识，未提供时自动生成
     * @param {string} [options.name] 图元名称，未提供时取 id
     * @param {boolean} [options.allowPicking=true] 是否允许拾取
     * @param {object} [options.pickPrimitive] 拾取时返回的图元，未提供时默认为自身
     * @param {boolean} [options.show=true] 是否显示
     * @returns {void}
     */
    _init(options) {
        this._id = options.id ?? createGuid();
        this._name = options.name ?? this._id;
        this._ready = false;
        this._readyPromise = defer();
        this._allowPicking = options.allowPicking ?? true;
        this._pickPrimitive = options.pickPrimitive ?? this;
        this._show = options.show ?? true;

        this.onInit(options);
    }

    /**
     * 初始化钩子，子类可重写以完成自身属性和资源的初始化。
     * @param {object} options 配置项
     * @returns {void}
     */
    onInit(options) { }

    /**
     * 使用配置对象批量设置实例属性。
     * @param {object} options 配置项
     * @returns {void}
     */
    setOptions(options) {
        setParameters(this, options);
    }

    /**
     * 设置图元唯一标识。
     * @param {string} value 图元唯一标识
     * @returns {void}
     */
    set id(value) {
        if (defined$1(value) && this._id !== value) {
            this._id = value;
            this.raisePropertyChangeEvent('id', value);
        }
    }

    /**
     * 获取图元唯一标识。
     * @returns {string} 图元唯一标识
     */
    get id() {
        return this._id;
    }

    /**
     * 设置图元唯一标识（id 的别名）。
     * @param {string} value 图元唯一标识
     * @returns {void}
     */
    set guid(value) {
        this.id = value;
    }

    /**
     * 获取图元唯一标识（id 的别名）。
     * @returns {string} 图元唯一标识
     */
    get guid() {
        return this.id;
    }

    /**
     * 设置图元名称。
     * @param {string} value 图元名称
     * @returns {void}
     */
    set name(value) {
        Check.typeOf.string('name', value);
        if (this._name !== value) {
            this._name = value;
            this.raisePropertyChangeEvent('name', value);
        }
    }

    /**
     * 获取图元名称。
     * @returns {string} 图元名称
     */
    get name() {
        return this._name;
    }

    /**
     * 获取图元是否已就绪。
     * @returns {boolean} 是否已就绪
     */
    get ready() {
        return this._ready;
    }

    /**
     * 获取图元就绪状态的 Promise。
     * @returns {Promise<BasePrimitive>} 就绪后解析为当前图元实例的 Promise
     */
    get readyPromise() {
        return this._readyPromise.promise;
    }

    /**
     * 标记图元就绪完成并兑现就绪 Promise。
     * @returns {void}
     */
    _readyCompleted() {
        this._ready = true;
        this._readyPromise.resolve(this);
    }

    /**
     * 标记图元就绪失败并拒绝就绪 Promise。
     * @param {*} error 错误信息
     * @returns {void}
     */
    _readyErrored(error) {
        console.warn(error);
        this._ready = false;
        this._readyPromise.reject(error);
    }

    /**
     * 设置是否允许拾取。
     * @param {boolean} value 是否允许拾取
     * @returns {void}
     */
    set allowPicking(value) {
        Check.typeOf.bool('allowPicking', value);
        if (this._allowPicking !== value) {
            this._allowPicking = value;
            this.raisePropertyChangeEvent('allowPicking', value);
        }
    }

    /**
     * 获取是否允许拾取。
     * @returns {boolean} 是否允许拾取
     */
    get allowPicking() {
        return this._allowPicking;
    }

    /**
     * 设置拾取时返回的图元，未提供时默认为自身。
     * @param {object} value 拾取时返回的图元
     * @returns {void}
     */
    set pickPrimitive(value) {
        if (defined$1(value))
            this._pickPrimitive = value;
        else
            this._pickPrimitive = this;
    }

    /**
     * 获取拾取时返回的图元。
     * @returns {object} 拾取时返回的图元
     */
    get pickPrimitive() {
        return this._pickPrimitive;
    }

    /**
     * 设置是否显示。
     * @param {boolean} value 是否显示
     * @returns {void}
     */
    set show(value) {
        Check.typeOf.bool('show', value);
        if (this._show !== value) {
            this._show = value;
            this.raisePropertyChangeEvent('show', value);
        }
    }

    /**
     * 获取是否显示。
     * @returns {boolean} 是否显示
     */
    get show() {
        return this._show;
    }

    /**
     * 设置高度显示条件（区间范围），未提供时清除该条件。
     * @param {*} value 高度显示条件，可被解析为区间范围
     * @returns {void}
     */
    set heightDisplayCondition(value) {
        if (defined$1(value)) {
            this._heightDisplayCondition = parseToRange(value, this._heightDisplayCondition);
        } else
            this._heightDisplayCondition = undefined;
    }

    /**
     * 获取高度显示条件。
     * @returns {*} 高度显示条件
     */
    get heightDisplayCondition() {
        return this._heightDisplayCondition;
    }

    /**
     * 每帧更新，设置椭球体并在满足就绪、显示、拾取与高度条件时调用 onUpdate 钩子。
     * @param {FrameState} frameState 帧状态对象
     * @returns {void}
     */
    update(frameState) {
        this.ellipsoid = frameState.scene.ellipsoid;
        if (!this.ready || !this.show || this.isDestroyed())
            return;
        if (frameState.passes.pick && !this._allowPicking)
            return;
        if (this._heightDisplayCondition) {
            const height = frameState.camera.positionCartographic.height;
            if (this._heightDisplayCondition.between(height))
                this.onUpdate(frameState);
        } else
            this.onUpdate(frameState);
    }

    /**
     * 更新钩子，子类可重写以完成每帧渲染更新。
     * @param {FrameState} frameState 帧状态对象
     * @returns {void}
     */
    onUpdate(frameState) { }

    // onDestroy() {
    //     super.onDestroy();
    // }
}

/**
 * 模型矩阵图元基类，继承自 BasePrimitive。
 * 在图元基础上维护一个模型矩阵，支持矩阵变更事件与回调，供需要直接控制模型矩阵的图元复用。
 */
class ModelMatrixPrimitive extends BasePrimitive {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 初始化图元：创建模型矩阵变更事件并按配置初始化模型矩阵。
     * @param {object} options 配置项
     * @param {Matrix4} [options.modelMatrix] 初始模型矩阵，未提供时使用单位矩阵
     * @returns {void}
     */
    _init(options) {
        super._init(options);

        this._modelMatrixChanged = new Event();
        this._modelMatrix = Matrix4.clone(options.modelMatrix ?? Matrix4.IDENTITY);
    }

    /**
     * 获取模型矩阵变更事件对象。
     * @returns {Event} 模型矩阵变更事件对象
     */
    get modelMatrixChanged() {
        return this._modelMatrixChanged;
    }

    /**
     * 获取模型矩阵变更事件对象。
     * @deprecated 已废弃，请使用 modelMatrixChanged 替代
     * @returns {Event} 模型矩阵变更事件对象
     */
    get modelMatrixChangeEvent() {
        console.warn("modelMatrixChangeEvent is deprecated, use modelMatrixChanged instead");
        return this._modelMatrixChanged;
    }

    /**
     * 设置模型矩阵，值发生变化时触发模型矩阵变更事件。
     * @param {Matrix4} value 模型矩阵
     * @returns {void}
     */
    set modelMatrix(value) {
        Check.instanceOf('modelMatrix', value, Matrix4);
        if (!Matrix4.equals(value, this._modelMatrix)) {
            this._modelMatrix = Matrix4.clone(value, this._modelMatrix);
            this.raiseModelMatrixChangeEvent(this._modelMatrix);
        }
    }

    /**
     * 获取当前模型矩阵。
     * @returns {Matrix4} 模型矩阵
     */
    get modelMatrix() {
        return this._modelMatrix;
    }

    /**
     * 触发模型矩阵变更事件并调用对应回调。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    raiseModelMatrixChangeEvent(modelMatrix) {
        this._modelMatrixChanged.raiseEvent(modelMatrix);
        this.onModelMatrixChanged(modelMatrix);
    }

    /**
     * 模型矩阵发生变更时的回调钩子，子类可重写。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    onModelMatrixChanged(modelMatrix) { }

    /**
     * 销毁实例时清理资源，清空模型矩阵变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._modelMatrixChanged.clear();
        super.onDestroy();
    }
}

/**
 * 惰性创建宿主对象的内部变换对象 ModelMatrixTransforms（仅创建一次），并绑定属性/矩阵变更回调与旋转参考系类型。
 * @param {object} that 宿主对象
 * @param {function} [onPropertyValueChanged] 属性变更回调函数
 * @param {function} [onModelMatrixChanged] 模型矩阵变更回调函数
 * @param {number} [rotationFrameType] 旋转参考系类型，取值参考 RotationFrameType
 * @returns {void}
 */
function ensureTransforms(that, onPropertyValueChanged, onModelMatrixChanged, rotationFrameType) {
    if (!that._transforms) {
        if (!onPropertyValueChanged)
            onPropertyValueChanged = that.onPropertyValueChanged;
        if (!onModelMatrixChanged)
            onModelMatrixChanged = that.onModelMatrixChanged;
        if (onPropertyValueChanged)
            onPropertyValueChanged = onPropertyValueChanged.bind(that);
        if (onModelMatrixChanged)
            onModelMatrixChanged = onModelMatrixChanged.bind(that);
        that._transforms = new ModelMatrixTransforms({
            owner: that,
            onPropertyValueChanged: onPropertyValueChanged,
            onModelMatrixChanged: onModelMatrixChanged,
        });
        that._transforms.undeletable = true;
        if (defined$1(rotationFrameType))
            that._transforms.rotationFrameType = rotationFrameType;
    }
}

/**
 * 为目标对象动态定义一整套模型矩阵变换相关的属性与方法（位置、地理坐标、平移、旋转、欧拉角、四元数、缩放、前后置变换矩阵、模型矩阵等），
 * 内部委托给惰性创建的 ModelMatrixTransforms 实例实现，并根据目标类型追加 3DTileset / Model 专属属性。
 * @param {object} target 目标对象（通常是类的 prototype 或实例）
 * @param {function} [onPropertyValueChanged] 属性变更回调函数
 * @param {function} [onModelMatrixChanged] 模型矩阵变更回调函数
 * @param {number} [rotationFrameType] 旋转参考系类型，取值参考 RotationFrameType
 * @returns {void}
 */
function defineModelMatrixTransformsProperties(target, onPropertyValueChanged, onModelMatrixChanged, rotationFrameType) {

    let is3DTileset, isModel;
    if (target.is3DTileset || target.isCesium3DTileset) {
        is3DTileset = true;
    } else if (target.isModel) {
        isModel = true;
    }

    Object.defineProperties(target, {
        // 变换对象与旋转参考系、批量设置变换入口
        transforms: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureTransforms(this, onPropertyValueChanged, onModelMatrixChanged, rotationFrameType);
                return this._transforms;
            }
        },
        rotationFrameType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.transforms.rotationFrameType;
            }
        },
        setTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (transforms) {
                this.transforms.setTransforms(transforms);
            },
        },
        // 世界坐标位置相关属性与方法（position 及 setGeographic / translateLongitude 等地理坐标操作）
        position: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.position = value;
            },
            get: function () {
                return this.transforms.position;
            }
        },
        geographic: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.geographic = value;
            },
            get: function () {
                return this.transforms.geographic;
            }
        },
        setGeographic: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (longitude, latitude, altitude, degrees) {
                this.transforms.setGeographic(longitude, latitude, altitude, degrees);
            }
        },
        translateLongitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.translateLongitude(value, degrees);
            },
        },
        translateLatitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.translateLatitude(value, degrees);
            },
        },
        translateAltitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.translateAltitude(value, degrees);
            },
        },
        // 本地坐标系平移相关属性与方法（translation 及 translate / translateX 等）
        translation: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.translation = value;
            },
            get: function () {
                return this.transforms.translation;
            }
        },
        setTranslation: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z) {
                this.transforms.setTranslation(x, y, z);
            }
        },
        translate: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z, local) {
                this.transforms.translate(x, y, z, local);
            },
        },
        translateOnAxis: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (axis, distance, local) {
                this.transforms.translateOnAxis(axis, distance, local);
            },
        },
        translateX: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, local) {
                this.transforms.translateX(value, local);
            },
        },
        translateY: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, local) {
                this.transforms.translateY(value, local);
            },
        },
        translateZ: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, local) {
                this.transforms.translateZ(value, local);
            },
        },
        // 旋转相关属性与方法（rotation / attitude / euler / quaternion 及 rotateX 等旋转操作）
        rotation: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.rotation = value;
            },
            get: function () {
                return this.transforms.rotation;
            }
        },
        rotationDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.rotationDegrees = value;
            },
            get: function () {
                return this.transforms.rotationDegrees;
            }
        },
        setRotation: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (heading, pitch, roll, degrees) {
                this.transforms.setRotation(heading, pitch, roll, degrees);
            }
        },
        attitude: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.attitude = value;
            },
            get: function () {
                return this.transforms.attitude;
            }
        },
        setAttitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (yaw, pitch, roll) {
                this.transforms.setAttitude(yaw, pitch, roll);
            }
        },
        euler: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.euler = value;
            },
            get: function () {
                return this.transforms.euler;
            }
        },
        eulerDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.eulerDegrees = value;
            },
            get: function () {
                return this.transforms.eulerDegrees;
            }
        },
        setEuler: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z, degrees) {
                this.transforms.setEuler(x, y, z, degrees);
            }
        },
        rotate: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (heading, pitch, roll, degrees) {
                this.transforms.rotate(heading, pitch, roll, degrees);
            },
        },
        rotateByEuler: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z, degrees) {
                this.transforms.rotateByEuler(x, y, z, degrees);
            },
        },
        rotateOnAxis: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (axis, value, degrees) {
                this.transforms.rotateOnAxis(axis, value, degrees);
            },
        },
        rotateHeading: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateHeading(value, degrees);
            },
        },
        rotatePitch: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotatePitch(value, degrees);
            },
        },
        rotateRoll: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateRoll(value, degrees);
            },
        },
        rotateX: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateX(value, degrees);
            },
        },
        rotateY: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateY(value, degrees);
            },
        },
        rotateZ: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateZ(value, degrees);
            },
        },
        quaternion: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.quaternion = value;
            },
            get: function () {
                return this.transforms.quaternion;
            }
        },
        // 缩放属性与方法
        setScale: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z) {
                this.transforms.setScale(x, y, z);
            }
        },
        // 固定坐标系矩阵、本地变换矩阵与前置/后置变换矩阵
        fixedFrameMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.transforms.fixedFrameMatrix;
            },
        },
        localTransformMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.transforms.localTransformMatrix;
            },
        },
        beforeTransformMatrix: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.beforeTransformMatrix = value;
            },
            get: function () {
                return this.transforms.beforeTransformMatrix;
            }
        },
        afterTransformMatrix: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.afterTransformMatrix = value;
            },
            get: function () {
                return this.transforms.afterTransformMatrix;
            }
        },
        getActualPosition: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (result) {
                return this.transforms.getActualPosition(result);
            },
        },
        //private
        _updateModelMatrixTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                return this.transforms.update(frameState);
            },
        },
        //private
        _destroyModelMatrixTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.transforms.destroy();
            },
        },
    });

    // 3DTileset 类型：追加 scale 与 updateRootTransform
    if (is3DTileset) {
        Object.defineProperties(target, {
            scale: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.scale = value;
                },
                get: function () {
                    return this.transforms.scale;
                }
            },
            updateRootTransform: {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (force) {
                    return this.transforms.updateModelMatrix(force);
                },
            },
        });
    // Model 类型：追加 scale3 与 updateModelMatrix
    } else if (isModel) {
        Object.defineProperties(target, {
            scale3: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.scale = value;
                },
                get: function () {
                    return this.transforms.scale;
                }
            },
            updateModelMatrix: {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (force) {
                    return this.transforms.updateModelMatrix(force);
                },
            },
        });
    // 通用类型：追加 scale、modelMatrix 及模型矩阵变更事件等
    } else {
        Object.defineProperties(target, {
            scale: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.scale = value;
                },
                get: function () {
                    return this.transforms.scale;
                }
            },
            modelMatrix: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.modelMatrix = value;
                },
                get: function () {
                    return this.transforms.modelMatrix;
                },
            },
            computedModelMatrix: {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.modelMatrix;
                }
            },
            modelMatrixChanged: {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.transforms.modelMatrixChanged;
                }
            },
            /**
             * @deprecated use modelMatrixChanged instead
             */
            modelMatrixChangeEvent: {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.transforms.modelMatrixChangeEvent;
                },
            },
            needsUpdateModelMatrix: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.needsUpdateModelMatrix = value;
                },
                get: function () {
                    return this.transforms.needsUpdateModelMatrix;
                }
            },
            updateModelMatrix: {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (force) {
                    return this.transforms.updateModelMatrix(force);
                },
            },
        });
        if ('onModelMatrixChanged' in target === false) {
            Object.defineProperty(target, 'onModelMatrixChanged', {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (modelMatrix) {
                    this.raisePropertyChangeEvent('modelMatrix', modelMatrix, PropertyType.MODELMATRIX);
                }
            });
        }
    }
}

/**
 * 变换图元基类，继承自 BasePrimitive。
 * 通过 defineModelMatrixTransformsProperties 混入位置、旋转、缩放等模型矩阵变换能力，
 * 在每帧更新时同步变换矩阵，供需要按变换方式定位的图元复用。
 */
class TransformsPrimitive extends BasePrimitive {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 初始化图元并应用传入的变换配置。
     * @param {object} options 配置项，包含位置、旋转、缩放等变换参数
     * @returns {void}
     */
    _init(options) {
        super._init(options);

        this.setTransforms(options);
    }

    /**
     * 每帧更新钩子，委托给内部变换对象更新模型矩阵。
     * @param {FrameState} frameState 帧状态对象
     * @returns {void}
     */
    onUpdate(frameState) {
        this._updateModelMatrixTransforms(frameState);
    }

    /**
     * 销毁实例时清理变换相关资源并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._destroyModelMatrixTransforms();
        super.onDestroy();
    }
}
// 将模型矩阵变换相关属性（position/geographic/translation/rotation/euler/quaternion/scale/modelMatrix 等）混入原型
defineModelMatrixTransformsProperties(TransformsPrimitive.prototype);

/**
 * 形状类型枚举。
 * @constant
 */
const ShapeType = Object.freeze({
    PointCloud: 'PointCloud',
    Mesh: 'Mesh',
    //Shape
    Box: 'Box',
    Cylinder: 'Cylinder',
    Ellipsoid: 'Ellipsoid',
    Plane: 'Plane',
    Straightline: 'Straightline',
    Text3D: 'Text3D',
    Frustum: 'Frustum',
    OrthographicFrustum: 'OrthographicFrustum',
    PerspectiveFrustum: 'PerspectiveFrustum',
    //GroundShape
    Circle: 'Circle',
    Corridor: 'Corridor',
    Ellipse: 'Ellipse',
    Polygon: 'Polygon',
    Polyline: 'Polyline',
    PolylineOutline: 'PolylineOutline',
    PolylineArrow: 'PolylineArrow',
    PolylineDash: 'PolylineDash',
    PolylineGlow: 'PolylineGlow',
    PolylineTrail: 'PolylineTrail',
    PolylineVolume: 'PolylineVolume',
    Rectangle: 'Rectangle',
    SimplePolyline: 'SimplePolyline',
    Route: 'Route',
    /**
     * @deprecated 请使用Route替换Sparseline
    */
    Sparseline: 'Sparseline',
    Wall: 'Wall',
    Water: 'Water',
    //Plot
    StraightArrow: 'StraightArrow',
    AttackArrow: 'AttackArrow',
    PincerArrow: 'PincerArrow',
    //CombinedShape
    CombinedShape: 'CombinedShape',
    MultipleCircle: 'MultipleCircle',
    PolygonPolyline: 'PolygonPolyline',
    PolygonPolylineOutline: 'PolygonPolylineOutline',
    PolygonPolylineDash: 'PolygonPolylineDash',
    PolygonPolylineGlow: 'PolygonPolylineGlow',
    PolygonPolylineTrail: 'PolygonPolylineTrail',
    CirclePolyline: 'CirclePolyline',
    CirclePolylineOutline: 'CirclePolylineOutline',
    CirclePolylineDash: 'CirclePolylineDash',
    CirclePolylineGlow: 'CirclePolylineGlow',
    CirclePolylineTrail: 'CirclePolylineTrail',
    RectanglePolyline: 'RectanglePolyline',
    RectanglePolylineOutline: 'RectanglePolylineOutline',
    RectanglePolylineDash: 'RectanglePolylineDash',
    RectanglePolylineGlow: 'RectanglePolylineGlow',
    RectanglePolylineTrail: 'RectanglePolylineTrail',
});

/**
 * 给目标对象定义外观相关属性（flat、faceForward、cullFace、shadows）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @param {boolean} [isFill] 是否为填充外观，用于区分属性变更事件类型，默认为 false
 * @returns {void}
 */
function defineAppearanceProperties(target, isFill = false) {

    Object.defineProperties(target, {
        // 平面化与面朝向属性
        flat: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('flat', value);
                if (this._flat !== value) {
                    this._flat = value;
                    this.raisePropertyChangeEvent('flat', value, isFill ? PropertyType.FILLAPPEARANCE : PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined$1(this._flat))
                    this._flat = false;
                return this._flat;
            }
        },
        faceForward: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('faceForward', value);
                if (this._faceForward !== value) {
                    this._faceForward = value;
                    this.raisePropertyChangeEvent('faceForward', value, isFill ? PropertyType.FILLAPPEARANCE : PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined$1(this._faceForward))
                    this._faceForward = true;
                return this._faceForward;
            }
        },
        // 面剔除与阴影属性
        cullFace: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseCullFace(value);
                if (this._cullFace !== value) {
                    this._cullFace = value;
                    this.raisePropertyChangeEvent('cullFace', value, isFill ? PropertyType.FILLAPPEARANCE : PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined$1(this._cullFace))
                    this._cullFace = CullFace.NONE;
                return this._cullFace;
            }
        },
        shadows: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseShadowMode(value);
                if (this._shadows !== value) {
                    this._shadows = value;
                    this.raisePropertyChangeEvent('shadows', value, isFill ? PropertyType.FILLPRIMITIVE : PropertyType.PRIMITIVE);
                }
            },
            get: function () {
                return this._shadows;
            }
        },
    });

}

/**
 * 给目标对象定义基础形状通用属性（id、pickId、show、形状类型、几何图元类型、距离显示条件、深度测试、异步创建及 getGeometryOptions 等）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineBaseShapeProperties(target) {

    // 唯一标识与拾取标识
    if ('id' in target === false) {
        Object.defineProperty(target, 'id', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (this._id !== value)
                    this._id = value;
            },
            get: function () {
                return this._id;
            }
        });
    }

    if ('pickId' in target === false) {
        Object.defineProperty(target, 'pickId', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (this._pickId !== value)
                    this._pickId = value;
            },
            get: function () {
                return this._pickId;
            }
        });
    }

    // if ('pickPrimitive' in target === false) {
    //     Object.defineProperty(target, 'pickPrimitive', {
    //         configurable: true,
    //         set: function (value) {
    //             if (this._pickPrimitive !== value)
    //                 this._pickPrimitive = value;
    //         },
    //         get: function () {
    //             return this._pickPrimitive || this;
    //         }
    //     });
    // }

    // 可见性
    if ('show' in target === false) {
        Object.defineProperty(target, 'show', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('show', value);
                if (this._show !== value) {
                    this._show = value;
                    this.raisePropertyChangeEvent('show', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this._show;
            }
        });
    }

    Object.defineProperties(target, {
        // 形状类型与几何图元类型
        shapeType: {
            enumerable: true,
            configurable: true,
            get: function () {
                throw new RuntimeError('shapeType property must be overwrite.');
            }
        },
        primitiveGeometricType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PrimitiveType.TRIANGLES
            },
        },
        // 距离显示条件
        distanceDisplayCondition: {
            configurable: true,
            set: function (value) {
                value = parseToDistanceDisplayCondition(value);
                if (!DistanceDisplayCondition.equals(value, this._distanceDisplayCondition)) {
                    this._distanceDisplayCondition = value.clone(this._distanceDisplayCondition);
                    this.raisePropertyChangeEvent('distanceDisplayCondition', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this._distanceDisplayCondition;
            }
        },
        // 深度测试与异步创建
        depthTest: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('depthTest', value);
                if (this._depthTest !== value) {
                    this._depthTest = value;
                    this.raisePropertyChangeEvent('depthTest', value, PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined$1(this._depthTest))
                    this._depthTest = true;
                return this._depthTest;
            }
        },
        asynchronous: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('asynchronous', value);
                if (this._asynchronous !== value) {
                    this._asynchronous = value;
                    this.raisePropertyChangeEvent('asynchronous', PropertyType.PRIMITIVE);
                }
            },
            get: function () {
                if (!defined$1(this._asynchronous))
                    this._asynchronous = true;
                return this._asynchronous;
            }
        },
        // 几何体参数生成方法（须由子类覆盖实现）
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                throw new DeveloperError('getGeometryOptions function must be overwrite.');
            }
        }
    });

}

/**
 * 给目标对象定义长方体（Box）形状相关属性（形状类型、尺寸、几何体参数生成方法、fill/outline 几何体与几何类型）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineBoxProperties(target) {

    Object.defineProperties(target, {
        // 形状类型
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Box,
        },
        // 尺寸相关属性（dimensions 及宽/高/深快捷属性）
        dimensions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value);
                if (!Cartesian3.equals(value, this._dimensions)) {
                    this._dimensions = value.clone(this._dimensions);
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('dimensions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!this._dimensions) {
                    this._dimensions = new Cartesian3(1, 1, 1);
                }
                return this._dimensions;
            }
        },
        width: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('width', value, 0);
                if (this.width !== value) {
                    this._dimensions.x = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('width', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.dimensions.x;
            }
        },
        height: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('height', value, 0);
                if (this.height !== value) {
                    this._dimensions.y = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('height', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.dimensions.y;
            }
        },
        depth: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('depth', value, 0);
                if (this.depth !== value) {
                    this._dimensions.z = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('depth', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.dimensions.z;
            }
        },
        // 几何体参数生成方法
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this.needsUpdateGeometryOptions || !this._geometryOptions) {
                    this._geometryOptions = {
                        dimensions: this.dimensions,
                    };
                    this.needsUpdateGeometryOptions = false;
                }
                return this._geometryOptions;
            }
        },
        // 几何体生成方法（填充体与轮廓线）
        getFillGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return BoxGeometry.fromDimensions(this.getGeometryOptions());
            }
        },
        getOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return BoxOutlineGeometry.fromDimensions(this.getGeometryOptions());
            }
        },
        // fill/outline 几何类型
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return BoxGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return BoxOutlineGeometry
            },
        },
    });

}

/**
 * 给目标对象定义中心点相关属性（笛卡尔坐标 center 与经纬度地理坐标 centerGeographic）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineCenterProperties(target) {

    Object.defineProperties(target, {
        // 中心点（笛卡尔坐标）
        center: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                if (!Cartesian3.equals(value, this._center)) {
                    this._center = value.clone(this._center);
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('center', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._center;
            }
        },
        // 中心点（经纬度地理坐标）
        centerGeographic: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.center = parseGeographicToCartesian(value, Scratch.scratchGeographic, this.ellipsoid);
            },
            get: function () {
                return this._center ? this._center.toGeographic(this.ellipsoid) : undefined;
            }
        },
    });

}

/**
 * 给目标对象定义贴地相关属性（clampToGround、clampToGroundBatchId，以及可选的轮廓线宽度 outlineWidth）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @param {boolean} [defineOutlineWidth] 是否同时定义 outlineWidth 属性，默认为 true
 * @returns {void}
 */
function defineClampToGroundProperties(target, defineOutlineWidth = true) {

    Object.defineProperties(target, {
        // 贴地相关属性
        clampToGround: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('clampToGround', value);
                if (this._clampToGround !== value) {
                    this._clampToGround = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('clampToGround', value, PropertyType.PRIMITIVE);
                }
            },
            get: function () {
                return this._clampToGround;
            }
        },
        clampToGroundBatchId: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (this._clampToGroundBatchId !== value) {
                    this._clampToGroundBatchId = value;
                    this.raisePropertyChangeEvent('clampToGroundBatchId', value);
                }
            },
            get: function () {
                return this._clampToGroundBatchId ?? this.id;
            }
        },
    });

    // 轮廓线宽度
    if (defineOutlineWidth)
        Object.defineProperty(target, 'outlineWidth', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('outlineWidth', value, 0);
                if (this._outlineWidth !== value) {
                    this._outlineWidth = value;
                    this.raisePropertyChangeEvent('outlineWidth', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this._outlineWidth;
            }
        });

}

/**
 * 惰性创建宿主对象的内部计算模型矩阵（仅创建一次），初始为单位矩阵。
 * @param {object} that 宿主对象
 * @returns {void}
 */
function ensureComputedModelMatrix(that) {
    if (!that._computedModelMatrix) {
        that._computedModelMatrix = Matrix4.IDENTITY.clone();
    }
}

/**
 * 惰性创建宿主对象的计算模型矩阵变更事件对象（仅创建一次）。
 * @param {object} that 宿主对象
 * @returns {void}
 */
function ensureComputedModelMatrixChangeEvent(that) {
    if (!that._computedModelMatrixChangeEvent) {
        that._computedModelMatrixChangeEvent = new Event();
    }
}

/**
 * 给目标对象定义计算模型矩阵相关属性与方法（computedModelMatrix、变更事件、变更触发，
 * 以及 onComputeModelMatrix / onComputedModelMatrixChanged 可覆盖钩子）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineComputedModelMatrixProperties(target) {

    Object.defineProperties(target, {
        // 计算模型矩阵及其变更事件
        computedModelMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureComputedModelMatrix(this);
                return this._computedModelMatrix;
            },
        },
        computedModelMatrixChangeEvent: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureComputedModelMatrixChangeEvent(this);
                return this._computedModelMatrixChangeEvent;
            },
        },
        // 触发计算模型矩阵变更事件并回调
        raiseComputedModelMatrixChangeEvent: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (computedModelMatrix) {
                this.computedModelMatrixChangeEvent.raiseEvent(this, computedModelMatrix);
                this.onComputedModelMatrixChanged(computedModelMatrix);
            },
        },
        // 模型矩阵变化时标记需要重新计算
        onModelMatrixChanged: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (modelMatrix) {
                this.needsUpdateComputedModelMatrix = true;
            },
        },
        //private
        _updateComputedModelMatrix: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                if (this.needsUpdateComputedModelMatrix) {
                    this.onComputeModelMatrix(this.modelMatrix);
                    this.raiseComputedModelMatrixChangeEvent(this.computedModelMatrix);
                    this.needsUpdateComputedModelMatrix = false;
                    return true;
                }
            }
        },
    });

    // 计算模型矩阵的可覆盖钩子（计算逻辑与计算完成回调）
    if ('onComputeModelMatrix' in target === false)
        Object.defineProperty(target, 'onComputeModelMatrix', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (modelMatrix) { },
        });
    if ('onComputedModelMatrixChanged' in target === false)
        Object.defineProperty(target, 'onComputedModelMatrixChanged', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (computedModelMatrix) {
                this.raisePropertyChangeEvent('computedModelMatrix', computedModelMatrix, PropertyType.MODELMATRIX);
            },
        });

}

/**
 * 给目标对象定义圆柱（Cylinder）形状相关属性（形状类型、半径与长度、细分参数、几何体参数生成方法、fill/outline 几何类型）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineCylinderProperties(target) {

    Object.defineProperties(target, {
        // 形状类型
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Cylinder,
        },
        // 半径与长度相关属性
        topRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('topRadius', value, 0);
                if (this._topRadius !== value) {
                    this._topRadius = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('topRadius', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._topRadius)) {
                    this._topRadius = 1;
                }
                return this._topRadius;
            }
        },
        bottomRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('bottomRadius', value, 0);
                if (this._bottomRadius !== value) {
                    this._bottomRadius = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('bottomRadius', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._bottomRadius)) {
                    this._bottomRadius = 1;
                }
                return this._bottomRadius;
            }
        },
        radius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.topRadius = value;
                this.bottomRadius = value;
            }
        },
        length: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('length', value, 0);
                if (this._length !== value) {
                    this._length = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('length', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._length)) {
                    this._length = 1;
                }
                return this._length;
            }
        },
        // 细分参数
        slices: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('slices', value, 3);
                if (this._slices !== value) {
                    this._slices = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('slices', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._slices))
                    this._slices = 64;
                return this._slices;
            }
        },
        numberOfVerticalLines: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('numberOfVerticalLines', value, 0);
                if (this._numberOfVerticalLines !== value) {
                    this._numberOfVerticalLines = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('numberOfVerticalLines', value, PropertyType.OUTLINEGEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._numberOfVerticalLines))
                    this._numberOfVerticalLines = 0;
                return this._numberOfVerticalLines;
            }
        },
        // 几何体参数生成方法
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this.needsUpdateGeometryOptions || !this._geometryOptions) {
                    this._geometryOptions = {
                        topRadius: this.topRadius,
                        bottomRadius: this.bottomRadius,
                        length: this.length,
                        slices: this.slices,
                        numberOfVerticalLines: this.numberOfVerticalLines,
                    };

                    this.needsUpdateGeometryOptions = false;
                }
                return this._geometryOptions;
            }
        },
        // fill/outline 几何类型
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return CylinderGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return CylinderOutlineGeometry
            },
        },
    });

}

/**
 * 惰性创建宿主对象的半径向量（仅创建一次），初始为 (1, 1, 1)。
 * @param {object} that 宿主对象
 * @returns {void}
 */
function ensureRadii(that) {
    if (!that._radii)
        that._radii = new Cartesian3(1, 1, 1);
}

/**
 * 给目标对象定义椭球（Ellipsoid）形状相关属性（形状类型、外/内半径、时钟角与锥角范围、细分参数、几何体参数生成方法、fill/outline 几何类型）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineEllipsoidProperties(target) {

    Object.defineProperties(target, {
        // 形状类型
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Ellipsoid,
        },
        // 外半径相关属性（radii 及 x/y/z 半径快捷属性）
        radii: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3);
                if (!Cartesian3.equals(value, this._radii)) {
                    this._radii = value.clone(this._radii);
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                ensureRadii(this);
                return this._radii;
            }
        },
        radius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('radius', value, 0);
                this.radii = new Cartesian3(value, value, value);
            }
        },
        xRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('xRadius', value, 0);
                if (this.radii.x !== value) {
                    this.radii.x = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.radii.x;
            }
        },
        yRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('yRadius', value, 0);
                if (this.radii.y !== value) {
                    this.radii.y = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.radii.y;
            }
        },
        zRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('zRadius', value, 0);
                if (this.radii.z !== value) {
                    this.radii.z = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.radii.z;
            }
        },
        // 内半径（挖空）相关属性
        innerRadii: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (defined$1(value)) {
                    value = parseToCartesian3(value, Scratch.scratchCartesian3);
                    if (!Cartesian3.equals(value, this._innerRadii)) {
                        this._innerRadii = value.clone(this._innerRadii);
                        this.needsUpdateGeometryOptions = true;
                        this.raisePropertyChangeEvent('innerRadii', value, PropertyType.GEOMETRY);
                    }
                } else {
                    if (this._innerRadii !== value) {
                        this._innerRadii = undefined;
                        this.needsUpdateGeometryOptions = true;
                        this.raisePropertyChangeEvent('innerRadii', value, PropertyType.GEOMETRY);
                    }
                }
            },
            get: function () {
                return this._innerRadii;
            }
        },
        innerRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('innerRadius', value, 0);
                this.innerRadii = new Cartesian3(value, value, value);
            }
        },
        // 时钟角范围（弧度与角度两种表达）
        minimumClock: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumClock', value);
                if (this._minimumClock !== value) {
                    this._minimumClock = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('minimumClock', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._minimumClock;
            }
        },
        minimumClockDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumClockDegrees', value);
                this.minimumClock = Math$1.toRadians(value);
            },
            get: function () {
                if (defined$1(this._minimumClock))
                    return Math$1.toDegrees(this._minimumClock);
            }
        },
        maximumClock: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumClock', value);
                if (this._maximumClock !== value) {
                    this._maximumClock = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('maximumClock', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._maximumClock;
            }
        },
        maximumClockDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumClockDegrees', value);
                this.maximumClock = Math$1.toRadians(value);
            },
            get: function () {
                if (defined$1(this._maximumClock))
                    return Math$1.toDegrees(this._maximumClock);
            }
        },
        // 锥角范围（弧度与角度两种表达）
        minimumCone: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumCone', value);
                if (this._minimumCone !== value) {
                    this._minimumCone = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('minimumCone', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._minimumCone;
            }
        },
        minimumConeDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumConeDegrees', value);
                this.minimumCone = Math$1.toRadians(value);
            },
            get: function () {
                if (defined$1(this._minimumCone))
                    return Math$1.toDegrees(this._minimumCone);
            }
        },
        maximumCone: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumCone', value);
                if (this._maximumCone !== value) {
                    this._maximumCone = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('maximumCone', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._maximumCone;
            }
        },
        maximumConeDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumConeDegrees', value);
                this.maximumCone = Math$1.toRadians(value);
            },
            get: function () {
                if (defined$1(this._maximumCone))
                    return Math$1.toDegrees(this._maximumCone);
            }
        },
        // 细分参数
        slicePartitions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('slicePartitions', value, 3);
                if (this._slicePartitions !== value) {
                    this._slicePartitions = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('slicePartitions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._slicePartitions))
                    this._slicePartitions = 64;
                return this._slicePartitions;
            }
        },
        stackPartitions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('stackPartitions', value, 3);
                if (this._stackPartitions !== value) {
                    this._stackPartitions = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('stackPartitions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._stackPartitions))
                    this._stackPartitions = 32;
                return this._stackPartitions;
            }
        },
        subdivisions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('subdivisions', value, 0);
                if (this._subdivisions !== value) {
                    this._subdivisions = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('subdivisions', value, PropertyType.OUTLINEGEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._subdivisions))
                    this._subdivisions = 32;
                return this._subdivisions;
            }
        },
        // 几何体参数生成方法
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this.needsUpdateGeometryOptions || !this._geometryOptions) {
                    this._geometryOptions = {
                        radii: this.radii,
                        innerRadii: this._innerRadii,
                        minimumClock: this._minimumClock,
                        maximumClock: this._maximumClock,
                        minimumCone: this._minimumCone,
                        maximumCone: this._maximumCone,
                        slicePartitions: this.slicePartitions,
                        stackPartitions: this.stackPartitions,
                        subdivisions: this.subdivisions,
                    };

                    this.needsUpdateGeometryOptions = false;
                }
                return this._geometryOptions;
            }
        },
        // fill/outline 几何类型
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return EllipsoidGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return EllipsoidOutlineGeometry
            },
        },
    });
}

/**
 * 给目标对象定义标签（Label）相关属性（类型标识、位置与地理坐标、对齐原点、文本样式、填充/轮廓/背景颜色与透明度、
 * 距离相关的显示控制，以及内部标签销毁方法）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineLabelProperties(target) {

    Object.defineProperties(target, {
        // 类型标识与拾取
        isLabel: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: true,
        },
        pickPrimitve: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this;
            }
        },
        // 唯一标识
        id: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this._label.id;
            },
            set: function (value) {
                this._label.id = value;
            }
        },
        // 可见性与位置相关属性
        show: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('show', value);
                if (this.show !== value) {
                    this._show = value;
                    this._label.show = value;
                    this.raisePropertyChangeEvent('show', value);
                }
            },
            get: function () {
                if (!defined$1(this._show))
                    this._show = this._label.show;
                return this._label.show;
            }
        },
        position: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                if (!Cartesian3.equals(value, this.position)) {
                    this._label.position = value;
                    this.raisePropertyChangeEvent('position', value);
                }
            },
            get: function () {
                return this._label.position;
            }
        },
        geographic: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseGeographicToCartesian(value, Scratch.scratchCartesian3, this.ellipsoid);
                this.position = value;
            },
            get: function () {
                return this.position.toGeographic(this.ellipsoid);
            }
        },
        heightReference: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseHeightReference(value);
                if (this.heightReference !== value) {
                    this._label.heightReference = value;
                    this.raisePropertyChangeEvent('heightReference', value);
                }
            },
            get: function () {
                return this._label.heightReference;
            }
        },
        eyeOffset: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                if (!Cartesian3.equals(value, this.eyeOffset)) {
                    this._label.eyeOffset = value;
                    this.raisePropertyChangeEvent('eyeOffset', value);
                }
            },
            get: function () {
                return this._label.eyeOffset;
            }
        },
        pixelOffset: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
                if (!Cartesian2.equals(value, this.pixelOffset)) {
                    this._label.pixelOffset = value;
                    this.raisePropertyChangeEvent('pixelOffset', value);
                }
            },
            get: function () {
                return this._label.pixelOffset;
            }
        },
        pixelOffsetScaleByDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToNearFarScalar(value, Scratch.scratchNearFarScalar);
                if (!NearFarScalar.equals(value, this.pixelOffsetScaleByDistance)) {
                    this._label.pixelOffsetScaleByDistance = value;
                    this.raisePropertyChangeEvent('pixelOffsetScaleByDistance', value);
                }
            },
            get: function () {
                return this._label.pixelOffsetScaleByDistance;
            }
        },
        // 对齐原点
        horizontalOrigin: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseHorizontalOrigin(value);
                if (this.horizontalOrigin !== value) {
                    this._label.horizontalOrigin = value;
                    this.raisePropertyChangeEvent('horizontalOrigin', value);
                }
            },
            get: function () {
                return this._label.horizontalOrigin;
            }
        },
        verticalOrigin: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseVerticalOrigin(value);
                if (this.verticalOrigin !== value) {
                    this._label.verticalOrigin = value;
                    this.raisePropertyChangeEvent('verticalOrigin', value);
                }
            },
            get: function () {
                return this._label.verticalOrigin;
            }
        },
        // 文本样式与缩放属性
        text: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.string('text', value);
                if (this.text !== value) {
                    this._label.text = value;
                    this.raisePropertyChangeEvent('text', value);
                }
            },
            get: function () {
                return this._label.text;
            }
        },
        font: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.string('font', value);
                if (this.font !== value) {
                    this._label.font = value;
                    this.raisePropertyChangeEvent('font', value);
                }
            },
            get: function () {
                return this._label.font;
            }
        },
        style: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseLabelStyle(value);
                if (this.style !== value) {
                    this._label.style = value;
                    this.raisePropertyChangeEvent('style', value);
                }
            },
            get: function () {
                return this._label.style;
            }
        },
        scale: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('scale', value);
                if (this.scale !== value) {
                    this._label.scale = value;
                    this.raisePropertyChangeEvent('scale', value);
                }
            },
            get: function () {
                return this._label.scale;
            }
        },
        scaleByDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToNearFarScalar(value, Scratch.scratchNearFarScalar);
                if (!NearFarScalar.equals(value, this.scaleByDistance)) {
                    this._label.scaleByDistance = value;
                    this.raisePropertyChangeEvent('scaleByDistance', value);
                }
            },
            get: function () {
                return this._label.scaleByDistance;
            }
        },
        // 填充颜色与透明度
        fillColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value, Scratch.scratchColor);
                if (!Color.equalsRgb(value, this.fillColor)) {
                    value.alpha = this.fillColor.alpha;
                    this._label.fillColor = value;
                    this.raisePropertyChangeEvent('fillColor', value);
                }
            },
            get: function () {
                return this._label.fillColor;
            }
        },
        color: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.fillColor = value;
            },
            get: function () {
                return this.fillColor;
            }
        },
        fillOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('fillOpacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('fillOpacity', value, 1);
                if (this.fillOpacity !== value) {
                    const color = this.fillColor.clone(Scratch.scratchColor).withAlpha(value);
                    this._label.fillColor = color;
                    this.raisePropertyChangeEvent('fillOpacity', value);
                }
            },
            get: function () {
                return this._label.fillColor.alpha;
            }
        },
        opacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.fillOpacity = value;
            },
            get: function () {
                return this.fillOpacity
            }
        },
        // 轮廓颜色与宽度
        outlineColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value, Scratch.scratchColor);
                if (!Color.equalsRgb(value, this.outlineColor)) {
                    value.alpha = this.outlineColor.alpha;
                    this._label.outlineColor = value;
                    this.raisePropertyChangeEvent('outlineColor', value);
                }
            },
            get: function () {
                return this._label.outlineColor;
            }
        },
        outlineOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('outlineOpacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('outlineOpacity', value, 1);
                if (this.outlineOpacity !== value) {
                    const color = this.outlineColor.clone(Scratch.scratchColor).withAlpha(value);
                    this._label.outlineColor = color;
                    this.raisePropertyChangeEvent('outlineColor', value);
                }
            },
            get: function () {
                return this._label.outlineColor.alpha;
            }
        },
        outlineWidth: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('outlineWidth', value);
                if (this.outlineWidth !== value) {
                    this._label.outlineWidth = value;
                    this.raisePropertyChangeEvent('outlineWidth', value);
                }
            },
            get: function () {
                return this._label.outlineWidth;
            }
        },
        // 背景相关属性
        showBackground: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('showBackground', value);
                if (this.showBackground !== value) {
                    this._label.showBackground = value;
                    this.raisePropertyChangeEvent('showBackground', value);
                }
            },
            get: function () {
                return this._label.showBackground;
            }
        },
        backgroundColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value, Scratch.scratchColor);
                if (!Color.equalsRgb(value, this.backgroundColor)) {
                    value.alpha = this.backgroundColor.alpha;
                    this._label.backgroundColor = value;
                    this.raisePropertyChangeEvent('backgroundColor', value);
                }
            },
            get: function () {
                return this._label.backgroundColor;
            }
        },
        backgroundOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('backgroundOpacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('backgroundOpacity', value, 1);
                if (this.backgroundOpacity !== value) {
                    const color = this.backgroundColor.clone(Scratch.scratchColor).withAlpha(value);
                    this._label.backgroundColor = color;
                    this.raisePropertyChangeEvent('backgroundColor', value);
                }
            },
            get: function () {
                return this._label.backgroundColor.alpha;
            }
        },
        backgroundPadding: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
                if (!Cartesian2.equals(value, this.backgroundPadding)) {
                    this._label.backgroundPadding = value;
                    this.raisePropertyChangeEvent('backgroundPadding', value);
                }
            },
            get: function () {
                return this._label.backgroundPadding;
            }
        },
        // 距离相关的显示控制属性
        translucencyByDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToNearFarScalar(value, Scratch.scratchNearFarScalar);
                if (!NearFarScalar.equals(value, this.translucencyByDistance)) {
                    this._label.translucencyByDistance = value;
                    this.raisePropertyChangeEvent('translucencyByDistance', value);
                }
            },
            get: function () {
                return this._label.translucencyByDistance;
            }
        },
        distanceDisplayCondition: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToDistanceDisplayCondition(value, Scratch.scratchDistanceDisplayCondition);
                if (!DistanceDisplayCondition.equals(value, this.distanceDisplayCondition)) {
                    this._label.distanceDisplayCondition = value;
                    this.raisePropertyChangeEvent('distanceDisplayCondition', value);
                }
            },
            get: function () {
                return this._label.distanceDisplayCondition;
            }
        },
        disableDepthTestDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('disableDepthTestDistance', value);
                if (this.disableDepthTestDistance !== value) {
                    this._label.disableDepthTestDistance = value;
                    this.raisePropertyChangeEvent('disableDepthTestDistance', value);
                }
            },
            get: function () {
                return this._label.disableDepthTestDistance;
            }
        },
        //private
        _destroyInnerLabel: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this._label && !isDestroyed(this._label)) {
                    this._label._removeFromCollection();
                    destroyObject$1(this._label);
                }
            }
        },
    });

}

/**
 * 为目标对象动态定义网格（Mesh）类型的属性（形状类型、几何数据、线框开关及其颜色/透明度别名、几何获取方法等）。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineMeshProperties(target) {

    Object.defineProperties(target, {
        // 基础类型标识与异步标志
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Mesh,
        },
        asynchronous: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: false,
        },
        // 几何数据（变更时标记 needsUpdateGeometry 待更新）
        geometry: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.defined('geometry', value);
                if (this._geometry !== value) {
                    this._geometry = value;
                    this.needsUpdateGeometry = true;
                }
            },
            get: function () {
                return this._geometry;
            }
        },
        // 线框开关及其颜色/透明度（别名到 outline 系列属性）
        wireframe: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.outline = value;
            },
            get: function () {
                return this.outline;
            }
        },
        wireframeColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.outlineColor = value;
            },
            get: function () {
                return this.outlineColor;
            }
        },
        wireframeOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.outlineOpacity = value;
            },
            get: function () {
                return this.outlineOpacity;
            }
        },
        // 填充几何与线框几何的获取/创建方法（别名）
        getFillGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.fillGeometry;
            }
        },
        createFillGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.fillGeometry;
            }
        },
        getOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        createOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        getWireframeGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        createWireframeGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        //private
        _updateGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                if (!defined$1(this._geometry))
                    return;
                if (this.needsUpdateGeometry) {
                    this.fillGeometry = createGeometry(this._geometry);
                    this.wireframeGeometry = this.fillGeometry.clone().toWireframe();

                    this.needsUpdateGeometry = false;
                    this.raisePropertyChangeEvent('geometry', this._geometry, PropertyType.GEOMETRY);
                }
            }
        },
    });

}

/**
 * 为目标对象动态定义轮廓（outline）相关属性（开关、颜色、透明度、轮廓几何类型及轮廓几何/几何实例的创建方法等）。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineOutlineProperties(target) {

    Object.defineProperties(target, {
        // 轮廓开关、显示判定、颜色与透明度
        outline: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('outline', value);
                if (this._outline !== value) {
                    this._outline = value;
                    this.raisePropertyChangeEvent('outline', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined$1(this._outline))
                    this._outline = false;
                return this._outline;
            }
        },
        outlineShowing: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.show && this.outline;
            }
        },
        outlineColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value);
                if (!Color.equalsRgb(this.outlineColor, value)) {
                    this._outlineColor = value.cloneRgb(this._outlineColor);
                    this.raisePropertyChangeEvent('outlineColor', this._outlineColor, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!this._outlineColor)
                    this._outlineColor = Color.BLACK.clone();
                return this._outlineColor;
            }
        },
        outlineOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('outlineOpacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('outlineOpacity', value, 1);
                if (this.outlineOpacity !== value) {
                    this.outlineColor.alpha = value;
                    this.raisePropertyChangeEvent('outlineOpacity', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this.outlineColor.alpha;
            }
        },
        // 轮廓几何类型（需子类覆盖）
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                throw new DeveloperError('outlineGeometryType property must be overwrite.');
            }
        },
        // 获取轮廓几何实例的顶点属性
        getOutlineGeometryInstanceAttributes: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return getGeometryInstanceAttributes(this.isOutlineShowing ?? this.outlineShowing, this.outlineColor, this._distanceDisplayCondition);
            }
        },
        // 生成轮廓几何、创建轮廓几何与几何实例
        getOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                const geometryOptions = this.getGeometryOptions();
                if (!geometryOptions)
                    return;
                return new this.outlineGeometryType(geometryOptions);
            }
        },
        createOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                const geometry = this.getOutlineGeometry();
                if (!geometry)
                    return;
                return this.outlineGeometryType.createGeometry(geometry);
            }
        },
        createOutlineGeometryInstance: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (enableModelMatrix = true) {
                const geometry = this.getOutlineGeometry();
                if (!geometry)
                    return;
                const attributes = this.getOutlineGeometryInstanceAttributes();
                return new GeometryInstance({
                    id: this.id,
                    pickId: this.pickId,
                    geometry: geometry,
                    attributes: attributes,
                    modelMatrix: enableModelMatrix ? this.computedModelMatrix : undefined,
                });
            }
        }
    });

    // 目标对象未提供 getGeometryOptions 时，挂载默认实现（需子类覆盖）
    if ('getGeometryOptions' in target === false) {
        Object.defineProperty(target, 'getGeometryOptions', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                throw new DeveloperError('getGeometryOptions function must be overwrite.');
            }
        });
    }

}

/**
 * 为目标对象动态定义平面（Plane）类型的属性（平面方程、尺寸、几何选项及平面几何类型等），
 * 并按需挂载模型矩阵变换与计算模型矩阵相关属性。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function definePlaneProperties(target) {
    // 按需挂载模型矩阵变换属性
    if ('_updateModelMatrixTransforms' in target === false)
        defineModelMatrixTransformsProperties(target);

    Object.defineProperties(target, {
        // 形状类型标识
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Plane,
        },
        // 平面方程：法向量与到原点的距离
        plane: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToPlane(value, Scratch.scratchPlane);
                if (!this._plane || !Plane.equals(value, this._plane)) {
                    this._plane = Plane.clone(value, this._plane);
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('plane', value);
                }
            },
            get: function () {
                if (!this._plane)
                    this._plane = new Plane(Cartesian3.UNIT_Z, 0);
                return this._plane;
            }
        },
        normal: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                value.normalize();
                if (!Cartesian3.equals(value, this.normal)) {
                    this._plane.normal = value.clone(this._plane.normal);
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('normal', value);
                }
            },
            get: function () {
                return this.plane.normal;
            }
        },
        distance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('distance', value);
                if (this.distance !== value) {
                    this._plane.distance = value;
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('distance', value);
                }
            },
            get: function () {
                return this.plane.distance;
            }
        },
        // 平面尺寸：宽高二维向量及宽/高快捷属性
        dimensions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
                if (!Cartesian2.equals(value, this._dimensions)) {
                    this._dimensions = value.clone(this._dimensions);
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('dimensions', value);
                }
            },
            get: function () {
                if (!this._dimensions) {
                    this._dimensions = new Cartesian2(1, 1);
                }
                return this._dimensions;
            }
        },
        width: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('width', value, 0);
                if (this.width !== value) {
                    this._dimensions.x = value;
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('width', value);
                }
            },
            get: function () {
                return this.dimensions.x;
            }
        },
        height: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('height', value, 0);
                if (this.height !== value) {
                    this._dimensions.y = value;
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('height', value);
                }
            },
            get: function () {
                return this.dimensions.y;
            }
        },
        // 几何构建相关：几何选项、填充/轮廓几何类型与计算模型矩阵的回调
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (!this._geometryOptions) {
                    this._geometryOptions = {};
                }
                return this._geometryOptions;
            }
        },
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PlaneGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PlaneOutlineGeometry
            },
        },
        onComputeModelMatrix: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (modelMatrix) {
                PlaneGeometryUpdater.createPrimitiveMatrix(this.plane, this.dimensions, modelMatrix, this.computedModelMatrix);
            }
        },
    });

    // 按需挂载计算模型矩阵属性
    if ('_updateComputedModelMatrix' in target === false)
        defineComputedModelMatrixProperties(target);

}

/**
 * 为目标对象动态定义点云（PointCloud）类型的属性（点位置/颜色集合、增删操作、外观样式及几何/几何实例创建方法等），
 * 并按需挂载模型矩阵变换属性。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function definePointCloudProperties(target) {

    // 按需挂载模型矩阵变换属性
    if ('_updateModelMatrixTransforms' in target === false)
        defineModelMatrixTransformsProperties(target);

    Object.defineProperties(target, {
        // 基础类型标识与图元配置（点图元、平面着色、面向前方、异步、顶点压缩）
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.PointCloud,
        },
        primitiveGeometricType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PrimitiveType.POINTS
            },
        },
        flat: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: true,
        },
        faceForward: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: true,
        },
        asynchronous: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: false,
        },
        compressVertices: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: false,
        },
        // 点数据集合：位置数组、点数量与颜色数组
        positions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.defined('positions', value);
                if (value instanceof ArrayBuffer)
                    value = new Float64Array(value);
                if (isTypedArray(value))
                    value = Cartesian3.unpackArray(value);
                else if (Array.isArray(value)) {
                    if (typeof value[0] === "number")
                        value = Cartesian3.unpackArray(value);
                }
                if (this._positions !== value) {
                    this._positions = value;
                    this.needsUpdateGeometry = true;
                    this.raisePropertyChangeEvent('positions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._positions))
                    this._positions = [];
                return this._positions;
            }
        },
        numberOfPoints: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.positions.length;
            }
        },
        colors: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.defined('colors', value);
                if (value instanceof ArrayBuffer)
                    value = new Uint8Array(value);
                if (isTypedArray(value))
                    value = Color.unpackArrayFromBytes(value);
                else if (Array.isArray(value)) {
                    if (typeof value[0] === "number")
                        value = Color.unpackArrayFromBytes(value);
                }
                if (this._colors !== value) {
                    this._colors = value;
                    this.needsUpdateGeometry = true;
                    this.raisePropertyChangeEvent('colors', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined$1(this._colors))
                    this._colors = [];
                return this._colors;
            }
        },
        // 点增删操作：添加单个/批量、按索引删除、清空
        add: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (position, color) {
                position = parseToCartesian3(position, undefined, false);
                color = color ?
                    parseToColor(color) :
                    Color.fromRandom({
                        alpha: 1.0,
                    });
                this.positions.push(position);
                const index = this.positions.lastIndexOf(position);
                this.colors[index] = color;
                this.needsUpdateGeometry = true;
                this.raisePropertyChangeEvent('positions', this.positions, PropertyType.GEOMETRY);
                this.raisePropertyChangeEvent('colors', this.colors, PropertyType.GEOMETRY);
            },
        },
        addArray: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (array) {
                Check.typeOf.array('array', array);
                array.forEach(element => {
                    this.add(element.position, element.color);
                });
            },
        },
        removeAt: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (startIndex, deleteCount = 1) {
                Check.typeOf.number('startIndex', startIndex);
                this.positions.splice(startIndex, deleteCount);
                this.colors.splice(startIndex, deleteCount);
                this.raisePropertyChangeEvent('positions', this.positions, PropertyType.GEOMETRY);
                this.raisePropertyChangeEvent('colors', this.colors, PropertyType.GEOMETRY);
            }
        },
        removeAll: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.positions.length = 0;
                this.colors.length = 0;
                this.needsUpdateGeometry = true;
                this.raisePropertyChangeEvent('positions', this.positions, PropertyType.GEOMETRY);
                this.raisePropertyChangeEvent('colors', this.colors, PropertyType.GEOMETRY);
            },
        },
        // 外观样式：整体颜色、透明度、点大小与逐顶点着色开关
        color: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value);
                if (!Color.equalsRgb(this._color, value)) {
                    this._color = value.cloneRgb(this._color);
                    this.raisePropertyChangeEvent('color', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined$1(this._color))
                    this._color = Color.DARKGRAY.clone();
                return this._color;
            }
        },
        opacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
                if (this.color.alpha !== value) {
                    this.color.alpha = value;
                    this.raisePropertyChangeEvent('opacity', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this.color.alpha;
            }
        },
        pointSize: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('pointSize', value);
                if (this._pointSize !== value) {
                    this._pointSize = value;
                    this.raisePropertyChangeEvent('pointSize', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined$1(this._pointSize))
                    this._pointSize = 3;
                return this._pointSize;
            },
        },
        perVertexColors: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('perVertexColors', value);
                if (this._perVertexColors !== value) {
                    this._perVertexColors = value;
                    this.raisePropertyChangeEvent('perVertexColors', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined$1(this._perVertexColors))
                    this._perVertexColors = true;
                return this._perVertexColors;
            }
        },
        // 几何构建：创建几何、获取几何实例属性与创建几何实例
        createGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this.needsUpdateGeometry || !this._geometry) {
                    this._geometry = createPointCloudGeometry({
                        positions: this.positions,
                        colors: this.colors,
                    });
                    this.needsUpdateGeometry = false;
                }
                return this._geometry;
            }
        },
        getGeometryInstanceAttributes: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return getGeometryInstanceAttributes(this.show, undefined, this._distanceDisplayCondition, undefined, this.pointSize, this.perVertexColors, this.color);
            }
        },
        createGeometryInstance: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (enableModelMatrix = true) {
                if (this.numberOfPoints === 0)
                    return;
                const geometry = this.createGeometry();
                const attributes = this.getGeometryInstanceAttributes();
                return new GeometryInstance({
                    id: this.id,
                    pickId: this.pickId,
                    geometry: geometry,
                    attributes: attributes,
                    modelMatrix: enableModelMatrix ? this.computedModelMatrix : undefined,
                });
            }
        }
    });

}

/**
 * 为目标对象动态定义点图元（PointPrimitive）相关属性（标识、位置/地理坐标、大小、颜色/轮廓、距离缩放与显示控制等），
 * 内部委托给 PointPrimitive 实现。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function definePointPrimitiveProperties(target) {

    Object.defineProperties(target, {
        // 类型标识与拾取图元
        isPointPrimitive: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: true,
        },
        pickPrimitve: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this;
            }
        },
        // 标识与显示开关
        id: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this._point.id;
            },
            set: function (value) {
                this._point.id = value;
            }
        },
        show: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('show', value);
                if (this.show !== value) {
                    this._show = value;
                    this._point.show = value;
                    this.raisePropertyChangeEvent('show', value);
                }
            },
            get: function () {
                if (!defined$1(this._show))
                    this._show = this._point.show;
                return this._point.show;
            }
        },
        // 世界坐标位置、地理坐标与高度参考
        position: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                if (!Cartesian3.equals(value, this.position)) {
                    this._point.position = value;
                    this.raisePropertyChangeEvent('position', value);
                }
            },
            get: function () {
                return this._point.position;
            }
        },
        geographic: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseGeographicToCartesian(value, Scratch.scratchCartesian3, this.ellipsoid);
                this.position = value;
            },
            get: function () {
                return this.position.toGeographic(this.ellipsoid);
            }
        },
        heightReference: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseHeightReference(value);
                if (this.heightReference !== value) {
                    this._point.heightReference = value;
                    this.raisePropertyChangeEvent('heightReference', value);
                }
            },
            get: function () {
                this._point.heightReference;
            }
        },
        // 点大小：像素大小及 size 别名
        pixelSize: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('pixelSize', value);
                if (this.pixelSize !== value) {
                    this._point.pixelSize = value;
                    this.raisePropertyChangeEvent('pixelSize', value);
                }
            },
            get: function () {
                return this._point.pixelSize;
            }
        },
        size: {
            enumerable: true,
            configurable: true,
            value: target.pixelSize,
        },
        // 外观与显示控制：距离缩放、颜色/透明度、轮廓颜色/透明度/宽度、距离透明、显示条件与深度测试
        scaleByDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToNearFarScalar(value, Scratch.scratchNearFarScalar);
                if (!NearFarScalar.equals(value, this.scaleByDistance)) {
                    this._point.scaleByDistance = value;
                    this.raisePropertyChangeEvent('scaleByDistance', value);
                }
            },
            get: function () {
                return this._point.scaleByDistance;
            }
        },
        color: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value, Scratch.scratchColor);
                if (!Color.equalsRgb(value, this.color)) {
                    value.alpha = this.color.alpha;
                    this._point.color = value;
                    this.raisePropertyChangeEvent('color', value);
                }
            },
            get: function () {
                return this._point.color;
            }
        },
        opacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
                if (this.opacity !== value) {
                    const color = this.color.clone(Scratch.scratchColor).withAlpha(value);
                    this._point.color = color;
                    this.raisePropertyChangeEvent('opacity', value);
                }
            },
            get: function () {
                return this._point.color.alpha;
            }
        },
        outlineColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value, Scratch.scratchColor);
                if (!Color.equalsRgb(value, this.outlineColor)) {
                    value.alpha = this.outlineColor.alpha;
                    this._point.outlineColor = value;
                    this.raisePropertyChangeEvent('outlineColor', value);
                }
            },
            get: function () {
                return this._point.outlineColor;
            }
        },
        outlineOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('outlineOpacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('outlineOpacity', value, 1);
                if (this.outlineOpacity !== value) {
                    const color = this.outlineColor.clone(Scratch.scratchColor).withAlpha(value);
                    this._point.outlineColor = color;
                    this.raisePropertyChangeEvent('outlineOpacity', value);
                }
            },
            get: function () {
                return this._point.outlineColor.alpha;
            }
        },
        outlineWidth: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('outlineWidth', value);
                if (this.outlineWidth !== value) {
                    this._point.outlineWidth = value;
                    this.raisePropertyChangeEvent('outlineWidth', value);
                }
            },
            get: function () {
                return this._point.outlineWidth;
            }
        },
        translucencyByDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToNearFarScalar(value, Scratch.scratchNearFarScalar);
                if (!NearFarScalar.equals(value, this.translucencyByDistance)) {
                    this._point.translucencyByDistance = value;
                    this.raisePropertyChangeEvent('translucencyByDistance', value);
                }
            },
            get: function () {
                return this._point.translucencyByDistance;
            }
        },
        distanceDisplayCondition: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToDistanceDisplayCondition(value, Scratch.scratchDistanceDisplayCondition);
                if (!DistanceDisplayCondition.equals(value, this.distanceDisplayCondition)) {
                    this._point.distanceDisplayCondition = value;
                    this.raisePropertyChangeEvent('distanceDisplayCondition', value);
                }
            },
            get: function () {
                return this._point.distanceDisplayCondition;
            }
        },
        disableDepthTestDistance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('disableDepthTestDistance', value);
                if (this.disableDepthTestDistance !== value) {
                    this._point.disableDepthTestDistance = value;
                    this.raisePropertyChangeEvent('disableDepthTestDistance', value);
                }
            },
            get: function () {
                return this._point.disableDepthTestDistance;
            }
        },
        //private
        _destroyInnerPoint: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this._point && !isDestroyed(this._point)) {
                    this._point._removeFromCollection();
                    destroyObject$1(this._point);
                }
            }
        }
    });

}

/**
 * 为目标对象动态定义多边形体（PolygonVolume）相关属性（高度、拉伸高度及顶/底闭合开关等）。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function definePolygonVolumeProperties(target) {

    Object.defineProperties(target, {
        // 高度与拉伸高度
        height: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (defined$1(value))
                    Check.typeOf.number('height', value);
                if (this._height !== value) {
                    this._height = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('height', value, this.clampToGround ? undefined : PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._height;
            }
        },
        extrudedHeight: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (defined$1(value))
                    Check.typeOf.number('extrudedHeight', value);
                if (this._extrudedHeight !== value) {
                    this._extrudedHeight = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('extrudedHeight', value, this.clampToGround ? undefined : PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._extrudedHeight;
            }
        },
        // 顶面/底面闭合开关
        closeTop: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('closeTop', value);
                if (this._closeTop !== value) {
                    this._closeTop = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('closeTop', value, this.clampToGround ? undefined : PropertyType.FILLGEOMETRY);
                }
            },
            get: function () {
                return this._closeTop;
            }
        },
        closeBottom: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('closeBottom', value);
                if (this._closeBottom !== value) {
                    this._closeBottom = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('closeBottom', value, this.clampToGround ? undefined : PropertyType.FILLGEOMETRY);
                }
            },
            get: function () {
                return this._closeBottom;
            }
        },
    });

}

/**
 * 为目标对象动态定义“按像素固定尺寸”相关属性（开关、像素尺寸模型矩阵及内部更新方法）。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineSizeInPixelsProperties(target) {

    Object.defineProperties(target, {
        // 是否按像素固定尺寸
        sizeInPixels: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('sizeInPixels', value);
                if (this._sizeInPixels !== value) {
                    this._sizeInPixels = value;
                    this.raisePropertyChangeEvent('sizeInPixels', value);
                }
            },
            get: function () {
                return this._sizeInPixels;
            }
        },
        // 像素尺寸模型矩阵（惰性初始化为单位矩阵）
        pixelSizeModelMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                if (!defined$1(this._pixelSizeModelMatrix))
                    this._pixelSizeModelMatrix = Matrix4.IDENTITY.clone(new Matrix4());
                return this._pixelSizeModelMatrix;
            }
        },
        //private
        _updatePixelSizeModelMatrix: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                if (this.sizeInPixels) {
                    const boundingSphere = BoundingSphere.fromModelMatrix(this.computedModelMatrix, undefined, Scratch.scratchBoundingSphere);
                    const pixelSize = frameState.camera.getPixelSize(boundingSphere,
                        frameState.context.drawingBufferWidth,
                        frameState.context.drawingBufferHeight);
                    if (this._pixelSize !== pixelSize) {
                        this._pixelSize = pixelSize;
                        // console.log('pixelSize:', pixelSize, 'modelMatrix:', this._modelMatrix.clone());
                        Matrix4.multiplyByUniformScale(this.computedModelMatrix, pixelSize, this.pixelSizeModelMatrix);
                    }
                }
            },
        },
    });

}

/**
 * 惰性创建宿主对象的内部纹理坐标变换对象 StTransforms（仅创建一次），并绑定属性变更回调与事件转发。
 * @param {object} that 宿主对象
 * @param {function} [onStTransformChanged] 纹理坐标变换变更回调函数
 * @returns {void}
 */
function ensureStTransforms(that, onStTransformChanged) {
    if (!that._stTransforms) {
        if (!onStTransformChanged)
            onStTransformChanged = that.onStTransformChanged;
        if (onStTransformChanged)
            onStTransformChanged = onStTransformChanged.bind(that);
        that._stTransforms = new StTransforms({
            owner: that,
            onStTransformChanged: onStTransformChanged,
        });
        that._stTransforms.propertyChanged.addEventListener(function (raiser, name, value, type) {
            if (typeof that.raisePropertyChangeEvent === 'function')
                that.raisePropertyChangeEvent(name, value, type);
        });
    }
}

/**
 * 为目标对象动态定义一整套纹理坐标（st）变换相关属性与方法（偏移、重复、旋转、中心点及变换矩阵等），
 * 内部委托给惰性创建的 StTransforms 实例实现。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineStTransformsProperties(target) {

    Object.defineProperties(target, {
        // 变换对象与批量设置变换入口
        stTransforms: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureStTransforms(this);
                return this._stTransforms;
            }
        },
        setStTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (transforms) {
                this.stTransforms.setTransforms(transforms);
            }
        },
        // 纹理坐标变换参数：偏移、重复、旋转（弧度/角度）、中心点、中心旋转及变换矩阵
        stOffset: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stOffset = value;
            },
            get: function () {
                return this.stTransforms.stOffset;
            }
        },
        stRepeat: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stRepeat = value;
            },
            get: function () {
                return this.stTransforms.stRepeat;
            }
        },
        stRotation: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stRotation = value;
            },
            get: function () {
                return this.stTransforms.stRotation;
            }
        },
        stRotationDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stRotationDegrees = value;
            },
            get: function () {
                return this.stTransforms.stRotationDegrees;
            }
        },
        stCenter: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stCenter = value;
            },
            get: function () {
                return this.stTransforms.stCenter;
            }
        },
        stCenterRotation: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.stTransforms.stCenterRotation;
            }
        },
        stTransform: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.stTransforms.transform;
            }
        },
        // 强制更新纹理坐标变换矩阵
        updateStTransform: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (force) {
                return this.stTransforms.updateTransform(force);
            },
        },
        //private
        _updateStTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.stTransforms.update();
            },
        },
        //private
        _destroyStTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.stTransforms.destroy();
            },
        },
    });

}

export { BasePrimitive, BooleanGeometryInstanceAttribute, Cartesian3GeometryInstanceAttribute, FloatGeometryInstanceAttribute, FogType, Geographic, GeographicTransform, TranslationRotationScaleTransform as MatrixTransform, ModelMatrixPrimitive, ModelMatrixTransforms, PropertyChangedListener, PropertyType, RotationFrameType, Scratch, ShapeType, StTransforms, TransformsPrimitive, TranslationRotationScaleTransform, computeCirclePositions, computeCircleRadius, computeModelMatrix, computeStTransform, createGeometry, createPointCloudGeometry, defineAppearanceProperties, defineBaseShapeProperties, defineBoxProperties, defineCenterProperties, defineClampToGroundProperties, defineComputedModelMatrixProperties, defineCylinderProperties, defineEllipsoidProperties, defineLabelProperties, defineMeshProperties, defineModelMatrixTransformsProperties, defineOutlineProperties, definePlaneProperties, definePointCloudProperties, definePointPrimitiveProperties, definePolygonVolumeProperties, defineSizeInPixelsProperties, defineStTransformsProperties, getGeometryInstanceAttributes, getPositionFromTarget, getRenderState, isColorMaterial, isTranslucent, parseAltitude, parseArcType, parseAttitudeToHeadingPitchRoll, parseAttitudeToMatrix3, parseAttitudeToQuaternion, parseCartographicToCartesian, parseCartographicsToPositions, parseClassificationType, parseClockRange, parseColorBlendMode, parseCornerType, parseCullFace, parseEulerToHeadingPitchRoll, parseEulerToQuaternion, parseGeographicToCartesian, parseGeographicsToPositions, parseHeading, parseAltitude as parseHeight, parseHeightReference, parseHoles, parseHorizontalOrigin, parseLabelStyle, parseLatitude, parseLongitude, parsePitch, parseRoll, parseRotationToHeadingPitchRoll, parseRotationToMatrix3, parseRotationToQuaternion, parseShadowMode, parseToBoundingRectangle, parseToCartesian2, parseToCartesian3, parseToCartesian3Array, parseToCartesian4, parseToCartographic, parseToColor, parseToDistanceDisplayCondition, parseToGeographic, parseToHeadingPitchRange, parseToJulianDate, parseToNearFarScalar, parseToPlane, parseToPolygonHierarchy, parseToRange, parseToRectangle, parseToTimeInterval, parseVerticalOrigin, resolveModelMatrixByFixedFrame };
//# sourceMappingURL=cesium.utils.esm.js.map
