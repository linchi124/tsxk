// ==========================================
// 吞噬星空·转盘人生 - 游戏逻辑
// ==========================================

// ===== 游戏状态 =====
const gameState = {
  phase: "init",           // init | selecting | playing | special | ending
  currentStage: 0,         // 当前阶段 (1-6)，0表示未选择
  currentWheel: 0,         // 当前阶段中的转盘序号 (0-9)
  totalWheels: 0,          // 累计转盘数
  realm: 1,                // 当前境界等级 (1-15)
  items: [],               // 宝物列表
  tags: [],                // 标签列表
  stageStates: [],         // 阶段状态记录
  specialExp: 0,           // 特殊经历次数（累计）
  pendingSpecialWheels: 0, // 待触发的特殊经历转盘数
  specialWheelCount: 0,    // 已触发的特殊经历转盘次数
  isDead: false,           // 是否死亡
  deathType: "",           // 死亡方式
  deathModifier: 0,        // 死亡选项调整（+1表示多一个死亡，-1表示少一个）
  isSpinning: false,       // 是否正在旋转
  specialWheelActive: false, // 当前是否在执行特殊经历转盘
  selectedIndex: -1        // 当前选中的选项索引（用于高亮）
};

// ===== DOM 元素 =====
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const restartBtn = document.getElementById("restartBtn");
const resultText = document.getElementById("resultText");
const logContent = document.getElementById("logContent");
const endingModal = document.getElementById("endingModal");
const endingTitle = document.getElementById("endingTitle");
const endingDesc = document.getElementById("endingDesc");
const closeModalBtn = document.getElementById("closeModalBtn");

// 转盘配置
let currentOptions = [];
let currentAngle = 0;
const CANVAS_SIZE = canvas.width;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = CENTER - 20;

// 颜色池（极简浅色风格）
const COLORS = [
  "#a8c5e6", "#e6a8a8", "#c5e6a8", "#e6d4a8",
  "#d4a8e6", "#a8e6e6", "#e6a8c5", "#c5c5e6"
];
const DEATH_COLOR = "#e8b8b8";

// ===== 工具函数 =====
// 加权随机选择
function weightedRandomIndex(weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

// 根据选项类型生成权重（阶段选择转盘）
function getStageWeights(options) {
  // 阶段选择时按指定权重
  const weightMap = {
    1: 35, 2: 30, 3: 15, 4: 10, 5: 8, 6: 2
  };
  return options.map(opt => weightMap[opt.stage] || 1);
}

// 根据选项类型生成权重（普通转盘）
function getNormalWeights(options, hasDeath) {
  // 基础权重为 1
  // 死亡选项权重降低
  return options.map(opt => {
    if (opt.type === "death") {
      // 如果转盘里有死亡内容，降低概率
      return hasDeath ? 0.3 : 1;
    }
    return 1;
  });
}

function addLog(text, type = "log-info") {
  const entry = document.createElement("div");
  entry.className = "log-entry " + type;
  entry.innerHTML = text;
  logContent.insertBefore(entry, logContent.firstChild);
  // 限制日志数量
  while (logContent.children.length > 50) {
    logContent.removeChild(logContent.lastChild);
  }
}

function getStageById(id) {
  return STAGES.find(s => s.id === id);
}

function getRealmDisplay() {
  if (gameState.realm < 1) return "凡人";
  if (gameState.realm > 15) return "起源境";
  return getRealmName(gameState.realm);
}

function updateUI() {
  // 更新状态面板
  document.getElementById("realmValue").textContent = getRealmDisplay();
  document.getElementById("stageValue").textContent =
    gameState.currentStage > 0 ? getStageById(gameState.currentStage).name : "未开始";
  document.getElementById("progressValue").textContent =
    gameState.totalWheels + " / 60";
  document.getElementById("specialExpValue").textContent =
    gameState.specialExp + " (已触发: " + gameState.specialWheelCount + "次)";
  document.getElementById("deathCountValue").textContent =
    "基础2" + (gameState.deathModifier > 0 ? " +" + gameState.deathModifier :
                 gameState.deathModifier < 0 ? " " + gameState.deathModifier : "");

  // 更新宝物列表
  const itemList = document.getElementById("itemList");
  if (gameState.items.length === 0) {
    itemList.innerHTML = '<span class="empty">暂无</span>';
  } else {
    itemList.innerHTML = gameState.items
      .map(item => '<span class="tag-item item">' + item + '</span>')
      .join("");
  }

  // 更新标签列表
  const tagList = document.getElementById("tagList");
  if (gameState.tags.length === 0) {
    tagList.innerHTML = '<span class="empty">暂无</span>';
  } else {
    tagList.innerHTML = gameState.tags
      .map(tag => '<span class="tag-item tag">' + tag + '</span>')
      .join("");
  }

  // 更新阶段状态
  const stateList = document.getElementById("stageStateList");
  if (gameState.stageStates.length === 0) {
    stateList.innerHTML = '<span class="empty">暂无</span>';
  } else {
    stateList.innerHTML = gameState.stageStates
      .map(s => '<span class="tag-item state">' + s + '</span>')
      .join("");
  }

  // 高亮当前阶段
  document.querySelectorAll(".stage-item").forEach(item => {
    item.classList.remove("active");
    const stageNum = parseInt(item.dataset.stage);
    if (stageNum === gameState.currentStage) {
      item.classList.add("active");
    } else if (stageNum < gameState.currentStage ||
               (gameState.currentStage > 0 && stageNum === gameState.currentStage)) {
      item.classList.toggle("done", stageNum < gameState.currentStage);
    }
  });
}

// ===== 转盘绘制 =====
function drawWheel(options) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const segmentAngle = (2 * Math.PI) / options.length;
  const startAngle = currentAngle - Math.PI / 2;
  const selectedIdx = gameState.selectedIndex;

  // 绘制扇形
  options.forEach((opt, i) => {
    const a1 = startAngle + i * segmentAngle;
    const a2 = a1 + segmentAngle;
    const isSelected = selectedIdx === i;
    const isDeath = opt.type === "death";

    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.arc(CENTER, CENTER, RADIUS, a1, a2);
    ctx.closePath();

    // 颜色：选中时用深灰突出
    if (isSelected) {
      ctx.fillStyle = isDeath ? "#c97a7a" : "#6a8fb5";
    } else {
      ctx.fillStyle = isDeath ? DEATH_COLOR : COLORS[i % COLORS.length];
    }
    ctx.fill();

    // 边框
    ctx.strokeStyle = isSelected ? "#333" : "rgba(255,255,255,0.5)";
    ctx.lineWidth = isSelected ? 3 : 1.5;
    ctx.stroke();

    // 文字 - 深色文字在浅色背景上
    const centerAngle = a1 + segmentAngle / 2;
    const textRadius = RADIUS - 45;
    const textX = CENTER + Math.cos(centerAngle) * textRadius;
    const textY = CENTER + Math.sin(centerAngle) * textRadius;

    ctx.save();
    ctx.translate(textX, textY);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (isSelected) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px 'Microsoft YaHei', sans-serif";
    } else {
      ctx.fillStyle = "#333333";
      ctx.font = "bold 13px 'Microsoft YaHei', sans-serif";
    }

    const text = opt.text;
    let displayText = text;
    if (text.length > 10) {
      displayText = text.substring(0, 8) + "...";
    }
    ctx.fillText(displayText, 0, 0);
    ctx.restore();
  });

  // 外圈 - 简洁黑色边框
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, 0, 2 * Math.PI);
  ctx.strokeStyle = selectedIdx >= 0 ? "#333" : "#999";
  ctx.lineWidth = selectedIdx >= 0 ? 3 : 2;
  ctx.stroke();

  // 中心圆 - 白色背景
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, 60, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ===== 准备转盘选项 =====
function prepareWheelOptions() {
  let options = [];

  if (gameState.phase === "selecting") {
    // 初始阶段选择转盘
    options = INIT_WHEEL.map(w => ({
      text: w.text,
      type: "stage-select",
      stage: w.stage
    }));
  } else if (gameState.specialWheelActive) {
    // 特殊经历转盘：使用专门的特殊转盘内容
    options = getSpecialWheel(gameState.currentStage).map(opt => ({ ...opt }));
  } else if (gameState.phase === "playing") {
    // 正常阶段转盘
    const wheelData = ALL_STAGE_WHEELS[gameState.currentStage - 1][gameState.currentWheel];
    options = wheelData.map(opt => ({ ...opt }));

    // 因果系统：应用死亡选项调整
    if (gameState.deathModifier > 0) {
      let addedDeaths = 0;
      for (let i = 0; i < options.length && addedDeaths < gameState.deathModifier; i++) {
        if (options[i].type === "normal") {
          options[i] = {
            text: "⚠️ 境界不足，被环境压迫而亡",
            type: "death",
            effects: { deathType: "因境界不足而死亡" }
          };
          addedDeaths++;
        }
      }
    }
    if (gameState.deathModifier < 0) {
      let removedDeaths = 0;
      for (let i = 0; i < options.length && removedDeaths < -gameState.deathModifier; i++) {
        if (options[i].type === "death") {
          options[i] = {
            text: "凭借宝物和实力，惊险逃过一劫",
            type: "gain",
            effects: {}
          };
          removedDeaths++;
        }
      }
    }

    applyStageStateEffects(options);
  } else if (gameState.phase === "ending") {
    options = [{ text: "✨ 点击查看你的最终结局 ✨", type: "ending" }];
  }

  return options;
}

function applyStageStateEffects(options) {
  // 检查阶段状态标签，影响转盘内容
  // 例如：如果有 "s1_company"（加入虚拟宇宙公司），则某些选项有加成
  // 这里做简单处理：不修改原选项，而是影响特殊转盘

  // 注意：具体的因果影响已经在游戏推进时处理
  // 此函数保留用于扩展
  return options;
}

// ===== 开始旋转 =====
function spin() {
  if (gameState.isSpinning) return;
  if (gameState.isDead) return;

  gameState.isSpinning = true;
  gameState.selectedIndex = -1;  // 清除上次高亮
  spinBtn.disabled = true;
  resultText.textContent = "转盘旋转中...";
  resultText.className = "spin-result-content";

  // 准备当前转盘选项
  currentOptions = prepareWheelOptions();

  // 如果是额外转盘，需要重置特殊经历计数
  if (gameState.extraWheelActive) {
    // 额外转盘不增加特殊经历
  }

  // 检测转盘是否有死亡选项
  const hasDeath = currentOptions.some(opt => opt.type === "death");

  // 根据阶段选择加权随机结果
  let selectedIndex;
  if (gameState.phase === "selecting") {
    // 阶段选择转盘：阶段1=35%、阶段2=30%、阶段3=15%、阶段4=10%、阶段5=8%、阶段6=2%
    selectedIndex = weightedRandomIndex(getStageWeights(currentOptions));
  } else {
    // 正常转盘：死亡选项权重降低
    selectedIndex = weightedRandomIndex(getNormalWeights(currentOptions, hasDeath));
  }
  const segmentAngle = 360 / currentOptions.length;

  // 目标角度：使指针指向选中的扇形
  // 指针在顶部（0度/12点钟方向）
  const targetAngle = 360 * 6 + (360 - selectedIndex * segmentAngle - segmentAngle / 2);

  // 动画旋转
  animateSpin(targetAngle, selectedIndex, () => {
    handleSpinResult(currentOptions[selectedIndex]);
  });
}

function animateSpin(targetAngle, selectedIndex, callback) {
  const duration = 1800;
  const startTime = performance.now();
  const startAngle = currentAngle % 360;
  const totalRotation = targetAngle - startAngle;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 缓动函数：ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);

    currentAngle = startAngle + totalRotation * eased;

    // 动画进行中不显示高亮
    gameState.selectedIndex = -1;
    drawWheel(currentOptions);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      currentAngle = targetAngle % 360;
      // 动画结束后设置选中索引并重绘（显示高亮）
      gameState.selectedIndex = selectedIndex;
      drawWheel(currentOptions);
      // 短暂延迟后调用回调
      setTimeout(() => {
        callback();
      }, 400);
    }
  }

  requestAnimationFrame(step);
}

// ===== 处理转盘结果 =====
function handleSpinResult(result) {
  // 重置死亡修正器
  gameState.deathModifier = 0;

  // 处理不同类型的结果
  switch (gameState.phase) {
    case "selecting":
      handleStageSelection(result);
      break;
    case "playing":
      handleNormalWheel(result);
      break;
    case "special":
      handleSpecialWheel(result);
      break;
    case "ending":
      handleEndingWheel();
      break;
  }

  updateUI();
}

// 处理结局转盘
function handleEndingWheel() {
  triggerEnding();
}

// 处理阶段选择
function handleStageSelection(result) {
  const stageId = result.stage;
  const stage = getStageById(stageId);

  gameState.currentStage = stageId;
  gameState.realm = stage.minRealm; // 初始境界为保底境界
  gameState.currentWheel = 0;
  gameState.phase = "playing";

  document.getElementById("stageTitle").textContent =
    "🚀 第" + stageId + "阶段 · " + stage.name;
  document.getElementById("wheelTitle").textContent =
    "转盘 1/10 · 当前境界：" + getRealmDisplay();

  addLog(
    "<strong>【时空穿越】</strong>你穿越到了「" + stage.name +
    "」，初始境界为「" + getRealmDisplay() + "」",
    "log-stage"
  );

  resultText.textContent = "成功穿越！准备开始第一转盘...";
  gameState.isSpinning = false;
  spinBtn.disabled = false;

  // 绘制下一转盘
  currentOptions = prepareWheelOptions();
  drawWheel(currentOptions);
}

// 处理正常阶段转盘
function handleNormalWheel(result) {
  const stageObj = getStageById(gameState.currentStage);
  const wheelNum = gameState.currentWheel + 1;

  // 根据事件类型处理
  switch (result.type) {
    case "death":
      gameState.isDead = true;
      gameState.deathType = result.effects.deathType || "不明原因死亡";
      resultText.textContent = "💀 " + gameState.deathType;
      resultText.className = "spin-result-content death";
      addLog(
        "<strong>【死亡】</strong>在「" + stageObj.name + "·第" + wheelNum + "转盘」：" +
        gameState.deathType,
        "log-death"
      );
      // 直接进入结局
      setTimeout(() => triggerEnding(), 1500);
      return;

    case "breakthrough":
      const oldRealm = gameState.realm;
      const breakthrough = result.effects.realm || 0;
      if (breakthrough > 0) {
        gameState.realm = Math.min(15, gameState.realm + breakthrough);
        resultText.textContent = "⚡ 境界突破！" + getRealmName(oldRealm) +
          " → " + getRealmDisplay();
        resultText.className = "spin-result-content breakthrough";
        addLog(
          "<strong>【境界突破】</strong>" + getRealmName(oldRealm) + " → " +
          getRealmDisplay() + "（" + result.text + "）",
          "log-breakthrough"
        );
      } else {
        resultText.textContent = "✨ " + result.text;
        addLog("<strong>【感悟】</strong>" + result.text);
      }
      break;

    case "gain":
      if (result.effects && result.effects.items) {
        result.effects.items.forEach(item => {
          if (!gameState.items.includes(item)) {
            gameState.items.push(item);
          }
        });
      }
      resultText.textContent = "🏆 " + result.text;
      resultText.className = "spin-result-content gain";
      addLog("<strong>【获得宝物】</strong>" + result.text, "log-gain");
      break;

    case "tag":
      if (result.effects) {
        if (result.effects.tags) {
          result.effects.tags.forEach(tag => {
            if (!gameState.tags.includes(tag)) {
              gameState.tags.push(tag);
            }
          });
        }
        if (result.effects.items) {
          result.effects.items.forEach(item => {
            if (!gameState.items.includes(item)) {
              gameState.items.push(item);
            }
          });
        }
        if (result.effects.deathCheck) {
          // 境界不足检查
          const minRealm = stageObj.minRealm;
          if (gameState.realm < minRealm) {
            gameState.deathModifier = 1; // 下一转盘多1个死亡选项
            addLog("<strong>【警告】</strong>当前境界「" + getRealmDisplay() +
              "」未达到阶段保底「" + getRealmName(minRealm) +
              "」，下一转盘危险增加！", "log-death");
          } else {
            gameState.deathModifier = -1; // 境界足够，减少死亡
            addLog("<strong>【安全】</strong>当前境界「" + getRealmDisplay() +
              "」已超过保底要求，死亡威胁降低。", "log-gain");
          }
        }
      }
      resultText.textContent = "✨ " + result.text;
      resultText.className = "spin-result-content";
      addLog("<strong>【际遇】</strong>" + result.text);
      break;

    case "special":
      const exp = result.effects.specialExp || 0;
      gameState.specialExp += exp;
      resultText.textContent = "🌟 " + result.text + "（累计：" + gameState.specialExp + "）";
      addLog("<strong>【特殊经历】</strong>" + result.text + "，累计特殊经历：" +
        gameState.specialExp + "次", "log-info");

      // 新逻辑：随机到1次特殊经历，下1转盘就触发特殊经历转盘
      if (exp > 0) {
        gameState.pendingSpecialWheels += exp;
        addLog("  ↳ 下一次转盘将为特殊经历事件（" + exp + "次）", "log-extra");
      }
      break;

    case "stageState":
      const stateId = result.effects.stageState;
      gameState.stageStates.push(stateId);
      resultText.textContent = "✨ " + result.text;
      resultText.className = "spin-result-content";
      addLog("<strong>【阶段抉择】</strong>" + result.text, "log-stage");
      break;

    case "ending":
      triggerEnding();
      return;

    default:
      resultText.textContent = "✨ " + result.text;
      addLog("<strong>【事件】</strong>" + result.text);
  }

  // 推进转盘（totalWheels 在 advanceWheel 中递增）
  advanceWheel();
}

// 处理额外转盘
function handleSpecialWheel(result) {
  // 处理特殊经历转盘的结果
  if (result.type === "death") {
    gameState.isDead = true;
    gameState.deathType = result.effects.deathType || "神秘死亡";
    resultText.textContent = "💀 " + gameState.deathType;
    resultText.className = "spin-result-content death";
    addLog("<strong>【特殊经历·死亡】</strong>" + gameState.deathType, "log-death");
    setTimeout(() => triggerEnding(), 1500);
    return;
  }

  if (result.type === "breakthrough") {
    const oldRealm = gameState.realm;
    const b = result.effects.realm || 0;
    if (b > 0) {
      gameState.realm = Math.min(15, gameState.realm + b);
      resultText.textContent = "⚡ 奇遇突破！" + getRealmName(oldRealm) +
        " → " + getRealmDisplay();
      resultText.className = "spin-result-content breakthrough";
      addLog("<strong>【奇遇·境界突破】</strong>" + getRealmName(oldRealm) +
        " → " + getRealmDisplay(), "log-breakthrough");
    }
  } else if (result.type === "gain") {
    if (result.effects && result.effects.items) {
      result.effects.items.forEach(item => {
        if (!gameState.items.includes(item)) {
          gameState.items.push(item);
        }
      });
    }
    resultText.textContent = "🎉 " + result.text;
    resultText.className = "spin-result-content gain";
    addLog("<strong>【奇遇·获得宝物】</strong>" + result.text, "log-gain");
  } else if (result.type === "tag") {
    if (result.effects && result.effects.tags) {
      result.effects.tags.forEach(tag => {
        if (!gameState.tags.includes(tag)) {
          gameState.tags.push(tag);
        }
      });
    }
    if (result.effects && result.effects.items) {
      result.effects.items.forEach(item => {
        if (!gameState.items.includes(item)) {
          gameState.items.push(item);
        }
      });
    }
    resultText.textContent = "📚 " + result.text;
    addLog("<strong>【奇遇·获得传承/秘境】</strong>" + result.text, "log-extra");
  } else {
    resultText.textContent = "✨ " + result.text;
    addLog("<strong>【奇遇事件】</strong>" + result.text, "log-extra");
  }

  gameState.specialWheelCount++;

  // 检查是否还有待触发的特殊经历转盘
  if (gameState.pendingSpecialWheels > 0) {
    gameState.pendingSpecialWheels--;
    resultText.textContent += "（还剩 " + gameState.pendingSpecialWheels + " 次特殊经历）";
    setTimeout(() => {
      currentOptions = prepareWheelOptions();
      drawWheel(currentOptions);
      gameState.isSpinning = false;
      spinBtn.disabled = false;
      document.getElementById("wheelTitle").textContent =
        "🎁 特殊经历转盘 " + (gameState.specialWheelCount + 1) + "（不计入60次）";
    }, 500);
    updateUI();
    return;
  }

  // 特殊经历转盘结束，回到正常转盘
  gameState.specialWheelActive = false;
  gameState.phase = "playing";

  setTimeout(() => {
    advanceWheel();
  }, 500);
}

// 推进到下一个转盘
function advanceWheel() {
  gameState.totalWheels++;
  gameState.currentWheel++;

  // 检查是否有待触发的特殊经历转盘
  if (gameState.pendingSpecialWheels > 0) {
    gameState.pendingSpecialWheels--;
    gameState.specialWheelActive = true;
    gameState.phase = "special";
    document.getElementById("wheelTitle").textContent =
      "🎁 特殊经历转盘（第" + (gameState.specialWheelCount + 1) + "次 · 不计入60次）";
    currentOptions = prepareWheelOptions();
    drawWheel(currentOptions);
    gameState.isSpinning = false;
    spinBtn.disabled = false;
    updateUI();
    return;
  }

  // 检查当前阶段是否结束
  if (gameState.currentWheel >= 10) {
    // 进入下一阶段
    if (gameState.currentStage < 6) {
      gameState.currentStage++;
      gameState.currentWheel = 0;
      const nextStage = getStageById(gameState.currentStage);

      // 应用阶段状态因果
      applyStageStateCausality();

      document.getElementById("stageTitle").textContent =
        "🚀 第" + gameState.currentStage + "阶段 · " + nextStage.name;
      addLog(
        "<strong>【阶段转换】</strong>进入「" + nextStage.name +
        "」，你的保底境界为：" + getRealmName(nextStage.minRealm),
        "log-stage"
      );
    } else {
      // 所有阶段结束，进入结局
      gameState.phase = "ending";
      document.getElementById("stageTitle").textContent = "🏁 最终结局判定";
      document.getElementById("wheelTitle").textContent =
        "点击按钮查看你的命运...";
      currentOptions = prepareWheelOptions();
      drawWheel(currentOptions);
      gameState.isSpinning = false;
      spinBtn.disabled = false;
      spinBtn.textContent = "🎯 查看结局";
      updateUI();
      return;
    }
  }

  // 更新标题
  document.getElementById("wheelTitle").textContent =
    "转盘 " + (gameState.currentWheel + 1) + "/10 · 当前境界：" + getRealmDisplay();

  // 准备新转盘
  currentOptions = prepareWheelOptions();
  drawWheel(currentOptions);

  gameState.isSpinning = false;
  spinBtn.disabled = false;
  updateUI();
}

// 应用阶段状态因果（进入新阶段时）
function applyStageStateCausality() {
  // 检查上一阶段的阶段状态，影响当前阶段
  const prevState = gameState.stageStates[gameState.stageStates.length - 1];

  if (!prevState) return;

  // 根据上一阶段的选择给予标签或调整境界
  switch (prevState) {
    case "s1_company":
      if (!gameState.tags.includes("虚拟宇宙推荐")) {
        gameState.tags.push("虚拟宇宙推荐");
      }
      // 小幅提升境界
      if (gameState.realm < getStageById(2).minRealm) {
        gameState.realm = getStageById(2).minRealm;
      }
      addLog("【因果影响】加入虚拟宇宙公司获得资源支持，境界稳固提升", "log-info");
      break;
    case "s1_loner":
      if (!gameState.tags.includes("自由闯荡者")) {
        gameState.tags.push("自由闯荡者");
      }
      addLog("【因果影响】作为独行者，你获得了更多奇遇的可能性", "log-info");
      break;
    case "s2_battlefield":
      if (!gameState.tags.includes("战场老兵")) {
        gameState.tags.push("战场老兵");
      }
      addLog("【因果影响】域外战场历练让你意志坚定", "log-info");
      break;
    case "s2_secret":
      // 在秘境修炼境界提升更快
      if (gameState.realm < 10) {
        gameState.realm = Math.min(10, gameState.realm + 1);
        addLog("【因果影响】在原始秘境修炼期间境界小幅提升", "log-gain");
      }
      break;
    case "s3_star":
      if (!gameState.tags.includes("原始星冒险者")) {
        gameState.tags.push("原始星冒险者");
      }
      addLog("【因果影响】在原始星的冒险让你对至宝有更深感悟", "log-info");
      break;
    case "s3_city":
      if (gameState.realm < 10) {
        gameState.realm = Math.min(10, gameState.realm + 1);
        addLog("【因果影响】在混沌城修炼境界提升", "log-gain");
      }
      break;
    case "s4_sea":
      if (!gameState.tags.includes("宇宙海探索者")) {
        gameState.tags.push("宇宙海探索者");
      }
      addLog("【因果影响】宇宙海的冒险让你获得了断东河传承的机会", "log-info");
      break;
    case "s4_universe":
      if (gameState.realm < 12) {
        gameState.realm = Math.min(12, gameState.realm + 1);
        addLog("【因果影响】在原始宇宙稳固势力期间境界有所积累", "log-gain");
      }
      break;
    case "s5_fight":
      if (!gameState.tags.includes("对抗界兽")) {
        gameState.tags.push("对抗界兽");
      }
      addLog("【因果影响】你选择与罗峰共同对抗界兽", "log-info");
      break;
    case "s5_neutral":
      if (!gameState.tags.includes("中立者")) {
        gameState.tags.push("中立者");
      }
      addLog("【因果影响】你选择了中立自保的路线", "log-info");
      break;
  }
}

// ===== 触发结局 =====
function triggerEnding() {
  gameState.phase = "ending";

  // 根据状态确定结局
  let ending = null;

  if (gameState.isDead) {
    ending = ENDINGS[8]; // 结局9：中途死亡
  } else {
    // 按优先级检查结局
    // 结局1: 永恒真神 + 罗峰盟友
    if (gameState.realm >= 15 && gameState.tags.includes("罗峰盟友")) {
      ending = ENDINGS[0];
    }
    // 结局3: 永恒真神 + 罗峰仇敌 + 界兽盟友
    else if (gameState.realm >= 15 && gameState.tags.includes("罗峰仇敌") &&
             gameState.tags.includes("界兽盟友")) {
      ending = ENDINGS[2];
    }
    // 结局2: 永恒真神 + 对抗界兽
    else if (gameState.realm >= 15 && gameState.tags.includes("对抗界兽")) {
      ending = ENDINGS[1];
    }
    // 结局5: 同归于尽
    else if (gameState.tags.includes("罗峰仇敌") &&
             gameState.tags.includes("界兽盟友") && gameState.realm >= 13) {
      ending = ENDINGS[4];
    }
    // 结局7: 被罗峰杀死
    else if (gameState.tags.includes("罗峰仇敌") && gameState.realm < 15) {
      ending = ENDINGS[6];
    }
    // 结局4: 死亡·被罗峰击杀（活着但敌对）
    else if (gameState.tags.includes("罗峰仇敌") && gameState.realm < 15) {
      ending = ENDINGS[3];
    }
    // 结局8: 幸运儿
    else if (gameState.realm < 13 && gameState.specialExp + gameState.extraWheelCount >= 3) {
      ending = ENDINGS[7];
    }
    // 结局6: 真神旁观
    else if (gameState.realm >= 13 && gameState.realm < 15) {
      ending = ENDINGS[5];
    }
    // 结局8: 幸运儿（兜底）
    else if (gameState.realm < 13) {
      ending = ENDINGS[7];
    }
    // 默认：幸运儿
    else {
      ending = ENDINGS[7];
    }
  }

  // 显示结局弹窗
  endingTitle.textContent = ending.title;

  // 特殊处理结局8的境界显示
  let descText = ending.desc;
  if (ending.id === 8) {
    descText = descText.replace("凡人", getRealmDisplay());
  }

  // 添加玩家数据摘要
  const summary =
    "\n\n━━━━━━━━━━━━━━━━━━━━" +
    "\n📊 你的传奇数据：" +
    "\n· 最终境界：" + getRealmDisplay() +
    "\n· 累计转盘：" + gameState.totalWheels + " 次" +
    "\n· 获得宝物：" + gameState.items.length + " 件" +
    "\n· 累计标签：" + gameState.tags.length + " 个" +
    "\n· 特殊经历：" + gameState.specialExp + " 次" +
    "\n· 额外转盘：" + gameState.extraWheelCount + " 次" +
    (gameState.isDead ? "\n· 死亡方式：" + gameState.deathType : "") +
    "\n━━━━━━━━━━━━━━━━━━━━";

  endingDesc.innerHTML = (descText + summary).replace(/\n/g, "<br>");

  endingModal.classList.remove("hidden");

  addLog("<strong>【结局】</strong>" + ending.title, "log-ending");

  gameState.isSpinning = false;
  spinBtn.disabled = true;
}

// ===== 重置游戏 =====
function resetGame() {
  gameState.phase = "selecting";
  gameState.currentStage = 0;
  gameState.currentWheel = 0;
  gameState.totalWheels = 0;
  gameState.realm = 1;
  gameState.items = [];
  gameState.tags = [];
  gameState.stageStates = [];
  gameState.specialExp = 0;
  gameState.specialWheelCount = 0;
  gameState.isDead = false;
  gameState.deathType = "";
  gameState.pendingSpecialWheels = 0;
  gameState.deathModifier = 0;
  gameState.isSpinning = false;
  gameState.specialWheelActive = false;
  gameState.selectedIndex = -1;

  endingModal.classList.add("hidden");
  document.getElementById("stageTitle").textContent = "🚀 选择你的穿越时间节点";
  document.getElementById("wheelTitle").textContent = "6个阶段 · 点击按钮开始命运抉择";
  spinBtn.textContent = "🎯 开始转盘";
  spinBtn.disabled = false;
  resultText.textContent = "点击按钮，让命运的指针决定你的起点...";
  resultText.className = "spin-result-content";

  logContent.innerHTML =
    '<div class="log-entry log-info">🌟 新的旅程开始了！你将穿越到吞噬星空的哪个时代？</div>';

  currentOptions = prepareWheelOptions();
  drawWheel(currentOptions);
  updateUI();
}

// ===== 事件绑定 =====
spinBtn.addEventListener("click", spin);
restartBtn.addEventListener("click", resetGame);
closeModalBtn.addEventListener("click", () => {
  endingModal.classList.add("hidden");
});

// ===== 初始化 =====
function init() {
  // 设置 canvas 尺寸（支持响应式）
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    // 保持正方形
    if (rect.width > 0 && rect.height > 0) {
      // canvas.width 和 height 已在 HTML 中设置
    }
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // 准备初始转盘
  gameState.phase = "selecting";
  currentOptions = prepareWheelOptions();
  drawWheel(currentOptions);
  updateUI();

  // 添加初始化日志
  addLog("🌟 游戏已就绪！点击「开始转盘」启动你的穿越之旅。", "log-info");
  addLog("💡 提示：6个阶段各具特色，境界不足会增加死亡风险！", "log-info");
}

// 页面加载完成后初始化
init();