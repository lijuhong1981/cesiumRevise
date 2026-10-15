import ModelMatrixTransforms from "../additions/ModelMatrixTransforms.js";
import { defined } from 'cesium';
import PropertyType from "../additions/PropertyType.js";

/**
 * 惰性创建宿主对象的内部变换对象 ModelMatrixTransforms（仅创建一次），并绑定属性/矩阵变更回调与旋转参考系类型。
 * @param {object} that 宿主对象
 * @param {function} [onPropertyValueChanged] 属性变更回调函数
 * @param {function} [onModelMatrixChanged] 模型矩阵变更回调函数
 * @param {number} [rotationFrameType] 旋转参考系类型，取值参考 RotationFrameType
 * @returns {void}
 */
function ensureTransforms(that, onPropertyValueChanged, onModelMatrixChanged, rotationFrameType) {
    if (!that._transforms) {
        if (!onPropertyValueChanged)
            onPropertyValueChanged = that.onPropertyValueChanged;
        if (!onModelMatrixChanged)
            onModelMatrixChanged = that.onModelMatrixChanged;
        if (onPropertyValueChanged)
            onPropertyValueChanged = onPropertyValueChanged.bind(that);
        if (onModelMatrixChanged)
            onModelMatrixChanged = onModelMatrixChanged.bind(that);
        that._transforms = new ModelMatrixTransforms({
            owner: that,
            onPropertyValueChanged: onPropertyValueChanged,
            onModelMatrixChanged: onModelMatrixChanged,
        });
        that._transforms.undeletable = true;
        if (defined(rotationFrameType))
            that._transforms.rotationFrameType = rotationFrameType;
    }
}

/**
 * 为目标对象动态定义一整套模型矩阵变换相关的属性与方法（位置、地理坐标、平移、旋转、欧拉角、四元数、缩放、前后置变换矩阵、模型矩阵等），
 * 内部委托给惰性创建的 ModelMatrixTransforms 实例实现，并根据目标类型追加 3DTileset / Model 专属属性。
 * @param {object} target 目标对象（通常是类的 prototype 或实例）
 * @param {function} [onPropertyValueChanged] 属性变更回调函数
 * @param {function} [onModelMatrixChanged] 模型矩阵变更回调函数
 * @param {number} [rotationFrameType] 旋转参考系类型，取值参考 RotationFrameType
 * @returns {void}
 */
function defineModelMatrixTransformsProperties(target, onPropertyValueChanged, onModelMatrixChanged, rotationFrameType) {

    let is3DTileset, isModel;
    if (target.is3DTileset || target.isCesium3DTileset) {
        is3DTileset = true;
    } else if (target.isModel) {
        isModel = true;
    }

    Object.defineProperties(target, {
        // 变换对象与旋转参考系、批量设置变换入口
        transforms: {
            enumerable: true,
            configurable: true,
            get: function () {
                ensureTransforms(this, onPropertyValueChanged, onModelMatrixChanged, rotationFrameType);
                return this._transforms;
            }
        },
        rotationFrameType: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.transforms.rotationFrameType;
            }
        },
        setTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (transforms) {
                this.transforms.setTransforms(transforms);
            },
        },
        // 世界坐标位置相关属性与方法（position 及 setGeographic / translateLongitude 等地理坐标操作）
        position: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.position = value;
            },
            get: function () {
                return this.transforms.position;
            }
        },
        geographic: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.geographic = value;
            },
            get: function () {
                return this.transforms.geographic;
            }
        },
        setGeographic: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (longitude, latitude, altitude, degrees) {
                this.transforms.setGeographic(longitude, latitude, altitude, degrees);
            }
        },
        translateLongitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.translateLongitude(value, degrees);
            },
        },
        translateLatitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.translateLatitude(value, degrees);
            },
        },
        translateAltitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.translateAltitude(value, degrees);
            },
        },
        // 本地坐标系平移相关属性与方法（translation 及 translate / translateX 等）
        translation: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.translation = value;
            },
            get: function () {
                return this.transforms.translation;
            }
        },
        setTranslation: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z) {
                this.transforms.setTranslation(x, y, z);
            }
        },
        translate: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z, local) {
                this.transforms.translate(x, y, z, local);
            },
        },
        translateOnAxis: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (axis, distance, local) {
                this.transforms.translateOnAxis(axis, distance, local);
            },
        },
        translateX: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, local) {
                this.transforms.translateX(value, local);
            },
        },
        translateY: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, local) {
                this.transforms.translateY(value, local);
            },
        },
        translateZ: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, local) {
                this.transforms.translateZ(value, local);
            },
        },
        // 旋转相关属性与方法（rotation / attitude / euler / quaternion 及 rotateX 等旋转操作）
        rotation: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.rotation = value;
            },
            get: function () {
                return this.transforms.rotation;
            }
        },
        rotationDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.rotationDegrees = value;
            },
            get: function () {
                return this.transforms.rotationDegrees;
            }
        },
        setRotation: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (heading, pitch, roll, degrees) {
                this.transforms.setRotation(heading, pitch, roll, degrees);
            }
        },
        attitude: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.attitude = value;
            },
            get: function () {
                return this.transforms.attitude;
            }
        },
        setAttitude: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (yaw, pitch, roll) {
                this.transforms.setAttitude(yaw, pitch, roll);
            }
        },
        euler: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.euler = value;
            },
            get: function () {
                return this.transforms.euler;
            }
        },
        eulerDegrees: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.eulerDegrees = value;
            },
            get: function () {
                return this.transforms.eulerDegrees;
            }
        },
        setEuler: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z, degrees) {
                this.transforms.setEuler(x, y, z, degrees);
            }
        },
        rotate: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (heading, pitch, roll, degrees) {
                this.transforms.rotate(heading, pitch, roll, degrees);
            },
        },
        rotateByEuler: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z, degrees) {
                this.transforms.rotateByEuler(x, y, z, degrees);
            },
        },
        rotateOnAxis: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (axis, value, degrees) {
                this.transforms.rotateOnAxis(axis, value, degrees);
            },
        },
        rotateHeading: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateHeading(value, degrees);
            },
        },
        rotatePitch: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotatePitch(value, degrees);
            },
        },
        rotateRoll: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateRoll(value, degrees);
            },
        },
        rotateX: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateX(value, degrees);
            },
        },
        rotateY: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateY(value, degrees);
            },
        },
        rotateZ: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (value, degrees) {
                this.transforms.rotateZ(value, degrees);
            },
        },
        quaternion: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.quaternion = value;
            },
            get: function () {
                return this.transforms.quaternion;
            }
        },
        // 缩放属性与方法
        setScale: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (x, y, z) {
                this.transforms.setScale(x, y, z);
            }
        },
        // 固定坐标系矩阵、本地变换矩阵与前置/后置变换矩阵
        fixedFrameMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.transforms.fixedFrameMatrix;
            },
        },
        localTransformMatrix: {
            enumerable: true,
            configurable: true,
            get: function () {
                return this.transforms.localTransformMatrix;
            },
        },
        beforeTransformMatrix: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.beforeTransformMatrix = value;
            },
            get: function () {
                return this.transforms.beforeTransformMatrix;
            }
        },
        afterTransformMatrix: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                this.transforms.afterTransformMatrix = value;
            },
            get: function () {
                return this.transforms.afterTransformMatrix;
            }
        },
        getActualPosition: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (result) {
                return this.transforms.getActualPosition(result);
            },
        },
        //private
        _updateModelMatrixTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function (frameState) {
                return this.transforms.update(frameState);
            },
        },
        //private
        _destroyModelMatrixTransforms: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                this.transforms.destroy();
            },
        },
    });

    // 3DTileset 类型：追加 scale 与 updateRootTransform
    if (is3DTileset) {
        Object.defineProperties(target, {
            scale: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.scale = value;
                },
                get: function () {
                    return this.transforms.scale;
                }
            },
            updateRootTransform: {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (force) {
                    return this.transforms.updateModelMatrix(force);
                },
            },
        });
    // Model 类型：追加 scale3 与 updateModelMatrix
    } else if (isModel) {
        Object.defineProperties(target, {
            scale3: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.scale = value;
                },
                get: function () {
                    return this.transforms.scale;
                }
            },
            updateModelMatrix: {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (force) {
                    return this.transforms.updateModelMatrix(force);
                },
            },
        });
    // 通用类型：追加 scale、modelMatrix 及模型矩阵变更事件等
    } else {
        Object.defineProperties(target, {
            scale: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.scale = value;
                },
                get: function () {
                    return this.transforms.scale;
                }
            },
            modelMatrix: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.modelMatrix = value;
                },
                get: function () {
                    return this.transforms.modelMatrix;
                },
            },
            computedModelMatrix: {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.modelMatrix;
                }
            },
            modelMatrixChanged: {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.transforms.modelMatrixChanged;
                }
            },
            /**
             * @deprecated use modelMatrixChanged instead
             */
            modelMatrixChangeEvent: {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this.transforms.modelMatrixChangeEvent;
                },
            },
            needsUpdateModelMatrix: {
                enumerable: true,
                configurable: true,
                set: function (value) {
                    this.transforms.needsUpdateModelMatrix = value;
                },
                get: function () {
                    return this.transforms.needsUpdateModelMatrix;
                }
            },
            updateModelMatrix: {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (force) {
                    return this.transforms.updateModelMatrix(force);
                },
            },
        });
        if ('onModelMatrixChanged' in target === false) {
            Object.defineProperty(target, 'onModelMatrixChanged', {
                enumerable: true,
                configurable: true,
                writable: true,
                value: function (modelMatrix) {
                    this.raisePropertyChangeEvent('modelMatrix', modelMatrix, PropertyType.MODELMATRIX);
                }
            });
        }
    }
};

export default defineModelMatrixTransformsProperties;
export { defineModelMatrixTransformsProperties };
