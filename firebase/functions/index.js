"use strict";
// PyQuest AI 後端(Firebase Cloud Functions,第 2 代)
//   tutor    學生端 AI 助教(蘇格拉底式,只引導不給答案)
//   analyze  老師端 AI 整理(重複錯誤、不熟悉的概念)
//
// 設定:
//   OPENAI_API_KEY          必填,用 firebase functions:secrets:set 設定
//   OPENAI_MODEL            選填,預設 gpt-5.4-mini(可寫在 functions/.env)
//   OPENAI_REASONING_EFFORT 選填,例如 low;預設不指定
//   TUTOR_DAILY_LIMIT       選填,每位學生每天可問助教幾次,預設 40

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret, defineString, defineInt } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const crypto = require("node:crypto");
const { CoreError, handleTutor, handleAnalyze, makeOpenAICaller } = require("./lib/core");

setGlobalOptions({ region: "asia-east1", maxInstances: 5 });
initializeApp();

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");
const OPENAI_MODEL = defineString("OPENAI_MODEL", { default: "gpt-5.4-mini" });
const OPENAI_REASONING_EFFORT = defineString("OPENAI_REASONING_EFFORT", { default: "" });
const TUTOR_DAILY_LIMIT = defineInt("TUTOR_DAILY_LIMIT", { default: 40 });

function makeDeps() {
  return {
    db: getFirestore(),
    callModel: makeOpenAICaller({
      fetchFn: fetch,
      apiKey: OPENAI_API_KEY.value(),
      model: OPENAI_MODEL.value(),
      reasoningEffort: OPENAI_REASONING_EFFORT.value() || undefined,
    }),
    serverTimestamp: () => FieldValue.serverTimestamp(),
    now: () => Date.now(),
    randomId: () => crypto.randomBytes(4).toString("hex"),
    config: { dailyLimit: TUTOR_DAILY_LIMIT.value() },
  };
}

// 把核心邏輯丟出的錯誤轉成前端看得到訊息的 HttpsError
async function run(handler, request) {
  try {
    return await handler({ uid: request.auth?.uid ?? null, data: request.data, deps: makeDeps() });
  } catch (err) {
    if (err instanceof CoreError) throw new HttpsError(err.code, err.message);
    console.error("未預期的錯誤:", err?.message ?? err);
    throw new HttpsError("internal", "後端發生未預期的錯誤,請稍後再試");
  }
}

const options = { secrets: [OPENAI_API_KEY], timeoutSeconds: 60, memory: "256MiB", cors: true };

exports.tutor = onCall(options, (request) => run(handleTutor, request));
exports.analyze = onCall(options, (request) => run(handleAnalyze, request));
