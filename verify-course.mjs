import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { DEFAULT_COURSE, buildCourse } from "../js/challenges.js";
import { LESSONS } from "../js/lessons.js";

const levels = DEFAULT_COURSE.challenges;
const cases = JSON.parse(fs.readFileSync(new URL("./python-depth.cases.json", import.meta.url), "utf8"));
const placements = JSON.parse(fs.readFileSync(new URL("./python-depth.placement.json", import.meta.url), "utf8"));
assert.equal(levels.length, 88);
assert.equal(DEFAULT_COURSE.chapters.length, 8);
assert.equal(new Set(levels.map(l => l.id)).size, 88);
assert.equal(Object.keys(cases).length, 36);
assert.equal(Object.keys(LESSONS).length, 88);
for (const chapter of DEFAULT_COURSE.chapters) {
  for (const [index, level] of chapter.levels.entries()) {
    assert.equal(level.label, chapter.num + "-" + (index + 1));
    for (const key of ["concept", "syntax", "example", "explanation", "pitfall"]) {
      assert.equal(typeof level.lesson?.[key], "string", level.id + " lesson " + key);
      assert.ok(level.lesson[key].trim(), level.id + " empty " + key);
    }
    assert.ok(level.tests.length > 0 && level.xp > 0);
  }
}
for (const {chapter, after, id} of placements) {
  const chapterLevels = DEFAULT_COURSE.chapters.find(c => c.num === chapter).levels;
  const anchor = chapterLevels.findIndex(l => l.id === after);
  const index = chapterLevels.findIndex(l => l.id === id);
  assert.ok(anchor >= 0 && index > anchor, id + " placement");
  assert.ok(chapterLevels.slice(anchor + 1, index).every(l => l.id in cases), id + " must follow prerequisite group");
}
assert.equal(DEFAULT_COURSE.maxXp, levels.reduce((sum, l) => sum + l.xp, 0));
const first = levels[0];
const overridden = buildCourse([{id: "override", override_id: first.id, data: {title: "教師改題", tests: [], xp: 10}}]);
assert.equal(overridden.challenges[0].id, first.id);
assert.equal(overridden.challenges[0].lesson, undefined);
const custom = buildCourse([{id: "demo", chapter_num: 2, data: {title: "新講義", tests: [], xp: 10, lesson: {concept: "<b>純文字</b>"}}}]);
assert.equal(custom.challenges.find(l => l.id === "custom-demo").lesson.concept, "<b>純文字</b>");
assert.ok(!DEFAULT_COURSE.challenges.some(l => l.id === "custom-demo"));
const orphan = buildCourse([{id:"orphan",chapter_num:99,data:{title:"特別任務",tests:[],xp:10}}]);
assert.equal(orphan.chapters.at(-1).num, 10);
globalThis.localStorage = {getItem: () => JSON.stringify({completed: {"c5-tuple": {stars: 3}}}), setItem: () => {}};
const state = await import("../js/state.js");
assert.equal(state.isUnlocked(levels.findIndex(l => l.id === "c5-tuple")), true);
assert.equal(state.isUnlocked(levels.findIndex(l => l.id === "c2-number-format")), false);
assert.equal(state.isUnlocked(-1), false);
assert.equal(state.isUnlocked(levels.length), false);
const source = fs.readFileSync(new URL("../js/runner.js", import.meta.url), "utf8");
const match = source.match(/const HARNESS = ([\s\S]*?);\r?\n\r?\nexport/);
assert.ok(match, "Runner harness must be available");
const harness = vm.runInNewContext(match[1]);
const python = spawnSync(process.env.PYTHON ?? "python", [fileURLToPath(new URL("./verify-course.py", import.meta.url))], {
  input: JSON.stringify({harness, levels, cases}), encoding: "utf8", env: {...process.env, PYTHONUTF8: "1"}, timeout: 60000,
});
if (python.error) throw python.error;
process.stdout.write(python.stdout ?? "");
process.stderr.write(python.stderr ?? "");
assert.equal(python.status, 0, "Python content verification failed");
console.log("Course structure, placement, overrides, and existing progress: passed.");
