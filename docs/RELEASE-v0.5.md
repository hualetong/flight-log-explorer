# Flight Log Explorer v0.5 / 飞行日志可视化工具

Chinese/English UI, improved timeline controls, and optional online maps with offline log processing.

本次更新加入中英文界面、改进时间轴交互，并提供可选在线底图；日志仍在本机解析。

## What's new / 更新内容

- Switch between Chinese and English; the choice is remembered locally, including chart and PNG labels / 支持中英文切换并记忆选择，图表与 PNG 标签同步翻译。
- Drag the white playhead to seek; adjust the green selection boundaries only when the pointer is close to an edge / 拖动白色竖线调整进度，仅在靠近绿色边界时调整框选范围。
- Ctrl + wheel zooms the timeline around the pointer, independently of the selected time range / Ctrl＋滚轮以鼠标位置为焦点缩放时间轴，保留框选范围。
- Fix dragging the end boundary at the far right, including fractional canvas widths / 修复结束边界在最右侧、小数画布宽度下无法拖动的问题。
- Optional Esri satellite imagery and street maps, plus OpenFreeMap (OSM) vector streets without an API key / 新增可选 Esri 卫星影像、街道地图与无需密钥的 OpenFreeMap（OSM）矢量街道图。
- Missing detailed Esri tiles fall back to cropped parent tiles without changing track zoom / Esri 详细瓦片缺失时自动使用父级瓦片裁剪，保持轨迹缩放。
- Map and track remain aligned while panning, zooming and exporting PNG; source attribution is retained / 底图与轨迹在平移、缩放和 PNG 导出时保持对齐，并保留来源署名。
- Map picker colors: selected = light background/dark text; unselected = dark background/light text / 地图菜单选中项浅底深字，未选中项深底浅字。

Existing features include ArduPilot `.BIN`/JSON import, mode-colored tracks, playback, searchable point information, time filtering, and up to six custom parameter curves with PNG export.

保留 ArduPilot `.BIN`/JSON 导入、模式着色轨迹、回放、可搜索的点信息、时间筛选以及最多六条自定义参数曲线和 PNG 导出。

## Usage / 使用说明

1. Download `flight-log-explorer-v0.5.zip` and extract the entire archive / 下载 ZIP 并完整解压。
2. Double-click `index.html` in Edge or Chrome; keep the `vendor` directory and other bundled files together / 用 Edge 或 Chrome 双击 `index.html`，保留 `vendor` 目录及其他附带文件。
3. Try the built-in example or import `examples/simulated-flight.json`, then your ArduPilot log / 体验内置示例或模拟 JSON，再导入 ArduPilot 日志。
4. Use the top-right language selector; drag timeline boundaries or playhead, and hold Ctrl while scrolling to zoom / 右上角切换语言，拖动时间边界或进度线，按住 Ctrl 滚轮缩放。
5. If connected to the internet, enable Online basemap and choose a source; try OpenFreeMap when Esri streets lack detail / 联网时开启在线地图并选择来源，Esri 街道图细节不足时可切换 OpenFreeMap。
6. Scroll down to configure overlapping parameter curves and export images / 向下滚动配置参数叠加并导出图像。

## Privacy, licenses and limitations / 隐私、许可与限制

- Maps are off by default. Logs and telemetry arrays are never uploaded; enabled maps request the viewed area from Esri or OpenFreeMap, whose servers can see your IP and tile indices / 底图默认关闭，日志和遥测数组不会上传；开启后 Esri 或 OpenFreeMap 服务可获知 IP 与浏览区域的瓦片索引。
- OpenFreeMap needs WebGL and internet access. Coverage depends on map data and network availability. Esri parent-tile fallback cannot invent missing detail / OpenFreeMap 需要 WebGL 和网络；覆盖取决于地图数据和网络，Esri 父级瓦片回退无法增加缺失的细节。
- Valid GPS is required. PX4 ULog and MAVLink tlog are not supported; takeoff and landing are not detected automatically / 需要有效 GPS，不支持 PX4 ULog 或 MAVLink tlog，不自动识别起降。
- Field availability and units depend on the log; missing or stale values remain missing. Large logs consume memory / 字段与单位取决于日志，缺失或过期值保持缺失，大日志会占用较多内存。
- Project code uses MIT; bundled MapLibre GL JS uses BSD-3-Clause, with third-party notices included. Map data has its own terms / 项目代码采用 MIT，附带 MapLibre GL JS 使用 BSD-3-Clause 并保留第三方声明；地图数据遵循各自条款。

The ZIP includes a synthetic sample, bilingual README, licenses and previews. No real flight logs are distributed. See the [README](https://github.com/hualetong/flight-log-explorer/blob/v0.5/README.md) for data interpretation and detailed limitations.

ZIP 包含模拟示例、中英文 README、许可证与预览，不含真实飞行日志。数据口径及详细限制见 README。
