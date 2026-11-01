# 手机端 UI 优化与规范依据

日期：2026-11-02（新加坡时间）。本轮变更仅在本地，未部署。

## 已实现

- 手机首屏使用更简洁的中英文标题与简介；默认字号下主标题两行，简介最多四行。主要动作按钮并排，窄于360px时自然堆叠。
- 六个服务入口采用两列紧凑卡片；完整说明保留在目标服务页。工作流程使用紧凑编号列表。
- 产品默认三项缩略图列表，完整描述与特性可展开；更多类别可展开及收起。
- 手机地点选择使用原生下拉菜单，保留地域服务限制。Safari通过appearance样式获得完整48px触控高度。
- 需求预览默认折叠，邮件/复制动作可直接使用。复制失败时先打开预览再允许手动选择；不自动发送邮件。
- 减少过大的章节间距，加载后的章节释放占位min-height，页脚链接分列。菜单支持外部点击、Escape与桌面宽度切换关闭；案例支持触控滑动与按钮切换。
- 主要触控目标至少48×48 CSS px；小屏重排、长词/邮箱断行、缩放与减少动态效果的偏好均得到处理。

## 长度对比

相同窗口、语言，完整加载所有章节后，以默认折叠状态测量。优化前后均使用Chromium。数字是整页CSS像素高度，不是转化率或真机屏数。

| 宽度 | 语言 | 优化前 | 优化后 | 缩短 |
| --- | --- | ---: | ---: | ---: |
| 375px | en | 10,330px | 7,083px | 31.4% |
| 375px | zh | 9,491px | 6,624px | 30.2% |
| 390px | en | 10,298px | 7,002px | 32.0% |
| 390px | zh | 9,490px | 6,632px | 30.1% |
| 360px | en | 10,389px | 7,128px | 31.4% |
| 360px | zh | 9,506px | 6,616px | 30.4% |
| 412px | en | 10,226px | 6,914px | 32.4% |
| 412px | zh | 9,503px | 6,630px | 30.2% |

[完整测量数据](mobile-ui-measurements-2026-11-02.json)包括WebKit结果与区块高度。默认页面缩短不代表展开后的内容被删除；产品详情、额外类别与需求预览均保留明确入口。

## 调研结论与来源

1. 触控尺寸与间距优先。[Apple设计建议](https://developer.apple.com/design/tips/)使用44pt触控建议，[Android无障碍建议](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views)使用48dp。项目为网页选择48 CSS px目标；不把这些单位宣称为物理等价。
2. 减少次要信息的初始负担，保留关键路径与必要限制。[NN/g渐进披露](https://www.nngroup.com/articles/progressive-disclosure/)支持按需呈现次要内容；这里用于产品详情与需求预览。
3. 页面没有统一黄金长度，少换行也不是缩小字的理由。[W3C重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)要求等效320px重排；[文字缩放](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)要求放大后不丢内容。标题2行与简介4行只是本项目默认字号预算，大字模式允许正常增高。
4. 文案优先清楚、简短、一致，按语言编辑。[Apple Writing](https://developer.apple.com/design/human-interface-guidelines/writing)提供UI文案原则。
5. 工具栏与键盘影响视口，不能把100vh视为永远可见的高度。[web.dev视口单位说明](https://web.dev/blog/viewport-units)解释svh/dvh/lvh及软键盘边界。菜单使用vh回退+dvh上限，保持可滚动。

以上依据已整理为个人skill：`~/.codex/skills/mobile-web-ui/SKILL.md`，支持自动发现。skill结构校验通过，详细来源在其`references/design-rules.md`。

## 验证与复测

- Chromium与WebKit，各测试320、375、390、360、412、844横屏、1280桌面宽度及中英文，共28组；整页无横向溢出。
- 常见手机尺寸下，H1最多2行、简介最多4行、区块标题最多2行；主要目标尺寸达标。
- 手机主路径：菜单开关、Escape、案例切换、联系锚点、地点变更、出口地区禁用本地安装、预览开关、产品详情及额外类别展开/收起。无页面运行时错误。
- 两引擎、中英文375px下进行200%文字压力检查：正常重排，核心标题与联系文案未截断。此脚本不等于iOS Dynamic Type或完整WCAG合规认证。
- 明暗主题截图已查看；Safari表单原生下拉框高度已修复。实际截图与本轮日志保存在`/tmp/act-mobile-final/`及`/tmp/act-mobile-research/`。
- `npm run build`（含前后置完整性、联系路由、架构、GEO与SEO审计）、`npm run brief:check`、`npm run theme:check`、`git diff --check`通过。

复测：先启动本地服务器，确保Chrome及Playwright WebKit可用，运行`npm run mobile:check`。首次需要`npx playwright install webkit`。可用`MOBILE_UI_URL`指定预览地址、`MOBILE_UI_OUTPUT`指定证据目录、`MOBILE_UI_PROFILE=iphone`缩小复测范围。本轮临时WebKit路径为`/tmp/act-mobile-browsers`，运行时设置`PLAYWRIGHT_BROWSERS_PATH`。

仍需真机检查：Safari/Chrome的地址栏收展、实际软键盘聚焦与返回、刘海安全区、系统大字与底部手势。WebKit自动化不能代表所有iPhone，Chromium模拟也不能覆盖所有Android设备。
