import { Cartesian3 } from "cesium";

/**
 * 计算一组圆周点到首点（圆心）的最大距离，即圆的半径。
 * @param {Cartesian3[]} positions 圆周上的点集，首个元素视为圆心
 * @returns {number} 圆的半径，单位米
 */
function computeCircleRadius(positions) {
    let result = 0;
    for (let i = 1; i < positions.length; i++) {
        let radius = Cartesian3.distance(positions[0], positions[i]);
        if (radius > result)
            result = radius;
    }
    return result;
};

export default computeCircleRadius;
export { computeCircleRadius };
