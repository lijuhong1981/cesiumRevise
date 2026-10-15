import { BasePrimitive } from "../additions/BasePrimitive.js";
import defineBaseShapeProperties from "../defines/defineBaseShapeProperties.js";

/**
 * 基础形状图元类，所有形状图元的基类。
 * @class BaseShapePrimitive
 * @extends BasePrimitive
 */
class BaseShapePrimitive extends BasePrimitive {
    /**
     * 初始化基类属性并应用传入的选项。
     * @param {object} options 选项
     */
    _init(options) {
        super._init(options);

        this.onInit(options);

        this.setOptions(options);

        if (options.material)
            this.material = options.material;

        this._readyCompleted();
    }

    /** 子类可覆盖的初始化钩子。 @param {object} options 选项 */
    onInit(options) { }

    /** 更新：依次调用 pre/post/last 三个阶段的钩子。 @param {object} frameState 帧状态 */
    onUpdate(frameState) {
        this.onPreUpdate(frameState);
        this.onPostUpdate(frameState);
        this.onLastUpdate(frameState);
    }

    /** 更新前钩子。 @param {object} frameState 帧状态 */
    onPreUpdate(frameState) { }

    /** 更新中钩子。 @param {object} frameState 帧状态 */
    onPostUpdate(frameState) { }

    /** 更新后钩子。 @param {object} frameState 帧状态 */
    onLastUpdate(frameState) { }
}

defineBaseShapeProperties(BaseShapePrimitive.prototype);

export default BaseShapePrimitive;
export { BaseShapePrimitive };
