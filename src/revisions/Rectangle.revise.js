import { Cartesian3, Cartographic, Math as CesiumMath, Check, DeveloperError, Rectangle, defined } from "cesium";
import Geographic from "../additions/Geographic.js";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import parseToCartographic from "../parses/parseToCartographic.js";
import parseToGeographic from "../parses/parseToGeographic.js";

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
            return CesiumMath.toDegrees(this.west);
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
            return CesiumMath.toDegrees(this.east);
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
            return CesiumMath.toDegrees(this.south);
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
            return CesiumMath.toDegrees(this.north);
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
            return CesiumMath.toDegrees(this.width);
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
            return CesiumMath.toDegrees(this.height);
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

    if (defined(height)) {
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
        east += CesiumMath.TWO_PI;
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

export default Rectangle;
export { Rectangle };
