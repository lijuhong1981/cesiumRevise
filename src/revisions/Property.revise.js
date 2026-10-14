import { defined, Property } from "cesium";

/**
 * 扩展 Cesium 的 Property 类，补充属性判断与取值的方法。
 * @class Property
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Property.html}
*/

/**
 * 判断给定对象是否为一个 Property（具有 getValue 方法且定义了 isConstant）。
 * @param {object} property 待判断的对象。
 * @returns {boolean} 若为 Property 返回 true；否则返回 undefined。
 * @memberof Property
 * @static
*/
Property.isProperty = function (property) {
    if (typeof property.getValue === 'function' && defined(property.isConstant))
        return true;
};

/**
 * 获取属性在指定时间的值，若对象非 Property 则直接返回其本身。
 * @param {object|Property} property 属性对象或普通值。
 * @param {JulianDate} [time] 取值的时间。
 * @param {object} [result] 用于存储结果的可选对象。
 * @returns {object} 属性在指定时间的值。
 * @memberof Property
 * @static
*/
Property.getValue = function (property, time, result) {
    if (typeof property.getValue === 'function')
        return property.getValue(time, result);
    return property;
};

export default Property;
export { Property };