
import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseCartographicToCartesian from "./parseCartographicToCartesian.js";

/**
 * 把地理坐标数组批量解析为笛卡尔坐标数组（{@link Cartesian3}），输入按弧度处理。
 * @param {Array} cartographics 地理坐标数组
 * @param {Array} [result=[]] 用于存储结果的数组
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Array} 解析后的笛卡尔坐标数组
 */
function parseCartographicsToPositions(cartographics, result = [], ellipsoid) {
    Check.typeOf.array('cartographics', cartographics);
    for (let i = 0; i < cartographics.length; i++) {
        result[i] = parseCartographicToCartesian(cartographics[i], result[i], ellipsoid);
    }
    return result;
};

export default parseCartographicsToPositions;
export { parseCartographicsToPositions };
