import { Cartesian2, Cartesian3, Check, Plane, PlaneGeometry, PlaneGeometryUpdater, PlaneOutlineGeometry } from 'cesium';
import parseToCartesian2 from '../parses/parseToCartesian2.js';
import parseToCartesian3 from '../parses/parseToCartesian3.js';
import parseToPlane from '../parses/parseToPlane.js';
import Scratch from '../utils/Scratch.js';
import defineComputedModelMatrixProperties from './defineComputedModelMatrixProperties.js';
import defineModelMatrixTransformsProperties from './defineModelMatrixTransformsProperties.js';
import ShapeType from './ShapeType.js';

/**
 * 为目标对象动态定义平面（Plane）类型的属性（平面方程、尺寸、几何选项及平面几何类型等），
 * 并按需挂载模型矩阵变换与计算模型矩阵相关属性。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function definePlaneProperties(target) {
    // 按需挂载模型矩阵变换属性
    if ('_updateModelMatrixTransforms' in target === false)
        defineModelMatrixTransformsProperties(target);

    Object.defineProperties(target, {
        // 形状类型标识
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Plane,
        },
        // 平面方程：法向量与到原点的距离
        plane: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToPlane(value, Scratch.scratchPlane);
                if (!this._plane || !Plane.equals(value, this._plane)) {
                    this._plane = Plane.clone(value, this._plane);
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('plane', value);
                }
            },
            get: function () {
                if (!this._plane)
                    this._plane = new Plane(Cartesian3.UNIT_Z, 0);
                return this._plane;
            }
        },
        normal: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                value.normalize();
                if (!Cartesian3.equals(value, this.normal)) {
                    this._plane.normal = value.clone(this._plane.normal);
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('normal', value);
                }
            },
            get: function () {
                return this.plane.normal;
            }
        },
        distance: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number('distance', value);
                if (this.distance !== value) {
                    this._plane.distance = value;
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('distance', value);
                }
            },
            get: function () {
                return this.plane.distance;
            }
        },
        // 平面尺寸：宽高二维向量及宽/高快捷属性
        dimensions: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
                if (!Cartesian2.equals(value, this._dimensions)) {
                    this._dimensions = value.clone(this._dimensions);
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('dimensions', value);
                }
            },
            get: function () {
                if (!this._dimensions) {
                    this._dimensions = new Cartesian2(1, 1);
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
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('width', value);
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
                    this.needsUpdateComputedModelMatrix = true;
                    this.raisePropertyChangeEvent('height', value);
                }
            },
            get: function () {
                return this.dimensions.y;
            }
        },
        // 几何构建相关：几何选项、填充/轮廓几何类型与计算模型矩阵的回调
        getGeometryOptions: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                if (!this._geometryOptions) {
                    this._geometryOptions = {};
                }
                return this._geometryOptions;
            }
        },
        fillGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PlaneGeometry
            },
        },
        outlineGeometryType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return PlaneOutlineGeometry
            },
        },
        onComputeModelMatrix: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (modelMatrix) {
                PlaneGeometryUpdater.createPrimitiveMatrix(this.plane, this.dimensions, modelMatrix, this.computedModelMatrix);
            }
        },
    });

    // 按需挂载计算模型矩阵属性
    if ('_updateComputedModelMatrix' in target === false)
        defineComputedModelMatrixProperties(target);

};

export default definePlaneProperties;
export { definePlaneProperties };
