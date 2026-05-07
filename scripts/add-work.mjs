/**
 * ══════════════════════════════════════════════
 *  add-work.mjs — 作品添加工具
 *  自动：复制图片 → 生成描述 → 更新数据 → 构建部署
 * ══════════════════════════════════════════════
 *
 * 用法：
 *   node scripts/add-work.mjs <图片文件夹路径> [作品标题]
 *
 * 示例：
 *   node scripts/add-work.mjs "E:\产品图片\香薰机"
 *   node scripts/add-work.mjs "E:\产品图片\台灯" "复古台灯 Amazon 主图设计"
 *
 * 文件名命名规范（让工具自动识别图片类型）：
 *   主图.jpg / 1.jpg          → 白底主图
 *   功能*.jpg / feature*      → 功能卖点图（infographic）
 *   尺寸*.jpg / size*         → 尺寸标注图
 *   场景* / 氛围* / life*     → 场景氛围图
 *   白天* / 黑夜* / day*      → 白天黑夜对比
 *   包装* / pack* / box*      → 包装展示图
 *   视频* / video*            → 视频封面
 *   角度* / angle* / 细节*    → 多角度展示
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const PROJECT_DIR = path.resolve(import.meta.dirname, '..')
const IMAGES_DIR = path.join(PROJECT_DIR, 'public', 'images')
const DATA_FILE = path.join(PROJECT_DIR, 'src', 'data', 'site-data.js')

/* ── 图片类型识别策略 ── */
function classifyImage(filename) {
  const name = filename.toLowerCase().replace(/\.[^.]+$/, '')

  const rules = [
    { match: /^(1|main|主图|首图)/,         type: 'hero',       title: '主图 — 极简展示，建立品质感' },
    { match: /(功能|feature|卖点)/,           type: 'feature',    title: '功能可视化 — 核心卖点速览' },
    { match: /(尺寸|size|规格|dimension)/,    type: 'size',       title: '尺寸标注 — 消灭预期差' },
    { match: /(白天|day|日光)/,               type: 'daynight',   title: '场景对比 — 白天 & 黑夜' },
    { match: /(黑夜|night|夜间|关灯)/,        type: 'daynight',   title: '场景对比 — 白天 & 黑夜' },
    { match: /(场景|氛围|life|lifestyle|环境)/, type: 'lifestyle', title: '场景氛围 — 代入使用场景' },
    { match: /(包装|pack|box|开箱)/,          type: 'packaging',  title: '包装展示 — 开箱即用的品质感' },
    { match: /(视频|video|动效)/,             type: 'video',      title: '视频展示 — 动态视觉呈现' },
    { match: /(角度|angle|细节|detail|侧)/,    type: 'detail',    title: '多角度展示 — 结构可视化' },
  ]

  for (const rule of rules) {
    if (rule.match.test(name)) return rule
  }

  // 按文件名排序推断：2.jpg 可能是第二张图
  const num = parseInt(name)
  if (!isNaN(num)) {
    const fallbacks = ['hero', 'detail', 'feature', 'daynight', 'size', 'lifestyle', 'packaging', 'video']
    const idx = Math.min(num - 1, fallbacks.length - 1)
    const titles = [
      '主图 — 极简展示',
      '多角度展示 — 结构可视化',
      '功能可视化 — 核心卖点',
      '场景对比 — 多场景展示',
      '尺寸标注 — 规格信息',
      '场景氛围 — 代入感',
      '包装展示 — 开箱体验',
      '细节展示 — 品质特写',
    ]
    return { type: fallbacks[idx], title: titles[idx] }
  }

  return { type: 'default', title: '产品展示 — ' + filename.replace(/\.[^.]+$/, '') }
}

/* ── 根据图片类型生成描述 ── */
function generateDescription(type, filename, idx, total) {
  const descs = {
    hero: `白底主图是 Amazon 的硬性要求，但不等于枯燥。通过柔光布光让材质透出温润质感，产品轮廓在光影下呈现立体感。背景保留微量阴影来传递「实物感」，避免纯白底常见的廉价 PS 感。这张图要传递的信息是：这是一件有品质感的产品，不是廉价货。`,

    feature: `功能可视化是电商设计中最关键的能力之一。消费者不读长篇说明书，他们看图。这张 infographic 用视觉语言让核心卖点在一秒内被理解——不需要文字解释，眼睛扫过去就知道了。好的功能图应该让消费者产生「原来这么方便」而不是「这是什么意思」。`,

    size: `尺寸图不是为了美观，而是为了减少退货。清晰标注产品关键尺寸参数，必要时加入日常物品作为大小参照。消费者看到这张图就能准确判断产品适不适合自己的需求——预期管理做得越好，退货率越低。`,

    daynight: `场景对比图是整套视觉中转化力最强的一张。一张图同时展示产品在不同光线/环境下的表现，回答消费者心中最纠结的问题：「白天放着好看吗？」和「晚上用起来怎么样？」。对比越直观，购买决策越快。`,

    lifestyle: `氛围感驱动购买决策。这张图的目标不是展示产品细节，而是贩卖一种生活方式——暖色调的居家场景中产品自然融入，消费者看到的不再是一个商品，而是一个「想要拥有的场景」。家居类产品的购买决策很大程度上受「我想拥有这个场景」的情绪驱动。`,

    packaging: `包装展示图让消费者看到产品的完整交付状态。好的包装设计能给产品加分——消费者会觉得「包装都这么用心，产品肯定不差」。这也减少了关于「是否适合送礼」的疑问，拓展了产品的使用场景。`,

    video: `动态视频在电商平台上的转化率显著高于静态图片。这张素材展示了产品在真实使用场景中的动态表现——灯光变化、操作方式、使用效果，比文字描述直观百倍。适合同步投放到 Amazon 视频版位、TikTok 和独立站。`,

    detail: `多角度展示是建立产品信任的重要环节。消费者在购买前无法触摸实物，多角度视图能帮助他们建立完整的产品认知——侧面、背面、顶部、底部，所有视角都展示到位，让他们在收到产品前就已经「熟悉」了它。`,

    default: `这张图从特定角度展示了产品的设计细节和工艺质感。在电商场景中，每张图都应该回答一个消费者可能存在的问题——这张图回答的是「产品细节够精致吗？」。清晰的局部展示能有效降低消费者对品质的疑虑。`,
  }

  return descs[type] || descs.default
}

/* ── 生成 tool tags ── */
function inferTools(filename) {
  const name = filename.toLowerCase()
  const tools = ['Photoshop']
  if (name.includes('3d') || name.includes('c4d') || name.includes('渲染')) tools.push('Cinema 4D')
  if (name.includes('ai') || name.includes('sd') || name.includes('nano')) tools.push('Stable Diffusion')
  if (name.includes('video') || name.includes('pr') || name.includes('剪辑')) tools.push('Premiere Pro')
  return tools
}

/* ── 生成作品 ID ── */
function generateId(title) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return base + '-' + Date.now().toString(36).slice(-4)
}

/* ── 主流程 ── */
async function main() {
  const args = process.argv.slice(2)
  const sourceDir = args[0]
  const customTitle = args[1]

  if (!sourceDir || !fs.existsSync(sourceDir)) {
    console.error('\n❌ 请提供有效的图片文件夹路径')
    console.error('用法: node scripts/add-work.mjs <图片文件夹路径> [作品标题]\n')
    process.exit(1)
  }

  // 读取图片
  const imageFiles = fs.readdirSync(sourceDir)
    .filter(f => /\.(jpg|jpeg|png|webp|gif|mp4|mov)$/i.test(f))
    .sort()

  if (imageFiles.length === 0) {
    console.error('\n❌ 文件夹中没有找到图片文件')
    process.exit(1)
  }

  console.log(`\n📸 找到 ${imageFiles.length} 张图片，正在分析...\n`)

  // 复制图片到 public/images
  const timestamp = Date.now().toString(36)
  const imagePaths = []
  const showCase = []

  imageFiles.forEach((file, i) => {
    const ext = path.extname(file)
    const newName = `${timestamp}-${String(i + 1).padStart(2, '0')}${ext}`
    const src = path.join(sourceDir, file)
    const dest = path.join(IMAGES_DIR, newName)

    fs.copyFileSync(src, dest)
    const imgPath = `images/${newName}`
    imagePaths.push(imgPath)

    // 分类 + 生成描述
    const classification = classifyImage(file)
    const desc = generateDescription(classification.type, file, i, imageFiles.length)
    const tools = inferTools(file)

    showCase.push({
      src: imgPath,
      title: classification.title,
      desc: desc,
    })

    console.log(`  [${i + 1}/${imageFiles.length}] ${file} → ${classification.title}`)
  })

  // 生成作品标题
  const title = customTitle || path.basename(sourceDir) + ' · Amazon 全套视觉设计'
  const id = generateId(title)
  const date = new Date().toISOString().slice(0, 7).replace('-', '.')

  // 推断分类
  const hasVideo = imageFiles.some(f => /video|动效/.test(f))
  const category = hasVideo ? '视频作品' : '主图 / Banner 设计'

  // 构建作品数据块
  const workBlock = `
    {
      id: '${id}',
      title: '${title}',
      category: '${category}',
      type: '${hasVideo ? 'video' : 'image'}',
      thumbnail: '${imagePaths[0]}',
      bgGrad: 'linear-gradient(135deg, #1a2a3a, #6366f1)',
      images: [${imagePaths.map(p => `'${p}'`).join(',\n        ')}],
      videoUrl: '',
      brief: '为这款产品设计完整的 Amazon 视觉体系，涵盖主图、功能卖点图、尺寸图及多场景氛围图。',
      role: '主设计师',
      date: '${date}',
      tools: ['Photoshop', 'Illustrator'],
      achievement: 'Listing 上线后数据表现优异，A/B 测试胜出率超过行业平均',
      designIntro: '从产品定位出发，围绕核心卖点构建视觉叙事逻辑。用主图建立品质感，用 infographic 快速传递功能价值，用场景图触发情感共鸣。三层视觉逻辑对应消费者的三层决策路径：这个好看吗？→ 这个有什么用？→ 这是我需要的吗？',
      showCase: [${showCase.map((s, i) => `
        {
          src: '${s.src}',
          title: '${s.title}',
          desc: '${s.desc}',
        }`).join(',')}
      ],
      designResult: '这套视觉方案上线后通过数据验证了设计策略的有效性。标准化的工作流也使得同类产品的视觉产出效率显著提升。',
    },`

  // 读取现有数据文件
  let dataContent = fs.readFileSync(DATA_FILE, 'utf-8')

  // 插入到 works 数组的开头
  const insertPoint = dataContent.indexOf('works: [')
  if (insertPoint === -1) {
    console.error('\n❌ 找不到 works 数组，数据文件结构异常')
    process.exit(1)
  }

  const beforeWorks = dataContent.slice(0, insertPoint + 8) // 'works: ['
  const afterWorks = dataContent.slice(insertPoint + 8)

  // 在第一个 [ 后面插入新作品
  const newContent = beforeWorks + '\n' + workBlock + '\n' + afterWorks
  fs.writeFileSync(DATA_FILE, newContent, 'utf-8')

  console.log(`\n✅ 作品「${title}」已添加到 site-data.js`)
  console.log(`   ID: ${id}`)
  console.log(`   图片: ${imagePaths.length} 张 → public/images/`)
  console.log(`   描述: ${showCase.length} 条图文配对\n`)

  // 询问是否加入精选
  console.log('   💡 如果想在首页展示，打开 site-data.js 搜索 featuredWorkIds')
  console.log(`      把 '${id}' 加到数组最前面即可\n`)

  // 自动构建部署
  console.log('⚡ 正在构建...')
  try {
    execSync('npx vite build', { cwd: PROJECT_DIR, stdio: 'pipe' })
    console.log('✅ 构建成功\n')

    console.log('⚡ 正在部署到 GitHub...')
    execSync('git add -A', { cwd: PROJECT_DIR, stdio: 'pipe' })
    execSync(`git commit -m "feat: 添加新作品 - ${title}"`, { cwd: PROJECT_DIR, stdio: 'pipe' })

    // 部署到 gh-pages
    execSync('node -e "', { cwd: PROJECT_DIR, stdio: 'pipe' })

    console.log('\n========================================')
    console.log('✅ 全部完成！')
    console.log(`   新作品: ${title}`)
    console.log(`   在线预览: https://2240854970-jpg.github.io/portfolio/`)
    console.log('========================================\n')

  } catch (e) {
    console.error('\n⚠️  构建/部署出错，请手动执行:')
    console.error('   cd portfolio-site && npm run build')
    console.error('   然后把 dist/ 拖到 Vercel 部署\n')
    console.error(e.message)
  }
}

main().catch(console.error)
