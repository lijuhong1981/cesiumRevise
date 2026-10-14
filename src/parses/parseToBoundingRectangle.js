import { BoundingRectangle, DeveloperError } from "cesium";

/**
 * 把数组或对象解析为包围矩形（{@link BoundingRectangle}）。
 * @param {BoundingRectangle|Array|object} value 待解析的值
 * @param {BoundingRectangle} [result] 用于存储结果的可选对象
 * @returns {BoundingRectangle} 解析后的包围矩形
 */
function parseToBoundingRectangle(value, result) {
    if (value instanceof BoundingRectangle) {
        if (result && value !== result) {
            BoundingRectangle.clone(value, result);
            return result;
        } else
            return value;
    }

    if (result === undefined)
        result = new BoundingRectangle();

    if (Array.isArray(value)) {
        BoundingRectangle.unpack(value, 0, result);
    } else if (typeof value === 'object') {
        BoundingRectangle.clone(value, result);
    } else {
        throw new DeveloperError('can not parse the ' + value + ' to BoundingRectangle.');
    }

    return result;
};

export default parseToBoundingRectangle;
export { parseToBoundingRectangle };
