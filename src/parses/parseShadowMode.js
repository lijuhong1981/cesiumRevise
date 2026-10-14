import { ShadowMode } from "cesium";

/**
 * 把字符串或数字解析为 Cesium 的 {@link ShadowMode} 枚举值。
 * @param {string|number} value 待解析的值，字符串包含 'cast' 返回 CAST_ONLY、'receive' 返回 RECEIVE_ONLY、'enable' 返回 ENABLED
 * @returns {ShadowMode} 解析后的 ShadowMode
 */
function parseShadowMode(value) {
    if (typeof value === 'string') {
        value = value.toLowerCase();
        if (value.match('cast'))
            return ShadowMode.CAST_ONLY;
        else if (value.match('receive'))
            return ShadowMode.RECEIVE_ONLY;
        else if (value.match('enable'))
            return ShadowMode.ENABLED;
        else
            return ShadowMode.DISABLED;
    } else if (typeof value === 'number')
        return value;
    else
        return ShadowMode.DISABLED;
};

export default parseShadowMode;
export { parseShadowMode };
