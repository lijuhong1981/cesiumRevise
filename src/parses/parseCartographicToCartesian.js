import { Cartesian3 } from "cesium";
import { parseHeight } from "./parseAltitude.js";
import parseLatitude from "./parseLatitude.js";
import parseLongitude from "./parseLongitude.js";

/**
 * 把地理坐标解析为笛卡尔坐标（{@link Cartesian3}），输入按弧度处理。
 * @param {Cartographic|Array|object} cartographic 待解析的地理坐标，含经度/纬度/高度信息
 * @param {Cartesian3} [result] 用于存储结果的可选对象
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Cartesian3} 解析后的笛卡尔坐标
 */
function parseCartographicToCartesian(cartographic, result, ellipsoid) {
    const longitude = parseLongitude(cartographic);
    const latitude = parseLatitude(cartographic);
    const height = parseHeight(cartographic);
    return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
};

export default parseCartographicToCartesian;
export { parseCartographicToCartesian };
