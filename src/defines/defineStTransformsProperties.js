import StTransforms from "../additions/StTransforms.js";

/**
 * 惰性创建宿主对象的内部纹理坐标变换对象 StTransforms（仅创建一次），并绑定属性变更回调与事件转发。
 * @param {object} that 宿主对象
 * @param {function} [onStTransformChanged] 纹理坐标变换变更回调函数
 * @returns {void}
 */
function ensureStTransforms(that, onStTransformChanged) {
    if (!that._stTransforms) {
        if (!onStTransformChanged)
            onStTransformChanged = that.onStTransformChanged;
        if (onStTransformChanged)
            onStTransformChanged = onStTransformChanged.bind(that);
        that._stTransforms = new StTransforms({
            owner: that,
            onStTransformChanged: onStTransformChanged,
        });
        that._stTransforms.propertyChanged.addEventListener(function (raiser, name, value, type) {
            if (typeof that.raisePropertyChangeEvent === 'function')
                that.raisePropertyChangeEvent(name, value, type);
        });
    }
}

/**
 * 为目标对象动态定义一整套纹理坐标（st）变换相关属性与方法（偏移、重复、旋转、中心点及变换矩阵等），
 * 内部委托给惰性创建的 StTransforms 实例实现。
 * @param {object} target 要挂载属性的目标对象
 * @returns {void}
 */
function defineStTransformsProperties(target) {

    Object.defineProperties(target, {
        // 变换对象与批量设置变换入口
        stTransforms: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureStTransforms(this);
                return this._stTransforms;
            }
        },
        setStTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (transforms) {
                this.stTransforms.setTransforms(transforms);
            }
        },
        // 纹理坐标变换参数：偏移、重复、旋转（弧度/角度）、中心点、中心旋转及变换矩阵
        stOffset: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stOffset = value;
            },
            get: function () {
                return this.stTransforms.stOffset;
            }
        },
        stRepeat: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stRepeat = value;
            },
            get: function () {
                return this.stTransforms.stRepeat;
            }
        },
        stRotation: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stRotation = value;
            },
            get: function () {
                return this.stTransforms.stRotation;
            }
        },
        stRotationDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stRotationDegrees = value;
            },
            get: function () {
                return this.stTransforms.stRotationDegrees;
            }
        },
        stCenter: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.stTransforms.stCenter = value;
            },
            get: function () {
                return this.stTransforms.stCenter;
            }
        },
        stCenterRotation: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.stTransforms.stCenterRotation;
            }
        },
        stTransform: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.stTransforms.transform;
            }
        },
        // 强制更新纹理坐标变换矩阵
        updateStTransform: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (force) {
                return this.stTransforms.updateTransform(force);
            },
        },
        //private
        _updateStTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.stTransforms.update();
            },
        },
        //private
        _destroyStTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.stTransforms.destroy();
            },
        },
    });

};

export default defineStTransformsProperties;
export { defineStTransformsProperties };
