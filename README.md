# Flight Log Explorer / 飞行日志可视化工具

飞行轨迹工作台 v0.1：本地离线运行的 ArduPilot 飞行日志交互工具。

双击 `index.html`，在浏览器中点击「导入飞行日志」或将文件拖入页面。无需安装依赖、启动服务或联网，日志只在本机解析。

## 初版功能

- 直接导入 ArduPilot DataFlash `.BIN`，也支持本项目已有的 `*_parsed.json`（GPS、MODE、POS 等消息数组）。不支持 PX4 ULog 或 MAVLink tlog。
- 北向上、等比例东/北米制平面轨迹，按飞行模式着色，显示起终点。滚轮以光标为中心缩放，拖动平移，「适应轨迹」复位。
- 悬停显示轨迹最近记录点的模式、地速、GPS 海拔、相对起飞点高度、空速、经纬度、姿态、卫星和电压；点击轨迹定位时间。
- 时间滑块、1/5/10 倍回放、地速与相对高度曲线、PNG 导出。
- 日志概览显示有效 GPS 时间范围、轨迹累积距离和最大地速。包含地面滑行/静止记录，不自动识别起飞和着陆。

## 数据口径

读取 GPS.Status ≥ 3 的定位点；多个 GPS 时采用编号最小的有效实例，避免接收机之间交错。GPS 无效、失锁或间隔超过 3 秒时断开轨迹，断开段不计距离。完全没有有效 GPS 时提示无法生成轨迹，不猜测位置。

速度单位 m/s，高度单位 m。GPS.Alt 为海拔高度，POS.RelHomeAlt 为相对起飞点高度。没有相应字段时显示「—」。MODE 取采样时间之前最近的模式变更；其他消息取之前最近且不超过 2 秒的记录，避免使用未来数据或过期值。时间相对于第一个有效 GPS 点。

根据 MSG 中的 ArduPlane / ArduCopter / ArduRover 自动选择模式表；没有机型消息时保留模式编号，请用图上方的机型选项手动指定。模式表未覆盖的编号仍显示 MODE 编号。

俯视图采用以起点为原点的局部等距近似投影，适合场地飞行；长距离/跨纬度航线应扩展为地理地图投影。初版没有在线地图底图。曲线各自归一化，仅用于看趋势，精确值见定位点详情。

BIN 根据日志内的 FMT 定义解码，字段格式参考 [ArduPilot LogStructure.h](https://github.com/ArduPilot/ardupilot/blob/master/libraries/AP_Logger/LogStructure.h)。损坏/截断日志会尽可能读取完整记录并提示。

## 开发与验证

`log-parser.js`：DataFlash 解码与按时间关联。`app.js`：Canvas 交互与导入。`style.css`：界面。解析器通过内联 Web Worker 在后台运行，双击打开也无需读取网络资源。不支持 Web Worker 的旧浏览器回退至主线程。

在工具目录运行 `node test-parser.cjs`，检查无有效 GPS、失锁断线和消息过期。若相邻 `../10.1` 目录有原始测试日志，将同时用 log75、log76 与已解析 JSON 对照验证，并检查 log77。也可设置 `FLIGHT_LOG_DIR` 指定该目录。真实飞行日志不随仓库分发。文件名含 noGPS 的 log77 实际仍有 274 个有效 GPS 记录，按日志内容正常展示。

浏览器验证：安装开发依赖 `npm install --no-save playwright`，运行 `node check-ui.cjs`（默认使用 Chromium，需先执行 `npx playwright install chromium`）。Windows 已安装 Edge 时可设置 `BROWSER_CHANNEL=msedge`。默认验证模拟示例，可设置 `FLIGHT_LOG_DIR` 验证真实 BIN。工具运行本身不需要这些开发依赖。
