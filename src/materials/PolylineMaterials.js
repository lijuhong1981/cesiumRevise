import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Color, Material } from "cesium";
import parseToColor from "../parses/parseToColor.js";
import BaseMaterial from "./BaseMaterial.js";
import { defineColorMaterialProperties, definePolylineDashMaterialProperties, definePolylineGlowMaterialProperties, definePolylineOutlineMaterialProperties } from "./defineProperties.js";

/**
 * 折线箭头材质，基于 Cesium 内置 PolylineArrowType，在折线末端绘制箭头。
 * color、opacity 属性由 defineColorMaterialProperties 注入。
 */
class PolylineArrowMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.PolylineArrowType;
    }
};

defineColorMaterialProperties(PolylineArrowMaterial.prototype);

/**
 * 折线虚线材质，基于 Cesium 内置 PolylineDashType，以虚线样式绘制折线。
 * color、opacity、gapColor、gapOpacity、dashLength、dashPattern 属性由 definePolylineDashMaterialProperties 注入。
 */
class PolylineDashMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.PolylineDashType;
    }
};

definePolylineDashMaterialProperties(PolylineDashMaterial.prototype);

/**
 * 折线发光材质，基于 Cesium 内置 PolylineGlowType，为折线添加发光描边效果。
 * color、opacity、glowPower、taperPower 属性由 definePolylineGlowMaterialProperties 注入。
 */
class PolylineGlowMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.PolylineGlowType;
    }
};

definePolylineGlowMaterialProperties(PolylineGlowMaterial.prototype);

/**
 * 折线描边材质，基于 Cesium 内置 PolylineOutlineType，为折线添加描边效果。
 * color、opacity、outline、outlineColor、outlineOpacity、outlineWidth 属性由 definePolylineOutlineMaterialProperties 注入。
 */
class PolylineOutlineMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.PolylineOutlineType;
    }
};

definePolylineOutlineMaterialProperties(PolylineOutlineMaterial.prototype);

/**
 * 根据当前时间计算折线拖尾偏移量。
 * @param {number} startMillisecond 动画起始时间戳（毫秒）
 * @param {number} speed 流动速度（每毫秒偏移量）
 * @param {boolean} [reverse] 是否反向流动
 * @returns {number} 拖尾偏移量
 */
function computeOffset(startMillisecond, speed, reverse) {
    let offset = (Date.now() - startMillisecond) * speed;
    if (reverse)
        offset = -offset;
    return offset;
}

/**
 * 折线拖尾材质，基于 Cesium 内置 PolylineTrailType，沿折线方向按时间流动绘制带拖尾的纹理动画。
 */
class PolylineTrailMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.PolylineTrailType;
    }

    /**
     * 初始化材质，读取动画与周期参数。
     * @param {object} options 配置项
     * @param {boolean} [options.animation=true] 是否启用拖尾动画
     * @param {number} [options.duration=3.0] 单次拖尾周期，单位秒
     * @returns {void}
     */
    onInit(options) {
        this.animation = options.animation ?? true;
        this.duration = options.duration ?? 3.0;

        super.onInit(options);
    }

    /**
     * 设置拖尾长度，取值范围 0~1。
     * @param {number} value 拖尾长度
     * @returns {void}
     */
    set trailLength(value) {
        Check.typeOf.number.greaterThanOrEquals('trailLength', value, 0);
        Check.typeOf.number.lessThanOrEquals('trailLength', value, 1);
        this.uniforms.trailLength = value;
    }

    /**
     * 获取拖尾长度。
     * @returns {number} 拖尾长度
     */
    get trailLength() {
        return this.uniforms.trailLength;
    }

    /**
     * 设置拖尾颜色。
     * @param {Color|string|object} value 拖尾颜色
     * @returns {void}
     */
    set trailColor(value) {
        value = parseToColor(value);
        if (!Color.equalsRgb(value, this.uniforms.trailColor)) {
            value.cloneRgb(this.uniforms.trailColor);
        }
    }

    /**
     * 获取拖尾颜色。
     * @returns {Color} 拖尾颜色
     */
    get trailColor() {
        return this.uniforms.trailColor;
    }

    /**
     * 设置拖尾不透明度，取值范围 0~1。
     * @param {number} value 拖尾不透明度
     * @returns {void}
     */
    set trailOpacity(value) {
        Check.typeOf.number.greaterThanOrEquals('trailOpacity', value, 0);
        Check.typeOf.number.lessThanOrEquals('trailOpacity', value, 1);
        this.uniforms.trailColor.alpha = value;
    }

    /**
     * 获取拖尾不透明度。
     * @returns {number} 拖尾不透明度
     */
    get trailOpacity() {
        return this.uniforms.trailColor.alpha;
    }

    /**
     * 设置拖尾图片，传入空值时使用默认图片。
     * @param {string|HTMLImageElement|HTMLCanvasElement} value 拖尾图片资源
     * @returns {void}
     */
    set trailImage(value) {
        if (value)
            this.uniforms.trailImage = value;
        else
            this.uniforms.trailImage = Material.DefaultImageId;
    }

    /**
     * 获取拖尾图片。
     * @returns {string|HTMLImageElement|HTMLCanvasElement} 拖尾图片资源
     */
    get trailImage() {
        return this.uniforms.trailImage;
    }

    /**
     * 设置是否启用发光效果。
     * @param {boolean} value 是否启用发光
     * @returns {void}
     */
    set enableGlow(value) {
        Check.typeOf.bool('enableGlow', value);
        this.uniforms.enableGlow = value;
    }

    /**
     * 获取是否启用发光效果。
     * @returns {boolean} 是否启用发光
     */
    get enableGlow() {
        return this.uniforms.enableGlow;
    }

    /**
     * 设置发光强度。
     * @param {number} value 发光强度
     * @returns {void}
     */
    set glowPower(value) {
        Check.typeOf.number('glowPower', value);
        this.uniforms.glowPower = value;
    }

    /**
     * 获取发光强度。
     * @returns {number} 发光强度
     */
    get glowPower() {
        return this.uniforms.glowPower;
    }

    /**
     * 设置拖尾偏移量。
     * @param {number} value 拖尾偏移量
     * @returns {void}
     */
    set offset(value) {
        Check.typeOf.number('offset', value);
        this.uniforms.offset = value;
    }

    /**
     * 获取拖尾偏移量。
     * @returns {number} 拖尾偏移量
     */
    get offset() {
        return this.uniforms.offset;
    }

    /**
     * 设置是否启用拖尾动画，启用时会重置起始时间，停用时偏移归零。
     * @param {boolean} value 是否启用动画
     * @returns {void}
     */
    set animation(value) {
        Check.typeOf.bool('animation', value);
        this._animation = value;
        if (value)
            this.startMillisecond = Date.now();
        else
            this.offset = 0;
    }

    /**
     * 获取是否启用拖尾动画。
     * @returns {boolean} 是否启用动画
     */
    get animation() {
        return this._animation;
    }

    /**
     * 设置拖尾周期，单位秒，内部会换算为流动速度。
     * @param {number} value 拖尾周期（秒）
     * @returns {void}
     */
    set duration(value) {
        Check.typeOf.number.greaterThan('duration', value, 0);
        if (this._duration !== value) {
            this._duration = value;
            this._speed = 1.0 / (value * 1000);
        }
    }

    /**
     * 获取拖尾周期，单位秒。
     * @returns {number} 拖尾周期（秒）
     */
    get duration() {
        return this._duration;
    }

    /**
     * 设置是否反向流动。
     * @param {boolean} value 是否反向流动
     * @returns {void}
     */
    set reverse(value) {
        Check.typeOf.bool('reverse', value);
        this.uniforms.reverse = value;
    }

    /**
     * 获取是否反向流动。
     * @returns {boolean} 是否反向流动
     */
    get reverse() {
        return this.uniforms.reverse;
    }

    /**
     * 更新材质，启用动画时按时间计算并设置拖尾偏移量。
     * @param {object} context 渲染上下文
     * @returns {void}
     */
    update(context) {
        if (this.animation)
            this.offset = computeOffset(this.startMillisecond, this._speed, this.reverse);
        super.update(context);
    }
};

defineColorMaterialProperties(PolylineTrailMaterial.prototype);

export { PolylineArrowMaterial, PolylineDashMaterial, PolylineGlowMaterial, PolylineOutlineMaterial, PolylineTrailMaterial };
