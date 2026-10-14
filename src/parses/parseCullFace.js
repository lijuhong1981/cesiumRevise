import { CullFace } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link CullFace} 枚举值。
 * @param {string|number} value 待解析的值，字符串支持 'front'、'back'、'front_and_back'、'none'
 * @returns {CullFace} 解析后的 CullFace，无法识别时返回 CullFace.NONE
 */
function parseCullFace(value) {
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'front':
                return CullFace.FRONT;
            case 'back':
                return CullFace.BACK;
            case 'front_and_back':
                return CullFace.FRONT_AND_BACK;
            case 'none':
            default:
                return CullFace.NONE;
        }
    } else if (typeof value === 'number')
        return value;
    else
        return CullFace.NONE;
};

export default parseCullFace;
export { parseCullFace };