import { Cartesian3 } from "cesium";
import parseAltitude from "./parseAltitude.js";
import parseLatitude from "./parseLatitude.js";
import parseLongitude from "./parseLongitude.js";

/**
 * 把地理坐标解析为笛卡尔坐标（{@link Cartesian3}），输入按经度/纬度角度制处理。
 * @param {Array|object} geographic 待解析的地理坐标，含经度/纬度/高度信息
 * @param {Cartesian3} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Cartesian3} 解析后的笛卡尔坐标
 */
function parseGeographicToCartesian(geographic, result, ellipsoid) {
    const longitude = parseLongitude(geographic);
    const latitude = parseLatitude(geographic);
    const height = parseAltitude(geographic);
    return Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result);
};

export default parseGeographicToCartesian;
export { parseGeographicToCartesian };
