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
- 🔑 **登入與雲端進度**(選用):接上 Supabase 後,學生登入即可跨裝置同步進度;
  未設定時自動以「訪客模式」運作,進度存在瀏覽器本機。
- 📋 **教師後台**:全班進度總表 + 線上新增/編輯/發布題目,不用改程式碼。
- ⌨️ **CodeMirror 編輯器**:語法上色、行號、`Cmd/Ctrl + Enter` 快速執行。

## 執行方式

只要一個靜態檔案伺服器:

```bash
python3 -m http.server 8765
```

然後打開 <http://localhost:8765>。

> 需要網路連線:Pyodide、CodeMirror 與字型由 CDN 載入。

## 設定登入與雲端進度(Supabase)

不做這步網站也能玩,只是進度只留在本機、沒有後台。

### 1. 建立 Supabase 專案

到 <https://supabase.com> 免費註冊 → New project(區域選 Singapore 或 Tokyo 比較快)。

### 2. 建立資料表

Dashboard → **SQL Editor** → 貼上 [`supabase/schema.sql`](supabase/schema.sql) 全部內容 → Run。

這會建立 `profiles`、`progress`、`custom_levels` 三張表,並套用 Row Level Security:
學生只能讀寫自己的進度,只有老師能看全班和管理題目。

### 3. 填入連線資訊

Dashboard → **Project Settings → API**,把兩個值填進 [`js/config.js`](js/config.js):

```js
export const SUPABASE_URL = "https://你的專案.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGci...";
```

> `anon key` 設計上就是公開的(會出現在前端原始碼),資料安全由 RLS 保障。
> 絕對不要把 `service_role` key 放進來。

### 4. 關閉信箱驗證(建議,方便學生註冊)

Dashboard → **Authentication → Sign In / Providers → Email** → 關閉 *Confirm email*。
否則學生註冊後要先收驗證信才能登入。

### 5. 把自己設成老師

先在網站上註冊一個帳號,然後回 SQL Editor 執行(信箱換成你的):

```sql
update public.profiles set role = 'teacher'
where id = (select id from auth.users where email = '你的信箱@example.com');
```

重新整理後,頁首就會出現「📋 後台」按鈕。

## 教師後台

登入教師帳號後,從頁首「📋 後台」進入 `admin.html`:

- **學生進度**:全班一覽表(完成關卡數、總星星、總 XP、最近通關日),依 XP 排序
- **題目管理**:內建 88 題與自訂題目一起列出,可依章節篩選
  - **內建題**可以直接編輯。存檔後會以你的版本取代原本內容,關卡編號不變、
    **學生已完成的紀錄也不會消失**;列表按「還原內建版」即可回到原版。
  - **自訂題**可以新增、編輯、發布/下架、刪除。

> 要編輯內建題必須先在 Supabase 執行 [`supabase/migration-override.sql`](supabase/migration-override.sql)
> (在 `schema.sql` 之後跑)。沒跑之前後台會顯示提示,內建題只能瀏覽不能編輯,其餘功能不受影響。

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

## 專案結構

```
python-teach-system/
├── index.html          # 遊戲入口(星圖 + 挑戰畫面 + 登入彈窗)
├── admin.html          # 教師後台(學生進度 + 題目管理)
├── supabase/
│   └── schema.sql      # 資料表與 RLS 定義(貼到 Supabase 執行)
├── css/
│   ├── tokens.css      # 設計代幣(色彩、字體、間距)
│   ├── global.css      # 全域基礎樣式與按鈕
│   ├── game.css        # 遊戲介面元件(含章節區塊、登入表單)
│   └── admin.css       # 後台版面
└── js/
    ├── config.js       # Supabase 連線設定(要自己填)
    ├── cloud.js        # Supabase 存取層(登入、進度、自訂題目)
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
