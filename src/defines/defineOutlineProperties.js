import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Color, defined, DeveloperError, GeometryInstance } from 'cesium';
import parseToColor from "../parses/parseToColor.js";
import getGeometryInstanceAttributes from "../utils/getGeometryInstanceAttributes.js";
import PropertyType from "../additions/PropertyType.js";

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
                if (!defined(this._outline))
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

};

export default defineOutlineProperties;
export { defineOutlineProperties };
