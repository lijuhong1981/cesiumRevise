import parseToColor from "../parses/parseToColor.js";

/**
 * 在目标对象上定义 color、opacity 属性访问器，供颜色类材质复用。
 * @param {object} target 目标对象，通常为材质类的 prototype
 * @returns {void}
 */
function defineColorMaterialProperties(target) {

    Object.defineProperties(target, {
        color: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value);
                const color = this.uniforms.color;
                if (!Cesium.Color.equalsRgb(value, color))
                    this.uniforms.color = value.cloneRgb(color);
            },
            get: function () {
                return this.uniforms.color;
            }
        },
        opacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number.greaterThanOrEquals('opacity', value, 0);
                Cesium.Check.typeOf.number.lessThanOrEquals('opacity', value, 1);
                this.color.alpha = value;
            },
            get: function () {
                return this.color.alpha;
            }
        },
    });

};

/**
 * 在目标对象上定义折线虚线材质所需的属性访问器：
 * color、opacity（若未定义则先定义）、gapColor、gapOpacity、dashLength、dashPattern。
 * @param {object} target 目标对象，通常为材质类的 prototype
 * @returns {void}
 */
function definePolylineDashMaterialProperties(target) {

    if ('color' in target === false)
        defineColorMaterialProperties(target);

    Object.defineProperties(target, {
        gapColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value);
                const gapColor = this.uniforms.gapColor;
                if (!Cesium.Color.equalsRgb(value, gapColor))
                    this.uniforms.gapColor = value.cloneRgb(gapColor);
            },
            get: function () {
                return this.uniforms.gapColor;
            }
        },
        gapOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number.greaterThanOrEquals('gapOpacity', value, 0);
                Cesium.Check.typeOf.number.lessThanOrEquals('gapOpacity', value, 1);
                this.gapColor.alpha = value;
            },
            get: function () {
                return this.gapColor.alpha;
            }
        },
        dashLength: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number('dashLength', value);
                this.uniforms.dashLength = value;
            },
            get: function () {
                return this.uniforms.dashLength;
            }
        },
        dashPattern: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number('dashPattern', value);
                this.uniforms.dashPattern = value;
            },
            get: function () {
                return this.uniforms.dashPattern;
            }
        }
    });

};

/**
 * 在目标对象上定义折线发光材质所需的属性访问器：
 * color、opacity（若未定义则先定义）、glowPower、taperPower。
 * @param {object} target 目标对象，通常为材质类的 prototype
 * @returns {void}
 */
function definePolylineGlowMaterialProperties(target) {

    if ('color' in target === false)
        defineColorMaterialProperties(target);

    Object.defineProperties(target, {
        glowPower: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number('glowPower', value);
                this.uniforms.glowPower = value;
            },
            get: function () {
                return this.uniforms.glowPower;
            }
        },
        taperPower: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number('taperPower', value);
                this.uniforms.taperPower = value;
            },
            get: function () {
                return this.uniforms.taperPower;
            }
        }
    });
};

/**
 * 在目标对象上定义折线描边材质所需的属性访问器：
 * color、opacity（若未定义则先定义）、outline、outlineColor、outlineOpacity、outlineWidth。
 * @param {object} target 目标对象，通常为材质类的 prototype
 * @returns {void}
 */
function definePolylineOutlineMaterialProperties(target) {

    if ('color' in target === false)
        defineColorMaterialProperties(target);

    Object.defineProperties(target, {
        outline: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.boolean('outline', value);
                this.uniforms.outline = value;
            },
            get: function () {
                return this.uniforms.outline;
            }
        },
        outlineColor: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                value = parseToColor(value);
                const outlineColor = this.uniforms.outlineColor;
                if (!Cesium.Color.equalsRgb(value, outlineColor))
                    this.uniforms.outlineColor = value.cloneRgb(outlineColor);
            },
            get: function () {
                return this.uniforms.outlineColor;
            }
        },
        outlineOpacity: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number.greaterThanOrEquals('outlineOpacity', value, 0);
                Cesium.Check.typeOf.number.lessThanOrEquals('outlineOpacity', value, 1);
                this.outlineColor.alpha = value;
            },
            get: function () {
                return this.outlineColor.alpha;
            }
        },
        outlineWidth: {
            enumerable: true,
            configurable: true,
            set: function (value) {
                Cesium.Check.typeOf.number('outlineWidth', value);
                this.uniforms.outlineWidth = value;
            },
            get: function () {
                return this.uniforms.outlineWidth;
            }
        },
    });

};

export {
    defineColorMaterialProperties,
    definePolylineDashMaterialProperties,
    definePolylineGlowMaterialProperties,
    definePolylineOutlineMaterialProperties,
};