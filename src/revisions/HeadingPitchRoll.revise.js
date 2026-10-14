import { Cartesian3, Math as CesiumMath, Check, HeadingPitchRoll, Quaternion } from "cesium";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 HeadingPitchRoll 类，补充偏航角别名、角度转换，
 * 与四元数/欧拉角互转、取反以及打包解包等方法。
 * @class HeadingPitchRoll
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/HeadingPitchRoll.html}
*/

Object.defineProperties(HeadingPitchRoll.prototype, {
    /**
     * heading 的别名，获取/设置偏航角（弧度制）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    yaw: {
        set: function (value) {
            this.heading = value;
        },
        get: function () {
            return this.heading;
        }
    },
    /**
     * 获取航向角（角度制，单位度）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    headingDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.heading);
        }
    },
    /**
     * 获取偏航角（角度制，单位度），等同于 headingDegrees。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    yawDegrees: {
        get: function () {
            return this.headingDegrees;
        }
    },
    /**
     * 获取俯仰角（角度制，单位度）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    pitchDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.pitch);
        }
    },
    /**
     * 获取横滚角（角度制，单位度）。
     * @type {number}
     * @memberof HeadingPitchRoll
    */
    rollDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.roll);
        }
    },
});

/**
 * 由航向、俯仰、横滚角（弧度制）创建 HeadingPitchRoll。
 * @param {number} heading 航向角（弧度）。
 * @param {number} pitch 俯仰角（弧度）。
 * @param {number} roll 横滚角（弧度）。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.fromRadians = function (heading, pitch, roll, result = new HeadingPitchRoll()) {
    Check.typeOf.number('heading', heading);
    Check.typeOf.number('pitch', pitch);
    Check.typeOf.number('roll', roll);

    result.heading = heading;
    result.pitch = pitch;
    result.roll = roll;
    return result;
};

/**
 * 由旋转矩阵创建 HeadingPitchRoll。
 * @param {Matrix3} rotationMatrix 旋转矩阵。
 * @param {HeadingPitchRoll} [result] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.fromRotationMatrix = function (rotationMatrix, result) {
    const quaternion = Quaternion.fromRotationMatrix(rotationMatrix, Scratch.scratchQuaternion);
    return HeadingPitchRoll.fromQuaternion(quaternion, result);
};

/**
 * 将 HeadingPitchRoll 转换为四元数。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {Quaternion} [result] 存放结果的对象。
 * @returns {Quaternion} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toQuaternion = function (hpr, result) {
    return Quaternion.fromHeadingPitchRoll(hpr, result);
};

/**
 * 将当前 HeadingPitchRoll 转换为四元数。
 * @param {Quaternion} [result] 存放结果的对象。
 * @returns {Quaternion} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toQuaternion = function (result) {
    return HeadingPitchRoll.toQuaternion(this, result);
};

/**
 * 将 HeadingPitchRoll 转换为角度制对象（包含 heading/pitch/roll/yaw，单位度）。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {object} [result={}] 存放结果的对象。
 * @returns {object} 修改后的 result 或新建的对象。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toDegrees = function (hpr, result = {}) {
    Check.defined('headingPitchRoll', hpr);

    result.heading = CesiumMath.toDegrees(hpr.heading);
    result.pitch = CesiumMath.toDegrees(hpr.pitch);
    result.roll = CesiumMath.toDegrees(hpr.roll);
    result.yaw = result.heading;
    return result;
};

/**
 * 将当前 HeadingPitchRoll 转换为角度制对象（包含 heading/pitch/roll/yaw，单位度）。
 * @param {object} [result] 存放结果的对象。
 * @returns {object} 修改后的 result 或新建的对象。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toDegrees = function (result) {
    return HeadingPitchRoll.toDegrees(this, result);
};

/**
 * 将 HeadingPitchRoll 转换为欧拉角（Cartesian3，弧度制）。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toEuler = function (hpr, result) {
    return Cartesian3.fromElements(hpr.roll, -hpr.pitch, -hpr.heading, result);
};

/**
 * 将当前 HeadingPitchRoll 转换为欧拉角（Cartesian3，弧度制）。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toEuler = function (result) {
    return HeadingPitchRoll.toEuler(this, result);
};

/**
 * 将 HeadingPitchRoll 转换为欧拉角（Cartesian3，角度制）。
 * @param {HeadingPitchRoll} hpr 待转换的 HeadingPitchRoll。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.toEulerDegrees = function (hpr, result) {
    const euler = HeadingPitchRoll.toEuler(hpr, result);
    euler.x = CesiumMath.toDegrees(euler.x);
    euler.y = CesiumMath.toDegrees(euler.y);
    euler.z = CesiumMath.toDegrees(euler.z);
    return euler;
};

/**
 * 将当前 HeadingPitchRoll 转换为欧拉角（Cartesian3，角度制）。
 * @param {Cartesian3} [result] 存放结果的对象。
 * @returns {Cartesian3} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.toEulerDegrees = function (result) {
    return HeadingPitchRoll.toEulerDegrees(this, result);
};

/**
 * 计算 HeadingPitchRoll 的逆（航向、俯仰、横滚各角取反）。
 * @param {HeadingPitchRoll} hpr 待取反的 HeadingPitchRoll。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.inverse = function (hpr, result = new HeadingPitchRoll()) {
    Check.defined('headingPitchRoll', hpr);

    result.heading = -hpr.heading;
    result.pitch = -hpr.pitch;
    result.roll = -hpr.roll;
    return result;
};

/**
 * 计算当前 HeadingPitchRoll 的逆（各角取反）。
 * @param {HeadingPitchRoll} [result] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.prototype.inverse = function (result) {
    return HeadingPitchRoll.inverse(this, result);
};

/**
 * 打包该对象到数组时占用的元素个数。
 * @type {number}
 * @constant
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.packedLength = 3;

/**
 * 将 HeadingPitchRoll 打包到数组中。
 * @param {HeadingPitchRoll} value 待打包的 HeadingPitchRoll。
 * @param {Array} [array=[]] 输出结果的数组。
 * @param {number} [startingIndex=0] 数组开始索引。
 * @returns {Array} 返回修改后的 array 数组。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.pack = function (value, array = [], startingIndex = 0) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("value", value);
    //>>includeEnd('debug');

    array[startingIndex++] = value.heading;
    array[startingIndex++] = value.pitch;
    array[startingIndex] = value.roll;
    return array;
};

/**
 * 将数组解包为 HeadingPitchRoll。
 * @param {Array} array 输入的数组。
 * @param {number} [startingIndex=0] 数组开始索引。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 存放结果的对象。
 * @returns {HeadingPitchRoll} 修改后的 result 或新建的实例。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.unpack = function (array, startingIndex = 0, result = new HeadingPitchRoll()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    result.heading = array[startingIndex++];
    result.pitch = array[startingIndex++];
    result.roll = array[startingIndex];
    return result;
};

/**
 * 将 HeadingPitchRoll 数组打包到数组中。
 * @param {Array<HeadingPitchRoll>} hprs HeadingPitchRoll 数组。
 * @param {Array} [result=[]] 输出结果的数组。
 * @returns {Array} 返回修改后的 result 数组。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.packArray = function (hprs, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("hprs", hprs);
    //>>includeEnd('debug');

    let startingIndex = 0;
    for (let i = 0; i < hprs.length; i++) {
        HeadingPitchRoll.pack(hprs[i], result, startingIndex);
        startingIndex += HeadingPitchRoll.packedLength;
    }
    return result;
};

/**
 * 将数组解包为 HeadingPitchRoll 数组。
 * @param {Array} array 输入的数组。
 * @param {Array} [result=[]] 输出结果的数组。
 * @returns {Array<HeadingPitchRoll>} 返回修改后的 result 数组。
 * @memberof HeadingPitchRoll
 * @static
*/
HeadingPitchRoll.unpackArray = function (array, result = []) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.array("array", array);
    //>>includeEnd('debug');

    result.length = array.length / HeadingPitchRoll.packedLength;

    let startingIndex = 0;
    for (let i = 0; i < result.length; i++) {
        result[i] = HeadingPitchRoll.unpack(array, startingIndex);
        startingIndex += HeadingPitchRoll.packedLength;
    }
    return result;
};

/**
 * 值为 (0.0, 0.0, 0.0) 的不可变 HeadingPitchRoll 实例。
 * @type {HeadingPitchRoll}
 * @constant
 * @memberof HeadingPitchRoll
*/
HeadingPitchRoll.ZERO = Object.freeze(new HeadingPitchRoll(0.0, 0.0, 0.0));

export default HeadingPitchRoll;
export { HeadingPitchRoll };

