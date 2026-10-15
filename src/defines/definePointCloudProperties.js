import isTypedArray from "@lijuhong1981/jscheck/src/isTypedArray.js";
import { Cartesian3, Check, Color, defined, GeometryInstance, PrimitiveType } from 'cesium';
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import parseToColor from "../parses/parseToColor.js";
import createPointCloudGeometry from "../utils/createPointCloudGeometry.js";
import getGeometryInstanceAttributes from '../utils/getGeometryInstanceAttributes.js';
import defineModelMatrixTransformsProperties from "./defineModelMatrixTransformsProperties.js";
import PropertyType from "../additions/PropertyType.js";
import ShapeType from "./ShapeType.js";

/**
 * 为目标对象动态定义点云（PointCloud）类型的属性（点位置/颜色集合、增删操作、外观样式及几何/几何实例创建方法等），
 * 并按需挂载模型矩阵变换属性。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function definePointCloudProperties(target) {

    // 按需挂载模型矩阵变换属性
    if ('_updateModelMatrixTransforms' in target === false)
        defineModelMatrixTransformsProperties(target);

    Object.defineProperties(target, {
        // 基础类型标识与图元配置（点图元、平面着色、面向前方、异步、顶点压缩）
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.PointCloud,
        },
        primitiveGeometricType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PrimitiveType.POINTS
            },
        },
        flat: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: true,
        },
        faceForward: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: true,
        },
        asynchronous: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: false,
        },
        compressVertices: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: false,
        },
        // 点数据集合：位置数组、点数量与颜色数组
        positions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.defined('positions', value);
                if (value instanceof ArrayBuffer)
                    value = new Float64Array(value);
                if (isTypedArray(value))
                    value = Cartesian3.unpackArray(value);
                else if (Array.isArray(value)) {
                    if (typeof value[0] === "number")
                        value = Cartesian3.unpackArray(value);
                }
                if (this._positions !== value) {
                    this._positions = value;
                    this.needsUpdateGeometry = true;
                    this.raisePropertyChangeEvent('positions', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._positions))
                    this._positions = [];
                return this._positions;
            }
        },
        numberOfPoints: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.positions.length;
            }
        },
        colors: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.defined('colors', value);
                if (value instanceof ArrayBuffer)
                    value = new Uint8Array(value);
                if (isTypedArray(value))
                    value = Color.unpackArrayFromBytes(value);
                else if (Array.isArray(value)) {
                    if (typeof value[0] === "number")
                        value = Color.unpackArrayFromBytes(value);
                }
                if (this._colors !== value) {
                    this._colors = value;
                    this.needsUpdateGeometry = true;
                    this.raisePropertyChangeEvent('colors', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                if (!defined(this._colors))
                    this._colors = [];
                return this._colors;
            }
        },
        // 点增删操作：添加单个/批量、按索引删除、清空
        add: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (position, color) {
                position = parseToCartesian3(position, undefined, false);
                color = color ?
                    parseToColor(color) :
                    Color.fromRandom({
                        alpha: 1.0,
                    });
                this.positions.push(position);
                const index = this.positions.lastIndexOf(position);
                this.colors[index] = color;
                this.needsUpdateGeometry = true;
                this.raisePropertyChangeEvent('positions', this.positions, PropertyType.GEOMETRY);
                this.raisePropertyChangeEvent('colors', this.colors, PropertyType.GEOMETRY);
            },
        },
        addArray: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (array) {
                Check.typeOf.array('array', array);
                array.forEach(element => {
                    this.add(element.position, element.color);
                });
            },
        },
        removeAt: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (startIndex, deleteCount = 1) {
                Check.typeOf.number('startIndex', startIndex);
                this.positions.splice(startIndex, deleteCount);
                this.colors.splice(startIndex, deleteCount);
                this.raisePropertyChangeEvent('positions', this.positions, PropertyType.GEOMETRY);
                this.raisePropertyChangeEvent('colors', this.colors, PropertyType.GEOMETRY);
            }
        },
        removeAll: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.positions.length = 0;
                this.colors.length = 0;
                this.needsUpdateGeometry = true;
                this.raisePropertyChangeEvent('positions', this.positions, PropertyType.GEOMETRY);
                this.raisePropertyChangeEvent('colors', this.colors, PropertyType.GEOMETRY);
            },
        },
        // 外观样式：整体颜色、透明度、点大小与逐顶点着色开关
        color: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value);
                if (!Color.equalsRgb(this._color, value)) {
                    this._color = value.cloneRgb(this._color);
                    this.raisePropertyChangeEvent('color', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined(this._color))
                    this._color = Color.DARKGRAY.clone();
                return this._color;
            }
        },
        opacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
                if (this.color.alpha !== value) {
                    this.color.alpha = value;
                    this.raisePropertyChangeEvent('opacity', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this.color.alpha;
            }
        },
        pointSize: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('pointSize', value);
                if (this._pointSize !== value) {
                    this._pointSize = value;
                    this.raisePropertyChangeEvent('pointSize', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined(this._pointSize))
                    this._pointSize = 3;
                return this._pointSize;
            },
        },
        perVertexColors: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('perVertexColors', value);
                if (this._perVertexColors !== value) {
                    this._perVertexColors = value;
                    this.raisePropertyChangeEvent('perVertexColors', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                if (!defined(this._perVertexColors))
                    this._perVertexColors = true;
                return this._perVertexColors;
            }
        },
        // 几何构建：创建几何、获取几何实例属性与创建几何实例
        createGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (this.needsUpdateGeometry || !this._geometry) {
                    this._geometry = createPointCloudGeometry({
                        positions: this.positions,
                        colors: this.colors,
                    });
                    this.needsUpdateGeometry = false;
                }
                return this._geometry;
            }
        },
        getGeometryInstanceAttributes: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return getGeometryInstanceAttributes(this.show, undefined, this._distanceDisplayCondition, undefined, this.pointSize, this.perVertexColors, this.color);
            }
        },
        createGeometryInstance: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (enableModelMatrix = true) {
                if (this.numberOfPoints === 0)
                    return;
                const geometry = this.createGeometry();
                const attributes = this.getGeometryInstanceAttributes();
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

};

export default definePointCloudProperties;
export { definePointCloudProperties };
