/**
 * 形状类型枚举。
 * @constant
 */
const ShapeType = Object.freeze({
    PointCloud: 'PointCloud',
    Mesh: 'Mesh',
    //Shape
    Box: 'Box',
    Cylinder: 'Cylinder',
    Ellipsoid: 'Ellipsoid',
    Plane: 'Plane',
    Straightline: 'Straightline',
    Text3D: 'Text3D',
    Frustum: 'Frustum',
    OrthographicFrustum: 'OrthographicFrustum',
    PerspectiveFrustum: 'PerspectiveFrustum',
    //GroundShape
    Circle: 'Circle',
    Corridor: 'Corridor',
    Ellipse: 'Ellipse',
    Polygon: 'Polygon',
    Polyline: 'Polyline',
    PolylineOutline: 'PolylineOutline',
    PolylineArrow: 'PolylineArrow',
    PolylineDash: 'PolylineDash',
    PolylineGlow: 'PolylineGlow',
    PolylineTrail: 'PolylineTrail',
    PolylineVolume: 'PolylineVolume',
    Rectangle: 'Rectangle',
    SimplePolyline: 'SimplePolyline',
    Route: 'Route',
    /**
     * @deprecated 请使用Route替换Sparseline
    */
    Sparseline: 'Sparseline',
    Wall: 'Wall',
    Water: 'Water',
    //Plot
    StraightArrow: 'StraightArrow',
    AttackArrow: 'AttackArrow',
    PincerArrow: 'PincerArrow',
    //CombinedShape
    CombinedShape: 'CombinedShape',
    MultipleCircle: 'MultipleCircle',
    PolygonPolyline: 'PolygonPolyline',
    PolygonPolylineOutline: 'PolygonPolylineOutline',
    PolygonPolylineDash: 'PolygonPolylineDash',
    PolygonPolylineGlow: 'PolygonPolylineGlow',
    PolygonPolylineTrail: 'PolygonPolylineTrail',
    CirclePolyline: 'CirclePolyline',
    CirclePolylineOutline: 'CirclePolylineOutline',
    CirclePolylineDash: 'CirclePolylineDash',
    CirclePolylineGlow: 'CirclePolylineGlow',
    CirclePolylineTrail: 'CirclePolylineTrail',
    RectanglePolyline: 'RectanglePolyline',
    RectanglePolylineOutline: 'RectanglePolylineOutline',
    RectanglePolylineDash: 'RectanglePolylineDash',
    RectanglePolylineGlow: 'RectanglePolylineGlow',
    RectanglePolylineTrail: 'RectanglePolylineTrail',
});

export default ShapeType;
export { ShapeType };