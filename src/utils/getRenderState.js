import Check from "@lijuhong1981/jscheck/src/Check.js";
import { CullFace, defined } from "cesium";

/**
 * 根据选项构建 Cesium 渲染状态对象（RenderState）。
 * @param {object} options 参数对象
 * @param {boolean} [options.depthTest] 是否启用深度测试
 * @param {CullFace} [options.cullFace] 背面剔除模式
 * @param {object} [result={}] 用于存储结果的渲染状态对象
 * @returns {object} 构建的渲染状态对象
 */
function getRenderState(options, result = {}) {
    Check.defined('options', options);

    if (defined(options.depthTest)) {
        result.depthTest = {
            enabled: options.depthTest,
        };
    }
    if (defined(options.cullFace)) {
        if (options.cullFace !== CullFace.NONE)
            result.cull = {
                enabled: true,
                face: options.cullFace,
            };
        else {
            result.cull = {
                enabled: false,
            };
        }
    }
    return result;
};

export default getRenderState;
export { getRenderState };
