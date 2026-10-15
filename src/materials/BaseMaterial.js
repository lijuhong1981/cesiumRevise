import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import setOptions from '@lijuhong1981/jslib/src/setParameters.js';
import { Material } from "cesium";

/**
 * 材质基类，封装 Cesium Material 对象的创建与生命周期管理，作为所有自定义材质的父类。
 * 子类通过重写 materialType 指定材质类型，并可重写 onInit 完成初始化。
 */
class BaseMaterial extends Destroyable {
    /**
     * 创建材质实例。
     * @param {object} [options={}] 配置项，包含 translucent 及材质自身参数
     */
    constructor(options = {}) {
        super();
        this._material = new Material({
            fabric: {
                type: this.materialType
            },
            translucent: options.translucent
        });

        this.onInit(options);
    }

    /**
     * 获取材质类型标识，必须在子类中实现。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        throw new Error('该方法必须在子类中实现');
    }

    /**
     * 初始化钩子，子类可重写以处理自定义参数。
     * @param {object} options 配置项
     * @returns {void}
     */
    onInit(options) {
        this.setOptions(options);
    }

    /**
     * 将配置项属性批量赋值到当前实例。
     * @param {object} options 配置项
     * @returns {void}
     */
    setOptions(options) {
        setOptions(this, options);
    }

    /**
     * 获取底层的 Cesium Material 对象。
     * @returns {Material} 材质对象
     */
    get material() {
        return this._material;
    }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型
     */
    get type() {
        return this._material.type;
    }

    /**
     * 获取材质着色器源码。
     * @returns {string} 着色器源码
     */
    get shaderSource() {
        return this._material.shaderSource;
    }

    /**
     * 获取材质包含的子材质集合。
     * @returns {object} 子材质集合
     */
    get materials() {
        return this._material.materials;
    }

    /**
     * 获取材质 uniform 变量集合。
     * @returns {object} uniform 变量集合
     */
    get uniforms() {
        return this._material.uniforms;
    }

    /**
     * 获取材质内部维护的 uniform 变量集合。
     * @returns {object} 内部 uniform 变量集合
     */
    get _uniforms() {
        return this._material._uniforms;
    }

    // get _textures() {
    //     return this._material._textures;
    // }

    /**
     * 获取材质是否为半透明。
     * @returns {boolean} 是否半透明
     */
    get translucent() {
        return this._material.translucent;
    }

    /**
     * 判断材质是否为半透明。
     * @returns {boolean} 是否半透明
     */
    isTranslucent() {
        return this._material.isTranslucent();
    }

    /**
     * 更新材质。
     * @param {object} context 渲染上下文
     * @returns {void}
     */
    update(context) {
        this._material.update(context);
    }

    /**
     * 销毁材质，释放底层资源。
     * @returns {void}
     */
    onDestroy() {
        this._material.destroy();
    }
};

export default BaseMaterial;
export { BaseMaterial };
