import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Ellipsoid, IntersectionTests, Ray } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 Ellipsoid 类，补充缩放椭球高、高度偏移以及射线求交等方法。
 * @class Ellipsoid
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Ellipsoid.html}
*/

/**
 * 将给定点的高度缩放到指定的椭球高。
 * @param {Cartesian3} cartesian 待处理的点（世界坐标）。
 * @param {number} height 目标椭球高度，单位米。
 * @param {Cartesian3} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof Ellipsoid
*/
Ellipsoid.prototype.scaleToGeodeticHeight = function (cartesian, height, result) {
    Check.defined('cartesian', cartesian);
    Check.typeOf.number('height', height);
    const cartographic = this.cartesianToCartographic(cartesian, Scratch.scratchCartographic);
    cartographic.height = height;
    return this.cartographicToCartesian(cartographic, result);
};

/**
 * 在给定点当前高度的基础上偏移指定高度，返回新的位置。
 * @param {Cartesian3} cartesian 待处理的点（世界坐标）。
 * @param {number} [heightOffset=0] 高度偏移量，单位米。
 * @param {Cartesian3} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof Ellipsoid
*/
Ellipsoid.prototype.scaleGeodeticHeightOffset = function (cartesian, heightOffset = 0, result) {
    Check.defined('cartesian', cartesian);
    Check.typeOf.number('heightOffset', heightOffset);
    if (heightOffset === 0)
        return cartesian.clone(result);
    const cartographic = this.cartesianToCartographic(cartesian, Scratch.scratchCartographic);
    cartographic.height += heightOffset;
    return this.cartographicToCartesian(cartographic, result);
};

/**
 * 计算射线与椭球表面的交点。
 * @param {Ray} ray 射线。
 * @param {Cartesian3} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {Cartesian3} 射线与椭球的交点；无交点时返回 undefined。
 * @memberof Ellipsoid
*/
Ellipsoid.prototype.rayPosition = function (ray, result) {
    Check.instanceOf('ray', ray, Ray);

    const intersection = IntersectionTests.rayEllipsoid(ray, this);
    if (!intersection) {
        return undefined;
    }

    const t = intersection.start > 0.0 ? intersection.start : intersection.stop;
    return Ray.getPoint(ray, t, result);
};

export default Ellipsoid;
export { Ellipsoid };
