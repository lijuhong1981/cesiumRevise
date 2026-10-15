import Check from "@lijuhong1981/jscheck/src/Check.js";
import { defined } from 'cesium';
import PropertyType from "../additions/PropertyType.js";

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
                if (defined(value))
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
                if (defined(value))
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

};

export default definePolygonVolumeProperties;
export { definePolygonVolumeProperties };
