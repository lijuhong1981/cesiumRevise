
import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseGeographicToCartesian from "./parseGeographicToCartesian.js";

/**
 * 把地理坐标数组批量解析为笛卡尔坐标数组（{@link Cartesian3}），输入按角度制处理。
 * @param {Array} geographics 地理坐标数组
 * @param {Array} [result=[]] 用于存储结果的数组
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Array} 解析后的笛卡尔坐标数组
 */
function parseGeographicsToPositions(geographics, result = [], ellipsoid) {
    Check.typeOf.array('geographics', geographics);
    for (let i = 0; i < geographics.length; i++) {
        result[i] = parseGeographicToCartesian(geographics[i], result[i], ellipsoid);
    }
    return result;
};

export default parseGeographicsToPositions;
export { parseGeographicsToPositions };
