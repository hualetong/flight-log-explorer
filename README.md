# Flight Log Explorer / (飞行日志可视化工具)

An offline, browser-based ArduPilot flight log explorer. Version 0.1.

本地离线运行的 ArduPilot 飞行日志交互工具，版本 v0.1。

## Quick start / 快速开始

Download or clone this repository, then double-click `index.html`. Click **导入飞行日志** (Import flight log), or drag a log file onto the page. No installation, server, or internet connection is required. Logs are parsed locally and are never uploaded. The current application interface is in Chinese.

下载或克隆仓库后，双击 `index.html`。点击「导入飞行日志」，或将日志文件拖入页面。无需安装依赖、启动服务或联网；日志只在本机解析，不会上传。当前工具界面为中文。

## Features / 功能

| Feature | 功能说明 |
| --- | --- |
| Import ArduPilot DataFlash `.BIN` files or parsed JSON containing message arrays such as `GPS`, `MODE`, and `POS`. PX4 ULog and MAVLink tlog are not supported. | 导入 ArduPilot DataFlash `.BIN` 或包含 `GPS`、`MODE`、`POS` 等消息数组的 JSON。不支持 PX4 ULog 和 MAVLink tlog。 |
| North-up, equal-scale east/north track in meters, colored by flight mode, with start/end markers. Zoom with the wheel, drag to pan, and use **适应轨迹** to fit the track. | 北向上、等比例东/北米制轨迹，按模式着色并标记起终点。滚轮缩放、拖动平移，「适应轨迹」复位。 |
| Hover to inspect the nearest recorded point: mode, ground speed, GPS altitude, height relative to home, airspeed, coordinates, attitude, satellites, and voltage. Click to select its time. | 悬停查看最近记录点的模式、地速、GPS 海拔、相对起飞点高度、空速、经纬度、姿态、卫星和电压；点击定位时间。 |
| Time slider, playback at 1×/5×/10×, ground-speed and relative-height profiles, and PNG export. | 时间滑块、1/5/10 倍回放、地速与相对高度曲线、PNG 导出。 |
| Summary of valid GPS duration, cumulative track distance, maximum ground speed, and position count. Ground/taxi records are included; takeoff and landing are not detected automatically. | 概览显示有效 GPS 时间范围、累积距离、最大地速和定位点数。包含地面滑行与静止记录，不自动识别起飞和着陆。 |

## Data interpretation / 数据口径

### GPS and track continuity / GPS 与轨迹连续性

Only GPS records with `Status ≥ 3` and valid coordinates are displayed. With multiple receivers, the lowest-numbered instance with a valid fix is selected. Invalid fixes or gaps longer than 3 seconds break the track; these gaps do not contribute to distance. Logs without valid GPS points show an error instead of an inferred track.

只显示 `GPS.Status ≥ 3` 且坐标有效的记录。多个接收机时选择具有有效定位的最小编号实例，避免接收机之间交错。定位无效、失锁或间隔超过 3 秒时断开轨迹，断开段不计距离。没有有效 GPS 时提示错误，不推测位置。

### Units and time alignment / 单位与时间匹配

Speed is in m/s and altitude is in meters. `GPS.Alt` is altitude above mean sea level; `POS.RelHomeAlt` is height relative to the home position. Missing values are shown as `—`. Mode comes from the latest `MODE` event at or before the GPS sample. Other messages use the latest preceding record no more than 2 seconds old. Elapsed time starts at the first valid GPS point.

速度单位为 m/s，高度单位为 m。`GPS.Alt` 为海拔，`POS.RelHomeAlt` 为相对起飞点高度；缺失值显示「—」。模式取 GPS 采样时刻及之前最近的 `MODE` 变更；其他消息取之前最近且不超过 2 秒的记录。相对时间从首个有效 GPS 点开始。

### Flight modes / 飞行模式

Vehicle type is detected from `ArduPlane`, `ArduCopter`, or `ArduRover` in `MSG` records. If it cannot be detected, use the vehicle selector above the plot. Unknown or unmapped modes retain their numeric IDs.

根据 `MSG` 中的 `ArduPlane`、`ArduCopter` 或 `ArduRover` 自动识别机型；无法识别时，在图上方手动选择。未知模式或未覆盖的编号保留数字显示。

### Projection and profiles / 投影与曲线

The plot uses a local east/north approximation centered on the first point, suitable for flights around a field. Long-distance routes need a geographic map projection. Version 0.1 has no online basemap. Speed and relative-height profiles are normalized independently to show trends; inspect point details for exact values.

俯视图采用以首点为原点的局部东/北近似投影，适合场地飞行；长距离航线需要扩展为地理地图投影。初版没有在线地图底图。地速和相对高度曲线各自归一化显示趋势，精确值见定位点详情。

### Binary decoding / 二进制解析

BIN files are decoded using their embedded `FMT` definitions, following the field formats in [ArduPilot LogStructure.h](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Logger/LogStructure.h). Complete records are recovered where possible from damaged or truncated logs, with warnings.

BIN 根据内嵌 `FMT` 定义解码，字段格式参考上述 ArduPilot 源文件。日志损坏或截断时，尽可能读取完整记录并提示。

## Development / 开发

| File / 文件 | Purpose / 用途 |
| --- | --- |
| `index.html` | Application entry / 工具入口 |
| `log-parser.js` | DataFlash decoding and time alignment / DataFlash 解码与时间关联 |
| `app.js` | Canvas rendering, interactions, and import / Canvas 绘图、交互与导入 |
| `style.css` | Interface styling / 界面样式 |
| `test-parser.cjs` | Parser verification / 解析验证 |
| `check-ui.cjs` | Browser interaction verification / 浏览器交互验证 |

An inline Web Worker runs parsing in the background, including when opened directly from disk. Older browsers without Web Worker support fall back to the main thread. Runtime use requires no development dependencies.

内联 Web Worker 在后台解析，直接双击打开也无需网络资源；不支持 Web Worker 的旧浏览器回退到主线程。正常使用工具不需要开发依赖。

## Verification / 验证

Run from the repository directory / 在仓库目录运行：

```sh
node test-parser.cjs
```

This checks invalid GPS, fix-loss gaps, time alignment, and stale data. Optional real-log comparisons run when the original log75/log76/log77 fixtures and parsed JSON exist in `../10.1`, or in the directory specified by `FLIGHT_LOG_DIR`. Real flight logs are not distributed with this repository. The original log77 fixture named `noGPS` actually contains 274 valid GPS records and is displayed accordingly.

检查无有效 GPS、失锁断线、时间匹配和过期数据。若 `../10.1` 或环境变量 `FLIGHT_LOG_DIR` 指定的目录包含原始 log75/log76/log77 和解析 JSON，还会执行真实日志对照验证。真实飞行日志不随仓库分发。原始文件名含 `noGPS` 的 log77 实际有 274 个有效 GPS 记录，按内容正常展示。

For browser checks / 浏览器验证：

```sh
npm install --no-save playwright
npx playwright install chromium
node check-ui.cjs
```

Checks use the simulated example by default. Set `BROWSER_CHANNEL=msedge` to use an installed Microsoft Edge, or `FLIGHT_LOG_DIR` to test the original BIN fixture. These checks cover hover, click, zoom, seeking, playback, PNG export, import-error handling, and mobile layout.

默认使用模拟示例验证。设置 `BROWSER_CHANNEL=msedge` 可使用已安装的 Edge；设置 `FLIGHT_LOG_DIR` 可验证原始 BIN。检查涵盖悬停、点击、缩放、时间定位、回放、PNG 导出、导入错误处理和移动端布局。
