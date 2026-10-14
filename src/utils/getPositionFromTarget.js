import { Check, defined } from "cesium";
import parseToCartesian3 from "../parses/parseToCartesian3.js";

/**
 * 获取目标对象在指定时刻的世界坐标位置。
 * 目标本身可直接是位置，也可通过其 position 属性获取；若为 Property 则按时刻求值。
 * @param {object|Cartesian3} target 目标对象或位置
 * @param {JulianDate} time 查询时刻
 * @param {Cartesian3} result 用于存储结果的对象
 * @returns {Cartesian3} 获取到的世界坐标位置
 */
function getPositionFromTarget(target, time, result) {
    Check.defined('target', target);
    let position;
    if (defined(target.position))
        position = target.position;
    else
        position = target;

    if (typeof position.getValue === 'function')
        position = position.getValue(time, result);
    else
        position = parseToCartesian3(position, result, false);

    return position;
};

export default getPositionFromTarget;
export { getPositionFromTarget };
