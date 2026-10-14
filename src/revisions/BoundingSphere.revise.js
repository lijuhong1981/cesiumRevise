import { BoundingSphere, Cartesian3, Check, defined, Matrix4 } from "cesium";
import parseGeographicsToPositions from "../parses/parseGeographicsToPositions.js";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 BoundingSphere 类，补充从中心点/半径、地理坐标、模型矩阵创建包围球，
 * 以及计算到世界坐标点、相机的距离等方法。
 * @class BoundingSphere
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/BoundingSphere.html}
*/

/**
 * 从中心点与半径创建包围球。
 * @param {Cartesian3} center 包围球中心点（世界坐标）。
 * @param {number} [radius=0] 包围球半径，单位米。
 * @param {BoundingSphere} [result=new BoundingSphere()] 用于存储结果的可选对象。
 * @returns {BoundingSphere} 生成或填充后的包围球。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.fromElements = function (center, radius = 0, result = new BoundingSphere()) {
    result.center = center;
    result.radius = radius;
    return result;
};

/**
 * 从一组地理坐标创建包围球，通过计算这些点在世界坐标系下的包围范围得到。
 * @param {Array|object} geographics 地理坐标点集合。
 * @param {Ellipsoid} [ellipsoid] 参考椭球体。
 * @param {BoundingSphere} [result] 用于存储结果的可选对象。
 * @returns {BoundingSphere} 包含所有点的包围球。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.fromGeographics = function (geographics, ellipsoid, result) {
    const positions = parseGeographicsToPositions(geographics, undefined, ellipsoid);
    return BoundingSphere.fromPoints(positions, result);
};

/**
 * 从模型矩阵与半径创建包围球，中心点取矩阵的平移分量。
 * @param {Matrix4} modelMatrix 模型矩阵。
 * @param {number} [radius] 包围球半径；未提供时保留结果对象原有的半径。
 * @param {BoundingSphere} [result=new BoundingSphere()] 用于存储结果的可选对象。
 * @returns {BoundingSphere} 生成或填充后的包围球。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.fromModelMatrix = function (modelMatrix, radius, result = new BoundingSphere()) {
    Check.defined("modelMatrix", modelMatrix);
    const center = Matrix4.getTranslation(modelMatrix, Scratch.scratchCenter);
    result.center = Cartesian3.clone(center, result.center);
    if (defined(radius))
        result.radius = radius;
    return result;
};

/**
 * 计算某个世界坐标位置到包围球表面的距离，若点在球内则返回 0。
 * @param {BoundingSphere} boundingSphere 目标包围球。
 * @param {Cartesian3} positionWC 世界坐标位置。
 * @returns {number} 位置到球表面的距离，单位米。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.distanceToCartesian = function (boundingSphere, positionWC) {
    Check.defined("boundingSphere", boundingSphere);
    Check.defined("positionWC", positionWC);
    return Math.max(0.0, Cartesian3.distance(boundingSphere.center, positionWC) - boundingSphere.radius);
};

/**
 * 计算某个世界坐标位置到包围球表面的距离，若点在球内则返回 0。
 * @param {Cartesian3} positionWC 世界坐标位置。
 * @returns {number} 位置到球表面的距离，单位米。
 * @memberof BoundingSphere
*/
BoundingSphere.prototype.distanceToCartesian = function (positionWC) {
    return BoundingSphere.distanceToCartesian(this, positionWC);
};

/**
 * 计算相机到包围球表面的距离，若相机在球内则返回 0。
 * @param {BoundingSphere} boundingSphere 目标包围球。
 * @param {Camera} camera 相机。
 * @returns {number} 相机到球表面的距离，单位米。
 * @memberof BoundingSphere
 * @static
*/
BoundingSphere.distanceToCamera = function (boundingSphere, camera) {
    Check.defined("camera", camera);
    return BoundingSphere.distanceToCartesian(boundingSphere, camera.positionWC);
};

/**
 * 计算相机到包围球表面的距离，若相机在球内则返回 0。
 * @param {Camera} camera 相机。
 * @returns {number} 相机到球表面的距离，单位米。
 * @memberof BoundingSphere
*/
BoundingSphere.prototype.distanceToCamera = function (camera) {
    return BoundingSphere.distanceToCamera(this, camera);
};

export default BoundingSphere;
export { BoundingSphere };
