import { Cartesian2, Math as CesiumMath, Check, defined, GeographicTilingScheme, Rectangle, WebMercatorTilingScheme } from "cesium";
import parseToCartesian2 from "../parses/parseToCartesian2.js";

const defaultOrigin = Object.freeze({ x: -180, y: 90 });

/**
 * 获取默认的原点坐标
 *
 * @param {CustomTilingScheme} that
 * @returns {{x:number, y:number}}
 */
function getDefaultOrigin(that) {
    if (that.isGeographic) {
        return defaultOrigin;
    } else {
        const rectangleInMeters = that._webMercatorTilingScheme.rectangleInMeters;
        return Object.freeze({
            x: rectangleInMeters.west,
            y: rectangleInMeters.north,
        });
    }
}

/**
 * 根据层级分辨率计算层级相关参数
 * @param {Object} origin 地图原点
 * @param {Array} resolutions 分辨率数组
 * @param {number} tilePixelWidth 地图瓦片像素宽
 * @param {number} tilePixelHeight 地图瓦片像素高
 * @param {Rectangle} rectangle 地图范围Rectange
 * @returns {Array} 返回层级信息数组
 */
function computeLods(origin, resolutions, tilePixelWidth, tilePixelHeight, rectangle) {
    //地球地图范围
    const west = rectangle.west,
        north = rectangle.north,
        east = rectangle.east,
        south = rectangle.south;
    const longitudeLength = east - west; //经度范围总长度
    const latitudeLength = north - south; //纬度范围总长度
    const result = [];
    for (let i = 0; i < resolutions.length; i++) {
        const resolution = resolutions[i];
        if (!defined(resolution))
            continue;
        const lod = {};
        lod.level = i;
        lod.pixelWidth = Math.round(longitudeLength / resolution); //计算该层级的像素总宽度
        lod.pixelHeight = Math.round(latitudeLength / resolution); //计算该层级的像素总高度
        lod.numberOfTileX = Math.round(lod.pixelWidth / tilePixelWidth); //计算横向的瓦片数量
        lod.numberOfTileY = Math.round(lod.pixelHeight / tilePixelHeight); //计算纵向的瓦片数量
        const tileDegreesWidth = tilePixelWidth * resolution; //计算地图瓦片角度单位的宽度
        const tileDegreesHeight = tilePixelHeight * resolution; //计算地图瓦片角度单位的高度
        lod.startOfTileX = Math.floor((west - origin.x) / tileDegreesWidth); //计算横向的瓦片起始编号
        lod.startOfTileY = Math.floor((origin.y - north) / tileDegreesHeight); //计算纵向的瓦片起始编号
        lod.endOfTileX = lod.startOfTileX + lod.numberOfTileX; //计算横向的瓦片结束编号
        lod.endOfTileY = lod.startOfTileY + lod.numberOfTileY; //计算纵向的瓦片结束编号
        // lod.endOfTileX = Math.ceil((east - origin.x) / tileDegreesWidth); //计算横向的瓦片结束编号
        // lod.endOfTileY = Math.ceil((origin.y - south) / tileDegreesHeight); //计算纵向的瓦片结束编号
        // lod.numberOfTileX = lod.endOfTileX - lod.startOfTileX; //计算横向的瓦片数量
        // lod.numberOfTileY = lod.endOfTileY - lod.startOfTileY; //计算纵向的瓦片数量
        result[i] = lod;
        console.log('computeLod:', i, lod);
    }
    return result;
};

/**
 * 自定义切片方案，按照 Cesium 切片方案接口实现，支持以度数（经纬度）或米（Web 墨卡托）为单位的
 * 自定义范围、原点、分辨率与层级参数，用于在内置切片方案无法匹配时提供瓦片坐标换算能力。
 * 通过 unit（'degrees' 或 'meters'）决定底层使用地理切片方案还是 Web 墨卡托切片方案。
 */
class CustomTilingScheme {
    /**
     * 创建自定义切片方案实例。
     * @param {object} [options={}] 配置项
     * @param {Array|object} [options.extent] 地图范围，[west, south, east, north] 数组或带 xmin/ymin/xmax/ymax 的对象
     * @param {string} [options.unit='degrees'] 坐标单位，'degrees' 或 'meters'
     * @param {number} [options.tileWidth=256] 瓦片像素宽度
     * @param {number} [options.tileHeight=256] 瓦片像素高度
     * @param {boolean} [options.reverseX=false] 是否反转 X 方向瓦片编号
     * @param {boolean} [options.reverseY=false] 是否反转 Y 方向瓦片编号
     * @param {Cartesian2|Array|object} [options.origin] 瓦片原点坐标
     * @param {Array} [options.lods] 直接指定的层级（LOD）信息数组
     * @param {Array} [options.resolutions] 各层级分辨率数组，用于自动计算层级信息
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体
     */
    constructor(options = {}) {
        const extent = this._extent = options.extent;
        this._unit = options.unit ?? 'degrees';
        const tileWidth = options.tileWidth ?? 256;
        const tileHeight = options.tileHeight ?? 256;
        const reverseX = this._reverseX = options.reverseX ?? false;
        const reverseY = this._reverseY = options.reverseY ?? false;

        this._geographicTilingScheme = new GeographicTilingScheme({
            ellipsoid: options.ellipsoid,
        });
        this._webMercatorTilingScheme = new WebMercatorTilingScheme({
            ellipsoid: options.ellipsoid,
        });

        if (extent) {
            const west = extent[0] || extent.xmin;
            const south = extent[1] || extent.ymin;
            const east = extent[2] || extent.xmax;
            const north = extent[3] || extent.ymax;
            if (this.isGeographic) {
                const rectangle = Rectangle.fromDegrees(west, south, east, north);
                this._geographicTilingScheme._rectangle = rectangle;
                this._webMercatorTilingScheme.updateFromRectangle(rectangle);
            } else {
                this._webMercatorTilingScheme.updateRectangle({
                    rectangleSouthwestInMeters: {
                        x: west,
                        y: south,
                    },
                    rectangleNortheastInMeters: {
                        x: east,
                        y: north,
                    },
                });
                this._geographicTilingScheme._rectangle = this._webMercatorTilingScheme.rectangle;
            }
        }

        const origin = parseToCartesian2(options.origin ?? getDefaultOrigin(this));
        if (reverseX)
            origin.x = -origin.x;
        if (reverseY)
            origin.y = -origin.y;
        if (options.lods)
            this._lods = options.lods
        else if (options.resolutions)
            this._lods = computeLods(origin, options.resolutions, tileWidth, tileHeight, this.isGeographic ? this._geographicTilingScheme._rectangle.toDegrees() : this._webMercatorTilingScheme._rectangleInMeters);
        else
            this._lods = [];
    }

    /**
     * 获取坐标单位。
     * @returns {string} 坐标单位，'degrees' 或 'meters'
     */
    get unit() {
        return this._unit;
    }

    /**
     * 获取是否为经纬度（度数）切片方案。
     * @returns {boolean} 是否为度数单位
     */
    get isGeographic() {
        return this._unit === 'degrees';
    }

    /**
     * 获取是否为 Web 墨卡托（米）切片方案。
     * @returns {boolean} 是否为米单位
     */
    get isWebMercator() {
        return this._unit === 'meters';
    }

    /**
     * 获取层级（LOD）信息数组。
     * @returns {Array} 层级信息数组
     */
    get lods() {
        return this._lods;
    }

    /**
     * 获取参考椭球体。
     * @returns {Ellipsoid} 参考椭球体
     */
    get ellipsoid() {
        return this.isGeographic ? this._geographicTilingScheme._ellipsoid : this._webMercatorTilingScheme._ellipsoid;
    }

    /**
     * 获取地图范围。
     * @returns {Rectangle} 地图范围
     */
    get rectangle() {
        return this.isGeographic ? this._geographicTilingScheme._rectangle : this._webMercatorTilingScheme._rectangle;
    }

    /**
     * 获取投影对象。
     * @returns {object} 投影对象
     */
    get projection() {
        return this.isGeographic ? this._geographicTilingScheme._projection : this._webMercatorTilingScheme._projection;
    }

    /**
     * 获取指定层级的 X 方向瓦片数量。
     * @param {number} level 层级
     * @returns {number} X 方向瓦片数量
     */
    getNumberOfXTilesAtLevel(level) {
        if (defined(this._lods[level]))
            return this._lods[level].numberOfTileX;
        return this.isGeographic ? this._geographicTilingScheme.getNumberOfXTilesAtLevel(level) : this._webMercatorTilingScheme.getNumberOfXTilesAtLevel(level);;
    }

    /**
     * 获取指定层级的 Y 方向瓦片数量。
     * @param {number} level 层级
     * @returns {number} Y 方向瓦片数量
     */
    getNumberOfYTilesAtLevel(level) {
        if (defined(this._lods[level]))
            return this._lods[level].numberOfTileY;
        return this.isGeographic ? this._geographicTilingScheme.getNumberOfYTilesAtLevel(level) : this._webMercatorTilingScheme.getNumberOfYTilesAtLevel(level);
    }

    /**
     * 结合反转配置与层级起始编号，将瓦片坐标换算为实际瓦片编号。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @returns {{x:number, y:number, level:number}} 实际瓦片编号
     */
    getTileActualNumber(x, y, level) {
        const lod = this._lods[level];
        if (this._reverseX) {
            const xTiles = this.getNumberOfXTilesAtLevel(level);
            x = xTiles - x - 1;
        }
        if (this._reverseY) {
            const yTiles = this.getNumberOfYTilesAtLevel(level);
            y = yTiles - y - 1;
        }
        if (defined(lod)) {
            x += lod.startOfTileX;
            y += lod.startOfTileY;
        }
        return {
            x: x,
            y: y,
            level: level,
        }
    }

    /**
     * 将弧度制矩形转换为当前切片方案的原生坐标矩形（度数单位输出度数，米单位输出投影米坐标）。
     * @param {Rectangle} rectangle 弧度制矩形
     * @param {Rectangle} [result] 用于存储结果的实例
     * @returns {Rectangle} 原生坐标矩形
     */
    rectangleToNativeRectangle(rectangle, result = new Rectangle()) {
        //>>includeStart('debug', pragmas.debug);
        Check.defined("rectangle", rectangle);
        //>>includeEnd('debug');

        if (this.isGeographic) {
            const west = CesiumMath.toDegrees(rectangle.west);
            const south = CesiumMath.toDegrees(rectangle.south);
            const east = CesiumMath.toDegrees(rectangle.east);
            const north = CesiumMath.toDegrees(rectangle.north);

            result.west = west;
            result.south = south;
            result.east = east;
            result.north = north;
        } else {
            const projection = this._webMercatorTilingScheme._projection;
            const southwest = projection.project(Rectangle.southwest(rectangle));
            const northeast = projection.project(Rectangle.northeast(rectangle));

            result.west = southwest.x;
            result.south = southwest.y;
            result.east = northeast.x;
            result.north = northeast.y;
        }
        return result;
    }

    /**
     * 将瓦片坐标转换为原生坐标矩形。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @param {Rectangle} [result] 用于存储结果的实例
     * @returns {Rectangle} 原生坐标矩形
     */
    tileXYToNativeRectangle(x, y, level, result = new Rectangle()) {
        if (this.isGeographic) {
            const rectangleRadians = this.tileXYToRectangle(x, y, level, result);
            rectangleRadians.west = CesiumMath.toDegrees(rectangleRadians.west);
            rectangleRadians.south = CesiumMath.toDegrees(rectangleRadians.south);
            rectangleRadians.east = CesiumMath.toDegrees(rectangleRadians.east);
            rectangleRadians.north = CesiumMath.toDegrees(rectangleRadians.north);
            return rectangleRadians;
        } else {
            const xTiles = this.getNumberOfXTilesAtLevel(level);
            const yTiles = this.getNumberOfYTilesAtLevel(level);

            const xTileWidth =
                (this._webMercatorTilingScheme._rectangleNortheastInMeters.x - this._webMercatorTilingScheme._rectangleSouthwestInMeters.x) /
                xTiles;
            const west = this._webMercatorTilingScheme._rectangleSouthwestInMeters.x + x * xTileWidth;
            const east = this._webMercatorTilingScheme._rectangleSouthwestInMeters.x + (x + 1) * xTileWidth;

            const yTileHeight =
                (this._webMercatorTilingScheme._rectangleNortheastInMeters.y - this._webMercatorTilingScheme._rectangleSouthwestInMeters.y) /
                yTiles;
            const north = this._webMercatorTilingScheme._rectangleNortheastInMeters.y - y * yTileHeight;
            const south = this._webMercatorTilingScheme._rectangleNortheastInMeters.y - (y + 1) * yTileHeight;

            result.west = west;
            result.south = south;
            result.east = east;
            result.north = north;
            return result;
        }
    }

    /**
     * 将瓦片坐标转换为弧度制矩形。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @param {Rectangle} [result] 用于存储结果的实例
     * @returns {Rectangle} 弧度制矩形
     */
    tileXYToRectangle(x, y, level, result = new Rectangle()) {
        if (this.isGeographic) {
            const rectangle = this.rectangle;

            const xTiles = this.getNumberOfXTilesAtLevel(level);
            const yTiles = this.getNumberOfYTilesAtLevel(level);

            const xTileWidth = rectangle.width / xTiles;
            const west = x * xTileWidth + rectangle.west;
            const east = (x + 1) * xTileWidth + rectangle.west;

            const yTileHeight = rectangle.height / yTiles;
            const north = rectangle.north - y * yTileHeight;
            const south = rectangle.north - (y + 1) * yTileHeight;

            result.west = west;
            result.south = south;
            result.east = east;
            result.north = north;
            return result;
        } else {
            const nativeRectangle = this.tileXYToNativeRectangle(x, y, level, result);

            const projection = this._webMercatorTilingScheme._projection;
            const southwest = projection.unproject(
                new Cartesian2(nativeRectangle.west, nativeRectangle.south),
            );
            const northeast = projection.unproject(
                new Cartesian2(nativeRectangle.east, nativeRectangle.north),
            );

            nativeRectangle.west = southwest.longitude;
            nativeRectangle.south = southwest.latitude;
            nativeRectangle.east = northeast.longitude;
            nativeRectangle.north = northeast.latitude;
            return nativeRectangle;
        }
    }

    /**
     * 将经纬度位置转换为瓦片坐标，位置不在切片方案范围内时返回 undefined。
     * @param {Cartographic} position 经纬度位置
     * @param {number} level 层级
     * @param {Cartesian2} [result] 用于存储结果的实例
     * @returns {Cartesian2|undefined} 瓦片坐标
     */
    positionToTileXY(position, level, result = new Cartesian2()) {
        const rectangle = this.rectangle;
        if (!Rectangle.contains(rectangle, position)) {
            // outside the bounds of the tiling scheme
            return undefined;
        }

        const xTiles = this.getNumberOfXTilesAtLevel(level);
        const yTiles = this.getNumberOfYTilesAtLevel(level);

        if (this.isGeographic) {
            const xTileWidth = rectangle.width / xTiles;
            const yTileHeight = rectangle.height / yTiles;

            let longitude = position.longitude;
            if (rectangle.east < rectangle.west) {
                longitude += CesiumMath.TWO_PI;
            }

            let xTileCoordinate = ((longitude - rectangle.west) / xTileWidth) | 0;
            if (xTileCoordinate >= xTiles) {
                xTileCoordinate = xTiles - 1;
            }

            let yTileCoordinate =
                ((rectangle.north - position.latitude) / yTileHeight) | 0;
            if (yTileCoordinate >= yTiles) {
                yTileCoordinate = yTiles - 1;
            }

            result.x = xTileCoordinate;
            result.y = yTileCoordinate;
        } else {
            const overallWidth =
                this._webMercatorTilingScheme._rectangleNortheastInMeters.x - this._webMercatorTilingScheme._rectangleSouthwestInMeters.x;
            const xTileWidth = overallWidth / xTiles;
            const overallHeight =
                this._webMercatorTilingScheme._rectangleNortheastInMeters.y - this._webMercatorTilingScheme._rectangleSouthwestInMeters.y;
            const yTileHeight = overallHeight / yTiles;

            const projection = this._webMercatorTilingScheme._projection;

            const webMercatorPosition = projection.project(position);
            const distanceFromWest =
                webMercatorPosition.x - this._webMercatorTilingScheme._rectangleSouthwestInMeters.x;
            const distanceFromNorth =
                this._webMercatorTilingScheme._rectangleNortheastInMeters.y - webMercatorPosition.y;

            let xTileCoordinate = (distanceFromWest / xTileWidth) | 0;
            if (xTileCoordinate >= xTiles) {
                xTileCoordinate = xTiles - 1;
            }
            let yTileCoordinate = (distanceFromNorth / yTileHeight) | 0;
            if (yTileCoordinate >= yTiles) {
                yTileCoordinate = yTiles - 1;
            }

            result.x = xTileCoordinate;
            result.y = yTileCoordinate;
        }
        return result;
    }

    /**
     * 静态方法：根据原点、分辨率、瓦片尺寸与地图范围计算层级（LOD）信息数组。
     * @param {object} origin 地图原点
     * @param {Array} resolutions 分辨率数组
     * @param {number} tilePixelWidth 瓦片像素宽度
     * @param {number} tilePixelHeight 瓦片像素高度
     * @param {Rectangle} rectangle 地图范围
     * @returns {Array} 层级信息数组
     */
    static computeLods(origin, resolutions, tilePixelWidth, tilePixelHeight, rectangle) {
        return computeLods(origin, resolutions, tilePixelWidth, tilePixelHeight, rectangle);
    };
};

export default CustomTilingScheme;
export { CustomTilingScheme };
