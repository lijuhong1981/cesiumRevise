import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from '@lijuhong1981/jscheck/src/getValidValue.js';
import parseNumber from '@lijuhong1981/jsmath/src/parseNumber.js';
import { Cartesian4, defined, DeveloperError } from "cesium";

/**
 * 把数字、字符串或数组/对象解析为四维笛卡尔坐标（{@link Cartesian4}）。
 * @param {Cartesian4|number|string|Array|object} value 待解析的值，支持 [x,y,z,w] 数组或含 x/y/z/w 字段的对象
 * @param {Cartesian4} [result] 用于存储结果的可选对象
 * @param {number} [defaultValue=0.0] 缺省分量的默认值
 * @returns {Cartesian4} 解析后的四维笛卡尔坐标
 */
function parseToCartesian4(value, result, defaultValue = 0.0) {
    if (!defined(value)) {
        if (typeof defaultValue === 'number')
            return Cartesian4.fromElements(defaultValue, defaultValue, defaultValue, defaultValue, result);
        else
            throw new DeveloperError('value undefined.');
    } else if (value instanceof Cartesian4) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (typeof value === 'number' || typeof value === 'string') {
        value = parseNumber(value);
        return Cartesian4.fromElements(value, value, value, value, result);
    }
    const x = getValidValue(value[0], value.x, defaultValue);
    Check.typeOf.number('x', x);
    const y = getValidValue(value[1], value.y, defaultValue);
    Check.typeOf.number('y', y);
    const z = getValidValue(value[2], value.z, defaultValue);
    Check.typeOf.number('z', z);
    const w = getValidValue(value[3], value.w, defaultValue);
    Check.typeOf.number('w', w);
    return Cartesian4.fromElements(x, y, z, w, result);
};

export default parseToCartesian4;
export { parseToCartesian4 };
