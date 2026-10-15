import { Check, CylinderGeometry, CylinderOutlineGeometry, defined } from "cesium";
import PropertyType from "../additions/PropertyType.js";
import ShapeType from "./ShapeType.js";

/**
 * 给目标对象定义圆柱（Cylinder）形状相关属性（形状类型、半径与长度、细分参数、几何体参数生成方法、fill/outline 几何类型）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineCylinderProperties(target) {

    Object.defineProperties(target, {
        // 形状类型
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Cylinder,
        },
        // 半径与长度相关属性
        topRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('topRadius', value, 0);
                if (this._topRadius !== value) {
                    this._topRadius = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('topRadius', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._topRadius)) {
                    this._topRadius = 1;
                }
                return this._topRadius;
            }
        },
        bottomRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('bottomRadius', value, 0);
                if (this._bottomRadius !== value) {
                    this._bottomRadius = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('bottomRadius', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._bottomRadius)) {
                    this._bottomRadius = 1;
                }
                return this._bottomRadius;
            }
        },
        radius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.topRadius = value;
                this.bottomRadius = value;
            }
        },
        length: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('length', value, 0);
                if (this._length !== value) {
                    this._length = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('length', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._length)) {
                    this._length = 1;
                }
                return this._length;
            }
        },
        // 细分参数
        slices: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('slices', value, 3);
                if (this._slices !== value) {
                    this._slices = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('slices', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._slices))
                    this._slices = 64;
                return this._slices;
            }
        },
        numberOfVerticalLines: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('numberOfVerticalLines', value, 0);
                if (this._numberOfVerticalLines !== value) {
                    this._numberOfVerticalLines = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('numberOfVerticalLines', value, PropertyType.OUTLINEGEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._numberOfVerticalLines))
                    this._numberOfVerticalLines = 0;
                return this._numberOfVerticalLines;
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
                        topRadius: this.topRadius,
                        bottomRadius: this.bottomRadius,
                        length: this.length,
                        slices: this.slices,
                        numberOfVerticalLines: this.numberOfVerticalLines,
                    };

                    this.needsUpdateGeometryOptions = false;
                }
                return this._geometryOptions;
            }
        },
        // fill/outline 几何类型
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return CylinderGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return CylinderOutlineGeometry
            },
        },
    });

};

export default defineCylinderProperties;
export { defineCylinderProperties };
