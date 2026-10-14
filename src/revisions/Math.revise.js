import { Math as CesiumMath, Check } from "cesium";

/**
 * 扩展 Cesium 的 Math（CesiumMath）类，补充 WGS84 相关常量，
 * 以及数值区间判断、随机数等方法。
 * @class CesiumMath
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Math.html}
*/

/**
 * WGS84 椭球体的平均半径，单位米。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
CesiumMath.WGS84_RADIUS = 6378137.0;

/**
 * WGS84 椭球体的赤道周长，单位米。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
CesiumMath.WGS84_CIRCUM = 2 * Math.PI * CesiumMath.WGS84_RADIUS;

/**
 * WGS84 椭球体每米对应的经度/纬度度数。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
CesiumMath.WGS84_DEGREES_PER_METERS = 360.0 / CesiumMath.WGS84_CIRCUM;

/**
 * WGS84 椭球体每度对应的米数。
 * @type {number}
 * @constant
 * @memberof CesiumMath
*/
CesiumMath.WGS84_METERS_PER_DEGREES = CesiumMath.WGS84_CIRCUM / 360.0;

/**
 * 判断数值是否在指定的闭区间 [min, max] 内。
 * @param {number} value 待判断的数值。
 * @param {number} min 区间最小值。
 * @param {number} max 区间最大值。
 * @returns {boolean} 若 value 在 [min, max] 内返回 true，否则返回 false。
 * @memberof CesiumMath
 * @static
*/
CesiumMath.between = function (value, min, max) {
    Check.typeOf.number('value', value);
    Check.typeOf.number('min', min);
    Check.typeOf.number('max', max);
    if (value < min || value > max)
        return false;
    return true;
};

/**
 * 生成 [min, max) 区间内的随机浮点数。
 * @param {number} min 区间最小值（包含）。
 * @param {number} max 区间最大值（不包含）。
 * @returns {number} 随机浮点数。
 * @memberof CesiumMath
 * @static
*/
CesiumMath.randomNumber = function (min, max) {
    return CesiumMath.randomBetween(min, max);
};

/**
 * 生成 [min, max] 区间内的随机整数。
 * @param {number} [min=0] 区间最小值（包含）。
 * @param {number} [max=Number.MAX_SAFE_INTEGER-1] 区间最大值（包含）。
 * @returns {number} 随机整数。
 * @memberof CesiumMath
 * @static
*/
CesiumMath.randomIntegerBetween = function (min = 0, max = Number.MAX_SAFE_INTEGER - 1) {
    const result = CesiumMath.randomBetween(min, max + 1);
    return Math.floor(result);
};

/**
 * 生成 [min, max] 区间内的随机整数。
 * @param {number} min 区间最小值（包含）。
 * @param {number} max 区间最大值（包含）。
 * @returns {number} 随机整数。
 * @memberof CesiumMath
 * @static
*/
CesiumMath.randomInteger = function (min, max) {
    return CesiumMath.randomIntegerBetween(min, max);
};

export default CesiumMath;
export { CesiumMath };
