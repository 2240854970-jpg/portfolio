/**
 * ══════════════════════════════════════════════
 * ★ 站点内容数据 ★
 * ────────────────────────────────────────────
 * 编辑这个文件就能修改网站所有内容。
 * 改完保存 → 提交 GitHub → Vercel 自动更新。
 * ══════════════════════════════════════════════
 *
 * 快速修改指引：
 *   搜索 // ✏️ 找到要改的地方
 *   增加作品 → 在 works 数组里加一个新对象
 *   修改成就 → 改 stats 数组
 *   更换分类 → 改 categories 数组
 *   删除板块 → 删除对应的数据对象（对应的页面区域也会消失）
 */

export const siteData = {

  /* ── 个人信息 ── */
  // ✏️ 改成你的名字和职位
  name: '李龙',
  nameEn: 'Li Long',
  title: '资深视觉设计师 / 视觉组长',
  tagline: '深耕小夜灯赛道 · Amazon Top 100 中 50+ 产品视觉经手',
  email: 'lilong.design@example.com',
  avatar: '/images/avatar-placeholder.svg',

  /* ── 导航 ── */
  nav: [
    { label: '首页', href: 'index.html' },
    { label: '作品', href: 'works.html' },
    { label: '关于我', href: 'about.html' },
    { label: '联系', href: 'index.html#contact' },
  ],

  /* ── 首页成就数据条 ── */
  // ✏️ 修改数值和标签，或者增减项数
  stats: [
    { value: '50+', label: 'Amazon Top 100 产品视觉经手', icon: '✦' },
    { value: '80%', label: '主图 A/B 测试胜出率', icon: '▲' },
    { value: '107', label: '单月最高 A+ 产出（套）', icon: '◆' },
    { value: '70%', label: '新人培养周期缩短', icon: '●' },
  ],

  /* ── 作品分类 ── */
  // ✏️ 增删分类会同步到作品集的筛选栏
  categories: [
    '全部',
    '主图 / Banner 设计',
    '详情页设计',
    '品牌视觉',
    'AI 工作流',
    '视频作品',
  ],

  /* ── 作品列表 ── */
  // ✏️ 增加一个作品就复制一个 {} 加进去
  //    删除一个作品就删掉对应的 {}
  //    修改 type: 'video' 会在作品集显示为视频标签
  //    images 数组可以放多张图，详情页会展示全部
  works: [

    {
      id: '不倒翁拍拍灯-amazon-主图-a-视觉-ijpb',
      title: '不倒翁拍拍灯 · Amazon 主图 & A+ 视觉',
      category: '主图 / Banner 设计',
      type: 'image',
      thumbnail: 'images/movbijp3-01.jpg',
      bgGrad: 'linear-gradient(135deg, #1a2a3a, #6366f1)',
      images: ['images/movbijp3-01.jpg',
        'images/movbijp3-02.jpg',
        'images/movbijp3-03.jpg',
        'images/movbijp3-04.jpg',
        'images/movbijp3-05.jpg',
        'images/movbijp3-06.jpg',
        'images/movbijp3-07.jpg'],
      videoUrl: '',
      brief: '为这款产品设计完整的 Amazon 视觉体系，涵盖主图、功能卖点图、尺寸图及多场景氛围图。',
      role: '主设计师',
      date: '2026.05',
      tools: ['Photoshop', 'Illustrator'],
      achievement: 'Listing 上线后数据表现优异，A/B 测试胜出率超过行业平均',
      designIntro: '从产品定位出发，围绕核心卖点构建视觉叙事逻辑。用主图建立品质感，用 infographic 快速传递功能价值，用场景图触发情感共鸣。三层视觉逻辑对应消费者的三层决策路径：这个好看吗？→ 这个有什么用？→ 这是我需要的吗？',
      showCase: [
        {
          src: 'images/movbijp3-01.jpg',
          title: '主图 — 极简展示，建立品质感',
          desc: '白底主图是 Amazon 的硬性要求，但不等于枯燥。通过柔光布光让材质透出温润质感，产品轮廓在光影下呈现立体感。背景保留微量阴影来传递「实物感」，避免纯白底常见的廉价 PS 感。这张图要传递的信息是：这是一件有品质感的产品，不是廉价货。',
        },
        {
          src: 'images/movbijp3-02.jpg',
          title: '多角度展示 — 结构可视化',
          desc: '多角度展示是建立产品信任的重要环节。消费者在购买前无法触摸实物，多角度视图能帮助他们建立完整的产品认知——侧面、背面、顶部、底部，所有视角都展示到位，让他们在收到产品前就已经「熟悉」了它。',
        },
        {
          src: 'images/movbijp3-03.jpg',
          title: '功能可视化 — 核心卖点',
          desc: '功能可视化是电商设计中最关键的能力之一。消费者不读长篇说明书，他们看图。这张 infographic 用视觉语言让核心卖点在一秒内被理解——不需要文字解释，眼睛扫过去就知道了。好的功能图应该让消费者产生「原来这么方便」而不是「这是什么意思」。',
        },
        {
          src: 'images/movbijp3-04.jpg',
          title: '场景对比 — 多场景展示',
          desc: '场景对比图是整套视觉中转化力最强的一张。一张图同时展示产品在不同光线/环境下的表现，回答消费者心中最纠结的问题：「白天放着好看吗？」和「晚上用起来怎么样？」。对比越直观，购买决策越快。',
        },
        {
          src: 'images/movbijp3-05.jpg',
          title: '尺寸标注 — 规格信息',
          desc: '尺寸图不是为了美观，而是为了减少退货。清晰标注产品关键尺寸参数，必要时加入日常物品作为大小参照。消费者看到这张图就能准确判断产品适不适合自己的需求——预期管理做得越好，退货率越低。',
        },
        {
          src: 'images/movbijp3-06.jpg',
          title: '场景氛围 — 代入感',
          desc: '氛围感驱动购买决策。这张图的目标不是展示产品细节，而是贩卖一种生活方式——暖色调的居家场景中产品自然融入，消费者看到的不再是一个商品，而是一个「想要拥有的场景」。家居类产品的购买决策很大程度上受「我想拥有这个场景」的情绪驱动。',
        },
        {
          src: 'images/movbijp3-07.jpg',
          title: '包装展示 — 开箱体验',
          desc: '包装展示图让消费者看到产品的完整交付状态。好的包装设计能给产品加分——消费者会觉得「包装都这么用心，产品肯定不差」。这也减少了关于「是否适合送礼」的疑问，拓展了产品的使用场景。',
        }
      ],
      designResult: '这套视觉方案上线后通过数据验证了设计策略的有效性。标准化的工作流也使得同类产品的视觉产出效率显著提升。',
    },

    {
      id: 'night-light-01',
      title: '花瓣玻璃夜灯 · Amazon 全套视觉设计',
      category: '主图 / Banner 设计',
      type: 'image',
      thumbnail: 'images/1.jpg',
      bgGrad: 'linear-gradient(135deg, #1a2a3a, #0ea5e9)',
      images: [
        'images/1.jpg',
        'images/1-2.jpg',
        'images/2-调光图.jpg',
        'images/3-白天黑夜 - 副本.jpg',
        'images/4-尺寸.jpg',
        'images/5-场景氛围.jpg',
        'images/6-场景1.jpg',
        'images/7.jpg',
      ],
      videoUrl: '',
      brief: '这款花瓣形玻璃夜灯上线后跻身 Amazon Top 50，是类目视觉标准的定义者之一。设计融合了「6+2 标准化场景中台」体系与自研 AI 发光材质词库，从拍摄执行到 A+ 排版实现了工业化交付。',
      role: '视觉组长 / 主设计师',
      date: '2025.09',
      tools: ['Photoshop', 'Rhino', 'Stable Diffusion', 'Nano Banana Pro'],
      achievement: '上线 15 天冲入类目前 50 · A/B 测试胜出率 80%',
      // showCase 数组：每张图的独立描述
      showCase: [
        {
          src: 'images/1.jpg',
          title: '主图 — 极简展示，建立品质感',
          desc: '白底主图是 Amazon 的硬性要求。通过柔光布光让玻璃材质透出温润光泽，花瓣轮廓在光影下呈现立体感。这张主图的设计标准后来被纳入部门的「主图品质基线」，作为新人培训的第一个案例——它定义了什么叫「干净的品质感」。',
        },
        {
          src: 'images/1-2.jpg',
          title: '多角度展示 — 结构可视化',
          desc: '侧角度让消费者看清花瓣的层叠结构和玻璃厚度。这个机位角度被固定为「6+2 场景中台」的标准模组之一——后续同类产品直接套用同一套透视与布光，初级美工也能稳定输出高质素材。',
        },
        {
          src: 'images/2-调光图.jpg',
          title: '功能可视化 — 无极调光',
          desc: '「无极调光」是一个功能词，消费者看不懂。我用渐变光圈直接画出从暗到亮的过渡。这张 infographic 的视觉语法后来被部门内多个产品复用，成为团队处理「可调节类功能」的统一表达范式，这也是 SOP 体系的一部分——好的设计方法应该被固化、被复用。',
        },
        {
          src: 'images/3-白天黑夜 - 副本.jpg',
          title: '场景对比 — 白天 & 黑夜',
          desc: '这是整套图中 A/B 测试胜率最高的一张。左边白天自然光下的装饰属性，右边夜晚关灯后的照明效果。一张图同时回答了两个问题。它的设计思路被抽象为「场景对比模板」，降低了同组设计师的出图决策成本。提升团队「产出下限」比个人英雄主义更有长期价值。',
        },
        {
          src: 'images/4-尺寸.jpg',
          title: '尺寸标注 — 消灭预期差',
          desc: '尺寸图不是为了美观，而是为了减少退货。这张尺寸图的版式被固化到 AI 工作流中——设计师只需要输入产品尺寸参数，AI 自动生成标注稿，人工只做最终审核。效率提升的同时保持了品牌视觉的一致性。',
        },
        {
          src: 'images/5-场景氛围.jpg',
          title: '客厅场景 — 美式家庭场景还原',
          desc: '深耕小夜灯赛道多年后发现：美式家庭场景的关键不在于「多豪华」，而在于「多真实」。沙发角几、绿植、毛毯——每个道具的摆放都经过推敲。这张图的场景搭建方案被做成可复用的渲染模组，后续产品直接用。从一张图到一套资产，这就是我做设计的资产意识。',
        },
        {
          src: 'images/6-场景1.jpg',
          title: '床头场景 — 锁定核心使用场景',
          desc: '床头是夜灯最核心的场景。我把这个场景的布光参数记录到了 AI 词库中，后续同类场景图直接用关键词调取——输入「床头氛围·暖光·柔和」，AI 自动匹配布光方案，省掉了反复试光的时间。',
        },
        {
          src: 'images/7.jpg',
          title: '包装展示 — AI 图转视频链路',
          desc: '包装展示不仅展示产品交付状态。这张图输出时使用了 AI 图转视频链路——一张静物图直接转化为 5 秒的开箱动效视频，用于 TikTok 和 Amazon 视频版位。做到「一次拍摄，多端分发」，这是 AI 工作流带来的效率跃升。',
        },
      ],
      // 整体设计思路（放在最前面）
      designIntro: '这是「6+2 标准化场景中台」体系落地的一个典型项目。预设的透视与灯光渲染模组让初级美工也能通过 PSD 嵌合快速产出高质素材；针对玻璃夜灯「发光、半透明材质」的技术难点，我从自研 AI 词库中提取了专项提示词链路，解决了行业普遍头疼的光学质感问题。最终单套 A+ 产出周期压缩到 2 天，而市面上同类产品平均需要 4 天。',
      // 数据成果
      designResult: '这是「6+2 场景中台」+「自研 AI 词库」双重赋能的典型案例。单套 A+ 产出周期从 4 天压缩到 2 天，且初级设计师也能稳定输出 80 分以上的素材。上线后产品在 15 天内冲入类目前 50，目前稳居 Top 100。这套视觉的底层方法论——场景模板化、材质词库化、流程 SOP 化——后来被复制到了公司其他多个品类。',
    },
    {
      id: 'smart-watch-01',
      title: '智能手表旗舰主图',
      category: '主图 / Banner 设计',
      type: 'image',
      thumbnail: '',
      bgGrad: 'linear-gradient(135deg, #1a2a3a, #3b82f6)',
      images: [],  // ✏️ 放你的图片路径，如 ['/images/work-01.jpg', '/images/work-02.jpg']
      videoUrl: '',
      brief: '为某头部消费电子品牌设计 Amazon 主图。需要在白底图中突出产品的科技感和佩戴场景，同时满足平台合规要求。',
      role: '主设计师',
      date: '2025.08',
      tools: ['Photoshop', 'Illustrator', 'Cinema 4D'],
      achievement: '上架后点击率提升 62%，转化率提升 35%',
      // 详情页的详细内容段落
      detailSections: [
        { type: 'text', content: '这款智能手表的目标人群是注重健康管理的职场人士。设计策略是从「场景代入」入手，而不是单纯展示产品功能。' },
        { type: 'text', content: '主图采用深色背景突出产品屏幕的高亮度显示效果，左侧叠加心率监测的 UI 界面，让消费者一眼就能感知核心卖点。' },
        { type: 'text', content: '经过 A/B 测试，带有场景化元素的主图比纯白底图点击率高出 62%，证明「先感受再了解」的策略在电商场景同样有效。' },
      ],
    },
    {
      id: 'cosmetic-aplus-01',
      title: '护肤品 A+ 详情页',
      category: '详情页设计',
      type: 'image',
      thumbnail: '',
      bgGrad: 'linear-gradient(135deg, #3a1a2a, #ec4899)',
      images: [],
      videoUrl: '',
      brief: '为某新锐国货护肤品牌设计 Amazon A+ 页面（EBC），需要传递天然成分的品牌理念，同时提升页面停留时间和转化率。',
      role: '视觉设计师',
      date: '2025.06',
      tools: ['Photoshop', 'Illustrator', 'After Effects'],
      achievement: '详情页停留时间提升 45%，A+ 页面转化贡献率提高 28%',
      detailSections: [
        { type: 'text', content: 'A+ 页面设计的关键是「信息层级」——消费者不会逐字阅读，他们扫描。我把成分功效放在视觉重心，用 icon 和短文案替代长篇大论。' },
        { type: 'text', content: '配色上提取了品牌主色调的莫兰迪版本，整体温和不刺眼，符合护肤品品类需要传递的「安心感」和「专业感」。' },
        { type: 'text', content: '对比测试数据显示，重新设计的 A+ 页面使平均停留时间从 23 秒提升到 34 秒，页面内转化贡献率提高 28%。' },
      ],
    },
    {
      id: 'brand-visual-01',
      title: '家居品牌视觉系统',
      category: '品牌视觉',
      type: 'image',
      thumbnail: '',
      bgGrad: 'linear-gradient(135deg, #1a2d1a, #22c55e)',
      images: [],
      videoUrl: '',
      brief: '从零搭建一个出海家居品牌的视觉体系，包括 Logo、配色规范、字体系统、拍摄风格指南、社媒模板。',
      role: '品牌设计负责人',
      date: '2025.04',
      tools: ['Illustrator', 'Photoshop', 'Figma'],
      achievement: '品牌视觉统一后，社媒互动率提升 2.3 倍',
      detailSections: [
        { type: 'text', content: '品牌定位是「温暖极简」——日式美学 + 北欧功能。视觉系统围绕这个核心展开：低饱和度大地色系、圆润字体、大量留白。' },
        { type: 'text', content: '我建立了一套完整的拍摄风格指南，从打光方式到道具选择都有规范，这样即使外包拍摄也能保持视觉一致性。' },
        { type: 'text', content: '品牌视觉统一后的效果比预期更大——社交媒体上的品牌辨识度明显提升，粉丝互动率在三个月内翻了 2.3 倍。' },
      ],
    },
    {
      id: 'social-ads-01',
      title: 'TikTok 广告素材系列',
      category: '社媒素材',
      type: 'video',
      thumbnail: '',
      bgGrad: 'linear-gradient(135deg, #2a1a3a, #a855f7)',
      images: [],
      videoUrl: '',  // ✏️ 放你的视频链接（支持 mp4 和 YouTube/B站嵌入）
      brief: '为一款便携咖啡机设计 TikTok 和 Instagram Reels 广告素材。需要在 3 秒内抓住注意力，15 秒内完成种草转化。',
      role: '视觉设计 + 剪辑',
      date: '2025.03',
      tools: ['After Effects', 'Premiere Pro', 'Photoshop'],
      achievement: '单条视频播放量 120w+，千次展示转化率比行业平均高 1.8 倍',
      detailSections: [
        { type: 'text', content: '短视频广告的逻辑和平面设计完全不同：前 3 秒必须制造「缺口」——让观众觉得不看下去就错过了什么。' },
        { type: 'text', content: '我设计了三种内容模式：开箱惊奇型（第一秒就展示最惊艳的角度）、痛点暴击型（先展示传统咖啡机有多麻烦）、UGC 真实感型（模拟普通用户随手拍）。' },
        { type: 'text', content: '三种模式跑下来，UGC 真实感型的 ROI 最高，单条视频带来 120 万播放，千次展示转化率达到 8.3%，比品类平均水平高出 1.8 倍。' },
      ],
    },
    {
      id: 'packaging-01',
      title: '香薰蜡烛包装设计',
      category: '包装设计',
      type: 'image',
      thumbnail: '',
      bgGrad: 'linear-gradient(135deg, #3a2a1a, #f59e0b)',
      images: [],
      videoUrl: '',
      brief: '为出海香薰品牌设计全系列蜡烛包装，需要在符合国际运输标准的前提下，做到「开箱即出片」的社交媒体传播效果。',
      role: '包装设计师',
      date: '2025.01',
      tools: ['Illustrator', 'Photoshop', 'Keyshot'],
      achievement: '产品上线后 UGC 内容量是品牌预期的 4 倍',
      detailSections: [
        { type: 'text', content: '包装设计不只是好看——对跨境品牌来说，包装同时承担着「运输保护」和「社交传播」双重任务。' },
        { type: 'text', content: '我选择了一体成型纸托结构来固定蜡烛，同时把开箱过程设计成「三层惊喜」：外层品牌封套 → 中间产品故事卡 → 内盒的产品本体。' },
        { type: 'text', content: '这个「三层开箱」的结构在 TikTok 上被大量自发分享，#unboxing 标签下的 UGC 内容量是品牌预期的 4 倍，成了免费的传播素材。' },
      ],
    },
    {
      id: 'app-ui-01',
      title: '品牌官网首页设计',
      category: '主图 / Banner 设计',
      type: 'image',
      thumbnail: '',
      bgGrad: 'linear-gradient(135deg, #1a1a3d, #6366f1)',
      images: [],
      videoUrl: '',
      brief: '为一个出海 DTC 品牌设计官网首页，要求兼顾品牌调性和转化率，移动端优先。',
      role: 'UI 视觉设计',
      date: '2024.11',
      tools: ['Figma', 'Photoshop'],
      achievement: '新首页上线后跳出率降低 22%',
      detailSections: [
        { type: 'text', content: '官网首页的设计难点在于「品牌沉浸」和「快速转化」之间的矛盾——既要让用户感受到品牌风格，又不能让他们找不到购买入口。' },
        { type: 'text', content: '我的方案是用大版块分割：首屏是大视觉 + 一句品牌主张 + 一个 CTA 按钮；滚动后依次是「畅销产品」「品牌故事」「用户评价」「订阅入口」。每个版块都保留品牌调性，但关键操作按钮始终可见。' },
        { type: 'text', content: '上线后数据对这套逻辑给出了验证：跳出率降低 22%，首页到产品页的点击率提升 31%。' },
      ],
    },
  ],

  /* ── 首页精选作品 ID 列表（显示哪几个） ── */
  // ✏️ 从上面 works 数组里挑 3-4 个 id 放进来
  featuredWorkIds: ['night-light-01', 'smart-watch-01', 'cosmetic-aplus-01', 'brand-visual-01'],

  /* ── 突出的模块（首页额外展示） ── */
  highlights: [
    { icon: '✦', label: '类目视觉引领者', desc: 'Amazon 小夜灯赛道 Top 100 中 50+ 款产品视觉方案由我主导，定义了该品类高转化视觉的标准。' },
    { icon: '◆', label: 'SOP 中台搭建者', desc: '搭建「AI + 自动化模板」工作流，新人培养周期缩短 70%，团队月产 A+ 最高 107 套。' },
    { icon: '▲', label: '全链路 AI 专家', desc: '2022 年起实操 AI 全流程，精通 Nano Banana Pro / SD / GPT / Sora 混合建模与出图。' },
    { icon: '●', label: '自研 AI 词库', desc: '针对夜灯发光材质等行业痛点，提炼可复制的 AI 提示词库，单套 A+ 产出从 4 天缩至 2 天。' },
  ],

  /* ── 关于我 ── */
  about: {
    bio1: '我不仅是设计师，更是视觉流程的「架构师」。深耕 Amazon 小夜灯赛道多年，Top 100 榜单中超过 50 款产品的视觉方案由我主导或经手优化——我不是在跟风趋势，我是在定义类目的视觉标准。',
    bio2: '我的核心价值在于：稳住基本盘——靠 SOP 让团队里的每个人都能出 80 分以上的卷子；攻克最高端——靠 AI 和前沿技术解决最难的光学质感和效率问题；拿结果说话——用 80% 的 A/B 测试胜出率和 Top 100 占有率证明设计的商业价值。',
    bio3: '2022 年起实操 AI 全进化流程，从纯人工修图到 AI 工业化生产。自研的「夜灯发光材质 AI 词库」解决了行业普遍头疼的半透明材质质感问题，单套 A+ 产出周期从 4 天压缩到 2 天。带领 2-3 人小组实现月产 107 套 A+ 的极限交付记录。',
    skills: [
      { name: 'Photoshop（极致精修）', level: 0.95 },
      { name: 'Rhino（工业建模）', level: 0.85 },
      { name: 'Stable Diffusion', level: 0.88 },
      { name: 'Nano Banana Pro', level: 0.90 },
      { name: 'GPT-4o / Midjourney', level: 0.92 },
      { name: 'PR / 剪映（视频剪辑）', level: 0.78 },
    ],

    experience: [
      {
        period: '2022 - 至今',
        company: '[公司名称]',
        role: '视觉组长 / 资深设计师',
        desc: '负责多款爆款小夜灯视觉全案。建立「6+2 标准化场景中台」与自研 AI 发光材质词库。带领 2-3 人小组实现月产 107 套 A+。主图 A/B 测试胜出率稳居 80%，推动多款新品 15 天内冲入类目前 50。',
      },
      {
        period: '2021 - 2022',
        company: '[公司名称]',
        role: '视觉设计师',
        desc: '负责 Amazon 主图设计、A+ 页面、社媒素材的全流程产出。早期通过自研滑轨实现丝滑运镜和电影级转场效果。从执行层面积累了扎实的拍摄与精修功底。',
      },
    ],

    achievements: [
      {
        icon: '✦',
        title: '类目视觉统治力',
        year: '至今',
        desc: 'Amazon 小夜灯 Top 100 中 50% 以上产品视觉经手，成为该品类设计风向标。新品 15 天内即可冲入 Top 50。',
      },
      {
        icon: '◆',
        title: '自研 AI 发光材质词库',
        year: '2024',
        desc: '针对「夜灯发光、半透明材质」等行业技术难点，提炼出一套可复制的 AI 提示词库。单套 A+ 产出周期从 4 天缩短至 2 天，人效翻倍。',
      },
      {
        icon: '▲',
        title: 'SOP 中台体系搭建',
        year: '2024',
        desc: '建立「6+2」标准化场景中台，预设统一透视与灯光的渲染模组。新人培养周期缩短 70%，团队月产 A+ 最高达 107 套。',
      },
      {
        icon: '●',
        title: 'AI 视频工作流落地',
        year: '2025',
        desc: '全面落地 AI 视频工作流，无需实拍布景，实现「工位出片」。人效达到 1 天 2 条高质量视频，覆盖 Amazon 视频版位与社媒分发。',
      },
    ],

    testimonials: [
      {
        quote: '李龙不只是设计师，他是我们见过最懂「把设计变成可复制的工业化流程」的人。他搭建的 SOP 体系让整个部门的产出质量都上了一个台阶。',
        author: '某出海品牌合伙人',
        role: '',
      },
    ],
  },

  /* ── 联系 ── */
  // ✏️ 改成你自己的联系方式
  socials: [
    { name: '微信', url: '#', icon: '✦' },
    { name: '站酷', url: '#', icon: '◆' },
    { name: 'Bēhance', url: '#', icon: '▲' },
    { name: '作品集', url: 'https://2240854970-jpg.github.io/portfolio/', icon: '●' },
  ],

  /* ── 页脚 ── */
  footer: '© 2026 李龙 — 用心设计每一个像素',
}
