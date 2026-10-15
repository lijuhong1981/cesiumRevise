import Check from "@lijuhong1981/jscheck/src/Check.js";
import setOptions from '@lijuhong1981/jslib/src/setParameters.js';
import parseNumber from "@lijuhong1981/jsmath/src/parseNumber.js";
import { Cartesian3, Cartesian4, Math as CesiumMath, Color, createGuid, defined, DeveloperError, Matrix3, Matrix4, PostProcessStage, PostProcessStageComposite, PostProcessStageLibrary, Quaternion } from "cesium";
import Geographic from '../additions/Geographic.js';
import parseGeographicToCartesian from '../parses/parseGeographicToCartesian.js';
import parseToCartesian3 from '../parses/parseToCartesian3.js';
import parseToColor from '../parses/parseToColor.js';

/**
 * 扩展 Cesium 的 PostProcessStage 类，补充批量设置选项的方法。
 * @class PostProcessStage
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PostProcessStage.html}
*/
/**
 * 扩展 Cesium 的 PostProcessStageLibrary 类，补充圆形扫描、迷雾、高亮、天际线等后处理阶段创建方法。
 * @class PostProcessStageLibrary
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/PostProcessStageLibrary.html}
*/

/**
 * 批量设置当前后处理阶段的选项与属性。
 * @param {object} options 选项对象，其属性将被设置到当前 stage 上。
 * @memberof PostProcessStage
*/
PostProcessStage.prototype.setOptions = function (options) {
    setOptions(this, options);
};

//解析和检测圆环设置
function parseAndCheckCircle(circle, defaultColor, defaultPower) {
    circle.color = parseToColor(circle.color) ?? defaultColor;
    Check.typeOf.number.greaterThan('radius', circle.radius, 0);
    circle.power = circle.power ?? defaultPower;
    Check.typeOf.number.greaterThanOrEquals('power', circle.power, 0);
    // console.log('circle:', circle);
}

//解析和检测多重圆环设置
function parseAndCheckCircles(circles, defaultColor, defaultPower) {
    for (let i = circles.length - 1; i >= 0; i--) {
        parseAndCheckCircle(circles[i], defaultColor, defaultPower);
    }
}

//多重圆环排序，按半径大小升序排列
function sortCircles(circles) {
    let temp;
    for (let i = 1; i < circles.length; i++) {
        for (let j = i; j > 0; j--) {
            if (circles[j].radius < circles[j - 1].radius) {
                temp = circles[j];
                circles[j] = circles[j - 1];
                circles[j - 1] = temp;
            }
        }
    }
    // console.log('sortCircles:', circles);
}

//将多重圆环设置项分解至数组
function decomposeCircles(circles, outColors, outRadii, outPowers) {
    for (let i = 0; i < circles.length; i++) {
        outColors[i] = circles[i].color;
        outRadii[i] = circles[i].radius;
        outPowers[i] = circles[i].power;
    }
    // console.log('outColors:', outColors, 'outRadii:', outRadii);
}

/**
 * 创建圆形扩散扫描后处理阶段。
 * @param {object} options 配置项。
 * @param {object} [options.map] Viewer 或 Scene 对象（与 scene 二选一），必需项之一。
 * @param {object} [options.scene] Viewer 或 Scene 对象。
 * @param {Geographic|Cartesian3|Cartographic|Array} [options.geographic] 圆心地理坐标。
 * @param {Cartesian3} [options.position] 圆心位置。
 * @param {Cartesian3} [options.center] 圆心位置（与 position 等效）。
 * @param {string} [options.name] 阶段名称。
 * @param {object} [options.properties] 自定义属性。
 * @param {boolean} [options.circleDiffuse=true] 是否开启圆形扩散动画。
 * @param {number} [options.radius=100] 扩散半径，单位米，须大于 0。
 * @param {number} [options.duration=2.0] 扩散动画持续时间，单位秒。
 * @param {Color|string} [options.color='#ff0000'] 扩散颜色。
 * @param {number} [options.opacity=1] 透明度，取值 0 到 1。
 * @param {boolean} [options.gradientColor=false] 是否启用渐变色。
 * @param {Color|string} [options.startColor] 渐变起始颜色。
 * @param {Color|string} [options.endColor] 渐变结束颜色。
 * @param {number} [options.power=3.0] 扩散指数，值越小扩散环越厚。
 * @param {boolean} [options.multiple=false] 是否开启多重圆环。
 * @param {Array} [options.multiCircles=[]] 多重圆环设置数组。
 * @param {boolean} [options.radarScan=false] 是否开启雷达扫描动画。
 * @param {Color|string} [options.scanColor] 雷达扫描线颜色。
 * @param {number} [options.scanPower=3.0] 雷达扫描线扩散指数。
 * @param {number} [options.scanDuration=2.0] 雷达扫描动画持续时间，单位秒。
 * @returns {PostProcessStage} 生成的圆形扩散扫描后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createCircleScanStage = function (options) {
    Check.defined('options', options);

    //Viewer或Scene对象，必需项
    const scene = options.map ?? options.scene;
    Check.defined('scene', scene);

    const name = options.name ?? 'CircleScan_' + createGuid();
    const properties = options.properties;

    //获取圆心点位置，Cartesian3对象
    let center;
    if (defined(options.geographic))
        center = parseGeographicToCartesian(options.geographic, undefined, scene.ellipsoid);
    else if (defined(options.position) || defined(options.center))
        center = parseToCartesian3(options.position || options.center);
    else
        throw new DeveloperError('geographic or postition or center undefined.');

    //圆心位置，Cartesian4对象
    const cartesian4Center = new Cartesian4();
    //高度+500后的圆心位置，Cartesian4对象
    const cartesian4CenterByHigher = new Cartesian4();
    //经度+0.001后的圆心位置，Cartesian4对象
    const cartesian4CenterByRight = new Cartesian4();

    //更新圆心相关参数
    function updateCenterCoordinates() {
        cartesian4Center.x = center.x;
        cartesian4Center.y = center.y;
        cartesian4Center.z = center.z;
        cartesian4Center.w = 1;

        //获得当前圆心位置的地理坐标
        const geographic = center.toGeographic();
        //高度+500，用于计算平面法线
        const geographicByHigher = Geographic.fromDegrees(geographic.longitude, geographic.latitude, geographic.height + 500);
        const centerByHigher = geographicByHigher.toCartesian();
        cartesian4CenterByHigher.x = centerByHigher.x;
        cartesian4CenterByHigher.y = centerByHigher.y;
        cartesian4CenterByHigher.z = centerByHigher.z;
        cartesian4CenterByHigher.w = 1;
        //经度+0.001，用于计算平面法线
        const geographicByRight = Geographic.fromDegrees(geographic.longitude + 0.001, geographic.latitude, geographic.height);
        const centerByRight = geographicByRight.toCartesian();
        cartesian4CenterByRight.x = centerByRight.x;
        cartesian4CenterByRight.y = centerByRight.y;
        cartesian4CenterByRight.z = centerByRight.z;
        cartesian4CenterByRight.w = 1;
    }

    updateCenterCoordinates();

    const scratchViewMatrix = new Matrix4();
    const scratchCartesian4Center = new Cartesian4();
    const scratchCartesian4CenterByHigher = new Cartesian4();
    const scratchCartesian4CenterByRight = new Cartesian4();
    const scratchCartesian3Normal = new Cartesian3();
    const scratchCartesian3Direction = new Cartesian3();
    const scratchCartesian3RotateDirection = new Cartesian3();
    const scratchQuaternion = new Quaternion();
    const scratchMatrix3 = new Matrix3();

    //转换至相机视图位置
    function updateCenterCoordinatesToEye() {
        if (!Matrix4.equals(scene.camera.viewMatrix, scratchViewMatrix)) {
            Matrix4.clone(scene.camera.viewMatrix, scratchViewMatrix);

            Matrix4.multiplyByVector(scratchViewMatrix, cartesian4Center, scratchCartesian4Center);
            Matrix4.multiplyByVector(scratchViewMatrix, cartesian4CenterByHigher, scratchCartesian4CenterByHigher);
            Matrix4.multiplyByVector(scratchViewMatrix, cartesian4CenterByRight, scratchCartesian4CenterByRight);

            Cartesian3.subtract(scratchCartesian4CenterByHigher, scratchCartesian4Center, scratchCartesian3Normal);
            Cartesian3.normalize(scratchCartesian3Normal, scratchCartesian3Normal);

            Cartesian3.subtract(scratchCartesian4CenterByRight, scratchCartesian4Center, scratchCartesian3Direction);
            Cartesian3.normalize(scratchCartesian3Direction, scratchCartesian3Direction);
            // console.log('center:', scratchCartesian4Center);
            // console.log('ndc:', Matrix4.multiplyByVector(map.camera.frustum.projectionMatrix, scratchCartesian4Center, new Cartesian4()));
        }
    }

    updateCenterCoordinatesToEye();

    //是否开启圆形扩散动画
    let circleDiffuse = options.circleDiffuse ?? true;
    Check.typeOf.bool('circleDiffuse', circleDiffuse);
    //半径，单位米，必须大于0
    let radius = options.radius ?? 100;
    Check.typeOf.number.greaterThan('radius', radius, 0);
    //动画持续时间，单位秒
    let duration = options.duration ?? 2.0;
    Check.typeOf.number('duration', duration);
    let milliDuration = duration * 1000;
    //颜色设置
    let color = parseToColor(options.color ?? '#ff0000');
    //透明度设置
    let opacity = options.opacity ?? 1;
    Check.typeOf.number.greaterThanOrEquals('opacity', opacity, 0);
    Check.typeOf.number.lessThanOrEquals('opacity', opacity, 1);
    color = color.withAlpha(opacity, color);
    //是否启用渐变色
    let gradientColor = options.gradientColor ?? false;
    Check.typeOf.bool('gradientColor', gradientColor);
    //开始颜色
    let startColor;
    if (options.startColor)
        startColor = parseToColor(options.startColor);
    //结束颜色
    let endColor;
    if (options.endColor)
        endColor = parseToColor(options.endColor);
    //扩散指数，值越小扩散环越厚，最小值0
    let power = options.power ?? 3.0;
    Check.typeOf.number.greaterThanOrEquals('power', power, 0);
    //是否开启多重圆环
    let multiple = options.multiple ?? false;
    Check.typeOf.bool('multiple', multiple);
    //多重圆环设置数组
    let multiCircles = options.multiCircles ?? new Array();
    Check.typeOf.array('multiCircles', multiCircles);
    let numberOfMultiple = 1,
        maxRadius;
    let colors = new Array();
    let radii = new Array();
    let powers = new Array();
    handleCircles(multiCircles);
    //是否开启雷达扫描动画
    let radarScan = options.radarScan ?? false;
    Check.typeOf.bool('radarScan', radarScan);
    //雷达扫描线颜色
    let scanColor;
    if (options.scanColor)
        scanColor = parseToColor(options.scanColor);
    //雷达扫描线扩散指数，值越小扩散环越厚，最小值0
    let scanPower = options.scanPower ?? 3.0;
    Check.typeOf.number.greaterThanOrEquals('scanPower', scanPower, 0);
    //雷达扫描动画持续时间，单位秒
    let scanDuration = options.scanDuration ?? 2.0;
    Check.typeOf.number.greaterThan('scanDuration', scanDuration, 0);
    let milliScanDuration = scanDuration * 1000;

    //记录当前时间
    const startTime = (new Date()).getTime();

    //分解多重圆环
    function resolveCircles(circles) {
        colors = new Array();
        radii = new Array();
        powers = new Array();
        decomposeCircles(circles, colors, radii, powers);

        //获取最大半径
        maxRadius = radii[radii.length - 1];
        //获取多重圆环数量
        numberOfMultiple = circles.length;
    }

    //处理多重圆环
    function handleCircles(circles) {
        if (circles.length > 0) {
            parseAndCheckCircles(circles, color, power);
            sortCircles(circles);
            resolveCircles(circles);
        } else {
            multiple = false;
        }
    }

    const fragmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "in vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_centerEC;\n" +
        "uniform vec3 u_planeNormalEC;\n" +
        "uniform vec3 u_scanLineDirectionEC;\n" +
        "uniform bool u_circleDiffuse;\n" +
        "uniform float u_radius;\n" +
        "uniform float u_maxRadius;\n" +
        "uniform vec4 u_diffuseColor;\n" +
        "uniform bool u_gradientColor;\n" +
        "uniform vec4 u_startColor;\n" +
        "uniform vec4 u_endColor;\n" +
        "uniform float u_power;\n" +
        "uniform bool u_multiple;\n" +
        "uniform vec4 u_diffuseColors[" + numberOfMultiple + "];\n" +
        "uniform float u_radii[" + numberOfMultiple + "];\n" +
        "uniform float u_powers[" + numberOfMultiple + "];\n" +
        "uniform bool u_radarScan;\n" +
        "uniform vec4 u_scanColor;\n" +
        "uniform float u_scanPower;\n" +

        "float getDepth(in vec4 depth)\n" +
        "{\n" +
        "   float z_window = czm_unpackDepth(depth);\n" +
        "   z_window = czm_reverseLogDepth(z_window);\n" +
        "   float near = czm_depthRange.near;\n" +
        "   float far = czm_depthRange.far;\n" +
        "   return (2.0 * z_window - near - far) / (far - near);\n" +
        "}\n" +

        "vec4 textureCoordinatesToEye(in vec2 uv, in float depth)\n" +
        "{\n" +
        "   vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));\n" +
        "   vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        "   posInCamera = posInCamera / posInCamera.w;\n" +
        "   return posInCamera;\n" +
        "}\n" +

        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
        "   vec3 v01 = point - planeOrigin;\n" +
        "   float d = dot(planeNormal, v01) ;\n" +
        "   return (point - planeNormal * d);\n" +
        "}\n" +

        "bool isPointOnLineRight(in vec3 lineOrigin, in vec3 lineDirection, in vec3 lineNormal, in vec3 testPoint)\n" +
        "{\n" +
        "   vec3 direction = testPoint - lineOrigin;\n" +
        "   normalize(direction);\n" +
        "   vec3 temp = cross(direction, lineDirection);\n" +
        "   float d = dot(temp, lineNormal);\n" +
        "   return d > 0.5;\n" +
        "}\n" +

        "void main()\n" +
        "{\n" +
        "   out_FragColor = texture(colorTexture, v_textureCoordinates);\n" +
        "   float depth = getDepth(texture(depthTexture, v_textureCoordinates));\n" +
        "   vec4 eyePos = textureCoordinatesToEye(v_textureCoordinates, depth);\n" +
        "   vec3 projectOnPlane = pointProjectOnPlane(u_planeNormalEC.xyz, u_centerEC.xyz, eyePos.xyz);\n" +
        "   float dis = length(projectOnPlane.xyz - u_centerEC.xyz);\n" +
        "   if (u_circleDiffuse && dis <= u_radius)\n" +
        "   {\n" +
        "       if(u_multiple && " + numberOfMultiple + " > 0)\n" +
        "       {\n" +
        "           for(int i = 0; i < " + numberOfMultiple + "; i++)\n" +
        "           {\n" +
        "               float radius = u_radii[i];\n" +
        "               if(dis <= radius)\n" +
        "               {\n" +
        "                   float f = 1.0 - abs(radius - dis) / radius;\n" +
        "                   f = pow(f, u_powers[i]);\n" +
        "                   vec4 diffuseColor = u_diffuseColors[i];\n" +
        "                   out_FragColor = mix(out_FragColor, diffuseColor, f);\n" +
        "                   break;\n" +
        "               }\n" +
        "           }\n" +
        "       }\n" +
        "       else\n" +
        "       {\n" +
        "           float f = 1.0 - abs(u_radius - dis) / u_radius;\n" +
        "           f = pow(f, u_power);\n" +
        "           if (u_gradientColor)\n" +
        "           {\n" +
        "               float p = dis / u_maxRadius;\n" +
        "               vec4 diffuseColor = mix(u_startColor, u_endColor, p);\n" +
        "               out_FragColor = mix(out_FragColor, diffuseColor, f);\n" +
        "           }\n" +
        "           else\n" +
        "           {\n" +
        "               out_FragColor = mix(out_FragColor, u_diffuseColor, f);\n" +
        "           }\n" +
        "       }\n" +
        "   }\n" +
        "   if (u_radarScan && dis <= u_maxRadius)\n" +
        "   {\n" +
        "       float diameter = u_maxRadius * 2.0;\n" +
        "       if(isPointOnLineRight(u_centerEC.xyz, u_scanLineDirectionEC.xyz, u_planeNormalEC.xyz, projectOnPlane.xyz))\n" +
        "       {\n" +
        "           vec3 lineEndPoint = vec3(u_centerEC.xyz) + u_scanLineDirectionEC * u_maxRadius;\n" +
        "           float dis1 = length(projectOnPlane.xyz - lineEndPoint);\n" +
        "           float f = abs(diameter - dis1) / diameter;\n" +
        "           f = pow(f, u_scanPower);\n" +
        "           out_FragColor = mix(out_FragColor, u_scanColor, f);\n" +
        "       }\n" +
        "   }\n" +
        "}\n";

    const stage = new PostProcessStage({
        name: name,
        fragmentShader: fragmentShader,
        uniforms: {
            u_centerEC: function () {
                updateCenterCoordinatesToEye();
                return scratchCartesian4Center;
            },
            u_planeNormalEC: function () {
                return scratchCartesian3Normal;
            },
            u_scanLineDirectionEC: function () {
                const normal = scratchCartesian3Normal;
                const direction = scratchCartesian3Direction.clone(scratchCartesian3RotateDirection);

                const percent = (((new Date()).getTime() - startTime) % milliScanDuration) / milliScanDuration;
                Quaternion.fromAxisAngle(normal, percent * CesiumMath.TWO_PI, scratchQuaternion);
                Matrix3.fromQuaternion(scratchQuaternion, scratchMatrix3);
                Matrix3.multiplyByVector(scratchMatrix3, direction, direction);
                Cartesian3.normalize(direction, direction);
                return direction;
            },
            u_circleDiffuse: function () {
                return circleDiffuse;
            },
            u_radius: function () {
                if (milliDuration <= 0) {
                    if (multiple)
                        return maxRadius;
                    else
                        return radius;
                } else {
                    const percent = (((new Date()).getTime() - startTime) % milliDuration) / milliDuration;
                    if (multiple)
                        return maxRadius * percent;
                    else
                        return radius * percent;
                }
            },
            u_maxRadius: function () {
                if (multiple)
                    return maxRadius;
                else
                    return radius;
            },
            u_diffuseColor: color,
            u_gradientColor: function () {
                if (gradientColor) {
                    //开启渐变色时判断下startColor与endColor是否存在
                    return defined(startColor) || defined(endColor);
                }
                return gradientColor;
            },
            u_startColor: function () {
                return startColor || color;
            },
            u_endColor: function () {
                return endColor || color;
            },
            u_power: function () {
                return power;
            },
            u_multiple: function () {
                return multiple;
            },
            u_diffuseColors: function () {
                return colors;
            },
            u_radii: function () {
                return radii;
            },
            u_powers: function () {
                return powers;
            },
            u_radarScan: function () {
                return radarScan;
            },
            u_scanColor: function () {
                return scanColor || color;
            },
            u_scanPower: function () {
                return scanPower;
            }
        }
    });

    Object.defineProperties(stage, {
        properties: {
            get: function () {
                return properties;
            }
        },
        geographic: {
            set: function (value) {
                this.center = parseGeographicToCartesian(value, center);
            },
            get: function () {
                return this.center.toGeographic();
            }
        },
        position: {
            set: function (value) {
                this.center = parseToCartesian3(value);
            },
            get: function () {
                return this.center;
            }
        },
        center: {
            set: function (value) {
                value = parseToCartesian3(value);
                if (!Cartesian3.equals(value, center)) {
                    center = value.clone(center);
                    updateCenterCoordinates();
                }
            },
            get: function () {
                return center;
            }
        },
        circleDiffuse: {
            set: function (value) {
                Check.typeOf.bool('circleDiffuse', value);
                circleDiffuse = value;
            },
            get: function () {
                return circleDiffuse;
            }
        },
        color: {
            set: function (value) {
                value = parseToColor(value);
                if (!Color.equals(value, color)) {
                    color = value.clone(color);
                    color = color.withAlpha(opacity, color);
                }
            },
            get: function () {
                return color;
            }
        },
        opacity: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
                Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
                if (opacity !== value) {
                    opacity = value;
                    color = color.withAlpha(opacity, color);
                }
            },
            get: function () {
                return opacity;
            }
        },
        gradientColor: {
            set: function (value) {
                Check.typeOf.bool('gradientColor', value);
                gradientColor = value;
            }
        },
        startColor: {
            set: function (value) {
                if (!defined(value)) {
                    startColor = undefined;
                    return;
                }
                value = parseToColor(value);
                if (!Color.equals(value, startColor)) {
                    startColor = value.clone(startColor);
                }
            },
            get: function () {
                return startColor;
            }
        },
        endColor: {
            set: function (value) {
                if (!defined(value)) {
                    endColor = undefined;
                    return;
                }
                value = parseToColor(value);
                if (!Color.equals(value, endColor)) {
                    endColor = value.clone(endColor);
                }
            },
            get: function () {
                return endColor;
            }
        },
        radius: {
            set: function (value) {
                Check.typeOf.number.greaterThan('radius', value, 0);
                if (radius !== value)
                    radius = value;
            },
            get: function () {
                return radius;
            }
        },
        duration: {
            set: function (value) {
                Check.typeOf.number('duration', value);
                if (duration !== value) {
                    duration = value;
                    milliDuration = duration * 1000;
                }
            },
            get: function () {
                return duration;
            }
        },
        power: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('power', value, 0);
                if (power !== value)
                    power = value;
            },
            get: function () {
                return power;
            }
        },
        multiple: {
            set: function (value) {
                Check.typeOf.bool('multiple', value);
                multiple = value;
            },
            get: function () {
                return multiple;
            }
        },
        multiCircles: {
            set: function (value) {
                Check.typeOf.array('multiCircles', value);
                multiCircles = value;
                handleCircles(multiCircles);
            },
            get: function () {
                return multiCircles;
            }
        },
        radarScan: {
            set: function (value) {
                Check.typeOf.bool('radarScan', value);
                radarScan = value;
            },
            get: function () {
                return radarScan;
            }
        },
        scanColor: {
            set: function (value) {
                if (!defined(value)) {
                    scanColor = undefined;
                    return;
                }
                value = parseToColor(value);
                if (!Color.equals(value, scanColor)) {
                    endColor = value.clone(scanColor);
                }
            },
            get: function () {
                return scanColor || color;
            }
        },
        scanDuration: {
            set: function (value) {
                Check.typeOf.number.greaterThan('scanDuration', value, 0);
                if (scanDuration !== value) {
                    scanDuration = value;
                    milliScanDuration = scanDuration * 1000;
                }
            },
            get: function () {
                return scanDuration;
            }
        },
        scanPower: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('scanPower', value, 0);
                if (scanPower !== value)
                    scanPower = value;
            },
            get: function () {
                return scanPower;
            }
        }
    });

    /**
     * 向圆形扫描阶段添加一个圆环。
     * @param {object} circle 圆环设置，包含 color、radius、power 属性。
     * @memberof PostProcessStage
    */
    stage.addCircle = function (circle) {
        parseAndCheckCircle(circle, color);
        multiCircles.push(circle);
        sortCircles(multiCircles);
        resolveCircles(multiCircles);
    };

    /**
     * 移除圆形扫描阶段指定索引的圆环。
     * @param {number} index 待移除圆环的索引。
     * @memberof PostProcessStage
    */
    stage.removeCircleAt = function (index) {
        Check.typeOf.integer.greaterThanOrEquals('index', index, 0);
        Check.typeOf.integer.lessThan('index', index, multiCircles.length);
        multiCircles.splice(index, 1);
        if (multiCircles.length === 0)
            multiple = false;
        else
            numberOfMultiple = multiCircles.length;
    };

    /**
     * 移除圆形扫描阶段的全部圆环。
     * @memberof PostProcessStage
    */
    stage.removeAllCircles = function () {
        multiple = false;
        multiCircles = new Array();
    };

    stage.setOptions(options);
    return stage;
};

const NearFarScalarFogFragmentShaderSource =
    "float getDistance(sampler2D depthTexture, vec2 texCoords) \n" +
    "{ \n" +
    "    float depth = czm_unpackDepth(texture(depthTexture, texCoords)); \n" +
    "    if (depth == 0.0) { \n" +
    "        return czm_infinity; \n" +
    "    } \n" +
    "    vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); \n" +
    "    return -eyeCoordinate.z / eyeCoordinate.w; \n" +
    "} \n" +

    "float interpolateByDistance(vec4 nearFarScalar, float distance) \n" +
    "{ \n" +
    "    float startDistance = nearFarScalar.x; \n" +
    "    float startValue = nearFarScalar.y; \n" +
    "    float endDistance = nearFarScalar.z; \n" +
    "    float endValue = nearFarScalar.w; \n" +
    "    float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); \n" +
    "    return mix(startValue, endValue, t); \n" +
    "} \n" +

    "vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) \n" +
    "{ \n" +
    "    return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); \n" +
    "} \n" +

    "uniform sampler2D colorTexture; \n" +
    "uniform sampler2D depthTexture; \n" +
    "uniform bool u_fogEnable; \n" +
    "uniform vec4 u_fogByDistance; \n" +
    "uniform vec4 u_fogColor; \n" +
    "in vec2 v_textureCoordinates; \n" +

    "void main(void) \n" +
    "{ \n" +
    "    if (u_fogEnable) { \n" +
    "       float distance = getDistance(depthTexture, v_textureCoordinates); \n" +
    "       vec4 sceneColor = texture(colorTexture, v_textureCoordinates); \n" +
    "       float blendAmount = interpolateByDistance(u_fogByDistance, distance); \n" +
    "       vec4 finalFogColor = vec4(u_fogColor.rgb, u_fogColor.a * blendAmount); \n" +
    "       out_FragColor = alphaBlend(finalFogColor, sceneColor); \n" +
    "    } else { \n" +
    "       out_FragColor = texture(colorTexture, v_textureCoordinates); \n" +
    "    } \n" +
    "} \n";

/**
 * 创建基于近远距离线性插值的迷雾后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {string} [options.name] 阶段名称。
 * @param {object} [options.properties] 自定义属性。
 * @param {boolean} [options.enable=true] 是否开启迷雾。
 * @param {Color|string} [options.color='#fff'] 迷雾颜色。
 * @param {number} [options.near=10] 近距。
 * @param {number} [options.nearValue=0.0] 近距插值。
 * @param {number} [options.far=500] 远距。
 * @param {number} [options.farValue=1.0] 远距插值。
 * @returns {PostProcessStage} 生成的迷雾后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createNearFarScalarFogStage = function (options = {}) {
    const name = options.name ?? 'NearFarScalarFog_' + createGuid();
    const properties = options.properties;

    //是否开启迷雾
    let fogEnable = options.enable ?? true;
    //颜色设置
    let fogColor = parseToColor(options.color ?? '#fff');
    //近距
    let near = options.near ?? 10;
    //近距插入值
    let nearValue = options.nearValue ?? 0.0;
    //远距
    let far = options.far ?? 500;
    //远距插入值
    let farValue = options.farValue ?? 1.0;

    const fogByDistance = new Cartesian4(near, nearValue, far, farValue);

    const stage = new PostProcessStage({
        name: name,
        fragmentShader: NearFarScalarFogFragmentShaderSource,
        uniforms: {
            u_fogEnable: function () {
                return fogEnable;
            },
            u_fogColor: fogColor,
            u_fogByDistance: fogByDistance,
        }
    });

    Object.defineProperties(stage, {
        properties: {
            get: function () {
                return properties;
            }
        },
        enable: {
            set: function (value) {
                Check.typeOf.bool('enable', value);
                fogEnable = value;
            },
            get: function () {
                return fogEnable;
            }
        },
        color: {
            set: function (value) {
                value = parseToColor(value);
                Color.clone(value, fogColor);
            },
            get: function () {
                return fogColor;
            }
        },
        near: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.x = value;
            },
            get: function () {
                return fogByDistance.x;
            }
        },
        nearValue: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.y = value;
            },
            get: function () {
                return fogByDistance.y;
            }
        },
        far: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.z = value;
            },
            get: function () {
                return fogByDistance.z;
            }
        },
        farValue: {
            set: function (value) {
                value = parseNumber(value);
                fogByDistance.w = value;
            },
            get: function () {
                return fogByDistance.w;
            }
        }
    });

    stage.setOptions(options);
    return stage;
};

const Exp2FogFragmentShaderSource =
    "uniform sampler2D colorTexture;\n" +
    "uniform sampler2D depthTexture;\n" +
    "in vec2 v_textureCoordinates;\n" +
    "uniform bool u_fogEnable;\n" +
    "uniform vec4 u_fogColor;\n" +
    "uniform float u_fogDensity;\n" +

    "float getDepth(in vec4 depth)\n" +
    "{\n" +
    "   float z_window = czm_unpackDepth(depth);\n" +
    "   z_window = czm_reverseLogDepth(z_window);\n" +
    "   float near = czm_depthRange.near;\n" +
    "   float far = czm_depthRange.far;\n" +
    "   return (2.0 * z_window - near - far) / (far - near);\n" +
    "}\n" +

    "vec4 textureCoordinatesToEye(in vec2 uv, in float depth)\n" +
    "{\n" +
    "   vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));\n" +
    "   vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
    "   posInCamera = posInCamera / posInCamera.w;\n" +
    "   return posInCamera;\n" +
    "}\n" +

    "void main()\n" +
    "{\n" +
    "   out_FragColor = texture(colorTexture, v_textureCoordinates);\n" +
    "   if (u_fogEnable && u_fogDensity > 0.0)\n" +
    "   {\n" +
    "       float depth = getDepth(texture(depthTexture, v_textureCoordinates));\n" +
    "       vec4 eyePos = textureCoordinatesToEye(v_textureCoordinates, depth);\n" +
    "       float fogDepth = -eyePos.z;" +
    "       float fogFactor = 1.0 - exp(-u_fogDensity * u_fogDensity * fogDepth * fogDepth);\n" +
    "       fogFactor = clamp(fogFactor, 0.0, 1.0);\n" +
    "       out_FragColor.rgb = mix(out_FragColor.rgb, u_fogColor.rgb, fogFactor);\n" +
    "   }\n" +
    "}";

/**
 * 创建指数平方（Exp2）浓淡效果的迷雾后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {string} [options.name] 阶段名称。
 * @param {object} [options.properties] 自定义属性。
 * @param {boolean} [options.enable=true] 是否开启迷雾。
 * @param {Color|string} [options.color='#fff'] 迷雾颜色。
 * @param {number} [options.density=1] 迷雾密度。
 * @returns {PostProcessStage} 生成的迷雾后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createExp2FogStage = function (options = {}) {
    const name = options.name ?? 'Exp2Fog_' + createGuid();
    const properties = options.properties;

    //是否开启迷雾
    let fogEnable = options.enable ?? true;
    //颜色设置
    let fogColor = parseToColor(options.color ?? '#fff');
    //密度设置
    let fogDensity = options.density ?? 1;

    const stage = new PostProcessStage({
        name: name,
        fragmentShader: Exp2FogFragmentShaderSource,
        uniforms: {
            u_fogEnable: function () {
                return fogEnable;
            },
            u_fogColor: fogColor,
            u_fogDensity: function () {
                return fogDensity / 500;
            },
        }
    });

    Object.defineProperties(stage, {
        properties: {
            get: function () {
                return properties;
            }
        },
        enable: {
            set: function (value) {
                Check.typeOf.bool('enable', value);
                fogEnable = value;
            },
            get: function () {
                return fogEnable;
            }
        },
        color: {
            set: function (value) {
                value = parseToColor(value);
                Color.clone(value, fogColor);
            },
            get: function () {
                return fogColor;
            }
        },
        density: {
            set: function (value) {
                value = parseNumber(value);
                fogDensity = value;
            },
            get: function () {
                return fogDensity;
            }
        },
    });

    stage.setOptions(options);
    return stage;
};

/**
 * 迷雾类型枚举。
 * @type {object}
 * @constant
*/
const FogType = Object.freeze({
    NearFarScalar: 'NearFarScalar',
    Exp2: 'Exp2',
});

/**
 * 根据类型创建迷雾后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {string} [options.type=FogType.NearFarScalar] 迷雾类型，取值见 FogType。
 * @returns {PostProcessStage} 生成的迷雾后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createFogStage = function (options = {}) {
    const type = (options.type ?? FogType.NearFarScalar).toLocaleString();
    switch (type) {
        case FogType.Exp2:
            return PostProcessStageLibrary.createExp2FogStage(options);
        default:
            return PostProcessStageLibrary.createNearFarScalarFogStage(options);
    }
};

const HighlightFragmentShaderSource =
    "uniform sampler2D colorTexture;\n" +
    "in vec2 v_textureCoordinates;\n" +
    "uniform vec4 highlight;\n" +
    "void main() {\n" +
    "    vec4 color = texture(colorTexture, v_textureCoordinates);\n" +
    "    if (czm_selected()) {\n" +
    "        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n" +
    "        out_FragColor = vec4(highlighted, color.a);\n" +
    "    } else { \n" +
    "        out_FragColor = color;\n" +
    "    }\n" +
    "}\n";

/**
 * 创建高亮后处理阶段。
 * @param {object} [options={}] 配置项。
 * @param {Color|string} [options.color] 高亮颜色。
 * @param {number} [options.intensity] 高亮强度，取值 0 到 1。
 * @returns {PostProcessStage} 生成的高亮后处理阶段。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createHighlightStage = function (options = {}) {
    const guid = createGuid();

    const highlight = new Color(1.0, 1.0, 1.0, 0.5);

    const stage = new PostProcessStage({
        name: "czm_highlight_" + guid,
        fragmentShader: HighlightFragmentShaderSource,
        uniforms: {
            highlight: function () {
                return highlight;
            },
        },
    });

    Object.defineProperties(stage, {
        color: {
            set: function (value) {
                value = parseToColor(value);
                Color.cloneRgb(value, highlight);
            },
            get: function () {
                return highlight;
            }
        },
        intensity: {
            set: function (value) {
                Check.typeOf.number.greaterThanOrEquals('intensity', 0);
                Check.typeOf.number.lessThanOrEquals('intensity', 1);
                highlight.alpha = value;
            },
            get: function () {
                return highlight.alpha;
            }
        }
    });

    stage.setOptions(options);
    return stage;
};

const SkylineFragmentShaderSource =
    "uniform sampler2D colorTexture;\n" +
    "uniform sampler2D depthTexture;\n" +
    "uniform sampler2D silhouetteTexture;\n" +
    "in vec2 v_textureCoordinates;\n" +
    "void main() {\n" +
    "    float depth = czm_readDepth(depthTexture, v_textureCoordinates);" +
    "    vec4 silhouetteColor = texture(silhouetteTexture, v_textureCoordinates);" +
    "    vec4 color = texture(colorTexture, v_textureCoordinates);\n" +
    "    if(depth >= 1.0 - 0.000001) {\n" +
    "        out_FragColor = mix(color, silhouetteColor, silhouetteColor.a);\n" +
    "    } else { \n" +
    "        out_FragColor = color;\n" +
    "    }\n" +
    "}\n";

/**
 * 创建天际线（轮廓线）检测的后处理阶段组合。
 * @param {object} [options={}] 配置项。
 * @param {boolean} [options.enabled=true] 是否启用。
 * @param {Color|string} [options.color=Color.RED] 轮廓线颜色。
 * @param {number} [options.lineWidth=1.0] 轮廓线宽度，须大于 0。
 * @returns {PostProcessStageComposite} 生成的天际线后处理阶段组合。
 * @memberof PostProcessStageLibrary
 * @static
*/
PostProcessStageLibrary.createSkylineState = function (options = {}) {
    const edgeDetection = PostProcessStageLibrary.createEdgeDetectionStage();
    const skilneStage = new PostProcessStage({
        fragmentShader: SkylineFragmentShaderSource,
        uniforms: {
            silhouetteTexture: edgeDetection.name
        }
    });

    const composite = new PostProcessStageComposite({
        //PostProcessStage要按顺序执行 的stage或组合的数组。
        stages: [edgeDetection, skilneStage],
        //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
        inputPreviousStageTexture: false,
    });

    Object.defineProperties(composite, {
        lineWidth: {
            get: function () {
                return edgeDetection.uniforms.lineWidth;
            },
            set: function (value) {
                Check.typeOf.number.greaterThan('lineWidth', value, 0);
                edgeDetection.uniforms.lineWidth = value;
            }
        },
        color: {
            get: function () {
                return edgeDetection.uniforms.color;
            },
            set: function (value) {
                value = parseToColor(value);
                Color.cloneRgb(value, edgeDetection.uniforms.color);
            }
        },
    });

    composite.enabled = options.enabled ?? true;
    composite.color = options.color ?? Color.RED;
    composite.lineWidth = options.lineWidth ?? 1.0;

    return composite;
};

export default PostProcessStageLibrary;
export { FogType, PostProcessStage, PostProcessStageLibrary };
