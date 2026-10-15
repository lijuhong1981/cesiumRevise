
import Check from "@lijuhong1981/jscheck/src/Check.js";
import PropertyType from "../additions/PropertyType.js";

/**
 * 给目标对象定义贴地相关属性（clampToGround、clampToGroundBatchId，以及可选的轮廓线宽度 outlineWidth）。
 * @param {object} target 要挂载属性的目标对象（通常是某个 primitive 的 prototype）
 * @param {boolean} [defineOutlineWidth] 是否同时定义 outlineWidth 属性，默认为 true
 * @returns {void}
 */
function defineClampToGroundProperties(target, defineOutlineWidth = true) {

    Object.defineProperties(target, {
        // 贴地相关属性
        clampToGround: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.bool('clampToGround', value);
                if (this._clampToGround !== value) {
                    this._clampToGround = value;
                    this.needsUpdateGeometryOptions = true;
                    this.raisePropertyChangeEvent('clampToGround', value, PropertyType.PRIMITIVE);
                }
            },
            get: function () {
                return this._clampToGround;
            }
        },
        clampToGroundBatchId: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                if (this._clampToGroundBatchId !== value) {
                    this._clampToGroundBatchId = value;
                    this.raisePropertyChangeEvent('clampToGroundBatchId', value);
                }
            },
            get: function () {
                return this._clampToGroundBatchId ?? this.id;
            }
        },
    });

    // 轮廓线宽度
    if (defineOutlineWidth)
        Object.defineProperty(target, 'outlineWidth', {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('outlineWidth', value, 0);
                if (this._outlineWidth !== value) {
                    this._outlineWidth = value;
                    this.raisePropertyChangeEvent('outlineWidth', value, PropertyType.ATTRIBUTE);
                }
            },
            get: function () {
                return this._outlineWidth;
            }
        });

};

export default defineClampToGroundProperties;
export { defineClampToGroundProperties };
