# 🚀 ACT CREATIVE 官网部署指南 / Deployment Guide

## ✅ 已完成的代码调整

所有使用 `figma:asset` 的图片引用已经转换为标准的 `/public` 文件夹路径，确保可以在生产环境（如Vercel、Netlify等）正常部署。

### 修改的组件文件：
- ✅ `/components/Header.tsx` - Logo
- ✅ `/components/Footer.tsx` - Logo
- ✅ `/components/Hero.tsx` - Logo
- ✅ `/components/TeamSection.tsx` - 团队成员照片
- ✅ `/components/CaseStudies.tsx` - 案例图片

---

## 📁 图片文件结构

```
/public/images/
├── logo.png                    # 公司Logo
├── team/                       # 团队成员照片
│   ├── noah-chen.png          # Noah Chen 照片
│   ├── daisy.png              # Daisy 照片
│   ├── jimmy-tang.png         # Jimmy Tang 照片
│   └── steve-yang.png         # Steve Yang 照片
└── cases/                      # 案例研究图片
    ├── big-world.png          # A BIG BIG WORLD 案例
    ├── wings-art.png          # WINGS OF ART 案例
    ├── pacman.png             # PACMAN & FRIENDS 案例
    ├── hofman.png             # FLORENTIJN HOFMAN 案例
    ├── craig-karl.png         # CRAIG & KARL 案例
    └── k11.png                # K11 SHENYANG 案例
```

---

## 🔄 图片替换步骤

### 步骤1: 从Figma Make导出图片

每个占位符文件都包含原始的 `figma:asset` ID：

| 文件路径 | 原始 figma:asset ID |
|---------|-------------------|
| `/public/images/logo.png` | `9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png` |
| `/public/images/team/noah-chen.png` | `598844c2d12f583dd14c291d98d5ddcf2dac2377.png` |
| `/public/images/team/daisy.png` | `7582ec62f07c47830049bf1681f8cfcd9e219d4e.png` |
| `/public/images/team/jimmy-tang.png` | `f03d52731a85bf6a927dcf21ae7cdc5f4209373b.png` |
| `/public/images/team/steve-yang.png` | `cd8d22454703fb7138abd251f5d7e528160024c7.png` |
| `/public/images/cases/big-world.png` | `50a15c0d86a008b03137d5f66091522ea2e22af0.png` |
| `/public/images/cases/wings-art.png` | `ce1fae3f9d7c9c86cee5a57f78785bd01887f88b.png` |
| `/public/images/cases/pacman.png` | `b24cf62a1dacab87d8adfc51e494355881e2ebd8.png` |
| `/public/images/cases/hofman.png` | `26e483ed6154d773d2210e3142c24d5a30471e92.png` |
| `/public/images/cases/craig-karl.png` | `f8ae069f17a75c4bb35568fc55aa9c42b28b80e6.png` |
| `/public/images/cases/k11.png` | `9d25bfe44e81512703910c57ed786148c93dcb9b.png` |

### 步骤2: 导出方法

**在Figma Make环境中：**
1. 打开浏览器开发者工具（F12）
2. 在Network标签中查找加载的图片
3. 右键点击图片 → "在新标签页中打开图片"
4. 右键保存图片
5. 重命名为对应的文件名（如 `logo.png`、`noah-chen.png`等）

**或者从本地文件导出：**
如果您有原始的设计文件或图片资源，直接使用这些图片即可。

### 步骤3: 替换占位符文件

将导出的真实图片文件上传到对应的路径，覆盖现有的占位符文件。

**重要提示：**
- 确保文件名完全一致（包括大小写和扩展名）
- 建议使用 PNG 格式以保持透明度（特别是Logo）
- 团队照片建议使用正方形比例（如 500x500px）
- 案例图片建议使用 4:3 比例（如 1200x900px）

---

## 🌐 部署到Vercel

### 方法1: 通过Git部署（推荐）

1. **提交代码到Git仓库**
```bash
git add .
git commit -m "Update images for production deployment"
git push
```

2. **连接Vercel**
   - 登录 [Vercel](https://vercel.com)
   - 点击 "Add New Project"
   - 导入您的Git仓库
   - Vercel会自动检测框架并配置

3. **上传图片**
   - 在Vercel项目中，确保 `/public` 文件夹中的图片已正确上传
   - Vercel会自动处理 `/public` 文件夹中的静态资源

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成

### 方法2: 手动上传图片到Vercel

如果图片文件较大或您想单独管理图片：

1. 部署项目到Vercel
2. 使用Vercel CLI上传图片：
```bash
vercel login
vercel --cwd /public/images
```

---

## 🔍 部署后验证清单

部署完成后，请验证以下项目：

### Logo验证
- [ ] Header中的Logo正常显示
- [ ] Footer中的Logo正常显示
- [ ] Hero区域的Logo正常显示
- [ ] Logo在移动端正常显示

### 团队照片验证
- [ ] Noah Chen 照片正常显示且呈圆形
- [ ] Daisy 照片正常显示且呈圆形
- [ ] Jimmy Tang 照片正常显示且呈圆形
- [ ] Steve Yang 照片正常显示且呈圆形
- [ ] 团队卡片hover效果正常

### 案例图片验证
- [ ] A BIG BIG WORLD 图片正常显示
- [ ] WINGS OF ART 图片正常显示
- [ ] PACMAN & FRIENDS 图片正常显示
- [ ] FLORENTIJN HOFMAN 图片正常显示
- [ ] CRAIG & KARL 图片正常显示
- [ ] K11 SHENYANG 图片正常显示
- [ ] 案例卡片hover效果正常

### 响应式验证
- [ ] 所有图片在桌面端正常显示
- [ ] 所有图片在平板端正常显示
- [ ] 所有图片在移动端正常显示

### 性能验证
- [ ] 图片加载速度良好
- [ ] 没有404错误
- [ ] ImageWithFallback降级机制正常工作

---

## 🎨 图片优化建议

为了获得最佳性能，建议在上传图片前进行优化：

### 推荐工具：
- **TinyPNG** (https://tinypng.com/) - 在线压缩PNG/JPG
- **Squoosh** (https://squoosh.app/) - Google的图片优化工具
- **ImageOptim** (Mac) - 本地批量优化工具

### 优化建议：
1. **Logo**: 
   - 使用PNG格式保持透明度
   - 建议尺寸: 宽度200-400px
   - 压缩后控制在50KB以内

2. **团队照片**:
   - 使用JPG或PNG格式
   - 建议尺寸: 500x500px（正方形）
   - 压缩后控制在100KB以内

3. **案例图片**:
   - 使用JPG格式（除非需要透明度）
   - 建议尺寸: 1200x900px（4:3比例）
   - 压缩后控制在200KB以内

---

## ❓ 常见问题解决

### Q1: 部署后图片不显示？
**A**: 检查以下项目：
- 确认图片文件名与代码中引用的路径完全一致（包括大小写）
- 确认图片已上传到 `/public/images/` 目录
- 检查浏览器控制台是否有404错误
- 清除浏览器缓存后重新加载

### Q2: 图片显示但很模糊？
**A**: 可能是图片分辨率太低：
- 确保上传的是高分辨率原图
- 团队照片至少500x500px
- 案例图片至少1200x900px

### Q3: 图片加载很慢？
**A**: 文件可能太大：
- 使用TinyPNG等工具压缩图片
- 考虑使用WebP格式（更好的压缩率）
- 确保图片大小合理（见优化建议）

### Q4: 本地开发环境看到图片，但生产环境看不到？
**A**: 确认：
- `/public` 文件夹已包含在Git提交中
- Vercel构建日志中没有错误
- 图片路径使用的是绝对路径（如 `/images/logo.png`）

---

## 📞 技术支持

如果遇到部署问题，请检查：

1. **Vercel部署日志** - 查看是否有构建错误
2. **浏览器控制台** - 查看是否有JavaScript或网络错误
3. **Network面板** - 检查图片请求状态

---

## ✨ 完成！

按照以上步骤，您的ACT CREATIVE官网应该可以成功部署到生产环境，所有图片都能正常显示。

祝部署顺利！🎉
