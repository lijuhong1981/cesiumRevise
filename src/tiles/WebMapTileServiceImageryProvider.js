import Check from "@lijuhong1981/jscheck/src/Check.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import parseNumber from "@lijuhong1981/jsmath/src/parseNumber.js";
import { Math as CesiumMath, Credit, defer, defined, DeveloperError, Event, ImageryProvider, Rectangle, Resource, RuntimeError, WebMercatorTilingScheme } from "cesium";
import WebMapTileServiceTilingScheme from "./WebMapTileServiceTilingScheme.js";

/**
 * 根据比例尺分母计算分辨率（度/像素）。
 * @param {number} scaleDenominator 比例尺分母
 * @param {number} [dpi=96] 屏幕分辨率（DPI）
 * @returns {number} 分辨率（度/像素）
 */
function computeResolution(scaleDenominator, dpi = 96) {
    return scaleDenominator * 0.0254 * 10000 / dpi / CesiumMath.WGS84_METERS_PER_DEGREES / 10000;
}

/**
 * 解析 WMTS 中的原点坐标字符串（如 "lon lat"）。
 * @param {string} value 原点坐标字符串
 * @param {boolean} [reverse] 是否交换 x、y 顺序
 * @returns {{x:number, y:number}} 原点坐标
 */
function parseOrigin(value, reverse) {
    const arr = value.split(' ');
    arr[0] = parseNumber(arr[0]);
    arr[1] = parseNumber(arr[1]);
    return {
        x: reverse ? arr[1] : arr[0],
        y: reverse ? arr[0] : arr[1],
    }
}

// function parseRectangle(lowerCorner, upperCorner) {
//     const lowerOrigin = parseOrigin(lowerCorner);
//     const upperOrigin = parseOrigin(upperCorner);
//     return Rectangle.fromDegrees(lowerOrigin.x, lowerOrigin.y, upperOrigin.x, upperOrigin.y);
// }

/**
 * 解析单个 TileMatrix 节点，提取标识、比例尺、瓦片尺寸、瓦片数量与起始编号等信息。
 * @param {Element} TileMatrix TileMatrix XML 节点
 * @param {object} rectangle 地图范围（含 westDegrees、northDegrees）
 * @returns {object} 层级信息对象
 */
function parseTileMatrix(TileMatrix, rectangle) {
    const result = {};
    result.id = TileMatrix.getElementsByTagName('ows:Identifier')[0].textContent;
    // let idx = value.lastIndexOf(':');
    // if (idx !== -1) {
    //     value = value.substring(idx + 1);
    // }
    // result.level = parseNumber(value);
    result.scaleDenominator = parseNumber(TileMatrix.getElementsByTagName('ScaleDenominator')[0].textContent);
    result.tileWidth = parseNumber(TileMatrix.getElementsByTagName('TileWidth')[0].textContent);
    result.tileHeight = parseNumber(TileMatrix.getElementsByTagName('TileHeight')[0].textContent);
    result.numberOfTileX = parseNumber(TileMatrix.getElementsByTagName('MatrixWidth')[0].textContent);
    result.numberOfTileY = parseNumber(TileMatrix.getElementsByTagName('MatrixHeight')[0].textContent);
    result.resolution = computeResolution(result.scaleDenominator);
    result.origin = parseOrigin(TileMatrix.getElementsByTagName('TopLeftCorner')[0].textContent, true);

    const tileDegreesWidth = result.tileWidth * result.resolution; //计算地图瓦片角度单位的宽度
    const tileDegreesHeight = result.tileHeight * result.resolution; //计算地图瓦片角度单位的高度
    result.startOfTileX = Math.floor((rectangle.westDegrees - result.origin.x) / tileDegreesWidth); //计算横向的瓦片起始编号
    result.startOfTileY = Math.floor((result.origin.y - rectangle.northDegrees) / tileDegreesHeight); //计算纵向的瓦片起始编号
    result.endOfTileX = result.startOfTileX + result.numberOfTileX; //计算横向的瓦片结束编号
    result.endOfTileY = result.startOfTileY + result.numberOfTileY; //计算纵向的瓦片结束编号

    return result;
}

/**
 * 解析 TileMatrixSet 节点，汇总其下所有 TileMatrix 层级信息。
 * @param {Element} TileMatrixSet TileMatrixSet XML 节点
 * @param {Rectangle} [rectangle=Rectangle.MAX_VALUE] 地图范围
 * @returns {object} 瓦片矩阵集信息对象
 */
function parseTileMatrixSet(TileMatrixSet, rectangle = Rectangle.MAX_VALUE) {
    const result = {};
    result.id = TileMatrixSet.getElementsByTagName('ows:Identifier')[0].textContent;
    result.crs = TileMatrixSet.getElementsByTagName('ows:SupportedCRS')[0].textContent;
    result.tileMatrices = [];
    const TileMatrices = TileMatrixSet.getElementsByTagName('TileMatrix');
    for (let i = 0; i < TileMatrices.length; i++) {
        const tileMatrix = parseTileMatrix(TileMatrices[i], rectangle);
        tileMatrix.level = i;
        result.tileMatrices[tileMatrix.level] = tileMatrix;
        if (i === 0) {
            result.tileWidth = tileMatrix.tileWidth;
            result.tileHeight = tileMatrix.tileHeight;
        }
    }
    result.minimumLevel = 0;
    result.maximumLevel = TileMatrices.length - 1;

    return result;
}

const defaultParameters = Object.freeze({
    service: 'WMTS',
    version: '1.0.0',
    request: 'GetTile'
});

/**
 * WMTS（Web Map Tile Service）影像提供者，通过 GetCapabilities 获取服务能力文档，
 * 解析图层、格式、瓦片矩阵集等信息并据此构建切片方案，支持通过代理访问。
 */
class WebMapTileServiceImageryProvider extends Destroyable {
    /**
     * 创建 WMTS 影像提供者实例。
     * @param {object} options 配置项
     * @param {string} options.url 服务地址（必填）
     * @param {boolean} [options.getCapabilities=true] 是否请求 GetCapabilities 获取能力文档
     * @param {string} [options.layer] 图层标识
     * @param {string} [options.style] 样式标识
     * @param {string} [options.tileMatrixSetID] 瓦片矩阵集标识
     * @param {string} [options.tileMatrixSet] 瓦片矩阵集标识（tileMatrixSetID 的别名）
     * @param {string} [options.format] 瓦片格式
     * @param {number} [options.tileWidth=256] 瓦片像素宽度
     * @param {number} [options.tileHeight=256] 瓦片像素高度
     * @param {number} [options.minimumLevel=0] 最小层级
     * @param {number} [options.maximumLevel=23] 最大层级
     * @param {TilingScheme} [options.tilingScheme] 切片方案
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体
     * @param {Rectangle} [options.rectangle] 地图范围
     * @param {string} [options.proxyUrl] 代理地址
     * @param {string|Credit} [options.credit] 版权信息
     */
    constructor(options = {}) {
        super();
        Check.defined('url', options.url);

        const getCapabilities = options.getCapabilities ?? true;
        if (getCapabilities === false) {
            Check.defined('layer', options.layer);
        }

        const resource = Resource.createIfNeeded(options.url);

        this._resource = resource;
        this._options = Object.assign({}, options);
        this._layer = options.layer;
        this._style = options.style;
        this._tileMatrixSetID = options.tileMatrixSetID || options.tileMatrixSet;
        this._format = options.format;
        this._tileWidth = options.tileWidth ?? 256;
        this._tileHeight = options.tileHeight ?? 256;
        this._minimumLevel = options.minimumLevel ?? 0;
        this._maximumLevel = options.maximumLevel ?? 23;
        this._tilingScheme = options.tilingScheme ?? new WebMercatorTilingScheme({
            ellipsoid: options.ellipsoid
        });
        this._rectangle = options.rectangle || Rectangle.MAX_VALUE.clone();
        if (defined(options.proxyUrl)) {
            this._proxyUrl = options.proxyUrl;
            this._proxyResource = Resource.createIfNeeded(options.proxyUrl);
        }

        const credit = options.credit;
        if (typeof credit === 'string') {
            credit = new Credit(credit);
        }
        this._credit = credit;

        this._errorEvent = new Event();

        this._ready = false;
        this._readyPromise = defer();

        if (getCapabilities === false) {
            this._ready = true;
            this._readyPromise.resolve(true);
            return;
        }

        const getCapabilitiesSuccess = (xml) => {
            // console.log('GetCapabilities result:', xml);
            const Capabilities = xml.getElementsByTagName('Capabilities')[0];
            // Capabilities.getAttribute('version');
            const Contents = Capabilities.getElementsByTagName('Contents')[0];
            const Layer = Contents.getElementsByTagName('Layer')[0];
            const Format = Layer.getElementsByTagName('Format');
            const Style = Layer.getElementsByTagName('Style')[0];
            // const BoundingBox = Layer.getElementsByTagName('ows:WGS84BoundingBox')[0] || Layer.getElementsByTagName('ows:BoundingBox')[0];
            const TileMatrixSet = Contents.getElementsByTagName('TileMatrixSet');

            if (!defined(this._layer))
                this._layer = Layer.getElementsByTagName('ows:Identifier')[0].textContent;
            else
                this._layerName = Layer.getElementsByTagName('ows:Identifier')[0].textContent;

            this._formats = [];
            for (let i = 0; i < Format.length; i++) {
                this._formats.push(Format[i].textContent);
            }
            if (!defined(this._format)) {
                this._format = this._formats[0];
            }

            this._style = Style.getElementsByTagName('ows:Identifier')[0].textContent;

            // const lowerCorner = BoundingBox.getElementsByTagName('ows:LowerCorner')[0].textContent;
            // const upperCorner = BoundingBox.getElementsByTagName('ows:UpperCorner')[0].textContent;
            // this._rectangle = parseRectangle(lowerCorner, upperCorner);

            this._tileMatrixSets = [];
            this._tileMatrixSetIDs = [];
            for (let i = 0; i < TileMatrixSet.length; i++) {
                if (TileMatrixSet[i].getElementsByTagName('TileMatrix').length === 0)
                    continue;
                const tileMatrixSet = parseTileMatrixSet(TileMatrixSet[i], this._rectangle);
                console.log('parseTileMatrixSet:', tileMatrixSet);
                this._tileMatrixSets[tileMatrixSet.id] = tileMatrixSet;
                this._tileMatrixSetIDs.push(tileMatrixSet.id);
            }
            if (!defined(this._tileMatrixSetID) || !defined(this._tileMatrixSets[this._tileMatrixSetID])) {
                this._tileMatrixSetID = this._tileMatrixSetIDs[0];
            }
            // console.log('tileMatrixSets:', this._tileMatrixSets);

            this._tilingScheme = new WebMapTileServiceTilingScheme({
                ellipsoid: options.ellipsoid,
                tileMatrixSets: this._tileMatrixSets,
                tileMatrixSetID: this._tileMatrixSetID
            });

            const tileMatrixSet = this._tilingScheme.tileMatrixSet;
            if (defined(tileMatrixSet)) {
                // console.log('tileMatrixSet', tileMatrixSet);
                // const tileMatrices = tileMatrixSet.tileMatrices;
                // const length = tileMatrices.length;
                // for (let i = 0; i < length; i++) {
                //     if (defined(tileMatrices[i])) {
                //         this._minimumLevel = i;
                //         break;
                //     }
                // }
                // this._maximumLevel = length - 1;
                this._minimumLevel = this._options.minimumLevel ?? tileMatrixSet.minimumLevel;
                this._maximumLevel = this._options.maximumLevel ?? tileMatrixSet.maximumLevel;
                this._tileWidth = this._options.tileWidth ?? tileMatrixSet.tileWidth;
                this._tileHeight = this._options.tileHeight ?? tileMatrixSet.tileHeight;
                console.log('minimumLevel=', this._minimumLevel, 'maximumLevel=', this._maximumLevel);
            }

            this._ready = true;
            this._readyPromise.resolve(true);
        }

        const getCapabilitiesFailure = (e) => {
            const message = 'An error occurred while accessing ' + this._resource.url + '.';
            const error = new RuntimeError(message);
            this._readyPromise.reject(error);
        }

        const requestGetCapabilities = () => {
            const queryParameters = {
                service: 'WMTS',
                request: 'GetCapabilities'
            };
            if (defined(this._layer))
                queryParameters.layer = this._layer;
            if (defined(this._tileMatrixSetID))
                queryParameters.tileMatrixSet = this._tileMatrixSetID;
            const resource = this._resource.getDerivedResource({
                queryParameters: queryParameters
            });
            if (defined(this._proxyResource)) {
                this._proxyResource.setQueryParameters({
                    url: resource.url,
                });
                this._proxyResource.fetchXML()
                    .then(getCapabilitiesSuccess)
                    .catch(getCapabilitiesFailure);
            } else {
                resource.fetchXML()
                    .then(getCapabilitiesSuccess)
                    .catch(getCapabilitiesFailure);
            }
        }

        requestGetCapabilities();
    }

    /**
     * 获取服务地址。
     * @returns {string} 服务地址
     */
    get url() {
        return this._resource._url;
    }

    /**
     * 设置图层标识。
     * @param {string} value 图层标识
     * @returns {void}
     */
    set layer(value) {
        Check.typeOf.string('layer', value);
        this._layer = value;
    }

    /**
     * 获取图层标识。
     * @returns {string} 图层标识
     */
    get layer() {
        return this._layer;
    }

    /**
     * 设置样式标识。
     * @param {string} value 样式标识
     * @returns {void}
     */
    set style(value) {
        Check.typeOf.string('style', value);
        this._style = value;
    }

    /**
     * 获取样式标识。
     * @returns {string} 样式标识
     */
    get style() {
        return this._style;
    }

    /**
     * 设置瓦片格式。
     * @param {string} value 瓦片格式
     * @returns {void}
     */
    set format(value) {
        Check.typeOf.string('format', value);
        this._format = value;
    }

    /**
     * 获取瓦片格式。
     * @returns {string} 瓦片格式
     */
    get format() {
        return this._format;
    }

    /**
     * 获取服务支持的瓦片格式列表。
     * @returns {string[]} 支持的瓦片格式列表
     */
    get supportedFormats() {
        if (!this._ready) {
            throw new DeveloperError('formats must not be called before the imagery provider is ready.');
        }
        return this._formats;
    }

    /**
     * 设置瓦片矩阵集标识，并同步更新内部切片方案及层级、瓦片尺寸等参数。
     * @param {string} value 瓦片矩阵集标识
     * @returns {void}
     */
    set tileMatrixSetID(value) {
        Check.typeOf.string('tileMatrixSetID', value);
        this._tileMatrixSetID = value;
        if (defined(this._tilingScheme)) {
            this._tilingScheme.tileMatrixSetID = value;
            const tileMatrixSet = this._tilingScheme.tileMatrixSet;
            if (defined(tileMatrixSet)) {
                // const tileMatrices = tileMatrixSet.tileMatrices;
                // const length = tileMatrices.length;
                // for (let i = 0; i < length; i++) {
                //     if (defined(tileMatrices[i])) {
                //         this._minimumLevel = i;
                //         break;
                //     }
                // }
                // this._maximumLevel = length - 1;
                this._minimumLevel = this._options.minimumLevel ?? tileMatrixSet.minimumLevel;
                this._maximumLevel = this._options.maximumLevel ?? tileMatrixSet.maximumLevel;
                this._tileWidth = this._options.tileWidth ?? tileMatrixSet.tileWidth;
                this._tileHeight = this._options.tileHeight ?? tileMatrixSet.tileHeight;
            }
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
     * 获取服务支持的瓦片矩阵集标识列表。
     * @returns {string[]} 支持的瓦片矩阵集标识列表
     */
    get supportedTileMatrixSetIDs() {
        if (!this._ready) {
            throw new DeveloperError('tileMatrixSetIDs must not be called before the imagery provider is ready.');
        }
        return this._tileMatrixSetIDs;
    }

    /**
     * 获取服务支持的瓦片矩阵集映射。
     * @returns {object} 以标识为键的瓦片矩阵集映射
     */
    get supportedTileMatrixSets() {
        if (!this._ready) {
            throw new DeveloperError('tileMatrixSets must not be called before the imagery provider is ready.');
        }
        return this._tileMatrixSets;
    }

    /**
     * 获取瓦片像素宽度。
     * @returns {number} 瓦片像素宽度
     */
    get tileWidth() {
        if (!this._ready) {
            throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
        }
        return this._tileWidth;
    }

    /**
     * 获取瓦片像素高度。
     * @returns {number} 瓦片像素高度
     */
    get tileHeight() {
        if (!this._ready) {
            throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
        }
        return this._tileHeight;
    }

    /**
     * 获取最大层级。
     * @returns {number} 最大层级
     */
    get maximumLevel() {
        if (!this._ready) {
            throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
        }
        return this._maximumLevel;
    }

    /**
     * 获取最小层级。
     * @returns {number} 最小层级
     */
    get minimumLevel() {
        if (!this._ready) {
            throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
        }
        return this._minimumLevel;
    }

    /**
     * 获取切片方案。
     * @returns {TilingScheme} 切片方案
     */
    get tilingScheme() {
        if (!this._ready) {
            throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
        }
        return this._tilingScheme;
    }

    /**
     * 获取地图范围。
     * @returns {Rectangle} 地图范围
     */
    get rectangle() {
        if (!this._ready) {
            throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
        }
        return this._rectangle;
    }

    /**
     * 获取错误事件对象。
     * @returns {Event} 错误事件对象
     */
    get errorEvent() {
        return this._errorEvent;
    }

    /**
     * 获取影像提供者是否已就绪。
     * @returns {boolean} 是否已就绪
     */
    get ready() {
        return this._ready;
    }

    /**
     * 获取就绪 Promise。
     * @returns {Promise<boolean>} 就绪 Promise
     */
    get readyPromise() {
        return this._readyPromise.promise;
    }

    /**
     * 获取版权信息。
     * @returns {Credit} 版权信息
     */
    get credit() {
        return this._credit;
    }

    /**
     * 获取瓦片是否包含 Alpha 通道。
     * @returns {boolean} 是否包含 Alpha 通道，恒为 true
     */
    get hasAlphaChannel() {
        return true;
    }

    /**
     * 获取服务能力文档。
     * @returns {object} 服务能力文档
     */
    get capabilities() {
        return this._capabilities;
    }

    /**
     * 请求指定瓦片的影像，按 WMTS 规范组装查询参数，支持通过代理访问。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @param {Request} [request] 请求对象
     * @returns {Promise<HTMLImageElement|HTMLCanvasElement>} 影像加载 Promise
     */
    requestImage(x, y, level, request) {
        if (!this._ready) {
            throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
        }

        if (typeof this._tilingScheme.getTileActualNumber === 'function') {
            const actualNumber = this._tilingScheme.getTileActualNumber(x, y, level);
            x = actualNumber.x;
            y = actualNumber.y;
            level = actualNumber.level;
        }
        const query = {};
        query.layer = this._layer;
        if (defined(this._layerName))
            query.layerName = this._layerName;
        if (defined(this._style))
            query.style = this._style;
        const tileMatrixSet = this._tilingScheme.tileMatrixSet;
        if (defined(tileMatrixSet)) {
            const tileMatrix = tileMatrixSet.tileMatrices[level];
            if (defined(tileMatrix))
                query.tilematrix = tileMatrix.id;
            else
                query.tilematrix = level;
        } else
            query.tilematrix = level;
        query.tilerow = y;
        query.tilecol = x;
        if (defined(this._tileMatrixSetID))
            query.tilematrixset = this._tileMatrixSetID;
        query.format = this._format ?? 'image/jpeg';
        const resource = this._resource.getDerivedResource({
            queryParameters: query,
            request: request
        });
        resource.setQueryParameters(defaultParameters);
        if (defined(this._proxyResource)) {
            const proxyResource = this._proxyResource.getDerivedResource({
                queryParameters: {
                    url: resource.url
                },
                request: request
            });
            return ImageryProvider.loadImage(this, proxyResource);
        } else {
            return ImageryProvider.loadImage(this, resource);
        }
    }

    /**
     * 拾取指定位置的要素，当前未实现。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @param {number} longitude 经度
     * @param {number} latitude 纬度
     * @returns {undefined} 当前无返回值
     */
    pickFeatures(x, y, level, longitude, latitude) {
        // TODO
    }
};

export default WebMapTileServiceImageryProvider;
export { WebMapTileServiceImageryProvider };
