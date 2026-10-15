import BasePrimitive from "../additions/BasePrimitive.js";
import defineModelMatrixTransformsProperties from "../defines/defineModelMatrixTransformsProperties.js";

/**
 * 变换图元基类，继承自 BasePrimitive。
 * 通过 defineModelMatrixTransformsProperties 混入位置、旋转、缩放等模型矩阵变换能力，
 * 在每帧更新时同步变换矩阵，供需要按变换方式定位的图元复用。
 */
class TransformsPrimitive extends BasePrimitive {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 初始化图元并应用传入的变换配置。
     * @param {object} options 配置项，包含位置、旋转、缩放等变换参数
     * @returns {void}
     */
    _init(options) {
        super._init(options);

        this.setTransforms(options);
    }

    /**
     * 每帧更新钩子，委托给内部变换对象更新模型矩阵。
     * @param {FrameState} frameState 帧状态对象
     * @returns {void}
     */
    onUpdate(frameState) {
        this._updateModelMatrixTransforms(frameState);
    }

    /**
     * 销毁实例时清理变换相关资源并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._destroyModelMatrixTransforms();
        super.onDestroy();
    }
};

// 将模型矩阵变换相关属性（position/geographic/translation/rotation/euler/quaternion/scale/modelMatrix 等）混入原型
defineModelMatrixTransformsProperties(TransformsPrimitive.prototype);

export default TransformsPrimitive;
export { TransformsPrimitive };
