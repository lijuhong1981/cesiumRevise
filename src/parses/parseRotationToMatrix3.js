import { Matrix3 } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseRotationToHeadingPitchRoll from "./parseRotationToHeadingPitchRoll.js";

/**
 * 把多种旋转表示解析为 3x3 旋转矩阵（{@link Matrix3}）。
 * @param {Matrix3|HeadingPitchRoll|Quaternion|Array|object} value 待解析的旋转值
 * @param {Matrix3} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {Matrix3} 解析后的旋转矩阵
 */
function parseRotationToMatrix3(value, result, isDegrees) {
    if (value instanceof Matrix3) {
        if (result && value !== result)
            return Matrix3.clone(value, result);
        else
            return value;
    } else {
        const hpr = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, isDegrees);
        return Matrix3.fromHeadingPitchRoll(hpr, result);
    }
};

export default parseRotationToMatrix3;
export { parseRotationToMatrix3 };
