window.PORTFOLIO = {
  projects: [
    {id:'gy411',title:'复古提灯夜灯',subtitle:'深色提灯轮廓、暖光与成套内容表达',category:'形态与空间',code:'A-GY41102DBR3US',cover:'gy411-01.webp',hero:'gy411-hero.webp',layout:'wide',intro:'以提灯轮廓建立识别，用调光、日夜状态、尺寸与生活场景分工解释产品。展示套图模板如何适配造型，而非只替换素材。',focus:['造型识别','功能与尺寸','套图模板'],images:['gy411-01.webp','gy411-02.webp','gy411-03.webp','gy411-04.webp','gy411-05.webp','gy411-06.webp','gy411-07.webp','gy411-08.webp']},
    {id:'gy234',title:'弯臂球罩夜灯',subtitle:'金色外观、球形灯罩与居家光感',category:'材质与光',code:'C-GY23402GTUS',cover:'gy234-01.webp',hero:'gy234-hero.webp',layout:'narrow',intro:'以弯臂与球罩形成视觉重点，单品、功能和场景分别承担阅读任务。保持产品轮廓、光感与整套信息层级一致。',focus:['轮廓与光感','信息分工','生活场景'],images:['gy234-01.webp','gy234-02.webp','gy234-03.webp','gy234-04.webp','gy234-05.webp','gy234-06.webp','gy234-07.webp','gy234-08.webp']},
    {id:'gy216',title:'条形光感夜灯',subtitle:'条形灯体、不同方向与场景适配',category:'形态与空间',code:'A-GY21602US',cover:'gy216-02.webp',hero:'gy216-hero.webp',layout:'full',intro:'围绕条形灯体的轮廓和方向安排展示，将状态、尺寸与使用情境分开说明。让统一内容结构保留产品差异。',focus:['条形轮廓','使用说明','场景适配'],images:['gy216-01.webp','gy216-02.webp','gy216-03.webp','gy216-04.webp','gy216-05.webp','gy216-06.webp','gy216-07.webp']}
  ],
  tools:[
    {id:'aplus',title:'A+ 自动化工作台',tag:'视觉生产',subtitle:'把常规 A+ 变成自动交付流程。',purpose:'普通 A+ 自动生成与归档',image:'aplus.webp',description:'把新品监控、图片抓取、生成、尺寸裁剪和归档串起来。正常流程无需逐套人工操作，并开放给运营自助补跑。',contribution:'识别重复制作环节，定义任务与归档流程，结合 AI 辅助开发实现并维护。',result:'普通 A+ 自动化累计交付 500 余套，运营可自助补跑。',boundary:'界面中的单次任务状态与累计交付分别统计；网络异常和上游网站变化仍需人工维护。'},
    {id:'scene',title:'场景图出图工作台',tag:'视觉生产',subtitle:'为主副图和 A+ 准备场景素材。',purpose:'批量组织产品与场景出图',image:'scene.webp',description:'按产品、场景模板和发光方向组织素材与生成任务，支持批量处理、结果预览、失败处理及归档。',contribution:'定义模板、素材匹配与发光方向规则，结合 AI 辅助实现工作流。',result:'将重复素材选择和提示词组织沉淀为可复用操作。',boundary:'界面用于说明生产方式；成图仍需核对产品结构、光效和文字，不以界面状态替代质量验收。'},
    {id:'keyshot',title:'KeyShot 渲染工作区',tag:'视觉生产',subtitle:'为后续制作准备产品渲染素材。',purpose:'SKU 渲染任务与素材准备',image:'keyshot.webp',description:'把 SKU、渲染预设、任务与节点组织在同一工作区，为主副图和场景图生产准备产品素材。',contribution:'组织 SKU、渲染预设与任务步骤，使上游素材衔接后续视觉制作。',result:'这是场景图工作台中的渲染模块，不另算一套独立工具。',boundary:'这是场景图工作台中的渲染模块，非另一套独立产品；界面保留既有状态，内部路径已隐藏。'},
    {id:'collector',title:'Amazon 3V 数据采集',tag:'产品研究',subtitle:'为选品与研究获取结构化资料。',purpose:'市场、搜索、评论资料采集',image:'collector.webp',description:'围绕市场、搜索与用户评论组织采集及结构化导出，保留异常和采样边界，为产品研究准备资料。',contribution:'拆解研究输入需求，组织采集范围、异常记录和结构化交付。',result:'产品部陆续使用的工具之一。',boundary:'结果受网站访问条件、页面变化与样本覆盖影响；采样资料不等同于全量数据。'},
    {id:'attributes',title:'ASIN 属性打标',tag:'产品研究',subtitle:'让商品资料形成可审核的属性。',purpose:'图文属性结构化与审核',image:'attributes.webp',description:'组织商品资料、标签体系、批量打标与人工审核，帮助产品研究把零散信息转为结构化属性。',contribution:'定义标签与人工审核流程，推进图文资料的结构化处理。',result:'与图片人物／素材打标分别服务商品研究和素材整理。',boundary:'内置 demo 用于展示操作与审核结构，不代表正式打标成果，也不披露内部研究资料。'},
    {id:'report',title:'品类 3V 趋势报告',tag:'产品研究',subtitle:'把原始资料组织成可追溯的研究报告。',purpose:'资料核验与品类研究报告',image:'report.webp',description:'接收市场、关键词和评论资料，组织事实核验、研究与报告，保留证据和来源关系，支持后续产品讨论。',contribution:'组织事实核验、证据和写作交付的衔接，结合 AI 辅助开发推进工作台。',result:'采集、打标与报告工作台已陆续被产品部复用。',boundary:'报告保留证据与版本供人工复核，结论受资料覆盖范围影响。'}
  ],
  moreTools:[
    {title:'多店铺视觉模板库与套图 SOP',tag:'模板与技术培训',text:'面向 LOHAS、DORESSHOT 等夜灯店铺建设视觉模板与素材库，梳理套图 SOP，并通过技术培训下放到各组员复用执行；将模板、流程和 AI 应用连接到全流程交付。'},
    {title:'团队工具库与部门工作台',tag:'平台与协作',text:'基于 Hana / OpenHanako 的现有能力增量定制，组织统一工具入口、部门空间、项目资料和成果版本。'},
    {title:'设计需求总控',tag:'平台与协作',text:'将派单、接单、改期、交付、返修及验收组织为明确流程，关联负责人、状态与通知。'},
    {title:'商品图对比评审',tag:'平台与协作',text:'在商品页语境中比较图组，保留团队反馈、发布快照与具体版本；不等同消费者转化 A/B 实验。'},
    {title:'图片人物／素材打标',tag:'素材整理',text:'本地图片识别、属性标签、增量扫描及异常记录。与 ASIN 商品属性打标是两项不同实践。'},
    {title:'规格书套图生成',tag:'视觉生产',text:'以确认的产品图和报告为输入，组织页面规划、逐页反馈、局部修订及最新版本回传。'},
    {title:'SKU 德语图片本地化',tag:'本地化',text:'图片文字识别、翻译编辑、固定标记保护和 SKU 归档；图像与产品参数仍需复核。'},
    {title:'Amazon Listing 文案',tag:'内容生产',text:'组织产品事实与关键词输入，生成标题、五点等内容，并进行覆盖、长度和局部修订检查。'}
  ]
};

window.PORTFOLIO.featured = {
 id:'gy411',
 task:'让主副图分别解释产品造型、操作、日夜表现、尺寸和使用情境，并把这套内容分工沉淀为能够复用的套图结构。',
 role:'负责多店铺视觉全案、模板库和套图 SOP，通过技术培训让组员复用执行，并承担方案审核与最终验收。以下以本组素材说明内容组织方法。',
 decisions:[
  {title:'模板统一任务，不抹去差异',text:'明确主图、功能图、尺寸图、场景图的职责，再按不同店铺风格和产品特征适配，避免只有换图、没有产品理解的机械套版。'},
  {title:'把个人方法变成团队 SOP',text:'把素材准备、模板选择、制作步骤和审核要求写进套图 SOP；通过技术培训下放到各组员执行，减少对个人经验和逐次指导的依赖。'},
  {title:'让生产步骤可以交接',text:'模板承载表达规则，组员按流程制作与反馈，工作台承接生成和整理；检查产品、文字与整套内容后再交付。'}
 ],
 evidence:'完整图组覆盖产品展示、功能、尺寸和生活情境；流程与工具部分另行展示模板复用和团队交付方法。',
 note:'本例用于说明跨店铺的套图方法，不据图片推导单 SKU 的交付周期或转化效果；团队总成果不计入本案例。',
 captions:{
  'gy411-01.webp':'产品主视觉：交代提灯造型、深色轮廓和暖光表现。',
  'gy411-02.webp':'组合展示：在成组画面中保持产品识别与光感。',
  'gy411-03.webp':'操作与调光：结合控件和亮度说明解释使用。',
  'gy411-04.webp':'日夜状态：用同一空间的不同光线说明产品表现。',
  'gy411-05.webp':'尺寸与插座关系：为判断灯体尺度和安装空间提供信息。',
  'gy411-06.webp':'床边情境：在人物与生活尺度中呈现夜间氛围。',
  'gy411-07.webp':'多场景组合：用不同空间解释使用情境。',
  'gy411-08.webp':'场景延伸：在更多空间中保持产品与光感一致。'
 }
};

window.PORTFOLIO.toolDetails = {
 aplus:[
  {image:'aplus-focus-1.webp',title:'输入与店铺规则',text:'指定产品目录，按店铺组织提示词。把每次人工重复填写的前置条件整理为固定入口。'},
  {image:'aplus-focus-2.webp',title:'任务编排',text:'两轮生成与成品处理在同一任务链中呈现，支持加入队列、暂停和继续。'},
  {image:'aplus-focus-3.webp',title:'成品状态与记录',text:'查看成品处理进度、输出入口和日志。图中状态来自历史任务，不是本次重新生成。'}
 ],
 scene:[
  {image:'scene-focus-1.webp',title:'把视觉变量显式化',text:'模板、发光方向、SKU 和批量设置分开组织，让场景生产有明确输入。'},
  {image:'scene-focus-2.webp',title:'集中观察执行状态',text:'组合数量、预计输出、进度与日志放在同一位置，方便检查任务而非逐个追图。'}
 ],
 keyshot:[
  {image:'keyshot-focus-1.webp',title:'组织 SKU 与渲染输入',text:'目录扫描、场景与相机条件进入同一操作区，连接批量素材准备。'},
  {image:'keyshot-focus-2.webp',title:'查看渲染状态',text:'显示软件就绪情况、预设与任务进度。此处是工作台的渲染模块，未在本次启动任务。'}
 ],
 collector:[
  {image:'collector-focus-1.webp',title:'明确采集范围',text:'ASIN、关键词及 VOM／VOS／VOC 范围独立配置，减少采集前的重复整理。'},
  {image:'collector-focus-2.webp',title:'分类预览资料',text:'商品、搜索、评论与跳过记录分区展示，后续研究可按资料角色接收输入。'}
 ],
 attributes:[
  {image:'attributes-focus-1.webp',title:'导入、确认与处理分层',text:'资料、标签确认和正式打标分成不同步骤，避免未经确认的标签直接成为结果。'},
  {image:'attributes-focus-2.webp',title:'回到商品与证据',text:'在商品列表和详情之间核对内容。此处为内置 demo 商品，不代表真实标注完成量。'}
 ],
 report:[
  {image:'report-focus-1.webp',title:'统一四类资料入口',text:'市场、主要词、精准词与评论进入同一输入环节，供后续事实核验和研究使用。'},
  {image:'report-focus-2.webp',title:'让检查过程可见',text:'生成入口与检查记录分开呈现。截图处于等待上传状态，不冒充已生成报告。'}
 ]
};
