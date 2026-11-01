// 設定畫面:帳號狀態、顯示偏好、進度統計與重設進度

import * as state from "./state.js";
import * as cloud from "./cloud.js";

const el = (id) => document.getElementById(id);
const PREFS_KEY = "pyquest-prefs-v1";
const DEFAULT_PREFS = Object.freeze({ motion: true });

let prefs = loadPrefs();
let currentUser = null;
let currentProfile = null;
let onProgressReset = () => {};

/* ── 顯示偏好 ── */
function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(next) {
  prefs = next;
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    // 私密瀏覽存不進去,設定只在這次瀏覽有效
  }
  applyPrefs();
}

/** 把偏好套到畫面上(關閉動畫時在 <html> 掛 data-motion="reduced") */
export function applyPrefs() {
  const root = document.documentElement;
  if (prefs.motion) root.removeAttribute("data-motion");
  else root.setAttribute("data-motion", "reduced");
}

/* ── 初始化 ── */
export function initSettingsUI(options = {}) {
  onProgressReset = options.onProgressReset ?? (() => {});
  applyPrefs();

  el("btn-settings").addEventListener("click", openSettings);
  el("settings-close").addEventListener("click", closeSettings);
  el("settings-modal").addEventListener("click", (e) => {
    if (e.target === el("settings-modal")) closeSettings();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSettings();
  });

  const motionToggle = el("settings-motion");
  motionToggle.checked = prefs.motion;
  motionToggle.addEventListener("change", () => {
    savePrefs({ ...prefs, motion: motionToggle.checked });
  });

  el("settings-account-action").addEventListener("click", handleAccountAction);
  el("settings-reset").addEventListener("click", showConfirm);
  el("settings-reset-cancel").addEventListener("click", hideConfirm);
  el("settings-reset-go").addEventListener("click", handleReset);
}

/** 登入狀態改變時由 main.js 呼叫 */
export function setAccount(user, profile) {
  currentUser = user;
  currentProfile = profile;
  renderAccount();
}

function openSettings() {
  hideConfirm();
  feedback("");
  renderAccount();
  renderStats();
  el("settings-modal").classList.remove("is-hidden");
  el("settings-close").focus();
}

function closeSettings() {
  el("settings-modal").classList.add("is-hidden");
}

/* ── 各區塊渲染 ── */
function renderAccount() {
  const nameEl = el("settings-account-name");
  const descEl = el("settings-account-desc");
  const actionBtn = el("settings-account-action");

  if (!cloud.isConfigured()) {
    nameEl.textContent = "本機模式";
    descEl.textContent = "這個網站還沒連上雲端,進度只存在這台裝置的瀏覽器裡";
    actionBtn.classList.add("is-hidden");
    return;
  }

  actionBtn.classList.remove("is-hidden");
  if (currentUser) {
    nameEl.textContent = `👨‍🚀 ${currentProfile?.display_name || currentUser.email}`;
    descEl.textContent = "進度已同步到雲端,換裝置也能繼續冒險";
    actionBtn.textContent = "登出";
  } else {
    nameEl.textContent = "訪客模式";
    descEl.textContent = "進度只存在這台裝置;登入後就會同步到雲端";
    actionBtn.textContent = "登入";
  }
}

function renderStats() {
  const course = state.getCourse();
  const { xp } = state.getState();
  el("settings-stat-levels").textContent =
    `${state.completedCount()} / ${course.challenges.length}`;
  el("settings-stat-stars").textContent = `⭐ ${state.totalStars()}`;
  el("settings-stat-xp").textContent = `${xp} XP`;
  el("settings-stat-rank").textContent = state.rankFor(xp);

  el("settings-reset-desc").textContent = currentUser
    ? "清空雲端與本機的所有通關紀錄、星星與經驗值,關卡會重新鎖上"
    : "清空這台裝置上的所有通關紀錄、星星與經驗值,關卡會重新鎖上";
}

/* ── 重設進度 ── */
function showConfirm() {
  const done = state.completedCount();
  el("settings-reset-warning").textContent =
    done === 0
      ? "目前沒有任何通關紀錄,重設後畫面不會有變化。"
      : `將清除 ${done} 關的通關紀錄${currentUser ? "(含雲端備份)" : ""},這個動作無法復原。`;
  el("settings-reset-confirm").classList.remove("is-hidden");
  el("settings-reset").disabled = true;
  el("settings-reset-go").focus();
}

function hideConfirm() {
  el("settings-reset-confirm").classList.add("is-hidden");
  el("settings-reset").disabled = false;
}

async function handleReset() {
  const btn = el("settings-reset-go");
  btn.disabled = true;
  btn.textContent = "重設中…";
  feedback("");

  try {
    // 先刪雲端再清本機:順序反過來的話,雲端刪失敗時下次登入會把進度又合併回來
    if (currentUser) {
      const { ok, remaining } = await cloud.deleteOwnProgress();
      if (!ok) {
        feedback(
          `雲端還有 ${remaining} 筆進度沒有刪掉,本機進度保持原樣。` +
            "請老師到 Supabase 執行 supabase/migration-reset-progress.sql 後再試一次。",
          "error"
        );
        return;
      }
    }

    state.resetProgress();
    hideConfirm();
    renderStats();
    onProgressReset();
    feedback("進度已重設,關卡回到最初狀態。", "ok");
  } catch (err) {
    feedback(`重設失敗:${err.message}`, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "確定重設";
  }
}

function feedback(text, kind) {
  const node = el("settings-feedback");
  node.textContent = text;
  node.className = `settings-feedback${kind ? ` is-${kind}` : ""}`;
}

/* ── 帳號操作 ── */
async function handleAccountAction() {
  if (currentUser) {
    await cloud.signOut();
    closeSettings();
  } else {
    // 沿用頁首既有的登入彈窗流程
    closeSettings();
    el("btn-auth").click();
  }
}
