import { Cartesian3, Cartesian4, defined, Matrix4, SceneTransforms } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 SceneTransforms 类，补充 NDC 与世界坐标互转、
 * 以及世界坐标转视空间坐标的方法。
 * @class SceneTransforms
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/SceneTransforms.html}
*/

/**
 * 将归一化设备坐标（NDC）转换为世界坐标。
 * @param {Scene} scene 场景对象。
 * @param {Cartesian4} ndcPosition 归一化设备坐标位置。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 转换后的世界坐标。
 * @memberof SceneTransforms
 * @static
*/
SceneTransforms.ndcToWorldCoordinates = function (scene, ndcPosition, result) {
    const context = scene.context;
    const uniformState = context.uniformState;
    let worldCoords;
    let frustum = scene.camera.frustum;
    if (!defined(frustum.fovy)) {
        if (defined(frustum._offCenterFrustum)) {
            frustum = frustum._offCenterFrustum;
        }
        worldCoords = Scratch.scratchCartesian4;
        worldCoords.x = (ndcPosition.x * (frustum.right - frustum.left) + frustum.left + frustum.right) * 0.5;
        worldCoords.y = (ndcPosition.y * (frustum.top - frustum.bottom) + frustum.bottom + frustum.top) * 0.5;
        worldCoords.z = (ndcPosition.z * (near - far) - near - far) * 0.5;
        worldCoords.w = 1.0;

        worldCoords = Matrix4.multiplyByVector(uniformState.inverseView, worldCoords, worldCoords);
    } else {
        const ndc = Cartesian4.fromElements(ndcPosition.x, ndcPosition.y, ndcPosition.z, 1, Scratch.scratchNDC);
        worldCoords = Matrix4.multiplyByVector(uniformState.inverseViewProjection, ndc, Scratch.scratchCartesian4);

        // Reverse perspective divide
        const w = 1.0 / worldCoords.w;
        Cartesian3.multiplyByScalar(worldCoords, w, worldCoords);
    }
    return Cartesian3.fromCartesian4(worldCoords, result);
};

/**
 * 将世界坐标位置转换为归一化设备坐标（NDC）。
 * @param {Scene} scene 场景对象。
 * @param {Cartesian3} position 世界坐标位置。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 转换后的归一化设备坐标。
 * @memberof SceneTransforms
 * @static
*/
SceneTransforms.cartesianToNDC = function (scene, position, result = new Cartesian3()) {
    const context = scene.context;
    const uniformState = context.uniformState;
    const worldCoords = Cartesian4.fromElements(position.x, position.y, position.z, 1, Scratch.scratchCartesian4);
    const ndc = Matrix4.multiplyByVector(uniformState.viewProjection, worldCoords, Scratch.scratchNDC);
    return Cartesian3.divideByScalar(ndc, ndc.w, result);
};

/**
 * 将世界坐标位置转换为相机视空间坐标。
 * @param {Scene} scene 场景对象。
 * @param {Cartesian3} position 世界坐标位置。
 * @param {Cartesian4} [result=new Cartesian4()] 用于存储结果的可选对象。
 * @returns {Cartesian4} 相机视空间坐标。
 * @memberof SceneTransforms
 * @static
*/
SceneTransforms.cartesianToEyeCoordinates = function (scene, position, result = new Cartesian4()) {
    const camera = scene.camera;
    const viewMatrix = camera.viewMatrix;
    const worldCoords = Cartesian4.fromElements(position.x, position.y, position.z, 1, Scratch.scratchCartesian4);
    Matrix4.multiplyByVector(viewMatrix, worldCoords, result);
    return result;
};

export default SceneTransforms;
export { SceneTransforms };
