import Check from "@lijuhong1981/jscheck/src/Check.js";
import parseNumber from "@lijuhong1981/jsmath/src/parseNumber.js";
import parseAttitudeToHeadingPitchRoll from "../parses/parseAttitudeToHeadingPitchRoll.js";
import parseEulerToHeadingPitchRoll from "../parses/parseEulerToHeadingPitchRoll.js";
import parseRotationToHeadingPitchRoll from "../parses/parseRotationToHeadingPitchRoll.js";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import Scratch from "../utils/Scratch.js";
import PropertyChangedListener from "./PropertyChangedListener.js";
import { Cartesian3, Math as CesiumMath, Event, HeadingPitchRoll, Matrix4, Quaternion } from "cesium";

/**
 * 旋转参考系类型枚举，用于指定旋转所基于的坐标系。
 * 该对象已被 Object.freeze 冻结，不可修改。
 */
const RotationFrameType = Object.freeze({
    /** 无特殊参考系，使用标准东-北-天坐标系 */
    NONE: 0x00,
    /** 相机参考系 */
    CAMERA: 0x01,
    /** 三维文本参考系 */
    TEXT3D: 0x02,
});

/**
 * 将变换矩阵分解为平移、旋转（朝向/俯仰/翻滚）、缩放分量，并按参考系类型对俯仰与翻滚进行换算。
 * @param {Matrix4} matrix 待分解的变换矩阵
 * @param {Cartesian3} translation 输出参数，接收平移分量
 * @param {HeadingPitchRoll} headingPitchRoll 输出参数，接收旋转分量
 * @param {Cartesian3} scale 输出参数，接收缩放分量
 * @param {number} rotationFrameType 旋转参考系类型，取值参考 RotationFrameType
 * @returns {void}
 */
function decompose(matrix, translation, headingPitchRoll, scale, rotationFrameType) {
    Matrix4.getTranslation(matrix, translation);
    Matrix4.getHeadingPitchRoll(matrix, headingPitchRoll);
    if (rotationFrameType === RotationFrameType.CAMERA) {
        const pitch = headingPitchRoll.roll;
        const roll = -headingPitchRoll.pitch;
        headingPitchRoll.pitch = pitch;
        headingPitchRoll.roll = roll;
    } else if (rotationFrameType === RotationFrameType.TEXT3D) {
        const pitch = headingPitchRoll.roll;
        const roll = headingPitchRoll.pitch;
        headingPitchRoll.pitch = pitch;
        headingPitchRoll.roll = roll;
    }
    Matrix4.getScale(matrix, scale);
}

/**
 * 平移-旋转-缩放变换类，继承自 PropertyChangedListener。
 * 以平移、旋转（HeadingPitchRoll / 四元数 / 欧拉角 / 姿态）、缩放维护 4x4 变换矩阵，
 * 支持多种旋转表示方式以及本地/世界坐标下的平移与旋转操作，并在变化时触发相应事件。
 */
class TranslationRotationScaleTransform extends PropertyChangedListener {
    /**
     * 创建平移-旋转-缩放变换实例。
     * @param {object} [options={}] 配置项
     * @param {Matrix4} [options.matrix] 初始变换矩阵，默认单位矩阵
     * @param {object} [options.owner] 宿主对象，未提供时默认为当前实例
     * @param {boolean} [options.updateByPerFrame=true] 是否逐帧自动更新矩阵
     * @param {number} [options.rotationFrameType] 旋转参考系类型，取值参考 RotationFrameType
     * @param {function} [options.onPropertyValueChanged] 属性变更回调函数
     */
    constructor(options = {}) {
        super(options.onPropertyValueChanged);

        const matrix = options.matrix ?? Matrix4.IDENTITY.clone(new Matrix4());
        Check.instanceOf('matrix', matrix, Matrix4);
        this.owner = options.owner ?? this;
        this.updateByPerFrame = options.updateByPerFrame ?? true;

        this._matrix = matrix;
        this._translation = new Cartesian3();
        this._rotation = new HeadingPitchRoll();
        this._rotationFrameType = options.rotationFrameType ?? RotationFrameType.NONE;
        this._scale = new Cartesian3(1, 1, 1);

        this.matrixChanged = new Event();

        decompose(this._matrix, this._translation, this._rotation, this._scale, this._rotationFrameType);

        this.setTransforms(options);
    }

    /**
     * 根据传入的配置对象设置平移、旋转、缩放等变换参数。
     * @param {object} transforms 变换配置，可包含 translation、attitude、rotation、scale、scale3
     * @returns {void}
     */
    setTransforms(transforms) {
        if (!transforms)
            return;

        if (transforms.translation)
            this.translation = transforms.translation;
        if (transforms.attitude)
            this.attitude = transforms.attitude;
        else if (transforms.rotation)
            this.rotation = transforms.rotation;
        if (transforms.scale)
            this.scale = transforms.scale;
        else if (transforms.scale3)
            this.scale = transforms.scale3;
    }

    /**
     * @deprecated The matrixChangeEvent property has deprecated, use matrixChanged instead.
    */
    get matrixChangeEvent() {
        console.warn("The matrixChangeEvent property has deprecated, use matrixChanged instead.");
        return this.matrixChanged;
    }

    /**
     * 设置平移分量。
     * @param {Cartesian3|Array|object} value 平移分量
     * @returns {void}
     */
    set translation(value) {
        value = parseToCartesian3(value, Scratch.scratchTranslation, 0.0);
        if (!Cartesian3.equals(value, this._translation)) {
            value.clone(this._translation);
            this.raisePropertyChangeEvent('translation', this._translation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取平移分量。
     * @returns {Cartesian3} 平移分量
     */
    get translation() {
        return this._translation;
    }

    /**
     * 设置旋转参考系类型。
     * @param {number} value 旋转参考系类型，取值参考 RotationFrameType
     * @returns {void}
     */
    set rotationFrameType(value) {
        if (this._rotationFrameType !== value) {
            this._rotationFrameType = value;
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取旋转参考系类型。
     * @returns {number} 旋转参考系类型，取值参考 RotationFrameType
     */
    get rotationFrameType() {
        return this._rotationFrameType;
    }

    /**
     * 以 HeadingPitchRoll 形式设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量
     * @returns {void}
     */
    set rotation(value) {
        value = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll);
        if (!HeadingPitchRoll.equals(value, this._rotation)) {
            value.clone(this._rotation);
            this.raisePropertyChangeEvent('rotation', this._rotation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取旋转量（HeadingPitchRoll 形式）。
     * @returns {HeadingPitchRoll} 旋转量
     */
    get rotation() {
        return this._rotation;
    }

    /**
     * 以角度制设置旋转量。
     * @param {HeadingPitchRoll|Array|object} value 旋转量（角度制）
     * @returns {void}
     */
    set rotationDegrees(value) {
        value = parseRotationToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, true);
        this.rotation = value;
    }

    /**
     * 获取角度制表示的旋转量。
     * @returns {HeadingPitchRoll|undefined} 旋转量（角度制）
     */
    get rotationDegrees() {
        if (this._rotation)
            return this._rotation.toDegrees();
    }

    /**
     * 以姿态（yaw、pitch、roll）设置旋转量。
     * @param {Array|object} value 姿态数据
     * @returns {void}
     */
    set attitude(value) {
        value = parseAttitudeToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll);
        this.rotation = value;
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @returns {HeadingPitchRoll|undefined} 姿态数据
     */
    get attitude() {
        return this.rotationDegrees;
    }

    /**
     * 以欧拉角（弧度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（弧度制）
     * @returns {void}
     */
    set euler(value) {
        value = parseEulerToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, false);
        this.rotation = value;
    }

    /**
     * 获取欧拉角（弧度制）表示的旋转量。
     * @returns {Cartesian3|undefined} 欧拉角（弧度制）
     */
    get euler() {
        if (this._rotation)
            return this._rotation.toEuler();
    }

    /**
     * 以欧拉角（角度制）设置旋转量。
     * @param {Cartesian3|Array|object} value 欧拉角（角度制）
     * @returns {void}
     */
    set eulerDegrees(value) {
        value = parseEulerToHeadingPitchRoll(value, Scratch.scratchHeadingPitchRoll, true);
        this.rotation = value;
    }

    /**
     * 获取欧拉角（角度制）表示的旋转量。
     * @returns {Cartesian3|undefined} 欧拉角（角度制）
     */
    get eulerDegrees() {
        if (this._rotation)
            return this._rotation.toEulerDegrees();
    }

    /**
     * 以四元数设置旋转量。
     * @param {Quaternion} value 四元数
     * @returns {void}
     */
    set quaternion(value) {
        value = HeadingPitchRoll.fromQuaternion(value, Scratch.scratchHeadingPitchRoll);
        this.rotation = value;
    }

    /**
     * 获取四元数表示的旋转量。
     * @returns {Quaternion|undefined} 四元数
     */
    get quaternion() {
        if (this._rotation)
            return Quaternion.fromHeadingPitchRoll(this._rotation);
    }

    /**
     * 设置缩放分量。
     * @param {Cartesian3|Array|object} value 缩放分量
     * @returns {void}
     */
    set scale(value) {
        value = parseToCartesian3(value, Scratch.scratchScale3, 1.0);
        if (!Cartesian3.equals(value, this._scale)) {
            value.clone(this._scale);
            this.raisePropertyChangeEvent('scale', this._scale);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 获取缩放分量。
     * @returns {Cartesian3} 缩放分量
     */
    get scale() {
        return this._scale;
    }

    /**
     * 设置平移分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setTranslation(x, y, z) {
        if (typeof x === 'object') {
            this.translation = x;
        } else {
            this.translation = Cartesian3.fromElements(x, y, z, Scratch.scratchTranslation);
        }
    }

    /**
     * 获取平移分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 平移分量副本
     */
    getTranslation(result) {
        return this._translation.clone(result);
    }

    /**
     * 平移变换。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 local
     * @param {number} [z] z 分量
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translate(x, y, z, local = true) {
        let translate;
        if (typeof x === 'object') {
            local = y ?? true;
            translate = parseToCartesian3(x, Scratch.scratchTranslate, 0.0);
        } else {
            translate = Cartesian3.fromElements(x, y, z, Scratch.scratchTranslate);
        }
        if (Cartesian3.equals(translate, Cartesian3.ZERO))
            return;
        if (local) {
            Matrix4.multiplyByTranslation(this._matrix, translate, this._matrix);
            Matrix4.getTranslation(this._matrix, this._translation);
            this.raisePropertyChangeEvent('translation', this._translation);
            if (!this.updateByPerFrame)
                this.matrixChanged.raiseEvent(this.owner, this._matrix);
            else
                this.needsUpdate = true;
        } else {
            Cartesian3.add(this._translation, translate, this._translation);
            this.raisePropertyChangeEvent('translation', this._translation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 沿指定轴平移指定距离。
     * @param {Cartesian3} axis 平移轴方向
     * @param {number} distance 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateOnAxis(axis, distance, local = true) {
        distance = parseNumber(distance);
        if (distance !== 0) {
            Cartesian3.normalize(axis, axis);
            const translate = Cartesian3.multiplyByScalar(axis, distance, Scratch.scratchTranslate);
            this.translate(translate, local);
        }
    }

    /**
     * 沿 X 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateX(value, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.translate(value, 0, 0, local);
        }
    }

    /**
     * 沿 Y 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateY(value, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.translate(0, value, 0, local);
        }
    }

    /**
     * 沿 Z 轴平移指定距离。
     * @param {number} value 平移距离
     * @param {boolean} [local=true] 是否在本地坐标系平移，false 表示世界坐标系
     * @returns {void}
     */
    translateZ(value, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.translate(0, 0, value, local);
        }
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
        let rotation;
        if (typeof heading === 'object') {
            rotation = heading;
            degrees = pitch;
        } else {
            rotation = {
                heading: heading,
                pitch: pitch,
                roll: roll,
            };
        }
        this.rotation = parseRotationToHeadingPitchRoll(rotation, Scratch.scratchHeadingPicthRoll, degrees);
    }

    /**
     * 获取旋转量的克隆。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 旋转量副本
     */
    getRotation(result) {
        return this._rotation.clone(result);
    }

    /**
     * 设置姿态（yaw、pitch、roll），支持传入对象或数值。
     * @param {object|number} yaw 姿态对象或 yaw 分量
     * @param {number} [pitch] pitch 分量
     * @param {number} [roll] roll 分量
     * @returns {void}
     */
    setAttitude(yaw, pitch, roll) {
        if (typeof yaw === 'object')
            this.attitude = yaw;
        else
            this.rotation = HeadingPitchRoll.fromDegrees(yaw, pitch, roll, Scratch.scratchHeadingPicthRoll);
    }

    /**
     * 获取姿态（yaw、pitch、roll，角度制）。
     * @param {HeadingPitchRoll} [result] 用于存储结果的实例
     * @returns {HeadingPitchRoll} 姿态数据
     */
    getAttitude(result) {
        return this._rotation.toDegrees(result);
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
        let euler;
        if (typeof x === 'object') {
            euler = x;
            degrees = y;
        } else {
            euler = Cartesian3.fromElements(x, y, z, Scratch.scratchEuler);
        }
        this.rotation = parseEulerToHeadingPitchRoll(euler, Scratch.scratchHeadingPicthRoll, degrees);
    }

    /**
     * 获取欧拉角。
     * @param {Cartesian3} [result] 用于存储结果的实例
     * @returns {Cartesian3} 欧拉角
     */
    getEuler(result) {
        return this._rotation.toEuler(result);
    }

    /**
     * 旋转，支持传入 HeadingPitchRoll 对象或 heading、pitch、roll 分量。
     * @param {HeadingPitchRoll|number} heading HeadingPitchRoll 对象或朝向角
     * @param {number|boolean} [pitch] 俯仰角；当 heading 为对象时表示 degrees
     * @param {number} [roll] 翻滚角
     * @param {boolean} [degrees] 旋转量是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotate(heading, pitch, roll, degrees, local = true) {
        let rotate;
        if (typeof heading === 'object') {
            rotate = heading;
            degrees = pitch;
        } else {
            rotate = {
                heading: heading,
                pitch: pitch,
                roll: roll,
            };
        }
        rotate = parseRotationToHeadingPitchRoll(rotate, Scratch.scratchHeadingPicthRoll, degrees);
        if (HeadingPitchRoll.equals(rotate, HeadingPitchRoll.ZERO))
            return;
        if (local) {
            if (this._rotationFrameType === RotationFrameType.CAMERA) {
                const pitch = rotate.pitch;
                const roll = rotate.roll;
                rotate.pitch = -roll;
                rotate.roll = pitch;
            } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
                const pitch = rotate.pitch;
                const roll = rotate.roll;
                rotate.pitch = roll;
                rotate.roll = pitch;
            }
            Matrix4.multiplyByHeadingPitchRoll(this._matrix, rotate, this._matrix);
            Matrix4.getHeadingPitchRoll(this._matrix, this._rotation);
            if (this._rotationFrameType === RotationFrameType.CAMERA) {
                const pitch = this._rotation.roll;
                const roll = -this._rotation.pitch;
                this._rotation.pitch = pitch;
                this._rotation.roll = roll;
            } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
                const pitch = this._rotation.roll;
                const roll = this._rotation.pitch;
                this._rotation.pitch = pitch;
                this._rotation.roll = roll;
            }
            this.raisePropertyChangeEvent('rotation', this._rotation);
            if (!this.updateByPerFrame)
                this.matrixChanged.raiseEvent(this.owner, this._matrix);
            else
                this.needsUpdate = true;
        } else {
            this._rotation.heading += rotate.heading;
            this._rotation.pitch += rotate.pitch;
            this._rotation.roll += rotate.roll;
            this.raisePropertyChangeEvent('rotation', this._rotation);
            if (!this.updateByPerFrame)
                this.updateMatrix(true);
            else
                this.needsUpdate = true;
        }
    }

    /**
     * 按欧拉角旋转，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number|boolean} [y] y 分量；当 x 为对象时表示 degrees
     * @param {number} [z] z 分量
     * @param {boolean} [degrees] 欧拉角是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateByEuler(x, y, z, degrees, local = true) {
        let rotate;
        if (typeof x === 'object') {
            rotate = x;
            degrees = y;
        } else {
            rotate = Cartesian3.fromElements(x, y, z, Scratch.scratchEuler);
        }
        rotate = parseEulerToHeadingPitchRoll(rotate, Scratch.scratchHeadingPicthRoll, degrees);
        if (this._rotationFrameType === RotationFrameType.CAMERA) {
            const pitch = rotate.pitch;
            const roll = rotate.roll;
            rotate.pitch = -roll;
            rotate.roll = pitch;
        } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
            const pitch = rotate.pitch;
            const roll = rotate.roll;
            rotate.pitch = roll;
            rotate.roll = pitch;
        }
        this.rotate(rotate, degrees, local);
    }

    /**
     * 绕指定轴旋转指定角度。
     * @param {Cartesian3} axis 旋转轴方向
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateOnAxis(axis, value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            axis = Cartesian3.normalize(axis, Scratch.scratchNormal);
            if (degrees)
                value = CesiumMath.toRadians(value);
            const quaternion = Quaternion.fromAxisAngle(axis, value, Scratch.scratchQuaternion);
            const rotate = HeadingPitchRoll.fromQuaternion(quaternion, Scratch.scratchHeadingPicthRoll);
            this.rotate(rotate, degrees, local);
        }
    }

    /**
     * 绕朝向（Heading）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateHeading(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.rotate(value, 0, 0, degrees, local);
        }
    }

    /**
     * 绕俯仰（Pitch）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotatePitch(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.rotate(0, value, 0, degrees, local);
        }
    }

    /**
     * 绕翻滚（Roll）轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateRoll(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            this.rotate(0, 0, value, degrees, local);
        }
    }

    /**
     * 绕 X 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateX(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            // this.rotateOnAxis(Cartesian3.UNIT_X, value, degrees);
            this.rotateByEuler(value, 0, 0, degrees, local);
        }
    }

    /**
     * 绕 Y 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateY(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            // this.rotateOnAxis(Cartesian3.UNIT_Y, value, degrees);
            this.rotateByEuler(0, value, 0, degrees, local);
        }
    }

    /**
     * 绕 Z 轴旋转。
     * @param {number} value 旋转角度
     * @param {boolean} [degrees] 旋转角度是否为角度制
     * @param {boolean} [local=true] 是否在本地坐标系旋转，false 表示世界坐标系
     * @returns {void}
     */
    rotateZ(value, degrees, local = true) {
        value = parseNumber(value);
        if (value !== 0) {
            // this.rotateOnAxis(Cartesian3.UNIT_Z, value, degrees);
            this.rotateByEuler(0, 0, value, degrees, local);
        }
    }

    /**
     * 设置缩放分量，支持传入 Cartesian3 对象或 x、y、z 分量。
     * @param {Cartesian3|number} x Cartesian3 对象或 x 分量
     * @param {number} [y] y 分量
     * @param {number} [z] z 分量
     * @returns {void}
     */
    setScale(x, y, z) {
        if (typeof x === 'object')
            this.scale = x;
        else
            this.scale = Cartesian3.fromElements(x, y, z, Scratch.scratchScale3);
    }

    /**
     * 获取缩放分量的克隆。
     * @param {Cartesian3} [result] 用于存储结果的 Cartesian3 实例
     * @returns {Cartesian3} 缩放分量副本
     */
    getScale(result) {
        return this._scale.clone(result);
    }

    // set matrix(value) {
    //     Check.instanceOf('matrix', value, Matrix4);
    //     if (!Matrix4.equals(value, this._matrix)) {
    //         value.clone(this._matrix);

    //         decompose(this._matrix, this._translation, this._rotation, this._scale, this._rotationFrameType);

    //         this.matrixChanged.raiseEvent(this.owner, this._matrix);
    //     }
    // }

    /**
     * 获取当前的 4x4 变换矩阵。
     * @returns {Matrix4} 变换矩阵
     */
    get matrix() {
        return this._matrix;
    }

    // getMatrix(result) {
    //     return this._matrix.clone(result);
    // }

    /**
     * 根据当前平移、旋转、缩放重新计算变换矩阵。
     * @param {boolean} [force] 是否强制更新矩阵
     * @returns {boolean|undefined} 更新成功返回 true，无需更新时返回 undefined
     */
    updateMatrix(force) {
        if (force || this.needsUpdate) {
            let rotation;
            if (this._rotationFrameType === RotationFrameType.CAMERA) {
                rotation = this._rotation.clone(Scratch.scratchHeadingPicthRoll);
                rotation.pitch = -this._rotation.roll;
                rotation.roll = this._rotation.pitch;
            } else if (this._rotationFrameType === RotationFrameType.TEXT3D) {
                rotation = this._rotation.clone(Scratch.scratchHeadingPicthRoll);
                rotation.pitch = this._rotation.roll;
                rotation.roll = this._rotation.pitch;
            } else {
                rotation = this._rotation;
            }
            const quaternion = Quaternion.fromHeadingPitchRoll(rotation, Scratch.scratchQuaternion);
            Matrix4.fromTranslationQuaternionRotationScale(this._translation, quaternion, this._scale, this._matrix);
            this.matrixChanged.raiseEvent(this.owner, this._matrix);
            this.needsUpdate = false;
            return true;
        }
    }

    /**
     * 每帧更新，逐帧模式下按需更新变换矩阵。
     * @param {object} [frameState] 帧状态对象
     * @returns {boolean|undefined} 逐帧更新时返回矩阵更新结果
     */
    update(frameState) {
        if (this.isDestroyed())
            return;
        // if (frameState)
        //     this.ellipsoid = frameState.scene.ellipsoid;
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
        this.matrixChanged.clear();
        super.onDestroy();
    }
};

export default TranslationRotationScaleTransform;
export { TranslationRotationScaleTransform, TranslationRotationScaleTransform as MatrixTransform, RotationFrameType };