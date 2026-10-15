import Check from "@lijuhong1981/jscheck/src/Check.js";
import { BoxGeometry, BoxOutlineGeometry, Cartesian3 } from "cesium";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import PropertyType from "../additions/PropertyType.js";
import ShapeType from "./ShapeType.js";

/**
 * 给目标对象定义长方体（Box）形状相关属性（形状类型、尺寸、几何体参数生成方法、fill/outline 几何体与几何类型）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineBoxProperties(target) {

    Object.defineProperties(target, {
        // 形状类型
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Box,
        },
        // 尺寸相关属性（dimensions 及宽/高/深快捷属性）
        dimensions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value);
                if (!Cartesian3.equals(value, this._dimensions)) {
                    this._dimensions = value.clone(this._dimensions);
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('dimensions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!this._dimensions) {
                    this._dimensions = new Cartesian3(1, 1, 1);
                }
                return this._dimensions;
            }
        },
        width: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('width', value, 0);
                if (this.width !== value) {
                    this._dimensions.x = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('width', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.dimensions.x;
            }
        },
        height: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('height', value, 0);
                if (this.height !== value) {
                    this._dimensions.y = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('height', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.dimensions.y;
            }
        },
        depth: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('depth', value, 0);
                if (this.depth !== value) {
                    this._dimensions.z = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('depth', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.dimensions.z;
            }
        },
        // 几何体参数生成方法
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this.needsUpdateGeometryOptions || !this._geometryOptions) {
                    this._geometryOptions = {
                        dimensions: this.dimensions,
                    };
                    this.needsUpdateGeometryOptions = false;
                }
                return this._geometryOptions;
            }
        },
        // 几何体生成方法（填充体与轮廓线）
        getFillGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return BoxGeometry.fromDimensions(this.getGeometryOptions());
            }
        },
        getOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return BoxOutlineGeometry.fromDimensions(this.getGeometryOptions());
            }
        },
        // fill/outline 几何类型
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return BoxGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return BoxOutlineGeometry
            },
        },
    });

};

export default defineBoxProperties;
export { defineBoxProperties };
