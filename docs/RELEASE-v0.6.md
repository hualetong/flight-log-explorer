# Flight Log Explorer v0.6 / 飞行日志可视化工具

Mission waypoint overlays, recorded nose heading, and a taller adjustable track display are now included in the downloadable release.

本次发布将任务航点叠加、机头朝向可视化及可调节高度的轨迹显示区纳入下载包。

## What's new since v0.5 / 相比 v0.5 的更新

- Import a QGC WPL 110 `.waypoints` file over the recorded flight track. Show numbered markers, the file Home, and dashed mission-order lines / 导入 `.waypoints` 文件，叠加编号航点、文件 Home 和任务顺序虚线。
- Hover/click waypoint markers or use the mission-item selector to inspect commands, coordinates, altitude frames, parameters and flags / 悬停、点击航点或使用任务项选择器查看命令、坐标、高度基准、参数和标记。
- Show/hide, clear, or fit the track and waypoints together. Flight time filtering keeps the complete mission visible and preserves flight-only statistics / 支持显示、隐藏、清除及同时适应轨迹与航点；时间筛选保留完整任务，统计仍仅计算飞行日志。
- Show a white nose-direction arrow and angle from actual `ATT.Yaw`, updated for the selected/hovered point and playback. A visibility toggle is enabled by default / 使用 `ATT.Yaw` 显示白色机头方向箭头及角度，随定位点、悬停与回放更新，默认开启并可关闭。
- Increase desktop track height from a fixed 470 px to a responsive 620–1,000 px. Adjust it manually between 400 and 1,400 px, remember the choice locally, or reset to automatic sizing / 桌面轨迹区从固定 470 像素改为自适应 620～1000 像素；可手动选择 400～1400 像素，记忆选择或恢复自动高度。
- Combine map and waypoint controls in one responsive row, with privacy information below / 合并在线地图与航点控件行，隐私说明置于下方，窄屏自动换行。
- Keep vector basemaps aligned at fractional canvas dimensions; visible waypoint overlays and heading arrows are included in track PNG exports / 修复小数画布尺寸下矢量底图的细小偏移，轨迹 PNG 包含可见航点及机头方向箭头。
- Include `examples/simulated-flight.waypoints` for use with the existing synthetic flight example / 新增可配合模拟飞行日志使用的模拟航点文件。

Existing features remain: Chinese/English UI, ArduPilot `.BIN`/JSON import, time selection and Ctrl-wheel zoom, mode-colored tracks, playback, configurable telemetry, six-curve parameter charts, PNG export, and optional Esri/OpenFreeMap basemaps.

保留中英文界面、ArduPilot `.BIN`/JSON 导入、时间框选及 Ctrl＋滚轮缩放、模式着色轨迹、回放、可选遥测字段、最多六条参数曲线、PNG 导出与可选 Esri/OpenFreeMap 底图。

## Usage / 使用说明

1. Download `flight-log-explorer-v0.6.zip` and extract the entire archive / 下载 ZIP 并完整解压。
2. Double-click `index.html` in Edge or Chrome; keep `vendor` and other bundled files together / 用 Edge 或 Chrome 双击 `index.html`，保留 `vendor` 及其他附带文件，无需安装或启动服务。
3. Open the built-in example, then import `examples/simulated-flight.waypoints` to try the overlay / 打开内置示例，再导入模拟航点文件体验叠加。
4. Import your flight log and corresponding `.waypoints` file. Click Fit track and waypoints to see both / 导入自己的飞行日志与对应航点文件，点击「适应轨迹与航点」查看完整叠加。
5. Adjust Display height or Show nose heading above the plot. Use the time slider or playback to inspect heading changes / 在图上方调整显示高度与机头朝向开关，拖动时间滑块或回放观察朝向变化。
6. Enable online maps only when desired; export the track PNG or scroll down to configure parameter charts / 按需开启在线地图，导出轨迹 PNG，或下滚配置参数图像。

`SHA256SUMS.txt` contains the ZIP's SHA-256 checksum. All included flight and mission examples are artificial; no real flight logs are distributed.

`SHA256SUMS.txt` 提供 ZIP 的 SHA-256 校验值。附带飞行与任务示例均为人工生成，不分发真实飞行日志。

## Limitations and privacy / 限制与隐私

- Valid flight-log GPS is required for the overlay. Supports one WPL 110 mission; `.plan`, geofence and rally files are unsupported / 叠加需要日志提供有效 GPS，支持单个 WPL 110 任务，不支持 `.plan`、围栏或集结点文件。
- Dashed lines illustrate mission order, not the predicted flight path. Loiter/spline/arc geometry, jumps, conditions and RTL are not simulated. Unsupported or unspecified positions remain available in item details / 虚线仅示意任务顺序，不模拟盘旋、样条、圆弧、跳转、条件或 RTL 的真实航线；不支持或未指定的位置仍可在详情查看。
- Mission altitude retains its recorded frame; it is not automatically converted to flight-log GPS altitude. A loaded mission is retained when changing logs; clear or replace it when changing missions / 任务高度保留原始基准，不自动转换为日志 GPS 海拔；更换日志会保留任务，请按需清除或替换。
- Heading uses the latest preceding ATT record within two seconds. Missing/stale yaw leaves the circular marker and an unavailable status; GPS course and desired yaw are not substituted / 朝向匹配最长两秒的前序 ATT 记录，缺失或过期时保留圆点并提示缺失，不以 GPS 航迹或目标航向替代。
- PX4 ULog and MAVLink tlog remain unsupported; large logs consume memory / 仍不支持 PX4 ULog 和 MAVLink tlog，大日志会占用较多内存。
- Logs and waypoints stay local. Maps are off by default; enabled map providers receive requests identifying the viewed area and can see your IP. OpenFreeMap requires WebGL and internet / 日志与航点在本机处理；底图默认关闭，开启后服务方可获知浏览区域及 IP。OpenFreeMap 需要 WebGL 和互联网。
- Project code: MIT. Bundled MapLibre GL JS: BSD-3-Clause, with notices included. Map data retains its own terms and attribution / 项目代码使用 MIT，MapLibre GL JS 使用 BSD-3-Clause 并附声明，地图数据遵循各自条款并保留署名。

See the [bilingual README](https://github.com/hualetong/flight-log-explorer/blob/v0.6/README.md) for full usage and data interpretation / 完整使用说明与数据口径见中英文 README。
