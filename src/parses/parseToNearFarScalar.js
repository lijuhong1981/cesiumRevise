import { DeveloperError, NearFarScalar } from "cesium";

/**
 * 把数组或对象解析为 {@link NearFarScalar} 对象。
 * @param {NearFarScalar|Array|object} value 待解析的值
 * @param {NearFarScalar} [result] 用于存储结果的可选对象
 * @returns {NearFarScalar} 解析后的 NearFarScalar
 */
function parseToNearFarScalar(value, result) {
    if (value instanceof NearFarScalar) {
        if (result && value !== result) {
            NearFarScalar.clone(value, result);
            return result;
        } else
            return value;
    }

    if (result === undefined)
        result = new NearFarScalar();

    if (Array.isArray(value)) {
        NearFarScalar.unpack(value, 0, result);
    } else if (typeof value === 'object') {
        NearFarScalar.clone(value, result);
    } else {
        throw new DeveloperError('can not parse the ' + value + ' to NearFarScalar.');
    }

    return result;
};

export default parseToNearFarScalar;
export { parseToNearFarScalar };
