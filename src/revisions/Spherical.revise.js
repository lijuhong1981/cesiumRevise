import { Spherical, Math as CesiumMath } from "cesium";

/**
 * 扩展 Cesium 的 Spherical 类，补充以角度表示的 clock、cone 属性。
 * @class Spherical
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Spherical.html}
*/

Object.defineProperties(Spherical.prototype, {
    /**
     * 绕 z 轴的旋转角（clock），单位度。
     * @name clockDegrees
     * @type {number}
     * @memberof Spherical
    */
    clockDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.clock);
        }
    },
    /**
     * 与 z 轴的夹角（cone），单位度。
     * @name coneDegrees
     * @type {number}
     * @memberof Spherical
    */
    coneDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.cone);
        }
    },
});

export default Spherical;
export { Spherical };