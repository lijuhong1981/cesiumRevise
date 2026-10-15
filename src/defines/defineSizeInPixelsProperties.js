import Check from "@lijuhong1981/jscheck/src/Check.js";
import { BoundingSphere, defined, Matrix4 } from 'cesium';
import Scratch from "../utils/Scratch.js";

/**
 * 为目标对象动态定义“按像素固定尺寸”相关属性（开关、像素尺寸模型矩阵及内部更新方法）。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineSizeInPixelsProperties(target) {

    Object.defineProperties(target, {
        // 是否按像素固定尺寸
        sizeInPixels: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('sizeInPixels', value);
                if (this._sizeInPixels !== value) {
                    this._sizeInPixels = value;
                    this.raisePropertyChangeEvent('sizeInPixels', value);
                }
            },
            get: function () {
                return this._sizeInPixels;
            }
        },
        // 像素尺寸模型矩阵（惰性初始化为单位矩阵）
        pixelSizeModelMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                if (!defined(this._pixelSizeModelMatrix))
                    this._pixelSizeModelMatrix = Matrix4.IDENTITY.clone(new Matrix4())
                return this._pixelSizeModelMatrix;
            }
        },
        //private
        _updatePixelSizeModelMatrix: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                if (this.sizeInPixels) {
                    const boundingSphere = BoundingSphere.fromModelMatrix(this.computedModelMatrix, undefined, Scratch.scratchBoundingSphere);
                    const pixelSize = frameState.camera.getPixelSize(boundingSphere,
                        frameState.context.drawingBufferWidth,
                        frameState.context.drawingBufferHeight);
                    if (this._pixelSize !== pixelSize) {
                        this._pixelSize = pixelSize;
                        // console.log('pixelSize:', pixelSize, 'modelMatrix:', this._modelMatrix.clone());
                        Matrix4.multiplyByUniformScale(this.computedModelMatrix, pixelSize, this.pixelSizeModelMatrix);
                    }
                }
            },
        },
    });

};

export default defineSizeInPixelsProperties;
export { defineSizeInPixelsProperties };
