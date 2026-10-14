import { Cartesian3, Cartographic } from "cesium";
import Geographic from "../additions/Geographic.js";
import parseAltitude from "./parseAltitude.js";
import parseLatitude from "./parseLatitude.js";
import parseLongitude from "./parseLongitude.js";

/**
 * 把地理坐标解析为 {@link Geographic} 对象，输入按角度制处理。
 * @param {Geographic|Cartographic|Cartesian3|Array|object} value 待解析的值
 * @param {Geographic} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Geographic} 解析后的 Geographic
 */
function parseToGeographic(value, result, ellipsoid) {
    if (value instanceof Geographic) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof Cartographic)
        return value.toGeographic(result);
    else if (value instanceof Cartesian3)
        return value.toGeographic(ellipsoid, result);
    const longitude = parseLongitude(value);
    const latitude = parseLatitude(value);
    const altitude = parseAltitude(value);
    return Geographic.fromDegrees(longitude, latitude, altitude, result);
};

export default parseToGeographic;
export { parseToGeographic };
