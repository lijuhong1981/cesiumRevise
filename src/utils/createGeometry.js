import { BoundingSphere, Check, ComponentDatatype, DeveloperError, Geometry, GeometryAttribute, PrimitiveType } from 'cesium';

/**
 * 根据 TypedArray 的类型推断对应的 Cesium 组件数据类型（ComponentDatatype）。
 * @param {ArrayBufferView} array 顶点属性数组
 * @returns {ComponentDatatype} 对应的组件数据类型，无法识别时返回 SHORT
 */
function getAttributeComponentType(array) {
    var attributeComponentType = ComponentDatatype.SHORT;
    if (array instanceof Int8Array) {
        attributeComponentType = ComponentDatatype.BYTE;
    } else if (array instanceof Uint8Array || array instanceof Uint8ClampedArray) {
        attributeComponentType = ComponentDatatype.UNSIGNED_BYTE;
    } else if (array instanceof Int16Array) {
        attributeComponentType = ComponentDatatype.SHORT;
    } else if (array instanceof Uint16Array) {
        attributeComponentType = ComponentDatatype.UNSIGNED_SHORT;
    } else if (array instanceof Int32Array) {
        attributeComponentType = ComponentDatatype.INT;
    } else if (array instanceof Uint32Array) {
        attributeComponentType = ComponentDatatype.UNSIGNED_INT;
    } else if (array instanceof Float32Array) {
        attributeComponentType = ComponentDatatype.FLOAT;
    } else if (array instanceof Float64Array) {
        attributeComponentType = ComponentDatatype.DOUBLE;
    }
    return attributeComponentType;
}

/**
 * 将 three.js 的 BufferGeometry 转换为 Cesium 的 Geometry。
 * @param {object} geometry three.js BufferGeometry 对象
 * @returns {Geometry} 转换后的 Cesium 几何对象
 */
function threeGeometryToCesiumGeometry(geometry) {
    Check.defined('geometry', geometry);

    let attributes = {};
    if (!geometry.attributes.normal && typeof geometry.computeVertexNormals === 'function') {
        geometry.computeVertexNormals();
    }

    let positions;
    for (let attrName in geometry.attributes) {
        if (geometry.attributes.hasOwnProperty(attrName)) {
            let attr = geometry.getAttribute(attrName);
            if (attr && attr.array.length > 0) {
                if (attrName === 'position') {
                    positions = new Float64Array(attr.array);
                    attributes[attrName] = new GeometryAttribute({
                        componentDatatype: ComponentDatatype.DOUBLE,
                        componentsPerAttribute: attr.itemSize,
                        values: positions,
                        normalize: attr.normalized
                    });
                } else {
                    if (attrName === 'uv')
                        attrName = 'st';
                    attributes[attrName] = new GeometryAttribute({
                        componentDatatype: getAttributeComponentType(attr.array),
                        componentsPerAttribute: attr.itemSize,
                        values: attr.array,
                        normalize: attr.normalized
                    });
                }
            }
        }
    }

    let indices = [];
    if (geometry.index)
        indices = geometry.index.array;
    else if (geometry.groups && geometry.groups.length > 0) {
        geometry.groups.forEach(function (group) {
            for (let i = 0; i < group.count; i++) {
                indices.push(i + group.start);
            }
        })
        indices = new Int32Array(indices);
    } else {
        const length = geometry.attributes.position.count;
        for (let i = 0; i < length; i++) {
            indices.push(i);
        }
        indices = new Int32Array(indices);
    }

    return new Geometry({
        attributes: attributes,
        indices: indices,
        primitiveType: PrimitiveType.TRIANGLES,
        boundingSphere: BoundingSphere.fromVertices(positions)
    });
};

/**
 * 将多种几何类型统一转换为 Cesium 的 Geometry 对象。
 * 支持已为 Geometry 的对象、three.js BufferGeometry，以及构造函数带 createGeometry 静态方法的几何对象。
 * @param {Geometry|object} geometry 待转换的几何对象
 * @returns {Geometry} Cesium 几何对象
 */
function createGeometry(geometry) {
    Check.defined('geometry', geometry);
    if (geometry instanceof Geometry)
        return geometry;
    if (geometry.isBufferGeometry)
        return threeGeometryToCesiumGeometry(geometry);
    if (typeof geometry.constructor.createGeometry === 'function')
        return geometry.constructor.createGeometry(geometry);
    throw new DeveloperError('Unable to identify geometry.');
};

export default createGeometry;
export { createGeometry };
