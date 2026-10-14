import { JulianDate } from "cesium";

/**
 * 扩展 Cesium 的 JulianDate 类，补充转换为 JavaScript Date 与公历日期的方法。
 * @class JulianDate
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/JulianDate.html}
*/

/**
 * 将当前 JulianDate 转换为 JavaScript Date 对象。
 * @returns {Date} 对应的 JavaScript Date 对象。
 * @memberof JulianDate
*/
JulianDate.prototype.toDate = function () {
    return JulianDate.toDate(this);
};

/**
 * 将当前 JulianDate 转换为公历日期对象。
 * @returns {GregorianDate} 对应的公历日期对象。
 * @memberof JulianDate
*/
JulianDate.prototype.toGregorianDate = function () {
    return JulianDate.toGregorianDate(this);
};

export default JulianDate;
export { JulianDate };