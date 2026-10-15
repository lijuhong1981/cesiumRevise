import Check from "@lijuhong1981/jscheck/src/Check.js";
import isDestroyed from '@lijuhong1981/jsdestroy/src/isDestroyed.js';
import { Cartesian3, Color, defined, destroyObject, DistanceDisplayCondition, NearFarScalar } from 'cesium';
import parseGeographicToCartesian from '../parses/parseGeographicToCartesian.js';
import parseHeightReference from '../parses/parseHeightReference.js';
import parseToCartesian3 from '../parses/parseToCartesian3.js';
import parseToColor from '../parses/parseToColor.js';
import parseToDistanceDisplayCondition from '../parses/parseToDistanceDisplayCondition.js';
import parseToNearFarScalar from '../parses/parseToNearFarScalar.js';
import Scratch from '../utils/Scratch.js';

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
                if (!defined(this._show))
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
                    destroyObject(this._point);
                }
            }
        }
    });

};

export default definePointPrimitiveProperties;
export { definePointPrimitiveProperties };
