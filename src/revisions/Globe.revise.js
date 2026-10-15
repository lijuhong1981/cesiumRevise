import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Globe, GlobeSurfaceTileProvider } from "cesium";

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

export default Globe;
export { Globe, GlobeSurfaceTileProvider };
