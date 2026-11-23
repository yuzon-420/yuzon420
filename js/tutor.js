// 學生端 AI 助教:蘇格拉底式提示,只在學生主動按下時才呼叫
//   · 輸入框直接問,或在執行失敗後按「請助教看看」
//   · 對話只存在記憶體(換關卡會保留、重新整理就清空);伺服器端另存一份給老師看

import * as cloud from "./cloud.js";

const el = (id) => document.getElementById(id);
const chats = new Map(); // levelId → [{ role, content }]
let ctx = null; // { getLevel, getCode, getLastResult }
let busy = false;
let remainingText = ""; // 最近一次回覆附帶的「今天還剩幾次」

const stripTags = (s) => String(s ?? "").replace(/<[^>]*>/g, "");

export function initTutor(context) {
  ctx = context;
  el("tutor-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = el("tutor-input");
    const text = input.value.trim();
    if (text) ask(text, () => (input.value = ""));
  });
  el("btn-ask-tutor").addEventListener("click", () => {
    const r = ctx.getLastResult();
    const failed = r?.error ? "我的程式出現錯誤,可以幫我看看嗎?" : "我的程式還沒通過,可以給我一點提示嗎?";
    ask(failed);
  });
}

/** 進入關卡時呼叫:還原這一關先前的對話 */
export function showTutorFor(level) {
  const panel = el("tutor-panel");
  panel.classList.toggle("is-hidden", !level || level.readOnly);
  el("btn-ask-tutor").classList.add("is-hidden");
  if (!level || level.readOnly) return;
  renderLog();
  refreshState();
}

/** 每次執行完呼叫:沒通過才顯示「請助教看看」 */
export function onRunFinished(passed) {
  el("btn-ask-tutor").classList.toggle("is-hidden", passed || !cloud.getCachedUser?.());
}

/** 登入狀態變化時呼叫 */
export function refreshState() {
  const note = el("tutor-note");
  const loggedIn = Boolean(cloud.getCachedUser?.());
  const enabled = cloud.isConfigured() && loggedIn;
  el("tutor-input").disabled = !enabled || busy;
  el("tutor-send").disabled = !enabled || busy;
  if (!cloud.isConfigured()) note.textContent = "AI 助教需要連上雲端後才能使用。";
  else if (!loggedIn) note.textContent = "登入後就可以問 AI 助教喔。";
  else note.textContent = remainingText || "助教會用提問帶你思考,不會直接給答案;每天的提問次數有限。";
  if (!loggedIn) {
    remainingText = "";
    el("btn-ask-tutor").classList.add("is-hidden");
  }
}

function renderLog() {
  const level = ctx.getLevel();
  const log = el("tutor-log");
  log.innerHTML = "";
  const list = chats.get(level.id) ?? [];
  for (const m of list) addBubble(m.role, m.content);
  log.scrollTop = log.scrollHeight;
}

function addBubble(role, text, isError = false) {
  const div = document.createElement("div");
  div.className = `tutor-msg ${role}${isError ? " is-error" : ""}`;
  div.textContent = text; // 一律當純文字,避免 AI 回覆夾帶 HTML
  el("tutor-log").appendChild(div);
  el("tutor-log").scrollTop = el("tutor-log").scrollHeight;
  return div;
}

async function ask(message, onSent) {
  if (busy) return;
  const level = ctx.getLevel();
  if (!level || level.readOnly) return;
  if (!cloud.getCachedUser?.()) return refreshState();

  const list = chats.get(level.id) ?? [];
  const history = list.slice(-8).map(({ role, content }) => ({ role, content }));
  const r = ctx.getLastResult();

  busy = true;
  refreshState();
  onSent?.();
  list.push({ role: "user", content: message });
  chats.set(level.id, list);
  addBubble("user", message);
  const waiting = addBubble("assistant", "助教思考中…");
  waiting.classList.add("is-waiting");

  try {
    const res = await cloud.askTutor({
      levelId: level.id,
      message,
      code: ctx.getCode(),
      history,
      level: {
        title: stripTags(level.title),
        topic: stripTags(level.topic),
        instructions: level.instructions.map(stripTags),
        tests: level.tests.map((t) => t.name), // 只送名稱,不送判定程式
      },
      lastResult: r && {
        output: r.output ?? "",
        error: r.error ?? "",
        results: r.results.map(({ name, passed, message }) => ({ name, passed, message })),
      },
    });
    waiting.remove();
    list.push({ role: "assistant", content: res.reply });
    addBubble("assistant", res.reply);
    remainingText = `今天還可以問 ${res.remaining} 次。助教只給提示,答案要靠你自己找到!`;
  } catch (err) {
    waiting.remove();
    list.pop(); // 失敗的提問不放進歷史,免得干擾下次對話
    addBubble("assistant", err.message, true); // 只顯示在畫面上,不存進對話歷史
  } finally {
    busy = false;
    const input = el("tutor-input");
    input.disabled = false;
    el("tutor-send").disabled = false;
    refreshState();
  }
}
