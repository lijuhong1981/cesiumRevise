import { JulianDate } from "cesium";

/**
 * 把日期字符串、数字时间戳、Date 或 {@link JulianDate} 解析为儒略日期。
 * @param {JulianDate|string|number|Date} value 待解析的值
 * @param {JulianDate} [result] 用于存储结果的可选对象
 * @returns {JulianDate} 解析后的儒略日期
 */
function parseToJulianDate(value, result) {
    if (value instanceof JulianDate) {
        if (result && value !== result)
            return JulianDate.clone(value, result);
        else
            return value;
    } else if (typeof value === 'string' || typeof value === 'number') {
        return JulianDate.fromDate(new Date(value), result);
    } else if (value instanceof Date) {
        return JulianDate.fromDate(value, result);
    }
};

export default parseToJulianDate;
export { parseToJulianDate };
