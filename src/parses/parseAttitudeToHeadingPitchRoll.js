import { HeadingPitchRoll } from "cesium";
import parseHeading from "./parseHeading.js";
import parsePitch from "./parsePitch.js";
import parseRoll from "./parseRoll.js";

/**
 * 把姿态值解析为 {@link HeadingPitchRoll} 对象（角度制）。
 * @param {HeadingPitchRoll|Array|object|string|number} value 待解析的姿态值
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象
 * @returns {HeadingPitchRoll} 解析后的 HeadingPitchRoll
 */
function parseAttitudeToHeadingPitchRoll(value, result) {
    if (value instanceof HeadingPitchRoll) {
        if (result && value !== result)
            return HeadingPitchRoll.clone(value, result);
        else
            return value;
    }
    const heading = parseHeading(value);
    const pitch = parsePitch(value);
    const roll = parseRoll(value);
    return HeadingPitchRoll.fromDegrees(heading, pitch, roll, result);
};

export default parseAttitudeToHeadingPitchRoll;
export { parseAttitudeToHeadingPitchRoll };
