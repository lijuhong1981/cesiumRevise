import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import { Cartesian3, Cartesian4, defined, Plane } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 把对象或数组解析为平面（{@link Plane}）。
 * @param {Plane|Array|object} value 待解析的值，支持 [x,y,z,w] 数组、含 point/normal 或 normal/distance 字段的对象
 * @param {Plane} [result] 用于存储结果的可选对象
 * @returns {Plane} 解析后的平面
 */
function parseToPlane(value, result) {
    Check.defined('value', value);
    if (value instanceof Plane) {
        if (result && value !== result)
            return Plane.clone(value, result);
        else
            return value;
    } else if (defined(value.point) && defined(value.normal)) {
        return Plane.fromPointNormal(value.point, value.normal, result);
    } else if (defined(value.normal) && defined(value.distance)) {
        if (!result)
            result = new Plane();
        Cartesian3.clone(value.normal, result.normal);
        result.distance = value.distance;
        return result;
    }

    const x = getValidValue(value[0], value.x);
    const y = getValidValue(value[1], value.y);
    const z = getValidValue(value[2], value.z);
    const w = getValidValue(value[3], value.w);
    const coefficients = Cartesian4.fromElements(x, y, z, w, Scratch.scratchCartesian4);
    return Plane.fromCartesian4(coefficients, result);
};

export default parseToPlane;
export { parseToPlane };
