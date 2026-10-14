import { Cartesian3, Math as CesiumMath, Check, defined, EllipseGeometryLibrary } from "cesium";

/**
 * 在椭球面上按给定中心、半径与分段数计算圆（环）上的点集。
 * @param {object} options 参数对象
 * @param {Cartesian3} options.center 圆心（世界坐标，决定圆所在的椭球面位置）
 * @param {number} options.radius 圆半径，单位米，需大于 0
 * @param {number} [options.rotation=0] 圆的旋转角，单位弧度
 * @param {number} [options.rotationDegrees] 圆的旋转角，单位度；提供时覆盖 rotation
 * @param {number} [options.numberOfSegments=64] 圆周分段数，需为不小于 3 的整数
 * @returns {Cartesian3[]} 圆周上的点集
 */
function computeCirclePositions(options) {
    const center = options.center;
    Check.typeOf.object('center', center);
    const radius = options.radius;
    Check.typeOf.number.greaterThan('radius', radius, 0);
    let rotation = options.rotation ?? 0;
    if (defined(options.rotationDegrees))
        rotation = CesiumMath.toRadians(options.rotationDegrees);
    const numberOfSegments = options.numberOfSegments ?? 64;
    Check.typeOf.integer.greaterThanOrEquals('numberOfSegments', numberOfSegments, 3);

    const rSqr = radius * radius;

    const mag = Cartesian3.magnitude(center);

    const unitPos = Cartesian3.normalize(center, new Cartesian3());
    const eastVec = Cartesian3.cross(Cartesian3.UNIT_Z, center, new Cartesian3());
    Cartesian3.normalize(eastVec, eastVec);
    const northVec = Cartesian3.cross(unitPos, eastVec, new Cartesian3());

    const deltaTheta = CesiumMath.TWO_PI / numberOfSegments;

    let theta = 0;
    const result = [];
    for (let i = 0; i < numberOfSegments; i++) {
        const position = EllipseGeometryLibrary.pointOnEllipsoid(theta, rotation, northVec, eastVec, rSqr, rSqr, rSqr, mag, unitPos, new Cartesian3());
        result.push(position);

        theta += deltaTheta;
    }

    return result;
};

export default computeCirclePositions;
export { computeCirclePositions };
