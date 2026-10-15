import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian2, Cartesian3, Math as CesiumMath, defined, Event, Matrix3 } from "cesium";
import PropertyType from "./PropertyType.js";
import parseToCartesian2 from "../parses/parseToCartesian2.js";
import computeStTransform from "../utils/computeStTransform.js";
import Scratch from "../utils/Scratch.js";
import PropertyChangedListener from "./PropertyChangedListener.js";

/**
 * 纹理坐标（s、t）变换类，继承自 PropertyChangedListener。
 * 通过偏移（stOffset）、重复（stRepeat）、旋转（stRotation）、中心（stCenter）等参数维护二维纹理坐标变换矩阵，
 * 支持逐帧自动更新，并在参数变化时触发属性变更事件。
 */
class StTransforms extends PropertyChangedListener {
    /**
     * 创建纹理坐标变换实例。
     * @param {object} [options={}] 配置项
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     * @param {function} [options.onStTransformChanged] 纹理坐标变换变更回调函数
     * @param {Cartesian2|object} [options.stOffset] 初始纹理坐标偏移
     * @param {Cartesian2|object} [options.stRepeat] 初始纹理坐标重复次数
     * @param {number} [options.stRotation] 初始纹理坐标旋转量（弧度）
     * @param {number} [options.stRotationDegrees] 初始纹理坐标旋转量（角度）
     * @param {Cartesian2|object} [options.stCenter] 初始纹理坐标旋转中心
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        this.owner = options.owner ?? this;
        this.updateByPerFrame = options.updateByPerFrame ?? true;
        this.onStTransformChanged = options.onStTransformChanged || this.onStTransformChanged.bind(this.owner);

        this._stOffset = new Cartesian2();
        this._stRepeat = new Cartesian2(1, 1);
        this._stRotation = 0;
        this._stCenter = new Cartesian2(0.5, 0.5);
        this._stCenterRotation = new Cartesian3(0.5, 0.5, 0);

        this._transform = new Matrix3();
        this._stTransformChangeEvent = new Event();

        this.updateTransform(true);

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置纹理坐标变换参数。
     * @param {object} transforms 变换配置，可包含 stOffset、stRepeat、stRotation、stRotationDegrees、stCenter
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        if (transforms.stOffset)
            this.stOffset = transforms.stOffset;
        else if (transforms.stRepeat)
            this.stRepeat = transforms.stRepeat;
        if (defined(transforms.stRotation))
            this.stRotation = transforms.stRotation;
        else if (defined(transforms.stRotationDegrees))
            this.stRotationDegrees = transforms.stRotationDegrees;
        if (transforms.stCenter)
            this.stCenter = transforms.stCenter;
    }

    /**
     * 获取纹理坐标变换变更事件对象。
     * @returns {Event} 纹理坐标变换变更事件对象
     */
    get stTransformChangeEvent() {
        return this._stTransformChangeEvent;
    }

    /**
     * 纹理坐标变换发生变更时的回调钩子，子类可重写。
     * @param {Matrix3} transform 变换后的纹理坐标矩阵
     * @returns {void}
     */
    onStTransformChanged(transform) { }

    /**
     * 触发纹理坐标变换变更事件并调用对应回调。
     * @param {Matrix3} transform 变换后的纹理坐标矩阵
     * @returns {void}
     */
    raiseStTransformChangeEvent(transform) {
        this._stTransformChangeEvent.raiseEvent(transform);
        this.onStTransformChanged(transform);
    }

    /**
     * 设置纹理坐标偏移量。
     * @param {Cartesian2|object} value 纹理坐标偏移
     * @returns {void}
     */
    set stOffset(value) {
        value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
        if (!Cartesian2.equals(this._stOffset, value)) {
            this._stOffset = value.clone(this._stOffset);
            this.raisePropertyChangeEvent('stOffset', this._stOffset, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标偏移量。
     * @returns {Cartesian2} 纹理坐标偏移
     */
    get stOffset() {
        return this._stOffset;
    }

    /**
     * 设置纹理坐标重复次数。
     * @param {Cartesian2|object} value 纹理坐标重复次数
     * @returns {void}
     */
    set stRepeat(value) {
        value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
        if (!Cartesian2.equals(this._stRepeat, value)) {
            this._stRepeat = value.clone(this._stRepeat);
            this.raisePropertyChangeEvent('stRepeat', this._stRepeat, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标重复次数。
     * @returns {Cartesian2} 纹理坐标重复次数
     */
    get stRepeat() {
        return this._stRepeat;
    }

    /**
     * 设置纹理坐标旋转量（弧度制）。
     * @param {number} value 旋转量，单位弧度
     * @returns {void}
     */
    set stRotation(value) {
        Check.typeOf.number('stRotation', value);
        if (this._stRotation !== value) {
            this._stRotation = value;
            this._stCenterRotation.z = value;
            this.raisePropertyChangeEvent('stRotation', this._stRotation, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标旋转量（弧度制）。
     * @returns {number} 旋转量，单位弧度
     */
    get stRotation() {
        return this._stRotation;
    }

    /**
     * 设置纹理坐标旋转量（角度制）。
     * @param {number} value 旋转量，单位角度
     * @returns {void}
     */
    set stRotationDegrees(value) {
        this.stRotation = CesiumMath.toRadians(value);
    }

    /**
     * 获取纹理坐标旋转量（角度制）。
     * @returns {number|undefined} 旋转量，单位角度
     */
    get stRotationDegrees() {
        if (defined(this._stRotation))
            return CesiumMath.toDegrees(this._stRotation);
    }

    /**
     * 设置纹理坐标旋转中心。
     * @param {Cartesian2|object} value 纹理坐标旋转中心
     * @returns {void}
     */
    set stCenter(value) {
        value = parseToCartesian2(value, Scratch.scratchCartesian2, false);
        if (!Cartesian2.equals(this._stCenter, value)) {
            this._stCenter = value.clone(this._stCenter);
            this._stCenterRotation = value.clone(this._stCenterRotation);
            this.raisePropertyChangeEvent('stCenter', this._stCenter, PropertyType.ATTRIBUTE);
            if (!this.updateByPerFrame)
                this.updateTransform(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取纹理坐标旋转中心。
     * @returns {Cartesian2} 纹理坐标旋转中心
     */
    get stCenter() {
        return this._stCenter;
    }

    /**
     * 获取带旋转量的纹理坐标旋转中心（z 分量为旋转弧度）。
     * @returns {Cartesian3} 纹理坐标旋转中心及旋转量
     */
    get stCenterRotation() {
        return this._stCenterRotation;
    }

    /**
     * 获取当前的纹理坐标变换矩阵。
     * @returns {Matrix3} 纹理坐标变换矩阵
     */
    get transform() {
        return this._transform;
    }

    /**
     * 根据当前参数重新计算纹理坐标变换矩阵。
     * @param {boolean} [force] 是否强制更新矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateTransform(force) {
        if (force || this.needsUpdate) {
            this._transform = computeStTransform(this._stOffset, this._stRepeat, this._stRotation, this._stCenter, this._transform);
            this.raisePropertyChangeEvent('stTransform', this._transform, PropertyType.ATTRIBUTE);
            this.raiseStTransformChangeEvent(this._transform);
            this.needsUpdate = false;
            return true;
        }
    }

    /**
     * 每帧更新，逐帧模式下按需更新纹理坐标变换矩阵。
     * @returns {boolean|undefined} 逐帧更新时返回矩阵更新结果
     */
    update() {
        if (this.updateByPerFrame)
            return this.updateTransform();
    }

    /**
     * 销毁实例时清理资源，清空纹理坐标变换变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._stTransformChangeEvent.clear();
        super.onDestroy();
    }
};

export default StTransforms;
export { StTransforms };

