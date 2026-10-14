import { Cartesian3, Check, Matrix4, Quaternion, Transforms } from "cesium";
import parseAttitudeToQuaternion from "../parses/parseAttitudeToQuaternion.js";
import parseEulerToQuaternion from "../parses/parseEulerToQuaternion.js";
import parseGeographicToCartesian from "../parses/parseGeographicToCartesian.js";
import parseRotationToQuaternion from "../parses/parseRotationToQuaternion.js";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import Scratch from "../utils/Scratch.js";

/**
 * 根据多种来源选项计算模型矩阵（世界坐标到局部坐标的变换矩阵）。
 * 支持通过原点/经纬度/原点矩阵、变换前后矩阵以及平移、旋转/姿态/欧拉角、缩放等组合生成。
 * @param {object} options 参数对象
 * @param {Matrix4|Cartesian3|object} [options.origin] 原点，可为 Matrix4 或可解析为 Cartesian3 的位置
 * @param {Ellipsoid} [options.ellipsoid] 参考椭球体
 * @param {Matrix4} [options.originMatrix] 原点矩阵，也支持 fixedFrame/fixedFrameMatrix/localFrame/localFrameMatrix 别名
 * @param {object} [options.geographic] 地理坐标原点
 * @param {Cartesian3|object} [options.position] 位置原点，也支持 originPosition/center 别名
 * @param {Matrix4} [options.beforeTransform] 前置变换矩阵，也支持 beforeTransformtion/beforeTransformMatrix 别名
 * @param {Matrix4} [options.transform] 变换矩阵，也支持 transformation/transformMatrix/localTransform/localTransformMatrix 别名
 * @param {Cartesian3} [options.translation] 平移量
 * @param {Quaternion|object} [options.rotation] 旋转四元数
 * @param {object} [options.attitude] 姿态
 * @param {object} [options.euler] 欧拉角，也支持 eulerRotation 别名
 * @param {Cartesian3} [options.scale] 缩放
 * @param {Matrix4} [options.afterTransform] 后置变换矩阵，也支持 afterTransformtion/afterTransformMatrix 别名
 * @param {Matrix4} [result] 用于存储结果的矩阵，未提供则新建
 * @returns {Matrix4} 计算得到的模型矩阵
 */
function computeModelMatrix(options, result) {
    Check.typeOf.object('options', options);

    if (result === undefined)
        result = Matrix4.IDENTITY.clone(new Matrix4());
    else
        result = Matrix4.IDENTITY.clone(result);

    if (options.origin) {
        if (options.origin instanceof Matrix4)
            Matrix4.clone(options.origin, result);
        else {
            const origin = parseToCartesian3(options.origin, Scratch.scratchCartesian3, 0.0);
            if (!Cartesian3.equals(Cartesian3.ZERO, origin))
                Transforms.eastNorthUpToFixedFrame(origin, options.ellipsoid, result);
        }
    } else if (options.originMatrix || options.fixedFrame || options.fixedFrameMatrix || options.localFrame || options.localFrameMatrix) {
        const originMatrix = options.originMatrix || options.fixedFrame || options.fixedFrameMatrix || options.localFrame || options.localFrameMatrix;
        Check.instanceOf('originMatrix', originMatrix, Matrix4);
        Matrix4.clone(originMatrix, result);
    } else {
        let origin;
        if (options.geographic)
            origin = parseGeographicToCartesian(options.geographic, Scratch.scratchCartesian3, options.ellipsoid);
        else if (options.position || options.originPosition || options.center) {
            origin = options.position || options.originPosition || options.center;
            origin = parseToCartesian3(origin, Scratch.scratchCartesian3, 0.0);
        }
        if (origin && !Cartesian3.equals(Cartesian3.ZERO, origin))
            Transforms.eastNorthUpToFixedFrame(origin, options.ellipsoid, result);
    }

    if (options.beforeTransform || options.beforeTransformtion || options.beforeTransformMatrix) {
        const beforeTransform = options.beforeTransform || options.beforeTransformtion || options.beforeTransformMatrix;
        Check.instanceOf('beforeTransform', beforeTransform, Matrix4);
        if (!Matrix4.equals(beforeTransform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, beforeTransform, result);
    }

    if (options.transform || options.transformation || options.transformMatrix || options.localTransform || options.localTransformMatrix) {
        const transform = options.transform || options.transformation || options.transformMatrix || options.localTransform || options.localTransformMatrix;
        Check.instanceOf('transform', transform, Matrix4);
        if (!Matrix4.equals(transform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, transform, result);
    } else {
        const transform = Matrix4.IDENTITY.clone(Scratch.scratchTransform);

        const translation = Cartesian3.ZERO.clone(Scratch.scratchTranslation);
        if (options.translation)
            parseToCartesian3(options.translation, translation, 0.0);

        const quaternion = Quaternion.IDENTITY.clone(Scratch.scratchQuaternion);
        if (options.rotation)
            parseRotationToQuaternion(options.rotation, quaternion);
        else if (options.attitude)
            parseAttitudeToQuaternion(options.attitude, quaternion);
        else if (options.euler || options.eulerRotation)
            parseEulerToQuaternion(options.euler || options.eulerRotation, quaternion);

        const scale = Cartesian3.ONE.clone(Scratch.scratchScale3);
        if (options.scale)
            parseToCartesian3(options.scale, scale, 1.0);

        Matrix4.fromTranslationQuaternionRotationScale(translation, quaternion, scale, transform);

        if (!Matrix4.equals(transform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, transform, result);
    }

    if (options.afterTransform || options.afterTransformtion || options.afterTransformMatrix) {
        const afterTransform = options.afterTransform || options.afterTransformtion || options.afterTransformMatrix;
        Check.instanceOf('afterTransform', afterTransform, Matrix4);
        if (!Matrix4.equals(afterTransform, Matrix4.IDENTITY))
            Matrix4.multiplyTransformation(result, afterTransform, result);
    }

    return result;
};

export default computeModelMatrix;
export { computeModelMatrix };
