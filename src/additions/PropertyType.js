/**
 * 属性类型枚举，用于标识属性变更事件中属性所属的业务类别（材质、外观、几何体、模型矩阵等）。
 * 该对象已被 Object.freeze 冻结，不可修改。
 */
const PropertyType = Object.freeze({
    /** 材质类型 */
    MATERIAL: 'material',
    /** 外观类型 */
    APPEARANCE: 'appearance',
    /** 填充外观类型 */
    FILLAPPEARANCE: 'fillAppearance',
    /** 图元类型 */
    PRIMITIVE: 'primitive',
    /** 填充图元类型 */
    FILLPRIMITIVE: 'fillPrimitive',
    // PRIMITIVE_TYPE: 'primitiveType',
    /** 模型矩阵类型 */
    MODELMATRIX: 'modelMatrix',
    /** 几何体类型 */
    GEOMETRY: 'geometry',
    /** 填充几何体类型 */
    FILLGEOMETRY: 'fillGeometry',
    /** 轮廓几何体类型 */
    OUTLINEGEOMETRY: 'outlineGeometry',
    /** 属性类型（如纹理坐标相关的属性） */
    ATTRIBUTE: 'attribute',
});

export default PropertyType;
export { PropertyType };