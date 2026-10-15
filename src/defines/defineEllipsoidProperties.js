import { Cartesian3, Math as CesiumMath, Check, defined, EllipsoidGeometry, EllipsoidOutlineGeometry } from 'cesium';
import PropertyType from '../additions/PropertyType.js';
import ShapeType from '../defines/ShapeType.js';
import parseToCartesian3 from '../parses/parseToCartesian3.js';
import Scratch from '../utils/Scratch.js';

/**
 * 惰性创建宿主对象的半径向量（仅创建一次），初始为 (1, 1, 1)。
 * @param {object} that 宿主对象
 * @returns {void}
 */
function ensureRadii(that) {
    if (!that._radii)
        that._radii = new Cartesian3(1, 1, 1);
}

/**
 * 给目标对象定义椭球（Ellipsoid）形状相关属性（形状类型、外/内半径、时钟角与锥角范围、细分参数、几何体参数生成方法、fill/outline 几何类型）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineEllipsoidProperties(target) {

    Object.defineProperties(target, {
        // 形状类型
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Ellipsoid,
        },
        // 外半径相关属性（radii 及 x/y/z 半径快捷属性）
        radii: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3);
                if (!Cartesian3.equals(value, this._radii)) {
                    this._radii = value.clone(this._radii);
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                ensureRadii(this);
                return this._radii;
            }
        },
        radius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('radius', value, 0);
                this.radii = new Cartesian3(value, value, value);
            }
        },
        xRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('xRadius', value, 0);
                if (this.radii.x !== value) {
                    this.radii.x = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.radii.x;
            }
        },
        yRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('yRadius', value, 0);
                if (this.radii.y !== value) {
                    this.radii.y = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.radii.y;
            }
        },
        zRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('zRadius', value, 0);
                if (this.radii.z !== value) {
                    this.radii.z = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('radii', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this.radii.z;
            }
        },
        // 内半径（挖空）相关属性
        innerRadii: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (defined(value)) {
                    value = parseToCartesian3(value, Scratch.scratchCartesian3);
                    if (!Cartesian3.equals(value, this._innerRadii)) {
                        this._innerRadii = value.clone(this._innerRadii);
                        this.needsUpdateGeometryOptions = true;
                        this.raisePropertyChangeEvent('innerRadii', value, PropertyType.GEOMETRY);
                    }
                } else {
                    if (this._innerRadii !== value) {
                        this._innerRadii = undefined;
                        this.needsUpdateGeometryOptions = true;
                        this.raisePropertyChangeEvent('innerRadii', value, PropertyType.GEOMETRY);
                    }
                }
            },
            get: function () {
                return this._innerRadii;
            }
        },
        innerRadius: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('innerRadius', value, 0);
                this.innerRadii = new Cartesian3(value, value, value);
            }
        },
        // 时钟角范围（弧度与角度两种表达）
        minimumClock: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumClock', value);
                if (this._minimumClock !== value) {
                    this._minimumClock = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('minimumClock', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._minimumClock;
            }
        },
        minimumClockDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumClockDegrees', value);
                this.minimumClock = CesiumMath.toRadians(value);
            },
            get: function () {
                if (defined(this._minimumClock))
                    return CesiumMath.toDegrees(this._minimumClock);
            }
        },
        maximumClock: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumClock', value);
                if (this._maximumClock !== value) {
                    this._maximumClock = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('maximumClock', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._maximumClock;
            }
        },
        maximumClockDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumClockDegrees', value);
                this.maximumClock = CesiumMath.toRadians(value);
            },
            get: function () {
                if (defined(this._maximumClock))
                    return CesiumMath.toDegrees(this._maximumClock);
            }
        },
        // 锥角范围（弧度与角度两种表达）
        minimumCone: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumCone', value);
                if (this._minimumCone !== value) {
                    this._minimumCone = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('minimumCone', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._minimumCone;
            }
        },
        minimumConeDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('minimumConeDegrees', value);
                this.minimumCone = CesiumMath.toRadians(value);
            },
            get: function () {
                if (defined(this._minimumCone))
                    return CesiumMath.toDegrees(this._minimumCone);
            }
        },
        maximumCone: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumCone', value);
                if (this._maximumCone !== value) {
                    this._maximumCone = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('maximumCone', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._maximumCone;
            }
        },
        maximumConeDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('maximumConeDegrees', value);
                this.maximumCone = CesiumMath.toRadians(value);
            },
            get: function () {
                if (defined(this._maximumCone))
                    return CesiumMath.toDegrees(this._maximumCone);
            }
        },
        // 细分参数
        slicePartitions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('slicePartitions', value, 3);
                if (this._slicePartitions !== value) {
                    this._slicePartitions = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('slicePartitions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._slicePartitions))
                    this._slicePartitions = 64;
                return this._slicePartitions;
            }
        },
        stackPartitions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('stackPartitions', value, 3);
                if (this._stackPartitions !== value) {
                    this._stackPartitions = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('stackPartitions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._stackPartitions))
                    this._stackPartitions = 32;
                return this._stackPartitions;
            }
        },
        subdivisions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThan('subdivisions', value, 0);
                if (this._subdivisions !== value) {
                    this._subdivisions = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('subdivisions', value, PropertyType.OUTLINEGEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._subdivisions))
                    this._subdivisions = 32;
                return this._subdivisions;
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
                        radii: this.radii,
                        innerRadii: this._innerRadii,
                        minimumClock: this._minimumClock,
                        maximumClock: this._maximumClock,
                        minimumCone: this._minimumCone,
                        maximumCone: this._maximumCone,
                        slicePartitions: this.slicePartitions,
                        stackPartitions: this.stackPartitions,
                        subdivisions: this.subdivisions,
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
                return EllipsoidGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return EllipsoidOutlineGeometry
            },
        },
    });
};

export default defineEllipsoidProperties;
export { defineEllipsoidProperties };
