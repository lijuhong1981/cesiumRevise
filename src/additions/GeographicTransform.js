import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseNumber from "@lijuhong1981/jsmath/src/parseNumber.js";
import { Cartesian3, Math as CesiumMath, Event, Matrix4, Transforms } from "cesium";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import parseToGeographic from "../parses/parseToGeographic.js";
import Scratch from "../utils/Scratch.js";
import Geographic from "./Geographic.js";
import PropertyChangedListener from "./PropertyChangedListener.js";

/**
 * 地理坐标变换类，继承自 PropertyChangedListener。
 * 通过经纬高（Geographic）或世界坐标（Cartesian3）设置位置，维护东-北-天（ENU）固定坐标系变换矩阵，
 * 支持逐帧自动更新，并在位置或地理坐标变化时触发属性变更事件。
 */
class GeographicTransform extends PropertyChangedListener {
    /**
     * 创建地理坐标变换实例。
     * @param {object} [options={}] 配置项
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体，未提供时取宿主对象的 ellipsoid
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     * @param {Cartesian3|object} [options.position] 初始世界坐标位置
     * @param {Geographic|object} [options.geographic] 初始地理坐标
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        this.owner = options.owner ?? this;
        this.ellipsoid = options.ellipsoid ?? this.owner.ellipsoid;
        this.updateByPerFrame = options.updateByPerFrame ?? true;

        this._matrix = Matrix4.IDENTITY.clone();
        this._position = new Cartesian3();
        this._geographic = undefined;
        this._matrixChangeEvent = new Event();

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置位置或地理坐标。
     * @param {object} transforms 变换配置，可包含 position 或 geographic
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        if (transforms.position)
            this.position = transforms.position;
        else if (transforms.geographic)
            this.geographic = transforms.geographic;
    }

    /**
     * 获取矩阵变更事件对象，矩阵更新时触发。
     * @returns {Event} 矩阵变更事件对象
     */
    get matrixChangeEvent() {
        return this._matrixChangeEvent;
    }

    /**
     * 设置世界坐标位置，位置发生变化时触发属性变更事件，并同步更新地理坐标状态。
     * @param {Cartesian3|object} value 世界坐标位置
     * @returns {void}
     */
    set position(value) {
        Check.typeOf.object('position', value);
        value = parseToCartesian3(value, Scratch.scratchPositionWC, 0.0);
        if (!Cartesian3.equals(value, this._position)) {
            this._position = value.clone(this._position);
            this.positionChanged = true;
            this.geographicChanged = false;
            this.raisePropertyChangeEvent('position', this._position);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
        }
    }

    /**
     * 获取当前世界坐标位置。
     * @returns {Cartesian3} 当前世界坐标位置
     */
    get position() {
        return this._position;
    }

    /**
     * 设置世界坐标位置，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setPosition(x, y, z) {
        if (typeof x === 'object')
            this.position = x;
        else
            this.position = Cartesian3.fromElements(x, y, z, Scratch.scratchPositionWC);
    }

    /**
     * 获取当前世界坐标位置的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 当前世界坐标位置的副本
     */
    getPosition(result) {
        return this._position.clone(result);
    }

    /**
     * 设置地理坐标（经纬高），发生变化时触发属性变更事件，并同步更新世界坐标状态。
     * @param {Geographic|object} value 地理坐标
     * @returns {void}
     */
    set geographic(value) {
        Check.typeOf.object('geographic', value);
        value = parseToGeographic(value, Scratch.scratchGeographic);
        if (!Geographic.equals(value, this._geographic)) {
            this._geographic = value.clone(this._geographic);
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
        }
    }

    /**
     * 获取当前地理坐标。
     * @returns {Geographic} 当前地理坐标
     */
    get geographic() {
        return this._geographic;
    }

    /**
     * 设置地理坐标，支持传入 Geographic 对象或经纬高数值。
     * @param {Geographic|number} longitude Geographic 对象或经度
     * @param {number} [latitude] 纬度
     * @param {number} [altitude] 高度，单位米
     * @param {boolean} [degrees=true] 传入的经纬度是否为角度制，false 表示弧度制
     * @returns {void}
     */
    setGeographic(longitude, latitude, altitude, degrees = true) {
        if (typeof longitude === 'object')
            this.geographic = longitude;
        else if (degrees)
            this.geographic = Geographic.fromDegrees(longitude, latitude, altitude, Scratch.scratchGeographic);
        else
            this.geographic = Geographic.fromRadians(longitude, latitude, altitude, Scratch.scratchGeographic);
    }

    /**
     * 获取当前地理坐标的克隆。
     * @param {Geographic} [result] 用于存储结果的 Geographic 实例
     * @returns {Geographic} 当前地理坐标的副本
     */
    getGeographic(result) {
        return this._geographic.clone(result);
    }

    /**
     * 沿经度方向平移指定数值，并自动将经度限制在 [-180, 180] 范围内。
     * @param {number} value 平移量，正数向东、负数向西
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLongitude(value, degrees = true) {
        value = parseNumber(value);
        if (value !== 0) {
            if (degrees === false)
                value = CesiumMath.toDegrees(value);
            let longitude = this._geographic.longitude + value;
            if (longitude > 180)
                longitude -= 360;
            else if (longitude < -180)
                longitude += 360;
            this._geographic.longitude = longitude;
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
        }
    }

    /**
     * 沿纬度方向平移指定数值，并自动将纬度限制在 [-90, 90] 范围内。
     * @param {number} value 平移量，正数向北、负数向南
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLatitude(value, degrees = true) {
        value = parseNumber(value);
        if (value !== 0) {
            if (degrees === false)
                value = CesiumMath.toDegrees(value);
            let latitude = this._geographic.latitude + value;
            if (latitude > 90)
                latitude = 90;
            else if (latitude < -90)
                latitude = -90;
            this._geographic.latitude = latitude;
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
        }
    }

    /**
     * 平移高度（海拔）。
     * @param {number} value 高度平移量，单位米
     * @param {boolean} [degrees=true] 是否为角度制，false 时会将 value 由弧度换算为角度
     * @returns {void}
     */
    translateAltitude(value, degrees = true) {
        value = parseNumber(value);
        if (value !== 0) {
            if (degrees === false)
                value = CesiumMath.toDegrees(value);
            this._geographic.altitude += value;
            this.geographicChanged = true;
            this.positionChanged = false;
            this.raisePropertyChangeEvent('geographic', this._geographic);
        }
    }

    /**
     * 获取当前的固定坐标系变换矩阵。
     * @returns {Matrix4} 东-北-天固定坐标系变换矩阵
     */
    get matrix() {
        return this._matrix;
    }

    // getMatrix(result) {
    //     return this._matrix.clone(result);
    // }

    /**
     * 根据当前状态重新计算变换矩阵。
     * 若地理坐标或位置发生变化则先同步二者，随后在需要或强制时重建东-北-天矩阵并触发变更事件。
     * @param {boolean} [force] 是否强制更新矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateMatrix(force) {
        if (this.geographicChanged) {
            this._position = this._geographic.toCartesian(this.ellipsoid, this._position);
            this.geographicChanged = false;
            this.needsUpdate = true;
        } else if (this.positionChanged) {
            this._geographic = this._position.toGeographic(this.ellipsoid, this._geographic);
            this.positionChanged = false;
            this.needsUpdate = true;
        }
        if (force || this.needsUpdate) {
            this._matrix = Transforms.eastNorthUpToFixedFrame(this._position, this.ellipsoid, this._matrix);
            this._matrixChangeEvent.raiseEvent(this.owner, this._matrix);
            this.needsUpdate = false;
            return true;
        }
    }

    /**
     * 每帧更新，同步场景椭球体信息并按需更新矩阵。
     * @param {object} [frameState] 帧状态对象
     * @returns {boolean|undefined} 逐帧更新时返回矩阵更新结果
     */
    update(frameState) {
        if (this.isDestroyed())
            return;
        if (frameState)
            this.ellipsoid = frameState.scene.ellipsoid;
        // else
        //     this.ellipsoid = this.owner.ellipsoid;
        if (this.updateByPerFrame)
            return this.updateMatrix();
    }

    /**
     * 销毁实例时清理资源，清空矩阵变更事件并调用父类销毁逻辑。
     * @returns {void}
     */
    onDestroy() {
        this._matrixChangeEvent.clear();
        super.onDestroy();
    }
};

export default GeographicTransform;
export { GeographicTransform };
