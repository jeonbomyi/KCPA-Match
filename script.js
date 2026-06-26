const FIXED_DESCRIPTIONS = {
  clinical: "심리평가, 심리상담, 심리치료 중심",
  nurse: "증상관리, 복약관리, 수면, 신체건강 중심",
  social: "가족, 경제, 주거, 복지서비스, 자원연계 중심",
  ot: "ADL/IADL, 작업수행능력, 인지재활, 사회참여 기능 회복 중심"
};

const services = {
  clinical: {
    emoji: "💬❤️",
    room: "임상심리실",
    expert: "정신건강임상심리사",
    service: "심리평가 · 심리상담 · 심리치료",
    color: "#4d9a45",
    table: "WAIS · MMPI · Rorschach · 심리치료",
    body: "",
    desc: FIXED_DESCRIPTIONS.clinical
  },
  nurse: {
    emoji: "💊",
    room: "간호실",
    expert: "정신건강간호사",
    service: "증상관리 · 복약관리 · 수면 · 신체건강",
    color: "#3aa69b",
    table: "약장 · 수면/증상 체크 · 복약관리",
    body: "nurseBody",
    desc: FIXED_DESCRIPTIONS.nurse
  },
  social: {
    emoji: "🏠",
    room: "사회사업실",
    expert: "정신건강사회복지사",
    service: "가족 · 경제 · 주거 · 복지서비스 · 자원연계",
    color: "#2f70b7",
    table: "지역사회 지도 · 복지서비스 · 자원연계",
    body: "socialBody",
    desc: FIXED_DESCRIPTIONS.social
  },
  ot: {
    emoji: "🌱",
    room: "작업치료실",
    expert: "정신건강작업치료사",
    service: "ADL/IADL · 작업수행능력 · 인지재활 · 사회참여",
    color: "#8357c7",
    table: "ADL · IADL · 인지재활 · 사회참여",
    body: "otBody",
    desc: FIXED_DESCRIPTIONS.ot
  }
};

const flow = {
  q1: {
    progress: ["어려움", 25],
    text: "최근 가장 힘든 것은 무엇인가요?",
    choices: [
      ["우울감이나 무기력이 지속돼요.", { clinical: 1, nurse: 1 }, { clinical: ["심리상담"], nurse: ["수면/신체건강"] }, "q2"],
      ["불안과 걱정이 계속돼요.", { clinical: 2, nurse: 1 }, { clinical: ["심리상담"], nurse: ["증상관리"] }, "q2"],
      ["잠, 약, 몸 상태가 걱정돼요.", { nurse: 3 }, { nurse: ["수면/신체건강", "복약관리"] }, "q2"],
      ["가족·경제·주거·직장 문제가 커요.", { social: 3 }, { social: ["가족", "경제", "주거/복지서비스"] }, "q2"],
      ["혼자 생활하거나 사회 복귀가 어려워요.", { ot: 3 }, { ot: ["ADL/IADL", "사회참여"] }, "q2"]
    ]
  },
  q2: {
    progress: ["영향", 45],
    text: "그 어려움 때문에 실제로 가장 막히는 부분은 어디인가요?",
    choices: [
      ["왜 이런 문제가 반복되는지 알고 싶어요.", { clinical: 3 }, { clinical: ["심리평가", "심리상담"] }, "q3"],
      ["상담이나 치료를 통해 바꾸고 싶어요.", { clinical: 3 }, { clinical: ["심리상담", "심리치료"] }, "q3"],
      ["수면, 복약, 신체 컨디션이 무너졌어요.", { nurse: 3 }, { nurse: ["수면", "복약관리", "신체건강"] }, "q3"],
      ["치료비, 가족, 주거, 복지서비스가 필요해요.", { social: 3 }, { social: ["경제", "가족", "주거/복지서비스"] }, "q3"],
      ["씻기·식사·장보기·이동 같은 일상이 어려워요.", { ot: 3 }, { ot: ["ADL/IADL", "작업수행능력"] }, "q3"]
    ]
  },
  q3: {
    progress: ["서비스", 65],
    text: "오늘 가장 받고 싶은 도움은 무엇에 가까운가요?",
    choices: [
      ["심리검사로 현재 상태를 정확히 평가받고 싶어요.", { clinical: 4 }, { clinical: ["심리평가"] }, "q4"],
      ["심리상담이나 심리치료를 받고 싶어요.", { clinical: 4 }, { clinical: ["심리상담", "심리치료"] }, "q4"],
      ["증상과 약물, 수면을 안전하게 관리하고 싶어요.", { nurse: 4 }, { nurse: ["증상관리", "복약관리", "수면"] }, "q4"],
      ["지역사회 자원과 현실적 지원을 연결받고 싶어요.", { social: 4 }, { social: ["복지서비스", "자원연계", "경제"] }, "q4"],
      ["일상생활과 사회참여 기능을 회복하고 싶어요.", { ot: 4 }, { ot: ["ADL/IADL", "인지재활", "사회참여"] }, "q4"]
    ]
  },
  q4: {
    progress: ["함께", 82],
    text: "함께 고려해야 할 어려움이 또 있나요?",
    choices: [
      ["심리평가나 심리치료도 함께 필요할 것 같아요.", { clinical: 2 }, { clinical: ["심리평가", "심리치료"] }, "finish"],
      ["약, 수면, 증상 관리도 함께 필요할 것 같아요.", { nurse: 2 }, { nurse: ["증상관리", "복약관리", "수면"] }, "finish"],
      ["가족, 경제, 주거, 복지 문제도 함께 있어요.", { social: 2 }, { social: ["가족", "경제", "주거/복지서비스"] }, "finish"],
      ["일상생활 기능이나 사회참여도 함께 필요해요.", { ot: 2 }, { ot: ["ADL/IADL", "작업수행능력", "사회참여"] }, "finish"],
      ["지금은 위 내용 외에는 잘 모르겠어요.", {}, {}, "finish"]
    ]
  }
};

let scores;
let route;
let triggers;
let primary;
let secondary;
let currentRoom;
let historyStack;
let currentNode;

function byId(id) {
  return document.getElementById(id);
}

function freshScores() {
  return { clinical: 0, nurse: 0, social: 0, ot: 0 };
}

function resetState() {
  scores = freshScores();
  route = [];
  triggers = { clinical: [], nurse: [], social: [], ot: [] };
  primary = null;
  secondary = null;
  currentRoom = null;
  historyStack = [];
  currentNode = "title";
}

function snapshot() {
  return JSON.parse(JSON.stringify({
    scores,
    route,
    triggers,
    primary,
    secondary,
    currentRoom,
    currentNode
  }));
}

function restore(state) {
  scores = state.scores;
  route = state.route;
  triggers = state.triggers;
  primary = state.primary;
  secondary = state.secondary;
  currentRoom = state.currentRoom;
  currentNode = state.currentNode;
}

function push() {
  historyStack.push(snapshot());
}

function scene(id) {
  ["titleScene", "hallScene", "roomScene", "resultScene"].forEach((sceneId) => {
    byId(sceneId).classList.add("hidden");
  });

  byId(id).classList.remove("hidden");
}

function setBadge(text) {
  byId("badge").textContent = text;
}

function setProgress(label, pct) {
  byId("progressLabel").textContent = label;
  byId("progressFill").style.width = `${pct}%`;
}

function updateBack() {
  byId("backBtn").disabled = historyStack.length <= 1;
}

function dialog(speaker, text, choices = []) {
  byId("speaker").textContent = speaker;

  const textbox = byId("textbox");
  textbox.style.animation = "none";
  void textbox.offsetWidth;
  textbox.style.animation = "";
  textbox.textContent = text;

  const choicesBox = byId("choices");
  choicesBox.innerHTML = "";

  choices.forEach(([label, action]) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = `▶ ${label}`;
    button.addEventListener("click", action);
    choicesBox.appendChild(button);
  });

  updateBack();
}

function addAnswer(label, points, triggerMap) {
  route.push(label);

  Object.entries(points).forEach(([key, value]) => {
    scores[key] += value;
  });

  Object.entries(triggerMap || {}).forEach(([key, values]) => {
    values.forEach((value) => {
      if (!triggers[key].includes(value)) {
        triggers[key].push(value);
      }
    });
  });
}

function sortedScores() {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

function chooseSecondary(sorted) {
  const candidates = sorted.filter(([key]) => key !== primary);
  const withTriggers = candidates.filter(([key]) => triggers[key].length > 0);
  return (withTriggers[0] || candidates[0])[0];
}

function safetyChoices() {
  return [
    ["지금 자해·타해 위험, 현실 판단 어려움, 극심한 증상 악화가 있어요.", () => {
      push();
      emergency();
    }],
    ["해당 없어요. 안내를 받고 싶어요.", () => {
      push();
      ask("q1");
    }]
  ];
}

function showSafetyHall() {
  currentNode = "safety";
  scene("hallScene");
  setBadge("접수");
  setProgress("안전확인", 10);
  renderRooms(false);
  dialog(
    "접수 직원",
    "안녕하세요. 마음건강센터입니다.\n어떤 서비스가 도움이 될지 함께 찾아보겠습니다.\n먼저 안전 확인을 하겠습니다.",
    safetyChoices()
  );
}

function showHallResult() {
  currentNode = "hallResult";
  scene("hallScene");
  setBadge("서비스 정리");
  setProgress("방문", 92);
  renderRooms(true);

  dialog(
    "접수 직원",
    `답변을 종합했습니다.\n가장 우선적으로 도움이 될 서비스는\n‘${services[primary].service}’입니다.\n\n또한 ‘${services[secondary].service}’도 함께 고려하면 좋겠습니다.\n\n추천 방을 둘러보거나 바로 이용기록을 확인할 수 있습니다.`,
    [
      ["이용기록 바로 보기", () => {
        push();
        showResult();
      }]
    ]
  );
}

function start() {
  resetState();
  push();
  showSafetyHall();
}

function emergency() {
  currentNode = "emergency";
  setBadge("위기안내");
  setProgress("위기안내", 100);

  dialog(
    "응급 안내",
    "지금은 온라인 게임 결과보다 즉각적인 안전 확보가 우선입니다.\n가까운 응급실, 정신건강의학과 진료, 1393 또는 112에 도움을 요청하세요.",
    [["접수 직원에게 돌아가기", showSafetyHall]]
  );
}

function ask(id) {
  currentNode = id;
  const node = flow[id];

  scene("hallScene");
  byId("roomScene").className = "scene hidden";

  setBadge(id.toUpperCase());
  setProgress(node.progress[0], node.progress[1]);

  const choices = node.choices.map(([label, points, triggerMap, next]) => [
    label,
    () => {
      push();
      addAnswer(label, points, triggerMap);

      if (next === "finish") {
        finishTriage();
        return;
      }

      ask(next);
    }
  ]);

  dialog("접수 직원", node.text, choices);
}

function finishTriage() {
  const sorted = sortedScores();
  primary = sorted[0][0];
  secondary = chooseSecondary(sorted);
  showHallResult();
}

function renderRooms(showRecommendation) {
  const grid = byId("roomGrid");
  grid.innerHTML = "";

  Object.entries(services).forEach(([key, service]) => {
    const button = document.createElement("button");
    button.type = "button";

    const markClass =
      showRecommendation && key === primary
        ? "recommended"
        : showRecommendation && key === secondary
          ? "secondaryMark"
          : "";

    const label =
      showRecommendation && key === primary
        ? "★ 우선 서비스"
        : showRecommendation && key === secondary
          ? "☆ 함께 고려"
          : service.service;

    button.className = `roomBtn ${markClass}`;
    button.innerHTML = `
      <span class="roomIcon">${service.emoji}</span>
      ${service.room}
      <span class="roomSmall">${label}</span>
    `;

    button.addEventListener("click", () => {
      push();
      enterRoom(key);
    });

    grid.appendChild(button);
  });
}

function roomChoices() {
  if (primary) {
    return [
      ["이용기록 보기", () => {
        push();
        showResult();
      }],
      ["추천 화면으로 돌아가기", () => {
        goBack();
      }]
    ];
  }

  return [
    ["접수 안내 계속하기", () => {
      goBack();
    }]
  ];
}

function enterRoom(key) {
  currentNode = "room";
  currentRoom = key;

  const service = services[key];

  scene("roomScene");
  byId("roomScene").className = `scene room-${key}`;
  setBadge(service.room);
  setProgress("상담실", 96);

  byId("tableText").textContent = service.table;

  const roomNpc = byId("roomNpc");
  if (roomNpc) {
    roomNpc.className = `sprite roomNpc npc-${key}`;
  }

  let intro;
  if (key === primary) {
    intro = `현재 답변에서는 이 전문가가 가장 우선적으로 도움이 될 수 있습니다.\n\n${service.desc}`;
  } else if (key === secondary) {
    intro = `현재 답변에서는 이 전문가도 함께 고려하면 좋습니다.\n\n${service.desc}`;
  } else if (primary) {
    intro = `이 전문가도 정신건강 회복 과정에서 협력할 수 있습니다.\n\n${service.desc}`;
  } else {
    intro = `아직 접수 질문을 시작하기 전입니다.\n이 방에서는 ${service.expert}가 어떤 도움을 주는지 미리 둘러볼 수 있습니다.\n\n${service.desc}`;
  }

  dialog(
    service.expert,
    `안녕하세요. 저는 ${service.expert}입니다.\n\n${intro}`,
    roomChoices()
  );
}

function reasonFor(key) {
  const service = services[key];
  const picked = triggers[key];

  if (picked.length) {
    return `선택하신 답변 중 ${picked.map((item) => `‘${item}’`).join(", ")} 관련 내용이 포함되어 있어 ${service.expert}를 고려할 수 있습니다.`;
  }

  return `전체 답변의 흐름상 ${service.expert}도 함께 살펴볼 수 있습니다.`;
}

function resultCard(key, title, badge) {
  const service = services[key];

  return `
    <div class="reason" style="border-color:${service.color}">
      <div class="cardTitle">${title}</div>
      <div><b>${badge} ${service.emoji} ${service.expert}</b></div>
      <div>${service.desc}</div>
      <br>
      <div>${reasonFor(key)}</div>
    </div>
  `;
}

function scoreBars() {
  const sorted = sortedScores();
  const max = Math.max(...Object.values(scores), 1);

  return sorted.map(([key, value]) => {
    const service = services[key];
    const pct = Math.round((value / max) * 100);

    return `
      <div class="bar">
        <div class="barTop">
          <span>${service.emoji} ${service.expert}</span>
          <span>${value}</span>
        </div>
        <div class="track">
          <div class="fill" style="width:${pct}%;background:${service.color}"></div>
        </div>
      </div>
    `;
  }).join("");
}

function showResult() {
  currentNode = "result";

  scene("resultScene");
  setBadge("RESULT");
  setProgress("결과", 100);

  const main = services[primary];
  const sub = services[secondary];

  byId("resultPaper").innerHTML = `
    <h2>🏆 오늘의 클리어 기록</h2>

    <div id="shareCard">
      <div class="course">
        <div class="cardTitle">추천 이용코스</div>
        <b>1순위</b><br>
        ${main.emoji} ${main.expert}<br>
        ${main.desc}
        <br><br>
        <b>함께 고려</b><br>
        ${sub.emoji} ${sub.expert}<br>
        ${sub.desc}
      </div>

      ${resultCard(primary, "왜 이 전문가인가요?", "우선")}
      ${resultCard(secondary, "왜 함께 고려하나요?", "함께")}

      <div class="evidence">
        <div class="cardTitle">서비스 필요도</div>
        ${scoreBars()}
      </div>

      <div class="course">
        <div class="cardTitle">선택 경로</div>
        ${route.map((item, index) => `${index + 1}. ${item}`).join("<br>")}
      </div>
    </div>

    <button class="saveBtn" type="button" onclick="saveResultImage()">결과 카드 이미지 만들기</button>
    <a id="downloadLink" download="mind-health-center-result.png">이미지 다운로드</a>
    <button class="copyBtn" type="button" onclick="copyResult()">결과 복사하기</button>
  `;

  dialog(
    "이용기록",
    "클리어 기록이 완성되었습니다.\n우선 전문가와 함께 고려하면 좋은 전문가를 각각 이유와 함께 정리했습니다."
  );
}

async function copyResult() {
  const main = services[primary];
  const sub = services[secondary];

  const text = [
    "나에게 맞는 정신건강전문요원 찾기 결과",
    "",
    `우선 전문가: ${main.expert}`,
    `설명: ${main.desc}`,
    `이유: ${reasonFor(primary)}`,
    "",
    `함께 고려: ${sub.expert}`,
    `설명: ${sub.desc}`,
    `이유: ${reasonFor(secondary)}`
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    alert("결과가 복사되었습니다.");
  } catch (error) {
    window.prompt("아래 내용을 길게 눌러 복사하세요.", text);
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = String(text).split("");
  let line = "";

  chars.forEach((char) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = test;
    }
  });

  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

function drawPanel(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#120b06";
  ctx.lineWidth = 10;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = "#ffffff80";
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 14, y + 14, w - 28, h - 28);
}

function saveResultImage() {
  const main = services[primary];
  const sub = services[secondary];

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f1d9ad";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#173b70";
  ctx.fillRect(0, 0, canvas.width, 170);

  ctx.fillStyle = "#fff8df";
  ctx.font = "bold 58px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("QUEST CLEAR", 540, 88);

  ctx.font = "bold 34px system-ui";
  ctx.fillText("나에게 맞는 정신건강전문요원 찾기", 540, 135);

  drawPanel(ctx, 70, 210, 940, 255, "#fff0c2");
  drawPanel(ctx, 70, 500, 940, 255, "#eef6ff");
  drawPanel(ctx, 70, 790, 940, 315, "#f7e7ff");

  ctx.textAlign = "left";
  ctx.fillStyle = "#22160e";

  ctx.font = "bold 36px system-ui";
  ctx.fillText("1순위 전문가", 120, 270);
  ctx.font = "bold 46px system-ui";
  ctx.fillText(`${main.emoji} ${main.expert}`, 120, 335);
  ctx.font = "30px system-ui";
  wrapText(ctx, main.desc, 120, 395, 840, 42);

  ctx.font = "bold 36px system-ui";
  ctx.fillText("함께 고려", 120, 560);
  ctx.font = "bold 46px system-ui";
  ctx.fillText(`${sub.emoji} ${sub.expert}`, 120, 625);
  ctx.font = "30px system-ui";
  wrapText(ctx, sub.desc, 120, 685, 840, 42);

  ctx.font = "bold 36px system-ui";
  ctx.fillText("선택 근거", 120, 850);
  ctx.font = "28px system-ui";
  let y = wrapText(ctx, reasonFor(primary), 120, 910, 840, 40);
  y += 22;
  wrapText(ctx, reasonFor(secondary), 120, y, 840, 40);

  ctx.textAlign = "center";
  ctx.fillStyle = "#22160e";
  ctx.font = "26px system-ui";
  ctx.fillText("같은 우울과 불안이라도 필요한 전문 서비스는 다를 수 있습니다.", 540, 1235);

  const url = canvas.toDataURL("image/png");
  const link = byId("downloadLink");
  link.href = url;
  link.style.display = "block";
  link.textContent = "이미지 다운로드 / 길게 눌러 저장";
}

function showHistory() {
  byId("historyList").innerHTML = route.length
    ? route.map((item, index) => `${index + 1}. ${item}`).join("<br>")
    : "아직 선택한 내용이 없습니다.";

  byId("historyModal").classList.remove("hidden");
}

function closeHistory() {
  byId("historyModal").classList.add("hidden");
}

function goBack() {
  if (historyStack.length <= 1) return;

  const previous = historyStack.pop();
  restore(JSON.parse(JSON.stringify(previous)));
  rerender();
}

function rerender() {
  if (currentNode === "title") {
    restart();
    return;
  }

  if (currentNode === "safety") {
    showSafetyHall();
    return;
  }

  if (flow[currentNode]) {
    ask(currentNode);
    return;
  }

  if (currentNode === "emergency") {
    emergency();
    return;
  }

  if (currentNode === "hallResult") {
    showHallResult();
    return;
  }

  if (currentNode === "room") {
    enterRoom(currentRoom);
    return;
  }

  if (currentNode === "result") {
    showResult();
  }
}

function restart() {
  resetState();
  scene("titleScene");
  byId("roomScene").className = "scene hidden";
  setBadge("START");
  setProgress("대기", 0);
  dialog("안내", "시작하기를 눌러 마음건강센터에 들어가 보세요.");
  historyStack = [snapshot()];
}

restart();