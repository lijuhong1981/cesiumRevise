import { Matrix3 } from "cesium";

/**
 * 由偏移、重复、旋转与中心参数构建纹理坐标（st）变换矩阵。
 * @param {object} [stOffset={x:0,y:0}] 纹理坐标偏移
 * @param {object} [stRepeat={x:1,y:1}] 纹理坐标重复（缩放）
 * @param {number} [stRotation=0] 纹理坐标旋转角，单位弧度
 * @param {object} [stCenter={x:0.5,y:0.5}] 纹理坐标旋转中心
 * @param {Matrix3} [result] 用于存储结果的矩阵，未提供则新建
 * @returns {Matrix3} 纹理坐标变换矩阵
 */
function computeStTransform(stOffset = {
    x: 0,
    y: 0
}, stRepeat = {
    x: 1,
    y: 1
}, stRotation = 0, stCenter = {
    x: 0.5,
    y: 0.5,
}, result = new Matrix3()) {
    const tx = stOffset.x,
        ty = stOffset.y,
        sx = stRepeat.x,
        sy = stRepeat.y,
        cx = stCenter.x,
        cy = stCenter.y,
        c = Math.cos(stRotation),
        s = Math.sin(stRotation);
    //sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
    //- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
    //0, 0, 1
    const n11 = sx * c,
        n12 = sx * s,
        n13 = -sx * (c * cx + s * cy) + cx - tx,
        n21 = -sy * s,
        n22 = sy * c,
        n23 = -sy * (-s * cx + c * cy) + cy - ty,
        n31 = 0,
        n32 = 0,
        n33 = 1;

    result[0] = n11;
    result[1] = n21;
    result[2] = n31;
    result[3] = n12;
    result[4] = n22;
    result[5] = n32;
    result[6] = n13;
    result[7] = n23;
    result[8] = n33;

    return result;
};

export default computeStTransform;
export { computeStTransform };
