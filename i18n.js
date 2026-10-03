'use strict';
// UI translations retain the original Chinese text; imported telemetry is never rewritten.
const translations={
 '飞行日志 · 轨迹工作台':'Flight Log Explorer',
 '飞行轨迹工作台':'Flight Log Explorer','本地日志分析':'Local log analysis','＋ 导入飞行日志':'+ Import flight log',
 '当前日志':'Current log','等待导入':'Awaiting import','当前范围时长':'Selected duration','轨迹距离':'Track distance','最大地速':'Max ground speed','有效定位点':'Valid GPS points',
 '所有日志均在本机解析。支持 ArduPilot .BIN 和包含 GPS / MODE / POS 数组的 JSON。':'Logs are processed locally. Supports ArduPilot .BIN and JSON with GPS / MODE / POS arrays.',
 '平面俯视轨迹':'Top-down flight track','东 / 北 · 等比例米制坐标':'East / North · Equal scale in meters','飞行器类型':'Vehicle type','模式编号（机型未识别）':'Mode numbers (unknown vehicle)','固定翼 / QuadPlane':'Plane / QuadPlane','多旋翼':'Copter','无人车':'Rover',
 '显示信息':'Display information','适应轨迹':'Fit track','导出 PNG':'Export PNG',
 '飞行轨迹：滚轮缩放、拖动平移、悬停查看数据':'Flight track: scroll to zoom, drag to pan, hover for data',
 '让每一段飞行清晰可见':'Explore every part of your flight','拖入飞行日志，或点击右上角导入':'Drop a flight log here or use Import above','查看示例轨迹':'Explore demo','示例为模拟数据':'Demo uses synthetic data',
 '滚轮缩放 · 拖动平移 · 悬停查看 · 点击定位时间':'Scroll to zoom · Drag to pan · Hover for data · Click to select time',
 '▶ 回放':'▶ Play','Ⅱ 暂停':'Ⅱ Pause','轨迹时间':'Track time','回放倍速':'Playback speed',
 '时间范围选择：拖动竖线调整进度，靠近两侧边界调整范围，双击恢复全选':'Timeline: drag the playhead to seek, drag near either edge to adjust the range, double-click to select all',
 '默认全选 · 靠近两侧边界拖动调整范围':'All selected by default · Drag near either edge to adjust the range',
 '起始秒':'Start (s)','结束秒':'End (s)','恢复全选':'Select all','还原缩放':'Reset zoom','Ctrl＋滚轮缩放 · 鼠标位置为焦点 · 拖动竖线调整进度 · 边界调整范围 · 双击全选':'Ctrl + wheel to zoom at pointer · Drag playhead to seek · Edges adjust range · Double-click for all',
 '定位点详情':'Point details','等待数据':'Awaiting data','读图说明':'How to read the track',
 '轨迹颜色对应飞行模式。悬停优先选择最近的轨迹点；轨迹交叉时，可用时间滑块定位具体时刻。':'Track colors indicate flight modes. Hover selects the nearest point; use the time slider to distinguish crossing tracks.',
 '海拔来自 GPS，相对高度来自 POS.RelHomeAlt。附加消息按时间向前匹配，超过 2 秒显示缺失值。GPS 失锁或间隔超过 3 秒时断开连线。':'Altitude comes from GPS; relative height comes from POS.RelHomeAlt. Auxiliary values use the latest preceding sample within 2 seconds. Lines break on GPS fix loss or gaps over 3 seconds.',
 '生成参数图像':'Parameter charts','横轴为日志相对时间；选择纵轴参数，叠加对比飞行数据。':'Time is relative to the start of the track. Select and overlay parameters to compare flight data.',
 '数据范围':'Data range','当前框选范围':'Selected range','完整日志':'Full log','纵轴方式':'Y-axis scale','按单位分轴 · 实际值':'Axes by unit · Actual values','各曲线归一化 · 趋势对比':'Normalized · Compare trends','生成图像':'Generate chart','导出图像 PNG':'Export chart PNG','＋ 叠加参数':'+ Add parameter',
 '导入日志后，可生成参数图像。最多叠加 6 条曲线。':'Import a log to generate charts. Overlay up to 6 parameters.',
 '自定义参数随时间变化图像':'Custom parameter chart over time',
 '同单位曲线共用纵轴，不同单位分轴。附加参数保留原始采样频率；缺失值和超过 3 秒的采样间隔断线。移动端可横向滚动查看完整图像。':'Parameters with the same unit share an axis. Other units use separate axes. Auxiliary parameters retain their original sampling rate; missing values and gaps over 3 seconds break lines. Scroll horizontally on mobile.',
 '选择显示信息':'Choose display information','勾选项同步显示在悬停提示和定位点详情。':'Selected fields appear in tooltips and point details.','关闭显示信息选择':'Close display information','搜索名称或字段，如油门、VIBE、GPS.VZ':'Search names or fields, e.g. throttle, VIBE, GPS.VZ','搜索显示信息':'Search display information','恢复默认':'Restore defaults','全部取消':'Clear all',
 '默认项无需导入即可选择；更多字段在导入后出现。附加值按时间向前匹配（最长 2 秒），MODE 使用最近变更。原始字段按日志格式解码，未注明单位的值请结合字段定义解读。':'Default fields are available before import; additional fields appear after import. Auxiliary values use the latest preceding sample within 2 seconds; MODE uses the last change. Raw fields follow the log format; consult field definitions when units are unspecified.',
 '离线可用 · 日志不会上传':'Works offline · Logs are never uploaded',
 '飞行模式':'Flight mode','日志时间':'Log time','轨迹相对时间':'Track elapsed time','地速':'Ground speed','空速':'Airspeed','GPS 海拔':'GPS altitude','相对起飞点高度':'Height above home','纬度':'Latitude','经度':'Longitude','横滚 / 俯仰':'Roll / Pitch','卫星数 / HDOP':'Satellites / HDOP','电池电压':'Battery voltage',
 '卫星数':'Satellites','颗':'satellites','估算海拔':'Estimated altitude','相对原点高度':'Height above origin','横滚':'Roll','俯仰':'Pitch','导航目标横滚':'Navigation target roll','导航目标俯仰':'Navigation target pitch','控制横滚':'Control roll','控制俯仰':'Control pitch','估算空速':'Estimated airspeed','航迹方向':'Course over ground','GPS 垂直速度':'GPS vertical speed','GPS 定位状态':'GPS fix status','GPS 航向':'GPS heading','航向':'Heading','目标横滚':'Desired roll','目标俯仰':'Desired pitch','目标航向':'Desired heading',
 '油门输出':'Throttle output','油门需求':'Throttle demand','方向舵输出':'Rudder output','空速估算类型':'Airspeed estimate type','电流':'Current','累计耗电量':'Consumed capacity','累计耗能':'Consumed energy','剩余电量':'Remaining charge','电池温度':'Battery temperature',
 'X 轴振动':'X vibration','Y 轴振动':'Y vibration','Z 轴振动':'Z vibration','加速度计削顶计数':'Accelerometer clipping count','距目标点距离':'Distance to target','横向偏差':'Cross-track error','高度误差':'Altitude error','空速误差':'Airspeed error','目标空速':'Target airspeed','航点目标高度':'Waypoint target altitude','TECS 目标高度':'TECS target altitude','TECS 高度':'TECS altitude','TECS 空速':'TECS airspeed','TECS 目标空速':'TECS target airspeed','TECS 爬升率':'TECS climb rate',
 '解锁状态':'Armed state','飞行状态':'Flying state','飞行阶段':'Flight stage','坠机状态':'Crash state','模式切换原因':'Mode change reason','最近文字消息':'Latest message','估算迎角':'Estimated angle of attack','估算侧滑角':'Estimated sideslip angle','气压高度':'Barometric altitude','气压计温度':'Barometer temperature','地形高度':'Terrain height','估算离地高度':'Estimated height above ground','GPS 水平精度':'GPS horizontal accuracy','GPS 垂直精度':'GPS vertical accuracy','GPS 速度精度':'GPS speed accuracy',
 '未知模式':'Unknown mode','悬停位置':'Hovered point','定位点 ':'Point ','未选择显示信息，请点击「显示信息」勾选。':'No fields selected. Use Display information to choose fields.','默认信息':'Default fields','没有匹配字段。':'No matching fields.','已选 ':'Selected ',' 项':' fields',
 '区间起点':'Range start','区间终点':'Range end','起点':'Start','终点':'End','全选':'All selected','当前范围':'Selected range',' 点':' points',
 '正在解析 ':'Parsing ','请导入 .BIN 或 .JSON 文件。':'Please import a .BIN or .JSON file.','日志解析失败。':'Log parsing failed.','已读取 ':'Loaded ',' 个有效定位点 · GPS 实例 ':' valid GPS points · GPS instance ','机型未识别，请选择机型以显示模式名称':'Unknown vehicle; select a vehicle type to display mode names','已自动识别机型':'Vehicle type detected','导入失败：':'Import failed: ','当前保留上一次成功导入的轨迹。':'The previous successful track is retained.',
 '提示':'Hint','未选择显示信息':'No fields selected','北向上 · 东/北米制坐标 · 范围 ':'North up · East/North in meters · Range ',
 '模拟示例 · 非真实飞行日志':'Synthetic demo · Not a real flight log','当前为模拟示例。导入真实日志后将替换此轨迹。':'This is a synthetic demo. Import a flight log to replace this track.',
 '常用参数':'Common parameters','原始值':'Raw value','纵轴参数 ':'Y-axis parameter ','移除参数 ':'Remove parameter ','移除':'Remove','无量纲':'Dimensionless','归一化 %':'Normalized %',' 条曲线有数据':' series with data','；缺失参数已在图例标注':'; missing parameters are marked in the legend','请添加至少一个纵轴参数。':'Add at least one Y-axis parameter.','此范围无数据':'No data in this range','飞行参数 · 时间曲线':'Flight parameters over time','导入日志后生成图像':'Import a log to generate a chart','相对时间 (s)':'Elapsed time (s)',
 '无法识别 ArduPilot DataFlash BIN 日志（缺少 FMT 格式定义）。':'Unrecognized ArduPilot DataFlash BIN log (missing FMT definitions).','日志末尾不完整，已读取完整记录。':'The end of the log is incomplete; complete records were read.','JSON 必须包含 GPS、MODE、POS 等消息数组。':'JSON must contain message arrays such as GPS, MODE and POS.','日志中没有有效 GPS 定位点（需要 Status ≥ 3）。无法生成地理轨迹；请检查 GPS 是否连接并获得定位。':'No valid GPS points (Status must be ≥ 3). Cannot generate a geographic track; check GPS connection and fix.',' 字节未识别，日志可能含填充或损坏。':' unrecognized bytes; the log may contain padding or corruption.','有 ':'There are ','未知':'Unknown'
};
let language='zh-CN';
try{if(localStorage.getItem('flight-log-explorer.language')==='en')language='en';}catch{}
const translationPattern=new RegExp(Object.keys(translations).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function t(text){return language==='en'?String(text).replace(translationPattern,key=>translations[key]):String(text);}
const localizedContexts=new WeakMap();
function localizedContext(context){
 if(localizedContexts.has(context))return localizedContexts.get(context);
 const proxy=new Proxy(context,{get(target,key){const value=target[key];if(typeof value!=='function')return value;if(['fillText','strokeText','measureText'].includes(key))return (text,...args)=>value.call(target,t(text),...args);return value.bind(target);},set(target,key,value){target[key]=value;return true;}});
 localizedContexts.set(context,proxy);return proxy;
}
const uiSources=new WeakMap(),attributeSources=new WeakMap();
function translateUI(){
 const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(node.parentElement.closest('script,style,#details strong,#tip,[data-no-translate]'))continue;
  if(node.parentElement.closest('#filename')&&!['等待导入','Awaiting import','模拟示例 · 非真实飞行日志','Synthetic demo · Not a real flight log'].includes(node.data))continue;
  const previous=uiSources.get(node),source=previous&&node.data===previous.output?previous.source:node.data,output=t(source);
  uiSources.set(node,{source,output});if(node.data!==output)node.data=output;
 }
 for(const element of document.querySelectorAll('[aria-label],[placeholder],optgroup[label]')){
  const sources=attributeSources.get(element)||{};
  for(const key of ['aria-label','placeholder',...(element.tagName==='OPTGROUP'?['label']:[])]){
   if(!element.hasAttribute(key))continue;
   const current=element.getAttribute(key),previous=sources[key],source=previous&&current===previous.output?previous.source:current,output=t(source);
   sources[key]={source,output};if(current!==output)element.setAttribute(key,output);
  }
  attributeSources.set(element,sources);
 }
 document.documentElement.lang=language;
}
function initializeLanguage(){
 const selector=document.getElementById('language');selector.value=language;
 selector.onchange=()=>{
  language=selector.value;try{localStorage.setItem('flight-log-explorer.language',language);}catch{}
  document.getElementById('tip').hidden=true;
  renderFieldOptions();if(log){details(selected);draw();renderChartControls();generateChart();}else drawParameterChart();
  translateUI();
 };
 translateUI();
 const observer=new MutationObserver(translateUI);
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','label']});
}
document.addEventListener('DOMContentLoaded',initializeLanguage);
