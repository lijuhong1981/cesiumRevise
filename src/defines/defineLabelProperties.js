import Check from "@lijuhong1981/jscheck/src/Check.js";
import isDestroyed from '@lijuhong1981/jsdestroy/src/isDestroyed.js';
import { Cartesian2, Cartesian3, Color, defined, destroyObject, DistanceDisplayCondition, NearFarScalar } from 'cesium';
import parseGeographicToCartesian from '../parses/parseGeographicToCartesian.js';
import parseHeightReference from '../parses/parseHeightReference.js';
import parseHorizontalOrigin from '../parses/parseHorizontalOrigin.js';
import parseLabelStyle from '../parses/parseLabelStyle.js';
import parseToCartesian2 from '../parses/parseToCartesian2.js';
import parseToCartesian3 from '../parses/parseToCartesian3.js';
import parseToColor from '../parses/parseToColor.js';
import parseToDistanceDisplayCondition from '../parses/parseToDistanceDisplayCondition.js';
import parseToNearFarScalar from '../parses/parseToNearFarScalar.js';
import parseVerticalOrigin from '../parses/parseVerticalOrigin.js';
import Scratch from '../utils/Scratch.js';

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
                if (!defined(this._show))
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
                    destroyObject(this._label);
                }
            }
        },
    });

};

export default defineLabelProperties;
export { defineLabelProperties };
