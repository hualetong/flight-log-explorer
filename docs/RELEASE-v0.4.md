# Flight Log Explorer v0.4 / 飞行日志可视化工具

Offline ArduPilot flight log exploration, with time selection and configurable parameter charts. The application interface is currently Chinese; documentation is bilingual.

离线 ArduPilot 飞行日志分析，支持时间范围筛选和自定义参数图像。当前工具界面为中文，说明文档为中英双语。

## Features / 主要功能

- ArduPilot DataFlash `.BIN` and parsed JSON import / 导入 ArduPilot DataFlash `.BIN` 与解析后的 JSON。
- Mode-colored north-up 2D track; hover, pan, zoom, and 1×/5×/10× playback / 按模式着色的俯视轨迹，支持悬停、平移、缩放与多倍速回放。
- Adjustable time selection; selected track and statistics, with full timeline curves visible / 时间轴框选与边界调整，轨迹和统计随范围筛选，未选范围曲线保持可见。
- Searchable telemetry selection for point details and tooltips / 搜索并选择定位点与悬停提示显示的信息。
- Up to six parameter curves, shared axes by unit or normalized trends, selected/full time ranges / 最多六条参数曲线叠加，支持单位分轴、归一化以及框选/完整时间范围。
- Track and parameter chart PNG export / 轨迹和参数图像 PNG 导出。
- MIT license, synthetic sample, screenshots and demonstration GIF / MIT 许可、模拟日志、截图与演示 GIF。

## Usage / 使用说明

1. Download `flight-log-explorer-v0.4.zip` from this release and extract the entire ZIP / 下载本 Release 的 ZIP 并完整解压。
2. Double-click `index.html`; no installation or server is required / 双击 `index.html`，无需安装或启动服务。
3. Try the built-in example or import `examples/simulated-flight.json`, then your ArduPilot log / 先体验内置示例或导入模拟 JSON，再导入 ArduPilot 日志。
4. Drag on the timeline to select a range, drag its edges to adjust, and double-click to select all / 在时间轴拖动框选、拖动边界调整，双击恢复全选。
5. Scroll down to configure chart parameters and export PNG / 向下滚动配置参数叠加并导出 PNG。

Logs are processed locally and are never uploaded. The sample contains only artificial coordinates and telemetry, without device identifiers or real flight data.

日志全程在本机处理，不会上传。模拟示例仅含人工坐标与遥测，不含设备标识或真实飞行数据。

## Known limitations / 已知限制

- Chinese application UI; bilingual README / 当前界面为中文，README 为中英双语。
- Supports ArduPilot DataFlash `.BIN` and the documented JSON layout. PX4 ULog (`.ulg`) and MAVLink `.tlog` are not supported / 支持 ArduPilot `.BIN` 与文档所述 JSON，不支持 PX4 ULog 和 MAVLink tlog。
- Valid GPS is required for the track and time range. No automatic takeoff/landing detection or background maps / 轨迹和时间范围依赖有效 GPS；不自动识别起降，不含底图。
- Auxiliary point data uses the latest preceding sample within two seconds. Missing/stale values remain missing; gaps over three seconds break lines / 定位点附加数据向前匹配最长两秒，缺失/过期值保持缺失，超过三秒的间隔断线。
- Parameter availability depends on the log. Unknown fields may lack units; decoded values require the firmware field definition / 参数取决于日志，未知字段可能没有单位，需要结合固件字段定义解读。
- Large logs consume memory and may take longer to parse; mobile charts can require horizontal scrolling / 大日志会占用较多内存和解析时间；移动端参数图可能需要横向滚动。

See [README](../README.md) for data interpretation and parser limitations. Feedback: https://github.com/hualetong/flight-log-explorer/issues

数据口径与解析限制详见 README，欢迎在 GitHub Issues 反馈。
