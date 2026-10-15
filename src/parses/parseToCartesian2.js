import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from '@lijuhong1981/jscheck/src/getValidValue.js';
import parseNumber from '@lijuhong1981/jsmath/src/parseNumber.js';
import { Cartesian2, defined, DeveloperError } from "cesium";

/**
 * 把数字、字符串或数组/对象解析为二维笛卡尔坐标（{@link Cartesian2}）。
 * @param {Cartesian2|number|string|Array|object} value 待解析的值，支持 [x,y] 数组或含 x/y 字段的对象
 * @param {Cartesian2} [result] 用于存储结果的可选对象
 * @param {number} [defaultValue=0.0] 缺省分量的默认值
 * @returns {Cartesian2} 解析后的二维笛卡尔坐标
 */
function parseToCartesian2(value, result, defaultValue = 0.0) {
    if (!defined(value)) {
        if (typeof defaultValue === 'number')
            return Cartesian2.fromElements(defaultValue, defaultValue, result);
        else
            throw new DeveloperError('value undefined.');
    } else if (value instanceof Cartesian2) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (typeof value === 'number' || typeof value === 'string') {
        value = parseNumber(value);
        return Cartesian2.fromElements(value, value, result);
    }
    const x = getValidValue(value[0], value.x, defaultValue);
    Check.typeOf.number('x', x);
    const y = getValidValue(value[1], value.y, defaultValue);
    Check.typeOf.number('y', y);
    return Cartesian2.fromElements(x, y, result);
};

export default parseToCartesian2;
export { parseToCartesian2 };
