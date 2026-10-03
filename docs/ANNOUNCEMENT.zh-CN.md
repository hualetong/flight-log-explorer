# Flight Log Explorer：无需安装的 ArduPilot 飞行日志可视化工具

Flight Log Explorer 是一个基于浏览器的 ArduPilot 飞行日志分析工具，当前版本为 v0.4。

下载并完整解压发布包后，双击 `index.html`，即可在本地导入 `.BIN` 飞行日志，查看飞行轨迹、飞行模式、速度、高度及其他遥测参数，无需安装软件、配置环境或启动服务器。

目前支持：

- 按飞行模式着色的二维轨迹和多倍速回放
- 时间区间筛选与交互式数据查看，未选范围曲线保持可见
- 最多六条自定义参数曲线叠加，按单位分轴或归一化
- 轨迹与参数图像 PNG 导出
- 全程离线解析，日志不会上传

仓库提供不含真实位置与设备信息的模拟日志、功能截图和演示 GIF，采用 MIT 开源许可。当前工具界面为中文，README 为中英双语；支持 ArduPilot DataFlash `.BIN` 和指定结构 JSON，暂不支持 PX4 ULog 与 MAVLink tlog。

项目仍在开发中，欢迎 ArduPilot 用户试用、反馈问题或参与贡献。

[GitHub 仓库](https://github.com/hualetong/flight-log-explorer) · [下载 v0.4](https://github.com/hualetong/flight-log-explorer/releases/tag/v0.4)
