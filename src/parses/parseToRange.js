import getValidValue from '@lijuhong1981/jscheck/src/getValidValue.js';
import Interval from '@lijuhong1981/jsmath/src/Interval.js';
import { Check } from "cesium";

/**
 * 把数组或对象解析为区间（Interval）。
 * @param {Interval|Array|object} value 待解析的值，支持 [minimum,maximum] 数组或含 start/end/min/max 等字段的对象
 * @param {Interval} [result=new Interval()] 用于存储结果的可选对象
 * @returns {Interval} 解析后的区间对象
 */
function parseToRange(value, result = new Interval()) {
    Check.defined('value', value);
    if (value instanceof Interval) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    }
    const minimum = getValidValue(value[0], value.start, value.minimum, value.min, value.x);
    const maximum = getValidValue(value[1], value.end, value.maximum, value.max, value.y);
    result.setValues(minimum, maximum);
    return result;
};

export default parseToRange;
export { parseToRange };
