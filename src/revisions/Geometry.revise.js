import { BoundingSphere, Geometry, GeometryPipeline, PrimitiveType } from "cesium";

/**
 * 扩展 Cesium 的 Geometry 类，补充克隆、转线框以及获取包围球等方法。
 * @class Geometry
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Geometry.html}
*/

/**
 * 克隆一个 Geometry 对象。
 * @param {Geometry} geometry 待克隆的几何体。
 * @returns {Geometry} 克隆得到的新几何体。
 * @memberof Geometry
 * @static
*/
Geometry.clone = function (geometry) {
    return new Geometry({
        attributes: geometry.attributes,
        indices: geometry.indices,
        primitiveType: geometry.primitiveType,
        boundingSphere: geometry.boundingSphere
    });
};

/**
 * 克隆当前 Geometry 对象。
 * @returns {Geometry} 克隆得到的新几何体。
 * @memberof Geometry
*/
Geometry.prototype.clone = function () {
    return Geometry.clone(this);
};

/**
 * 将三角形类型的几何体转换为线框几何体；非三角形类型原样返回。
 * @param {Geometry} geometry 待转换的几何体。
 * @returns {Geometry} 转换后的线框几何体或原几何体。
 * @memberof Geometry
 * @static
*/
Geometry.toWireframe = function (geometry) {
    if (geometry.primitiveType !== PrimitiveType.TRIANGLES &&
        geometry.primitiveType !== PrimitiveType.TRIANGLE_FAN &&
        geometry.primitiveType !== PrimitiveType.TRIANGLE_STRIP) {
        return geometry;
    }

    return GeometryPipeline.toWireframe(geometry);
};

/**
 * 将当前几何体转换为线框几何体；非三角形类型原样返回。
 * @returns {Geometry} 转换后的线框几何体或原几何体。
 * @memberof Geometry
*/
Geometry.prototype.toWireframe = function () {
    return Geometry.toWireframe(this);
};

/**
 * 获取当前几何体的包围球，优先使用已计算的 boundingSphere，否则由顶点计算。
 * @param {BoundingSphere} [result] 存放结果的对象，未指定则创建新实例。
 * @returns {BoundingSphere} 几何体的包围球。
 * @memberof Geometry
*/
Geometry.prototype.getBoundingSphere = function (result) {
    if (!result)
        result = new BoundingSphere();
    if (this.boundingSphere)
        this.boundingSphere.clone(result);
    else {
        const positions = this.attributes.position.values;
        BoundingSphere.fromVertices(positions, undefined, undefined, result);
    }
    return result;
};

export default Geometry;
export { Geometry };
