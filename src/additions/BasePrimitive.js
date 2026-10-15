import setOptions from '@lijuhong1981/jslib/src/setParameters.js';
import { createGuid, Check, defer, defined } from "cesium";
import parseToRange from "../parses/parseToRange.js";
import PropertyChangedListener from "./PropertyChangedListener.js";

/**
 * 图元基类，继承自 PropertyChangedListener。
 * 统一管理图元的 id、name、显示状态、拾取、就绪状态与高度显示条件等公共属性，
 * 并约定 onInit / onUpdate 生命周期钩子供子类实现。
 */
class BasePrimitive extends PropertyChangedListener {
    /**
     * 创建图元实例。
     * @param {object} [options={}] 配置项
     */
    constructor(options = {}) {
        super();
        this._init(options);
    }

    /**
     * 初始化图元的各项公共属性并调用 onInit 钩子。
     * @param {object} options 配置项
     * @param {string} [options.id] 图元唯一标识，未提供时自动生成
     * @param {string} [options.name] 图元名称，未提供时取 id
     * @param {boolean} [options.allowPicking=true] 是否允许拾取
     * @param {object} [options.pickPrimitive] 拾取时返回的图元，未提供时默认为自身
     * @param {boolean} [options.show=true] 是否显示
     * @returns {void}
     */
    _init(options) {
        this._id = options.id ?? createGuid();
        this._name = options.name ?? this._id;
        this._ready = false;
        this._readyPromise = defer();
        this._allowPicking = options.allowPicking ?? true;
        this._pickPrimitive = options.pickPrimitive ?? this;
        this._show = options.show ?? true;

        this.onInit(options);
    }

    /**
     * 初始化钩子，子类可重写以完成自身属性和资源的初始化。
     * @param {object} options 配置项
     * @returns {void}
     */
    onInit(options) { }

    /**
     * 使用配置对象批量设置实例属性。
     * @param {object} options 配置项
     * @returns {void}
     */
    setOptions(options) {
        setOptions(this, options);
    }

    /**
     * 设置图元唯一标识。
     * @param {string} value 图元唯一标识
     * @returns {void}
     */
    set id(value) {
        if (defined(value) && this._id !== value) {
            this._id = value;
            this.raisePropertyChangeEvent('id', value);
        }
    }

    /**
     * 获取图元唯一标识。
     * @returns {string} 图元唯一标识
     */
    get id() {
        return this._id;
    }

    /**
     * 设置图元唯一标识（id 的别名）。
     * @param {string} value 图元唯一标识
     * @returns {void}
     */
    set guid(value) {
        this.id = value;
    }

    /**
     * 获取图元唯一标识（id 的别名）。
     * @returns {string} 图元唯一标识
     */
    get guid() {
        return this.id;
    }

    /**
     * 设置图元名称。
     * @param {string} value 图元名称
     * @returns {void}
     */
    set name(value) {
        Check.typeOf.string('name', value);
        if (this._name !== value) {
            this._name = value;
            this.raisePropertyChangeEvent('name', value);
        }
    }

    /**
     * 获取图元名称。
     * @returns {string} 图元名称
     */
    get name() {
        return this._name;
    }

    /**
     * 获取图元是否已就绪。
     * @returns {boolean} 是否已就绪
     */
    get ready() {
        return this._ready;
    }

    /**
     * 获取图元就绪状态的 Promise。
     * @returns {Promise<BasePrimitive>} 就绪后解析为当前图元实例的 Promise
     */
    get readyPromise() {
        return this._readyPromise.promise;
    }

    /**
     * 标记图元就绪完成并兑现就绪 Promise。
     * @returns {void}
     */
    _readyCompleted() {
        this._ready = true;
        this._readyPromise.resolve(this);
    }

    /**
     * 标记图元就绪失败并拒绝就绪 Promise。
     * @param {*} error 错误信息
     * @returns {void}
     */
    _readyErrored(error) {
        console.warn(error);
        this._ready = false;
        this._readyPromise.reject(error);
    }

    /**
     * 设置是否允许拾取。
     * @param {boolean} value 是否允许拾取
     * @returns {void}
     */
    set allowPicking(value) {
        Check.typeOf.bool('allowPicking', value);
        if (this._allowPicking !== value) {
            this._allowPicking = value;
            this.raisePropertyChangeEvent('allowPicking', value);
        }
    }

    /**
     * 获取是否允许拾取。
     * @returns {boolean} 是否允许拾取
     */
    get allowPicking() {
        return this._allowPicking;
    }

    /**
     * 设置拾取时返回的图元，未提供时默认为自身。
     * @param {object} value 拾取时返回的图元
     * @returns {void}
     */
    set pickPrimitive(value) {
        if (defined(value))
            this._pickPrimitive = value;
        else
            this._pickPrimitive = this;
    }

    /**
     * 获取拾取时返回的图元。
     * @returns {object} 拾取时返回的图元
     */
    get pickPrimitive() {
        return this._pickPrimitive;
    }

    /**
     * 设置是否显示。
     * @param {boolean} value 是否显示
     * @returns {void}
     */
    set show(value) {
        Check.typeOf.bool('show', value);
        if (this._show !== value) {
            this._show = value;
            this.raisePropertyChangeEvent('show', value);
        }
    }

    /**
     * 获取是否显示。
     * @returns {boolean} 是否显示
     */
    get show() {
        return this._show;
    }

    /**
     * 设置高度显示条件（区间范围），未提供时清除该条件。
     * @param {*} value 高度显示条件，可被解析为区间范围
     * @returns {void}
     */
    set heightDisplayCondition(value) {
        if (defined(value)) {
            this._heightDisplayCondition = parseToRange(value, this._heightDisplayCondition);
        } else
            this._heightDisplayCondition = undefined;
    }

    /**
     * 获取高度显示条件。
     * @returns {*} 高度显示条件
     */
    get heightDisplayCondition() {
        return this._heightDisplayCondition;
    }

    /**
     * 每帧更新，设置椭球体并在满足就绪、显示、拾取与高度条件时调用 onUpdate 钩子。
     * @param {FrameState} frameState 帧状态对象
     * @returns {void}
     */
    update(frameState) {
        this.ellipsoid = frameState.scene.ellipsoid;
        if (!this.ready || !this.show || this.isDestroyed())
            return;
        if (frameState.passes.pick && !this._allowPicking)
            return;
        if (this._heightDisplayCondition) {
            const height = frameState.camera.positionCartographic.height;
            if (this._heightDisplayCondition.between(height))
                this.onUpdate(frameState);
        } else
            this.onUpdate(frameState);
    }

    /**
     * 更新钩子，子类可重写以完成每帧渲染更新。
     * @param {FrameState} frameState 帧状态对象
     * @returns {void}
     */
    onUpdate(frameState) { }

    // onDestroy() {
    //     super.onDestroy();
    // }
};

export default BasePrimitive;
export { BasePrimitive };

