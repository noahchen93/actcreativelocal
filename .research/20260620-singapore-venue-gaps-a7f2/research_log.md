# 调研日志

- 目标：识别当前 119 条公开数据未收录的重要新加坡活动场地，并核查本地资料库中的遗漏地点。
- 审计日期：2026-06-20。
- 公开数据基线：`public/singapore-event-venue-finder/venue-data.json`，119 条。
- 本地资料库：`C:\Users\Noah Chen\Documents\BaiduSyncdisk\10 SDQ\新加坡场地资料汇总`。
- 数据边界：只提取地点名称、类型、公开容量和官方来源；不把费用、档期、最低消费或具体可用日期作为地点卡片内容。
- 本地 Excel 使用 `@oai/artifact-tool` 读取和比较；最新规范化主表有 122 个地点。
- 本地目录、内部 JSON 与公开数据合并去重后，得到 9 个名称差异，并逐项判断为有效遗漏、子空间、别名或模糊占位项。
- 旧项目筛选表补充了 Bayfront Event Space、The Promontory、The Lawn 和 Palawan Green 等户外候选。
- 网络核验优先采用新加坡政府、场地方官网、Visit Singapore、Arts House Group、Mandai、Sentosa 和酒店官网。
- `codex exec` 在当前 Windows 环境返回 `Access is denied`，因此改由当前会话中的联网和本地分析工具完成交叉核验。
