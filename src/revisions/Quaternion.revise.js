import { HeadingPitchRoll, Matrix3, Quaternion } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 Quaternion 类，补充通过航向俯仰横滚角创建四元数、
 * 四元数向量变换以及转换为航向俯仰横滚角的方法。
 * @class Quaternion
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Quaternion.html}
*/

/**
 * 从以角度表示的航向、俯仰、横滚角创建四元数。
 * @param {number} heading 航向角，单位度。
 * @param {number} pitch 俯仰角，单位度。
 * @param {number} roll 横滚角，单位度。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 生成的四元数。
 * @memberof Quaternion
 * @static
*/
Quaternion.fromDegrees = function (heading, pitch, roll, result) {
    const hpr = HeadingPitchRoll.fromDegrees(heading, pitch, roll, Scratch.scratchHeadingPitchRoll);
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

/**
 * 从以弧度表示的航向、俯仰、横滚角创建四元数。
 * @param {number} heading 航向角，单位弧度。
 * @param {number} pitch 俯仰角，单位弧度。
 * @param {number} roll 横滚角，单位弧度。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 生成的四元数。
 * @memberof Quaternion
 * @static
*/
Quaternion.fromRadians = function (heading, pitch, roll, result) {
    const hpr = HeadingPitchRoll.fromRadians(heading, pitch, roll, Scratch.scratchHeadingPitchRoll);
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

/**
 * 使用四元数表示的旋转对笛卡尔坐标向量进行变换。
 * @param {Quaternion} quaterion 旋转四元数。
 * @param {Cartesian3} cartesian 待变换的向量。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 变换后的向量。
 * @memberof Quaternion
 * @static
*/
Quaternion.multiplyByVector = function (quaterion, cartesian, result) {
    const rotationMatrix = Matrix3.fromQuaternion(quaterion, Scratch.scratchMatrix3);
    return Matrix3.multiplyByVector(rotationMatrix, cartesian, result);
};

/**
 * 将当前四元数转换为航向、俯仰、横滚角。
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 对应的航向俯仰横滚角。
 * @memberof Quaternion
*/
Quaternion.prototype.toHeadingPitchRoll = function (result) {
    return HeadingPitchRoll.fromQuaternion(this, result);
};

export default Quaternion;
export { Quaternion };
