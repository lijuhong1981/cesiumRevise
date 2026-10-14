import { ClockRange, DeveloperError } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link ClockRange} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'clamped'、'loop_stop'、'unbounded'
 * @returns {ClockRange} 解析后的 ClockRange
 */
function parseClockRange(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'clamped':
                return ClockRange.CLAMPED;
            case 'loop_stop':
                return ClockRange.LOOP_STOP;
            case 'unbounded':
            default:
                return ClockRange.UNBOUNDED;
        }
    } else if (typeof value === 'number')
        return value;
    else
        throw new DeveloperError('unable parse the ' + value + ' to ClockRange.');
};

export default parseClockRange;
export { parseClockRange };
