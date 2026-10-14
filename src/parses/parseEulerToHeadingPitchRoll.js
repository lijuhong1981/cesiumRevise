import { HeadingPitchRoll } from "cesium";
import Scratch from "../utils/Scratch.js";
import parseToCartesian3 from "./parseToCartesian3.js";

/**
 * 把欧拉角解析为 {@link HeadingPitchRoll} 对象。
 * @param {Array|object|string|number} value 待解析的欧拉角，按 [roll, pitch, yaw] 顺序
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象
 * @param {boolean} [isDegrees] 输入是否为角度制，为 true 时按角度解析
 * @returns {HeadingPitchRoll} 解析后的 HeadingPitchRoll
 */
function parseEulerToHeadingPitchRoll(value, result, isDegrees) {
    value = parseToCartesian3(value, Scratch.scratchCartesian3, 0.0);
    if (isDegrees)
        return HeadingPitchRoll.fromDegrees(-value.z, -value.y, value.x, result);
    else
        return HeadingPitchRoll.fromRadians(-value.z, -value.y, value.x, result);
};

export default parseEulerToHeadingPitchRoll;
export { parseEulerToHeadingPitchRoll };
