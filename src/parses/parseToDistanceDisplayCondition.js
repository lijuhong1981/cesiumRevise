import { DeveloperError, DistanceDisplayCondition } from "cesium";

/**
 * 把数组、对象、数字或字符串解析为 {@link DistanceDisplayCondition} 对象。
 * @param {DistanceDisplayCondition|Array|object|number|string} value 待解析的值，数字/字符串时以 near=0、该值为 far 处理
 * @param {DistanceDisplayCondition} [result] 用于存储结果的可选对象
 * @returns {DistanceDisplayCondition} 解析后的距离显示条件
 */
function parseToDistanceDisplayCondition(value, result) {
    if (!value) return;

    if (value instanceof DistanceDisplayCondition) {
        if (result && value !== result) {
            DistanceDisplayCondition.clone(value, result);
            return result;
        } else
            return value;
    }

    if (result === undefined)
        result = new DistanceDisplayCondition();

    if (Array.isArray(value)) {
        DistanceDisplayCondition.unpack(value, 0, result);
    } else if (typeof value === 'object') {
        DistanceDisplayCondition.clone(value, result);
    } else if (typeof value === 'number') {
        result.near = 0;
        result.far = value;
    } else if (typeof value === 'string') {
        result.near = 0;
        result.far = parseFloat(value);
    } else {
        throw new DeveloperError('can not parse the ' + value + ' to DistanceDisplayCondition.');
    }

    return result;
};

export default parseToDistanceDisplayCondition;
export { parseToDistanceDisplayCondition };
