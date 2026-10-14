import { TimeInterval } from "cesium";
import parseToJulianDate from "./parseToJulianDate.js";

/**
 * 把字符串、数组或对象解析为时间区间（{@link TimeInterval}）。
 * @param {TimeInterval|string|Array|object} value 待解析的值，字符串按 ISO8601 解析，数组为 [start,stop]
 * @param {TimeInterval} [result] 用于存储结果的可选对象
 * @returns {TimeInterval} 解析后的时间区间
 */
function parseToTimeInterval(value, result) {
    if (value instanceof TimeInterval) {
        if (result && value !== result)
            return TimeInterval.clone(value, result);
        else
            return value;
    } else if (typeof value === 'string')
        return TimeInterval.fromIso8601(value, result);

    if (result === undefined)
        result = new TimeInterval();

    if (Array.isArray(value)) {
        let start = parseToJulianDate(value[0]);
        let stop = parseToJulianDate(value[1]);
        result.start = start;
        result.stop = stop;
    } else if (typeof value === 'object') {
        let start = value.start || value.startTime;
        start = parseToJulianDate(start);
        let stop = value.stop || value.stopTime;
        stop = parseToJulianDate(stop);
        result.start = start;
        result.stop = stop;
        if (value.data !== undefined)
            result.data = value.data;
        if (value.isStartIncluded)
            result.isStartIncluded = value.isStartIncluded;
        if (value.isStopIncluded)
            result.isStopIncluded = value.isStopIncluded;
    }
    return result;
};

export default parseToTimeInterval;
export { parseToTimeInterval };
