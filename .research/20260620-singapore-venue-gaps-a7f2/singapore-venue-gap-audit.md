# 新加坡活动场地缺口审计

审计日期：2026-06-20
公开数据基线：`public/singapore-event-venue-finder/venue-data.json`，共 119 个地点

## 结论摘要

当前场地库已经覆盖多数大型酒店、综合会展设施和常见景点，但仍有三类明显缺口：

1. **真正没有收录的重要场地**：大型展览空间、标志性演艺场馆、政府管理的户外场地，以及两家重要酒店。
2. **已经藏在其他地点的子场地**：用户用常见名称搜索时不容易找到，需要增加别名或独立入口。
3. **名称已经变化的地点**：继续保留旧名称会影响准确性和 SEO。

建议第一批新增 10 个主地点；第二批补充 6—8 个特色场地；另对 6 个现有条目做别名、拆分或改名处理。

## 第一批：建议优先补录

| 优先级 | 地点 | 类型 | 判断 | 推荐处理 |
|---|---|---|---|---|
| P0 | Changi Exhibition Centre | 大型展览、户外活动 | 真正缺失。拥有大面积室内展厅及户外展示区，是航空展、贸易展和大型公众活动的重要场地。 | 新增独立主地点。 |
| P0 | F1 Pit Building | 大型活动、发布会、展销 | 真正缺失。新加坡旅游局仍将其作为正式活动场地管理。 | 新增独立主地点。 |
| P0 | Victoria Theatre & Victoria Concert Hall | 剧院、音乐厅、典礼 | 真正缺失。包含 614 座剧院和 673 座音乐厅，是 Civic District 的标志性演艺场馆。 | 建一个主地点，剧院与音乐厅作为两个 spaces。 |
| P0 | Singapore Botanic Gardens | 花园、文化遗产、企业活动 | 真正缺失。官方提供 Burkill Hall、Function Hall 和 Function Room 等可租用空间。 | 新增主地点并录入多个 spaces。 |
| P0 | Mandai Wildlife Reserve / Green Canvas | 特色会议、展览、自然主题活动 | 真正缺失。Green Canvas 是 2,800 平方米的会议展览设施，Mandai 另有动物园及夜间活动场景。 | 先建 Mandai Wildlife Reserve 主地点，Green Canvas 作为核心 space。 |
| P0 | Bayfront Event Space | 大型户外展览、节庆、临时搭建 | 真正缺失。本地项目资料曾将其列为重要大型开放场地，当前政府申请入口仍明确列出该地点。 | 新增独立主地点。 |
| P0 | The Promontory @ Marina Bay | 户外庆典、品牌活动、水岸活动 | 真正缺失。当前政府活动申请入口仍列出该地点。 | 新增独立主地点。 |
| P0 | Palawan Green | 圣淘沙户外活动 | 真正缺失。圣淘沙官方仍设有独立场地页面。 | 新增独立主地点。 |
| P0 | PARKROYAL COLLECTION Marina Bay | 酒店、会议、宴会 | 本地内部数据已有完整候选，但未进入公开数据。官网列有 Garden Ballroom、Atrium Ballroom 等活动空间。 | 从本地候选数据恢复并重新核对图片。 |
| P0 | The Fullerton Hotel Singapore | 酒店、会议、宴会、文化遗产 | 本地补充数据已存在，但未进入公开数据。当前只收录了 Fullerton Bay / Clifford Pier，不能替代这家独立酒店。 | 从本地候选数据恢复并重新核对图片。 |

主要官方依据：

- [Changi Exhibition Centre — Visit Singapore](https://www.visitsingapore.com/mice/en/plan-your-event/find-a-venue/changi-exhibition-centre/)
- [F1 Pit Building — Singapore Tourism Board](https://www.stb.gov.sg/leasing-opportunities/)
- [Victoria Theatre & Victoria Concert Hall — Arts House Group](https://artshouselimited.sg/vtvch)
- [Singapore Botanic Gardens venue hire — NParks](https://sbg.nparks.gov.sg/visit/rent-an-indoor-venue/)
- [Green Canvas — Mandai Wildlife Reserve](https://www.mandai.com/en/venues-for-hire/venues/green-canvas.html)
- [Marina Bay event application — FormSG](https://form.gov.sg/5d6c886a2efdae0012580263)
- [Palawan Green — Sentosa](https://www.sentosa.com.sg/en/plan-your-event/event-venues/palawan-green/)
- [PARKROYAL COLLECTION Marina Bay meetings](https://www.panpacific.com/en/hotels-and-resorts/pr-collection-marina-bay/meetings.html)
- [The Fullerton Hotel Singapore meetings and events](https://www.fullertonhotels.com/fullerton-hotel-singapore/meetings-and-events)

## 第二批：有实用价值的特色场地

| 优先级 | 地点 | 建议 |
|---|---|---|
| P1 | The Glasshouse @ Lazarus | 现有数据只有宽泛的 Lazarus Island。该场地有独立品牌和明确活动功能，建议新增子地点或独立卡片，并与 Lazarus Island 建关联。 |
| P1 | The Lawn @ Marina Bay | 本地项目资料和当前政府申请入口均有记录。建议确认当前活动使用边界后新增。 |
| P1 | National Design Centre | 适合设计展览、发布会、工作坊和中小型会议；官方有 Atrium、Gallery、Auditorium 和培训空间。 |
| P1 | Drama Centre | 重要市中心演艺场馆，拥有剧院、黑盒等空间；适合表演、会议和发布活动。 |
| P1 | Singapore Conference Hall | 国家古迹和专业音乐厅，官方提供 Concert Hall、Exhibition Hall、Concourse 等设施。 |
| P1 | Mandai Rainforest Resort by Banyan Tree | 新的自然度假会议产品，与 Green Canvas 的定位不同，建议作为酒店型场地独立收录。 |
| P2 | Aliwal Arts Centre | 适合社区艺术、排练、工作坊和小型演出，可补足中小型文化空间。 |
| P2 | Goodman Arts Centre | 适合艺术、社区和户外活动，可补足非市中心创意场地。 |

依据：

- [The Glasshouse @ Lazarus — Visit Singapore](https://www.visitsingapore.com/mice/en/plan-your-event/find-a-venue/the-glasshouse-lazarus/)
- [National Design Centre venue hire](https://uas.edu.sg/contact-us/venue-for-hire)
- [Arts House Group venue directory](https://artshouselimited.sg/venue-hire/explore-all-venues)
- [Singapore Conference Hall](https://sco.com.sg/corporate/singapore-conference-hall-sch/about-sch/)
- [Mandai Rainforest Resort meetings and events](https://www.mandai.com/en/mandai-rainforest-resort/meetings-and-events.html)
- [Aliwal Arts Centre](https://artshouselimited.sg/aac)
- [Goodman Arts Centre](https://artshouselimited.sg/gac)

## 不应直接新增，而应处理成别名、拆分或更新

| 当前情况 | 问题 | 推荐处理 |
|---|---|---|
| Marina Bay Sands 已收录 | Sands Expo and Convention Centre 没有独立搜索入口。 | 不重复建物理地点；增加 `Sands Expo and Convention Centre` 别名，必要时建立关联子页。 |
| Fairmont Singapore、Swissôtel The Stamford 已收录 | 用户更常搜索 Raffles City Convention Centre。 | 给两个酒店增加 convention centre 关联，并提供一个聚合搜索入口。 |
| Singapore Sports Hub 已收录 | Singapore Indoor Stadium 只作为 space 出现。 | 增加别名和独立详情入口，不必重复主地点。 |
| The Capitol Kempinski 已收录 | Capitol Theatre 已作为 space 出现，但搜索可见性不足。 | 增加独立别名/详情入口。 |
| Equarius Ballroom 已收录；本地另有 The Laurus Ballroom | Resorts World Sentosa 当前品牌体系已使用 The Laurus。 | 先核实是否为替代、迁移或新实体，再合并/改名，避免重复。 |
| S.E.A. Aquarium 已收录 | 当前官方名称已经是 Singapore Oceanarium。 | 更新主名称、图片、描述和 URL slug；保留旧名称作为历史别名。 |

参考：

- [Sands Expo and Convention Centre](https://www.visitsingapore.com/mice/en/plan-your-event/find-a-venue/sands-expo-and-convention-centre/)
- [Raffles City Convention Centre](https://www.visitsingapore.com/mice/en/plan-your-event/find-a-venue/raffles-city-convention-centre/)
- [Capitol Theatre venue hire](https://capitol-theatre.sg/venue-hire/)
- [Resorts World Sentosa event venues](https://www.rwsentosa.com/en/meetings/event-venues)
- [Singapore Oceanarium](https://www.rwsentosa.com/en/play/singapore-oceanarium)

## 本地文件夹审计

### 最新主表

本地最新规范化主表：

`C:\Users\Noah Chen\Documents\BaiduSyncdisk\10 SDQ\新加坡场地资料汇总\新加坡场地综合信息表_规范化版.xlsx`

主表共 122 个地点：

- 酒店：48
- 餐厅：11
- 活动场地：63

公开数据为 119 个。主表多出的 3 个是：

- `Far East Hotel`
- `LINO Forum`
- `Plume Singapore Flyer`

这三项均缺乏足够明确、稳定的当前实体信息，属于此前合理排除的占位或模糊条目，不建议直接恢复。

### 内部数据中真正值得处理的遗漏

内部文件：

- `.internal\codex_work\data\venue_catalog.json`
- `.internal\codex_work\data\web_supplement_venues.json`

发现以下未进入公开数据的名称：

| 本地名称 | 结论 |
|---|---|
| PARKROYAL COLLECTION Marina Bay | 有效遗漏，建议第一批恢复。 |
| The Fullerton Hotel Singapore | 有效遗漏，建议第一批恢复。 |
| The Laurus Ballroom | 有效的当前名称线索，但应先和 Equarius Ballroom 做实体关系核验。 |
| Flower Field Hall | 已经是 Gardens by the Bay 的子空间，不应重复建立主地点。 |
| Joaquim Hall 2 | 属于子厅/拆分空间，不应建立独立主地点。 |

专用资料文件夹还出现 `Marina Bay`，但它是区域名，不是可直接建立卡片的单一活动场地。应拆解成 Bayfront Event Space、The Promontory、The Lawn 等具体地点。

### 其他本地项目资料中的候选

以下旧项目筛选表包含当前公开数据未覆盖的户外场地：

- `Singapore_Location_Permit_Comparison.xlsx`
- `Singapore_Venue_Rescreened_20m_OpenToSky.xlsx`
- `Singapore_Venue_Shortlist_Executive_Summary_v3.xlsx`

其中最值得转入正式场地库的是：

- Bayfront Event Space
- The Promontory @ Marina Bay
- The Lawn @ Marina Bay
- Palawan Green

`Marina Reservoir` 更接近水上活动许可区域，不是常规活动场地；`Boat Quay`、`Clarke Quay` 更接近街区或活动区域，只有在产品支持“区域型场地”后才适合收录。

## 推荐实施顺序

1. 先恢复本地已有资料的 `PARKROYAL COLLECTION Marina Bay` 和 `The Fullerton Hotel Singapore`。
2. 新增 Changi Exhibition Centre、F1 Pit Building、Victoria Theatre & Victoria Concert Hall。
3. 新增 Singapore Botanic Gardens、Mandai Wildlife Reserve / Green Canvas。
4. 补齐 Bayfront Event Space、The Promontory、Palawan Green 等大型户外场地。
5. 处理 Singapore Oceanarium、The Laurus、Sands Expo、Raffles City Convention Centre 等名称和搜索入口问题。
6. 最后补充 National Design Centre、Drama Centre、Singapore Conference Hall 等中型文化场地。

新增时继续沿用现有内容规则：

- 不在地点卡片中写费用、档期、促销、最低消费或具体可用日期。
- 图片优先使用场地方、政府机构或旅游局的官方图；其他来源需要核对授权和实体一致性。
- 对同一建筑内的 ballroom、hall、theatre 优先建为 `spaces`，避免为了 SEO 制造重复地点。
