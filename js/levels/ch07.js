// 第 7 章:函式與模組
export const CH7 = {
  num: 7,
  emoji: "🛠️",
  title: "函式星系",
  subtitle: "自訂函式、預設參數、變數範圍、數值/字串函式、random 模組",
  levels: [
    {
      id: "c7-def",
      planet: "🛠️",
      title: "打造函式",
      topic: "自訂函式",
      story: "把常用的計算包成函式,任何船艦都能重複呼叫,不用每次重寫!",
      instructions: [
        "寫函式 <code>area(w, h)</code>,回傳 <code>w * h</code>",
        "呼叫 <code>area(3, 4)</code> 並印出結果",
      ],
      starter: "# def 函式名稱(參數):\n#     return 結果\n",
      hint: "def area(w, h): 換行縮排 return w * h。",
      xp: 50,
      tests: [
        { name: "area(3, 4) == 12", code: 'assert ns["area"](3, 4) == 12, "area(3, 4) 應該回傳 12"' },
        { name: "area(5, 5) == 25", code: 'assert ns["area"](5, 5) == 25, "area(5, 5) 應該回傳 25"' },
        { name: "有印出結果", code: 'assert "12" in output, "記得印出 area(3, 4) 的結果"' },
      ],
    },
    {
      "id": "c7-generator",
      "planet": "🧪",
      "title": "需要時才開始執行",
      "topic": "yield 與生成器的延遲執行",
      "story": "函式內有 yield 時，呼叫它會先得到生成器物件；函式內容要等 next() 或迴圈取值時才執行。yield 會暫停，下一次取值再繼續。",
      "instructions": [
        "保留起始的 <code>readings()</code>，先建立 <code>stream = readings()</code>，把 events 的副本存入 before。",
        "呼叫 <code>first = next(stream)</code>，把 events 的副本存入 after_first。",
        "再呼叫 <code>second = next(stream)</code>，把 events 的副本存入 after_second。"
      ],
      "starter": "events = []\n\ndef readings():\n    events.append(\"start\")\n    yield 10\n    events.append(\"resume\")\n    yield 20\n\n# 建立生成器並逐次讀取，保存三份事件快照\n",
      "hint": "before 是 []；第一次 next 才記錄 start，第二次 next 才記錄 resume。保存快照要使用 events.copy()。",
      "xp": 100,
      "tests": [
        {
          "name": "延遲開始與暫停",
          "code": "assert ns.get(\"first\") == 10 and ns.get(\"second\") == 20, \"每次 next 讀到下一個 yield\"\nassert ns.get(\"before\") == [] and ns.get(\"after_first\") == [\"start\"] and ns.get(\"after_second\") == [\"start\", \"resume\"], \"建立生成器尚未執行函式；快照也不能只是 events 的別名\""
        }
      ]
    },
    {
      id: "c7-default",
      planet: "🎖️",
      title: "預設參數禮儀官",
      topic: "參數預設值",
      story: "打招呼系統:沒指定頭銜就用預設的「船長」,有指定就用指定的。",
      instructions: [
        "寫函式 <code>greet(name, title=\"船長\")</code>",
        "回傳 <code>f\"{title}{name}你好\"</code>",
        "分別印出 <code>greet(\"小艾\")</code> 和 <code>greet(\"小圖\", \"技師\")</code>",
      ],
      starter: "# 第二個參數要有預設值\n",
      hint: 'def greet(name, title="船長"): 參數寫 = 就是預設值,呼叫時可給可不給。',
      xp: 50,
      tests: [
        { name: "用預設頭銜", code: 'assert ns["greet"]("小艾") == "船長小艾你好", "greet(\\"小艾\\") 應該用預設頭銜:船長小艾你好"' },
        { name: "用指定頭銜", code: 'assert ns["greet"]("小圖", "技師") == "技師小圖你好", "greet(\\"小圖\\", \\"技師\\") 應該是:技師小圖你好"' },
      ],
    },
    {
      "id": "c7-mutable-default",
      "planet": "🧪",
      "title": "上次的任務還在",
      "topic": "可變預設參數只建立一次",
      "story": "預設參數在 def 執行時建立，不會在每次呼叫時重建。把 [] 當預設值，可能讓多次呼叫共用同一份任務清單。",
      "instructions": [
        "修正 <code>add_task(task, tasks=None)</code>：省略 tasks 時建立新串列，再 append task 並回傳。",
        "有傳入串列時，要修改並回傳該串列本身；傳入空串列也一樣。"
      ],
      "starter": "def add_task(task, tasks=[]):\n    tasks.append(task)\n    return tasks\n",
      "hint": "把預設值改成 None，函式內只在 tasks is None 時建立 []。不要用 tasks = tasks or []，否則會換掉呼叫者傳入的空串列。",
      "xp": 100,
      "tests": [
        {
          "name": "省略參數時互相獨立",
          "code": "first = ns[\"add_task\"](\"scan\")\nsecond = ns[\"add_task\"](\"land\")\nassert first == [\"scan\"] and second == [\"land\"] and first is not second, \"每次省略 tasks 都要建立新的任務清單\""
        },
        {
          "name": "尊重傳入的串列",
          "code": "for tasks in [[], [\"start\"]]:\n    expected = tasks + [\"end\"]\n    result = ns[\"add_task\"](\"end\", tasks)\n    assert result is tasks and tasks == expected, \"即使傳入空串列，也必須修改並回傳原物件\""
        }
      ]
    },
    {
      id: "c7-scope",
      planet: "🧯",
      title: "變數範圍除錯",
      topic: "變數有效範圍",
      story: "在函式內重新指定整數參數，不會改變外部同名變數。用 return 傳出新值，再由外部接住；傳入可變物件的情況，後面會另外實驗。",
      instructions: [
        "已有 <code>fuel = 50</code>",
        "寫函式 <code>add_fuel(f, amount)</code>,回傳 <code>f + amount</code>",
        "用 <code>fuel = add_fuel(fuel, 10)</code> 更新燃料",
        "印出 fuel(應該是 60)",
      ],
      starter: "fuel = 50\n\n# 用 return 的方式安全加燃料\n",
      hint: "函式內算好結果 return 出來,外面用 fuel = add_fuel(fuel, 10) 接住新值。",
      xp: 50,
      tests: [
        { name: "有使用 return", code: 'assert "return" in src, "函式要用 return 回傳結果"' },
        { name: "fuel 更新為 60", code: 'assert ns.get("fuel") == 60, "fuel 最後應該是 50 + 10 = 60"' },
        { name: "有印出", code: 'assert "60" in output, "記得 print(fuel)"' },
      ],
    },
    {
      "id": "c7-rebind",
      "planet": "🧪",
      "title": "函式裡換掉了誰",
      "topic": "參數重新綁定與原地修改",
      "story": "參數是指向物件的區域名稱。items = [] 只換掉區域名稱的綁定，items.clear() 才會清空呼叫者傳進來的串列。",
      "instructions": [
        "修正 <code>empty_bag(items)</code>，原地清空 items 並回傳同一個串列。",
        "函式外的別名也必須看到空串列。"
      ],
      "starter": "def empty_bag(items):\n    items = []\n    return items\n",
      "hint": "使用 items.clear() 或 items[:] = []，再 return items；不要重新指定 items = []。",
      "xp": 90,
      "tests": [
        {
          "name": "清空原物件",
          "code": "for bag in [[1, 2], []]:\n    alias = bag\n    result = ns[\"empty_bag\"](bag)\n    assert result is bag and alias == [], \"要改到傳入的物件，不是只讓區域參數指向新串列\""
        }
      ]
    },
    {
      "id": "c7-closure",
      "planet": "🧪",
      "title": "三個按鈕回同一個值",
      "topic": "閉包的延遲綁定",
      "story": "lambda 建立小函式；若它讀取外層變數，通常會在呼叫時才讀取當時的值。迴圈結束後 i 已是最後一個數字，因此所有按鈕可能得到相同結果。",
      "instructions": [
        "修正 <code>make_buttons()</code>，回傳三個不需參數的函式，依序呼叫應得到 0、1、2。",
        "可用 lambda 的預設參數保存當圈的值，或使用另一層函式建立獨立作用域。"
      ],
      "starter": "def make_buttons():\n    buttons = []\n    for i in range(3):\n        buttons.append(lambda: i)\n    return buttons\n",
      "hint": "lambda i=i: i 會在建立函式時把目前的 i 存成預設值。這裡 i 是不可變整數，不是共用的可變清單。",
      "xp": 110,
      "tests": [
        {
          "name": "各自保存當圈的值",
          "code": "buttons = ns[\"make_buttons\"]()\nassert len(buttons) == 3 and all(callable(b) for b in buttons), \"回傳三個函式，不是三個數字\"\nassert [b() for b in buttons] == [0, 1, 2], \"lambda 在呼叫時才讀 i；請保存每圈當時的值\"\nassert [b() for b in reversed(buttons)] == [2, 1, 0], \"結果不應依呼叫順序變化\""
        }
      ]
    },
    {
      id: "c7-numfunc",
      planet: "📊",
      title: "數值函式儀表板",
      topic: "數值函式(max/min/sum/round)",
      story: "艦隊成績分析:最高分、最低分、總分、平均,內建函式一把罩。",
      instructions: [
        "已有 <code>data = [68, 92, 45, 77]</code>",
        "建立 <code>highest = max(data)</code>、<code>lowest = min(data)</code>",
        "建立 <code>total = sum(data)</code>",
        "建立 <code>avg = round(total / len(data), 1)</code>,全部印出",
      ],
      starter: "data = [68, 92, 45, 77]\n\n# max、min、sum、round\n",
      hint: "round(數值, 1) 取近似值到小數第 1 位；恰好在中間時取最接近的偶數，浮點表示也可能影響結果。len(data) 是資料筆數。",
      xp: 50,
      tests: [
        { name: "highest == 92", code: 'assert ns.get("highest") == 92, "最高分是 92"' },
        { name: "lowest == 45", code: 'assert ns.get("lowest") == 45, "最低分是 45"' },
        { name: "total == 282", code: 'assert ns.get("total") == 282, "總分是 282"' },
        { name: "avg == 70.5", code: 'assert ns.get("avg") == 70.5, "平均 282/4 = 70.5"' },
      ],
    },
    {
      id: "c7-split",
      planet: "✂️",
      title: "字串裁縫室",
      topic: "連接及分割字串",
      story: "split 把一條字串剪成串列,join 再把串列縫回一條字串。",
      instructions: [
        "已有 <code>s = \"太陽,月亮,星星\"</code>",
        "建立 <code>parts = s.split(\",\")</code>",
        "建立 <code>joined = \"-\".join(parts)</code>",
        "印出 parts 和 joined",
      ],
      starter: 's = "太陽,月亮,星星"\n\n# split 再 join\n',
      hint: 's.split(",") 以逗號切開;"-".join(parts) 用連字號接回去。',
      xp: 50,
      tests: [
        { name: "parts 切割正確", code: 'assert ns.get("parts") == ["太陽", "月亮", "星星"], "parts 應該是三個詞的串列"' },
        { name: "joined 連接正確", code: 'assert ns.get("joined") == "太陽-月亮-星星", "joined 應該用 - 連接"' },
      ],
    },
    {
      id: "c7-replace",
      planet: "🔁",
      title: "搜尋取代工坊",
      topic: "搜尋及取代字串",
      story: "find 回報文字第一次出現的位置(找不到回 -1),replace 把指定文字全部換掉。",
      instructions: [
        "已有 <code>msg = \"Python 好好玩\"</code>",
        "建立 <code>pos = msg.find(\"好\")</code>",
        "建立 <code>new_msg = msg.replace(\"好\", \"超\")</code>",
        "印出 pos 和 new_msg",
      ],
      starter: 'msg = "Python 好好玩"\n\n# find 和 replace\n',
      hint: "find 從 0 開始數(空格也算一格);replace(舊, 新) 會換掉所有符合的字。",
      xp: 50,
      tests: [
        { name: "pos == 7", code: 'assert ns.get("pos") == 7, "第一個 好 在索引 7(P=0 開始數,空格也算)"' },
        { name: "取代正確", code: 'assert ns.get("new_msg") == "Python 超超玩", "replace 會把兩個 好 都換成 超"' },
      ],
    },
    {
      id: "c7-random",
      planet: "🎲",
      title: "亂數骰子塔",
      topic: "random 模組",
      story: "要使用標準函式庫的 random 模組，先 import；random.randint(1, 6) 就像擲一顆六面骰。",
      instructions: [
        "<code>import random</code>",
        "寫函式 <code>roll()</code>,回傳 <code>random.randint(1, 6)</code>",
        "呼叫幾次 roll() 並印出,感受亂數的變化",
      ],
      starter: "# 先 import random\n",
      hint: "import random 寫在最上面;random.randint(1, 6) 會回傳 1~6 的隨機整數。",
      xp: 60,
      tests: [
        { name: "有 import random", code: 'assert "import random" in src, "要先 import random 才能用亂數"' },
        { name: "骰子範圍正確", code: 'results = [ns["roll"]() for _ in range(60)]\nassert all(1 <= r <= 6 for r in results), "roll() 應該永遠回傳 1~6"' },
        { name: "真的是亂數", code: 'results = [ns["roll"]() for _ in range(60)]\nassert len(set(results)) > 1, "擲 60 次應該會出現不同點數,檢查是不是寫死了"' },
      ],
    },
  ],
};
