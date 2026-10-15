import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Cartesian2, Math as CesiumMath, Color, Material } from "cesium";
import defineStTransformsProperties from "../defines/defineStTransformsProperties.js";
import parseToColor from "../parses/parseToColor.js";
import BaseMaterial from "./BaseMaterial.js";

/**
 * 图像变换材质，基于 Cesium 内置 ImageTransformType，支持对图片纹理进行平移、旋转、缩放等变换。
 * 纹理变换相关属性（stRepeat、stOffset、stRotation、stCenter 等）由 defineStTransformsProperties 注入。
 */
class ImageTransformMaterial extends BaseMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 获取材质类型。
     * @returns {string} 材质类型标识
     */
    get materialType() {
        return Material.ImageTransformType;
    }

    /**
     * 纹理变换变更回调，将变换结果写入材质 uniform。
     * @param {Matrix3} transform 纹理变换矩阵
     * @returns {void}
     */
    onStTransformChanged(transform) {
        this.uniforms.stTransform = transform;
    }

    // set translucent(value) {
    //     // Check.typeOf.bool('translucent', value);
    //     if (this.uniforms)
    //         this.uniforms.translucent = value;
    // }

    // get translucent() {
    //     return this.uniforms.translucent;
    // }

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

    /**
     * 设置叠加颜色，会先转换为 Color 对象并按 RGB 更新。
     * @param {Color|string|object} value 颜色
     * @returns {void}
     */
    set color(value) {
        value = parseToColor(value);
        const color = this.uniforms.color;
        if (!Color.equalsRgb(value, color)) {
            this.uniforms.color = value.cloneRgb(color);
        }
    }

    /**
     * 获取叠加颜色。
     * @returns {Color} 颜色
     */
    get color() {
        return this.uniforms.color;
    }

    /**
     * 设置不透明度，取值范围 0~1。
     * @param {number} value 不透明度
     * @returns {void}
     */
    set opacity(value) {
        Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
        Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
        this.color.alpha = value;
    }

    /**
     * 获取不透明度。
     * @returns {number} 不透明度
     */
    get opacity() {
        return this.color.alpha;
    }

    /**
     * 设置纹理重复次数。
     * @deprecated 请使用 stRepeat 代替。
     * @param {Cartesian2|object} value 纹理重复次数
     * @returns {void}
     */
    // @deprecated
    set repeat(value) {
        console.warn('repeat property has deprecated, use stRepeat instead.');
        this.stRepeat = value;
    }

    /**
     * 获取纹理重复次数。
     * @deprecated 请使用 stRepeat 代替。
     * @returns {Cartesian2} 纹理重复次数
     */
    // @deprecated
    get repeat() {
        console.warn('repeat property has deprecated, use stRepeat instead.');
        return this.stRepeat;
    }

    /**
     * 设置纹理偏移量。
     * @deprecated 请使用 stOffset 代替。
     * @param {Cartesian2|object} value 纹理偏移量
     * @returns {void}
     */
    // @deprecated
    set offset(value) {
        console.warn('offset property has deprecated, use stOffset instead.');
        this.stOffset = value;
    }

    /**
     * 获取纹理偏移量。
     * @deprecated 请使用 stOffset 代替。
     * @returns {Cartesian2} 纹理偏移量
     */
    // @deprecated
    get offset() {
        console.warn('offset property has deprecated, use stOffset instead.');
        return this.stOffset;
    }

    /**
     * 设置纹理旋转角度（弧度制）。
     * @deprecated 请使用 stRotation 代替。
     * @param {number} value 旋转角度（弧度制）
     * @returns {void}
     */
    // @deprecated
    set rotation(value) {
        console.warn('rotation property has deprecated, use stRotation instead.');
        this.stRotation = value;
    }

    /**
     * 获取纹理旋转角度（弧度制）。
     * @deprecated 请使用 stRotation 代替。
     * @returns {number} 旋转角度（弧度制）
     */
    // @deprecated
    get rotation() {
        console.warn('rotation property has deprecated, use stRotation instead.');
        return this.stRotation;
    }

    /**
     * 设置纹理旋转角度（角度制）。
     * @deprecated 请使用 stRotationDegrees 代替。
     * @param {number} value 旋转角度（角度制）
     * @returns {void}
     */
    // @deprecated
    set rotationDegrees(value) {
        console.warn('rotationDegrees property has deprecated, use stRotationDegrees instead.');
        this.stRotationDegrees = value;
    }

    /**
     * 获取纹理旋转角度（角度制）。
     * @deprecated 请使用 stRotationDegrees 代替。
     * @returns {number} 旋转角度（角度制）
     */
    // @deprecated
    get rotationDegrees() {
        console.warn('rotationDegrees property has deprecated, use stRotationDegrees instead.');
        return this.stRotationDegrees;
    }

    /**
     * 设置纹理旋转中心。
     * @deprecated 请使用 stCenter 代替。
     * @param {Cartesian2|object} value 旋转中心
     * @returns {void}
     */
    // @deprecated
    set center(value) {
        console.warn('center property has deprecated, use stCenter instead.');
        this.stCenter = value;
    }

    /**
     * 获取纹理旋转中心。
     * @deprecated 请使用 stCenter 代替。
     * @returns {Cartesian2} 旋转中心
     */
    // @deprecated
    get center() {
        console.warn('center property has deprecated, use stCenter instead.');
        return this.stCenter;
    }

    /**
     * 更新材质，先更新纹理变换再调用父类更新。
     * @param {object} context 渲染上下文
     * @returns {void}
     */
    update(context) {
        this._updateStTransforms();
        super.update(context);
    }

    /**
     * 销毁材质，先销毁纹理变换相关资源再调用父类销毁。
     * @returns {void}
     */
    destroy() {
        this._destroyStTransforms();
        super.destroy();
    }
};

defineStTransformsProperties(ImageTransformMaterial.prototype);

/**
 * 根据当前时间计算纹理流动偏移量。
 * @param {number} startMillisecond 动画起始时间戳（毫秒）
 * @param {number} millisecondDuration 动画周期（毫秒）
 * @param {boolean} [reverse] 是否反向流动
 * @param {boolean} [vertical] 是否沿垂直方向流动
 * @returns {Cartesian2} 纹理偏移量
 */
function computeOffset(startMillisecond, millisecondDuration, reverse, vertical) {
    //当前时间 - 起始时间 % 持续时间 /持续时间
    let offset = (Date.now() - startMillisecond) % millisecondDuration / millisecondDuration;
    if (reverse)
        offset = 1 - offset;
    if (vertical)
        return new Cartesian2(0, offset);
    else
        return new Cartesian2(offset, 0);
}

/**
 * 流动图像材质，在 ImageTransformMaterial 基础上按时间周期性改变纹理偏移，形成流动动画。
 */
class FlowImageMaterial extends ImageTransformMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 初始化材质，读取流动动画、周期、方向等参数。
     * @param {object} options 配置项
     * @param {boolean} [options.animation=true] 是否启用流动动画
     * @param {boolean} [options.vertical=false] 是否沿垂直方向流动
     * @param {number} [options.duration=3.0] 单次流动周期，单位秒
     * @param {boolean} [options.reverse=false] 是否反向流动
     * @returns {void}
     */
    onInit(options) {
        this.startMillisecond = Date.now();
        this.animation = options.animation ?? true;
        this.vertical = options.vertical ?? false;
        this.duration = options.duration ?? 3.0;
        this.reverse = options.reverse ?? false;

        super.onInit(options);
    }

    /**
     * 设置基础颜色。
     * @param {Color|string|object} value 颜色
     * @returns {void}
     */
    set baseColor(value) {
        this.color = value;
    }

    /**
     * 获取基础颜色。
     * @returns {Color} 颜色
     */
    get baseColor() {
        return this.color;
    }

    /**
     * 设置基础不透明度。
     * @param {number} value 不透明度
     * @returns {void}
     */
    set baseOpacity(value) {
        this.opacity = value;
    }

    /**
     * 获取基础不透明度。
     * @returns {number} 不透明度
     */
    get baseOpacity() {
        return this.opacity;
    }

    /**
     * 设置是否启用流动动画，启用时会重置起始时间，停用时偏移归零。
     * @param {boolean} value 是否启用动画
     * @returns {void}
     */
    set animation(value) {
        Check.typeOf.bool('animation', value);
        this._animation = value;
        if (value)
            this.startMillisecond = Date.now();
        else
            this.offset = Cartesian2.ZERO;
    }

    /**
     * 获取是否启用流动动画。
     * @returns {boolean} 是否启用动画
     */
    get animation() {
        return this._animation;
    }

    /**
     * 设置是否启用流动动画。
     * @deprecated 请使用 animation 代替。
     * @param {boolean} value 是否启用动画
     * @returns {void}
     */
    // @deprecated
    set flow(value) {
        console.warn('flow property has deprecated, use animation instead.');
        this.animation = value;
    }

    /**
     * 获取是否启用流动动画。
     * @deprecated 请使用 animation 代替。
     * @returns {boolean} 是否启用动画
     */
    // @deprecated
    get flow() {
        console.warn('flow property has deprecated, use animation instead.');
        return this._animation;
    }

    /**
     * 设置是否沿垂直方向流动。
     * @param {boolean} value 是否垂直流动
     * @returns {void}
     */
    set vertical(value) {
        Check.typeOf.bool('vertical', value);
        this._vertical = value;
    }

    /**
     * 获取是否沿垂直方向流动。
     * @returns {boolean} 是否垂直流动
     */
    get vertical() {
        return this._vertical;
    }

    /**
     * 设置流动周期，单位秒，内部会换算为毫秒。
     * @param {number} value 流动周期（秒）
     * @returns {void}
     */
    set duration(value) {
        Check.typeOf.number.greaterThan('duration', value, 0);
        if (this._duration !== value) {
            this._duration = value;
            this.millisecondDuration = value * 1000;
        }
    }

    /**
     * 获取流动周期，单位秒。
     * @returns {number} 流动周期（秒）
     */
    get duration() {
        return this._duration;
    }

    // set repeatCount(value) {
    //     Check.typeOf.integer('repeatCount', value);
    //     if (this._repeatCount !== value) {
    //         this._repeatCount = value;
    //     }
    // }

    // get repeatCount() {
    //     return this._repeatCount;
    // }

    /**
     * 更新材质，启用动画时按时间计算并设置纹理偏移。
     * @param {object} context 渲染上下文
     * @returns {void}
     */
    update(context) {
        if (this._animation)
            this.stOffset = computeOffset(this.startMillisecond, this.millisecondDuration, this.reverse, this.vertical);
        super.update(context);
    }
};

/**
 * 根据当前时间计算纹理旋转角度。
 * @param {number} startMillisecond 动画起始时间戳（毫秒）
 * @param {number} millisecondDuration 动画周期（毫秒）
 * @param {boolean} [reverse] 是否反向旋转
 * @returns {number} 旋转角度（弧度制）
 */
function computeRotation(startMillisecond, millisecondDuration, reverse) {
    const percent = (Date.now() - startMillisecond) % millisecondDuration / millisecondDuration;
    let rotation = percent * CesiumMath.TWO_PI;
    if (reverse)
        rotation = -rotation;
    return rotation;
}

/**
 * 旋转图像材质，在 ImageTransformMaterial 基础上按时间周期性设置纹理旋转角度，形成旋转动画。
 */
class RotateImageMaterial extends ImageTransformMaterial {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 初始化材质，读取旋转动画、周期、方向等参数。
     * @param {object} options 配置项
     * @param {boolean} [options.animation=true] 是否启用旋转动画
     * @param {number} [options.duration=60] 单次旋转周期，单位秒
     * @param {boolean} [options.reverse=false] 是否反向旋转
     * @returns {void}
     */
    onInit(options) {
        this.startMillisecond = Date.now();
        this.animation = options.animation ?? true;
        this.duration = options.duration ?? 60;
        this.reverse = options.reverse ?? false;

        super.onInit(options);
    }

    /**
     * 设置是否启用旋转动画，启用时会重置起始时间，停用时旋转角度归零。
     * @param {boolean} value 是否启用动画
     * @returns {void}
     */
    set animation(value) {
        Check.typeOf.bool('animation', value);
        this._animation = value;
        if (value)
            this.startMillisecond = Date.now();
        else
            this.stRotation = 0;
    }

    /**
     * 获取是否启用旋转动画。
     * @returns {boolean} 是否启用动画
     */
    get animation() {
        return this._animation;
    }

    /**
     * 设置是否启用旋转动画。
     * @deprecated 请使用 animation 代替。
     * @param {boolean} value 是否启用动画
     * @returns {void}
     */
    // @deprecated
    set rotate(value) {
        console.warn('rotate property has deprecated, use animation instead.');
        this.animation = value
    }

    /**
     * 获取是否启用旋转动画。
     * @deprecated 请使用 animation 代替。
     * @returns {boolean} 是否启用动画
     */
    // @deprecated
    get rotate() {
        console.warn('rotate property has deprecated, use animation instead.');
        return this._animation;
    }

    /**
     * 设置旋转周期，单位秒，内部会换算为毫秒。
     * @param {number} value 旋转周期（秒）
     * @returns {void}
     */
    set duration(value) {
        Check.typeOf.number.greaterThan('duration', value, 0);
        if (this._duration !== value) {
            this._duration = value;
            this.millisecondDuration = value * 1000;
        }
    }

    /**
     * 获取旋转周期，单位秒。
     * @returns {number} 旋转周期（秒）
     */
    get duration() {
        return this._duration;
    }

    /**
     * 更新材质，启用动画时按时间计算并设置纹理旋转角度。
     * @param {object} context 渲染上下文
     * @returns {void}
     */
    update(context) {
        if (this._animation)
            this.stRotation = computeRotation(this.startMillisecond, this.millisecondDuration, this.reverse);
        super.update(context);
    }
};

export { FlowImageMaterial, FlowImageMaterial as FlowMaterial, ImageTransformMaterial as ImageMaterial, ImageTransformMaterial, RotateImageMaterial, RotateImageMaterial as RotateMaterial };
