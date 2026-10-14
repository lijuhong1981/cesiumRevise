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

本库是 ES Module，`cesium` 作为 peerDependency 由使用方提供（确保扩展与使用方共享同一个 Cesium 实例，monkey-patch 才能全局生效）。

```bash
npm install @lijuhong1981/cesium.utils cesium
```

```js
import * as CesiumUtils from '@lijuhong1981/cesium.utils';
// 或按需引入
import { Geographic, parseToCartesian3 } from '@lijuhong1981/cesium.utils';
```

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
