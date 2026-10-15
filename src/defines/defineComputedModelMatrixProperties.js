import { Event, Matrix4 } from "cesium";
import PropertyType from "../additions/PropertyType.js";

/**
 * 惰性创建宿主对象的内部计算模型矩阵（仅创建一次），初始为单位矩阵。
 * @param {object} that 宿主对象
 * @returns {void}
 */
function ensureComputedModelMatrix(that) {
    if (!that._computedModelMatrix) {
        that._computedModelMatrix = Matrix4.IDENTITY.clone();
    }
}

/**
 * 惰性创建宿主对象的计算模型矩阵变更事件对象（仅创建一次）。
 * @param {object} that 宿主对象
 * @returns {void}
 */
function ensureComputedModelMatrixChangeEvent(that) {
    if (!that._computedModelMatrixChangeEvent) {
        that._computedModelMatrixChangeEvent = new Event();
    }
}

/**
 * 给目标对象定义计算模型矩阵相关属性与方法（computedModelMatrix、变更事件、变更触发，
 * 以及 onComputeModelMatrix / onComputedModelMatrixChanged 可覆盖钩子）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineComputedModelMatrixProperties(target) {

    Object.defineProperties(target, {
        // 计算模型矩阵及其变更事件
        computedModelMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureComputedModelMatrix(this);
                return this._computedModelMatrix;
            },
        },
        computedModelMatrixChangeEvent: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureComputedModelMatrixChangeEvent(this);
                return this._computedModelMatrixChangeEvent;
            },
        },
        // 触发计算模型矩阵变更事件并回调
        raiseComputedModelMatrixChangeEvent: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (computedModelMatrix) {
                this.computedModelMatrixChangeEvent.raiseEvent(this, computedModelMatrix);
                this.onComputedModelMatrixChanged(computedModelMatrix);
            },
        },
        // 模型矩阵变化时标记需要重新计算
        onModelMatrixChanged: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (modelMatrix) {
                this.needsUpdateComputedModelMatrix = true;
            },
        },
        //private
        _updateComputedModelMatrix: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                if (this.needsUpdateComputedModelMatrix) {
                    this.onComputeModelMatrix(this.modelMatrix);
                    this.raiseComputedModelMatrixChangeEvent(this.computedModelMatrix);
                    this.needsUpdateComputedModelMatrix = false;
                    return true;
                }
            }
        },
    });

    // 计算模型矩阵的可覆盖钩子（计算逻辑与计算完成回调）
    if ('onComputeModelMatrix' in target === false)
        Object.defineProperty(target, 'onComputeModelMatrix', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (modelMatrix) { },
        });
    if ('onComputedModelMatrixChanged' in target === false)
        Object.defineProperty(target, 'onComputedModelMatrixChanged', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (computedModelMatrix) {
                this.raisePropertyChangeEvent('computedModelMatrix', computedModelMatrix, PropertyType.MODELMATRIX);
            },
        });

};

export default defineComputedModelMatrixProperties;
export { defineComputedModelMatrixProperties };
