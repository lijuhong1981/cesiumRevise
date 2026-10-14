import { Math as CesiumMath, Check, DistanceDisplayCondition } from "cesium";

/**
 * 扩展 Cesium 的 DistanceDisplayCondition 类，补充基于距离判断是否显示的方法。
 * @class DistanceDisplayCondition
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/DistanceDisplayCondition.html}
*/

/**
 * 判断给定距离是否位于距离显示条件范围内。
 * @param {DistanceDisplayCondition} distanceDisplayCondition 距离显示条件。
 * @param {number} distance 待判断的距离，单位米。
 * @returns {boolean} 距离位于 near 与 far 之间返回 true，否则返回 false。
 * @memberof DistanceDisplayCondition
 * @static
*/
DistanceDisplayCondition.isDisplay = function (distanceDisplayCondition, distance) {
    Check.defined('distanceDisplayCondition', distanceDisplayCondition);
    return CesiumMath.between(
        distance,
        Math.min(distanceDisplayCondition.near, distanceDisplayCondition.far),
        Math.max(distanceDisplayCondition.near, distanceDisplayCondition.far)
    );
};

/**
 * 判断给定距离是否位于当前距离显示条件范围内。
 * @param {number} distance 待判断的距离，单位米。
 * @returns {boolean} 距离位于 near 与 far 之间返回 true，否则返回 false。
 * @memberof DistanceDisplayCondition
*/
DistanceDisplayCondition.prototype.isDisplay = function (distance) {
    return DistanceDisplayCondition.isDisplay(this, distance);
};

export default DistanceDisplayCondition;
export { DistanceDisplayCondition };
