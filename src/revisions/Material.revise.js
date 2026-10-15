// import setOptions from '@lijuhong1981/jslib/src/setParameters.js';
// import WaterMaterial from '../materials/WaterMaterial.js';
import Check from "@lijuhong1981/jscheck/src/Check.js";
import { Color, Event, Material, MaterialProperty, Matrix3, Matrix4 } from 'cesium';

/**
 * 扩展 Cesium 的 Material 类，补充 BasicImage、ConverageArea、PolylineTrail、ImageTransform
 * 等自定义材质类型。
 * @class Material
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Material.html}
*/
/**
 * 扩展 Cesium 的 MaterialProperty 类，补充按材质类型或材质实例创建属性对象的方法。
 * @class MaterialProperty
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/MaterialProperty.html}
*/

// Material.prototype.setOptions = function (options) {
//     setOptions(this, options);
// };

// Material.defaultWaterMaterial = WaterMaterial.default;

/**
 * MaterialProperty 的常量实现：按指定的材质类型与 uniform 直接返回材质参数。
 * @class MaterialPropertyImpl
 * @private
*/
class MaterialPropertyImpl {
    constructor(type, uniforms = {}, isConstent = true) {
        Check.defined('type', type);
        this._type = type;
        this._uniforms = uniforms;
        this._isConstant = isConstent;
        this._definitionChanged = new Event();
    }

    get isConstant() {
        return this._isConstant;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return this._type;
    }

    getValue(time, uniforms) {
        for (const key in this._uniforms) {
            if (Object.hasOwnProperty.call(this._uniforms, key)) {
                uniforms[key] = this._uniforms[key];
            }
        }
        return uniforms;
    }

    equals(other) {
        return (this._type === other._type && this._uniforms === other._uniforms);
    }
};

/**
 * 按材质类型与 uniform 创建 MaterialProperty。
 * @param {string} type 材质类型。
 * @param {object} [uniforms={}] 材质参数（uniform）。
 * @param {boolean} [isConstent=true] 是否为常量材质。
 * @returns {MaterialProperty} 创建的 MaterialProperty 实例。
 * @memberof MaterialProperty
 * @static
*/
MaterialProperty.fromType = function (type, uniforms, isConstent) {
    return new MaterialPropertyImpl(type, uniforms, isConstent);
};

/**
 * MaterialProperty 的实例实现：基于已有的 Material 对象返回材质参数。
 * @class MaterialInstanceProperty
 * @private
*/
class MaterialInstanceProperty {
    constructor(material, uniforms = {}, isConstent = true) {
        Check.defined('material', material);
        this._material = material;
        this._uniforms = uniforms;
        this._isConstant = isConstent;
        this._definitionChanged = new Event();
    }

    get material() {
        return this._material;
    }

    get isConstant() {
        return this._isConstant;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return this._material.type;
    }

    getValue(time, uniforms) {
        for (const key in this._uniforms) {
            if (Object.hasOwnProperty.call(this._uniforms, key)) {
                uniforms[key] = this._uniforms[key];
            }
        }
        return uniforms;
    }

    equals(other) {
        return this._material === other._material;
    }
}

/**
 * 按已有 Material 实例与 uniform 创建 MaterialProperty。
 * @param {Material} material 材质实例。
 * @param {object} [uniforms={}] 材质参数（uniform）。
 * @param {boolean} [isConstent=true] 是否为常量材质。
 * @returns {MaterialProperty} 创建的 MaterialProperty 实例。
 * @memberof MaterialProperty
 * @static
*/
MaterialProperty.fromMaterial = function (material, uniforms, isConstent) {
    return new MaterialInstanceProperty(material, uniforms, isConstent);
};

const BasicImageType = 'BasicImage';

/**
 * BasicImage 材质类型标识（基于 uv 贴图与颜色渲染）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.BasicImageType = BasicImageType;
//添加BasicImageType材质
Material._materialCache.addMaterial(BasicImageType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: BasicImageType, //材质类型
        uniforms: { //接受的参数
            image: Material.DefaultImageId, //普通uv贴图
            color: new Color(), //颜色
            // translucent: true, //是否透明
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n" + //固定写法，重载czm_getMaterial函数
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" + //获取默认材质
            "   vec2 st = materialInput.st;\n" + //获取uv
            "   vec4 imageColor = texture(image, st);\n" + //从uv贴图中获取imageColor
            "   material.diffuse = imageColor.rgb * color.rgb;\n" + //与外部传入color相乘得到最终渲染color，material.diffuse为最终渲染至屏幕上的color
            // "   if (translucent)\n" +
            "       material.alpha = imageColor.a * color.a;\n" + //translucent开启，则alpha值也相乘
            // "   else\n" +
            // "       material.alpha = imageColor.a;\n" + //translucent未开启
            "   return material;\n" +
            "}",
    },
    translucent: function (material) {
        return material.uniforms.color.alpha < 1.0;
    }
});

//定义ConverageAreaType
const ConverageAreaType = 'ConverageArea';

/**
 * ConverageArea 材质类型标识（用于覆盖区域裁剪的材质）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.ConverageAreaType = ConverageAreaType;
//添加Material材质
Material._materialCache.addMaterial(ConverageAreaType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: ConverageAreaType, //材质类型
        uniforms: { //接受的参数
            outsideOfConverageArea: false,
            converageAreaPlanes: Material.DefaultImageId,
            converageAreaPlanesMatrix: Matrix4.IDENTITY.clone(),
        },
        source: "uniform bool outsideOfConverageArea;\n" +
            "uniform highp sampler2D converageAreaPlanes;\n" +
            "uniform mat4 converageAreaPlanesMatrix;\n" +
            '\n' +
            "czm_material czm_getMaterial(czm_materialInput materialInput)\n" +
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" +
            "   bool isConverage = isConverageArea(gl_FragCoord, converageAreaPlanes, converageAreaPlanesMatrix);\n" +
            "   isConverage = (outsideOfConverageArea ? !isConverage : isConverage);\n" +
            "   if (!isConverage)\n" +
            "   {\n" +
            "       material.alpha = 0.0;\n" +
            "       return material;\n" +
            "   }\n" +
            "   return material;\n" +
            "}\n",
    },
    translucent: false,
});

const PolylineTrailType = 'PolylineTrail';

/**
 * PolylineTrail 材质类型标识（用于线尾迹效果的材质）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.PolylineTrailType = PolylineTrailType;

Material._materialCache.addMaterial(PolylineTrailType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: PolylineTrailType, //材质类型
        uniforms: { //接受的参数
            color: new Color(1.0, 1.0, 1.0, 1.0), //颜色
            trailLength: 1.0,
            trailColor: new Color(1.0, 1.0, 1.0, 1.0),
            trailImage: Material.DefaultImageId,
            enableGlow: false,
            glowPower: 0.25,
            offset: 0,
            reverse: false,
            // translucent: true, //是否透明
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n" + //固定写法，重载czm_getMaterial函数
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" + //获取默认材质
            "   material.diffuse = color.rgb;\n" +
            "   material.alpha = color.a;\n" +
            "   vec2 st = materialInput.st;\n" + //获取uv
            "   float s = fract(st.s - offset);\n" +
            "   if (s <= trailLength) {\n" +
            "       st.s = s / trailLength;\n" +
            "       if (reverse) st.s = 1.0 - st.s;\n" +
            "       vec4 imageColor = texture(trailImage, st);\n" + //从uv贴图中获取imageColor
            "       material.diffuse = imageColor.rgb * trailColor.rgb;\n" +
            "       material.alpha = imageColor.a * trailColor.a;\n" +
            "   }\n" +
            "   if (enableGlow) {\n" +
            "       float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);\n" + //计算glow
            "       vec4 glowColor;\n" +
            "       glowColor.rgb = max(vec3(glow - 1.0 + material.diffuse), material.diffuse);\n" +
            "       glowColor.a = clamp(0.0, 1.0, glow) * material.alpha;\n" +
            "       glowColor = czm_gammaCorrect(glowColor);\n" +
            "       material.emission = glowColor.rgb;\n" +
            "       material.alpha = glowColor.a;\n" +
            "   }\n" +
            "   return material;\n" +
            "}",
    },
    translucent: function (material) {
        const uniforms = material.uniforms;
        return uniforms.color.alpha < 1.0 || uniforms.trailColor.alpha < 1.0;
    }
});

//定义ImageTransformType
const ImageTransformType = 'ImageTransform';

/**
 * ImageTransform 材质类型标识（基于贴图变换矩阵的材质）。
 * @type {string}
 * @constant
 * @memberof Material
*/
Material.ImageTransformType = ImageTransformType;
//添加ImageTransformType材质
Material._materialCache.addMaterial(ImageTransformType, {
    //基于Cesium fabric语法构建材质
    fabric: {
        type: ImageTransformType, //材质类型
        uniforms: { //接受的参数
            image: Material.DefaultImageId, //普通uv贴图
            stTransform: Matrix3.IDENTITY.clone(), //贴图变换矩阵
            color: new Color(), //颜色
            // translucent: true, //是否透明
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n" + //固定写法，重载czm_getMaterial函数
            "{\n" +
            "   czm_material material = czm_getDefaultMaterial(materialInput);\n" + //获取默认材质
            "   vec2 st = materialInput.st;\n" + //获取uv
            "   st = fract((stTransform * vec3(st, 1.0)).xy);\n" + //计算变换后uv
            "   vec4 imageColor = texture(image, st);\n" + //从uv贴图中获取imageColor
            "   material.diffuse = imageColor.rgb * color.rgb;\n" + //与外部传入color相乘得到最终渲染color，material.diffuse为最终渲染至屏幕上的color
            // "   if (translucent)\n" +
            "       material.alpha = imageColor.a * color.a;\n" + //translucent开启，则alpha值也相乘
            // "   else\n" +
            // "       material.alpha = imageColor.a;\n" + //translucent未开启
            "   return material;\n" +
            "}",
    },
    translucent: function (material) {
        return material.uniforms.color.alpha < 1.0;
    }
});

export default Material;
export { Material, MaterialProperty };