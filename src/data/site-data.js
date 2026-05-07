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
  name: '陈一铭',
  nameEn: 'Yiming Chen',
  title: '跨境电商平面设计师',
  tagline: '用设计让产品在货架上自己说话',
  email: 'yiming.chen@example.com',
  avatar: '/images/avatar-placeholder.svg',  // ✏️ 替换为你的头像

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
    { value: '5+', label: '年跨境电商设计经验', icon: '✦' },
    { value: '300+', label: '产品主图设计交付', icon: '◆' },
    { value: '40%', label: '平均点击率提升', icon: '▲' },
    { value: '8', label: '品牌全案服务', icon: '●' },
  ],

  /* ── 作品分类 ── */
  // ✏️ 增删分类会同步到作品集的筛选栏
  categories: [
    '全部',
    '主图 / Banner 设计',
    '详情页设计',
    '品牌视觉',
    '社媒素材',
    '包装设计',
    '视频作品',
  ],

  /* ── 作品列表 ── */
  // ✏️ 增加一个作品就复制一个 {} 加进去
  //    删除一个作品就删掉对应的 {}
  //    修改 type: 'video' 会在作品集显示为视频标签
  //    images 数组可以放多张图，详情页会展示全部
  works: [
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
  featuredWorkIds: ['smart-watch-01', 'cosmetic-aplus-01', 'brand-visual-01', 'social-ads-01'],

  /* ── 关于我 ── */
  about: {
    // ✏️ 改成你自己的介绍
    bio1: '做了 5 年跨境电商设计，从第一张主图到完整的品牌视觉体系，我见证了「中国制造」到「中国品牌」出海的过程。',
    bio2: '我相信好的电商设计不是让产品看起来更贵，而是让消费者在滑动的 0.5 秒内，清楚地知道「这就是我要的」。功能可视化、信任可视化、差异化可视化——这是我在每一张图里反复打磨的东西。',
    bio3: '服务过的品类涵盖 3C 电子、个护美妆、家居日用、宠物用品。熟悉 Amazon、Shopify、TikTok Shop 等不同平台的视觉规则和用户行为差异。',
    skills: [
      { name: 'Photoshop', level: 0.95 },
      { name: 'Illustrator', level: 0.88 },
      { name: 'Cinema 4D', level: 0.78 },
      { name: 'After Effects', level: 0.75 },
      { name: 'Figma', level: 0.82 },
      { name: 'Premiere Pro', level: 0.70 },
    ],

    // ✏️ 工作经历
    experience: [
      {
        period: '2023 - 至今',
        company: '某出海品牌公司',
        role: '资深视觉设计师',
        desc: '负责品牌全渠道视觉体系搭建，管理 3 人设计团队，年度设计项目交付 200+。',
      },
      {
        period: '2021 - 2023',
        company: '某跨境电商代运营公司',
        role: '平面设计师',
        desc: '服务 10+ 个出海品牌，涵盖 Amazon 主图设计、A+ 页面、社媒素材、独立站视觉。',
      },
      {
        period: '2020 - 2021',
        company: '某广告公司',
        role: '初级设计师',
        desc: '负责电商平台活动页面和推广素材设计，从执行层面打下了扎实的设计基础。',
      },
    ],

    // ✏️ 获奖 / 认证 / 成就
    achievements: [
      {
        icon: '✦',
        title: 'Amazon A+ 内容认证设计师',
        year: '2024',
        desc: '通过 Amazon 官方认证，熟练掌握 A+ 页面（EBC）的最佳实践和平台规范。',
      },
      {
        icon: '◆',
        title: 'Red Dot 设计奖 — 入围',
        year: '2024',
        desc: '作品「日式香薰包装系列」入围 Red Dot 品牌与传播设计奖。',
      },
      {
        icon: '▲',
        title: '年度最佳设计师',
        year: '2023',
        desc: '所在公司年度评选中获得「年度最佳设计师」奖项，全年交付项目客户满意度 98%。',
      },
      {
        icon: '●',
        title: '累计设计产品销售额破亿',
        year: '2022 - 2025',
        desc: '经手设计的产品累计在 Amazon 平台贡献超过 1 亿人民币销售额。',
      },
    ],

    // ✏️ 客户 / 合作方评价
    testimonials: [
      {
        quote: '陈一铭是我合作过最懂「转化」的设计师。他不只是把图做漂亮，而是真的理解消费者在电商页面上的浏览习惯，每一张图都有策略。',
        author: '李总',
        role: '某出海品牌 CEO',
      },
      {
        quote: '我们在 3 个月内换了 4 个设计师都不满意，直到和一铭合作。他对品牌的理解深度和交付速度都让人印象深刻。',
        author: '王女士',
        role: '某品牌运营负责人',
      },
    ],
  },

  /* ── 联系 ── */
  // ✏️ 改成你自己的联系方式
  socials: [
    { name: '微信', url: '#', icon: '✦' },
    { name: '站酷', url: '#', icon: '◆' },
    { name: 'Bēhance', url: '#', icon: '▲' },
    { name: '公众号', url: '#', icon: '●' },
  ],

  /* ── 页脚 ── */
  footer: '© 2026 陈一铭 — 用心设计每一个像素',
}
