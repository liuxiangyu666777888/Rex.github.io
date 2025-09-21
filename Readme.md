# 南梁革命纪念馆官方网站

## 项目简介

南梁革命纪念馆官方网站是一个展示陕甘边革命根据地历史文化的现代化网站平台。网站采用响应式设计，支持VR全景参观、AI智能导览等先进功能，致力于传承红色基因，弘扬南梁精神。

## 功能特色

### 🏛️ 数字展馆
- **VR全景参观**: 720度沉浸式虚拟参观体验
- **AI智能导览**: 基于大语言模型的智能问答系统
- **互动展示**: 多媒体互动展示系统

### 📚 教育资源
- **红色课程体系**: 面向不同年龄段的教育课程
- **研学实践活动**: 青少年红色教育实践项目
- **思政教育素材**: 权威的红色教育内容库

### 🏺 文物展示
- **馆藏文物**: 5000+件珍贵革命文物
- **智能搜索**: 支持文物名称、等级筛选
- **详细介绍**: 每件文物的历史背景和价值

### 📱 管理后台
- **内容管理**: 文物和教育资源的上传管理
- **数据统计**: 访问量和用户行为分析
- **权限控制**: 分级管理权限系统

## 技术架构

### 前端技术
- **HTML5**: 语义化标记和现代Web标准
- **CSS3**: Flexbox/Grid布局，CSS变量，动画效果
- **JavaScript ES6+**: 模块化编程，异步处理
- **响应式设计**: 支持PC、平板、手机等多设备

### 特色功能
- **PWA支持**: 离线访问和应用程序体验
- **SEO优化**: 搜索引擎友好的页面结构
- **可访问性**: 符合WCAG 2.1 AA标准
- **性能优化**: 图片懒加载、代码压缩、CDN加速

## 文件结构

```
nangliang-memorial/
├── index.html                 # 主页面
├── css/
│   ├── style.css             # 主样式文件
│   ├── components.css        # 组件样式
│   └── responsive.css        # 响应式样式
├── js/
│   ├── main.js              # 主逻辑文件
│   ├── components.js        # 组件逻辑
│   └── jquery.min.js        # jQuery库
├── images/                   # 图片资源目录
├── fonts/                    # 字体文件目录
├── README.md                # 项目说明
└── package.json             # 项目配置
```

## 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/yourusername/nangliang-memorial.git
cd nangliang-memorial
```

2. **启动本地服务器**
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 使用VS Code Live Server扩展
# 右键index.html选择"Open with Live Server"
```

3. **访问网站**
```
http://localhost:8000
```

### GitHub Pages部署

1. **推送代码到GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **启用GitHub Pages**
- 进入Repository Settings
- 找到Pages选项
- Source选择"Deploy from a branch"
- Branch选择"main"
- 点击Save

3. **访问部署后的网站**
```
https://yourusername.github.io/nangliang-memorial/
```

## 使用指南

### 管理员登录
- 默认密码：`nangliang2024`
- 访问路径：点击导航栏"管理后台"

### 文物管理
1. 登录管理后台
2. 选择"文物管理"选项卡
3. 填写文物信息并上传图片
4. 点击"上传文物"保存

### 教育资源管理
1. 切换到"教育资源管理"
2. 选择资源类型（讲解词/课程资料/思政素材）
3. 上传相关文档
4. 保存并发布

### AI智能导览
- 点击"AI智能导览"按钮
- 输入关于南梁历史、人物、文物的问题
- 获得智能回答和推荐内容

## 浏览器支持

| 浏览器 | 版本要求 |
|--------|----------|
| Chrome | 70+ |
| Firefox | 65+ |
| Safari | 12+ |
| Edge | 79+ |

## 性能指标

- **首屏加载时间**: < 2秒
- **Lighthouse评分**: 90+
- **移动端适配**: 100%
- **SEO优化**: 满分

## 贡献指南

### 开发规范
1. **代码风格**: 遵循ESLint和Prettier配置
2. **提交规范**: 使用Conventional Commits格式
3. **分支管理**: 采用Git Flow工作流
4. **测试要求**: 确保功能测试通过

### 提交代码
1. Fork项目到个人仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'Add some feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建Pull Request

## 版本历史

### v1.0.0 (2024-01-15)
- 🎉 项目初始版本
- ✨ 基础页面结构和样式
- 🔧 响应式布局适配
- 📱 移动端优化

### v1.1.0 (2024-02-01)
- ✨ 新增VR全景功能
- 🤖 集成AI智能导览
- 🏺 完善文物展示系统
- 🛠️ 性能优化和bug修复

### v1.2.0 (2024-03-01)
- 📚 新增教育资源模块
- 🔐 完善管理后台功能
- 🎨 UI/UX体验优化
- 🔍 SEO优化改进

## 联系我们

- **项目维护**: 南梁革命纪念馆技术团队
- **官方网站**: https://nangliang-memorial.github.io
- **技术支持**: tech@nangliang-memorial.org
- **反馈建议**: feedback@nangliang-memorial.org

## 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 致谢

感谢所有为南梁革命纪念馆数字化建设做出贡献的开发者和历史学者。

---

**传承红色基因 · 弘扬南梁精神**

南梁革命纪念馆 © 2024