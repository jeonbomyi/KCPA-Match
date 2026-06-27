const FIXED_DESCRIPTIONS = {
  clinical: "심리평가, 심리치료(심리상담) 중심",
  nurse: "증상관리, 복약관리, 수면, 신체건강 중심",
  social: "가족, 경제, 주거, 복지서비스, 자원연계 중심",
  ot: "작업수행능력평가, 일상생활기능훈련, 작업재활 중심"
};

const services = {
  clinical: {
    emoji: "💬❤️",
    room: "임상심리실",
    expert: "정신건강임상심리사",
    service: "심리평가 · 심리치료(심리상담)",
    color: "#8357c7",
    table: "WAIS · MMPI · Rorschach · 심리치료",
    desc: FIXED_DESCRIPTIONS.clinical,
    roomNpc: "./assets/npc/clinical-room.png",
    resultNpc: "./assets/npc/clinical-result.png"
  },
  nurse: {
    emoji: "💊",
    room: "간호실",
    expert: "정신건강간호사",
    service: "증상관리 · 복약관리 · 수면 · 신체건강",
    color: "#d35252",
    table: "약장 · 수면/증상 체크 · 복약관리",
    desc: FIXED_DESCRIPTIONS.nurse,
    roomNpc: "./assets/npc/nurse-room.png",
    resultNpc: "./assets/npc/nurse-result.png"
  },
  social: {
    emoji: "🏠",
    room: "사회사업실",
    expert: "정신건강사회복지사",
    service: "가족 · 경제 · 주거 · 복지서비스 · 자원연계",
    color: "#4d9a45",
    table: "지역사회 지도 · 복지서비스 · 자원연계",
    desc: FIXED_DESCRIPTIONS.social,
    roomNpc: "./assets/npc/social-room.png",
    resultNpc: "./assets/npc/social-result.png"
  },
  ot: {
    emoji: "🌱",
    room: "작업치료실",
    expert: "정신건강작업치료사",
    service: "작업적 일상생활훈련 · 감각/활동훈련 · 작업재활",
    color: "#2f70b7",
    table: "작업수행분석 · 감각훈련 · 활동훈련",
    desc: FIXED_DESCRIPTIONS.ot,
    roomNpc: "./assets/npc/ot-room.png",
    resultNpc: "./assets/npc/ot-result.png"
  }
};

const SCORE_PER_CHOICE = 2.5;

const flow = {
  q1: {
    progress: ["주증상", 25],
    text: "요즘 나를 가장 괴롭히는 감정이나 신체적인 신호는 무엇인가요?",
    choices: [
      ["통제되지 않는 우울·불안, 꼬리를 무는 부정적인 생각 패턴 때문에 괴로워요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["생각 및 감정 패턴 분석"] }, "q2"],
      ["극심한 불면, 두근거림, 혹은 복용 중인 약물의 부작용이 의심되어 불안해요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["수면 및 약물 부작용 점검"] }, "q2"],
      ["가족 간의 극심한 갈등, 경제적 고립 등 나를 둘러싼 환경 전체가 숨이 막혀요.", { social: SCORE_PER_CHOICE }, { social: ["환경적 스트레스 및 지지체계 약화"] }, "q2"],
      ["머리가 멍해 집중·기억이 안 되거나, 신체 감각이 둔하고 손발이 뻣뻣해요.", { ot: SCORE_PER_CHOICE }, { ot: ["뇌·신체 기능 저하 판별"] }, "q2"]
    ]
  },

  q2: {
    progress: ["일상생활", 45],
    text: "그 문제로 인해 내 일상에서 가장 먼저 무너진 부분은 어디인가요?",
    choices: [
      ["내 감정이 왜 이리 널뛰는지 도무지 알 수 없고, 생각과 판단력이 흐려져 나 자신을 통제하기 어려워요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["정신 상태 및 자아 기능의 혼란"] }, "q3"],
      ["정해진 시간에 약 챙겨 먹기, 식사하기 등 기본적인 건강 루틴이 깨졌어요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["복약 및 생활 리듬 관리"] }, "q3"],
      ["복합적인 현실 문제(돈, 주거, 복지 등)가 한꺼번에 터져서 어디서부터 어떻게 손대야 할지 막막해요.", { social: SCORE_PER_CHOICE }, { social: ["다각적 욕구 사정 및 위기 상황 파악"] }, "q3"],
      ["음식을 안전하게 삼키기 힘들거나, 손재주가 떨어져 기본적인 옷 입기·씻기가 안 돼요.", { ot: SCORE_PER_CHOICE }, { ot: ["기본적 일상동작(ADL) 수행 능력"] }, "q3"]
    ]
  },

  q3: {
    progress: ["요구사항", 65],
    text: "만약 오늘 전문가를 만난다면, 어떤 구체적인 도움을 가장 먼저 받고 싶으신가요?",
    choices: [
      ["종합심리검사로 내 마음을 진단하거나, 인지적 왜곡을 다루는 심리치료를 원해요.", { clinical: SCORE_PER_CHOICE }, { clinical: ["심리검사 및 심리치료"] }, "q4"],
      ["현재 증상에 맞는 정확한 의학적 조언과 약물 순응도를 높일 지도를 원해요.", { nurse: SCORE_PER_CHOICE }, { nurse: ["의학적 증상 관리 조언"] }, "q4"],
      ["내게 필요한 정부 지원, 맞춤 복지 혜택, 유관 기관들을 체계적으로 찾고 꼼꼼히 연결받고 싶어요.", { social: SCORE_PER_CHOICE }, { social: ["개인 맞춤형 자원 사정 및 연계"] }, "q4"],
      ["컴퓨터·교구를 활용한 인지 재활이나, 마비·경직된 손 기능을 훈련하고 싶어요.", { ot: SCORE_PER_CHOICE }, { ot: ["인지 및 신체 재활 치료"] }, "q4"]
    ]
  },

  q4: {
    progress: ["미래방향", 82],
    text: "장기적으로 보았을 때, 내가 건강한 삶으로 복귀하기 위해 가장 필요한 숙제는 무엇인가요?",
    choices: [
      ["내 마음과 행동의 원인을 깊이 이해하고, 스스로 상처를 치유하며 삶의 중심을 잡는 힘 기르기", { clinical: SCORE_PER_CHOICE }, { clinical: ["심리적 자생력"] }, "finish"],
      ["재발을 유발하는 신체 징후(수면 급감 등)를 체크하며 안정적인 의학적 상태 유지하기", { nurse: SCORE_PER_CHOICE }, { nurse: ["생체 리듬 및 재발 리스크 모니터링"] }, "finish"],
      ["치료 이후에도 낙오되거나 고립되지 않도록, 지역사회 안에서 지속적인 모니터링과 돌봄(사례관리) 받기", { social: SCORE_PER_CHOICE }, { social: ["통합 사례관리를 통한 사회 안전망 구축"] }, "finish"],
      ["맞춤형 보조기기나 훈련을 통해 타인의 도움을 최소화하고 독립적인 일상 자립하기", { ot: SCORE_PER_CHOICE }, { ot: ["독립적 일상생활(ADL) 자립"] }, "finish"]
    ]
  }
};

let scores;
let route;
let triggers;
let primaryKeys;
let considerationKeys;
let allSameScore;
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
  primaryKeys = [];
  considerationKeys = [];
  allSameScore = false;
  currentRoom = null;
  historyStack = [];
  currentNode = "title";
}

function snapshot() {
  return JSON.parse(JSON.stringify({
    scores,
    route,
    triggers,
    primaryKeys,
    considerationKeys,
    allSameScore,
    currentRoom,
    currentNode
  }));
}

function restore(state) {
  scores = state.scores;
  route = state.route;
  triggers = state.triggers;
  primaryKeys = state.primaryKeys || [];
  considerationKeys = state.considerationKeys || [];
  allSameScore = Boolean(state.allSameScore);
  currentRoom = state.currentRoom;
  currentNode = state.currentNode;
}

function push() {
  historyStack.push(snapshot());
}

function scene(id) {
  ["titleScene", "hallScene", "roomScene", "resultScene"].forEach((sceneId) => {
    const el = byId(sceneId);
    if (el) el.classList.add("hidden");
  });

  const current = byId(id);
  if (current) current.classList.remove("hidden");
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
  return Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return Object.keys(services).indexOf(a[0]) - Object.keys(services).indexOf(b[0]);
  });
}

function hasResult() {
  return primaryKeys.length > 0 || considerationKeys.length > 0;
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

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = "scene hidden";

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

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("서비스 정리");
  setProgress("방문", 92);
  renderRooms(true);

  let message;

  if (allSameScore) {
    message =
      "답변을 종합했습니다.\n이번 선택에서는 특정 직역이 다른 직역보다 뚜렷하게 높게 나타나지 않았습니다.\n\n상황과 필요에 따라 여러 정신건강전문요원을 함께 고려해볼 수 있습니다.";
  } else {
    const primaryNames = primaryKeys.map((key) => services[key].expert).join(", ");
    const considerationNames = considerationKeys.map((key) => services[key].expert).join(", ");

    message =
      `답변을 종합했습니다.\n당신에게 가장 잘 맞는 전문가는\n‘${primaryNames}’입니다.`;

    if (considerationNames) {
      message += `\n\n또한 ‘${considerationNames}’도 함께 고려해볼 수 있습니다.`;
    }
  }

  dialog(
    "접수 직원",
    `${message}\n\n추천 방을 둘러보거나 바로 결과를 확인할 수 있습니다.`,
    [
      ["나의 맞춤 전문가 확인하기", () => {
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

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

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
  const values = sorted.map(([, value]) => value);
  const maxScore = Math.max(...values);

  allSameScore = values.every((value) => value === values[0]);

  if (allSameScore) {
    primaryKeys = [];
    considerationKeys = sorted.map(([key]) => key);
  } else {
    primaryKeys = sorted
      .filter(([, value]) => value === maxScore)
      .map(([key]) => key);

    considerationKeys = sorted
      .filter(([key, value]) => !primaryKeys.includes(key) && value > 0)
      .map(([key]) => key);
  }

  showHallResult();
}

function roomMarkClass(key) {
  if (!hasResult()) return "";

  if (!allSameScore && primaryKeys.includes(key)) {
    return "recommended";
  }

  if (considerationKeys.includes(key)) {
    return "secondaryMark";
  }

  return "";
}

function roomLabel(key, service, showRecommendation) {
  if (!showRecommendation || !hasResult()) return service.service;

  if (!allSameScore && primaryKeys.includes(key)) {
    return "추천 전문가";
  }

  if (considerationKeys.includes(key)) {
    return "함께 고려";
  }

  return service.service;
}

function renderRooms(showRecommendation) {
  const grid = byId("roomGrid");
  if (!grid) return;

  grid.innerHTML = "";

  Object.entries(services).forEach(([key, service]) => {
    const button = document.createElement("button");
    button.type = "button";

    button.className = `roomBtn ${roomMarkClass(key)}`;
    button.innerHTML = `
      <span class="roomIcon">${service.emoji}</span>
      ${service.room}
      <span class="roomSmall">${roomLabel(key, service, showRecommendation)}</span>
    `;

    button.addEventListener("click", () => {
      push();
      enterRoom(key);
    });

    grid.appendChild(button);
  });
}

function roomChoices() {
  if (hasResult()) {
    return [
      ["나의 맞춤 전문가 확인하기", () => {
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

function ensureRoomNpcImg() {
  let img = byId("roomNpcImg");

  if (!img) {
    img = document.createElement("img");
    img.id = "roomNpcImg";
    img.className = "roomNpcImg";
    img.alt = "";

    const roomScene = byId("roomScene");
    if (roomScene) roomScene.appendChild(img);
  }

  return img;
}

function enterRoom(key) {
  currentNode = "room";
  currentRoom = key;

  const service = services[key];

  scene("roomScene");

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = `scene roomScene room-${key}`;

  setBadge(service.room);
  setProgress("상담실", 96);

  const tableText = byId("tableText");
  if (tableText) tableText.textContent = service.table;

  const roomNpcImg = ensureRoomNpcImg();
  roomNpcImg.src = service.roomNpc;
  roomNpcImg.alt = service.expert;

  let intro;

  if (!hasResult()) {
    intro = `아직 접수 질문을 시작하기 전입니다.\n이 방에서는 ${service.expert}가 어떤 도움을 주는지 미리 둘러볼 수 있습니다.\n\n${service.desc}`;
  } else if (!allSameScore && primaryKeys.includes(key)) {
    intro = `현재 답변에서는 이 전문가가 당신에게 가장 잘 맞는 전문가로 나타났습니다.\n\n${service.desc}`;
  } else if (considerationKeys.includes(key)) {
    intro = `현재 답변에서는 이 전문가도 함께 고려해볼 수 있습니다.\n\n${service.desc}`;
  } else {
    intro = `이 전문가도 정신건강 회복 과정에서 협력할 수 있습니다.\n\n${service.desc}`;
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

  if (picked && picked.length) {
    return `선택하신 답변 중 ${picked.map((item) => `‘${item}’`).join(", ")} 관련 내용이 포함되어 있어 ${service.expert}의 도움이 필요할 수 있습니다.`;
  }

  return `전체 답변의 흐름상 ${service.expert}도 함께 살펴볼 수 있습니다.`;
}

function resultSpeech(key) {
  const map = {
    clinical: "마음을 정확하게 이해하는 것부터 시작하겠습니다!",
    nurse: "증상과 건강관리를 함께 살펴보겠습니다!",
    social: "생활 속 어려움도 함께 연결해 보겠습니다!",
    ot: "일상을 다시 해낼 수 있도록 도와드리겠습니다!"
  };

  return map[key] || "지금 필요한 도움을 함께 찾아보겠습니다!";
}

function resultNpcText(key) {
  const map = {
    clinical: "심리평가와 심리치료(심리상담)를 통해 현재의 어려움을 이해하고 회복을 위한 맞춤 도움을 제공합니다.",
    nurse: "증상관리, 복약관리, 수면과 신체건강을 함께 살피며 안정적인 일상 관리를 돕습니다.",
    social: "가족, 경제, 주거, 복지서비스와 자원연계를 중심으로 생활 속 어려움을 함께 살핍니다.",
    ot: "일상생활훈련, 감각·활동훈련, 인지재활과 작업재활을 통해 일상 기능 회복을 돕습니다."
  };

  return map[key] || services[key].desc;
}

function scoreLabel(value) {
  return `${Number(value).toFixed(1).replace(".0", "")} / 10`;
}

function selectedReasonList(key) {
  const picked = triggers[key];

  if (!picked || !picked.length) {
    return `<li>전체 답변의 흐름상 ${services[key].expert}의 도움도 함께 고려할 수 있습니다.</li>`;
  }

  return picked.map((item) => `<li>${item}</li>`).join("");
}

function resultExpertCard(key, labelText) {
  const service = services[key];

  return `
    <article class="mhResultExpertCard" style="--accent:${service.color}">
      <div class="mhResultTag">${labelText}</div>

      <div class="mhResultBubble">
        ${resultSpeech(key)}
      </div>

      <div class="mhResultImgWrap">
        <img src="${service.resultNpc}" alt="${service.expert}" class="mhResultCharacter">
      </div>

      <div class="mhResultExpertName">
        ${service.emoji} ${service.expert}
      </div>

      <p class="mhResultDesc">
        ${resultNpcText(key)}
      </p>

      <div class="mhResultReason">
        <div class="mhResultReasonTitle">이런 선택이 반영되었어요</div>
        <ul>
          ${selectedReasonList(key)}
        </ul>
      </div>
    </article>
  `;
}

function considerationSimpleCard(key) {
  const service = services[key];

  return `
    <article class="mhConsiderCard" style="--accent:${service.color}">
      <div class="mhConsiderName">${service.emoji} ${service.expert}</div>
      <div class="mhConsiderDesc">${service.desc}</div>
      <div class="mhConsiderReason">${reasonFor(key)}</div>
    </article>
  `;
}

function scoreBars() {
  const sorted = sortedScores();

  return sorted.map(([key, value]) => {
    const service = services[key];
    const pct = Math.round((value / 10) * 100);

    return `
      <div class="bar">
        <div class="barTop">
          <span>${service.emoji} ${service.expert}</span>
          <span>${scoreLabel(value)}</span>
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

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("RESULT");
  setProgress("결과", 100);

  const heroTitle = allSameScore
    ? "함께 고려해볼 수 있는<br>정신건강전문요원"
    : "당신에게 가장 잘 맞는<br>정신건강전문요원";

  const heroText = allSameScore
    ? "이번 선택에서는 특정 직역이 뚜렷하게 높게 나타나지 않았습니다. 상황과 필요에 따라 여러 전문가를 함께 고려해볼 수 있습니다."
    : "당신의 답변을 바탕으로 현재 시점에서 가장 잘 맞는 전문가와 함께 고려해볼 수 있는 전문가를 안내해 드립니다.";

  const mainCardsHtml = allSameScore
    ? considerationKeys.map((key) => resultExpertCard(key, "함께 고려")).join("")
    : primaryKeys.map((key) => resultExpertCard(key, primaryKeys.length > 1 ? "공동 추천" : "추천")).join("");

  const considerHtml = !allSameScore && considerationKeys.length
    ? `
      <section class="mhResultSection">
        <div class="mhSectionTitle">함께 고려해볼 수 있는 전문가</div>
        <div class="mhConsiderGrid">
          ${considerationKeys.map((key) => considerationSimpleCard(key)).join("")}
        </div>
      </section>
    `
    : "";

  byId("resultPaper").innerHTML = `
    <section class="resultHero">
      <h2>🌿 ${heroTitle}</h2>
      <p class="resultSub">${heroText}</p>
    </section>

    <div id="shareCard" class="mhResultWrap">
      <section class="mhResultSection">
        <div class="mhSectionTitle">
          ${allSameScore ? "함께 고려해볼 수 있는 전문가" : "당신에게 가장 잘 맞는 전문가"}
        </div>
        <div class="mhResultExpertGrid">
          ${mainCardsHtml}
        </div>
      </section>

      ${considerHtml}

      <section class="evidence">
        <div class="cardTitle">서비스 필요도</div>
        ${scoreBars()}
      </section>

      <section class="resultNotice">
        이 결과는 현재 응답을 기준으로 한 안내입니다. 상황이나 필요에 따라 다른 전문가의 도움이 필요할 수 있습니다.
      </section>
    </div>

    <div class="resultCredits">
      기획 이혜현 · 제작 유튜브「심리실언니들」<br>
      배포·감수 한국임상심리전문가협회
    </div>

    <button class="saveBtn" type="button" onclick="saveResultImage()">결과 카드 이미지 만들기</button>
    <a id="downloadLink" download="mind-health-center-result.png">이미지 다운로드</a>
    <button class="copyBtn" type="button" onclick="copyResult()">결과 복사하기</button>  `;

  dialog(
    "이용기록",
    allSameScore
      ? "결과가 완성되었습니다.\n이번 선택에서는 여러 전문가를 함께 고려해볼 수 있습니다."
      : "결과가 완성되었습니다.\n현재 응답을 바탕으로 가장 잘 맞는 전문가와 함께 고려하면 좋은 전문가를 정리했습니다."
  );
}

async function copyResult() {
  const lines = [
    "나에게 맞는 정신건강전문요원 찾기 결과",
    ""
  ];

  if (!allSameScore && primaryKeys.length) {
    lines.push("당신에게 가장 잘 맞는 전문가");
    primaryKeys.forEach((key) => {
      lines.push(`- ${services[key].expert}`);
      lines.push(`  설명: ${services[key].desc}`);
      lines.push(`  이유: ${reasonFor(key)}`);
    });
    lines.push("");
  }

  if (considerationKeys.length) {
    lines.push("함께 고려해볼 수 있는 전문가");
    considerationKeys.forEach((key) => {
      lines.push(`- ${services[key].expert}`);
      lines.push(`  설명: ${services[key].desc}`);
      lines.push(`  이유: ${reasonFor(key)}`);
    });
  }

  const text = lines.filter(Boolean).join("\n");

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

async function saveResultImage() {
  const container = document.getElementById("shareCardContainer");

  if (!container) {
    alert("shareCardContainer를 찾을 수 없습니다.");
    return;
  }

  const shareCard = createShareCard({
    services,
    primaryKeys,
    considerationKeys,
    allSameScore,
    triggers,
    resultNpcText
  });

  try {
    container.innerHTML = "";
    container.appendChild(shareCard);

    await downloadShareCard(shareCard, "mind-health-share-card.png");
  } catch (error) {
    console.error(error);
    alert("공유 카드 저장에 실패했습니다.\n\n" + error.message);
  } finally {
    shareCard.remove();
  }
}
function renderRestoredState() {
  if (currentNode === "title") {
    scene("titleScene");

    const roomScene = byId("roomScene");
    if (roomScene) roomScene.className = "scene hidden";

    const oldImg = byId("roomNpcImg");
    if (oldImg) oldImg.remove();

    setBadge("START");
    setProgress("대기", 0);
    dialog("안내", "시작하기를 눌러 마음건강센터에 들어가 보세요.");
    return;
  }

  if (currentNode === "safety") {
    showSafetyHall();
    return;
  }

  if (currentNode === "hallResult") {
    showHallResult();
    return;
  }

  if (currentNode === "emergency") {
    emergency();
    return;
  }

  if (currentNode === "room" && currentRoom) {
    enterRoom(currentRoom);
    return;
  }

  if (currentNode === "result") {
    showResult();
    return;
  }

  if (flow[currentNode]) {
    ask(currentNode);
  }
}

function goBack() {
  if (historyStack.length <= 1) return;

  const previousState = historyStack.pop();
  restore(previousState);
  renderRestoredState();
}

function showHistory() {
  const modal = byId("historyModal");
  const list = byId("historyList");

  if (!modal || !list) return;

  if (!route.length) {
    list.innerHTML = "<p>아직 선택한 답변이 없습니다.</p>";
  } else {
    list.innerHTML = route
      .map((item, index) => `<p><strong>${index + 1}.</strong> ${item}</p>`)
      .join("");
  }

  modal.classList.remove("hidden");
}

function closeHistory() {
  const modal = byId("historyModal");
  if (modal) modal.classList.add("hidden");
}
function restart() {
  resetState();
  scene("titleScene");

  const roomScene = byId("roomScene");
  if (roomScene) roomScene.className = "scene hidden";

  const oldImg = byId("roomNpcImg");
  if (oldImg) oldImg.remove();

  setBadge("START");
  setProgress("대기", 0);
  dialog("안내", "시작하기를 눌러 마음건강센터에 들어가 보세요.");
  historyStack = [snapshot()];
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    start();
  });
});

restart();