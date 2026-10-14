import { defined, Material } from "cesium";

/**
 * 判断材质是否为颜色材质（未定义或类型为 Material.ColorType）。
 * @param {Material} material 待判断的材质
 * @returns {boolean} 是否为颜色材质
 */
function isColorMaterial(material) {
    return !defined(material) || material.type === Material.ColorType;
};

export default isColorMaterial;
export { isColorMaterial };
