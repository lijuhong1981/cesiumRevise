import Check from "@lijuhong1981/jscheck/src/Check.js";
import isTypedArray from "@lijuhong1981/jscheck/src/isTypedArray.js";
import { BoundingSphere, Cartesian3, Color, ComponentDatatype, DeveloperError, GeometryAttribute, GeometryAttributes, PrimitiveType } from "cesium";

/**
 * 根据位置与可选颜色数据创建 Cesium 点云几何体（PrimitiveType.POINTS）。
 * @param {object} [options={}] 参数对象
 * @param {ArrayBuffer|Array|ArrayBufferView} options.positions 位置数据，可为 Cartesian3 数组、扁平数值数组或 TypedArray
 * @param {ArrayBuffer|Array|ArrayBufferView} [options.colors] 颜色数据，缺省时全部使用深灰色
 * @returns {Geometry} 点云几何体
 */
function createPointCloudGeometry(options = {}) {
    Check.defined('positions', options.positions);
    const positions = options.positions;
    let positionsArray;
    if (positions instanceof ArrayBuffer) {
        positionsArray = new Float64Array(positions);
    } else if (Array.isArray(positions))
        if (typeof positions[0] === 'number')
            positionsArray = positions;
        else
            positionsArray = Cartesian3.packArray(positions);
    else if (isTypedArray(positions))
        positionsArray = positions;
    else {
        throw new DeveloperError('positions must be Cartesian`s Array or TypedArray object.');
    }
    const positionsLength = positionsArray.length / 3;

    let colors, colorsArray;
    if (options.colors) {
        colors = options.colors;
    } else {
        colors = new Array();
        for (let i = 0; i < positionsLength; i++) {
            colors[i] = Color.DARKGRAY.clone();
        }
    }
    if (colors instanceof ArrayBuffer) {
        colorsArray = new Uint8Array(colors);
    } else if (Array.isArray(colors)) {
        if (typeof colors[0] === 'number')
            colorsArray = colors;
        else
            colorsArray = Color.packArrayToBytes(colors);
    } else if (isTypedArray(colors))
        colorsArray = colors;
    else {
        throw new DeveloperError('colors must be Color`s Array or TypedArray object.');
    }
    const colorsLength = colorsArray.length / 4;

    if (positionsLength !== colorsLength) {
        throw new DeveloperError('the positionsLength must be equal to colorsLength.');
    }

    const attributes = new GeometryAttributes();

    attributes.position = new GeometryAttribute({
        componentDatatype: ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(positionsArray),
    });

    attributes.color = new GeometryAttribute({
        componentDatatype: ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 4,
        values: new Uint8Array(colorsArray),
        normalize: true,
    });

    return new Geometry({
        attributes: attributes,
        primitiveType: PrimitiveType.POINTS,
        boundingSphere: BoundingSphere.fromVertices(positionsArray),
    });
};

export default createPointCloudGeometry;
export { createPointCloudGeometry };
