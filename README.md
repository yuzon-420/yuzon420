# PyQuest — Python 星際探險 🚀

一個**純前端、免後端**的遊戲化 Python 學習平台。學生在瀏覽器裡扮演太空飛行員,
用 Python 程式碼修復每一顆星球的訊號站,一路從 `print()` 學到 FizzBuzz。

## 特色

- 🐍 **瀏覽器內執行 Python**:透過 [Pyodide](https://pyodide.org)(WebAssembly),
  程式碼在使用者自己的瀏覽器沙盒中執行,安全且不需要任何伺服器。
- 🎮 **遊戲化設計**:8 大章節星系、88 個關卡星球、XP 經驗值、8 級階級晉升、三星評價、關卡解鎖。
- 📚 **課程對應教材**:章節結構對應《Python 零基礎入門班》目錄 —
  變數與資料型態(含 input)→ 判斷式 → 迴圈 → 串列與元組 → 字典 → 函式與模組(含 random)→ 演算法(泡沫排序、循序/二分搜尋)→ 檔案與例外處理(try-except、assert)。
- 💡 **教學導向的回饋**:錯誤訊息翻譯成初學者看得懂的中文提示(含行號),
  每個測試失敗都有引導式訊息;卡關可以看提示(會扣一顆星)。
- 🔑 **登入與雲端進度**(選用):接上 Firebase 後,學生登入即可跨裝置同步進度;
  未設定時自動以「訪客模式」運作,進度存在瀏覽器本機。
- 📋 **教師後台**:全班進度總表、每位學生每次寫的程式碼、全班常見錯誤統計,以及線上新增/編輯/發布題目,不用改程式碼。
- ⌨️ **CodeMirror 編輯器**:語法上色、行號、`Cmd/Ctrl + Enter` 快速執行。

## 執行方式

只要一個靜態檔案伺服器:

```bash
python3 -m http.server 8765
```

然後打開 <http://localhost:8765>。

> 需要網路連線:Pyodide、CodeMirror 與字型由 CDN 載入。

## 設定登入與雲端進度(Firebase)

不做這步網站也能玩,只是進度只留在本機、沒有後台。
用到 Firebase 的兩個服務:**Authentication**(登入)與 **Firestore**(資料庫)。
這一版**不需要** Cloud Functions,所以不必升級付費方案,免費的 Spark 方案就夠用。
切換到新的 Firebase 專案不會搬移舊系統的帳號或資料;學生需要在新系統重新註冊,進度也會從零開始。

### 1. 建立 Firebase 專案與網頁應用程式

1. 到 <https://console.firebase.google.com> 用 Google 帳號登入 → **新增專案**(Google Analytics 可以關閉)。
2. 專案總覽頁按 **`</>`(網頁)** 註冊應用程式,取個暱稱即可,**不用**勾選 Firebase Hosting。
3. 畫面會顯示一段 `firebaseConfig`,把裡面的四個值填進 [`js/config.js`](js/config.js):

```js
export const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "你的專案.firebaseapp.com",
  projectId: "你的專案",
  appId: "1:123...:web:abc...",
};
```

> 這些值設計上就是公開的(每個訪客的瀏覽器都看得到),不是密碼;資料安全靠第 4 步的安全規則。

### 2. 開啟「電子郵件/密碼」登入

**Authentication → 開始使用 → Sign-in method → 電子郵件/密碼 → 啟用**(只開第一個開關)。
Firebase 預設不需要驗證信箱,學生註冊後可以直接登入。

如果之後登入時出現「這個網址還沒被 Firebase 授權」,到 **Authentication → 設定 → 已授權網域**,
把你網站的網域(例如 `你的帳號.github.io`)加進去。

### 3. 建立 Firestore 資料庫

**Firestore Database → 建立資料庫 → 以「正式版模式」啟動**,位置選 `asia-east1`(台灣)或 `asia-northeast1`(東京)。
位置建立後不能更改。

### 4. 發布安全規則(很重要)

**Firestore Database → 規則**,把 [`firebase/firestore.rules`](firebase/firestore.rules) 的內容整份貼上 → **發布**。

這份規則決定誰能讀寫什麼:學生只能讀寫自己的進度與解題紀錄、不能把自己升級成老師、
解題紀錄寫入後不能修改或刪除;老師可以讀全部、管理題目;訪客只能讀已發布的題目。

### 5. 把自己設成老師

網站沒有任何方式能自己升級成老師,必須在 Firebase 手動改:

1. 先在網站上註冊一個帳號。
2. **Firestore Database → 資料** → `users` 集合 → 找到你的文件(文件 ID 是你的使用者 ID,`display_name` 是你註冊的暱稱)。
3. 把 `role` 欄位的值從 `student` 改成 `teacher`。

重新整理網站,頁首會出現「📋 後台」按鈕。要增加其他老師,對他們的文件做一樣的事。

### 資料結構

| 集合 | 文件 ID | 內容 |
|---|---|---|
| `users` | 使用者 ID | `display_name`、`role`(student / teacher)、`created_at` |
| `progress` | `使用者ID_關卡ID` | `user_id`、`level_id`、`stars`、`xp`、`completed_at` |
| `custom_levels` | 自動產生(覆寫內建題用 `override-關卡ID`) | `chapter_num`、`position`、`data`、`published`、`override_id` |
| `submissions` | 自動產生 | 每次執行的 `user_id`、`level_id`、`code`、`output`、`error`、`passed`、`results`、`created_at` |
| `submission_stats` | `使用者ID_關卡ID` | `attempts`、`passed`、`last_at`(後台總覽用,避免每次讀取大量紀錄) |

### 免費額度

Spark 方案的 Firestore 免費額度,依我所知是每天 5 萬次讀取、2 萬次寫入、1 GiB 儲存(實際數字請以 Firebase 官網為準)。
一個班級的日常使用通常用不完;後台每次載入會讀取全班的使用者與進度文件,
學生很多時不要一直按「重新整理」。可以在 Firebase Console 的「使用情形」頁面查看用量。

## 教師後台

登入教師帳號後,從頁首「📋 後台」進入 `admin.html`:

- **學生進度**:全班一覽表(完成關卡數、總星星、總 XP、最近通關日),依 XP 排序
- **解題紀錄**:選學生 → 選關卡,由舊到新列出他每一次執行的程式碼、輸出或錯誤訊息、各項測試的通過與否,
  看得出他一步步怎麼改、卡在哪。
- **全班錯誤分析**:選一關,看幾人嘗試、幾人通過、平均幾次通過、**最常失敗的測試**、**最常出現的錯誤訊息**,
  以及**還沒通過的學生**(點名字直接跳到他寫的程式碼)。這些統計都由瀏覽器依解題紀錄計算。
- **題目管理**:內建 88 題與自訂題目一起列出,可依章節篩選
  - **內建題**可以直接編輯。存檔後會以你的版本取代原本內容,關卡編號不變、
    **學生已完成的紀錄也不會消失**;列表按「還原內建版」即可回到原版。
  - **自訂題**可以新增、編輯、發布/下架、刪除。

> 學生登入後,每次按「▶ 執行任務」才會被記錄;訪客模式(沒登入)不會。
> 學生重設進度**不會**清掉解題紀錄,學生也無法修改或刪除紀錄。
> 這個功能會保存學生寫的程式碼,請事先告知學生(與家長)。

新增題目時填入標題、故事、任務目標、起始碼、提示、XP,以及**測試 JSON**:

```json
[
  { "name": "印出答案", "code": "assert \"42\" in output, \"要印出 42\"" },
  { "name": "有用迴圈", "code": "assert \"for\" in src, \"要用 for 迴圈\"" }
]
```

測試碼可使用三個變數:`output`(學生程式的完整輸出)、`ns`(學生定義的變數與函式)、
`src`(學生的原始碼)。`assert` 後面的訊息就是學生答錯時看到的提示。

題目儲存後,所有學生重新整理就會看到——不需要改程式碼或重新部署。

> **AI 整理**:這一版沒有包含(需要 Cloud Functions 保管金鑰,而它要求付費方案)。
> 之後若要加回來,可以在 Firebase 部署一支 Cloud Function 呼叫 Gemini,
> 後台的解題紀錄與全班統計資料都已經準備好了。

## 專案結構

```
python-teach-system/
├── index.html          # 遊戲入口(星圖 + 挑戰畫面 + 登入彈窗)
├── admin.html          # 教師後台(學生進度 + 解題紀錄 + 全班統計 + 題目管理)
├── firebase/
│   ├── firestore.rules # Firestore 安全規則(貼到 Firebase Console 發布)
│   └── firebase.json   # 指令列部署用(選用)
├── css/
│   ├── tokens.css      # 設計代幣(色彩、字體、間距)
│   ├── global.css      # 全域基礎樣式與按鈕
│   ├── game.css        # 遊戲介面元件(含章節區塊、登入表單)
│   └── admin.css       # 後台版面
└── js/
    ├── config.js       # Firebase 連線設定(要自己填)
    ├── cloud.js        # Firebase 存取層(登入、進度、解題紀錄、自訂題目)
    ├── auth.js         # 登入/註冊 UI
    ├── admin.js        # 教師後台邏輯
    ├── challenges.js   # 課程組裝(內建章節 + 自訂題目合併、階級門檻)
    ├── levels/         # 各章節關卡資料(對應教材章節)
    │   ├── ch02.js     # 變數與資料型態(22 關)
    │   ├── ch03.js     # 判斷式(9 關)
    │   ├── ch04.js     # 迴圈(11 關)
    │   ├── ch05.js     # 串列與元組(16 關)
    │   ├── ch06.js     # 字典(10 關)
    │   ├── ch07.js     # 函式與模組(11 關)
    │   ├── ch08.js     # 演算法(3 關)
    │   └── ch09.js     # 檔案與例外處理(6 關)
    ├── runner.js       # Pyodide 執行器(含 input() 模擬、友善錯誤訊息)
    ├── state.js        # 玩家進度(XP、星星、解鎖)+ 雲端合併
    └── main.js         # 畫面切換與流程控制
```

## 講義與 Python 易錯觀念

共 88 題：原有 52 題加上 36 題，直接接在對應知識點後面。第 2 章加入 f-string、格式規格、浮點數與負數整除；第 3、4 章加入真值、短路、迭代器與 for-else；第 5、6 章加入淺／深拷貝、物件參照與字典陷阱；第 7、9 章加入可變預設參數、閉包、生成器與例外流程。

每題講義包含核心觀念、語法拆解、獨立範例、原理解說與常見誤解，資料放在 `js/lessons/chXX.js`。星圖的「閱讀講義」可預習尚未解鎖的題目，不計嘗試、不扣提示星星；開始作答仍依關卡解鎖。Python 引擎載入失敗時也能閱讀。

教師後台可編輯五個選填講義欄位，儲存在既有題目 JSON 的 `lesson` 中，不需要新增資料庫欄位。講義以純文字呈現，程式碼保留縮排。清空全部講義欄位可移除該題講義；舊的自訂題目沒有此欄位時照常顯示任務。

內建關卡 ID 保持穩定，已通關題目仍可重玩；新增題目會使畫面上的章內編號及總 XP 門檻重新計算。

內容核對來源：[Python 格式規格](https://docs.python.org/3.12/library/string.html#format-specification-mini-language)、[copy 模組](https://docs.python.org/3.12/library/copy.html)、[內建型別](https://docs.python.org/3.12/library/stdtypes.html)、[常見程式問題](https://docs.python.org/3.12/faq/programming.html)。

### 本機驗證

需要 Node.js 22 以上與 Python 3.12 以上；在專案根目錄執行：

```bash
node tests/verify-course.mjs
```

驗證會檢查 88 題的講義完整性與範例、36 題的參考答案及常見錯法、題目插入位置、覆寫與既有進度。Python 判題直接使用 `js/runner.js` 內的執行器；瀏覽器仍使用 Pyodide。

## 新增關卡

**方式一(推薦給老師)**:登入教師帳號 → 後台「題目管理」→ 新增題目。
立即生效,不用改程式碼、不用重新部署。

**方式二(內建課程)**:在對應章節檔(`js/levels/chXX.js`)的 `levels` 陣列加一個物件;
要新增整個章節,建立新的 `chXX.js` 後在 `js/challenges.js` 匯入:

```js
{
  id: "unique-id",        // 唯一識別碼(進度用)
  planet: "🪐",           // 星球 emoji
  title: "關卡標題",
  topic: "教學主題",
  story: "背景故事",
  instructions: ["目標一", "目標二"],   // 支援 <code> 標籤
  starter: "# 起始程式碼\n",
  hint: "卡關提示(使用會扣一顆星)",
  xp: 100,
  stdin: ["模擬輸入1", "模擬輸入2"],  // 選用:input() 會依序讀到這些字串
  tests: [
    {
      name: "測試名稱",
      // 測試碼可用 output(stdout 全文)、ns(使用者命名空間)、src(使用者原始碼)
      code: 'assert "答案" in output, "失敗時給玩家看的引導訊息"',
    },
  ],
}
```

關卡依章節與陣列順序解鎖(通過前一關才能玩下一關)。
