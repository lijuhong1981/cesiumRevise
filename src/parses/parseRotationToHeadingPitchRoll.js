import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import { defined, HeadingPitchRoll, Matrix3, Quaternion } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseEulerToHeadingPitchRoll from "./parseEulerToHeadingPitchRoll.js";

/**
 * 把多种旋转表示解析为 {@link HeadingPitchRoll} 对象。
 * @param {HeadingPitchRoll|Quaternion|Matrix3|Array|object} value 待解析的旋转值，支持 HeadingPitchRoll、四元数、旋转矩阵、欧拉角数组或对象
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {HeadingPitchRoll} 解析后的 HeadingPitchRoll
 */
function parseRotationToHeadingPitchRoll(value, result, isDegrees) {
    if (value instanceof HeadingPitchRoll) {
        if (result && value !== result)
            return HeadingPitchRoll.clone(value, result);
        else
            return value;
    } else if (value instanceof Quaternion)
        return HeadingPitchRoll.fromQuaternion(value, result);
    else if (value instanceof Matrix3) {
        value = Quaternion.fromRotationMatrix(value, Scratch.scratchQuaternion);
        return HeadingPitchRoll.fromQuaternion(value, result);
    } else if (defined(value.heading) || defined(value.yaw)) {
        if (isDegrees)
            return HeadingPitchRoll.fromDegrees(getValidValue(value.heading, value.yaw), value.pitch, value.roll, result);
        else
            return HeadingPitchRoll.fromRadians(getValidValue(value.heading, value.yaw), value.pitch, value.roll, result);
    } else if (Array.isArray(value)) {
        if (isDegrees)
            return HeadingPitchRoll.fromDegrees(value[0], value[1], value[2], result);
        else
            return HeadingPitchRoll.fromRadians(value[0], value[1], value[2], result);
    } else {
        return parseEulerToHeadingPitchRoll(value, result, isDegrees);
    }
};

export default parseRotationToHeadingPitchRoll;
export { parseRotationToHeadingPitchRoll };
