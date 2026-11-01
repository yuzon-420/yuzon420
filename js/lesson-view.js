// 講義只顯示純文字與程式碼，不執行教材內容，也不記錄提示。
export const LESSON_FIELDS = [
  ["concept", "先理解這個觀念", false],
  ["syntax", "語法拆解", true],
  ["example", "試著讀這段程式", true],
  ["explanation", "為什麼會這樣？", false],
  ["pitfall", "常見誤解", false],
];

export function renderLesson(container, lesson) {
  container.replaceChildren();
  const fields = LESSON_FIELDS.filter(([key]) => typeof lesson?.[key] === "string" && lesson[key].trim());
  container.classList.toggle("is-hidden", fields.length === 0);
  if (!fields.length) return;
  const details = document.createElement("details");
  details.className = "lesson-panel";
  details.open = true;
  const summary = document.createElement("summary");
  summary.textContent = "📖 本關講義";
  const note = document.createElement("span");
  note.className = "lesson-note";
  note.textContent = "自由閱讀・不扣星";
  summary.appendChild(note);
  details.appendChild(summary);
  for (const [key, title, isCode] of fields) {
    const section = document.createElement("section");
    section.className = "lesson-section";
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.appendChild(heading);
    if (isCode) {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = lesson[key];
      pre.appendChild(code);
      section.appendChild(pre);
    } else {
      const p = document.createElement("p");
      p.textContent = lesson[key];
      section.appendChild(p);
    }
    details.appendChild(section);
  }
  container.appendChild(details);
}
