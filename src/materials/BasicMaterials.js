import { Material } from "cesium";
import BaseMaterial from "./BaseMaterial.js";
import { defineColorMaterialProperties } from "./defineProperties.js";

/**
 * 基础图像材质，基于 Cesium 内置 BasicImageType，为几何体渲染一张图片纹理。
 */
class BasicImageMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.BasicImageType;
    }

    /**
     * 设置图片，传入空值时使用默认图片。
     * @param {string|HTMLImageElement|HTMLCanvasElement} value 图片资源
     * @returns {void}
     */
    set image(value) {
        if (value)
            this.uniforms.image = value;
        else
            this.uniforms.image = Material.DefaultImageId;
    }

    /**
     * 获取图片。
     * @returns {string|HTMLImageElement|HTMLCanvasElement} 图片资源
     */
    get image() {
        return this.uniforms.image;
    }
};

defineColorMaterialProperties(BasicImageMaterial.prototype);

/**
 * 颜色材质，基于 Cesium 内置 ColorType，以单一颜色填充几何体。
 * color、opacity 属性由 defineColorMaterialProperties 注入。
 */
class ColorMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.ColorType;
    }
};

defineColorMaterialProperties(ColorMaterial.prototype);

export { BasicImageMaterial, ColorMaterial };
