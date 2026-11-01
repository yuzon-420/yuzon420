// 第 6 章:字典
export const CH6 = {
  num: 6,
  emoji: "🗂️",
  title: "字典星系",
  subtitle: "鍵值對、字典維護、in、keys/values、items、setdefault",
  levels: [
    {
      id: "c6-create",
      planet: "🗂️",
      title: "建立檔案卡",
      topic: "建立字典與取值",
      story: "字典用「鍵-值」對儲存資料,像幫每筆資料貼上標籤,用標籤就能取值。",
      instructions: [
        "建立字典 <code>profile = {\"name\": \"小艾\", \"hp\": 100}</code>",
        "用 <code>profile[\"name\"]</code> 印出名字",
      ],
      starter: "# 建立 profile 字典並取值\n",
      hint: '字典用大括號:{"鍵": 值}。取值用 profile["name"]。',
      xp: 40,
      tests: [
        { name: "profile 正確", code: 'assert ns.get("profile") == {"name": "小艾", "hp": 100}, "profile 要有 name 和 hp 兩個鍵"' },
        { name: "印出名字", code: 'assert "小艾" in output, "記得 print(profile[\\"name\\"])"' },
      ],
    },
    {
      "id": "c6-key-collision",
      "planet": "🧪",
      "title": "三把鑰匙同一格",
      "topic": "True、1、1.0 作為字典鍵",
      "story": "字典用相等性與雜湊值辨認鍵。True、1、1.0 相等且雜湊值相同，所以會對應同一個項目；字串 \"1\" 則是另一個鍵。",
      "instructions": [
        "建立 <code>slots = {True: \"布林\", 1: \"整數\", 1.0: \"浮點\", \"1\": \"字串\"}</code>。",
        "建立 <code>size = len(slots)</code>、<code>numeric = slots[True]</code>、<code>textual = slots[\"1\"]</code>，觀察覆寫結果。"
      ],
      "starter": "# 建立 slots 並讀取 size、numeric、textual\n",
      "hint": "三個數值鍵共用同一項，最後值是「浮點」；字串鍵獨立，因此總共有兩項。",
      "xp": 90,
      "tests": [
        {
          "name": "鍵相等導致覆寫",
          "code": "assert ns.get(\"slots\") == {1: \"浮點\", \"1\": \"字串\"}, \"數值鍵最後會被浮點那筆覆寫\"\nassert ns.get(\"size\") == 2 and ns.get(\"numeric\") == \"浮點\" and ns.get(\"textual\") == \"字串\", \"True、1、1.0 不會佔三個位置\""
        }
      ]
    },
    {
      id: "c6-maintain",
      planet: "🔧",
      title: "字典維護站",
      topic: "字典維護(改、增、刪)",
      story: "衛星資料庫要大更新:改資料、加資料、刪資料,一次搞定!",
      instructions: [
        "已有 <code>moons = {\"地球\": 1, \"火星\": 0}</code>",
        "把 <code>\"火星\"</code> 的值改成 <code>2</code>",
        "新增 <code>\"木星\"</code>,值是 <code>95</code>",
        "用 <code>del</code> 刪除 <code>\"地球\"</code>,印出 moons",
      ],
      starter: 'moons = {"地球": 1, "火星": 0}\n\n# 改、增、刪\n',
      hint: 'moons["火星"] = 2 改值;moons["木星"] = 95 新增;del moons["地球"] 刪除。',
      xp: 40,
      tests: [
        { name: "有使用 del", code: 'assert "del" in src, "要用 del 刪除鍵"' },
        { name: "最終內容正確", code: 'assert ns.get("moons") == {"火星": 2, "木星": 95}, "最後應該只剩 火星:2 和 木星:95"' },
      ],
    },
    {
      id: "c6-in",
      planet: "❓",
      title: "in 查驗官",
      topic: "in 功能",
      story: "查資料前先確認「這個鍵存在嗎?」,直接取不存在的鍵會爆出 KeyError!",
      instructions: [
        "已有 <code>moons = {\"地球\": 1, \"木星\": 95}</code>",
        "建立 <code>r1 = \"地球\" in moons</code>",
        "建立 <code>r2 = \"冥王星\" in moons</code>",
        "印出兩個結果",
      ],
      starter: 'moons = {"地球": 1, "木星": 95}\n\n# 用 in 檢查鍵是否存在\n',
      hint: '"鍵" in 字典 會回傳 True 或 False。',
      xp: 40,
      tests: [
        { name: "r1 是 True", code: 'assert ns.get("r1") is True, "地球在字典裡,r1 應該是 True"' },
        { name: "r2 是 False", code: 'assert ns.get("r2") is False, "冥王星不在字典裡,r2 應該是 False"' },
      ],
    },
    {
      "id": "c6-get-none",
      "planet": "🧪",
      "title": "有這個鍵，卻沒有值",
      "topic": "dict.get() 的預設值只處理缺鍵",
      "story": "get(key, default) 只在鍵不存在時用預設值。如果鍵已存在、值剛好是 None，回傳的仍是 None。",
      "instructions": [
        "保留 settings，建立 <code>present = settings.get(\"theme\", \"dark\")</code> 與 <code>missing = settings.get(\"language\", \"zh\")</code>。",
        "建立 <code>has_theme = \"theme\" in settings</code>，觀察有鍵但值為 None 的情況。"
      ],
      "starter": "settings = {\"theme\": None}\n\n# 建立 present、missing、has_theme\n",
      "hint": "present 是 None；missing 是 zh；in 檢查鍵是否存在，所以 has_theme 是 True。",
      "xp": 90,
      "tests": [
        {
          "name": "缺鍵不同於 None",
          "code": "assert \"present\" in ns and ns[\"present\"] is None, \"鍵存在時不會套用 get 的預設值\"\nassert ns.get(\"missing\") == \"zh\" and ns.get(\"has_theme\") is True, \"用 in 判斷鍵是否存在\""
        }
      ]
    },
    {
      id: "c6-keysvalues",
      planet: "🔑",
      title: "鑰匙與寶物",
      topic: "keys 及 values 方法",
      story: "keys() 拿出所有標籤,values() 拿出所有內容物,盤點資料庫全靠它們。",
      instructions: [
        "已有 <code>moons = {\"地球\": 1, \"火星\": 2, \"木星\": 95}</code>",
        "建立 <code>ks = list(moons.keys())</code>",
        "建立 <code>vs = list(moons.values())</code>",
        "印出兩個串列",
      ],
      starter: 'moons = {"地球": 1, "火星": 2, "木星": 95}\n\n# 取出所有鍵和所有值\n',
      hint: "moons.keys() 和 moons.values() 外面包 list() 轉成串列。",
      xp: 40,
      tests: [
        { name: "ks 正確", code: 'assert ns.get("ks") == ["地球", "火星", "木星"], "ks 應該是所有的鍵"' },
        { name: "vs 正確", code: 'assert ns.get("vs") == [1, 2, 95], "vs 應該是所有的值"' },
      ],
    },
    {
      "id": "c6-live-view",
      "planet": "🧪",
      "title": "會跟著更新的清單",
      "topic": "字典 view 與 list 快照",
      "story": "keys() 回傳的是動態檢視，不是當下內容的固定副本。字典改變後，原先保存的檢視也會反映新內容。",
      "instructions": [
        "先建立 <code>view = stock.keys()</code> 與 <code>snapshot = list(stock.keys())</code>。",
        "再加入 <code>stock[\"water\"] = 2</code>，最後建立 <code>current = list(view)</code>。",
        "snapshot 只包含原本的 oxygen；current 包含 oxygen 與 water。"
      ],
      "starter": "stock = {\"oxygen\": 1}\n\n# 先保存 view 與 snapshot，再新增 water\n",
      "hint": "view 保留對字典的動態檢視；list(...) 把當時的鍵複製到一個串列。",
      "xp": 90,
      "tests": [
        {
          "name": "動態檢視與固定快照",
          "code": "assert ns.get(\"snapshot\") == [\"oxygen\"] and ns.get(\"current\") == [\"oxygen\", \"water\"], \"keys 檢視會跟著更新，list 快照不會\"\nassert type(ns.get(\"view\")) is type({}.keys()), \"view 應保存 keys() 的結果\""
        }
      ]
    },
    {
      id: "c6-items",
      planet: "📋",
      title: "items 巡覽車",
      topic: "items 方法",
      story: "items() 讓你一次拿到「鍵和值」,搭配 for 迴圈巡覽整個字典。",
      instructions: [
        "已有 <code>moons</code> 字典",
        "用 <code>for k, v in moons.items():</code> 迴圈",
        "每行印出 <code>鍵 有 值 顆衛星</code>(例如:地球 有 1 顆衛星)",
      ],
      starter: 'moons = {"地球": 1, "火星": 2, "木星": 95}\n\n# 用 items() 巡覽\n',
      hint: 'for k, v in moons.items(): 底下 print(f"{k} 有 {v} 顆衛星")。',
      xp: 50,
      tests: [
        { name: "有使用 items()", code: 'assert ".items()" in src, "要用 items() 方法"' },
        { name: "輸出完整", code: 'assert "地球 有 1 顆衛星" in output and "火星 有 2 顆衛星" in output and "木星 有 95 顆衛星" in output, "三顆星球都要印出 鍵 有 值 顆衛星"' },
      ],
    },
    {
      id: "c6-setdefault",
      planet: "🥇",
      title: "setdefault 獎牌榜",
      topic: "setdefault 方法",
      story: "setdefault:鍵存在就回傳原值;不存在就先設定預設值再回傳。獎牌榜統計神器!",
      instructions: [
        "已有 <code>medals = {\"金牌\": 3}</code>",
        "建立 <code>g = medals.setdefault(\"金牌\", 0)</code>(已存在 → 拿到 3)",
        "建立 <code>s = medals.setdefault(\"銀牌\", 5)</code>(不存在 → 設成 5)",
        "印出 g、s 和 medals",
      ],
      starter: 'medals = {"金牌": 3}\n\n# setdefault 兩連發\n',
      hint: "setdefault(鍵, 預設值):金牌已存在所以回傳 3 且不變;銀牌不存在所以新增為 5。",
      xp: 50,
      tests: [
        { name: "有使用 setdefault", code: 'assert "setdefault" in src, "要用 setdefault 方法"' },
        { name: "g == 3(原值不變)", code: 'assert ns.get("g") == 3, "金牌已存在,setdefault 回傳原本的 3"' },
        { name: "s == 5(新增預設)", code: 'assert ns.get("s") == 5 and ns.get("medals") == {"金牌": 3, "銀牌": 5}, "銀牌不存在,應新增為 5"' },
      ],
    },
    {
      "id": "c6-fromkeys",
      "planet": "🧪",
      "title": "每位隊員共用背包？",
      "topic": "dict.fromkeys() 的可變值共用",
      "story": "dict.fromkeys(names, []) 只建立一個空串列，所有鍵都指向它。每個人要有獨立背包，必須為每個鍵建立新的串列。",
      "instructions": [
        "修正 <code>make_bags(names)</code>，回傳以名字為鍵、獨立空串列為值的字典。",
        "往某人的背包加入物品時，其他人的背包不能跟著改變。"
      ],
      "starter": "def make_bags(names):\n    return dict.fromkeys(names, [])\n",
      "hint": "用迴圈每次指定 []，或用 {name: [] for name in names}，每次都建立新串列。",
      "xp": 90,
      "tests": [
        {
          "name": "每個背包獨立",
          "code": "bags = ns[\"make_bags\"]([\"Ada\", \"Lin\"])\nassert bags == {\"Ada\": [], \"Lin\": []}, \"每人先有空背包\"\nbags[\"Ada\"].append(\"map\")\nassert bags == {\"Ada\": [\"map\"], \"Lin\": []}, \"fromkeys 的同一個串列會讓所有人共用背包\"\nassert ns[\"make_bags\"]([]) == {}, \"沒有名字時回傳空字典\""
        }
      ]
    },
  ],
};
