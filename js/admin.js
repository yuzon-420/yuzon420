// 教師後台:學生進度總覽 + 解題紀錄 + 全班錯誤統計 + 自訂題目管理
// 權限由 Firestore 安全規則(firebase/firestore.rules)把關,這裡的檢查只是為了介面提示。

import * as cloud from "./cloud.js";
import { DEFAULT_COURSE, CHAPTER_OPTIONS, buildCourse } from "./challenges.js";

const el = (id) => document.getElementById(id);

let students = [];
let progressRows = [];
let customLevels = [];
let course = DEFAULT_COURSE; // 含老師覆寫與新增題目的完整課程
let subSummary = null; // 解題紀錄總覽(切到相關分頁時才載入)
let subSummaryError = null;

// 目前正在編輯什麼:
//   { mode: "new" }                        新增一題
//   { mode: "custom", row }                編輯老師自己新增的題目
//   { mode: "builtin", level, row|null }   編輯內建題(row 是既有的覆寫記錄)
let editing = null;

/* ── 啟動與權限 ── */
async function boot() {
  if (!cloud.isConfigured()) {
    el("gate-message").innerHTML =
      "尚未設定 Firebase。<br />請先把 Firebase 的設定值填進 <code>js/config.js</code>,並發布 <code>firebase/firestore.rules</code>。";
    return;
  }

  // 只在使用者真的登出時才重整。INITIAL_SESSION 在訂閱當下必定觸發一次,
  // 若對它重整會讓頁面陷入無窮重載,學生進度永遠來不及顯示。
  await cloud.initCloud((_user, event) => {
    if (event === "SIGNED_OUT") window.location.reload();
  });
  const user = await cloud.refreshUser();
  if (!user) {
    el("gate-message").innerHTML =
      '尚未登入。<br /><a href="index.html">← 回遊戲頁登入</a>後再進入後台。';
    return;
  }

  const profile = await cloud.fetchProfile();
  if (profile?.role !== "teacher") {
    el("gate-message").innerHTML =
      "這個帳號沒有教師權限。<br />請到 Firebase Console → Firestore Database → <code>users</code> 集合,找到你的文件,把 <code>role</code> 改成 <code>teacher</code>。";
    return;
  }

  el("admin-user").textContent = `👩‍🏫 ${profile.display_name || user.email}`;
  el("admin-gate").classList.add("is-hidden");
  el("admin-body").classList.remove("is-hidden");

  bindEvents();
  fillChapterOptions();
  await refreshAll();
}

function bindEvents() {
  el("tab-students").addEventListener("click", () => switchTab("students"));
  el("tab-levels").addEventListener("click", () => switchTab("levels"));
  el("tab-code").addEventListener("click", () => switchTab("code"));
  el("tab-class").addEventListener("click", () => switchTab("class"));
  el("code-student").addEventListener("change", onCodeStudentChange);
  el("code-level").addEventListener("change", loadSubmissionList);
  el("btn-code-reload").addEventListener("click", async () => {
    subSummary = null;
    await ensureSummary();
    fillCodeStudents();
  });
  el("class-level").addEventListener("change", loadClassStats);
  el("btn-class-reload").addEventListener("click", async () => {
    subSummary = null;
    await openClassTab();
  });
  el("btn-refresh").addEventListener("click", refreshAll);
  el("btn-new-level").addEventListener("click", () => openEditor({ mode: "new" }));
  el("filter-chapter").addEventListener("change", renderLevels);
  el("btn-cancel-edit").addEventListener("click", closeEditor);
  el("level-form").addEventListener("submit", saveLevel);
}

function switchTab(name) {
  for (const t of ["students", "code", "class", "levels"]) {
    el(`tab-${t}`).classList.toggle("is-active", name === t);
    el(`panel-${t}`).classList.toggle("is-hidden", name !== t);
  }
  if (name === "code") openCodeTab();
  if (name === "class") openClassTab();
}

async function refreshAll() {
  try {
    [students, progressRows, customLevels] = await Promise.all([
      cloud.adminFetchStudents(),
      cloud.adminFetchAllProgress(),
      cloud.fetchCustomLevels(),
    ]);
    course = buildCourse(customLevels);
    subSummary = null;
    renderStudents();
    renderLevels();
  } catch (err) {
    el("students-summary").textContent = `讀取失敗:${err.message}`;
  }
}

/* ── 學生進度 ── */
function renderStudents() {
  const byUser = new Map();
  for (const row of progressRows) {
    if (!byUser.has(row.user_id)) {
      byUser.set(row.user_id, { count: 0, stars: 0, xp: 0, last: null });
    }
    const acc = byUser.get(row.user_id);
    acc.count += 1;
    acc.stars += row.stars ?? 0;
    acc.xp += row.xp ?? 0;
    if (!acc.last || row.completed_at > acc.last) acc.last = row.completed_at;
  }

  const learners = students.filter((s) => s.role === "student");
  const totalLevels = DEFAULT_COURSE.challenges.length;
  el("students-summary").textContent =
    `共 ${learners.length} 位學生 · 課程總關卡 ${totalLevels} 關`;

  const rows = students
    .map((s) => ({ ...s, ...(byUser.get(s.id) ?? { count: 0, stars: 0, xp: 0, last: null }) }))
    .sort((a, b) => b.xp - a.xp);

  const tbody = el("students-table").querySelector("tbody");
  tbody.innerHTML = "";
  for (const r of rows) {
    const tr = document.createElement("tr");
    const name = r.display_name || "(未命名)";
    const badge = r.role === "teacher" ? " 👩‍🏫" : "";
    tr.innerHTML = `
      <td>${escapeHtml(name)}${badge}</td>
      <td class="num">${r.count} / ${totalLevels}</td>
      <td class="num">⭐ ${r.stars}</td>
      <td class="num">${r.xp}</td>
      <td>${r.last ? new Date(r.last).toLocaleDateString("zh-TW") : "—"}</td>
    `;
    tbody.appendChild(tr);
  }

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">還沒有學生註冊</td></tr>';
  }
}

/* ── 題目管理 ── */
function fillChapterOptions() {
  const opts =
    CHAPTER_OPTIONS.map(
      (c) => `<option value="${c.num}">第 ${c.num} 章 — ${escapeHtml(c.title)}</option>`
    ).join("") + '<option value="10">特別任務星系(獨立章節)</option>';

  el("f-chapter").innerHTML = opts;
  el("filter-chapter").innerHTML = '<option value="all">全部章節</option>' + opts;
}

/** 依 override_id 索引覆寫記錄 */
function overrideMap() {
  return new Map(
    customLevels.filter((r) => r.override_id).map((r) => [r.override_id, r])
  );
}

/** 老師新增的獨立題目(非覆寫) */
function additionRows() {
  return customLevels.filter((r) => !r.override_id);
}

function renderLevels() {
  const overrides = overrideMap();
  const additions = additionRows();
  const filter = el("filter-chapter").value; // "all" 或章節號

  el("levels-summary").textContent =
    `內建 ${DEFAULT_COURSE.challenges.length} 題(已修改 ${overrides.size} 題) · 新增 ${additions.length} 題`;

  const tbody = el("levels-table").querySelector("tbody");
  tbody.innerHTML = "";

  const addRow = (cells, actions) => {
    const tr = document.createElement("tr");
    tr.innerHTML = cells;
    const box = document.createElement("div");
    box.className = "row-actions";
    actions.forEach((b) => box.appendChild(b));
    tr.lastElementChild.appendChild(box);
    tbody.appendChild(tr);
  };

  const makeBtn = (text, onClick) => {
    const b = document.createElement("button");
    b.className = "btn btn-ghost";
    b.textContent = text;
    b.addEventListener("click", onClick);
    return b;
  };

  for (const chapter of DEFAULT_COURSE.chapters) {
    if (filter !== "all" && String(chapter.num) !== filter) continue;

    // 內建題(可編輯,編輯後以覆寫記錄取代)
    for (const level of chapter.levels) {
      const ov = overrides.get(level.id);
      const shown = ov ? { ...ov.data } : level;
      const editBtn = makeBtn("編輯", () => openEditor({ mode: "builtin", level, row: ov ?? null }));
      const actions = [editBtn];

      if (ov) {
        actions.push(
          makeBtn("還原內建版", async () => {
            if (!confirm(`「${level.title}」要還原成原本的內建題目嗎?你的修改會被丟棄。`)) return;
            await cloud.adminDeleteLevel(ov.id);
            await refreshAll();
          })
        );
      }

      addRow(
        `<td class="num">第 ${level.label} 關</td>
         <td>${shown.planet ?? ""} ${escapeHtml(shown.title ?? "")}</td>
         <td class="num">${shown.xp ?? "—"}</td>
         <td class="${ov ? "tag-modified" : "tag-builtin"}">${ov ? "✎ 已修改" : "內建"}</td>
         <td></td>`,
        actions
      );
    }

    // 這一章底下老師新增的題目
    for (const row of additions.filter((r) => r.chapter_num === chapter.num)) {
      addRow(
        `<td class="num">第 ${chapter.num} 章 · 新增</td>
         <td>${row.data?.planet ?? ""} ${escapeHtml(row.data?.title ?? "(無標題)")}</td>
         <td class="num">${row.data?.xp ?? "—"}</td>
         <td class="${row.published ? "tag-published" : "tag-draft"}">${row.published ? "● 已發布" : "○ 草稿"}</td>
         <td></td>`,
        [
          makeBtn("編輯", () => openEditor({ mode: "custom", row })),
          makeBtn(row.published ? "下架" : "發布", async () => {
            await cloud.adminUpdateLevel(row.id, { published: !row.published });
            await refreshAll();
          }),
          makeBtn("刪除", async () => {
            const title = row.data?.title ?? "這題";
            if (!confirm(`確定要永久刪除「${title}」嗎?學生已完成的紀錄不會被清除,但這關會從課程中消失。`)) return;
            await cloud.adminDeleteLevel(row.id);
            await refreshAll();
          }),
        ]
      );
    }
  }

  // 不屬於任何內建章節的新增題目(特別任務星系)
  const knownNums = new Set(DEFAULT_COURSE.chapters.map((c) => c.num));
  const orphans = additions.filter((r) => !knownNums.has(r.chapter_num));
  if (orphans.length > 0 && (filter === "all" || filter === "10")) {
    for (const row of orphans) {
      addRow(
        `<td class="num">特別任務</td>
         <td>${row.data?.planet ?? ""} ${escapeHtml(row.data?.title ?? "(無標題)")}</td>
         <td class="num">${row.data?.xp ?? "—"}</td>
         <td class="${row.published ? "tag-published" : "tag-draft"}">${row.published ? "● 已發布" : "○ 草稿"}</td>
         <td></td>`,
        [
          makeBtn("編輯", () => openEditor({ mode: "custom", row })),
          makeBtn(row.published ? "下架" : "發布", async () => {
            await cloud.adminUpdateLevel(row.id, { published: !row.published });
            await refreshAll();
          }),
          makeBtn("刪除", async () => {
            if (!confirm("確定要永久刪除這題嗎?")) return;
            await cloud.adminDeleteLevel(row.id);
            await refreshAll();
          }),
        ]
      );
    }
  }

  if (tbody.children.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">這個章節沒有題目</td></tr>';
  }
}

function openEditor(ctx = { mode: "new" }) {
  editing = ctx;
  el("editor-error").textContent = "";

  // 決定表單要填入的內容:內建題若已被改過,顯示改過的版本
  let d = {};
  let chapterNum = CHAPTER_OPTIONS[0].num;
  let position = 999;

  if (ctx.mode === "builtin") {
    d = ctx.row ? ctx.row.data : ctx.level;
    chapterNum = ctx.level.label.split("-")[0];
    el("editor-title").textContent = `編輯內建題目 — 第 ${ctx.level.label} 關`;
  } else if (ctx.mode === "custom") {
    d = ctx.row.data ?? {};
    chapterNum = ctx.row.chapter_num;
    position = ctx.row.position ?? 999;
    el("editor-title").textContent = "編輯題目";
  } else {
    el("editor-title").textContent = "新增題目";
  }

  // 內建題是「就地取代」,章節與排序由原本的位置決定,不讓老師改
  const isBuiltin = ctx.mode === "builtin";
  el("row-chapter").classList.toggle("is-hidden", isBuiltin);
  el("row-position").classList.toggle("is-hidden", isBuiltin);
  el("builtin-note").classList.toggle("is-hidden", !isBuiltin);

  el("f-chapter").value = String(chapterNum);
  el("f-position").value = position;
  el("f-planet").value = d.planet ?? "🪐";
  el("f-title").value = d.title ?? "";
  el("f-topic").value = d.topic ?? "";
  el("f-xp").value = d.xp ?? 50;
  el("f-story").value = d.story ?? "";
  el("f-instructions").value = (d.instructions ?? []).join("\n");
  el("f-starter").value = d.starter ?? "";
  el("f-hint").value = d.hint ?? "";
  for (const key of ["concept", "syntax", "example", "explanation", "pitfall"]) {
    el(`f-lesson-${key}`).value = d.lesson?.[key] ?? "";
  }
  el("f-stdin").value = (d.stdin ?? []).join("\n");
  el("f-tests").value = d.tests ? JSON.stringify(d.tests, null, 2) : "";

  el("level-editor").classList.remove("is-hidden");
  el("level-editor").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeEditor() {
  editing = null;
  el("level-editor").classList.add("is-hidden");
  el("level-form").reset();
}

async function saveLevel(e) {
  e.preventDefault();
  const errorEl = el("editor-error");
  errorEl.textContent = "";

  let tests;
  try {
    tests = JSON.parse(el("f-tests").value);
  } catch (err) {
    errorEl.textContent = `測試不是有效的 JSON:${err.message}`;
    return;
  }
  if (!Array.isArray(tests) || tests.length === 0) {
    errorEl.textContent = "測試必須是至少含一個項目的陣列";
    return;
  }
  const bad = tests.find((t) => typeof t?.name !== "string" || typeof t?.code !== "string");
  if (bad) {
    errorEl.textContent = "每個測試都要有 name 和 code 兩個字串欄位";
    return;
  }

  const instructions = el("f-instructions").value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (instructions.length === 0) {
    errorEl.textContent = "任務目標至少要寫一條";
    return;
  }

  const stdin = el("f-stdin").value.split("\n").filter((s) => s !== "");

  const data = {
    planet: el("f-planet").value.trim(),
    title: el("f-title").value.trim(),
    topic: el("f-topic").value.trim(),
    story: el("f-story").value.trim(),
    instructions,
    starter: el("f-starter").value,
    hint: el("f-hint").value.trim(),
    xp: Number(el("f-xp").value),
    tests,
  };
  const lesson = {};
  for (const key of ["concept", "syntax", "example", "explanation", "pitfall"]) {
    const value = el(`f-lesson-${key}`).value.trim();
    if (value) lesson[key] = value;
  }
  if (Object.keys(lesson).length) data.lesson = lesson;
  if (stdin.length > 0) data.stdin = stdin;

  const btn = el("btn-save-level");
  btn.disabled = true;
  btn.textContent = "儲存中…";
  try {
    if (editing.mode === "builtin") {
      // 覆寫內建題:已經改過就更新那筆,否則新建一筆覆寫記錄
      if (editing.row) {
        await cloud.adminUpdateLevel(editing.row.id, { data, published: true });
      } else {
        await cloud.adminInsertLevel({
          chapter_num: Number(editing.level.label.split("-")[0]),
          position: 0,
          data,
          override_id: editing.level.id,
          published: true,
        });
      }
    } else {
      const payload = {
        chapter_num: Number(el("f-chapter").value),
        position: Number(el("f-position").value) || 999,
        data,
      };
      if (editing.mode === "custom") {
        await cloud.adminUpdateLevel(editing.row.id, payload);
      } else {
        await cloud.adminInsertLevel({ ...payload, published: true });
      }
    }
    closeEditor();
    await refreshAll();
  } catch (err) {
    errorEl.textContent = `儲存失敗:${err.message}`;
  } finally {
    btn.disabled = false;
    btn.textContent = "儲存題目";
  }
}

/* ── 解題紀錄 + 全班錯誤統計 ── */
function levelInfo(levelId) {
  return course.challenges.find((c) => c.id === levelId) ?? null;
}

function levelTitle(levelId) {
  const lv = levelInfo(levelId);
  return lv ? `第 ${lv.label} 關 · ${lv.title}` : levelId;
}

/** 讀取解題統計總覽;讀不到(例如規則沒發布)時在兩個分頁顯示提示 */
async function ensureSummary() {
  if (subSummary) return true;
  try {
    subSummary = await cloud.adminFetchSubmissionSummary();
    subSummaryError = null;
  } catch (err) {
    subSummary = null;
    subSummaryError = err.message;
  }
  for (const id of ["code-warning", "class-warning"]) {
    el(id).textContent = subSummaryError ? `⚠️ ${subSummaryError}` : "";
    el(id).classList.toggle("is-hidden", !subSummaryError);
  }
  return !subSummaryError;
}

function userLevelStats() {
  // key: `${user_id}|${level_id}` → { attempts, passed }
  const map = new Map();
  for (const s of subSummary ?? []) {
    const key = `${s.user_id}|${s.level_id}`;
    if (!map.has(key)) map.set(key, { user_id: s.user_id, level_id: s.level_id, attempts: 0, passed: false });
    const acc = map.get(key);
    acc.attempts += s.attempts ?? 1;
    if (s.passed) acc.passed = true;
  }
  return map;
}

const courseOrder = (levelId) => {
  const i = course.challenges.findIndex((c) => c.id === levelId);
  return i < 0 ? 9999 : i;
};

async function openCodeTab() {
  await ensureSummary();
  fillCodeStudents();
}

function fillCodeStudents() {
  const select = el("code-student");
  const previous = select.value;
  const runsByUser = new Map();
  for (const s of subSummary ?? []) runsByUser.set(s.user_id, (runsByUser.get(s.user_id) ?? 0) + (s.attempts ?? 1));

  const learners = students
    .filter((s) => s.role === "student")
    .sort((a, b) => (a.display_name || "").localeCompare(b.display_name || "", "zh-TW"));

  select.innerHTML = "";
  if (learners.length === 0) {
    select.innerHTML = '<option value="">還沒有學生</option>';
  } else {
    for (const s of learners) {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = `${s.display_name || "(未命名)"} · ${runsByUser.get(s.id) ?? 0} 次執行`;
      select.appendChild(opt);
    }
    if (learners.some((s) => s.id === previous)) select.value = previous;
  }
  onCodeStudentChange();
}

let pendingLevel = null; // 從全班統計跳到某位學生時,指定要預選的關卡

function onCodeStudentChange() {
  const userId = el("code-student").value;
  const levelSelect = el("code-level");
  const previous = pendingLevel ?? levelSelect.value;
  pendingLevel = null;
  const mine = [...userLevelStats().values()]
    .filter((x) => x.user_id === userId)
    .sort((a, b) => courseOrder(a.level_id) - courseOrder(b.level_id));

  levelSelect.innerHTML = "";
  if (mine.length === 0) {
    levelSelect.innerHTML = '<option value="">這位學生還沒有紀錄</option>';
  } else {
    for (const x of mine) {
      const opt = document.createElement("option");
      opt.value = x.level_id;
      opt.textContent = `${levelTitle(x.level_id)} — ${x.attempts} 次 ${x.passed ? "✅" : "❌ 未通過"}`;
      levelSelect.appendChild(opt);
    }
    if (mine.some((x) => x.level_id === previous)) levelSelect.value = previous;
  }
  loadSubmissionList();
}

async function loadSubmissionList() {
  const userId = el("code-student").value;
  const levelId = el("code-level").value;
  const list = el("code-list");
  list.innerHTML = "";

  if (!userId || !levelId) {
    el("code-summary").textContent = subSummaryError
      ? ""
      : "這位學生還沒有執行過任何關卡(只有登入後的執行才會被記錄)。";
    return;
  }

  el("code-summary").textContent = "載入中…";
  let rows;
  try {
    rows = await cloud.adminFetchSubmissions({ userId, levelId, limit: 200 });
  } catch (err) {
    el("code-summary").textContent = `讀取失敗:${err.message}`;
    return;
  }
  rows.reverse(); // 由舊到新,才看得出學生一步步怎麼改

  const passedAt = rows.findIndex((r) => r.passed);
  el("code-summary").textContent =
    `${levelTitle(levelId)} · 共 ${rows.length} 次執行 · ` +
    (passedAt >= 0 ? `第 ${passedAt + 1} 次通過` : "尚未通過") +
    (rows.length >= 200 ? "(只顯示最近 200 次)" : "");

  rows.forEach((r, i) => list.appendChild(renderSubmission(r, i + 1, i === rows.length - 1)));
}

function renderSubmission(row, n, open) {
  const details = document.createElement("details");
  details.className = `sub-card ${row.passed ? "is-pass" : "is-fail"}`;
  details.open = open;

  const head = document.createElement("summary");
  const failedCount = (row.results ?? []).filter((r) => !r.passed).length;
  head.textContent =
    `第 ${n} 次 · ${new Date(row.created_at).toLocaleString("zh-TW", { hour12: false })} · ` +
    (row.passed ? "✅ 通過" : row.error ? "❌ 程式出錯" : `❌ ${failedCount} 項測試未過`);
  details.appendChild(head);

  const addBlock = (label, text, cls = "") => {
    const wrap = document.createElement("div");
    wrap.className = "sub-block";
    const lab = document.createElement("p");
    lab.className = "sub-label";
    lab.textContent = label;
    const pre = document.createElement("pre");
    pre.className = `sub-pre ${cls}`;
    pre.textContent = text; // 學生的內容只當純文字顯示
    wrap.append(lab, pre);
    details.appendChild(wrap);
  };

  addBlock("程式碼", row.code);
  if (row.error) addBlock("錯誤訊息", row.error, "is-error");
  else addBlock("輸出", row.output || "(沒有輸出)");

  if ((row.results ?? []).length > 0) {
    const ul = document.createElement("ul");
    ul.className = "sub-tests";
    for (const r of row.results) {
      const li = document.createElement("li");
      li.className = r.passed ? "pass" : "fail";
      li.textContent = `${r.passed ? "✅" : "❌"} ${r.name}${r.passed || !r.message ? "" : ` — ${r.message}`}`;
      ul.appendChild(li);
    }
    details.appendChild(ul);
  }
  return details;
}

/* ── 全班共通錯誤(統計由瀏覽器依解題紀錄計算,不依賴 AI)── */
async function openClassTab() {
  await ensureSummary();
  const perLevel = new Map(); // level_id → { students:Set, passed:Set }
  for (const s of subSummary ?? []) {
    if (!perLevel.has(s.level_id)) perLevel.set(s.level_id, { students: new Set(), passed: new Set() });
    const acc = perLevel.get(s.level_id);
    acc.students.add(s.user_id);
    if (s.passed) acc.passed.add(s.user_id);
  }
  const select = el("class-level");
  const previous = select.value;
  select.innerHTML = "";
  const ids = [...perLevel.keys()].sort((a, b) => courseOrder(a) - courseOrder(b));
  if (ids.length === 0) {
    select.innerHTML = '<option value="">還沒有任何解題紀錄</option>';
  } else {
    for (const id of ids) {
      const acc = perLevel.get(id);
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${levelTitle(id)} — ${acc.students.size} 人嘗試、${acc.passed.size} 人通過`;
      select.appendChild(opt);
    }
    if (ids.includes(previous)) select.value = previous;
  }
  await loadClassStats();
}

const firstLine = (text) =>
  (String(text ?? "").split("\n").find((l) => l.trim()) ?? "").trim().slice(0, 80);

/** 由某一關全班的所有紀錄,算出統計與「還沒通過的學生」 */
function computeClassStats(rows) {
  const byUser = new Map();
  for (const r of [...rows].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))) {
    if (!byUser.has(r.user_id)) byUser.set(r.user_id, []);
    byUser.get(r.user_id).push(r);
  }

  const failTests = new Map(); // 測試名稱 → 曾在該測試失敗的學生數
  const errKinds = new Map(); // 錯誤訊息首行 → 曾遇到的學生數
  const stuck = [];
  let passedStudents = 0;
  let totalAttemptsToPass = 0;

  for (const [userId, list] of byUser) {
    const firstPass = list.findIndex((r) => r.passed);
    if (firstPass >= 0) {
      passedStudents += 1;
      totalAttemptsToPass += firstPass + 1;
    }
    const testSet = new Set();
    const errSet = new Set();
    for (const r of list) {
      for (const t of r.results ?? []) if (!t.passed) testSet.add(String(t.name).slice(0, 80));
      if (r.error) errSet.add(firstLine(r.error));
    }
    testSet.forEach((t) => failTests.set(t, (failTests.get(t) ?? 0) + 1));
    errSet.forEach((e) => errKinds.set(e, (errKinds.get(e) ?? 0) + 1));

    if (firstPass < 0) {
      const last = list[list.length - 1];
      const failed = (last.results ?? []).filter((t) => !t.passed).map((t) => t.name);
      stuck.push({
        user_id: userId,
        attempts: list.length,
        last: last.error ? `錯誤:${firstLine(last.error)}` : failed.length ? `未通過:${failed.join("、")}` : "—",
      });
    }
  }

  const top = (m) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, students]) => ({ name, students }));
  return {
    students: byUser.size,
    passedStudents,
    avgAttemptsToPass: passedStudents ? Math.round((totalAttemptsToPass / passedStudents) * 10) / 10 : null,
    totalRuns: rows.length,
    topFailingTests: top(failTests),
    topErrors: top(errKinds),
    stuck: stuck.sort((a, b) => b.attempts - a.attempts),
  };
}

let classToken = 0; // 切換很快時,丟掉過期的回應
async function loadClassStats() {
  const levelId = el("class-level").value;
  const box = el("class-stats");
  if (!levelId) {
    box.classList.add("is-hidden");
    return;
  }
  const token = ++classToken;
  box.classList.remove("is-hidden");
  box.textContent = "統計中…";
  try {
    const rows = await cloud.adminFetchLevelSubmissions(levelId);
    if (token !== classToken) return;
    renderClassStats(computeClassStats(rows), levelId, rows.length >= 5000);
  } catch (err) {
    if (token !== classToken) return;
    box.textContent = `讀取失敗:${err.message}`;
  }
}

function renderClassStats(s, levelId, truncated) {
  const box = el("class-stats");
  const nameOf = (id) => students.find((x) => x.id === id)?.display_name || "(未命名)";
  const list = (title, items) =>
    items?.length
      ? `<div class="stat-list"><h4>${title}</h4><ul>${items
          .map((x) => `<li><span>${escapeHtml(x.name)}</span><b>${x.students} 人</b></li>`)
          .join("")}</ul></div>`
      : "";
  const stuck = s.stuck.length
    ? `<div class="stat-list stat-wide"><h4>還沒通過的學生(點名字看他寫的程式碼)</h4><ul>${s.stuck
        .map(
          (x) => `<li><span><button class="link-btn" data-user="${escapeHtml(x.user_id)}">${escapeHtml(nameOf(x.user_id))}</button>
            <small>${escapeHtml(x.last)}</small></span><b>${x.attempts} 次</b></li>`
        )
        .join("")}</ul></div>`
    : "";

  box.innerHTML = `
    <div class="stat-cards">
      <div class="stat-card"><span>嘗試人數</span><b>${s.students}</b></div>
      <div class="stat-card"><span>已通過</span><b>${s.passedStudents}</b></div>
      <div class="stat-card"><span>平均幾次通過</span><b>${s.avgAttemptsToPass ?? "—"}</b></div>
      <div class="stat-card"><span>總執行次數</span><b>${s.totalRuns}</b></div>
    </div>
    <div class="stat-lists">
      ${list("最常失敗的測試", s.topFailingTests)}
      ${list("最常出現的錯誤訊息", s.topErrors)}
      ${stuck}
    </div>
    ${truncated ? '<p class="ai-note">紀錄超過 5000 筆,只統計其中一部分。</p>' : ""}`;

  box.querySelectorAll(".link-btn").forEach((btn) =>
    btn.addEventListener("click", () => jumpToStudent(btn.dataset.user, levelId))
  );
}

/** 從全班統計跳到「解題紀錄」分頁,直接顯示那位學生在這一關的程式碼 */
function jumpToStudent(userId, levelId) {
  el("code-student").value = userId;
  pendingLevel = levelId;
  switchTab("code");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

boot();
