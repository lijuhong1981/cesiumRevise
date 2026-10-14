import { Matrix3 } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseAttitudeToHeadingPitchRoll from "./parseAttitudeToHeadingPitchRoll.js";

/**
 * 把姿态值解析为 3x3 旋转矩阵（{@link Matrix3}）。
 * @param {HeadingPitchRoll|Array|object|string|number} attitude 待解析的姿态值
 * @param {Matrix3} [result] 用于存储结果的可选对象
 * @returns {Matrix3} 解析后的旋转矩阵
 */
function parseAttitudeToMatrix3(attitude, result) {
    const hpr = parseAttitudeToHeadingPitchRoll(attitude, Scratch.scratchHeadingPitchRoll);
    return Matrix3.fromHeadingPitchRoll(hpr, result);
};

export default parseAttitudeToMatrix3;
export { parseAttitudeToMatrix3 };