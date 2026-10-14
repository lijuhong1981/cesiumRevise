import { Quaternion } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseEulerToHeadingPitchRoll from "./parseEulerToHeadingPitchRoll.js";

/**
 * 把欧拉角解析为四元数（{@link Quaternion}）。
 * @param {Array|object|string|number} value 待解析的欧拉角，按 [roll, pitch, yaw] 顺序
 * @param {Quaternion} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {Quaternion} 解析后的四元数
 */
function parseEulerToQuaternion(value, result, isDegrees) {
    const hpr = parseEulerToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, isDegrees);
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

export default parseEulerToQuaternion;
export { parseEulerToQuaternion };
