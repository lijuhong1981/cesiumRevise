import { Billboard, BillboardCollection, BoundingSphere, BoundingSphereState, Check, Label, LabelCollection, PointPrimitive, PointPrimitiveCollection } from "cesium";

/**
 * 扩展 Cesium 的 Billboard 类，补充类型标识与从集合移除的便捷方法。
 * @class Billboard
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Billboard.html}
*/
/**
 * 扩展 Cesium 的 BillboardCollection 类，补充计算包围球的方法。
 * @class BillboardCollection
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/BillboardCollection.html}
*/
/**
 * 扩展 Cesium 的 Label 类，补充类型标识与从集合移除的便捷方法。
 * @class Label
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Label.html}
*/
/**
 * 扩展 Cesium 的 LabelCollection 类，补充计算包围球的方法。
 * @class LabelCollection
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/LabelCollection.html}
*/
/**
 * 扩展 Cesium 的 PointPrimitive 类，补充类型标识与从集合移除的便捷方法。
 * @class PointPrimitive
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PointPrimitive.html}
*/
/**
 * 扩展 Cesium 的 PointPrimitiveCollection 类，补充计算包围球的方法。
 * @class PointPrimitiveCollection
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PointPrimitiveCollection.html}
*/

/**
 * Billboard 实例的 isBillboard 标识属性，值恒为 true。
 * @name isBillboard
 * @type {boolean}
 * @memberof Billboard
*/
Object.defineProperties(Billboard.prototype, {
    isBillboard: {
        writable: false,
        configurable: false,
        value: true,
    }
});

/**
 * 将当前 Billboard 从其所属的 BillboardCollection 中移除。
 * @memberof Billboard
*/
Billboard.prototype._removeFromCollection = function () {
    if (this._billboardCollection)
        this._billboardCollection.remove(this);
};

/**
 * 计算 BillboardCollection 的包围球。
 * @param {boolean} [allowPartial=false] 是否允许仅使用部分已就绪的图元计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof BillboardCollection
*/
BillboardCollection.prototype.getBoundingSphere = function (allowPartial = false, result) {
    Check.defined('result', result);

    const length = this.length;
    if (length === 0)
        return BoundingSphereState.FAILED;

    const boundingSpheres = [];
    for (let i = length - 1; i >= 0; i--) {
        const billboard = this.get(i);
        boundingSpheres[i] = new BoundingSphere(billboard.position);
    }

    BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
    // console.log('getBoundingSphere:', this.id, result);
    return BoundingSphereState.DONE;
};

/**
 * Label 实例的 isLabel 标识属性，值恒为 true。
 * @name isLabel
 * @type {boolean}
 * @memberof Label
*/
Object.defineProperties(Label.prototype, {
    isLabel: {
        writable: false,
        configurable: false,
        value: true,
    }
});

/**
 * 将当前 Label 从其所属的 LabelCollection 中移除。
 * @memberof Label
*/
Label.prototype._removeFromCollection = function () {
    if (this._labelCollection)
        this._labelCollection.remove(this);
};

/**
 * 计算 LabelCollection 的包围球。
 * @param {boolean} [allowPartial=false] 是否允许仅使用部分已就绪的图元计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof LabelCollection
*/
LabelCollection.prototype.getBoundingSphere = function (allowPartial = false, result) {
    Check.defined('result', result);

    const length = this.length;
    if (length === 0)
        return BoundingSphereState.FAILED;

    const boundingSpheres = [];
    for (let i = length - 1; i >= 0; i--) {
        const label = this.get(i);
        boundingSpheres[i] = new BoundingSphere(label.position);
    }

    BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
    // console.log('getBoundingSphere:', this.id, result);
    return BoundingSphereState.DONE;
};

/**
 * PointPrimitive 实例的 isPointPrimitive 标识属性，值恒为 true。
 * @name isPointPrimitive
 * @type {boolean}
 * @memberof PointPrimitive
*/
Object.defineProperties(PointPrimitive.prototype, {
    isPointPrimitive: {
        writable: false,
        configurable: true,
        value: true,
    }
});

/**
 * 将当前 PointPrimitive 从其所属的 PointPrimitiveCollection 中移除。
 * @memberof PointPrimitive
*/
PointPrimitive.prototype._removeFromCollection = function () {
    if (this._pointPrimitiveCollection)
        this._pointPrimitiveCollection.remove(this);
};

/**
 * 计算 PointPrimitiveCollection 的包围球。
 * @param {boolean} [allowPartial=false] 是否允许仅使用部分已就绪的图元计算包围球。
 * @param {BoundingSphere} result 用于存储包围球的对象。
 * @returns {BoundingSphereState} 包围球的计算状态。
 * @memberof PointPrimitiveCollection
*/
PointPrimitiveCollection.prototype.getBoundingSphere = function (allowPartial = false, result) {
    Check.defined('result', result);

    const length = this.length;
    if (length === 0)
        return BoundingSphereState.FAILED;

    const boundingSpheres = [];
    for (let i = length - 1; i >= 0; i--) {
        const point = this.get(i);
        boundingSpheres[i] = new BoundingSphere(point.position);
    }

    BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
    // console.log('getBoundingSphere:', this.id, result);
    return BoundingSphereState.DONE;
};

export { Billboard, BillboardCollection, Label, LabelCollection, PointPrimitive, PointPrimitiveCollection };
