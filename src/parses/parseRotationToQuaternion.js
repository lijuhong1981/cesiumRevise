import { defined, Quaternion } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseRotationToHeadingPitchRoll from "./parseRotationToHeadingPitchRoll.js";

/**
 * 把多种旋转表示解析为四元数（{@link Quaternion}）。
 * @param {Quaternion|HeadingPitchRoll|Matrix3|Array|object} value 待解析的旋转值，未定义时返回单位四元数
 * @param {Quaternion} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {Quaternion} 解析后的四元数
 */
function parseRotationToQuaternion(value, result, isDegrees) {
    if (!defined(value))
        return Quaternion.IDENTITY.clone(result);
    else if (value instanceof Quaternion) {
        if (result && value !== result)
            return Quaternion.clone(value, result);
        else
            return value;
    } else {
        const hpr = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, isDegrees);
        return Quaternion.fromHeadingPitchRoll(hpr, result);
    }
};

export default parseRotationToQuaternion;
export { parseRotationToQuaternion };
