// ==========================================
// 吞噬星空·转盘人生 - 游戏数据
// ==========================================

// ===== 1. 境界体系 =====
const REALMS = [
  { level: 1, name: "学徒级", minStage: 1 },
  { level: 2, name: "行星级", minStage: 1 },
  { level: 3, name: "恒星级", minStage: 1 },
  { level: 4, name: "宇宙级", minStage: 2 },
  { level: 5, name: "域主", minStage: 2 },
  { level: 6, name: "界主", minStage: 2 },
  { level: 7, name: "不朽军主", minStage: 3 },
  { level: 8, name: "不朽封侯", minStage: 3 },
  { level: 9, name: "不朽封王", minStage: 3 },
  { level: 10, name: "宇宙尊者", minStage: 4 },
  { level: 11, name: "宇宙霸主", minStage: 4 },
  { level: 12, name: "宇宙之主", minStage: 5 },
  { level: 13, name: "真神", minStage: 6 },
  { level: 14, name: "虚空真神", minStage: 6 },
  { level: 15, name: "永恒真神", minStage: 6 }
];

function getRealmName(level) {
  if (level < 1) return "凡人";
  if (level > 15) return "起源境";
  return REALMS[level - 1].name;
}

// ===== 2. 阶段数据 =====
const STAGES = [
  {
    id: 1,
    name: "地球时期",
    minRealm: 2, // 保底行星级
    probability: 35,
    stageStates: [
      { id: "s1_company", name: "加入虚拟宇宙公司", desc: "加入虚拟宇宙公司，获得大势力庇护" },
      { id: "s1_loner", name: "成为宇宙独行者", desc: "成为宇宙独行者，自由闯荡" }
    ]
  },
  {
    id: 2,
    name: "罗峰宇宙闯荡时期",
    minRealm: 4, // 保底宇宙级
    probability: 25,
    stageStates: [
      { id: "s2_battlefield", name: "前往域外战场", desc: "前往域外战场参战，积累战功" },
      { id: "s2_secret", name: "留在原始秘境", desc: "留在原始秘境修炼，突破境界" }
    ]
  },
  {
    id: 3,
    name: "域外战场时期",
    minRealm: 7, // 保底不朽军主
    probability: 15,
    stageStates: [
      { id: "s3_star", name: "进入原始星", desc: "进入原始星，争夺至宝" },
      { id: "s3_city", name: "留在混沌城", desc: "留在混沌城修炼，稳固境界" }
    ]
  },
  {
    id: 4,
    name: "原始星时期",
    minRealm: 10, // 保底宇宙尊者
    probability: 10,
    stageStates: [
      { id: "s4_sea", name: "进入宇宙海", desc: "进入宇宙海，冒险探索" },
      { id: "s4_universe", name: "留在原始宇宙", desc: "留在原始宇宙，稳固势力" }
    ]
  },
  {
    id: 5,
    name: "宇宙海时期",
    minRealm: 12, // 保底宇宙之主
    probability: 10,
    stageStates: [
      { id: "s5_fight", name: "与罗峰共抗界兽", desc: "与罗峰共同对抗界兽，生死与共" },
      { id: "s5_neutral", name: "中立观望", desc: "远离界兽危机，中立观望自保" }
    ]
  },
  {
    id: 6,
    name: "界兽危机时期",
    minRealm: 13, // 保底真神
    probability: 5,
    stageStates: [] // 最后阶段无状态切换
  }
];

// ===== 3. 转盘事件数据结构 =====
// 每个事件对象: { text, type, effects, specialExp }
// type: 'normal' | 'death' | 'gain' | 'breakthrough' | 'tag' | 'special' | 'stageState'
// effects: { realm:+1, items:[...], tags:[...] }

// ===== 阶段1：地球时期 =====
const STAGE1_WHEELS = [
  // #1 初入地球
  [
    { text: "觉醒精神念师天赋，感知念力浮动", type: "tag", effects: { tags: ["精神念师"] } },
    { text: "成为普通武者，进入极限武馆外围", type: "normal" },
    { text: "发现陨墨星飞船残骸，获得基础传承碎片", type: "gain", effects: { items: ["陨墨星传承碎片"] } },
    { text: "觉醒特殊血统，体内涌现神秘力量", type: "breakthrough", effects: { realm: 1 } },
    { text: "在荒野区与罗峰擦肩而过", type: "normal" },
    { text: "被柳河镇压，肉身爆碎身亡", type: "death", effects: { deathType: "被柳河灭杀" } },
    { text: "加入雷电武馆，获得基础修炼资源", type: "normal" },
    { text: "平平无奇，每日修炼度日", type: "normal" }
  ],
  // #2 修炼起步
  [
    { text: "突破至行星级一阶，念力大增", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得《九重雷刀》前三层修炼图谱", type: "gain", effects: { items: ["九重雷刀·三层"] } },
    { text: "在荒野区奇遇中获得遁天梭雏形", type: "gain", effects: { items: ["遁天梭·雏形"] } },
    { text: "被九头蛇龙突袭，灵魂直接被撕裂湮灭", type: "death", effects: { deathType: "被九头蛇龙灵魂灭杀" } },
    { text: "被洪看中，收为记名弟子", type: "tag", effects: { tags: ["洪的弟子"] } },
    { text: "修炼精神念师基础法门", type: "normal" },
    { text: "在荒野区历练稳步提升", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #3 特殊经历
  [
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +2！", type: "special", effects: { specialExp: 2 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } }
  ],
  // #4 地球危机
  [
    { text: "金角巨兽降临地球，你被余波震伤", type: "normal" },
    { text: "参与地球保卫战，获得战功奖励", type: "gain", effects: { items: ["地球保卫战勋章"] } },
    { text: "获得黑神套装基础版（破损）", type: "gain", effects: { items: ["黑神套装·破损"] } },
    { text: "被金角巨兽尾部扫中，身躯化为肉泥", type: "death", effects: { deathType: "被金角巨兽灭杀" } },
    { text: "进入9号古文明遗迹外围", type: "normal" },
    { text: "获得生命果实一颗", type: "gain", effects: { items: ["生命果实"] } },
    { text: "被遗迹中触手怪灵魂灭杀", type: "death", effects: { deathType: "被遗迹触手怪灵魂灭杀" } },
    { text: "普通事件", type: "normal" }
  ],
  // #5 境界成长
  [
    { text: "突破恒星级一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "罗峰夺舍金角巨兽传闻传入你耳中", type: "normal" },
    { text: "突破宇宙级一阶（提前突破，难得机遇）", type: "breakthrough", effects: { realm: 2 } },
    { text: "获得陨墨星完整传承记忆", type: "tag", effects: { tags: ["陨墨星传承"] } },
    { text: "普通修炼稳步提升", type: "normal" },
    { text: "普通修炼稳步提升", type: "normal" },
    { text: "普通修炼稳步提升", type: "normal" },
    { text: "普通修炼稳步提升", type: "normal" }
  ],
  // #6 重大抉择
  [
    { text: "拜入陨墨星门下，继承呼延博传承", type: "tag", effects: { tags: ["陨墨星弟子", "有传承"] } },
    { text: "获得衍神兵（精神念师至宝雏形）", type: "gain", effects: { items: ["衍神兵·雏形"] } },
    { text: "进入宇宙秘境边缘探索", type: "normal" },
    { text: "被神秘夺舍者灵魂吞噬，意识消散", type: "death", effects: { deathType: "被夺舍灭杀" } },
    { text: "在宇宙佣兵联盟注册身份", type: "normal" },
    { text: "获得行星级战衣", type: "gain", effects: { items: ["行星级战衣"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #7 秘境探索
  [
    { text: "进入9号古文明遗迹深处", type: "gain", effects: { items: ["古文明遗迹钥匙"] } },
    { text: "发现陨墨星飞船主舰", type: "tag", effects: { tags: ["陨墨星传承"] } },
    { text: "获得完整遁天梭！", type: "gain", effects: { items: ["遁天梭"] } },
    { text: "获得黑神套装完整版本", type: "gain", effects: { items: ["黑神套装"] } },
    { text: "获得生命果实三颗", type: "gain", effects: { items: ["生命果实×3"] } },
    { text: "发现呼延博留下的修炼笔记", type: "tag", effects: { tags: ["呼延博笔记"] } },
    { text: "被遗迹中防御系统灵魂灭杀", type: "death", effects: { deathType: "被遗迹防御系统灭杀" } },
    { text: "普通修炼", type: "normal" }
  ],
  // #8 境界判定
  [
    { text: "检查境界：行星级及以上，状态正常", type: "normal" },
    { text: "检查境界：未达行星级，危机临近", type: "tag", effects: { deathCheck: true } },
    { text: "检查境界：恒星级！实力远超保底", type: "breakthrough", effects: { realm: 0 } },
    { text: "检查境界：未达行星级，需谨慎行事", type: "tag", effects: { deathCheck: true } },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #9 最后成长
  [
    { text: "突破恒星级二阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "突破宇宙级一阶（罕见突破）", type: "breakthrough", effects: { realm: 2 } },
    { text: "获得宇宙级飞船模型图纸", type: "gain", effects: { items: ["宇宙飞船图纸"] } },
    { text: "获得宇宙级修炼秘法一本", type: "gain", effects: { items: ["宇宙级秘法"] } },
    { text: "被外星探险者奴役，沦为玩物", type: "death", effects: { deathType: "被奴役意识消亡" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #10 阶段结局
  [
    { text: "加入虚拟宇宙公司，获得大势力庇护", type: "stageState", effects: { stageState: "s1_company" } },
    { text: "成为宇宙独行者，自由闯荡", type: "stageState", effects: { stageState: "s1_loner" } }
  ]
];

// ===== 阶段2：罗峰宇宙闯荡时期 =====
const STAGE2_WHEELS = [
  // #1 初入宇宙
  [
    { text: "加入虚拟宇宙公司，获得修炼资源", type: "tag", effects: { tags: ["虚拟宇宙弟子"] } },
    { text: "加入巨斧斗武场，接受残酷训练", type: "tag", effects: { tags: ["巨斧斗武场成员"] } },
    { text: "加入宇宙第一银行，获得经济资源", type: "normal" },
    { text: "成为宇宙佣兵，自由接取任务", type: "normal" },
    { text: "被宇宙海盗围攻，肉身被离子炮轰灭", type: "death", effects: { deathType: "被宇宙海盗离子炮轰灭" } },
    { text: "获得基础宇宙飞船·黑龙山X81", type: "gain", effects: { items: ["黑龙山X81飞船"] } },
    { text: "被神秘灵魂大师灭杀灵魂", type: "death", effects: { deathType: "被灵魂大师灭杀" } },
    { text: "普通宇宙旅行", type: "normal" }
  ],
  // #2 成长之路
  [
    { text: "突破域主级一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得陨墨星完整传承深度记忆", type: "tag", effects: { tags: ["陨墨星完整传承"] } },
    { text: "进入虚拟宇宙公司天才战预选", type: "normal" },
    { text: "进入原始秘境边缘地带", type: "normal" },
    { text: "获得黑神套装·宇宙级强化版", type: "gain", effects: { items: ["黑神套装·强化"] } },
    { text: "获得古文明遗迹坐标", type: "gain", effects: { items: ["古文明遗迹坐标"] } },
    { text: "被异星域主级强者追杀至灵魂湮灭", type: "death", effects: { deathType: "被异星域主灭杀" } },
    { text: "普通修炼", type: "normal" }
  ],
  // #3 特殊经历
  [
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +2！", type: "special", effects: { specialExp: 2 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } }
  ],
  // #4 宇宙天才战
  [
    { text: "进入天才战前1000名", type: "gain", effects: { items: ["天才战勋章·千名"] } },
    { text: "进入天才战前100名！", type: "gain", effects: { items: ["天才战勋章·百名"] } },
    { text: "进入天才战前10名，被宇宙高层关注", type: "tag", effects: { tags: ["天才战·十强"] } },
    { text: "在天才战中与罗峰相遇并成为朋友", type: "tag", effects: { tags: ["罗峰朋友"] } },
    { text: "在天才战中被异族天才灵魂灭杀", type: "death", effects: { deathType: "被异族天才灭杀" } },
    { text: "在天才战中被虫族天才夺舍", type: "death", effects: { deathType: "被虫族夺舍" } },
    { text: "获得普通名次奖励", type: "normal" },
    { text: "普通名次", type: "normal" }
  ],
  // #5 拜师之路
  [
    { text: "拜入混沌城主门下（核心弟子）！", type: "tag", effects: { tags: ["混沌城主弟子", "有传承"] } },
    { text: "成为某宇宙尊者记名弟子", type: "tag", effects: { tags: ["宇宙尊者弟子"] } },
    { text: "获得域主级完整传承", type: "tag", effects: { tags: ["有传承"] } },
    { text: "突破界主级一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得弑吴羽翼（至宝·第一对羽翼）", type: "gain", effects: { items: ["弑吴羽翼"] } },
    { text: "被仇家界主级强者灭杀", type: "death", effects: { deathType: "被仇家界主灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #6 原始秘境
  [
    { text: "进入虚拟宇宙公司原始秘境核心区", type: "normal" },
    { text: "获得域主级重宝·血洛晶一枚", type: "gain", effects: { items: ["血洛晶"] } },
    { text: "获得界主级战衣", type: "gain", effects: { items: ["界主级战衣"] } },
    { text: "在秘境中被空间乱流绞杀", type: "death", effects: { deathType: "被空间乱流绞杀" } },
    { text: "发现不朽级传承入口", type: "tag", effects: { tags: ["不朽传承线索"] } },
    { text: "获得域主级秘法典籍", type: "gain", effects: { items: ["域主级秘法"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #7 罗峰关系
  [
    { text: "与罗峰相遇，结为生死兄弟！", type: "tag", effects: { tags: ["罗峰盟友"] } },
    { text: "与罗峰相遇，因利益冲突成为敌人", type: "tag", effects: { tags: ["罗峰仇敌"] } },
    { text: "与罗峰相遇，点头之交", type: "normal" },
    { text: "与罗峰相遇，共同探索秘境", type: "tag", effects: { tags: ["罗峰朋友"] } },
    { text: "与罗峰相遇，罗峰赠予你一件宝物", type: "gain", effects: { items: ["罗峰赠礼"] } },
    { text: "因嫉妒罗峰而暗下杀手，反被灭杀", type: "death", effects: { deathType: "被罗峰反杀" } },
    { text: "与罗峰相遇，普通朋友", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #8 境界判定
  [
    { text: "检查境界：宇宙级及以上，状态正常", type: "normal" },
    { text: "检查境界：未达宇宙级，危机临近", type: "tag", effects: { deathCheck: true } },
    { text: "检查境界：域主及以上，实力稳固", type: "breakthrough", effects: { realm: 0 } },
    { text: "检查境界：未达宇宙级，需谨慎行事", type: "tag", effects: { deathCheck: true } },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #9 成长突破
  [
    { text: "突破界主级二阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得界主级宝物·兽神雕像", type: "gain", effects: { items: ["兽神雕像"] } },
    { text: "获得界主级秘法·兽神七杀", type: "gain", effects: { items: ["兽神七杀"] } },
    { text: "获得界主级完整传承", type: "tag", effects: { tags: ["有传承"] } },
    { text: "被异族群族界主级强者灭杀", type: "death", effects: { deathType: "被异族群族界主灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #10 阶段结局
  [
    { text: "前往域外战场参战，积累战功", type: "stageState", effects: { stageState: "s2_battlefield" } },
    { text: "留在原始秘境修炼，突破境界", type: "stageState", effects: { stageState: "s2_secret" } }
  ]
];

// ===== 阶段3：域外战场时期 =====
const STAGE3_WHEELS = [
  // #1 初入战场
  [
    { text: "斩杀异族界主，获得战功勋章", type: "gain", effects: { items: ["战功勋章"] } },
    { text: "斩杀异族界主，获得战衣宝物", type: "gain", effects: { items: ["战场战衣"] } },
    { text: "获得封王不朽战甲残片", type: "gain", effects: { items: ["封王战甲残片"] } },
    { text: "被异族封王不朽级强者一击灭杀", type: "death", effects: { deathType: "被异族封王灭杀" } },
    { text: "获得战功奖励资源", type: "normal" },
    { text: "获得战场功勋积分", type: "normal" },
    { text: "被虫族母巢吞噬，化为养料", type: "death", effects: { deathType: "被虫族母巢吞噬" } },
    { text: "普通战场历练", type: "normal" }
  ],
  // #2 战场突破
  [
    { text: "突破不朽军主级！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得不朽级宝物·空间戒指", type: "gain", effects: { items: ["空间戒指·不朽级"] } },
    { text: "获得不朽级秘法", type: "gain", effects: { items: ["不朽级秘法"] } },
    { text: "被异族封王级高手灵魂灭杀", type: "death", effects: { deathType: "被异族封王灵魂灭杀" } },
    { text: "获得封王不朽战功", type: "normal" },
    { text: "被混沌城主关注", type: "tag", effects: { tags: ["混沌城主关注"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通战斗", type: "normal" }
  ],
  // #3 特殊经历
  [
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +2！", type: "special", effects: { specialExp: 2 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } }
  ],
  // #4 封侯之路
  [
    { text: "突破封侯不朽！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得封侯不朽级宝物", type: "gain", effects: { items: ["封侯级宝物"] } },
    { text: "获得原始星钥匙·碎片", type: "gain", effects: { items: ["原始星钥匙·碎片"] } },
    { text: "被异族封王巅峰强者灭杀", type: "death", effects: { deathType: "被异族封王巅峰灭杀" } },
    { text: "被机械族改造为战争兵器，意识消亡", type: "death", effects: { deathType: "被机械族改造" } },
    { text: "获得封侯战功奖励", type: "normal" },
    { text: "获得封侯级突破资源", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #5 战场厮杀
  [
    { text: "参与封王级战团混战，全身而退", type: "normal" },
    { text: "斩杀三名异族封侯，获得大量战功", type: "gain", effects: { items: ["封侯战功·大量"] } },
    { text: "被异族群族封王级强者围攻灭杀", type: "death", effects: { deathType: "被异族群族封王围杀" } },
    { text: "获得原始星宝物碎片", type: "gain", effects: { items: ["原始星宝物碎片"] } },
    { text: "被混沌城主召见，获得修炼指点", type: "tag", effects: { tags: ["混沌城主指点"] } },
    { text: "突破封王不朽级！", type: "breakthrough", effects: { realm: 1 } },
    { text: "普通战场", type: "normal" },
    { text: "普通战斗", type: "normal" }
  ],
  // #6 原始星名额
  [
    { text: "获得原始星进入权限·银色令牌", type: "gain", effects: { items: ["原始星令牌·银"] } },
    { text: "获得原始星进入权限·金色令牌！", type: "gain", effects: { items: ["原始星令牌·金"] } },
    { text: "被异族封王联手围攻灭杀", type: "death", effects: { deathType: "被异族封王联手灭杀" } },
    { text: "获得原始星内部地图", type: "gain", effects: { items: ["原始星地图"] } },
    { text: "获得传承殿召见资格", type: "tag", effects: { tags: ["传承殿资格"] } },
    { text: "获得封王巅峰级突破资源", type: "normal" },
    { text: "获得宇宙尊者传承线索", type: "tag", effects: { tags: ["宇宙尊者传承线索"] } },
    { text: "普通修炼", type: "normal" }
  ],
  // #7 成长之路
  [
    { text: "突破封王不朽巅峰！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得封王级至宝·封王战甲", type: "gain", effects: { items: ["封王战甲"] } },
    { text: "获得封王级秘法完整版本", type: "gain", effects: { items: ["封王级秘法"] } },
    { text: "被异族群族封王极限强者灭杀", type: "death", effects: { deathType: "被异族封王极限灭杀" } },
    { text: "获得混沌城主亲传弟子资格", type: "tag", effects: { tags: ["混沌城主亲传"] } },
    { text: "突破宇宙尊者（极难，需特殊机缘）", type: "breakthrough", effects: { realm: 1 } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #8 境界判定
  [
    { text: "检查境界：不朽军主及以上，状态正常", type: "normal" },
    { text: "检查境界：未达不朽军主，危机临近", type: "tag", effects: { deathCheck: true } },
    { text: "检查境界：封侯及以上，实力稳固", type: "normal" },
    { text: "检查境界：未达不朽军主，需谨慎行事", type: "tag", effects: { deathCheck: true } },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #9 封王之路
  [
    { text: "封王巅峰，感应到宇宙尊者门槛", type: "breakthrough", effects: { realm: 0 } },
    { text: "获得宇宙尊者级传承线索", type: "tag", effects: { tags: ["宇宙尊者传承线索"] } },
    { text: "获得原始星·核心区域通行证", type: "gain", effects: { items: ["原始星核心通行证"] } },
    { text: "被异族群族宇宙尊者级强者灭杀", type: "death", effects: { deathType: "被异族宇宙尊者灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通战场", type: "normal" },
    { text: "普通战场", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #10 阶段结局
  [
    { text: "进入原始星，争夺至宝", type: "stageState", effects: { stageState: "s3_star" } },
    { text: "留在混沌城修炼，稳固境界", type: "stageState", effects: { stageState: "s3_city" } }
  ]
];

// ===== 阶段4：原始星时期 =====
const STAGE4_WHEELS = [
  // #1 初入原始星
  [
    { text: "获得原始星宝物·宇宙晶大量", type: "gain", effects: { items: ["宇宙晶·大量"] } },
    { text: "被异族宇宙尊者突袭灭杀", type: "death", effects: { deathType: "被异族宇宙尊者突袭灭杀" } },
    { text: "争夺原始星宝物，获得至宝碎片", type: "gain", effects: { items: ["至宝碎片"] } },
    { text: "发现原始星秘境入口", type: "normal" },
    { text: "获得宇宙尊者级战衣", type: "gain", effects: { items: ["尊者级战衣"] } },
    { text: "被原始星空间风暴撕碎", type: "death", effects: { deathType: "被原始星空间风暴撕碎" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通探索", type: "normal" }
  ],
  // #2 尊者之路
  [
    { text: "突破宇宙尊者一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得宇宙尊者级传承", type: "tag", effects: { tags: ["宇宙尊者传承"] } },
    { text: "获得原始星宝物·宇宙本源晶石", type: "gain", effects: { items: ["宇宙本源晶石"] } },
    { text: "获得星辰塔（至宝·镇封类，雏形）", type: "gain", effects: { items: ["星辰塔·雏形"] } },
    { text: "被异族宇宙尊者联手灭杀", type: "death", effects: { deathType: "被异族宇宙尊者联手灭杀" } },
    { text: "获得至强至宝碎片", type: "gain", effects: { items: ["至强至宝碎片"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #3 特殊经历
  [
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +2！", type: "special", effects: { specialExp: 2 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } }
  ],
  // #4 至宝争夺
  [
    { text: "获得至强至宝碎片·3块", type: "gain", effects: { items: ["至强至宝碎片×3"] } },
    { text: "参与至宝争夺战，险死还生", type: "normal" },
    { text: "突破宇宙霸主一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得原始星核心宝物", type: "gain", effects: { items: ["原始星核心宝物"] } },
    { text: "被异族宇宙霸主灭杀", type: "death", effects: { deathType: "被异族宇宙霸主灭杀" } },
    { text: "被混沌城主召见，给予至宝线索", type: "tag", effects: { tags: ["混沌城主赐宝线索"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通争夺", type: "normal" }
  ],
  // #5 宇宙霸主之路
  [
    { text: "突破宇宙霸主二阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得宇宙霸主级秘法", type: "gain", effects: { items: ["霸主级秘法"] } },
    { text: "获得宇宙霸主级宝物", type: "gain", effects: { items: ["霸主级宝物"] } },
    { text: "被异族群族宇宙霸主联手灭杀", type: "death", effects: { deathType: "被异族群族宇宙霸主联手灭杀" } },
    { text: "原始星深处奇遇", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #6 罗峰相遇
  [
    { text: "与罗峰相遇，罗峰赠予你至宝碎片", type: "tag", effects: { tags: ["罗峰盟友"], items: ["至宝碎片·罗峰赠"] } },
    { text: "与罗峰相遇，因至宝反目成敌", type: "tag", effects: { tags: ["罗峰仇敌"] } },
    { text: "与罗峰相遇，共同探索原始星深处", type: "tag", effects: { tags: ["罗峰朋友"] } },
    { text: "与罗峰相遇，联手对抗异族", type: "tag", effects: { tags: ["罗峰盟友"] } },
    { text: "与罗峰相遇，普通朋友", type: "normal" },
    { text: "暗害罗峰未果，反被其灭杀", type: "death", effects: { deathType: "被罗峰反杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #7 成长之路
  [
    { text: "获得完整弑吴羽翼（至宝·飞行类）", type: "gain", effects: { items: ["弑吴羽翼·完整"] } },
    { text: "获得至强至宝碎片大量", type: "gain", effects: { items: ["至强至宝碎片·大量"] } },
    { text: "突破宇宙之主（极难，低概率）", type: "breakthrough", effects: { realm: 1 } },
    { text: "被异族群族宇宙霸主联手围攻灭杀", type: "death", effects: { deathType: "被异族群族宇宙霸主围攻灭杀" } },
    { text: "获得宇宙级本源法则感悟", type: "tag", effects: { tags: ["本源法则感悟"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #8 境界判定
  [
    { text: "检查境界：宇宙尊者及以上，状态正常", type: "normal" },
    { text: "检查境界：未达宇宙尊者，危机临近", type: "tag", effects: { deathCheck: true } },
    { text: "检查境界：宇宙霸主及以上，实力稳固", type: "normal" },
    { text: "检查境界：未达宇宙尊者，需谨慎行事", type: "tag", effects: { deathCheck: true } },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #9 最后突破
  [
    { text: "突破宇宙霸主巅峰！", type: "breakthrough", effects: { realm: 1 } },
    { text: "宇宙之主突破尝试，感悟加深", type: "tag", effects: { tags: ["宇宙之主感悟"] } },
    { text: "获得宇宙级本源宝物", type: "gain", effects: { items: ["宇宙本源宝物"] } },
    { text: "获得宇宙级完整秘法", type: "gain", effects: { items: ["宇宙级完整秘法"] } },
    { text: "被异族宇宙之主级强者灭杀", type: "death", effects: { deathType: "被异族宇宙之主灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #10 阶段结局
  [
    { text: "进入宇宙海，冒险探索", type: "stageState", effects: { stageState: "s4_sea" } },
    { text: "留在原始宇宙，稳固势力", type: "stageState", effects: { stageState: "s4_universe" } }
  ]
];

// ===== 阶段5：宇宙海时期 =====
const STAGE5_WHEELS = [
  // #1 初入宇宙海
  [
    { text: "发现宇宙舟残片坐标", type: "gain", effects: { items: ["宇宙舟坐标"] } },
    { text: "发现断东河传承入口线索", type: "tag", effects: { tags: ["断东河线索"] } },
    { text: "获得宇宙海宝物·宇宙灵泉", type: "gain", effects: { items: ["宇宙灵泉"] } },
    { text: "遭遇异族宇宙之主战团，艰难逃脱", type: "normal" },
    { text: "被异族宇宙之主级强者灭杀", type: "death", effects: { deathType: "被异族宇宙之主灭杀" } },
    { text: "获得宇宙之主级宝物", type: "gain", effects: { items: ["宇宙之主级宝物"] } },
    { text: "被宇宙海空间乱流绞杀", type: "death", effects: { deathType: "被宇宙海空间乱流绞杀" } },
    { text: "普通探索", type: "normal" }
  ],
  // #2 宇宙之主之路
  [
    { text: "突破宇宙之主一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得宇宙之主级完整秘法", type: "gain", effects: { items: ["宇宙之主级秘法"] } },
    { text: "宇宙海深处奇遇", type: "normal" },
    { text: "获得断东河传承·资格令牌", type: "gain", effects: { items: ["断东河传承令牌"] } },
    { text: "被断东河传承考验灭杀", type: "death", effects: { deathType: "被断东河传承考验灭杀" } },
    { text: "获得宇宙之主级宝物", type: "gain", effects: { items: ["宇宙之主级宝物2"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #3 特殊经历
  [
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +2！", type: "special", effects: { specialExp: 2 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } }
  ],
  // #4 断东河传承
  [
    { text: "获得断东河传承·第三层次", type: "tag", effects: { tags: ["断东河传承·第三层"] } },
    { text: "获得断东河秘法·灵魂攻击篇", type: "gain", effects: { items: ["断东河秘法·灵魂篇"] } },
    { text: "宇宙海深处奇遇（与罗峰同行）", type: "tag", effects: { tags: ["罗峰朋友"] } },
    { text: "被断东河传承第四层考验灭杀", type: "death", effects: { deathType: "被断东河传承第四层灭杀" } },
    { text: "获得断东河传承宝物", type: "gain", effects: { items: ["断东河宝物"] } },
    { text: "被异族宇宙之主在传承地伏击灭杀", type: "death", effects: { deathType: "被异族宇宙之主伏击灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #5 真神之路
  [
    { text: "突破真神一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得真神级秘法·兽神之道", type: "gain", effects: { items: ["兽神之道秘法"] } },
    { text: "获得真神级宝物", type: "gain", effects: { items: ["真神级宝物"] } },
    { text: "被异族宇宙之主极限强者灭杀", type: "death", effects: { deathType: "被异族宇宙之主极限灭杀" } },
    { text: "获得宇宙舟核心宝物线索", type: "tag", effects: { tags: ["宇宙舟核心线索"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #6 罗峰相遇
  [
    { text: "与罗峰相遇，结为盟友共闯宇宙海", type: "tag", effects: { tags: ["罗峰盟友"] } },
    { text: "与罗峰相遇，因至宝反目成敌", type: "tag", effects: { tags: ["罗峰仇敌"] } },
    { text: "与罗峰相遇，获得罗峰赠予断东河传承线索", type: "gain", effects: { items: ["断东河线索·罗峰赠"] } },
    { text: "与罗峰相遇，联手对抗界兽先遣队", type: "tag", effects: { tags: ["罗峰盟友", "对抗界兽"] } },
    { text: "与罗峰相遇，普通朋友", type: "normal" },
    { text: "暗害罗峰未果，反被其灭杀", type: "death", effects: { deathType: "被罗峰反杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #7 界兽初现
  [
    { text: "发现界兽踪迹，获得界兽情报", type: "tag", effects: { tags: ["界兽情报"] } },
    { text: "界兽小规模战团遭遇战，击退敌人", type: "normal" },
    { text: "获得界兽相关宝物", type: "gain", effects: { items: ["界兽宝物"] } },
    { text: "获得宇宙级本源宝物", type: "gain", effects: { items: ["宇宙级本源宝物"] } },
    { text: "被界兽小队长灭杀", type: "death", effects: { deathType: "被界兽小队长灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #8 境界判定
  [
    { text: "检查境界：宇宙之主及以上，状态正常", type: "normal" },
    { text: "检查境界：未达宇宙之主，危机临近", type: "tag", effects: { deathCheck: true } },
    { text: "检查境界：真神及以上，实力稳固", type: "normal" },
    { text: "检查境界：未达宇宙之主，需谨慎行事", type: "tag", effects: { deathCheck: true } },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #9 最后的突破
  [
    { text: "突破真神二阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "突破虚空真神（极难，需特殊机缘）", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得真神级宝物·真神之心", type: "gain", effects: { items: ["真神之心"] } },
    { text: "获得真神级完整秘法", type: "gain", effects: { items: ["真神级完整秘法"] } },
    { text: "被界兽王者灭杀", type: "death", effects: { deathType: "被界兽王者灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #10 阶段结局
  [
    { text: "与罗峰共同对抗界兽，生死与共", type: "stageState", effects: { stageState: "s5_fight" } },
    { text: "远离界兽危机，中立观望自保", type: "stageState", effects: { stageState: "s5_neutral" } }
  ]
];

// ===== 阶段6：界兽危机时期 =====
const STAGE6_WHEELS = [
  // #1 界兽降临
  [
    { text: "界兽大军出现，参与对抗战", type: "normal" },
    { text: "被界兽王者一掌灭杀", type: "death", effects: { deathType: "被界兽王者灭杀" } },
    { text: "对抗界兽前锋，获得战功", type: "gain", effects: { items: ["对抗界兽战功"] } },
    { text: "获得界兽宝物·界兽之核", type: "gain", effects: { items: ["界兽之核"] } },
    { text: "获得宇宙级本源宝物", type: "gain", effects: { items: ["宇宙本源宝物2"] } },
    { text: "被界兽灵魂灭杀，意识消散", type: "death", effects: { deathType: "被界兽灵魂灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #2 真神突破
  [
    { text: "突破虚空真神一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得虚空真神级秘法", type: "gain", effects: { items: ["虚空真神级秘法"] } },
    { text: "获得真神级宝物", type: "gain", effects: { items: ["真神级宝物2"] } },
    { text: "被界兽将军灭杀", type: "death", effects: { deathType: "被界兽将军灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #3 特殊经历
  [
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +2！", type: "special", effects: { specialExp: 2 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +0", type: "special", effects: { specialExp: 0 } },
    { text: "特殊经历 +1", type: "special", effects: { specialExp: 1 } }
  ],
  // #4 界兽决战
  [
    { text: "对抗界兽大军前锋，斩杀三名界兽将军", type: "breakthrough", effects: { realm: 0 } },
    { text: "对抗界兽大军，获得大量战功", type: "gain", effects: { items: ["界兽战功·大量"] } },
    { text: "被界兽王者灭杀", type: "death", effects: { deathType: "被界兽王者灭杀" } },
    { text: "获得界兽宝物大量", type: "gain", effects: { items: ["界兽宝物·大量"] } },
    { text: "获得界兽宝物·界兽之心", type: "gain", effects: { items: ["界兽之心2"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #5 永恒之路
  [
    { text: "突破永恒真神一阶！", type: "breakthrough", effects: { realm: 1 } },
    { text: "获得永恒真神级宝物", type: "gain", effects: { items: ["永恒级宝物"] } },
    { text: "被界兽王者灭杀", type: "death", effects: { deathType: "被界兽王者灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #6 抉择之路
  [
    { text: "与罗峰联手对抗界兽王者", type: "tag", effects: { tags: ["罗峰盟友", "对抗界兽"] } },
    { text: "与界兽王者联手对付罗峰", type: "tag", effects: { tags: ["罗峰仇敌", "界兽盟友"] } },
    { text: "独自对抗界兽王者", type: "tag", effects: { tags: ["对抗界兽"] } },
    { text: "逃离战场，远离纷争", type: "tag", effects: { tags: ["中立者"] } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #7 境界判定
  [
    { text: "检查境界：真神及以上，状态正常", type: "normal" },
    { text: "检查境界：未达真神，危机临近", type: "tag", effects: { deathCheck: true } },
    { text: "检查境界：虚空真神及以上，实力稳固", type: "normal" },
    { text: "检查境界：未达真神，需谨慎行事", type: "tag", effects: { deathCheck: true } },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" },
    { text: "普通事件", type: "normal" }
  ],
  // #8 最终决战
  [
    { text: "与罗峰共战界兽王者，并肩作战", type: "tag", effects: { tags: ["罗峰盟友"] } },
    { text: "与界兽联手对抗罗峰，背叛宇宙", type: "tag", effects: { tags: ["界兽盟友", "罗峰仇敌"] } },
    { text: "旁观最终决战，明哲保身", type: "tag", effects: { tags: ["中立者"] } },
    { text: "在决战中被界兽灭杀", type: "death", effects: { deathType: "在最终决战中被界兽灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #9 最后突破
  [
    { text: "突破永恒真神巅峰！", type: "breakthrough", effects: { realm: 2 } },
    { text: "获得永恒级本源宝物", type: "gain", effects: { items: ["永恒本源宝物"] } },
    { text: "被界兽王者在决战中灭杀", type: "death", effects: { deathType: "在决战中被界兽王者灭杀" } },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" },
    { text: "普通修炼", type: "normal" }
  ],
  // #10 最终结局
  [
    { text: "✦ 命运的指引 · 最终结局判定 ✦", type: "ending" }
  ]
];

// ===== 汇总所有阶段转盘 =====
const ALL_STAGE_WHEELS = [
  STAGE1_WHEELS,
  STAGE2_WHEELS,
  STAGE3_WHEELS,
  STAGE4_WHEELS,
  STAGE5_WHEELS,
  STAGE6_WHEELS
];

// ===== 4. 特殊经历转盘（随机到后，下1转盘触发特殊事件） =====
const SPECIAL_WHEEL = [
  { text: "🌟 奇遇：发现远古遗迹！", type: "gain", effects: { items: ["远古遗迹地图"] }, category: "秘境" },
  { text: "🌟 奇遇：获得完整传承！", type: "tag", effects: { tags: ["奇遇传承"] }, category: "传承" },
  { text: "🌟 奇遇：获得重宝·黑神套装（完整）", type: "gain", effects: { items: ["重宝·黑神套装"] }, category: "重宝" },
  { text: "🌟 奇遇：获得至宝·弑吴羽翼（飞行类）", type: "gain", effects: { items: ["至宝·弑吴羽翼"] }, category: "至宝" },
  { text: "🌟 奇遇：获得至宝·星辰塔碎片（镇封类）", type: "gain", effects: { items: ["至宝·星辰塔碎片"] }, category: "至宝" },
  { text: "🌟 奇遇：获得重宝·血洛晶（修炼类）", type: "gain", effects: { items: ["重宝·血洛晶"] }, category: "重宝" },
  { text: "🌟 奇遇：进入神秘秘境历练！", type: "tag", effects: { tags: ["神秘秘境历练"] }, category: "秘境" },
  { text: "🌟 奇遇：境界突破 +1级！", type: "breakthrough", effects: { realm: 1 }, category: "突破" }
];

// 特殊经历·更危险版本（高风险高回报）
const SPECIAL_WHEEL_DANGER = [
  { text: "🔥 奇遇：获得重宝·黑神套装（完整）", type: "gain", effects: { items: ["重宝·黑神套装"] }, category: "重宝" },
  { text: "🔥 奇遇：获得至宝·弑吴羽翼（飞行类）", type: "gain", effects: { items: ["至宝·弑吴羽翼"] }, category: "至宝" },
  { text: "🔥 奇遇：获得至宝·星辰塔碎片（镇封类）", type: "gain", effects: { items: ["至宝·星辰塔碎片"] }, category: "至宝" },
  { text: "🔥 奇遇：获得至强至宝碎片！", type: "gain", effects: { items: ["至强至宝碎片"] }, category: "至宝" },
  { text: "🔥 奇遇：进入秘境·传承圣殿！", type: "tag", effects: { tags: ["传承圣殿历练"] }, category: "秘境" },
  { text: "🔥 奇遇：获得完整传承秘法！", type: "tag", effects: { tags: ["奇遇传承秘法"] }, category: "传承" },
  { text: "💀 遭遇神秘强者灭杀（死亡）", type: "death", effects: { deathType: "被神秘强者灭杀" }, category: "死亡" },
  { text: "⚡ 奇遇：境界突破 +2级！（极难）", type: "breakthrough", effects: { realm: 2 }, category: "突破" }
];

// 根据当前阶段返回对应的特殊经历转盘
function getSpecialWheel(stage) {
  if (stage >= 3) {
    // 域外战场及之后：高风险高回报版本
    return SPECIAL_WHEEL_DANGER;
  }
  return SPECIAL_WHEEL;
}

// ===== 5. 初始节点选择转盘 =====
const INIT_WHEEL = [
  { text: "穿越至·地球时期", stage: 1 },
  { text: "穿越至·罗峰宇宙闯荡时期", stage: 2 },
  { text: "穿越至·域外战场时期", stage: 3 },
  { text: "穿越至·原始星时期", stage: 4 },
  { text: "穿越至·宇宙海时期", stage: 5 },
  { text: "穿越至·界兽危机时期", stage: 6 }
];

// ===== 6. 9个结局判定 =====
const ENDINGS = [
  {
    id: 1,
    title: "🏆 结局1 · 永恒真神·与罗峰携手前往起源大陆",
    desc: "你成就永恒真神境界，与罗峰结为生死兄弟，共同对抗界兽危机。在最终决战中，你与罗峰并肩作战，界兽王者被你二人联手灭杀。宇宙和平之后，你们一同前往起源大陆，探寻更高层次的奥秘...\n\n【评价：最强主角路线】",
    check: (state) => state.realm >= 15 && state.tags.includes("罗峰盟友")
  },
  {
    id: 2,
    title: "💔 结局2 · 永恒真神·罗峰战死",
    desc: "你成就永恒真神境界，但罗峰在对抗界兽的战斗中不幸战死。你虽然存活下来，但失去了这位最强的战友，独自守护着残破的宇宙。每一个寂静的夜晚，你都会想起那位名叫罗峰的兄弟...\n\n【评价：悲剧英雄路线】",
    check: (state) => state.realm >= 15 && !state.tags.includes("罗峰盟友") && state.tags.includes("对抗界兽")
  },
  {
    id: 3,
    title: "😈 结局3 · 永恒真神·与界兽一起杀死罗峰",
    desc: "你成就永恒真神境界，但在关键时刻选择了背叛。你与界兽王者联手，将曾经可能成为盟友的罗峰灭杀在最终决战中。从此，你成为了宇宙的叛徒，与界兽一同统治着残破的宇宙...\n\n【评价：黑暗路线】",
    check: (state) => state.realm >= 15 && state.tags.includes("罗峰仇敌") && state.tags.includes("界兽盟友")
  },
  {
    id: 4,
    title: "⚰️ 结局4 · 死亡·被罗峰击杀",
    desc: "你选择了与罗峰为敌，在最终决战中被罗峰亲手灭杀。临死前，你看到罗峰那双冰冷的眼睛，心中充满了悔恨。如果你当初选择了不同的道路...\n\n【评价：死亡路线】",
    check: (state) => state.tags.includes("罗峰仇敌") && state.realm < 15
  },
  {
    id: 5,
    title: "💥 结局5 · 同归于尽·联合界兽与罗峰皆亡",
    desc: "你与界兽联手对付罗峰，但罗峰的强大超乎想象。最终三人在惊天动地的大决战中同归于尽，宇宙失去了三位最强者，陷入长久的混乱之中...\n\n【评价：毁灭路线】",
    check: (state) => state.tags.includes("罗峰仇敌") && state.tags.includes("界兽盟友") && state.realm >= 13
  },
  {
    id: 6,
    title: "👁 结局6 · 真神·旁观罗峰击杀界兽",
    desc: "你成就真神境界，但选择了中立自保。在最终决战中，你远远旁观着罗峰与界兽的惊天大战。罗峰最终灭杀了界兽王者，成为了宇宙最强者。你虽然存活，但失去了参与历史的机会...\n\n【评价：旁观者路线】",
    check: (state) => state.realm >= 13 && state.realm < 15 && state.tags.includes("中立者")
  },
  {
    id: 7,
    title: "💀 结局7 · 在击杀界兽前被罗峰杀死",
    desc: "你与罗峰为敌，但在界兽危机尚未解决时，就被罗峰视为更大的威胁而清除。在一次精心策划的伏击中，你被罗峰亲手灭杀，连最后的挣扎都显得那么无力...\n\n【评价：反派死亡路线】",
    check: (state) => state.tags.includes("罗峰仇敌") && state.realm < 15
  },
  {
    id: 8,
    title: "🍀 结局8 · 幸运儿·躲过所有死亡",
    desc: "你的境界不算高（" + getRealmName(0) + "），特殊经历累计达到了惊人的次数。你一次次从死亡边缘擦身而过，虽然没有参与最终决战的资格，但你活到了最后，见证了宇宙的重生。\n有时候，活着本身就是最大的胜利...\n\n【评价：幸运躺赢路线】",
    check: (state) => state.realm < 13 && state.specialExp >= 3
  },
  {
    id: 9,
    title: "⚱️ 结局9 · 中途死亡·游戏结束",
    desc: "你的传奇在中途就戛然而止。死亡的方式多种多样：被强者灭杀、被灵魂夺舍、被空间绞杀、被界兽吞噬...\n\n吞噬宇宙是残酷的，只有真正的强者才能走到最后。\n\n【评价：失败路线】",
    check: (state) => state.isDead
  }
];