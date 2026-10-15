import { BoundingSphereState, ColorGeometryInstanceAttribute, DistanceDisplayConditionGeometryInstanceAttribute, PerInstanceColorAppearance, Primitive, ShowGeometryInstanceAttribute } from "cesium";
import { BooleanGeometryInstanceAttribute, FloatGeometryInstanceAttribute } from "../additions/GeometryInstanceAttributes.js";
import { PropertyType } from "../additions/PropertyType.js";
import { isTranslucent } from "../utils/isTranslucent.js";
import getRenderState from "../utils/getRenderState.js";
import BaseShapePrimitive from "./BaseShapePrimitive.js";

/**
 * 简单形状图元类，负责管理外观与 Primitive 的创建/更新。
 * @class SimpleShapePrimitive
 * @extends BaseShapePrimitive
 */
class SimpleShapePrimitive extends BaseShapePrimitive {
    /** @param {object} options 选项 */
    onInit(options) {
        super.onInit(options);

        this.needsUpdatePrimitive = true;
    }

    /** 外观类型，默认逐实例着色外观。 @returns {object} */
    get appearanceType() {
        return PerInstanceColorAppearance;
    }

    /** 图元类型。 @returns {object} */
    get primitiveType() {
        return Primitive;
    }

    /** 属性变更分发。 @param {string} name 属性名 @param {*} value 属性值 @param {string} type 属性类型 */
    onPropertyValueChanged(name, value, type) {
        switch (type) {
            case PropertyType.MATERIAL:
            case PropertyType.APPEARANCE:
                this.needsUpdateAppearance = true;
                break;
            case PropertyType.GEOMETRY:
            case PropertyType.PRIMITIVE:
                this.needsUpdatePrimitive = true;
                break;
            case PropertyType.ATTRIBUTE:
                this.onGeometryInstanceAttributeChanged(name, value);
                break;
        }
        super.onPropertyValueChanged(name, value, type);
    }

    /** 几何实例属性变更处理。 @param {string} name 属性名 @param {*} value 属性值 */
    onGeometryInstanceAttributeChanged(name, value) {
        if (this.primitive) {
            const attributes = this.primitive.getGeometryInstanceAttributes(this.id);
            switch (name) {
                case 'show':
                    if (attributes.show) {
                        attributes.show = ShowGeometryInstanceAttribute.toValue(this.show, attributes.show);
                    }
                    this.primitive.show = this.show;
                    break;
                case 'color':
                case 'opacity':
                    if (attributes.color) {
                        attributes.color = ColorGeometryInstanceAttribute.toValue(this.color, attributes.color);
                    }
                    if (attributes.instanceColor) {
                        attributes.instanceColor = ColorGeometryInstanceAttribute.toValue(this.color, attributes.instanceColor);
                    }
                    if (this.appearance)
                        this.appearance.translucent = isTranslucent(this.color);
                    break;
                case 'distanceDisplayCondition':
                    if (attributes.distanceDisplayCondition) {
                        attributes.distanceDisplayCondition = DistanceDisplayConditionGeometryInstanceAttribute.toValue(this.distanceDisplayCondition, attributes.distanceDisplayCondition);
                    }
                    break;
                case 'width':
                    if (attributes.width) {
                        const result = attributes.width;
                        result[0] = this.width;
                        attributes.width = result;
                    }
                    break;
                case 'pointSize':
                    if (attributes.pointSize) {
                        attributes.pointSize = FloatGeometryInstanceAttribute.toValue(this.pointSize, attributes.pointSize);
                    }
                    break;
                case 'perVertexColors':
                    if (attributes.perVertexColors) {
                        attributes.perVertexColors = BooleanGeometryInstanceAttribute.toValue(this.perVertexColors, attributes.perVertexColors);
                    }
                    break;
            }
        }
    }

    /** 需要时更新外观。 @param {object} frameState 帧状态 */
    _updateAppearance(frameState) {
        if (this.needsUpdateAppearance) {
            this.onUpdateAppearance(frameState);
            this.needsUpdateAppearance = false;
        }
    }

    /** 创建外观实例。 @returns {object} */
    createAppearance() {
        return new this.appearanceType({
            material: this.material,
            translucent: isTranslucent(this.color),
            flat: this.flat,
            faceForward: this.faceForward,
            renderState: getRenderState({
                depthTest: this.depthTest,
                cullFace: this.cullFace,
            }),
        });
    }

    /** 重建并应用外观。 */
    onUpdateAppearance() {
        this.appearance = this.createAppearance();
        if (this.primitive)
            this.primitive.appearance = this.appearance;
    }

    /** 需要时重建图元。 @param {object} frameState 帧状态 */
    _updatePrimitive(frameState) {
        if (this.needsUpdatePrimitive) {
            this.onUpdatePrimitive(frameState);
            this.needsUpdatePrimitive = false;
        }
    }

    /** 重建图元。 @param {object} frameState 帧状态 */
    onUpdatePrimitive(frameState) {
        this._destroyPrimitive();
        const geometryInstance = this.createGeometryInstance(false);
        if (!this.appearance)
            this.appearance = this.createAppearance();
        if (geometryInstance)
            this.primitive = new this.primitiveType({
                id: this.id,
                show: this.show,
                pickPrimitive: this.pickPrimitive,
                asynchronous: this.asynchronous,
                geometryInstances: geometryInstance,
                appearance: this.appearance,
                compressVertices: this.compressVertices,
            });
    }

    /** 更新中钩子：更新外观与图元。 @param {object} frameState 帧状态 */
    onPostUpdate(frameState) {
        this._updateAppearance(frameState);
        this._updatePrimitive(frameState);
    }

    /** 更新后钩子：驱动底层 Primitive。 @param {object} frameState 帧状态 */
    onLastUpdate(frameState) {
        if (this.primitive)
            this.primitive.update(frameState);
    }

    /** 获取包围球。 @param {boolean} allowPartial 是否允许部分结果 @param {BoundingSphere} result 结果对象 */
    getBoundingSphere(allowPartial, result) {
        if (this.primitive)
            return this.primitive.getBoundingSphere(allowPartial, result);
        return BoundingSphereState.PENDING;
    }

    /** 销毁底层 Primitive。 */
    _destroyPrimitive() {
        if (this.primitive) {
            this.primitive.destroy();
            delete this.primitive;
        }
    }

    /** 销毁回调。 */
    onDestroy() {
        this._destroyPrimitive();
        super.onDestroy();
    }
}

export default SimpleShapePrimitive;
export { SimpleShapePrimitive };
