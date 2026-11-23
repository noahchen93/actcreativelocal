# SEO、AI 搜索与 personal agent 优化

调研与本地验证：2026-11-02，Asia/Singapore。此报告记录本轮本地改进，尚未提交或部署；当前生产仍为移动端发布 `9a95756`。

## 结论与取舍

把发现、理解、使用、询盘四个环节分开：搜索索引仍依赖可抓取的真实页面；文本抓取代理需要无需执行 JS 的正文；浏览器代理需要清楚的语义和可靠动作；询盘链接应保留项目类型与语言。机器目录是现有页面的便捷表示，不能被描述成 Google 排名因素。

| 资料 | 核实内容 | 本项目采用方式 |
| --- | --- | --- |
| [Google AI 搜索优化指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)，页面标注更新 2026-07-10 | 公开可抓取、可索引和有价值的内容仍是基础；Google 不用 llms.txt 等特殊文件作排名机制；没有理想页长 | 修复中文原始 HTML，保持 canonical 与现有服务页；不批量制造“AI 专属 SEO 页”或承诺引用增长。 |
| [Google 网站所有者控制说明](https://blog.google/products-and-platforms/products/search/new-controls-website-owners/)，更新 2026-08-31 | 说明 Search Console 的生成式 AI 搜索控制与表现洞察 | 后续需在真实账户核对站点包含状态和报告；本轮未能读取，不假定已经开启，也不假定不存在此功能。 |
| [OpenClaw web_fetch 源码文档](https://github.com/openclaw/openclaw/blob/main/docs/tools/web-fetch.md) | HTTP 获取与可读内容提取不执行 JS；浏览器工具是另一条路径 | 修复 `/zh/` 无 JS 正文，保留可直接读取的 JSON/Markdown，以及明确来源。 |
| [Hermes 浏览器文档](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/browser.md) | 浏览器与可访问性快照支持导航、填表和信息提取，具体后端可配置 | 优先支持一般浏览器语义和服务类型预选；不臆造专属爬虫名或宣布自动收录。 |
| [Vercel agent-browser](https://github.com/vercel-labs/agent-browser) | 通过快照和语义定位等方式操作网页 | 用真实浏览器验证中文正文、明确入口、字段预选及可展开内容。没有把任意 SKILL.md 放在网站上当成自动安装。 |
| [Chrome WebMCP 说明](https://developer.chrome.com/docs/ai/webmcp/)，更新 2026-10-07 | 以渐进增强提供页面内工具；到站后才发现可调用功能；仍有兼容性限制 | 仅增加一个公开服务查询工具，避免工具泛滥；不将 WebMCP 当成新 SEO 排名信号。 |
| [WebMCP 提案源码](https://github.com/webmachinelearning/webmcp)、[实现状态](https://github.com/webmachinelearning/webmcp/blob/main/implementation-status.md) | 当前草案使用 `document.modelContext.registerTool`，较早 Chromium 试验形态不同；尚非通用浏览器标准 | 同时检测 Document/Navigator host，缺少接口或权限时保持普通网页可用。只读返回，不自动发消息或提交订单。 |

上表是来源事实与本项目的工程判断，后者不等同于各产品官方推荐 ACT Creative。

## X 上的借鉴与限制

通过 X 域名限定搜索取得以下索引文本，2026-11-02 直接打开帖子均返回 403，未能复核完整对话或附件。只将它们当实践线索，技术判断仍回到上表的一手资料。

- [Mike Futia，2026-04-12](https://x.com/mikefutia/status/2043357536448041327)：介绍以 GSC 数据找机会、检查竞争页面、定期复测的流程。值得借鉴的是从真实查询反馈闭环；“替代某付费产品”和排名效果属于作者推广主张，本项目未采信或验证。
- [John King，2026-05-23](https://x.com/BrisbaneJohn87/status/2058118714546110564)：讨论 Google AI 指南与 llms.txt。相关判断通过 Google 原始指南核对，不以转述替代官方说明。
- [Travers，帖子 1983978261769285727](https://x.com/travers00/status/1983978261769285727)：讨论 llms.txt 与开源机器可读内容。可借鉴格式便利性；索引没有足够上下文来证明任何搜索平台采用情况或排名影响，未用作效果依据。

没有点赞、回复、关注、私信索取资料或安装社交帖提供的第三方代码。

## 本轮落地

1. **中文原始正文**：过去构建插件只改 `/zh/` 的语言和 meta，复制的无 JS 正文仍为英文。现在从 `src/data/home-fallback.zh.html` 注入中文服务、案例、服务边界和询盘说明。浏览器启用 JS 后仍使用现有紧凑 React 页面，首页长度没有因此增加。
2. **13 类服务的上下文询盘**：目录 v1.1 每项提供中英文 brief URL，并对应现有允许的类型。展位、道具、雕塑、餐车、互动展陈、活动周边和节庆项目可正确预选；采购/场地等没有专用类型时使用“需要建议”。所有用户文字仍由用户自行填写，不放进 URL。
3. **来源与日期**：canonical、title、description 继续从真实服务页生成；目录新增已有页面的 `dateModified`，不把目录更新日期冒充每个项目的审查日期。无中文翻译的服务仍链接真实英文页面。
4. **实验性只读工具**：首页 `public/agent-services.js` 有条件注册 `actcreative_get_services`。支持列出服务或按已知 ID 查询，返回来源、相关案例、服务限制和 brief 链接。只有调用时才获取同源公开目录，不读表单、会话或库存，不发邮件、不自动打开链接，也没有恢复网站聊天机器人。
5. **持续检查**：`agent:check` 接入来源一致性、路由、无 JS 中文、只读执行、输入限制、缓存和失败恢复验证；构建后继续验证实际输出。扩展路由表时，导航同步脚本明确维持原来四个核心页面的范围，避免将来误改其他页面。

## 已验证与未验证

- `npm run agent:check`、`brief:check`、`seo:check`、`build`（含 contact/architecture/GEO/AI retirement/content/search guards）和 `git diff --check`通过。74 个 sitemap URL、71 个静态页、11 个案例的内容完整性保持。
- Chromium 与 WebKit：中英文无 JS 页面可见、375px 无横向溢出；正常 JS 模式可用，新增互动/节庆路由能预选正确类型。
- 两引擎使用**模拟 WebMCP host**，完成注册→真实本地目录获取→中文餐车服务/证据/预选链接的链路。Node 测试还覆盖较早 Navigator host、无接口、注册被拒、异常输入、离线恢复与重复查询缓存。
- 安装的 Chromium/WebKit **没有原生 WebMCP 接口**。因此这是一项有兼容回退的实验，没有声称原生 personal agent 集成已获认证。
- `geo` CLI 未安装；没有伪造 GEO 分数或将本地检查当排名分数。
- 尝试读取 GSC 2026-10-03 至 2026-10-30 的 query/page 数据失败：本机没有有效默认凭据。未取得近期关键词、排名或 AI 表现数据，也未据此重写标题。
- 公开搜索返回了首页、中文首页、About、中英道具页等来源，其中抓取日期不同；这仅是检索样本，不能推导全站收录率或本轮改动效果。新内容目前尚未上线。

## 下一阶段如何判断效果

使用 [中英文中立任务集](agent-search-evaluation-2026-11-02.json)，对可用 personal agent 分别记录日期、产品/模型版本、检索方式、发现与引用 URL、服务匹配、事实错误和完整询盘路径。保留竞争对手与未出现的样本，不用“必须推荐 ACT Creative”的诱导提示。任务集尚未在真实产品中运行，不是排名结果。

在恢复 GSC 只读访问后，再分别比较查询/页面/设备的同口径完整窗口，并核对可用的生成式 AI 报告与站点包含状态。实际询盘、草稿打开与复制事件继续分开；不要把爬虫访问、格式解析、某次回答出现品牌或本地测试通过当作业务转化。
