import { BoundingRectangle, BoundingSphere, Cartesian2, Cartesian3, Cartesian4, Cartographic, Color, DistanceDisplayCondition, HeadingPitchRange, HeadingPitchRoll, Interval, Matrix3, Matrix4, NearFarScalar, PerspectiveFrustum, Plane, Quaternion, Ray, Rectangle } from "cesium";
import Geographic from "../additions/Geographic.js";

// --Cartesian2--
const scratchCanvasCoordinates = new Cartesian2(), // Cartesian2 画布坐标缓存
    scratchCartesian2 = new Cartesian2(), // Cartesian2 二维笛卡尔坐标缓存
    scratchPixelSize = new Cartesian2(), // Cartesian2 像素尺寸缓存
    scratchRepeat = new Cartesian2(1, 1), // Cartesian2 纹理重复次数缓存（默认 1,1）
    scratchScale2 = new Cartesian2(1, 1), // Cartesian2 二维缩放缓存（默认 1,1）
    scratchWindowPosition = new Cartesian2(); // Cartesian2 窗口坐标缓存

// --Cartesian3--
const scratchCartesian3 = new Cartesian3(), // Cartesian3 三维笛卡尔坐标缓存
    scratchDepthPosition = new Cartesian3(), // Cartesian3 深度位置缓存
    scratchEllipsoidPosition = new Cartesian3(), // Cartesian3 椭球位置缓存
    scratchEuler = new Cartesian3(), // Cartesian3 欧拉角缓存
    scratchGlobePosition = new Cartesian3(), // Cartesian3 地球表面位置缓存
    scratchPositionWC = new Cartesian3(), // Cartesian3 世界坐标位置缓存
    scratchScale3 = new Cartesian3(1, 1, 1), // Cartesian3 三维缩放缓存（默认 1,1,1）
    scratchTranslate = new Cartesian3(), // Cartesian3 平移量缓存
    scratchTranslation = new Cartesian3(), // Cartesian3 平移量缓存
    scratchCenter = new Cartesian3(), // Cartesian3 中心点缓存
    scratchDirection = new Cartesian3(), // Cartesian3 方向向量缓存
    scratchForward = new Cartesian3(), // Cartesian3 前方向向量缓存
    scratchNormal = new Cartesian3(), // Cartesian3 法线向量缓存
    scratchUp = new Cartesian3(), // Cartesian3 上方向向量缓存
    scratchUpCartesian3 = new Cartesian3(), // Cartesian3 上方向向量缓存
    scratchDownCartesian3 = new Cartesian3(), // Cartesian3 下方向向量缓存
    scratchLeftCartesian3 = new Cartesian3(), // Cartesian3 左方向向量缓存
    scratchLeftDirection = new Cartesian3(), // Cartesian3 左方向向量缓存
    scratchLeftNormal = new Cartesian3(), // Cartesian3 左法线向量缓存
    scratchRightCartesian3 = new Cartesian3(), // Cartesian3 右方向向量缓存
    scratchRightDirection = new Cartesian3(), // Cartesian3 右方向向量缓存
    scratchRightNormal = new Cartesian3(); // Cartesian3 右法线向量缓存

// --Cartesian4--
const scratchCartesian4 = new Cartesian4(), // Cartesian4 四维笛卡尔坐标缓存
    scratchNDC = new Cartesian4(); // Cartesian4 归一化设备坐标缓存

// --Cartographic--
const scratchCartographic = new Cartographic(), // Cartographic 制图坐标（经度、纬度、高度）缓存
    scratchLeftCartographic = new Cartographic(), // Cartographic 左侧制图坐标缓存
    scratchRightCartographic = new Cartographic(), // Cartographic 右侧制图坐标缓存
    scratchStartCartographic = new Cartographic(), // Cartographic 起点制图坐标缓存
    scratchEndCartographic = new Cartographic(); // Cartographic 终点制图坐标缓存

// --Matrix3--
const scratchMatrix3 = new Matrix3(), // Matrix3 三维矩阵缓存
    scratchRotationMatrix = new Matrix3(); // Matrix3 旋转矩阵缓存

// --Matrix4--
const scratchMatrix4 = new Matrix4(), // Matrix4 四维矩阵缓存
    scratchTransform = new Matrix4(), // Matrix4 变换矩阵缓存
    scratchViewMatrix = new Matrix4(); // Matrix4 视图矩阵缓存

// --Others--
const scratchBoundingRectangle = new BoundingRectangle(), // BoundingRectangle 包围矩形缓存
    scratchBoundingSphere = new BoundingSphere(), // BoundingSphere 包围球缓存
    scratchColor = new Color(), // Color 颜色缓存
    scratchDistanceDisplayCondition = new DistanceDisplayCondition(), // DistanceDisplayCondition 距离显示条件缓存
    scratchGeographic = new Geographic(), // Geographic 地理坐标缓存
    scratchHeadingPitchRange = new HeadingPitchRange(), // HeadingPitchRange 航向俯仰距离缓存
    scratchHeadingPitchRoll = new HeadingPitchRoll(), // HeadingPitchRoll 航向俯仰翻滚缓存
    scratchInterval = new Interval(), // Interval 区间缓存
    scratchTiltRestriction = new Interval(), // Interval 倾斜限制区间缓存
    scratchNearFarScalar = new NearFarScalar(), // NearFarScalar 近远标量缓存
    scratchPerspective = new PerspectiveFrustum(), // PerspectiveFrustum 透视视锥体缓存
    scratchPlane = new Plane(Cartesian3.UNIT_Z, 0), // Plane 平面缓存（法线为 UNIT_Z）
    scratchOrientation = new Quaternion(), // Quaternion 姿态四元数缓存
    scratchQuaternion = new Quaternion(), // Quaternion 四元数缓存
    scratchRay = new Ray(), // Ray 射线缓存
    scratchRectangle = new Rectangle(); // Rectangle 矩形缓存

let _scratchCamera;

/**
 * Cesium 常用临时对象的统一 scratch 缓存集合。
 * 集中存放各类可复用的临时对象（Cartesian2/3/4、Cartographic、Matrix3/4、Color 等），
 * 供内部计算复用以减少运行时对象创建与垃圾回收开销。
 * 使用约定：仅在同步计算过程中临时占用，不要长期持有其引用。
 */
const Scratch = {
    // --Cartesian2--
    scratchCartesian2,
    scratchPixelSize,
    scratchScale2,
    scratchCanvasCoordinates,
    scratchWindowPosition,
    scratchRepeat,
    // --Cartesian3--
    scratchCartesian3,
    scratchCenter,
    scratchLeftCartesian3,
    scratchRightCartesian3,
    scratchUpCartesian3,
    scratchDownCartesian3,
    scratchPositionWC,
    scratchTranslation,
    scratchTranslate,
    scratchEuler,
    scratchDirection,
    scratchLeftDirection,
    scratchRightDirection,
    scratchUp,
    scratchNormal,
    scratchLeftNormal,
    scratchRightNormal,
    scratchForward,
    scratchScale3,
    scratchEllipsoidPosition,
    scratchGlobePosition,
    scratchDepthPosition,
    // --Cartesian4--
    scratchCartesian4,
    scratchNDC,
    // --Cartographic--
    scratchCartographic,
    scratchLeftCartographic,
    scratchRightCartographic,
    scratchStartCartographic,
    scratchEndCartographic,
    // --Matrix3--
    scratchMatrix3,
    scratchRotationMatrix,
    // --Matrix4--
    scratchMatrix4,
    scratchTransform,
    scratchViewMatrix,
    // --Others--
    scratchBoundingRectangle,
    scratchBoundingSphere,
    scratchColor,
    scratchDistanceDisplayCondition,
    scratchGeographic,
    scratchHeadingPitchRange,
    scratchHeadingPitchRoll,
    scratchNearFarScalar,
    scratchQuaternion,
    scratchRay,
    scratchInterval,
    scratchTiltRestriction,
    scratchPlane,
    scratchRectangle,
    scratchOrientation,
    scratchPerspective,
};

Object.defineProperties(Scratch, {
    // Camera 相机实例的临时缓存（通过 get/set 访问）
    scratchCamera: {
        set: function (value) {
            _scratchCamera = value;
        },
        get: function () {
            return _scratchCamera;
        }
    }
});

export default Scratch;
export {
    Scratch,
    // ----
    scratchBoundingRectangle, scratchBoundingSphere, scratchCanvasCoordinates, scratchCartesian2, scratchCartesian3, scratchCartesian4, scratchCartographic, scratchCenter, scratchColor, scratchDepthPosition, scratchDirection, scratchDistanceDisplayCondition, scratchDownCartesian3, scratchEllipsoidPosition, scratchEndCartographic, scratchEuler, scratchForward, scratchGeographic, scratchGlobePosition, scratchHeadingPitchRange, scratchHeadingPitchRoll, scratchInterval, scratchTiltRestriction, scratchLeftCartesian3, scratchLeftCartographic, scratchLeftDirection, scratchLeftNormal, scratchMatrix3, scratchMatrix4, scratchNDC, scratchNearFarScalar, scratchNormal, scratchOrientation, scratchPerspective, scratchPixelSize, scratchPlane, scratchPositionWC, scratchQuaternion, scratchRay, scratchRectangle, scratchRepeat, scratchRightCartesian3, scratchRightCartographic, scratchRightDirection, scratchRightNormal, scratchRotationMatrix, scratchScale2, scratchScale3, scratchStartCartographic, scratchTransform, scratchTranslate, scratchTranslation, scratchUp, scratchUpCartesian3, scratchViewMatrix, scratchWindowPosition
};
