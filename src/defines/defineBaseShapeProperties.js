import { Check, defined, DeveloperError, DistanceDisplayCondition, PrimitiveType, RuntimeError } from "cesium";
import parseToDistanceDisplayCondition from "../parses/parseToDistanceDisplayCondition.js";
import PropertyType from "../additions/PropertyType.js";

/**
 * 给目标对象定义基础形状通用属性（id、pickId、show、形状类型、几何图元类型、距离显示条件、深度测试、异步创建及 getGeometryOptions 等）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineBaseShapeProperties(target) {

    // 唯一标识与拾取标识
    if ('id' in target === false) {
        Object.defineProperty(target, 'id', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (this._id !== value)
                    this._id = value;
            },
            get: function () {
                return this._id;
            }
        });
    }

    if ('pickId' in target === false) {
        Object.defineProperty(target, 'pickId', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (this._pickId !== value)
                    this._pickId = value;
            },
            get: function () {
                return this._pickId;
            }
        });
    }

    // if ('pickPrimitive' in target === false) {
    //     Object.defineProperty(target, 'pickPrimitive', {
    //         configurable: true,
    //         set: function (value) {
    //             if (this._pickPrimitive !== value)
    //                 this._pickPrimitive = value;
    //         },
    //         get: function () {
    //             return this._pickPrimitive || this;
    //         }
    //     });
    // }

    // 可见性
    if ('show' in target === false) {
        Object.defineProperty(target, 'show', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('show', value);
                if (this._show !== value) {
                    this._show = value;
                    this.raisePropertyChangeEvent('show', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this._show;
            }
        });
    }

    Object.defineProperties(target, {
        // 形状类型与几何图元类型
        shapeType: {
            enumerable: true,
            configurable: true,
            get: function () {
                throw new RuntimeError('shapeType property must be overwrite.');
            }
        },
        primitiveGeometricType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PrimitiveType.TRIANGLES
            },
        },
        // 距离显示条件
        distanceDisplayCondition: {
            configurable: true,
            set: function (value) {
                value = parseToDistanceDisplayCondition(value);
                if (!DistanceDisplayCondition.equals(value, this._distanceDisplayCondition)) {
                    this._distanceDisplayCondition = value.clone(this._distanceDisplayCondition);
                    this.raisePropertyChangeEvent('distanceDisplayCondition', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this._distanceDisplayCondition;
            }
        },
        // 深度测试与异步创建
        depthTest: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('depthTest', value);
                if (this._depthTest !== value) {
                    this._depthTest = value;
                    this.raisePropertyChangeEvent('depthTest', value, PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined(this._depthTest))
                    this._depthTest = true;
                return this._depthTest;
            }
        },
        asynchronous: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('asynchronous', value);
                if (this._asynchronous !== value) {
                    this._asynchronous = value;
                    this.raisePropertyChangeEvent('asynchronous', PropertyType.PRIMITIVE);
                }
            },
            get: function () {
                if (!defined(this._asynchronous))
                    this._asynchronous = true;
                return this._asynchronous;
            }
        },
        // 几何体参数生成方法（须由子类覆盖实现）
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                throw new DeveloperError('getGeometryOptions function must be overwrite.');
            }
        }
    });

};

export default defineBaseShapeProperties;
export { defineBaseShapeProperties };
