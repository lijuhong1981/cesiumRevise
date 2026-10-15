import { Cartesian3, HeadingPitchRoll, Matrix3, Matrix4, Quaternion, TranslationRotationScale } from "cesium";
import parseEulerToHeadingPitchRoll from "../parses/parseEulerToHeadingPitchRoll.js";
import parseEulerToQuaternion from "../parses/parseEulerToQuaternion.js";
import Scratch from "../utils/Scratch.js";
import Check from "@lijuhong1981/jscheck/src/Check.js";

/**
 * 扩展 Cesium 的 Matrix3 类，补充列/行向量存取、旋转分量、四元数、
 * 航向俯仰横滚角、缩放等便捷方法。
 * @class Matrix3
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Matrix3.html}
*/
/**
 * 扩展 Cesium 的 Matrix4 类，补充从四元数、航向俯仰横滚角、欧拉角创建矩阵，
 * 以及旋转、平移、缩放、四元数、欧拉角等便捷方法。
 * @class Matrix4
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Matrix4.html}
*/

//--Matrix3--

/**
 * 获取矩阵指定列的列向量。
 * @param {number} index 列索引（0、1 或 2）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定列的列向量。
 * @memberof Matrix3
*/
Matrix3.prototype.getColumn = function (index, result = new Cartesian3()) {
    return Matrix3.getColumn(this, index, result);
};

/**
 * 获取矩阵指定行的行向量。
 * @param {number} index 行索引（0、1 或 2）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定行的行向量。
 * @memberof Matrix3
*/
Matrix3.prototype.getRow = function (index, result = new Cartesian3()) {
    return Matrix3.getRow(this, index, result);
};

/**
 * 设置当前矩阵的旋转分量。
 * @param {Matrix3} rotation 旋转矩阵。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setRotation = function (rotation) {
    return Matrix3.setRotation(this, rotation, this);
};

/**
 * 获取当前矩阵的旋转分量。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 旋转矩阵。
 * @memberof Matrix3
*/
Matrix3.prototype.getRotation = function (result = new Matrix3()) {
    return Matrix3.getRotation(this, result);
};

/**
 * 通过四元数设置矩阵的旋转分量。
 * @param {Matrix3} matrix 待修改的矩阵。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 修改或生成后的矩阵。
 * @memberof Matrix3
 * @static
*/
Matrix3.setQuaternion = function (matrix, quaternion, result = new Matrix3()) {
    Check.instanceOf('matrix', matrix, Matrix3);
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const rotation = Matrix3.fromQuaternion(quaternion, Scratch.scratchRotationMatrix);
    return Matrix3.setRotation(matrix, rotation, result);
};

/**
 * 通过四元数设置当前矩阵的旋转分量。
 * @param {Quaternion} quaternion 旋转四元数。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setQuaternion = function (quaternion) {
    return Matrix3.setQuaternion(this, quaternion, this);
};

/**
 * 获取矩阵旋转分量对应的四元数。
 * @param {Matrix3} matrix 目标矩阵。
 * @param {Quaternion} [result=new Quaternion()] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix3
 * @static
*/
Matrix3.getQuaternion = function (matrix, result = new Quaternion()) {
    const rotation = Matrix3.getRotation(matrix, Scratch.scratchRotationMatrix);
    return Quaternion.fromRotationMatrix(rotation, result);
};

/**
 * 获取当前矩阵旋转分量对应的四元数。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix3
*/
Matrix3.prototype.getQuaternion = function (result) {
    return Matrix3.getQuaternion(this, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置矩阵的旋转分量。
 * @param {Matrix3} matrix 待修改的矩阵。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 修改或生成后的矩阵。
 * @memberof Matrix3
 * @static
*/
Matrix3.setHeadingPitchRoll = function (matrix, headingPitchRoll, result = new Matrix3()) {
    Check.instanceOf('matrix', matrix, Matrix3);
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const rotation = Matrix3.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchRotationMatrix);
    return Matrix3.setRotation(matrix, rotation, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置当前矩阵的旋转分量。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setHeadingPitchRoll = function (headingPitchRoll) {
    return Matrix3.setHeadingPitchRoll(this, headingPitchRoll, this);
};

/**
 * 获取矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {Matrix3} matrix 目标矩阵。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix3
 * @static
*/
Matrix3.getHeadingPitchRoll = function (matrix, result = new HeadingPitchRoll()) {
    const rotation = Matrix3.getRotation(matrix, Scratch.scratchRotationMatrix);
    return HeadingPitchRoll.fromRotationMatrix(rotation, result);
};

/**
 * 获取当前矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix3
*/
Matrix3.prototype.getHeadingPitchRoll = function (result) {
    return Matrix3.getHeadingPitchRoll(this, result);
};

/**
 * 设置当前矩阵的缩放分量。
 * @param {Cartesian3} scale 缩放比例。
 * @returns {Matrix3} 修改后的矩阵（this）。
 * @memberof Matrix3
*/
Matrix3.prototype.setScale = function (scale) {
    return Matrix3.setScale(this, scale, this);
};

/**
 * 获取当前矩阵的缩放分量。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 缩放比例。
 * @memberof Matrix3
*/
Matrix3.prototype.getScale = function (result) {
    return Matrix3.getScale(this, result);
};

/**
 * 将当前矩阵转换为按列优先排列的数组。
 * @param {Array} [result] 用于存储结果的数组。
 * @returns {Array} 矩阵元素的数组表示。
 * @memberof Matrix3
*/
Matrix3.prototype.toArray = function (result) {
    return Matrix3.toArray(this, result);
};

//--Matrix4--

/**
 * 从航向、俯仰、横滚（HeadingPitchRoll）创建一个只含旋转分量的 Matrix4。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 生成的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.fromHeadingPitchRoll = function (headingPitchRoll, result = new Matrix4()) {
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const rotation = Matrix3.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchRotationMatrix);
    return Matrix4.fromRotationTranslation(rotation, undefined, result);
};

/**
 * 从四元数创建一个只含旋转分量的 Matrix4。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 生成的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.fromQuaternion = function (quaternion, result = new Matrix4()) {
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const rotation = Matrix3.fromQuaternion(quaternion, Scratch.scratchRotationMatrix);
    return Matrix4.fromRotationTranslation(rotation, undefined, result);
};

/**
 * 获取矩阵指定列的列向量。
 * @param {number} index 列索引（0、1、2 或 3）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定列的列向量。
 * @memberof Matrix4
*/
Matrix4.prototype.getColumn = function (index, result = new Cartesian3()) {
    return Matrix4.getColumn(this, index, result);
};

/**
 * 获取矩阵指定行的行向量。
 * @param {number} index 行索引（0、1、2 或 3）。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 指定行的行向量。
 * @memberof Matrix4
*/
Matrix4.prototype.getRow = function (index, result = new Cartesian3()) {
    return Matrix4.getRow(this, index, result);
};

/**
 * 设置当前矩阵的旋转分量（3x3 部分）。
 * @param {Matrix3} rotation 旋转矩阵。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setRotation = function (rotation) {
    return Matrix4.setRotation(this, rotation, this);
};

/**
 * 获取当前矩阵的旋转分量（3x3 部分）。
 * @param {Matrix3} [result=new Matrix3()] 用于存储结果的可选对象。
 * @returns {Matrix3} 旋转矩阵。
 * @memberof Matrix4
*/
Matrix4.prototype.getRotation = function (result = new Matrix3()) {
    return Matrix4.getRotation(this, result);
};

/**
 * 设置当前矩阵的缩放分量。
 * @param {Cartesian3} scale 缩放比例。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setScale = function (scale) {
    return Matrix4.setScale(this, scale, this);
};

/**
 * 获取当前矩阵的缩放分量。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 缩放比例。
 * @memberof Matrix4
*/
Matrix4.prototype.getScale = function (result = new Cartesian3()) {
    return Matrix4.getScale(this, result);
};

/**
 * 设置当前矩阵的平移分量。
 * @param {Cartesian3} translation 平移量。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setTranslation = function (translation) {
    return Matrix4.setTranslation(this, translation, this);
};

/**
 * 获取当前矩阵的平移分量。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 平移量。
 * @memberof Matrix4
*/
Matrix4.prototype.getTranslation = function (result = new Cartesian3()) {
    return Matrix4.getTranslation(this, result);
};

/**
 * 通过四元数设置矩阵的旋转分量，保留原有的平移与缩放。
 * @param {Matrix4} matrix 待修改的矩阵。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 修改或生成后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.setQuaternion = function (matrix, quaternion, result = new Matrix4()) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const translation = Matrix4.getTranslation(matrix, Scratch.scratchTranslation);
    const scale = Matrix4.getScale(matrix, Scratch.scratchScale3);
    const translationRotationScale = new TranslationRotationScale(translation, quaternion, scale);
    return Matrix4.fromTranslationRotationScale(translationRotationScale, result);
};

/**
 * 通过四元数设置当前矩阵的旋转分量，保留原有的平移与缩放。
 * @param {Quaternion} quaternion 旋转四元数。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setQuaternion = function (quaternion) {
    return Matrix4.setQuaternion(this, quaternion, this);
};

/**
 * 获取矩阵旋转分量对应的四元数。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {Quaternion} [result=new Quaternion()] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix4
 * @static
*/
Matrix4.getQuaternion = function (matrix, result = new Quaternion()) {
    Check.instanceOf('matrix', matrix, Matrix4);

    const rotation = Matrix4.getRotation(matrix, Scratch.scratchRotationMatrix);
    return Quaternion.fromRotationMatrix(rotation, result);
};

/**
 * 获取当前矩阵旋转分量对应的四元数。
 * @param {Quaternion} [result] 用于存储结果的可选对象。
 * @returns {Quaternion} 旋转四元数。
 * @memberof Matrix4
*/
Matrix4.prototype.getQuaternion = function (result) {
    return Matrix4.getQuaternion(this, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置矩阵的旋转分量。
 * @param {Matrix4} matrix 待修改的矩阵。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 修改或生成后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.setHeadingPitchRoll = function (matrix, headingPitchRoll, result) {
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const quaternion = Quaternion.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchQuaternion);
    return Matrix4.setQuaternion(matrix, quaternion, result);
};

/**
 * 通过航向、俯仰、横滚（HeadingPitchRoll）设置当前矩阵的旋转分量。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setHeadingPitchRoll = function (headingPitchRoll) {
    return Matrix4.setHeadingPitchRoll(this, headingPitchRoll, this);
};

/**
 * 获取矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {HeadingPitchRoll} [result=new HeadingPitchRoll()] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix4
 * @static
*/
Matrix4.getHeadingPitchRoll = function (matrix, result = new HeadingPitchRoll()) {
    const quaternion = Matrix4.getQuaternion(matrix, Scratch.scratchQuaternion);
    return HeadingPitchRoll.fromQuaternion(quaternion, result);
};

/**
 * 获取当前矩阵旋转分量对应的航向、俯仰、横滚角。
 * @param {HeadingPitchRoll} [result] 用于存储结果的可选对象。
 * @returns {HeadingPitchRoll} 航向俯仰横滚角。
 * @memberof Matrix4
*/
Matrix4.prototype.getHeadingPitchRoll = function (result) {
    return Matrix4.getHeadingPitchRoll(this, result);
};

/**
 * 通过欧拉角设置矩阵的旋转分量。
 * @param {Matrix4} matrix 待修改的矩阵。
 * @param {object} eulerAngle 欧拉角对象。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 修改或生成后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.setEuler = function (matrix, eulerAngle, result) {
    Check.typeOf.object('eulerAngle', eulerAngle);

    const quaternion = parseEulerToQuaternion(eulerAngle, Scratch.scratchQuaternion);
    return Matrix4.setQuaternion(matrix, quaternion, result);
};

/**
 * 通过欧拉角设置当前矩阵的旋转分量。
 * @param {object} eulerAngle 欧拉角对象。
 * @returns {Matrix4} 修改后的矩阵（this）。
 * @memberof Matrix4
*/
Matrix4.prototype.setEuler = function (eulerAngle) {
    return Matrix4.setEuler(this, eulerAngle, this);
};

/**
 * 获取矩阵旋转分量对应的欧拉角。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {Cartesian3} [result=new Cartesian3()] 用于存储结果的可选对象。
 * @returns {Cartesian3} 欧拉角。
 * @memberof Matrix4
 * @static
*/
Matrix4.getEuler = function (matrix, result = new Cartesian3()) {
    const hpr = Matrix4.getHeadingPitchRoll(matrix, Scratch.scratchHeadingPitchRoll);
    return hpr.toEuler(result);
};

/**
 * 获取当前矩阵旋转分量对应的欧拉角。
 * @param {Cartesian3} [result] 用于存储结果的可选对象。
 * @returns {Cartesian3} 欧拉角。
 * @memberof Matrix4
*/
Matrix4.prototype.getEuler = function (result) {
    return Matrix4.getEuler(this, result);
};

/**
 * Matrix4.getRotation 的别名，获取矩阵的旋转分量（Matrix3）。
 * @type {function}
 * @memberof Matrix4
 * @static
*/
Matrix4.getRotationMatrix = Matrix4.getRotation;

/**
 * 获取矩阵的平移、旋转、缩放分量并组装为 TranslationRotationScale。
 * @param {Matrix4} matrix 目标矩阵。
 * @param {TranslationRotationScale} [result=new TranslationRotationScale()] 用于存储结果的可选对象。
 * @returns {TranslationRotationScale} 平移、旋转、缩放组合对象。
 * @memberof Matrix4
 * @static
*/
Matrix4.getTranslationRotationScale = function (matrix, result = new TranslationRotationScale()) {
    Check.instanceOf('matrix', matrix, Matrix4);

    Matrix4.getTranslation(matrix, result.translation);
    Matrix4.getQuaternion(matrix, result.rotation);
    Matrix4.getScale(matrix, result.scale);
    return result;
};

/**
 * 获取当前矩阵的平移、旋转、缩放分量并组装为 TranslationRotationScale。
 * @param {TranslationRotationScale} [result] 用于存储结果的可选对象。
 * @returns {TranslationRotationScale} 平移、旋转、缩放组合对象。
 * @memberof Matrix4
*/
Matrix4.prototype.getTranslationRotationScale = function (result) {
    return Matrix4.getTranslationRotationScale(this, result);
};

/**
 * 将矩阵与四元数表示的旋转相乘。
 * @param {Matrix4} matrix 原矩阵。
 * @param {Quaternion} quaternion 旋转四元数。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByQuaternion = function (matrix, quaternion, result = new Matrix4()) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.instanceOf('quaternion', quaternion, Quaternion);

    const rotation = Matrix3.fromQuaternion(quaternion, Scratch.scratchRotationMatrix);
    return Matrix4.multiplyByMatrix3(matrix, rotation, result);
};

/**
 * 将矩阵与航向、俯仰、横滚角表示的旋转相乘。
 * @param {Matrix4} matrix 原矩阵。
 * @param {HeadingPitchRoll} headingPitchRoll 航向俯仰横滚角。
 * @param {Matrix4} [result=new Matrix4()] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByHeadingPitchRoll = function (matrix, headingPitchRoll, result = new Matrix4()) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.instanceOf('headingPitchRoll', headingPitchRoll, HeadingPitchRoll);

    const rotation = Matrix3.fromHeadingPitchRoll(headingPitchRoll, Scratch.scratchRotationMatrix);
    return Matrix4.multiplyByMatrix3(matrix, rotation, result);
};

/**
 * 将矩阵与欧拉角表示的旋转相乘。
 * @param {Matrix4} matrix 原矩阵。
 * @param {object} eulerAngle 欧拉角对象。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByEuler = function (matrix, eulerAngle, result) {
    Check.instanceOf('matrix', matrix, Matrix4);
    Check.typeOf.object('eulerAngle', eulerAngle);

    const hpr = parseEulerToHeadingPitchRoll(eulerAngle, Scratch.scratchHeadingPitchRoll);
    return Matrix4.multiplyByHeadingPitchRoll(matrix, hpr, result);
};

/**
 * 将矩阵与旋转相乘，旋转类型可为 HeadingPitchRoll、Quaternion、Matrix3 或欧拉角。
 * @param {Matrix4} matrix 原矩阵。
 * @param {HeadingPitchRoll|Quaternion|Matrix3|object} rotation 旋转量，支持航向俯仰横滚角、四元数、旋转矩阵或欧拉角。
 * @param {Matrix4} [result] 用于存储结果的可选对象。
 * @returns {Matrix4} 相乘后的矩阵。
 * @memberof Matrix4
 * @static
*/
Matrix4.multiplyByRotation = function (matrix, rotation, result) {
    if (rotation instanceof HeadingPitchRoll)
        Matrix4.multiplyByHeadingPitchRoll(matrix, rotation, result);
    else if (rotation instanceof Quaternion)
        Matrix4.multiplyByQuaternion(matrix, rotation, result);
    else if (rotation instanceof Matrix3)
        Matrix4.multiplyByMatrix3(matrix, rotation, result);
    else
        Matrix4.multiplyByEuler(matrix, rotation, result);

    return result;
};

/**
 * 将当前矩阵转换为按列优先排列的数组。
 * @param {Array} [result] 用于存储结果的数组。
 * @returns {Array} 矩阵元素的数组表示。
 * @memberof Matrix4
*/
Matrix4.prototype.toArray = function (result) {
    return Matrix4.toArray(this, result);
};

export { Matrix3, Matrix4 };
