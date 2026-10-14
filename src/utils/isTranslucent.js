import { defined } from "cesium";

/**
 * 判断颜色是否为半透明（存在且 alpha 小于 1）。
 * @param {Color} color 待判断的颜色
 * @returns {boolean} 是否半透明
 */
function isTranslucent(color) {
    return defined(color) && (typeof color.alpha === 'number') && color.alpha < 1.0;
};

export default isTranslucent;
export { isTranslucent };