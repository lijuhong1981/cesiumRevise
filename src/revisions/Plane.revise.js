import { Cartesian3, Plane } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 Plane 类，补充通过共面点创建平面、克隆等方法。
 * @class Plane
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Plane.html}
*/

/**
 * 通过三个共面点创建平面。
 * @param {Cartesian3} a 平面上第一个点。
 * @param {Cartesian3} b 平面上第二个点。
 * @param {Cartesian3} c 平面上第三个点。
 * @param {Plane} [result] 用于存储结果的可选对象。
 * @returns {Plane} 生成的平面。
 * @memberof Plane
 * @static
*/
Plane.fromCoplanarPoints = function (a, b, c, result) {

    // from threejs
    // const normal = _vector1.subVectors(c, b).cross(_vector2.subVectors(a, b)).normalize();
    const vectorA = Cartesian3.subtract(c, b, Scratch.scratchLeftCartesian3);
    const vectorB = Cartesian3.subtract(a, b, Scratch.scratchRightCartesian3);
    const normal = Cartesian3.cross(vectorA, vectorB, Scratch.scratchNormal);
    normal.normalize();

    return Plane.fromPointNormal(a, normal, result);
};

/**
 * 克隆当前平面。
 * @param {Plane} [result] 用于存储结果的可选对象。
 * @returns {Plane} 克隆得到的平面。
 * @memberof Plane
*/
Plane.prototype.clone = function (result) {
    return Plane.clone(this, result);
};

export default Plane;
export { Plane };
