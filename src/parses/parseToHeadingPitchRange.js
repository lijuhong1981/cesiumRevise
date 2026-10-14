import { Math as CesiumMath, Check, HeadingPitchRange } from "cesium";

/**
 * 把数组或对象解析为 {@link HeadingPitchRange} 对象。
 * @param {HeadingPitchRange|Array|object} value 待解析的值，支持 [heading,pitch,range] 数组或含 heading/pitch/range 字段的对象
 * @param {HeadingPitchRange} [result=new HeadingPitchRange()] 用于存储结果的可选对象
 * @param {boolean} [isDegrees=true] 输入是否为角度制，为 true 时按角度解析
 * @returns {HeadingPitchRange} 解析后的 HeadingPitchRange
 */
function parseToHeadingPitchRange(value, result = new HeadingPitchRange(), isDegrees = true) {
    Check.defined('value', value);

    if (value instanceof HeadingPitchRange) {
        if (value !== result) {
            HeadingPitchRange.clone(value, result);
            return result;
        } else
            return value;
    }

    if (Array.isArray(value)) {
        if (isDegrees) {
            result.heading = CesiumMath.toRadians(value[0]);
            result.pitch = CesiumMath.toRadians(value[1]);
        } else {
            result.heading = value[0];
            result.pitch = value[1];
        }
        result.range = value[2];
    } else if (typeof value === 'object') {
        if (isDegrees) {
            result.heading = CesiumMath.toRadians(value.heading ?? value.yaw);
            result.pitch = CesiumMath.toRadians(value.pitch);
        } else {
            result.heading = value.heading ?? value.yaw;
            result.pitch = value.pitch;
        }
        result.range = value.range;
    }

    return result;
};

export default parseToHeadingPitchRange;
export { parseToHeadingPitchRange };
