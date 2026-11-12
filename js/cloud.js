// Firebase 雲端層:登入(Authentication)、進度同步與題目(Firestore)
// 未設定 config.js 時所有函式安全降級(回傳 null / 空陣列),遊戲照常以訪客模式運作。
//
// 對外的函式名稱與資料列格式(snake_case 欄位)維持不變,
// 所以 main.js / auth.js / settings.js 不需要知道底層換成了 Firebase。

import { FIREBASE_CONFIG } from "./config.js";

// Firebase SDK 版本(從官方 CDN 載入)。要升級只改這一個數字。
const FIREBASE_VERSION = "10.12.2";
const CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

let A = null; // firebase-auth 模組
let F = null; // firebase-firestore 模組
let auth = null;
let db = null;

let profile = null; // { display_name, role }
let profilePromise = null;
let cachedUser = null; // { id, email, displayName }
let authCallback = null;
let signingUp = false; // 註冊進行中:先不通知,等 users 文件寫好再通知
let deferredEvent = null;

export function isConfigured() {
  return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
}

const toUser = (u) => (u ? { id: u.uid, email: u.email, displayName: u.displayName } : null);

// Firestore 的 Timestamp → ISO 字串(畫面端一律用字串處理日期)
const toIso = (v) => (v && typeof v.toDate === "function" ? v.toDate().toISOString() : (v ?? null));

/** 把 Firebase 的錯誤轉成老師/學生看得懂的說明 */
function friendly(err) {
  const code = err?.code ?? "";
  if (code === "permission-denied") {
    return "沒有權限讀寫資料庫。請確認:① 已在 Firebase 發布 firestore.rules ② 這個帳號的角色正確";
  }
  if (code === "unavailable") return "連不上 Firestore,請檢查網路";
  if (code === "not-found") {
    return "Firestore 資料庫還沒建立(Firebase Console → Firestore Database → 建立資料庫)";
  }
  if (code === "failed-precondition") return `資料庫需要先建立索引:${err.message}`;
  return err?.message ?? String(err);
}

function friendlyAuthError(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return "帳號或密碼錯誤";
    case "auth/email-already-in-use":
      return "這個信箱已經註冊過了";
    case "auth/weak-password":
      return "密碼至少要 6 個字元";
    case "auth/invalid-email":
      return "信箱格式不正確";
    case "auth/missing-password":
      return "請輸入密碼";
    case "auth/too-many-requests":
      return "嘗試次數太多,請稍後再試";
    case "auth/network-request-failed":
      return "網路連線失敗,請檢查網路後再試";
    case "auth/unauthorized-domain":
      return "這個網址還沒被 Firebase 授權(Authentication → 設定 → 已授權網域,加入目前網站的網域)";
    case "auth/operation-not-allowed":
      return "尚未在 Firebase 開啟「電子郵件/密碼」登入(Authentication → Sign-in method)";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
    case "auth/configuration-not-found":
      return "Firebase 設定有誤,請老師檢查 js/config.js 的值";
    default:
      return `發生錯誤:${error?.message ?? error}`;
  }
}

function requireClient() {
  if (!auth || !db) throw new Error("雲端尚未連線(可能網路擋住了 Firebase),請重新整理後再試");
}

function emit(event) {
  if (signingUp) {
    deferredEvent = event;
    return;
  }
  authCallback?.(cachedUser, event);
}

/**
 * 初始化;回傳目前的 user(或 null)。
 * onAuthChanged(user|null, event) 會在登入狀態變化時被呼叫。
 * event 為 "INITIAL_SESSION"(訂閱後第一次,還原既有登入狀態)、
 * "SIGNED_IN" 或 "SIGNED_OUT"。呼叫端若要做重整之類的動作,必須排除 INITIAL_SESSION。
 */
export async function initCloud(onAuthChanged) {
  if (!isConfigured()) return null;

  const [{ initializeApp }, authMod, fsMod] = await Promise.all([
    import(`${CDN}/firebase-app.js`),
    import(`${CDN}/firebase-auth.js`),
    import(`${CDN}/firebase-firestore.js`),
  ]);
  A = authMod;
  F = fsMod;
  const app = initializeApp(FIREBASE_CONFIG);
  auth = A.getAuth(app);
  db = F.getFirestore(app);
  authCallback = onAuthChanged ?? null;

  let first = true;
  await new Promise((resolve) => {
    A.onAuthStateChanged(auth, (fbUser) => {
      profile = null;
      cachedUser = toUser(fbUser);
      const event = first ? "INITIAL_SESSION" : cachedUser ? "SIGNED_IN" : "SIGNED_OUT";
      if (first) {
        first = false;
        resolve();
      }
      emit(event);
    });
  });
  return cachedUser;
}

export async function refreshUser() {
  if (!auth) return null;
  await auth.authStateReady?.();
  cachedUser = toUser(auth.currentUser);
  return cachedUser;
}

export async function signUp(email, password, displayName) {
  requireClient();
  const name = String(displayName ?? "").trim().slice(0, 40);
  signingUp = true;
  try {
    let cred;
    try {
      cred = await A.createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(friendlyAuthError(err));
    }
    cachedUser = toUser(cred.user);
    A.updateProfile(cred.user, { displayName: name }).catch(() => {});
    try {
      await F.setDoc(F.doc(db, "users", cred.user.uid), {
        display_name: name,
        role: "student",
        created_at: F.serverTimestamp(),
      });
    } catch (err) {
      throw new Error(`帳號已建立,但無法寫入資料庫:${friendly(err)}`);
    }
    profile = { display_name: name, role: "student" };
    return cachedUser;
  } finally {
    signingUp = false;
    if (deferredEvent) {
      const event = deferredEvent;
      deferredEvent = null;
      authCallback?.(cachedUser, event);
    }
  }
}

export async function signIn(email, password) {
  requireClient();
  try {
    const cred = await A.signInWithEmailAndPassword(auth, email, password);
    return toUser(cred.user);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export async function signOut() {
  if (auth) await A.signOut(auth);
}

/** 取得自己的 profile(含 role)。第一次登入但還沒有 users 文件時會自動建立(一律是 student)。 */
export async function fetchProfile() {
  if (!db) return null;
  if (profile) return profile;
  // 啟動時 main.js 的兩處會同時呼叫;共用同一個請求,避免重複建立 users 文件
  profilePromise ??= loadProfile().finally(() => {
    profilePromise = null;
  });
  return profilePromise;
}

async function loadProfile() {
  const user = await refreshUser();
  if (!user) return null;
  try {
    const ref = F.doc(db, "users", user.id);
    const snap = await F.getDoc(ref);
    if (snap.exists()) {
      const d = snap.data();
      profile = { display_name: d.display_name ?? "", role: d.role ?? "student" };
      return profile;
    }
    const name = (user.displayName || (user.email ?? "").split("@")[0] || "").slice(0, 40);
    await F.setDoc(ref, { display_name: name, role: "student", created_at: F.serverTimestamp() });
    profile = { display_name: name, role: "student" };
    return profile;
  } catch (err) {
    console.warn("讀取使用者資料失敗:", friendly(err));
    return null;
  }
}

/** 讀取自己的雲端進度 → [{level_id, stars, xp}] */
export async function fetchProgress() {
  const user = await refreshUser();
  if (!user || !db) return [];
  try {
    const snap = await F.getDocs(
      F.query(F.collection(db, "progress"), F.where("user_id", "==", user.id))
    );
    return snap.docs.map((d) => {
      const x = d.data();
      return { level_id: x.level_id, stars: x.stars ?? 0, xp: x.xp ?? 0 };
    });
  } catch (err) {
    console.warn("讀取雲端進度失敗:", friendly(err));
    return [];
  }
}

// 關卡 id 會當成文件 id 的一部分,不能含 "/"
const safeId = (id) => String(id).replace(/\//g, "_");

/** 寫入(覆蓋)一批進度 rows: [{level_id, stars, xp}] */
export async function upsertProgress(rows) {
  const user = await refreshUser();
  if (!user || !db || rows.length === 0) return;
  try {
    const batch = F.writeBatch(db);
    for (const r of rows) {
      batch.set(F.doc(db, "progress", `${user.id}_${safeId(r.level_id)}`), {
        user_id: user.id,
        level_id: String(r.level_id),
        stars: Math.max(0, Math.min(3, Math.round(Number(r.stars) || 0))),
        xp: Math.max(0, Math.round(Number(r.xp) || 0)),
        completed_at: F.serverTimestamp(),
      });
    }
    await batch.commit();
  } catch (err) {
    console.warn("同步進度失敗:", friendly(err));
  }
}

/**
 * 刪除自己在雲端的全部進度。
 * 刪完回查一次確認,把「沒刪成功」變成明確的結果。
 * @returns {{ok: boolean, remaining: number}}
 */
export async function deleteOwnProgress() {
  const user = await refreshUser();
  if (!user || !db) return { ok: true, remaining: 0 }; // 訪客沒有雲端進度

  const own = () => F.query(F.collection(db, "progress"), F.where("user_id", "==", user.id));
  try {
    const snap = await F.getDocs(own());
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = F.writeBatch(db);
      snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    const check = await F.getDocs(own());
    return { ok: check.empty, remaining: check.size };
  } catch (err) {
    throw new Error(friendly(err));
  }
}

/**
 * 讀取老師出的題目(含覆寫內建題的記錄)。
 * 老師拿得到全部(含草稿);其他人只拿得到已發布的。
 * @returns {[{id, chapter_num, position, data, published, override_id}]}
 */
export async function fetchCustomLevels() {
  if (!db) return [];
  try {
    const me = await fetchProfile();
    const col = F.collection(db, "custom_levels");
    const q = me?.role === "teacher" ? col : F.query(col, F.where("published", "==", true));
    const snap = await F.getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.chapter_num ?? 0) - (b.chapter_num ?? 0) || (a.position ?? 999) - (b.position ?? 999));
  } catch (err) {
    console.warn("讀取自訂題目失敗:", friendly(err));
    return [];
  }
}

/* ── 解題紀錄(每次按「執行任務」) ───────────────── */

// 超過 max 時截斷;結尾的提示文字也算在 max 內,才不會超過安全規則的長度上限
const CLIP_NOTE = "\n…(已截斷)";
const clip = (text, max) => {
  const s = String(text ?? "");
  return s.length > max ? `${s.slice(0, max - CLIP_NOTE.length)}${CLIP_NOTE}` : s;
};

/**
 * 記錄一次執行(同時更新「每位學生 × 每一關」的統計)。
 * 只有登入的學生才會寫入;任何失敗都只在 console 警告,絕不能影響遊戲本身。
 */
export async function recordSubmission({ levelId, code, result }) {
  if (!db) return;
  try {
    const user = await refreshUser();
    if (!user) return;
    const results = (result.results ?? []).slice(0, 50).map((r) => ({
      name: clip(r.name, 200),
      passed: Boolean(r.passed),
      message: clip(r.message ?? "", 500),
    }));
    const passed = !result.error && results.length > 0 && results.every((r) => r.passed);

    const batch = F.writeBatch(db);
    batch.set(F.doc(F.collection(db, "submissions")), {
      user_id: user.id,
      level_id: String(levelId),
      code: clip(code, 20000),
      output: clip(result.output ?? "", 5000),
      error: result.error ? clip(result.error, 5000) : null,
      passed,
      results,
      created_at: F.serverTimestamp(),
    });
    batch.set(
      F.doc(db, "submission_stats", `${user.id}_${safeId(levelId)}`),
      {
        user_id: user.id,
        level_id: String(levelId),
        attempts: F.increment(1),
        last_at: F.serverTimestamp(),
        ...(passed ? { passed: true } : {}), // 只在通關時寫入,所以不會被改回未通過
      },
      { merge: true }
    );
    await batch.commit();
  } catch (err) {
    console.warn("記錄解題紀錄失敗:", friendly(err));
  }
}

/* ── 後台(老師)專用 ───────────────────────── */

const submissionRow = (d) => {
  const x = d.data();
  return { id: d.id, ...x, created_at: toIso(x.created_at) };
};

/** 讀取解題紀錄;可依學生、關卡篩選,新的在前。 */
export async function adminFetchSubmissions({ userId, levelId, limit = 200 } = {}) {
  requireClient();
  const filters = [];
  if (userId) filters.push(F.where("user_id", "==", userId));
  if (levelId) filters.push(F.where("level_id", "==", levelId));
  try {
    // 只用相等條件,不需要建立索引;排序與截取改在瀏覽器做
    const snap = await F.getDocs(F.query(F.collection(db, "submissions"), ...filters));
    return snap.docs
      .map(submissionRow)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
      .slice(0, limit);
  } catch (err) {
    throw new Error(friendly(err));
  }
}

/** 某一關全班的所有紀錄(全班錯誤統計用) */
export async function adminFetchLevelSubmissions(levelId) {
  return adminFetchSubmissions({ levelId, limit: 5000 });
}

/** 每位學生 × 每一關的嘗試次數與是否通過(用來做總覽) → [{user_id, level_id, attempts, passed}] */
export async function adminFetchSubmissionSummary() {
  requireClient();
  try {
    const snap = await F.getDocs(F.collection(db, "submission_stats"));
    return snap.docs.map((d) => {
      const x = d.data();
      return {
        user_id: x.user_id,
        level_id: x.level_id,
        attempts: x.attempts ?? 0,
        passed: Boolean(x.passed),
      };
    });
  } catch (err) {
    throw new Error(friendly(err));
  }
}

export async function adminFetchStudents() {
  requireClient();
  try {
    const snap = await F.getDocs(F.collection(db, "users"));
    return snap.docs
      .map((d) => {
        const x = d.data();
        return {
          id: d.id,
          display_name: x.display_name ?? "",
          role: x.role ?? "student",
          created_at: toIso(x.created_at),
        };
      })
      .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
  } catch (err) {
    throw new Error(friendly(err));
  }
}

export async function adminFetchAllProgress() {
  requireClient();
  try {
    const snap = await F.getDocs(F.collection(db, "progress"));
    return snap.docs.map((d) => {
      const x = d.data();
      return {
        user_id: x.user_id,
        level_id: x.level_id,
        stars: x.stars ?? 0,
        xp: x.xp ?? 0,
        completed_at: toIso(x.completed_at),
      };
    });
  } catch (err) {
    throw new Error(friendly(err));
  }
}

// Firestore 不接受 undefined;用 JSON 來回一次洗掉
const clean = (v) => JSON.parse(JSON.stringify(v ?? null));

/**
 * 新增題目。row: { chapter_num, position, data, published, override_id? }
 * 覆寫內建題的記錄用固定的文件 id,所以同一道內建題最多只會有一筆覆寫。
 */
export async function adminInsertLevel(row) {
  requireClient();
  const user = await refreshUser();
  const payload = {
    chapter_num: Number(row.chapter_num),
    position: Number(row.position ?? 999),
    data: clean(row.data),
    published: row.published !== false,
    override_id: row.override_id ?? null,
    created_by: user?.id ?? null,
    created_at: F.serverTimestamp(),
  };
  try {
    if (row.override_id) {
      await F.setDoc(F.doc(db, "custom_levels", `override-${safeId(row.override_id)}`), payload);
    } else {
      await F.addDoc(F.collection(db, "custom_levels"), payload);
    }
  } catch (err) {
    throw new Error(friendly(err));
  }
}

export async function adminUpdateLevel(id, patch) {
  requireClient();
  const next = { ...patch };
  if ("data" in next) next.data = clean(next.data);
  try {
    await F.updateDoc(F.doc(db, "custom_levels", id), next);
  } catch (err) {
    throw new Error(friendly(err));
  }
}

export async function adminDeleteLevel(id) {
  requireClient();
  try {
    await F.deleteDoc(F.doc(db, "custom_levels", id));
  } catch (err) {
    throw new Error(friendly(err));
  }
}
