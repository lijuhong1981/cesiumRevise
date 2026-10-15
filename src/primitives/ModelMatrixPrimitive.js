import BasePrimitive from "../additions/BasePrimitive.js";
import { Check, Event, Matrix4 } from "cesium";

/**
 * 模型矩阵图元基类，继承自 BasePrimitive。
 * 在图元基础上维护一个模型矩阵，支持矩阵变更事件与回调，供需要直接控制模型矩阵的图元复用。
 */
class ModelMatrixPrimitive extends BasePrimitive {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 初始化图元：创建模型矩阵变更事件并按配置初始化模型矩阵。
     * @param {object} options 配置项
     * @param {Matrix4} [options.modelMatrix] 初始模型矩阵，未提供时使用单位矩阵
     * @returns {void}
     */
    _init(options) {
        super._init(options);

        this._modelMatrixChanged = new Event();
        this._modelMatrix = Matrix4.clone(options.modelMatrix ?? Matrix4.IDENTITY);
    }

    /**
     * 获取模型矩阵变更事件对象。
     * @returns {Event} 模型矩阵变更事件对象
     */
    get modelMatrixChanged() {
        return this._modelMatrixChanged;
    }

    /**
     * 获取模型矩阵变更事件对象。
     * @deprecated 已废弃，请使用 modelMatrixChanged 替代
     * @returns {Event} 模型矩阵变更事件对象
     */
    get modelMatrixChangeEvent() {
        console.warn("modelMatrixChangeEvent is deprecated, use modelMatrixChanged instead");
        return this._modelMatrixChanged;
    }

    /**
     * 设置模型矩阵，值发生变化时触发模型矩阵变更事件。
     * @param {Matrix4} value 模型矩阵
     * @returns {void}
     */
    set modelMatrix(value) {
        Check.instanceOf('modelMatrix', value, Matrix4);
        if (!Matrix4.equals(value, this._modelMatrix)) {
            this._modelMatrix = Matrix4.clone(value, this._modelMatrix);
            this.raiseModelMatrixChangeEvent(this._modelMatrix);
        }
    }

    /**
     * 获取当前模型矩阵。
     * @returns {Matrix4} 模型矩阵
     */
    get modelMatrix() {
        return this._modelMatrix;
    }

    /**
     * 触发模型矩阵变更事件并调用对应回调。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    raiseModelMatrixChangeEvent(modelMatrix) {
        this._modelMatrixChanged.raiseEvent(modelMatrix);
        this.onModelMatrixChanged(modelMatrix);
    }

    /**
     * 模型矩阵发生变更时的回调钩子，子类可重写。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    onModelMatrixChanged(modelMatrix) { }

    /**
     * 销毁实例时清理资源，清空模型矩阵变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._modelMatrixChanged.clear();
        super.onDestroy();
    }
};

export default ModelMatrixPrimitive;
export { ModelMatrixPrimitive };