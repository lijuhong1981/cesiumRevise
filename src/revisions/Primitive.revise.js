import Check from "@lijuhong1981/jscheck/src/Check.js";
import { BoundingSphere, BoundingSphereState, ClassificationPrimitive, GroundPolylinePrimitive, GroundPrimitive, Primitive } from "cesium";

/**
 * 扩展 Cesium 的 Primitive 类，补充获取包围球的方法。
 * @class Primitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Primitive.html}
*/
/**
 * 扩展 Cesium 的 GroundPrimitive 类，补充获取包围球的方法。
 * @class GroundPrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/GroundPrimitive.html}
*/
/**
 * 扩展 Cesium 的 ClassificationPrimitive 类，补充获取包围球的方法。
 * @class ClassificationPrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/ClassificationPrimitive.html}
*/
/**
 * 扩展 Cesium 的 GroundPolylinePrimitive 类，补充获取包围球的方法。
 * @class GroundPolylinePrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/GroundPolylinePrimitive.html}
*/

/**
 * 获取当前图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof Primitive
*/
Primitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready || this._recomputeBoundingSpheres)
        return BoundingSphereState.PENDING;
    BoundingSphere.fromBoundingSpheres(this._boundingSphereWC, result);
    return BoundingSphereState.DONE;
};

/**
 * 获取当前地面图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof GroundPrimitive
*/
GroundPrimitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready)
        return BoundingSphereState.PENDING;
    BoundingSphere.fromBoundingSpheres(this._boundingSpheres, result);
    return BoundingSphereState.DONE;;
};

/**
 * 获取当前分类图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof ClassificationPrimitive
*/
ClassificationPrimitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready || !this._primitive || !this._primitive._ready)
        return BoundingSphereState.PENDING;
    return this._primitive.getBoundingSphere(allowPartial, result);
};

/**
 * 获取当前地面线图元的包围球。
 * @param {boolean} allowPartial 是否允许仅使用部分已就绪的几何数据计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof GroundPolylinePrimitive
*/
GroundPolylinePrimitive.prototype.getBoundingSphere = function (allowPartial, result) {
    Check.defined('result', result);
    if (!this._ready || !this._primitive || !this._primitive._ready)
        return BoundingSphereState.PENDING;
    return this._primitive.getBoundingSphere(allowPartial, result);
};

export default Primitive;
export { ClassificationPrimitive, GroundPolylinePrimitive, GroundPrimitive, Primitive };
