import { Cartesian3 } from "cesium";
import parseGeographicToCartesian from "../parses/parseGeographicToCartesian.js";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import Scratch from "../utils/Scratch.js";
import PropertyType from "../additions/PropertyType.js";

/**
 * 给目标对象定义中心点相关属性（笛卡尔坐标 center 与经纬度地理坐标 centerGeographic）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @returns {void}
 */
function defineCenterProperties(target) {

    Object.defineProperties(target, {
        // 中心点（笛卡尔坐标）
        center: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToCartesian3(value, Scratch.scratchCartesian3, false);
                if (!Cartesian3.equals(value, this._center)) {
                    this._center = value.clone(this._center);
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('center', value, PropertyType.GEOMETRY);
                }
            },
            get: function () {
                return this._center;
            }
        },
        // 中心点（经纬度地理坐标）
        centerGeographic: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.center = parseGeographicToCartesian(value, Scratch.scratchGeographic, this.ellipsoid);
            },
            get: function () {
                return this._center ? this._center.toGeographic(this.ellipsoid) : undefined;
            }
        },
    });

}

export default defineCenterProperties;
export { defineCenterProperties };
