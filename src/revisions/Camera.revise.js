import { BoundingSphere, Camera, Cartesian3, Math as CesiumMath, Check, HeadingPitchRoll, Matrix4, Ray, defined } from "cesium";
import parseAttitudeToHeadingPitchRoll from "../parses/parseAttitudeToHeadingPitchRoll.js";
import parseGeographicToCartesian from "../parses/parseGeographicToCartesian.js";
import parseToCartesian3 from "../parses/parseToCartesian3.js";
import parseToHeadingPitchRange from "../parses/parseToHeadingPitchRange.js";
import parseToRectangle from "../parses/parseToRectangle.js";
import computeModelMatrix from "../utils/computeModelMatrix.js";
import Scratch from "../utils/Scratch.js";

/**
 * 扩展 Cesium 的 Camera 类，补充地理坐标、姿态、视线方向等访问属性，
 * 并扩展 setView、flyTo、flyHome 等方法以支持更丰富的参数形式。
 * @class Camera
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Camera.html}
*/

Object.defineProperties(Camera.prototype, {
    /**
     * 获取相机所属的场景对象。
     * @type {Scene}
     * @memberof Camera
    */
    scene: {
        get: function () {
            return this._scene;
        }
    },
    /**
     * 获取相机当前位置对应的地理坐标。
     * @type {Geographic}
     * @memberof Camera
    */
    geographic: {
        get: function () {
            return this.positionCartographic.toGeographic();
        }
    },
    /**
     * 获取相机航向角（角度制，单位度）。
     * @type {number}
     * @memberof Camera
    */
    headingDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.heading);
        }
    },
    /**
     * 获取相机俯仰角（角度制，单位度）。
     * @type {number}
     * @memberof Camera
    */
    pitchDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.pitch);
        }
    },
    /**
     * 获取相机横滚角（角度制，单位度）。
     * @type {number}
     * @memberof Camera
    */
    rollDegrees: {
        get: function () {
            return CesiumMath.toDegrees(this.roll);
        }
    },
    /**
     * 获取相机当前姿态对应的 HeadingPitchRoll（弧度制）。
     * @type {HeadingPitchRoll}
     * @memberof Camera
    */
    orientation: {
        get: function () {
            if (!defined(this._orientation))
                this._orientation = new HeadingPitchRoll();
            this._orientation.heading = this.heading;
            this._orientation.pitch = this.pitch;
            this._orientation.roll = this.roll;
            return this._orientation;
        }
    },
    /**
     * 获取相机当前姿态的角度制表示（度）。
     * @type {object}
     * @memberof Camera
    */
    orientationDegrees: {
        get: function () {
            return this.orientation.toDegrees();
        }
    },
    /**
     * 获取相机当前姿态的角度制表示（度），等同于 orientationDegrees。
     * @type {object}
     * @memberof Camera
    */
    attitude: {
        get: function () {
            return this.orientationDegrees;
        }
    },
    /**
     * 获取相机视锥体的投影矩阵。
     * @type {Matrix4}
     * @memberof Camera
    */
    projectionMatrix: {
        get: function () {
            return this.frustum.projectionMatrix;
        }
    },
    /**
     * 判断相机当前是否正在执行飞行（视角切换）动画。
     * @type {boolean}
     * @memberof Camera
    */
    isFlighting: {
        get: function () {
            return defined(this._currentFlight);
        }
    },
    /**
     * 获取相机所属场景的参考椭球体。
     * @type {Ellipsoid}
     * @memberof Camera
    */
    ellipsoid: {
        get: function () {
            return this._scene.ellipsoid;
        }
    }
});

/**
 * 计算给定距离处每个像素对应的地面米数。
 * @param {number} distance 距离相机的位置距离，单位米。
 * @returns {number} 每个像素对应的米数。
 * @memberof Camera
*/
Camera.prototype.getMetersPerPixel = function (distance) {
    Check.typeOf.number('distance', distance);
    const pixelSize = this.frustum.getPixelDimensions(
        this._scene.drawingBufferWidth,
        this._scene.drawingBufferHeight,
        distance,
        this._scene.pixelRatio,
        Scratch.scratchPixelSize
    );
    return Math.max(pixelSize.x, pixelSize.y);
};

/**
 * 原始 setView 方法的引用，扩展后的 setView 在完成参数处理后调用它。
 * @type {function}
 * @memberof Camera
*/
Camera.prototype.originalSetView = Camera.prototype.setView;

/**
 * 重写 setView，支持通过 geographic、position、rectangle、attitude 等参数形式设置视角。
 * @param {object} options 视角设置项，支持 geographic/position/rectangle/attitude/destination/orientation 等字段。
 * @memberof Camera
*/
Camera.prototype.setView = function (options) {
    if (defined(options.geographic) || defined(options.position)) {
        const modelMatrix = computeModelMatrix({
            geographic: options.geographic,
            position: options.position,
            translation: options.translation,
            ellipsoid: this.ellipsoid,
        });
        options.destination = Matrix4.getTranslation(modelMatrix, new Cartesian3());
    } else if (defined(options.rectangle)) {
        options.destination = parseToRectangle(options.rectangle);
    }
    if (defined(options.attitude))
        options.orientation = parseAttitudeToHeadingPitchRoll(options.attitude);
    else if (options.orientation && Array.isArray(options.orientation))
        options.orientation = HeadingPitchRoll.unpack(options.orientation);
    this.originalSetView(options);
};

/**
 * 原始 flyTo 方法的引用，扩展后的 flyTo 在完成参数处理后调用它。
 * @type {function}
 * @memberof Camera
*/
Camera.prototype.originalFlyTo = Camera.prototype.flyTo;

/**
 * 重写 flyTo，支持通过 geographic、position、rectangle、attitude 等参数形式进行视角飞行。
 * @param {object} options 飞行设置项，支持 geographic/position/rectangle/attitude/destination/orientation 等字段。
 * @memberof Camera
*/
Camera.prototype.flyTo = function (options) {
    if (defined(options.geographic) || defined(options.position)) {
        const modelMatrix = computeModelMatrix({
            geographic: options.geographic,
            position: options.position,
            translation: options.translation,
            ellipsoid: this.ellipsoid,
        });
        options.destination = Matrix4.getTranslation(modelMatrix, new Cartesian3());
    } else if (defined(options.rectangle)) {
        options.destination = parseToRectangle(options.rectangle);
    }
    if (defined(options.attitude))
        options.orientation = parseAttitudeToHeadingPitchRoll(options.attitude);
    else if (options.orientation && Array.isArray(options.orientation))
        options.orientation = HeadingPitchRoll.unpack(options.orientation);
    this.originalFlyTo(options);
};

/**
 * 设置 HomeView（视角），flyHome 时将优先飞至该设置。
 * @param {object} options 视角设置项，参数参见 flyTo。
 * @memberof Camera
*/
Camera.prototype.setHomeView = function (options) {
    if (!options)
        return;
    this.homeViewOptions = options;
}

/**
 * 设置默认视角，flyHome 时将使用该设置。
 * @param {object} options 视角设置项，参数参见 flyTo。
 * @memberof Camera
 * @deprecated 已废弃，请改用 setHomeView。
*/
Camera.prototype.setDefaultView = function (options) {
    console.warn('setDefaultView function is deprecated, use setHomeView instead.');
    this.setHomeView(options);
};

//记录Camera原始的flyHome方法
/**
 * 原始 flyHome 方法的引用，扩展后的 flyHome 在未设置 homeView 时调用它。
 * @type {function}
 * @memberof Camera
*/
Camera.prototype.originalFlyHome = Camera.prototype.flyHome;

/**
 * 重写 flyHome，优先飞至 homeView 设置，未设置时执行原始的 flyHome。
 * @param {number} [duration] 飞行持续时间，单位秒；未指定时使用默认值。
 * @memberof Camera
*/
Camera.prototype.flyHome = function (duration) {
    if (this.homeViewOptions) {
        const options = Object.assign({}, this.homeViewOptions);
        if (defined(duration))
            options.duration = duration;
        this.flyTo(options);
    } else {
        this.originalFlyHome(duration);
    }
};

/**
 * 相机飞至指定的视点。
 * @param {Cartesian3} viewPoint 目标视点（世界坐标）。
 * @param {HeadingPitchRange|Array} offset 视角偏移，可为 HeadingPitchRange 或数组。
 * @param {object} [options={}] 飞行选项，透传给 flyToBoundingSphere。
 * @memberof Camera
*/
Camera.prototype.flyToViewPoint = function (viewPoint, offset, options = {}) {
    Check.defined('viewPoint', viewPoint);
    Check.defined('offset', offset);

    const boundingSphere = BoundingSphere.fromElements(viewPoint, 0, Scratch.scratchBoundingSphere);

    options.offset = parseToHeadingPitchRange(offset, Scratch.scratchHeadingPitchRange, offset.degrees);

    this.flyToBoundingSphere(boundingSphere, options);

};

/**
 * 相机飞至指定的矩形范围。
 * @param {Rectangle} rectangle 目标矩形范围。
 * @param {object} [options={}] 飞行选项，透传给 flyToBoundingSphere。
 * @memberof Camera
*/
Camera.prototype.flyToRectangle = function (rectangle, options = {}) {
    Check.defined('rectangle', rectangle);

    const boundingSphere = BoundingSphere.fromRectangle3D(rectangle, this.ellipsoid, options.surfaceHeight, Scratch.scratchBoundingSphere);
    this.flyToBoundingSphere(boundingSphere, options);
};

/**
 * 相机看向指定的方向。
 * @param {Cartesian3} direction 目标方向。
 * @param {Cartesian3} [up] 上方向；未提供时使用当前位置的椭球法线。
 * @memberof Camera
*/
Camera.prototype.lookAtDirection = function (direction, up) {

    Check.typeOf.object('direction', direction);
    direction = parseToCartesian3(direction, Scratch.scratchDirection, false);
    Cartesian3.normalize(direction, direction);
    if (up) {
        up = parseToCartesian3(up, Scratch.scratchUp, false);
        Cartesian3.normalize(up, up);
    } else {
        up = this.ellipsoid.geodeticSurfaceNormal(this.positionWC, Scratch.scratchUp);
    }

    this.setView({
        orientation: {
            direction: direction,
            up: up,
        }
    });

};

/**
 * 相机看向指定的世界坐标位置。
 * @param {Cartesian3} position 目标位置（世界坐标）。
 * @memberof Camera
*/
Camera.prototype.lookAtPosition = function (position) {

    Check.typeOf.object('position', position);
    position = parseToCartesian3(position, Scratch.scratchPositionWC, false);

    const direction = Cartesian3.subtract(position, this.positionWC, Scratch.scratchDirection);

    this.lookAtDirection(direction);

};

/**
 * 相机看向指定的地理坐标位置。
 * @param {Geographic} geographic 目标地理坐标。
 * @memberof Camera
*/
Camera.prototype.lookAtGeographic = function (geographic) {

    Check.typeOf.object('geographic', geographic);
    const position = parseGeographicToCartesian(geographic, Scratch.scratchPositionWC, this.ellipsoid);

    const direction = Cartesian3.subtract(position, this.positionWC, Scratch.scratchDirection);

    this.lookAtDirection(direction);

};

/**
 * 获取相机当前位置沿当前朝向的射线。
 * @param {Ray} [result] 存放结果的 Ray 对象。
 * @returns {Ray} 相机朝向射线。
 * @memberof Camera
*/
Camera.prototype.getDirectionRay = function (result = new Ray()) {
    result.origin = this.positionWC;
    result.direction = this.directionWC;
    return result;
};

export default Camera;
export { Camera };

