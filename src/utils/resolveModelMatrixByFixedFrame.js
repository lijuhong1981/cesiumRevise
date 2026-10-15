import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian3, HeadingPitchRoll, Matrix4, Transforms } from "cesium";

/**
 * 将世界坐标下的模型矩阵分解为固定参考系下的位置、缩放与航向俯仰翻滚。
 * @param {Matrix4} modelMatrix 待分解的模型矩阵
 * @param {Ellipsoid} ellipsoid 参考椭球体
 * @param {Matrix4} fixedFrameTransform 固定参考系到世界坐标的变换矩阵
 * @param {object} [result={}] 用于存储结果的对象
 * @returns {object} 含 position（Cartesian3）、scale（Cartesian3）、rotation（HeadingPitchRoll）的结果对象
 */
function resolveModelMatrixByFixedFrame(modelMatrix, ellipsoid, fixedFrameTransform, result = {}) {
    Check.instanceOf('modelMatrix', modelMatrix, Matrix4);

    if (!result.position)
        result.position = new Cartesian3();
    result.position = Matrix4.getTranslation(modelMatrix, result.position);

    if (!result.scale)
        result.scale = new Cartesian3();
    result.scale = Matrix4.getScale(modelMatrix, result.scale);

    if (!result.rotation)
        result.rotation = new HeadingPitchRoll();
    result.rotation = Transforms.fixedFrameToHeadingPitchRoll(modelMatrix, ellipsoid, fixedFrameTransform, result.rotation);

    return result;
};

export default resolveModelMatrixByFixedFrame;
export { resolveModelMatrixByFixedFrame };
