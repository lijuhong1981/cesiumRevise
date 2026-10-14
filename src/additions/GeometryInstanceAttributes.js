import { Check, ComponentDatatype, DeveloperError, defined } from "cesium";

/**
 * 以下三个类是从 Cesium 源码（packages/engine/Source/Core/）中恢复的
 * `GeometryInstanceAttribute` 派生类。它们在 npm 版 `cesium` 中已被移除，
 * 但 pci-map-3d 的定制 Cesium 构建仍保留，故在此作为库的扩展提供。
 */

/**
 * 布尔型几何体实例属性，以无符号字节（Uint8Array）存储布尔值。
 * 该类从 Cesium 源码恢复，npm 版 cesium 中已移除。
 * @param {boolean} [value=true] 初始布尔值
 */
function BooleanGeometryInstanceAttribute(value = true) {
    this.value = BooleanGeometryInstanceAttribute.toValue(value);
}
Object.defineProperties(BooleanGeometryInstanceAttribute.prototype, {
    /** 组件数据类型，固定为无符号字节 */
    componentDatatype: { get: function () { return ComponentDatatype.UNSIGNED_BYTE; } },
    /** 每个属性的组件数量，固定为 1 */
    componentsPerAttribute: { get: function () { return 1; } },
    /** 是否归一化，固定为 false */
    normalize: { get: function () { return false; } },
});
/**
 * 从布尔值创建布尔型几何体实例属性（静态方法）。
 * @param {boolean} value 布尔值
 * @returns {BooleanGeometryInstanceAttribute} 新的布尔型几何体实例属性
 */
BooleanGeometryInstanceAttribute.fromBoolean = function (value) {
    if (!defined(value))
        throw new DeveloperError("value is required.");
    return new BooleanGeometryInstanceAttribute(value);
};
/**
 * 将布尔值转换为无符号字节数组（静态方法）。
 * @param {boolean} value 布尔值
 * @param {Uint8Array} [result] 用于存储结果的数组，未提供则新建
 * @returns {Uint8Array} 转换后的无符号字节数组
 */
BooleanGeometryInstanceAttribute.toValue = function (value, result) {
    if (!defined(value))
        throw new DeveloperError("value is required.");
    if (!defined(result))
        return new Uint8Array([value]);
    result[0] = value;
    return result;
};
/**
 * 判断两个布尔型几何体实例属性是否相等（静态方法）。
 * @param {BooleanGeometryInstanceAttribute} left 第一个属性
 * @param {BooleanGeometryInstanceAttribute} right 第二个属性
 * @returns {boolean} 是否相等
 */
BooleanGeometryInstanceAttribute.equals = function (left, right) {
    return left === right || defined(left) && defined(right) && left.value[0] === right.value[0];
};

/**
 * 三维向量型几何体实例属性，以 Float32Array 存储 x、y、z 分量。
 * 该类从 Cesium 源码恢复，npm 版 cesium 中已移除。
 * @param {number} [x=0] x 分量
 * @param {number} [y=0] y 分量
 * @param {number} [z=0] z 分量
 */
function Cartesian3GeometryInstanceAttribute(x = 0, y = 0, z = 0) {
    this.value = new Float32Array([x, y, z]);
}
Object.defineProperties(Cartesian3GeometryInstanceAttribute.prototype, {
    /** 组件数据类型，固定为浮点型 */
    componentDatatype: { get: function () { return ComponentDatatype.FLOAT; } },
    /** 每个属性的组件数量，固定为 3 */
    componentsPerAttribute: { get: function () { return 3; } },
    /** 是否归一化，固定为 false */
    normalize: { get: function () { return false; } },
});
/**
 * 从 Cartesian3 创建三维向量型几何体实例属性（静态方法）。
 * @param {Cartesian3} cartesian Cartesian3 实例
 * @returns {Cartesian3GeometryInstanceAttribute} 新的三维向量型几何体实例属性
 */
Cartesian3GeometryInstanceAttribute.fromCartesian3 = function (cartesian) {
    Check.defined("cartesian", cartesian);
    return new Cartesian3GeometryInstanceAttribute(cartesian.x, cartesian.y, cartesian.z);
};
/**
 * 将 Cartesian3 转换为 Float32Array（静态方法）。
 * @param {Cartesian3} cartesian Cartesian3 实例
 * @param {Float32Array|Array} [result] 用于存储结果的数组，未提供则新建
 * @returns {Float32Array|Array} 转换后的浮点数组
 */
Cartesian3GeometryInstanceAttribute.toValue = function (cartesian, result) {
    Check.defined("cartesian", cartesian);
    if (!defined(result))
        return new Float32Array([cartesian.x, cartesian.y, cartesian.z]);
    result[0] = cartesian.x;
    result[1] = cartesian.y;
    result[2] = cartesian.z;
    return result;
};
/**
 * 判断两个三维向量型几何体实例属性是否相等（静态方法）。
 * @param {Cartesian3GeometryInstanceAttribute} left 第一个属性
 * @param {Cartesian3GeometryInstanceAttribute} right 第二个属性
 * @returns {boolean} 是否相等
 */
Cartesian3GeometryInstanceAttribute.equals = function (left, right) {
    return left === right || defined(left) && defined(right)
        && left.value[0] === right.value[0]
        && left.value[1] === right.value[1]
        && left.value[2] === right.value[2];
};

/**
 * 浮点型几何体实例属性，以 Float32Array 存储单个浮点数。
 * 该类从 Cesium 源码恢复，npm 版 cesium 中已移除。
 * @param {number} [value=1] 初始浮点值
 */
function FloatGeometryInstanceAttribute(value = 1) {
    this.value = FloatGeometryInstanceAttribute.toValue(value);
}
Object.defineProperties(FloatGeometryInstanceAttribute.prototype, {
    /** 组件数据类型，固定为浮点型 */
    componentDatatype: { get: function () { return ComponentDatatype.FLOAT; } },
    /** 每个属性的组件数量，固定为 1 */
    componentsPerAttribute: { get: function () { return 1; } },
    /** 是否归一化，固定为 false */
    normalize: { get: function () { return false; } },
});
/**
 * 从浮点数创建浮点型几何体实例属性（静态方法）。
 * @param {number} value 浮点值
 * @returns {FloatGeometryInstanceAttribute} 新的浮点型几何体实例属性
 */
FloatGeometryInstanceAttribute.fromFloat = function (value) {
    if (!defined(value))
        throw new DeveloperError("value is required.");
    return new FloatGeometryInstanceAttribute(value);
};
/**
 * 将浮点数转换为 Float32Array（静态方法）。
 * @param {number} value 浮点值
 * @param {Float32Array|Array} [result] 用于存储结果的数组，未提供则新建
 * @returns {Float32Array|Array} 转换后的浮点数组
 */
FloatGeometryInstanceAttribute.toValue = function (value, result) {
    if (!defined(value))
        throw new DeveloperError("value is required.");
    if (!defined(result))
        return new Float32Array([value]);
    result[0] = value;
    return result;
};
/**
 * 判断两个浮点型几何体实例属性是否相等（静态方法）。
 * @param {FloatGeometryInstanceAttribute} left 第一个属性
 * @param {FloatGeometryInstanceAttribute} right 第二个属性
 * @returns {boolean} 是否相等
 */
FloatGeometryInstanceAttribute.equals = function (left, right) {
    return left === right || defined(left) && defined(right) && left.value[0] === right.value[0];
};

export { BooleanGeometryInstanceAttribute, Cartesian3GeometryInstanceAttribute, FloatGeometryInstanceAttribute };
