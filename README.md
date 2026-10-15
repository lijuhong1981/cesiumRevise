# cesium-utils

Cesium 公共工具库。

## 目录结构

```
src/
├── index.js          # 库入口
├── revisions/        # Cesium 类的扩展/补丁（monkey-patch）
├── parses/           # 值解析工具（字符串/数字 → Cesium 类型）
├── additions/        # 坐标/矩阵变换族 + Geographic/PropertyType 类型
└── utils/            # Scratch 缓存 + 通用工具函数
```

## 使用

### 方式一：ES Module（npm 引入）

适用于用打包工具（webpack / vite / rollup 等）构建的项目。`cesium` 作为 peerDependency 由使用方提供，确保扩展与使用方共享同一个 Cesium 实例，monkey-patch 才能全局生效。

```bash
npm install @lijuhong1981/cesium.utils cesium
```

```js
import * as CesiumUtils from '@lijuhong1981/cesium.utils';
// 或按需引入
import { Geographic, parseToCartesian3 } from '@lijuhong1981/cesium.utils';
```

### 方式二：浏览器全局（`<script>` 标签）

适用于不用打包工具、直接通过 `<script>` 标签加载 Cesium（全局 `window.Cesium`）的项目。使用本库的 UMD 产物，它会把 revisions 的补丁自动应用到全局 `Cesium` 上。

```html
<script src="Cesium/Cesium.js"></script>
<script src="cesium.utils.min.js"></script>
<script>
  // 此时 revisions 的 monkey-patch 已作用于全局 Cesium
  const c3 = CesiumUtils.parseToCartesian3([120, 30, 100]);
  const geo = new CesiumUtils.Geographic(120, 30, 100);
</script>
```

也可通过 CDN 直接引入：

```html
<script src="https://unpkg.com/@lijuhong1981/cesium.utils/dist/cesium.utils.min.js"></script>
```

产物说明：

| 文件 | 格式 | 说明 |
| --- | --- | --- |
| `dist/cesium.utils.umd.js` | UMD | 未压缩，便于调试，全局名 `CesiumUtils` |
| `dist/cesium.utils.min.js` | UMD | 压缩版，供 CDN / 生产使用 |
| `dist/cesium.utils.esm.js` | ESM | 单文件打包版 |

## 构建

```bash
npm run build   # rollup 打包，输出到 dist/
```

`cesium` 在打包时作为 external，映射到全局 `Cesium`；`@lijuhong1981/*` 等依赖会一并打入产物。

## 依赖

- `cesium`（peer，`>=1.107.0`）
- `@lijuhong1981/jsmath` / `jscheck` / `jslib` / `jsdestroy`（公共基础包）

## API 文档

文档使用 [JSDoc](https://jsdoc.app/) + [docdash](https://github.com/clenemt/docdash) 生成：

```bash
npm install
npm run docs   # 生成到 docs/ 目录
```

打开 `docs/index.html` 查看。文档覆盖：

- **revisions/**：Cesium 类扩展（`@class` + `@memberof` 归到对应 Cesium 类下）
- **parses/**：解析函数
- **additions/**：变换类与 `Geographic` 类型
- **utils/**：工具函数（`Scratch` 缓存已排除）

## 模块说明

- **revisions/**：25 个 Cesium 类扩展（BoundingSphere、Camera、Cartesian、Matrix、Rectangle 等）。
- **parses/**：45 个解析函数。
- **additions/**：`Geographic`、`GeographicTransform`、`ModelMatrixTransforms`、`StTransforms`、`TranslationRotationScaleTransform`、`PropertyChangedListener`、`GeometryInstanceAttributes`、`PropertyType`。
- **utils/**：`Scratch` + 12 个通用函数。

## 暂未迁入

- `revisions/IntersectionTests.revise.js`：依赖第四层 `PCI3DTileset`，且引用了未定义的 `Check`/`PCI3MXTileset`/`InnerWorker`/`WorkerMessageType`。
- `revisions/` 中 4 个未导出文件：`Model` / `ModelNode` / `ParticleSystem` / `ScreenSpaceCameraController`。
- `materials/`、`tiles/`、`defines/` 其余、`draws/`、`primitives/`、`domUI/`、`additions/` 中的业务类。
- `utils/` 中与媒体播放 / DOM / 部署地址相关的工具。
