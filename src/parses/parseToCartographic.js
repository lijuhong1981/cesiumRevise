import { Cartesian3, Cartographic } from "cesium";
import Geographic from "../additions/Geographic.js";
import { parseHeight } from "./parseAltitude.js";
import parseLatitude from "./parseLatitude.js";
import parseLongitude from "./parseLongitude.js";

/**
 * 把地理坐标解析为 {@link Cartographic} 对象，输入按经度/纬度角度制处理。
 * @param {Cartographic|Geographic|Cartesian3|Array|object} value 待解析的值
 * @param {Cartographic} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Cartographic} 解析后的 Cartographic
 */
function parseToCartographic(value, result, ellipsoid) {
    if (value instanceof Cartographic) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof Geographic)
        return value.toCartographic(result);
    else if (value instanceof Cartesian3)
        return value.toCartographic(ellipsoid, result);
    const longitude = parseLongitude(value);
    const latitude = parseLatitude(value);
    const height = parseHeight(value);
    return Cartographic.fromDegrees(longitude, latitude, height, result);
};

export default parseToCartographic;
export { parseToCartographic };
