import { Cartesian3, defined, DeveloperError, PolygonHierarchy } from "cesium";

/**
 * 把洞信息解析为 {@link PolygonHierarchy} 数组。
 * @param {PolygonHierarchy|Array|object} holes 待解析的洞信息
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {Array} 解析后的 PolygonHierarchy 数组
 */
function parseHoles(holes, ellipsoid) {
    if (holes instanceof PolygonHierarchy)
        return [holes];
    else if (Array.isArray(holes)) {
        if (holes[0] instanceof Cartesian3 || defined(holes[0].x))
            return [parseToPolygonHierarchy(holes, undefined, ellipsoid)];
        else if (holes[0] instanceof PolygonHierarchy)
            return holes;
        const result = [];
        for (let i = 0; i < holes.length; i++) {
            const hierarchy = parseToPolygonHierarchy(holes[i].positions, holes[i].holes, ellipsoid);
            result.push(hierarchy);
        }
        return result;
    } else if (typeof holes === 'object') {
        const result = [];
        const hierarchy = parseToPolygonHierarchy(holes.positions, holes.holes, ellipsoid);
        result.push(hierarchy);
        return result;
    } else {
        throw new DeveloperError('unsupported holes: ' + holes);
    }
};

/**
 * 把顶点坐标与洞信息解析为多边形层级（{@link PolygonHierarchy}）。
 * @param {Array} positions 多边形顶点坐标
 * @param {PolygonHierarchy|Array|object} [holes] 洞信息
 * @param {Ellipsoid} [ellipsoid] 参考椭球体
 * @returns {PolygonHierarchy} 解析后的多边形层级
 */
function parseToPolygonHierarchy(positions, holes, ellipsoid) {
    if (defined(holes)) {
        holes = parseHoles(holes, ellipsoid);
    }
    return new PolygonHierarchy(positions, holes);
};

export default parseToPolygonHierarchy;
export { parseHoles, parseToPolygonHierarchy };
