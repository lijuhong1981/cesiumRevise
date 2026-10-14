import { Quaternion, Transforms } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseAttitudeToHeadingPitchRoll from "./parseAttitudeToHeadingPitchRoll.js";

/**
 * 把姿态值解析为四元数（{@link Quaternion}），可指定参考坐标系原点。
 * @param {HeadingPitchRoll|Array|object|string|number} attitude 待解析的姿态值
 * @param {Cartesian3} [origin] 参考坐标系原点（地心世界坐标），提供时按该点局部坐标系计算
 * @param {Quaternion} [result] 用于存储结果的可选对象
 * @returns {Quaternion} 解析后的四元数
 */
function parseAttitudeToQuaternion(attitude, origin, result) {
    const hpr = parseAttitudeToHeadingPitchRoll(attitude, Scratch.scratchHeadingPitchRoll);
    if (origin)
        return Transforms.headingPitchRollQuaternion(origin, hpr, undefined, undefined, result)
    else
        return Quaternion.fromHeadingPitchRoll(hpr, result);
};

export default parseAttitudeToQuaternion;
export { parseAttitudeToQuaternion };
