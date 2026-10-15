import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian3, Event, Matrix4 } from "cesium";
import PropertyType from "./PropertyType.js";
import computeModelMatrix from "../utils/computeModelMatrix.js";
import resolveModelMatrixByFixedFrame from "../utils/resolveModelMatrixByFixedFrame.js";
import GeographicTransform from "./GeographicTransform.js";
import PropertyChangedListener from "./PropertyChangedListener.js";
import TranslationRotationScaleTransform from "./TranslationRotationScaleTransform.js";

/**
 * 模型矩阵变换类，继承自 PropertyChangedListener。
 * 组合地理坐标变换（GeographicTransform）与平移-旋转-缩放变换（TranslationRotationScaleTransform），
 * 通过固定坐标系矩阵与本地变换矩阵计算最终模型矩阵，并支持前置/后置变换矩阵，变化时触发相应事件。
 */
class ModelMatrixTransforms extends PropertyChangedListener {
    /**
     * 创建模型矩阵变换实例。
     * @param {object} [options={}] 配置项
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {Ellipsoid} [options.ellipsoid] 参考椭球体，未提供时取宿主对象的 ellipsoid
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {function} [options.onModelMatrixChanged] 模型矩阵变更回调函数
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        this.owner = options.owner ?? this;
        this.ellipsoid = options.ellipsoid ?? this.owner.ellipsoid;
        this._updateByPerFrame = options.updateByPerFrame ?? true;
        this.onModelMatrixChanged = options.onModelMatrixChanged ?? this.onModelMatrixChanged.bind(this.owner);
        // this.updateByPerFrame = options.updateByPerFrame;

        this._modelMatrix = Matrix4.IDENTITY.clone(new Matrix4());
        this._modelMatrixChanged = new Event();

        this._geographicTransform = new GeographicTransform({
            owner: this.owner,
            ellipsoid: this.ellipsoid,
            updateByPerFrame: this.updateByPerFrame,
        });
        this._geographicTransform.undeletable = true;
        this._geographicTransform.propertyChanged.addEventListener((raiser, name, value, type) => {
            if (!this.isDestroyed()) {
                this.raisePropertyChangeEvent(name, value, type);
                this.needsUpdateModelMatrix = true;
            }
        });
        this._trsTransform = new TranslationRotationScaleTransform({
            owner: this.owner,
            ellipsoid: this.ellipsoid,
            updateByPerFrame: this.updateByPerFrame,
        });
        this._trsTransform.undeletable = true;
        this._trsTransform.propertyChanged.addEventListener((raiser, name, value, type) => {
            if (!this.isDestroyed()) {
                this.raisePropertyChangeEvent(name, value, type);
                this.needsUpdateModelMatrix = true;
            }
        });

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置位置、变换矩阵等参数。
     * @param {object} transforms 变换配置
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        this._geographicTransform.setTransforms(transforms);
        this._trsTransform.setTransforms(transforms);
        if (transforms.beforeTransformMatrix)
            this.beforeTransformMatrix = transforms.beforeTransformMatrix;
        if (transforms.afterTransformMatrix)
            this.afterTransformMatrix = transforms.afterTransformMatrix;
        if (transforms.modelMatrix)
            this.modelMatrix = transforms.modelMatrix;
    }

    /**
     * 设置是否逐帧自动更新矩阵，并同步到内部的坐标与变换对象。
     * @param {boolean} value 是否逐帧自动更新
     * @returns {void}
     */
    set updateByPerFrame(value) {
        Check.typeOf.bool('updateByPerFrame', value);
        if (this._updateByPerFrame !== value) {
            this._updateByPerFrame = value;
            this._geographicTransform.updateByPerFrame = value;
            this._trsTransform.updateByPerFrame = value;
        }
    }

    /**
     * 获取是否逐帧自动更新矩阵。
     * @returns {boolean} 是否逐帧自动更新
     */
    get updateByPerFrame() {
        return this._updateByPerFrame;
    }

    /**
     * 获取模型矩阵变更事件对象。
     * @returns {Event} 模型矩阵变更事件对象
     */
    get modelMatrixChanged() {
        return this._modelMatrixChanged;
    }

    /**
     * @deprecated use modelMatrixChanged instead
    */
    get modelMatrixChangeEvent() {
        console.warn("modelMatrixChangeEvent is deprecated. Use modelMatrixChanged instead.");
        return this.modelMatrixChanged;
    }

    /**
     * 模型矩阵发生变更时的回调钩子，子类可重写。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    onModelMatrixChanged(modelMatrix) { }

    /**
     * 触发模型矩阵变更事件并调用对应回调。
     * @param {Matrix4} modelMatrix 变更后的模型矩阵
     * @returns {void}
     */
    raiseModelMatrixChangeEvent(modelMatrix) {
        this._modelMatrixChanged.raiseEvent(this.owner, modelMatrix);
        this.onModelMatrixChanged(modelMatrix);
    }

    /**
     * 设置世界坐标位置（委托给内部地理坐标变换对象）。
     * @param {Cartesian3|object} value 世界坐标位置
     * @returns {void}
     */
    set position(value) {
        this._geographicTransform.position = value;
    }

    /**
     * 获取世界坐标位置。
     * @returns {Cartesian3} 世界坐标位置
     */
    get position() {
        return this._geographicTransform.position;
    }

    /**
     * 设置世界坐标位置，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setPosition(x, y, z) {
        this._geographicTransform.setPosition(x, y, z);
    }

    /**
     * 获取世界坐标位置的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 世界坐标位置副本
     */
    getPosition(result) {
        return this._geographicTransform.getPosition(result);
    }

    /**
     * 设置地理坐标（经纬高）。
     * @param {Geographic|object} value 地理坐标
     * @returns {void}
     */
    set geographic(value) {
        this._geographicTransform.geographic = value;
    }

    /**
     * 获取地理坐标。
     * @returns {Geographic} 地理坐标
     */
    get geographic() {
        return this._geographicTransform.geographic;
    }

    /**
     * 设置地理坐标，支持传入 Geographic 对象或经纬高数值。
     * @param {Geographic|number} longitude Geographic 对象或经度
     * @param {number} [latitude] 纬度
     * @param {number} [altitude] 高度，单位米
     * @param {boolean} [degrees=true] 传入的经纬度是否为角度制
     * @returns {void}
     */
    setGeographic(longitude, latitude, altitude, degrees) {
        this._geographicTransform.setGeographic(longitude, latitude, altitude, degrees);
    }

    /**
     * 获取地理坐标的克隆。
     * @param {Geographic} [result] 用于存储结果的 Geographic 实例
     * @returns {Geographic} 地理坐标副本
     */
    getGeographic(result) {
        return this._geographicTransform.getGeographic(result);
    }

    /**
     * 沿经度方向平移指定数值。
     * @param {number} value 平移量
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLongitude(value, degrees) {
        this._geographicTransform.translateLongitude(value, degrees);
    }

    /**
     * 沿纬度方向平移指定数值。
     * @param {number} value 平移量
     * @param {boolean} [degrees=true] 是否为角度制，false 表示弧度制
     * @returns {void}
     */
    translateLatitude(value, degrees) {
        this._geographicTransform.translateLatitude(value, degrees);
    }

    /**
     * 平移高度（海拔）。
     * @param {number} value 高度平移量，单位米
     * @param {boolean} [degrees=true] 是否为角度制，false 时会将 value 由弧度换算为角度
     * @returns {void}
     */
    translateAltitude(value, degrees) {
        this._geographicTransform.translateAltitude(value, degrees);
    }

    /**
     * 获取固定坐标系（东-北-天）变换矩阵。
     * @returns {Matrix4} 固定坐标系变换矩阵
     */
    get fixedFrameMatrix() {
        return this._geographicTransform.matrix;
    }

    /**
     * 设置相对于本地坐标系的平移分量。
     * @param {Cartesian3|Array|object} value 平移分量
     * @returns {void}
     */
    set translation(value) {
        this._trsTransform.translation = value;
    }

    /**
     * 获取相对于本地坐标系的平移分量。
     * @returns {Cartesian3} 平移分量
     */
    get translation() {
        return this._trsTransform.translation;
    }

    /**
     * 设置平移分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setTranslation(x, y, z) {
        this._trsTransform.setTranslation(x, y, z);
    }

    /**
     * 获取平移分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 平移分量副本
     */
    getTranslation(result) {
        return this._trsTransform.getTranslation(result);
    }

    /**
     * 平移变换，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 local
     * @param {number} [z] z 分量
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translate(x, y, z, local) {
        this._trsTransform.translate(x, y, z, local);
    }

    /**
     * 沿指定轴平移指定距离。
     * @param {Cartesian3} axis 平移轴方向
     * @param {number} distance 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateOnAxis(axis, distance, local) {
        this._trsTransform.translateOnAxis(axis, distance, local);
    }

    /**
     * 沿 X 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateX(value, local) {
        this._trsTransform.translateX(value, local);
    }

    /**
     * 沿 Y 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateY(value, local) {
        this._trsTransform.translateY(value, local);
    }

    /**
     * 沿 Z 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移
     * @returns {void}
     */
    translateZ(value, local) {
        this._trsTransform.translateZ(value, local);
    }

    /**
     * 设置旋转参考系类型。
     * @param {number} value 旋转参考系类型，取值参考 RotationFrameType
     * @returns {void}
     */
    set rotationFrameType(value) {
        this._trsTransform.rotationFrameType = value;
    }

    /**
     * 获取旋转参考系类型。
     * @returns {number} 旋转参考系类型，取值参考 RotationFrameType
     */
    get rotationFrameType() {
        return this._trsTransform.rotationFrameType;
    }

    /**
     * 以 HeadingPitchRoll 形式设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量
     * @returns {void}
     */
    set rotation(value) {
        this._trsTransform.rotation = value;
    }

    /**
     * 获取旋转量（HeadingPitchRoll 形式）。
     * @returns {HeadingPitchRoll} 旋转量
     */
    get rotation() {
        return this._trsTransform.rotation;
    }

    /**
     * 以角度制设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量（角度制）
     * @returns {void}
     */
    set rotationDegrees(value) {
        this._trsTransform.rotationDegrees = value;
    }

    /**
     * 获取角度制表示的旋转量。
     * @returns {HeadingPitchRoll} 旋转量（角度制）
     */
    get rotationDegrees() {
        return this._trsTransform.rotationDegrees;
    }

    /**
     * 设置旋转量，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @returns {void}
     */
    setRotation(heading, pitch, roll, degrees) {
        this._trsTransform.setRotation(heading, pitch, roll, degrees);
    }

    /**
     * 获取旋转量的克隆。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 旋转量副本
     */
    getRotation(result) {
        return this._trsTransform.getRotation(result);
    }

    /**
     * 以姿态（yaw、pitch、roll）设置旋转量。
     * @param {Array|object} value 姿态数据
     * @returns {void}
     */
    set attitude(value) {
        this._trsTransform.attitude = value;
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @returns {HeadingPitchRoll} 姿态数据
     */
    get attitude() {
        return this._trsTransform.attitude;
    }

    /**
     * 设置姿态，支持传入对象或数值。
     * @param {object|number} yaw 姿态对象或 yaw 分量
     * @param {number} [pitch] pitch 分量
     * @param {number} [roll] roll 分量
     * @returns {void}
     */
    setAttitude(yaw, pitch, roll) {
        this._trsTransform.setAttitude(yaw, pitch, roll);
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 姿态数据
     */
    getAttitude(result) {
        return this._trsTransform.getAttitude(result);
    }

    /**
     * 以欧拉角（弧度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（弧度制）
     * @returns {void}
     */
    set euler(value) {
        this._trsTransform.euler = value;
    }

    /**
     * 获取欧拉角（弧度制）表示的旋转量。
     * @returns {Cartesian3} 欧拉角（弧度制）
     */
    get euler() {
        return this._trsTransform.euler;
    }

    /**
     * 以欧拉角（角度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（角度制）
     * @returns {void}
     */
    set eulerDegrees(value) {
        this._trsTransform.eulerDegrees = value;
    }

    /**
     * 获取欧拉角（角度制）表示的旋转量。
     * @returns {Cartesian3} 欧拉角（角度制）
     */
    get eulerDegrees() {
        return this._trsTransform.eulerDegrees;
    }

    /**
     * 设置欧拉角，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @returns {void}
     */
    setEuler(x, y, z, degrees) {
        this._trsTransform.setEuler(x, y, z, degrees);
    }

    /**
     * 获取欧拉角。
     * @param {Cartesian3} [result] 用于存储结果的实例
     * @returns {Cartesian3} 欧拉角
     */
    getEuler(result) {
        return this._trsTransform.getEuler(result);
    }

    /**
     * 旋转，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @returns {void}
     */
    rotate(heading, pitch, roll, degrees) {
        this._trsTransform.rotate(heading, pitch, roll, degrees);
    }

    /**
     * 按欧拉角旋转，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @returns {void}
     */
    rotateByEuler(x, y, z, degrees) {
        this._trsTransform.rotateByEuler(x, y, z, degrees);
    }

    /**
     * 绕指定轴旋转指定角度。
     * @param {Cartesian3} axis 旋转轴方向
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateOnAxis(axis, value, degrees) {
        this._trsTransform.rotateOnAxis(axis, value, degrees);
    }

    /**
     * 绕朝向（Heading）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateHeading(value, degrees) {
        this._trsTransform.rotateHeading(value, degrees);
    }

    /**
     * 绕俯仰（Pitch）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotatePitch(value, degrees) {
        this._trsTransform.rotatePitch(value, degrees);
    }

    /**
     * 绕翻滚（Roll）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateRoll(value, degrees) {
        this._trsTransform.rotateRoll(value, degrees);
    }

    /**
     * 绕 X 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateX(value, degrees) {
        this._trsTransform.rotateX(value, degrees);
    }

    /**
     * 绕 Y 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateY(value, degrees) {
        this._trsTransform.rotateY(value, degrees);
    }

    /**
     * 绕 Z 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @returns {void}
     */
    rotateZ(value, degrees) {
        this._trsTransform.rotateZ(value, degrees);
    }

    /**
     * 以四元数设置旋转量。
     * @param {Quaternion} value 四元数
     * @returns {void}
     */
    set quaternion(value) {
        this._trsTransform.quaternion = value;
    }

    /**
     * 获取四元数表示的旋转量。
     * @returns {Quaternion} 四元数
     */
    get quaternion() {
        return this._trsTransform.quaternion;
    }

    /**
     * 设置缩放分量。
     * @param {Cartesian3|Array|object} value 缩放分量
     * @returns {void}
     */
    set scale(value) {
        this._trsTransform.scale = value;
    }

    /**
     * 获取缩放分量。
     * @returns {Cartesian3} 缩放分量
     */
    get scale() {
        return this._trsTransform.scale;
    }

    /**
     * 设置缩放分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setScale(x, y, z) {
        this._trsTransform.setScale(x, y, z);
    }

    /**
     * 获取缩放分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 缩放分量副本
     */
    getScale(result) {
        return this._trsTransform.getScale(result);
    }

    /**
     * 获取本地坐标系下的变换矩阵。
     * @returns {Matrix4} 本地变换矩阵
     */
    get localTransformMatrix() {
        return this._trsTransform.matrix;
    }

    /**
     * 设置前置变换矩阵，在本地变换之前应用；传入 undefined 表示清除。
     * @param {Matrix4} value 前置变换矩阵
     * @returns {void}
     */
    set beforeTransformMatrix(value) {
        if (defined(value)) {
            Check.instanceOf('beforeTransformMatrix', value, Matrix4);
            if (!Matrix4.equals(value, this._beforeTransformMatrix)) {
                this._beforeTransformMatrix = Matrix4.clone(value, this._beforeTransformMatrix);
                this.needsUpdateModelMatrix = true;
                this.raisePropertyChangeEvent('beforeTransformMatrix', value);
            }
        } else if (defined(this._beforeTransformMatrix)) {
            this._beforeTransformMatrix = undefined;
            this.needsUpdateModelMatrix = true;
            this.raisePropertyChangeEvent('beforeTransformMatrix', value);
        }
    }

    /**
     * 获取前置变换矩阵。
     * @returns {Matrix4} 前置变换矩阵
     */
    get beforeTransformMatrix() {
        return this._beforeTransformMatrix;
    }

    /**
     * 设置后置变换矩阵，在本地变换之后应用；传入 undefined 表示清除。
     * @param {Matrix4} value 后置变换矩阵
     * @returns {void}
     */
    set afterTransformMatrix(value) {
        if (defined(value)) {
            Check.instanceOf('afterTransformMatrix', value, Matrix4);
            if (!Matrix4.equals(value, this._afterTransformMatrix)) {
                this._afterTransformMatrix = Matrix4.clone(value, this._afterTransformMatrix);
                this.needsUpdateModelMatrix = true;
                this.raisePropertyChangeEvent('afterTransformMatrix', value);
            }
        } else if (defined(this._afterTransformMatrix)) {
            this._afterTransformMatrix = undefined;
            this.needsUpdateModelMatrix = true;
            this.raisePropertyChangeEvent('afterTransformMatrix', value);
        }
    }

    /**
     * 获取后置变换矩阵。
     * @returns {Matrix4} 后置变换矩阵
     */
    get afterTransformMatrix() {
        return this._afterTransformMatrix;
    }

    /**
     * 通过完整模型矩阵反解出位置、旋转、缩放并应用到各变换分量。
     * @param {Matrix4} value 模型矩阵
     * @returns {void}
     */
    set modelMatrix(value) {
        Check.instanceOf('modelMatrix', value, Matrix4);
        if (!Matrix4.equals(value, this._modelMatrix)) {
            const result = resolveModelMatrixByFixedFrame(value, this.ellipsoid);
            this.position = result.position;
            this.translation = Cartesian3.ZERO;
            this.rotation = result.rotation;
            this.scale = result.scale;
            this.beforeTransformMatrix = undefined;
            this.afterTransformMatrix = undefined;
        }
    }

    /**
     * 获取当前的模型矩阵。
     * @returns {Matrix4} 模型矩阵
     */
    get modelMatrix() {
        return this._modelMatrix;
    }

    /**
     * 异步获取模型矩阵中的实际世界坐标位置，会等待位置与模型矩阵更新完成后返回。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Promise<Cartesian3>} 解析为实际世界坐标位置的 Promise
     */
    getActualPosition(result) {
        return new Promise((resolve, reject) => {

            const doGetActualPosition = () => {
                if (this._geographicTransform.positionChanged || this._geographicTransform.geographicChanged || this.needsUpdateModelMatrix) {
                    setTimeout(doGetActualPosition, 10);
                    return;
                }

                if (!result)
                    result = new Cartesian3();
                Matrix4.getTranslation(this.modelMatrix, result);
                resolve(result);
            }

            doGetActualPosition();
        });
    }

    /**
     * 根据固定坐标系矩阵与各级变换矩阵重新计算模型矩阵，并触发相应变更事件。
     * @param {boolean} [force] 是否强制更新模型矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateModelMatrix(force) {
        if (force || this.needsUpdateModelMatrix) {
            this._modelMatrix = computeModelMatrix({
                fixedFrameMatrix: this.fixedFrameMatrix,
                beforeTransformMatrix: this.beforeTransformMatrix,
                localTransformMatrix: this.localTransformMatrix,
                afterTransformMatrix: this.afterTransformMatrix,
                ellipsoid: this.ellipsoid,
            }, this._modelMatrix);
            this.raisePropertyChangeEvent('modelMatrix', this._modelMatrix, PropertyType.MODELMATRIX);
            this.raiseModelMatrixChangeEvent(this._modelMatrix);
            this.needsUpdateModelMatrix = false;
            // console.log('computeModelMatrix:', this._modelMatrix);
            return true;
        }
    }

    /**
     * 每帧更新，先更新内部坐标与变换对象，再按需更新模型矩阵。
     * @param {object} [frameState] 帧状态对象
     * @returns {boolean|undefined} 模型矩阵更新结果
     */
    update(frameState) {
        if (this.isDestroyed())
            return;
        if (frameState)
            this.ellipsoid = frameState.scene.ellipsoid;
        if (this._geographicTransform.update(frameState)) {
            this.needsUpdateModelMatrix = true;
        }
        if (this._trsTransform.update(frameState)) {
            this.needsUpdateModelMatrix = true;
        }
        return this.updateModelMatrix();
    }

    /**
     * 销毁实例时清理资源，清空事件并销毁内部坐标与变换对象。
     * @returns {void}
     */
    onDestroy() {
        this._modelMatrixChanged.clear();
        this._geographicTransform.destroy();
        this._trsTransform.destroy();
        super.onDestroy();
    }
};

export default ModelMatrixTransforms;
export { ModelMatrixTransforms };
