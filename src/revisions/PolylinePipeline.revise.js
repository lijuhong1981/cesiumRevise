import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian3, PolylinePipeline } from "cesium";

/**
 * 扩展 Cesium 的 PolylinePipeline 类，补充计算线段空间长度与地面长度的方法。
 * @class PolylinePipeline
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PolylinePipeline.html}
*/

/**
 * 计算线段的空间长度，即各顶点间的直线距离之和。
 * @param {Array} positions 构成线段的笛卡尔坐标点数组（Cartesian3 数组）。
 * @returns {number} 线段的空间长度，单位米。
 * @memberof PolylinePipeline
 * @static
*/
PolylinePipeline.computeLength = function (positions) {
    Check.typeOf.array('positions', positions);
    if (positions.length < 2)
        return 0;
    let length = 0,
        a, b, distance;
    for (let i = 1; i < positions.length; i++) {
        a = positions[i - 1];
        b = positions[i];
        distance = Cartesian3.distance(a, b);
        length += distance;
    }
    return length;
};

/**
 * 计算线段的地面长度，即各顶点间沿地表（椭球面）距离之和。
 * @param {Array} positions 构成线段的笛卡尔坐标点数组（Cartesian3 数组）。
 * @returns {number} 线段的地面长度，单位米。
 * @memberof PolylinePipeline
 * @static
*/
PolylinePipeline.computeSurfaceLength = function (positions) {
    Check.typeOf.array('positions', positions);
    if (positions.length < 2)
        return 0;
    let length = 0,
        a, b, distance;
    for (let i = 1; i < positions.length; i++) {
        a = positions[i - 1];
        b = positions[i];
        distance = Cartesian3.surfaceDistance(a, b);
        length += distance;
    }
    return length;
};

export default PolylinePipeline;
export { PolylinePipeline };
