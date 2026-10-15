import { Check, CullFace, defined } from "cesium";
import parseCullFace from "../parses/parseCullFace.js";
import parseShadowMode from "../parses/parseShadowMode.js";
import PropertyType from "../additions/PropertyType.js";

/**
 * 给目标对象定义外观相关属性（flat、faceForward、cullFace、shadows）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @param {boolean} [isFill] 是否为填充外观，用于区分属性变更事件类型，默认为 false
 * @returns {void}
 */
function defineAppearanceProperties(target, isFill = false) {

    Object.defineProperties(target, {
        // 平面化与面朝向属性
        flat: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('flat', value);
                if (this._flat !== value) {
                    this._flat = value;
                    this.raisePropertyChangeEvent('flat', value, isFill ? PropertyType.FILLAPPEARANCE : PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined(this._flat))
                    this._flat = false;
                return this._flat;
            }
        },
        faceForward: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('faceForward', value);
                if (this._faceForward !== value) {
                    this._faceForward = value;
                    this.raisePropertyChangeEvent('faceForward', value, isFill ? PropertyType.FILLAPPEARANCE : PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined(this._faceForward))
                    this._faceForward = true;
                return this._faceForward;
            }
        },
        // 面剔除与阴影属性
        cullFace: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseCullFace(value);
                if (this._cullFace !== value) {
                    this._cullFace = value;
                    this.raisePropertyChangeEvent('cullFace', value, isFill ? PropertyType.FILLAPPEARANCE : PropertyType.APPEARANCE);
                }
            },
            get: function () {
                if (!defined(this._cullFace))
                    this._cullFace = CullFace.NONE;
                return this._cullFace;
            }
        },
        shadows: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseShadowMode(value);
                if (this._shadows !== value) {
                    this._shadows = value;
                    this.raisePropertyChangeEvent('shadows', value, isFill ? PropertyType.FILLPRIMITIVE : PropertyType.PRIMITIVE);
                }
            },
            get: function () {
                return this._shadows;
            }
        },
    });

};

export default defineAppearanceProperties;
export { defineAppearanceProperties };
