import Check from "@lijuhong1981/jscheck/src/Check.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import { Cartesian2, Cartesian3, Math as CesiumMath, Credit, defer, defined, DeveloperError, DiscardMissingTileImagePolicy, Event, GeographicTilingScheme, ImageryProvider, Rectangle, Resource, RuntimeError, WebMercatorProjection, WebMercatorTilingScheme } from "cesium";
import CustomTilingScheme from "./CustomTilingScheme.js";

const dynamicDomainTag = /{s}/g;

const defaultRange = Object.freeze({
    min: 1,
    max: 9
});

/**
 * 将 URL 中的动态域名标记 {s} 替换为指定范围内的随机整数。
 * @param {ArcGisMapImageryProvider} imageryProvider 影像提供者
 * @param {string} url 原始 URL
 * @returns {string} 替换后的 URL
 */
function buildDynamicDomainUrl(imageryProvider, url) {
    const range = imageryProvider._dynamicDomainRange;
    const randomInt = CesiumMath.randomInteger(range.min, range.max);
    return url.replace(dynamicDomainTag, randomInt);
}

/**
 * 根据瓦片行列号与层级构建影像瓦片请求 URL。
 * @param {ArcGisMapImageryProvider} imageryProvider 影像提供者
 * @param {number} x 瓦片 X 坐标
 * @param {number} y 瓦片 Y 坐标
 * @param {number} level 层级
 * @returns {string} 瓦片请求 URL
 */
function buildImageUrl(imageryProvider, x, y, level) {
    let url = imageryProvider.url + "/tile/{z}/{y}/{x}";
    if (imageryProvider._useDynamicDomain) {
        url = buildDynamicDomainUrl(imageryProvider, url);
    }

    url = url
        .replace('{x}', x)
        .replace('{y}', y)
        .replace('{z}', level);
    return url;
}

/**
 * ArcGIS 地图影像提供者，通过 ArcGIS 服务的元数据（tileInfo）动态构建切片方案，
 * 支持动态子域名（{s}）、Web 墨卡托与经纬度两种空间参考，并按需请求瓦片影像。
 */
class ArcGisMapImageryProvider extends Destroyable {
    /**
     * 创建 ArcGIS 地图影像提供者实例。
     * @param {object} options 配置项
     * @param {string} options.url 服务地址（必填）
     * @param {string} [options.token] 访问令牌
     * @param {object} [options.tileDiscardPolicy] 瓦片丢弃策略
     * @param {number} [options.tileWidth=256] 瓦片像素宽度
     * @param {number} [options.tileHeight=256] 瓦片像素高度
     * @param {number} [options.minimumLevel=0] 最小层级
     * @param {number} [options.maximumLevel] 最大层级
     * @param {TilingScheme} [options.tilingScheme] 切片方案
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体
     * @param {boolean} [options.usePreCachedTilesIfAvailable=true] 是否优先使用服务预缓存切片
     * @param {Rectangle} [options.rectangle] 地图范围
     * @param {object} [options.dynamicDomainRange] 动态域名随机范围 {min, max}
     * @param {string|Credit} [options.credit] 版权信息
     */
    constructor(options = {}) {
        super();
        Check.defined('options.url', options.url);

        const resource = Resource.createIfNeeded(options.url);
        // resource.appendForwardSlash();

        if (defined(options.token)) {
            resource.setQueryParameters({
                token: options.token
            });
        }

        this._resource = resource;
        this._tileDiscardPolicy = options.tileDiscardPolicy;

        this._tileWidth = options.tileWidth ?? 256;
        this._tileHeight = options.tileHeight ?? 256;
        this._minimumLevel = options.minimumLevel ?? 0;
        this._maximumLevel = options.maximumLevel ?? Number.MAX_SAFE_INTEGER;
        this._tilingScheme = options.tilingScheme ?? new GeographicTilingScheme({ ellipsoid: options.ellipsoid });
        this._useTiles = options.usePreCachedTilesIfAvailable ?? true;
        this._rectangle = options.rectangle || Rectangle.MAX_VALUE.clone();
        if (this.url.match(dynamicDomainTag)) {
            this._useDynamicDomain = true;
            this._dynamicDomainRange = options.dynamicDomainRange ?? defaultRange;
            const url = buildDynamicDomainUrl(this, this.url);
            this._metadataResource = new Resource({
                url: url,
                queryParameters: {
                    f: 'json'
                }
            });
        } else {
            this._metadataResource = this._resource.getDerivedResource({
                queryParameters: {
                    f: 'json'
                }
            });
        }

        const credit = options.credit;
        if (typeof credit === 'string') {
            credit = new Credit(credit);
        }
        this._credit = credit;

        this._errorEvent = new Event();

        this._ready = false;
        this._readyPromise = defer();

        const metadataSuccess = (data) => {
            if (this.isDestroyed()) {
                console.warn('the provider isDestroyed.', options);
                return;
            }
            this._metadata = data;
            const tileInfo = data.tileInfo;
            if (!defined(tileInfo)) {
                this._useTiles = false;
            } else {
                const tileWidth = this._tileWidth = tileInfo.rows;
                const tileHeight = this._tileHeight = tileInfo.cols;
                const wkid = this._wkid = tileInfo.spatialReference.wkid;
                const origin = this._origin = tileInfo.origin;
                this._useTms = tileInfo.tms;
                const fullExtent = this._fullExtent = data.fullExtent;

                const lods = tileInfo.lods;
                this._minimumLevel = lods[0].level;
                const length = lods.length;
                this._maximumLevel = lods[length - 1].level;
                console.log('parse minimumLevel:', this._minimumLevel, 'maximumLevel:', this._maximumLevel);

                if (wkid === 102100 || wkid === 102113 || wkid === 3857) {
                    this._tilingScheme = new WebMercatorTilingScheme({
                        ellipsoid: options.ellipsoid
                    });

                    const projection = new WebMercatorProjection(options.ellipsoid);
                    const sw = projection.unproject(new Cartesian3(Math.max(fullExtent.xmin, -this._tilingScheme.ellipsoid.maximumRadius * Math.PI), Math.max(fullExtent.ymin, -this._tilingScheme.ellipsoid.maximumRadius * Math.PI), 0.0));
                    const ne = projection.unproject(new Cartesian3(Math.min(fullExtent.xmax, this._tilingScheme.ellipsoid.maximumRadius * Math.PI), Math.min(fullExtent.ymax, this._tilingScheme.ellipsoid.maximumRadius * Math.PI), 0.0));
                    this._rectangle = new Rectangle(sw.longitude, sw.latitude, ne.longitude, ne.latitude);
                } else if (wkid === 4326 || wkid === 4490) {
                    this._rectangle = Rectangle.fromDegrees(fullExtent.xmin, fullExtent.ymin, fullExtent.xmax, fullExtent.ymax);

                    const resolutions = [];
                    for (let i = lods.length - 1; i >= 0; i--) {
                        resolutions[lods[i].level] = lods[i].resolution;
                    }
                    this._tilingScheme = new CustomTilingScheme({
                        ellipsoid: options.ellipsoid,
                        wkid: wkid,
                        origin: origin,
                        resolutions: resolutions,
                        tileWidth: tileWidth,
                        tileHeight: tileHeight,
                        rectangle: this._rectangle,
                    });
                } else {
                    const message = 'Tile spatial reference WKID ' + wkid + ' is not supported.';
                    const error = new RuntimeError(message);
                    this._readyPromise.reject(error);
                    return;
                }

                // Install the default tile discard policy if none has been supplied.
                if (!defined(this._tileDiscardPolicy)) {
                    this._tileDiscardPolicy = new DiscardMissingTileImagePolicy({
                        missingImageUrl: buildImageUrl(this, 0, 0, this._maximumLevel),
                        pixelsToCheck: [new Cartesian2(0, 0), new Cartesian2(200, 20), new Cartesian2(20, 200), new Cartesian2(80, 110), new Cartesian2(160, 130)],
                        disableCheckIfAllPixelsAreTransparent: true
                    });
                }

                this._useTiles = true;
            }

            if (defined(data.copyrightText) && data.copyrightText.length > 0) {
                this._credit = new Credit(data.copyrightText);
            }

            // resource.appendForwardSlash();
            this._ready = true;
            this._readyPromise.resolve(true);
        }

        const metadataFailure = (e) => {
            const message = 'An error occurred while accessing ' + this._resource.url + '.';
            const error = new RuntimeError(message);
            this._readyPromise.reject(error);
        }

        const requestMetadata = () => {
            this._metadataResource.fetchJsonp()
                .then(metadataSuccess)
                .catch(metadataFailure);
        }

        if (this._useTiles) {
            requestMetadata();
        } else {
            this._ready = true;
            this._readyPromise.resolve(true);
        }
    }

    /**
     * 获取服务地址。
     * @returns {string} 服务地址
     */
    get url() {
        return this._resource._url;
    }

    /**
     * 获取访问令牌。
     * @returns {string} 访问令牌
     */
    get token() {
        return this._resource.queryParameters.token;
    }

    /**
     * 获取代理对象。
     * @returns {object} 代理对象
     */
    get proxy() {
        return this._resource.proxy;
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
     * 获取瓦片丢弃策略。
     * @returns {object} 瓦片丢弃策略
     */
    get tileDiscardPolicy() {
        if (!this._ready) {
            throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
        }
        return this._tileDiscardPolicy;
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
     * 获取是否使用服务预缓存切片。
     * @returns {boolean} 是否使用预缓存切片
     */
    get usingPrecachedTiles() {
        return this._useTiles;
    }

    /**
     * 获取瓦片是否包含 Alpha 通道。
     * @returns {boolean} 是否包含 Alpha 通道，恒为 true
     */
    get hasAlphaChannel() {
        return true;
    }

    /**
     * 获取服务元数据。
     * @returns {object} 服务元数据
     */
    get metadata() {
        return this._metadata;
    }

    /**
     * 获取空间参考 WKID。
     * @returns {number} 空间参考 WKID
     */
    get wkid() {
        return this._wkid;
    }

    /**
     * 获取瓦片原点坐标。
     * @returns {object} 瓦片原点坐标
     */
    get origin() {
        return this._origin;
    }

    /**
     * 获取服务完整范围。
     * @returns {object} 服务完整范围
     */
    get fullExtent() {
        return this._fullExtent;
    }

    /**
     * 获取指定瓦片的版权信息。
     * @param {number} x 瓦片 X 坐标
     * @param {number} y 瓦片 Y 坐标
     * @param {number} level 层级
     * @returns {Credit[]|undefined} 版权信息数组，当前恒为 undefined
     */
    getTileCredits(x, y, level) {
        return undefined;
    }

    /**
     * 请求指定瓦片的影像。
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
        if (this._useTms) {
            // tms切片以左下为原点排序，所以y方向序号需要反序
            y = this._tilingScheme.getNumberOfYTilesAtLevel(level) - y;
        }
        const url = buildImageUrl(this, x, y, level);
        return ImageryProvider.loadImage(this, url);
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

export default ArcGisMapImageryProvider;
export { ArcGisMapImageryProvider };
