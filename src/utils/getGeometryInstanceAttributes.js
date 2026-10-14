import { BooleanGeometryInstanceAttribute, Cartesian3GeometryInstanceAttribute, FloatGeometryInstanceAttribute } from "../additions/GeometryInstanceAttributes.js";
import { Cartesian3, ColorGeometryInstanceAttribute, defined, DistanceDisplayConditionGeometryInstanceAttribute, ShowGeometryInstanceAttribute } from "cesium";

/**
 * 根据各项参数构建几何实例属性集合（GeometryInstanceAttributes）。
 * @param {boolean} show 是否显示
 * @param {Color} color 材质颜色
 * @param {DistanceDisplayCondition} distanceDisplayCondition 距离显示条件
 * @param {Matrix3} stTransform 纹理坐标变换矩阵，按列拆分为三个 Cartesian3 分别存储
 * @param {number} pointSize 点大小
 * @param {boolean} perVertexColors 是否使用逐顶点颜色
 * @param {Color} instanceColor 实例颜色
 * @returns {object} 几何实例属性集合
 */
function getGeometryInstanceAttributes(show, color, distanceDisplayCondition, stTransform, pointSize, perVertexColors, instanceColor) {
    const attributes = {};
    if (defined(show))
        attributes.show = new ShowGeometryInstanceAttribute(show);
    if (defined(color))
        attributes.color = ColorGeometryInstanceAttribute.fromColor(color);
    if (defined(distanceDisplayCondition))
        attributes.distanceDisplayCondition = DistanceDisplayConditionGeometryInstanceAttribute.fromDistanceDisplayCondition(distanceDisplayCondition);
    if (defined(stTransform)) {
        //stTransform是一个Matrix3对象，但是GeometryInstanceAttribute最多只支持到Cartesian4对象，所以这里将Matrix3按列拆分成3个Cartesian3对象分别传入，然后在shader中再合成为mat3数据
        const scratchCartesian3 = new Cartesian3();
        const column0 = stTransform.getColumn(0, scratchCartesian3);
        attributes.stTransformColumn0 = Cartesian3GeometryInstanceAttribute.fromCartesian3(column0);
        const column1 = stTransform.getColumn(1, scratchCartesian3);
        attributes.stTransformColumn1 = Cartesian3GeometryInstanceAttribute.fromCartesian3(column1);
        const column2 = stTransform.getColumn(2, scratchCartesian3);
        attributes.stTransformColumn2 = Cartesian3GeometryInstanceAttribute.fromCartesian3(column2);
    }
    if (defined(pointSize))
        attributes.pointSize = FloatGeometryInstanceAttribute.fromFloat(pointSize);
    if (defined(perVertexColors))
        attributes.perVertexColors = BooleanGeometryInstanceAttribute.fromBoolean(perVertexColors);
    if (defined(instanceColor))
        attributes.instanceColor = ColorGeometryInstanceAttribute.fromColor(instanceColor);
    return attributes;
};

export default getGeometryInstanceAttributes;
export { getGeometryInstanceAttributes };
