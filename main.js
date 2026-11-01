// PyQuest 主程式:畫面切換、關卡渲染、執行流程、雲端同步

import { buildCourse, DEFAULT_COURSE } from "./challenges.js";
import { renderLesson } from "./lesson-view.js";
import { initRunner, runCode, isReady } from "./runner.js";
import * as state from "./state.js";
import * as cloud from "./cloud.js";
import { initAuthUI, renderAuthState } from "./auth.js";
import { initSettingsUI, setAccount } from "./settings.js";

const el = (id) => document.getElementById(id);

let editor = null;
let currentLevel = null;
let course = DEFAULT_COURSE;
let runnerMessage = "Python 引擎載入中，可以先閱讀講義。";

/* ── 頁首統計 ── */
function renderStats() {
  const { xp } = state.getState();
  el("xp-value").textContent = `${xp} XP`;
  el("xp-fill").style.width = `${Math.min(100, (xp / course.maxXp) * 100)}%`;
  el("star-value").textContent = `⭐ ${state.totalStars()}`;
  el("rank-value").textContent = state.rankFor(xp);
}

/* ── 星圖(依章節分區) ── */
function renderMap() {
  el("chapter-count").textContent = course.chapters.length;
  el("level-count").textContent = course.challenges.length;
  const map = el("level-map");
  map.innerHTML = "";
  let flatIndex = 0;

  course.chapters.forEach((chapter) => {
    const doneCount = chapter.levels.filter((l) => state.isCompleted(l.id)).length;

    const section = document.createElement("section");
    section.className = "chapter-section";
    section.innerHTML = `
      <header class="chapter-head">
        <span class="chapter-emoji">${chapter.emoji}</span>
        <div class="chapter-info">
          <p class="chapter-kicker">Chapter ${chapter.num}</p>
          <h2 class="chapter-title">${chapter.title}</h2>
          <p class="chapter-sub">${chapter.subtitle}</p>
        </div>
        <span class="chapter-progress${doneCount === chapter.levels.length ? " is-complete" : ""}">
          ${doneCount}/${chapter.levels.length}
        </span>
      </header>
    `;

    const grid = document.createElement("ol");
    grid.className = "chapter-grid";

    chapter.levels.forEach((level) => {
      const index = flatIndex++;
      const unlocked = state.isUnlocked(index);
      const done = state.isCompleted(level.id);
      const stars = state.getStars(level.id);

      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = `level-card${done ? " is-done" : ""}`;
      btn.disabled = !unlocked;
      btn.innerHTML = `
        <span class="level-num">第 ${level.label} 關</span>
        <span class="level-planet">${level.planet}</span>
        <h3 class="level-name">${level.title}</h3>
        <p class="level-topic">${level.topic}</p>
        <span class="level-stars">${
          done ? "⭐".repeat(stars) + "☆".repeat(3 - stars) : unlocked ? "未挑戰" : ""
        }</span>
        ${unlocked ? "" : '<span class="level-lock">🔒</span>'}
      `;
      if (unlocked) {
        btn.addEventListener("click", () => openLevel(index));
      }
      li.appendChild(btn);
      if (level.lesson) {
        const read = document.createElement("button");
        read.className = "lesson-link";
        read.textContent = "📖 閱讀講義";
        read.setAttribute("aria-label", `閱讀 ${level.title} 的講義`);
        read.addEventListener("click", () => openLevel(index, true));
        li.appendChild(read);
      }
      grid.appendChild(li);
    });

    section.appendChild(grid);
    map.appendChild(section);
  });
}

/* ── 挑戰畫面 ── */
function openLevel(index, readOnly = false) {
  currentLevel = { ...course.challenges[index], index, readOnly };
  el("challenge-planet").textContent = currentLevel.planet;
  el("challenge-tag").textContent = `第 ${currentLevel.label} 關 · ${currentLevel.topic}`;
  el("challenge-title").textContent = currentLevel.title;
  el("challenge-story").textContent = currentLevel.story;
  renderLesson(el("challenge-lesson"), currentLevel.lesson);
  document.querySelector(".challenge-layout").classList.toggle("is-reading", readOnly);
  document.querySelector(".challenge-work").classList.toggle("is-hidden", readOnly);
  el("btn-hint").classList.toggle("is-hidden", readOnly);
  el("reading-note").classList.toggle("is-hidden", !readOnly);
  el("reading-note").textContent = state.isUnlocked(index)
    ? "讀完後可以開始練習，閱讀不會增加嘗試次數。"
    : "本關尚未解鎖，你可以先閱讀講義；完成前一關後就能練習。";
  el("btn-practice").classList.toggle("is-hidden", !readOnly || !state.isUnlocked(index));
  el("challenge-instructions").innerHTML =
    "<ul>" + currentLevel.instructions.map((s) => `<li>${s}</li>`).join("") + "</ul>";
  el("hint-text").classList.add("is-hidden");
  el("hint-text").textContent = "";
  el("output-console").textContent = isReady() ? "等待執行…" : runnerMessage;
  el("output-console").classList.remove("has-error");
  el("test-results").innerHTML = "";

  editor.setValue(currentLevel.starter ?? "");
  showView("challenge");
  editor.refresh();
  editor.setSize("100%", null);
  if (!readOnly) editor.focus();
}

function showView(name) {
  el("view-map").classList.toggle("is-hidden", name !== "map");
  el("view-challenge").classList.toggle("is-hidden", name !== "challenge");
  window.scrollTo({ top: 0 });
}

function goHome() {
  currentLevel = null;
  renderStats();
  renderMap();
  showView("map");
}

/* ── 執行與判定 ── */
async function handleRun() {
  if (!currentLevel || currentLevel.readOnly || !state.isUnlocked(currentLevel.index)) return;
  if (!isReady()) {
    el("output-console").textContent = runnerMessage;
    return;
  }
  const btn = el("btn-run");
  btn.disabled = true;
  btn.textContent = "⏳ 執行中…";
  state.recordAttempt(currentLevel.id);

  try {
    const result = await runCode(editor.getValue(), currentLevel.tests, currentLevel.stdin ?? []);
    renderRunResult(result);
    if (!result.error && result.results.every((r) => r.passed)) {
      celebrate();
    }
  } catch (err) {
    el("output-console").textContent = `系統錯誤:${err.message}`;
    el("output-console").classList.add("has-error");
  } finally {
    btn.disabled = false;
    btn.textContent = "▶ 執行任務";
  }
}

function renderRunResult(result) {
  const consoleEl = el("output-console");
  if (result.error) {
    consoleEl.textContent = result.error;
    consoleEl.classList.add("has-error");
  } else {
    consoleEl.textContent = result.output || "(沒有輸出 — 記得用 print())";
    consoleEl.classList.remove("has-error");
  }

  const box = el("test-results");
  box.innerHTML = "";
  result.results.forEach((r) => {
    const item = document.createElement("div");
    item.className = `test-item ${r.passed ? "pass" : "fail"}`;
    item.innerHTML = `<span>${r.passed ? "✅" : "❌"}</span><span>${r.name}${
      r.passed ? "" : ` — ${escapeHtml(r.message)}`
    }</span>`;
    box.appendChild(item);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ── 通關 ── */
function celebrate() {
  const { stars, gainedXp, firstClear } = state.recordClear(currentLevel);
  renderStats();

  // 登入中就順手同步到雲端(失敗不擋遊戲,下次登入會再合併)
  cloud.upsertProgress([
    { level_id: currentLevel.id, stars, xp: currentLevel.xp },
  ]);

  el("victory-planet").textContent = currentLevel.planet;
  el("victory-xp").textContent = firstClear ? `+${gainedXp} XP` : "已通關 ✓";
  el("victory-msg").textContent = firstClear
    ? `獲得 ${"⭐".repeat(stars)} !${currentLevel.title} 的訊號站修復完成。`
    : "再次通關,實力更穩固了!";

  const isLast = currentLevel.index === course.challenges.length - 1;
  el("btn-next").textContent = isLast ? "🏆 回星圖領獎" : "下一顆星球 →";
  el("victory-modal").classList.remove("is-hidden");
}

function goNext() {
  el("victory-modal").classList.add("is-hidden");
  const nextIndex = currentLevel.index + 1;
  if (nextIndex < course.challenges.length) {
    openLevel(nextIndex);
  } else {
    goHome();
  }
}

/* ── 雲端 ── */
async function onAuthChanged(user) {
  const profile = user ? await cloud.fetchProfile() : null;
  renderAuthState(user, profile);
  setAccount(user, profile);
  if (user) {
    const cloudRows = await cloud.fetchProgress();
    const toPush = state.mergeCloud(cloudRows);
    if (toPush.length > 0) cloud.upsertProgress(toPush);
  }
  renderStats();
  renderMap();
}

/* ── 初始化 ── */
function bindEvents() {
  el("logo-home").addEventListener("click", (e) => {
    e.preventDefault();
    goHome();
  });
  el("btn-back").addEventListener("click", goHome);
  el("btn-practice").addEventListener("click", () => {
    if (currentLevel && state.isUnlocked(currentLevel.index)) openLevel(currentLevel.index);
  });
  el("btn-run").addEventListener("click", handleRun);
  el("btn-reset").addEventListener("click", () => {
    if (currentLevel) {
      editor.setValue(currentLevel.starter ?? "");
      editor.refresh();
      editor.setSize("100%", null);
    }
  });
  el("btn-hint").addEventListener("click", () => {
    if (!currentLevel || currentLevel.readOnly) return;
    state.recordHint(currentLevel.id);
    const hint = el("hint-text");
    hint.textContent = currentLevel.hint;
    hint.classList.remove("is-hidden");
  });
  el("btn-stay").addEventListener("click", () => {
    el("victory-modal").classList.add("is-hidden");
    renderMap();
  });
  el("btn-next").addEventListener("click", goNext);
}

async function boot() {
  // 一開始就下載 Python 引擎，與雲端初始化、畫面繪製同時進行
  const enginePromise = initRunner();
  enginePromise.catch(() => {}); // 失敗時由下方 await 處理，這裡只避免未處理警告

  editor = CodeMirror.fromTextArea(el("code-editor"), {
    mode: "python",
    lineNumbers: true,
    lineWrapping: true,
    indentUnit: 4,
    autofocus: false,
    extraKeys: {
      "Ctrl-Enter": handleRun,
      "Cmd-Enter": handleRun,
    },
  });

  // The editor is created while the challenge view is hidden. Refresh it when
  // the panel receives its real width, which prevents the first render from
  // being wider than the viewport until the user clicks Reset.
  const editorPanel = document.querySelector(".editor-panel");
  if (window.ResizeObserver && editorPanel) {
    const observer = new ResizeObserver(() => {
      if (editor) {
        editor.refresh();
        editor.setSize("100%", null);
      }
    });
    observer.observe(editorPanel);
  }

  bindEvents();
  initAuthUI();
  initSettingsUI({ onProgressReset: goHome });

  // 雲端初始化(未設定時整段跳過,維持訪客模式)
  try {
    await cloud.initCloud(onAuthChanged);
    const customRows = await cloud.fetchCustomLevels();
    if (customRows.length > 0) {
      course = buildCourse(customRows.filter((r) => r.published));
      state.setCourse(course);
    }
  } catch (err) {
    console.warn("雲端初始化失敗,以訪客模式繼續:", err);
  }

  renderStats();
  renderMap();

  // 講義不依賴 Python 引擎；載入期間仍可閱讀。
  el("loading-overlay").classList.add("is-gone");
  el("btn-run").disabled = true;
  el("btn-run").textContent = "Python 載入中…";
  try {
    await enginePromise;
    el("btn-run").disabled = false;
    el("btn-run").textContent = "▶ 執行任務";
    if (currentLevel) el("output-console").textContent = "等待執行…";
  } catch (err) {
    runnerMessage = `Python 引擎載入失敗，請確認網路後重新整理。講義仍可閱讀。\n${err.message}`;
    el("btn-run").textContent = "Python 尚未就緒";
    if (currentLevel) el("output-console").textContent = runnerMessage;
  }
}

boot();
