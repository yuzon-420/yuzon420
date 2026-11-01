// 第 3 章:判斷式
export const CH3 = {
  num: 3,
  emoji: "🚦",
  title: "判斷星系",
  subtitle: "縮排、if、if-else、elif、巢狀判斷",
  levels: [
    {
      id: "c3-indent",
      planet: "📐",
      title: "縮排維修站",
      topic: "Python 程式碼縮排",
      story: "太空站的程式壞了!Python 靠「縮排」決定哪些程式屬於同一個區塊,幫它修好。",
      instructions: [
        "下面的程式縮排錯了,直接執行會爆出 IndentationError",
        "把兩行 print 都縮排(前面加 4 個空格),讓它們屬於 if 區塊",
      ],
      starter: 'if 10 > 5:\nprint("系統啟動")\nprint("引擎正常")\n',
      hint: "if 那行結尾有冒號,底下屬於它的每一行都要往右縮 4 格。",
      xp: 40,
      tests: [
        { name: "程式能執行且輸出正確", code: 'assert "系統啟動" in output and "引擎正常" in output, "兩行都要成功印出"' },
      ],
    },
    {
      id: "c3-if",
      planet: "🌡️",
      title: "高溫警報",
      topic: "單向判斷式 if",
      story: "艙內溫度感測器回報 35 度,超過 30 度就要發出警報!",
      instructions: [
        "已有 <code>temp = 35</code>",
        "寫 <code>if</code> 判斷:當 temp > 30 時,印出 <code>太熱了!啟動散熱</code>",
      ],
      starter: "temp = 35\n\n# 寫 if 判斷式\n",
      hint: "if temp > 30: 換行縮排後寫 print(\"太熱了!啟動散熱\")。",
      xp: 40,
      tests: [
        { name: "有使用 if", code: 'assert "if" in src, "要用 if 判斷式"' },
        { name: "警報有響", code: 'assert "太熱了!啟動散熱" in output, "temp=35 超過 30,應該要印出警報"' },
      ],
    },
    {
      "id": "c3-text-bool",
      "planet": "🧪",
      "title": "False 字串竟然是真",
      "topic": "字串的真值不解析文字內容",
      "story": "bool() 判斷字串是否為空，不會把文字 False 解析成布林值。讀取文字設定時要明確比較內容。",
      "instructions": [
        "建立 <code>raw_truth = bool(raw)</code>。",
        "用 <code>raw.strip().lower() == \"true\"</code> 建立 <code>enabled</code>；strip 去除兩端空白，lower 轉小寫。",
        "raw_truth 與 enabled 應有不同結果。"
      ],
      "starter": "raw = \" False \"\n\n# 建立 raw_truth 與 enabled\n",
      "hint": "非空字串的 bool() 是 True；文字設定要先清理，再明確比較 \"true\"。",
      "xp": 70,
      "tests": [
        {
          "name": "非空字串與設定值",
          "code": "assert ns.get(\"raw_truth\") is True and ns.get(\"enabled\") is False, \"非空的 False 字串仍是真值，但設定內容表示未啟用\""
        }
      ]
    },
    {
      id: "c3-ifelse",
      planet: "🔐",
      title: "密碼比對門",
      topic: "雙向判斷式 if-else",
      story: "太空站閘門需要密碼驗證系統:對了放行、錯了擋下。",
      instructions: [
        "寫函式 <code>login(pwd)</code>",
        "pwd 等於 <code>\"1234\"</code> 回傳 <code>\"登入成功\"</code>",
        "否則回傳 <code>\"密碼錯誤\"</code>",
      ],
      starter: 'def login(pwd):\n    # 在這裡寫 if / else\n    pass\n\nprint(login("1234"))\nprint(login("0000"))\n',
      hint: 'if pwd == "1234": return "登入成功" / else: return "密碼錯誤"。比較用兩個等號 ==。',
      xp: 40,
      tests: [
        { name: "正確密碼放行", code: 'assert ns["login"]("1234") == "登入成功", "login(\\"1234\\") 要回傳 登入成功"' },
        { name: "錯誤密碼擋下", code: 'assert ns["login"]("0000") == "密碼錯誤", "login(\\"0000\\") 要回傳 密碼錯誤"' },
      ],
    },
    {
      "id": "c3-none-default",
      "planet": "🧪",
      "title": "零被預設值吃掉了",
      "topic": "None 與假值的差別",
      "story": "x or 預設值 會把 0、空字串、False 都當成要替換的值。如果 0 代表合法數量，只應在 x is None 時補預設值。",
      "instructions": [
        "修正 <code>choose_count(value)</code>：只有 value 為 None 時回傳 10，其餘原樣回傳。",
        "例如 0 應保留為 0，None 才變成 10。"
      ],
      "starter": "def choose_count(value):\n    return value or 10\n",
      "hint": "用 if value is None: 回傳 10；其他情況回傳 value。None 是表示缺值的特殊物件。",
      "xp": 70,
      "tests": [
        {
          "name": "保留合法的假值",
          "code": "for value in [0, 3, \"\", False]:\n    assert ns[\"choose_count\"](value) == value and type(ns[\"choose_count\"](value)) is type(value), \"只替換 None，不要把 0、空字串或 False 換掉\"\nassert ns[\"choose_count\"](None) == 10, \"None 時才使用預設值\""
        }
      ]
    },
    {
      "id": "c3-short-circuit",
      "planet": "🧪",
      "title": "除以零前先煞車",
      "topic": "and 的短路求值",
      "story": "and 由左到右檢查，左邊是假就不計算右邊。把危險運算放在保護條件後面，就能避免除以零。",
      "instructions": [
        "修正 <code>is_fast(distance, seconds)</code>，以 and 判斷 seconds 不等於 0，且 distance / seconds 大於 10。",
        "seconds 為 0 時回傳 False，不能拋出除以零錯誤。"
      ],
      "starter": "def is_fast(distance, seconds):\n    return distance / seconds > 10 and seconds != 0\n",
      "hint": "先寫 seconds != 0，再用 and 接 distance / seconds > 10；條件的順序影響是否執行除法。",
      "xp": 70,
      "tests": [
        {
          "name": "正常速度與零秒",
          "code": "assert ns[\"is_fast\"](100, 5) is True and ns[\"is_fast\"](100, 10) is False, \"速度必須大於 10\"\nassert ns[\"is_fast\"](100, 0) is False, \"先檢查分母再計算除法\""
        }
      ]
    },
    {
      id: "c3-elif",
      planet: "🏅",
      title: "成績評等艙",
      topic: "多向判斷式 if-elif-else",
      story: "學院要把訓練成績分成四個等級,條件由高往低依序檢查。",
      instructions: [
        "寫函式 <code>grade(score)</code>:",
        "90 分以上 → <code>\"優等\"</code>",
        "80 分以上 → <code>\"甲等\"</code>",
        "60 分以上 → <code>\"及格\"</code>",
        "其他 → <code>\"不及格\"</code>",
      ],
      starter: "def grade(score):\n    # if / elif / elif / else\n    pass\n\nprint(grade(95))\nprint(grade(72))\n",
      hint: "if score >= 90: ... elif score >= 80: ... elif score >= 60: ... else: ...(由高到低判斷)。",
      xp: 50,
      tests: [
        { name: "95 → 優等", code: 'assert ns["grade"](95) == "優等", "grade(95) 應該是 優等"' },
        { name: "90 → 優等(邊界)", code: 'assert ns["grade"](90) == "優等", "剛好 90 也算優等(用 >=)"' },
        { name: "85 → 甲等", code: 'assert ns["grade"](85) == "甲等", "grade(85) 應該是 甲等"' },
        { name: "60 → 及格(邊界)", code: 'assert ns["grade"](60) == "及格", "剛好 60 也算及格"' },
        { name: "59 → 不及格", code: 'assert ns["grade"](59) == "不及格", "grade(59) 應該是 不及格"' },
      ],
    },
    {
      "id": "c3-chain",
      "planet": "🧪",
      "title": "區間判斷的連鎖反應",
      "topic": "連鎖比較與邊界",
      "story": "Python 可以把兩次比較連在一起：0 <= value < 100 表示 value 同時符合左右兩個條件，不是先把 True 或 False 拿去和 100 比。",
      "instructions": [
        "完成 <code>in_band(value)</code>，回傳 value 是否在含 0、不含 100 的區間。",
        "使用一個連鎖比較式 <code>0 &lt;= value &lt; 100</code>。"
      ],
      "starter": "def in_band(value):\n    pass\n",
      "hint": "return 0 <= value < 100；注意 0 要包含，100 不包含。",
      "xp": 70,
      "tests": [
        {
          "name": "區間邊界",
          "code": "for value, expected in [(-1, False), (0, True), (99.5, True), (100, False)]:\n    assert ns[\"in_band\"](value) is expected, \"區間包含 0，但不包含 100\"\nimport ast\nassert any(isinstance(n, ast.Compare) and len(n.ops) == 2 for n in ast.walk(ast.parse(src))), \"請練習一個連鎖比較式\""
        }
      ]
    },
    {
      id: "c3-nested",
      planet: "🎬",
      title: "電影分級站",
      topic: "巢狀判斷式",
      story: "星際影城的入場規定:18 歲以上直接看;未滿 18 歲要看有沒有家長陪同。判斷式裡面還有判斷式!",
      instructions: [
        "寫函式 <code>ticket(age, with_parent)</code>:",
        "age >= 18 → 回傳 <code>\"可觀看\"</code>",
        "未滿 18 且 with_parent 為 True → <code>\"家長陪同可觀看\"</code>",
        "未滿 18 且沒有陪同 → <code>\"不可觀看\"</code>",
      ],
      starter: "def ticket(age, with_parent):\n    # 外層判斷年齡,內層判斷陪同\n    pass\n\nprint(ticket(20, False))\nprint(ticket(15, True))\n",
      hint: "if age >= 18: return \"可觀看\",else: 裡面再寫一組 if with_parent: ... else: ...。",
      xp: 60,
      tests: [
        { name: "成年可看", code: 'assert ns["ticket"](20, False) == "可觀看", "ticket(20, False) 應該是 可觀看"' },
        { name: "未成年+陪同", code: 'assert ns["ticket"](15, True) == "家長陪同可觀看", "ticket(15, True) 應該是 家長陪同可觀看"' },
        { name: "未成年無陪同", code: 'assert ns["ticket"](15, False) == "不可觀看", "ticket(15, False) 應該是 不可觀看"' },
      ],
    },
  ],
};
