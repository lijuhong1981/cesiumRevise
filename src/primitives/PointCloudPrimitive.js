import SimpleShapePrimitive from "./SimpleShapePrimitive.js";
import definePointCloudProperties from "../defines/definePointCloudProperties.js";

/**
 * 点云图元类。
 * @class PointCloudPrimitive
 * @extends SimpleShapePrimitive
 */
class PointCloudPrimitive extends SimpleShapePrimitive {
    /** 底层点云 Primitive。 @returns {object} */
    get pointCloud() {
        return this.primitive;
    }

    /** 更新前：更新模型矩阵变换。 @param {object} frameState 帧状态 */
    onPreUpdate(frameState) {
        this._updateModelMatrixTransforms(frameState);
    }

    /** 更新后：同步模型矩阵并驱动底层 Primitive。 @param {object} frameState 帧状态 */
    onLastUpdate(frameState) {
        if (this.primitive)
            this.primitive.modelMatrix = this.computedModelMatrix;
        super.onLastUpdate(frameState);
    }

    /** 销毁回调。 */
    onDestroy() {
        this._destroyModelMatrixTransforms();
        super.onDestroy();
    }
}

definePointCloudProperties(PointCloudPrimitive.prototype);

export default PointCloudPrimitive;
export { PointCloudPrimitive };
