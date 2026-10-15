import { Check, defined } from "cesium";
import CustomTilingScheme from "./CustomTilingScheme.js";

const crsMatchPattern = /\b(4326|4490)\b/;

/**
 * WMTS 切片方案，继承自 CustomTilingScheme，依据解析出的瓦片矩阵集（TileMatrixSet）
 * 提供瓦片数量与实际瓦片编号换算，坐标单位由瓦片矩阵集的 CRS 自动判定。
 */
class WebMapTileServiceTilingScheme extends CustomTilingScheme {
    /**
     * 创建 WMTS 切片方案实例。
     * @param {object} options 配置项，除 CustomTilingScheme 的参数外还包含以下属性：
     * @param {object} options.tileMatrixSets 以标识为键的瓦片矩阵集映射
     * @param {string} options.tileMatrixSetID 瓦片矩阵集标识
     */
    constructor(options) {
        super(options);
        Check.defined('tileMatrixSets', options.tileMatrixSets);
        Check.defined('tileMatrixSetID', options.tileMatrixSetID);
        this._tileMatrixSets = options.tileMatrixSets;
        this.tileMatrixSetID = options.tileMatrixSetID;
    }

    /**
     * 设置瓦片矩阵集标识，并依据其 CRS 判定坐标单位（是经纬度还是米）。
     * @param {string} value 瓦片矩阵集标识
     * @returns {void}
     */
    set tileMatrixSetID(value) {
        Check.typeOf.string('tileMatrixSetID', value);
        this._tileMatrixSetID = value;
        this._tileMatrixSet = this._tileMatrixSets[this._tileMatrixSetID];
        this._crs = this._tileMatrixSet.crs;
        if (this._crs.match(crsMatchPattern)) {
            this._unit = "degrees";
        } else {
            this._unit = "meters";
        }
    }

    /**
     * 获取瓦片矩阵集标识。
     * @returns {string} 瓦片矩阵集标识
     */
    get tileMatrixSetID() {
        return this._tileMatrixSetID;
    }

    /**
     * 获取当前瓦片矩阵集。
     * @returns {object} 当前瓦片矩阵集
     */
    get tileMatrixSet() {
        return this._tileMatrixSet;
    }

    /**
     * 获取坐标参考系（CRS）标识。
     * @returns {string} CRS 标识
     */
    get crs() {
        return this._crs;
    }

    /**
     * 获取指定层级的 X 方向瓦片数量，优先使用瓦片矩阵集中的定义。
     * @param {number} level 层级
     * @returns {number} X 方向瓦片数量
     */
    getNumberOfXTilesAtLevel(level) {
        if (defined(this._tileMatrixSet)) {
            const lod = this._tileMatrixSet.tileMatrices[level];
            if (defined(lod)) {
                return lod.numberOfTileX;
            }
        }
        return super.getNumberOfXTilesAtLevel(level);
    }

    /**
     * 获取指定层级的 Y 方向瓦片数量，优先使用瓦片矩阵集中的定义。
     * @param {number} level 层级
     * @returns {number} Y 方向瓦片数量
     */
    getNumberOfYTilesAtLevel(level) {
        if (defined(this._tileMatrixSet)) {
            const lod = this._tileMatrixSet.tileMatrices[level];
            if (defined(lod)) {
                return lod.numberOfTileY;
            }
        }
        return super.getNumberOfYTilesAtLevel(level);
    }

    /**
     * 结合瓦片矩阵集的起始编号，将瓦片坐标换算为实际瓦片编号。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @returns {{x:number, y:number, level:number}} 实际瓦片编号
     */
    getTileActualNumber(x, y, level) {
        if (defined(this._tileMatrixSet)) {
            const lod = this._tileMatrixSet.tileMatrices[level];
            if (defined(lod)) {
                x += lod.startOfTileX;
                y += lod.startOfTileY;
            }
        }
        return {
            x: x,
            y: y,
            level: level,
        }
    }
};

export default WebMapTileServiceTilingScheme;
export { WebMapTileServiceTilingScheme };
