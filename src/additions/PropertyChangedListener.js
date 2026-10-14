import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import { Event } from "cesium";

/**
 * 属性变更监听器基类，继承自 Destroyable。
 * 提供统一的属性变更事件（Event）触发与回调机制，供各类 Transform 组件复用。
 */
class PropertyChangedListener extends Destroyable {
    /**
     * 创建属性变更监听器实例。
     * @param {function} [onPropertyValueChanged] 属性值变更时的回调函数，签名为 (name, value, type)
     */
    constructor(onPropertyValueChanged) {
        super();

        this._propertyChanged = new Event();
        this.onPropertyValueChanged = onPropertyValueChanged || this.onPropertyValueChanged.bind(this);
    }

    // @deprecated
    /**
     * 获取属性变更事件对象。
     * @deprecated 已废弃，请使用 propertyChanged 替代
     * @returns {Event} 属性变更事件对象
     */
    get propertyChangeEvent() {
        return this._propertyChanged;
    }

    /**
     * 获取属性变更事件对象。
     * @returns {Event} 属性变更事件对象
     */
    get propertyChanged() {
        return this._propertyChanged;
    }

    /**
     * 属性值发生变更时的回调钩子，子类可重写以处理变更通知。
     * @param {string} name 属性名称
     * @param {*} value 变更后的属性值
     * @param {string} type 属性类型，取值参考 PropertyType
     * @returns {void}
     */
    onPropertyValueChanged(name, value, type) { }

    /**
     * 触发属性变更事件并调用属性变更回调。
     * @param {string} name 属性名称
     * @param {*} value 变更后的属性值
     * @param {string} type 属性类型，取值参考 PropertyType
     * @returns {void}
     */
    raisePropertyChangeEvent(name, value, type) {
        if (this.isDestroyed())
            return;
        this._propertyChanged.raiseEvent(this, name, value, type);
        this.onPropertyValueChanged(name, value, type);
    }

    /**
     * 销毁实例时清理资源，清空属性变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._propertyChanged.clear();
        super.onDestroy();
    }
};

export default PropertyChangedListener;
export { PropertyChangedListener };
