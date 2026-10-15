import { Check, defined } from 'cesium';
import createGeometry from '../utils/createGeometry.js';
import PropertyType from '../additions/PropertyType.js';
import ShapeType from './ShapeType.js';

/**
 * 为目标对象动态定义网格（Mesh）类型的属性（形状类型、几何数据、线框开关及其颜色/透明度别名、几何获取方法等）。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineMeshProperties(target) {

    Object.defineProperties(target, {
        // 基础类型标识与异步标志
        shapeType: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: ShapeType.Mesh,
        },
        asynchronous: {
            enumerable: true,
            writable: false,
            configurable: true,
            value: false,
        },
        // 几何数据（变更时标记 needsUpdateGeometry 待更新）
        geometry: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.defined('geometry', value);
                if (this._geometry !== value) {
                    this._geometry = value;
                    this.needsUpdateGeometry = true;
                }
            },
            get: function () {
                return this._geometry;
            }
        },
        // 线框开关及其颜色/透明度（别名到 outline 系列属性）
        wireframe: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.outline = value;
            },
            get: function () {
                return this.outline;
            }
        },
        wireframeColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.outlineColor = value;
            },
            get: function () {
                return this.outlineColor;
            }
        },
        wireframeOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.outlineOpacity = value;
            },
            get: function () {
                return this.outlineOpacity;
            }
        },
        // 填充几何与线框几何的获取/创建方法（别名）
        getFillGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.fillGeometry;
            }
        },
        createFillGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.fillGeometry;
            }
        },
        getOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        createOutlineGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        getWireframeGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        createWireframeGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                return this.wireframeGeometry;
            }
        },
        //private
        _updateGeometry: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                if (!defined(this._geometry))
                    return;
                if (this.needsUpdateGeometry) {
                    this.fillGeometry = createGeometry(this._geometry);
                    this.wireframeGeometry = this.fillGeometry.clone().toWireframe();

                    this.needsUpdateGeometry = false;
                    this.raisePropertyChangeEvent('geometry', this._geometry, PropertyType.GEOMETRY);
                }
            }
        },
    });

};

export default defineMeshProperties;
export { defineMeshProperties };
