const SHARE_CARD_LOGO_PATH = "./assets/logo/kocpa-logo.png";

function createShareCard(data) {
  const {
    services,
    primaryKeys,
    considerationKeys,
    allSameScore,
    triggers,
    resultNpcText
  } = data;

  const mainKeys = allSameScore ? considerationKeys : primaryKeys.slice(0, 2);
const npcStageClass = mainKeys.length >= 4
  ? "is-quad"
  : mainKeys.length > 1
    ? "is-duo"
    : "is-single";
  const considerKeys = allSameScore
  ? []
  : considerationKeys.filter((key) => !primaryKeys.includes(key));

  const titleName = allSameScore
    ? "함께 고려해볼 수 있는 정신건강전문요원"
    : mainKeys.map((key) => services[key].expert).join(" · ");

const descriptionHtml = allSameScore
  ? `<div class="mhShareDescText">이번 선택에서는 특정 직역이 뚜렷하게 높게 나타나지 않았습니다.</div>`
  : mainKeys.length > 1
    ? mainKeys.map((key) => `
      <div class="mhShareDescLine">
        <strong>${services[key].expert}</strong>
        <span>${resultNpcText(key)}</span>
      </div>
    `).join("")
    : `<div class="mhShareDescText">${resultNpcText(mainKeys[0])}</div>`;

const reasonKeys = allSameScore ? considerationKeys : mainKeys;

const reasonHtml = reasonKeys.map((key) => {
  const picked = triggers[key] || [];
  const reasons = picked.length
    ? picked
    : [`전체 답변의 흐름상 ${services[key].expert}의 도움을 함께 고려할 수 있습니다.`];

  return `
    <div class="mhShareReasonGroup">
      <div class="mhShareReasonName">${services[key].expert}</div>
      <ul class="mhShareReasonList">
        ${reasons.slice(0, 3).map((reason) => `<li>${reason}</li>`).join("")}
      </ul>
    </div>
  `;
}).join("");

  const card = document.createElement("article");
  card.className = "mhShareCard";
  card.setAttribute("aria-label", "공유용 결과 카드");

  card.innerHTML = `
    <div class="mhShareInner">
      <h1 class="mhShareTitle">🌿 당신에게 가장 잘 맞는<br>정신건강전문요원</h1>

      <div class="mhShareNpcStage ${npcStageClass}">
  ${allSameScore
    ? `<img class="mhShareLineup" src="./assets/npc/title_lineup.png" alt="정신건강전문요원 네 명">`
    : mainKeys.map((key) => `
      <img class="mhShareNpc mhShareNpc-${key}" src="${services[key].resultNpc}" alt="${services[key].expert}">
    `).join("")
  }
</div>

      <h2 class="mhShareExpertName">${titleName}</h2>

      <div class="mhShareDesc ${allSameScore ? "is-single" : mainKeys.length > 1 ? "is-duo" : "is-single"}">
  ${descriptionHtml}
</div>

      ${considerKeys.length ? `
        <section class="mhShareConsider">
          <div class="mhShareSectionTitle">함께 고려해볼 전문가</div>
          <div class="mhShareConsiderList">
            ${considerKeys.slice(0, 4).map((key) => `
              <div class="mhShareConsiderItem">
                <div class="mhShareConsiderName">${services[key].emoji} ${services[key].expert}</div>
                <div class="mhShareConsiderDesc">${services[key].desc}</div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}

      <section class="mhShareReason ${reasonKeys.length >= 4 ? "is-quad" : reasonKeys.length > 1 ? "is-duo" : "is-single"}">
      <div class="mhShareSectionTitle">왜 추천되었나요?</div>
  <div class="mhShareReasonGroups">
    ${reasonHtml}
  </div>
</section>

      <footer class="mhShareCredits">
        <p class="mhShareCreditsLead">
          정신건강전문요원은 함께 협력하지만,<br />
          각자의 전문 역할은 다릅니다.
        </p>

        <p class="mhShareProject">🌿 나에게 맞는 정신건강전문요원 찾기</p>

        <div class="mhShareCreditRows">
          <div>기획 │ 이혜현 · 제작 유튜브「심리실언니들」
          <div>배포·감수 │ 한국임상심리전문가협회</div>
        </div>

        <img
          class="mhShareLogoImg"
          src="${SHARE_CARD_LOGO_PATH}"
          alt="한국임상심리전문가협회(KOCPA)"
          onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'mhShareLogoText', textContent: '한국임상심리전문가협회(KOCPA)' }))"
        >
      </footer>
    </div>
  `;

  return card;
}

function waitForShareCardImages(card) {
  const images = Array.from(card.querySelectorAll("img"));

  return Promise.all(images.map((img) => {
    if (img.complete) return Promise.resolve();

    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  }));
}

async function captureShareCard(card) {
  if (typeof html2canvas === "undefined") {
    throw new Error("html2canvas가 로드되지 않았습니다.");
  }

  await waitForShareCardImages(card);

  return html2canvas(card, {
    scale: 1,
    useCORS: true,
    backgroundColor: "#f2dfb8",
    width: 1080,
    height: 1350,
    windowWidth: 1080,
    windowHeight: 1350
  });
}

async function downloadShareCard(card, filename = "mind-health-share-card.png") {
  const canvas = await captureShareCard(card);
  const url = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  return canvas;
}