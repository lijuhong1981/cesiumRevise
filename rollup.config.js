import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

/**
 * 打包配置。
 *
 * - `cesium` 作为 external，不打进产物，映射到全局变量 `Cesium`（供 <script> 标签场景）；
 * - `@lijuhong1981/*` 等子包会被一并打包进产物（浏览器中不单独提供）。
 *
 * 产物：
 * - dist/cesium.utils.umd.js  UMD（未压缩，便于调试），全局名 CesiumUtils
 * - dist/cesium.utils.min.js  UMD（压缩，供 CDN 使用）
 * - dist/cesium.utils.esm.js  ESM（单文件打包版）
 */

const input = "src/index.js";
const external = ["cesium"];
const globals = { cesium: "Cesium" };
const plugins = [nodeResolve({ browser: true, preferBuiltins: false })];

export default [
    // UMD（未压缩）
    {
        input,
        external,
        plugins,
        output: {
            file: "dist/cesium.utils.umd.js",
            format: "umd",
            name: "CesiumUtils",
            exports: "named",
            globals,
            sourcemap: true,
        },
    },
    // UMD（压缩，供 CDN/<script> 使用）
    {
        input,
        external,
        plugins: [...plugins, terser()],
        output: {
            file: "dist/cesium.utils.min.js",
            format: "umd",
            name: "CesiumUtils",
            exports: "named",
            globals,
            sourcemap: true,
        },
    },
    // ESM（单文件打包版）
    {
        input,
        external,
        plugins,
        output: {
            file: "dist/cesium.utils.esm.js",
            format: "es",
            sourcemap: true,
        },
    },
];
