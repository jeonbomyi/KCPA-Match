/**
 * Anonymous analytics for "나에게 맞는 정신건강전문요원 찾기".
 *
 * Privacy: no name, email, IP address, URL, user-agent, or free text is sent.
 * Change GAME_VERSION whenever a released game version should be reported separately.
 */
(function (window) {
  "use strict";

  const GAME_VERSION = "1.0.0";

  // Paste the deployed Google Apps Script Web App URL (/exec) here.
  // An empty URL safely disables network transmission while keeping the game operational.
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyLBtYShrTseoqEJ-giL9P0DM0vMO9Euh8YuK44WJA9Ld1oAupDTLOme_G4Ha-d0THo/exec";

  const STORAGE_PREFIX = "mh-game-analytics";
  const ALLOWED_EVENTS = new Set(["visit", "complete", "share"]);
  const inFlightEvents = new Set();
  const SCORE_KEYS = ["clinical", "social", "nurse", "occupational"];
  const INTERNAL_SCORE_KEYS = {
    clinical: "clinical",
    social: "social",
    nurse: "nurse",
    ot: "occupational",
    occupational: "occupational"
  };

  function normalizeScores(rawScores) {
    const normalized = {
      clinical: 0,
      social: 0,
      nurse: 0,
      occupational: 0
    };

    Object.entries(rawScores || {}).forEach(([key, value]) => {
      const publicKey = INTERNAL_SCORE_KEYS[key];
      const numericValue = Number(value);
      if (publicKey && Number.isFinite(numericValue)) {
        normalized[publicKey] = numericValue;
      }
    });

    return normalized;
  }

  function makePattern(scores) {
    return SCORE_KEYS
      .map((key) => scores[key])
      .sort((a, b) => b - a)
      .join("");
  }

  function normalizeResult(result, scores) {
    const mapped = INTERNAL_SCORE_KEYS[result];
    if (mapped) return mapped;

    // Ties use a stable order for the single distribution column.
    // The exact tie remains visible in `pattern` and `scores`.
    return SCORE_KEYS.reduce((best, key) => (
      scores[key] > scores[best] ? key : best
    ), SCORE_KEYS[0]);
  }

  function storageKey(eventName) {
    // Version-scoped deduplication makes version-level funnels meaningful after releases.
    return `${STORAGE_PREFIX}:${GAME_VERSION}:${eventName}`;
  }

  function wasRecorded(eventName) {
    try {
      return window.localStorage.getItem(storageKey(eventName)) === "1";
    } catch (_) {
      return false;
    }
  }

  function markRecorded(eventName) {
    try {
      window.localStorage.setItem(storageKey(eventName), "1");
    } catch (_) {
      // Storage can be unavailable in private/restricted browser modes.
    }
  }

  async function send(eventName, details) {
    if (
      !ALLOWED_EVENTS.has(eventName) ||
      wasRecorded(eventName) ||
      inFlightEvents.has(eventName)
    ) {
      return false;
    }

    const now = new Date();
    const payload = {
      timestamp: now.toISOString(),
      month: now.toISOString().slice(0, 7),
      event: eventName,
      version: GAME_VERSION,
      result: "",
      pattern: "",
      scores: ""
    };

    if (eventName === "complete") {
      const normalizedScores = normalizeScores(details && details.scores);
      payload.result = normalizeResult(details && details.finalResult, normalizedScores);
      payload.pattern = makePattern(normalizedScores);
      payload.scores = JSON.stringify(normalizedScores);
    }

    // No configured backend means analytics is intentionally disabled.
    if (!WEB_APP_URL) return false;

    inFlightEvents.add(eventName);
    try {
      await window.fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-store",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      markRecorded(eventName);
      return true;
    } catch (error) {
      // Analytics must never interrupt or alter the game.
      console.warn("[Analytics] Event delivery failed.", error);
      return false;
    } finally {
      inFlightEvents.delete(eventName);
    }
  }

  const Analytics = Object.freeze({
    GAME_VERSION,
    trackVisit: () => void send("visit"),
    trackComplete: (details) => void send("complete", details),
    trackShare: () => void send("share")
  });

  window.GameAnalytics = Analytics;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Analytics.trackVisit, { once: true });
  } else {
    Analytics.trackVisit();
  }
})(window);
