// 第 9 章:檔案與例外處理
export const CH9 = {
  num: 9,
  emoji: "🛡️",
  title: "檔案星系",
  subtitle: "檔案讀寫、with…as、try…except、assert 斷言",
  levels: [
    {
      id: "c9-file",
      planet: "💾",
      title: "航行日誌",
      topic: "檔案的寫入與讀取",
      story: "把訊息寫進檔案、再讀出來——open() 的 \"w\" 模式寫入、\"r\" 模式讀取。",
      instructions: [
        "用 <code>open(\"log.txt\", \"w\")</code> 寫入 <code>任務開始</code>",
        "再用 <code>open(\"log.txt\", \"r\")</code> 讀出內容並印出",
        "記得寫完要 <code>close()</code>",
      ],
      starter: '# 寫入\nf = open("log.txt", "w")\n# f.write(...)\n# f.close()\n\n# 讀取並印出\n',
      hint: 'f.write("任務開始") 寫入;讀取用 content = f.read() 再 print(content)。',
      xp: 50,
      tests: [
        { name: "檔案內容正確", code: 'assert open("log.txt").read() == "任務開始", "log.txt 裡應該是 任務開始"' },
        { name: "有讀出並印出", code: 'assert "任務開始" in output, "要把讀到的內容印出來"' },
      ],
    },
    {
      id: "c9-withas",
      planet: "🤝",
      title: "with 自動艙門",
      topic: "with…as 語法",
      story: "with 像自動艙門:離開區塊就自動關檔,永遠不會忘記 close()!",
      instructions: [
        "起始程式已幫你寫好一個三行的名單檔 <code>crew.txt</code>",
        "用 <code>with open(...) as f:</code> 讀取",
        "用 <code>lines = f.readlines()</code> 取得所有行",
        "建立 <code>count = len(lines)</code> 並印出",
      ],
      starter: '# 已幫你建立名單檔(不用修改這段)\nwith open("crew.txt", "w") as f:\n    f.write("艾達\\n小圖\\n波波\\n")\n\n# 用 with open 讀取並計算行數\n',
      hint: 'with open("crew.txt") as f: 底下 lines = f.readlines(),len(lines) 是行數。',
      xp: 50,
      tests: [
        { name: "有使用 with…as", code: 'assert src.count("with") >= 2, "讀取也要用 with open(...) as f: 的寫法"' },
        { name: "count == 3", code: 'assert ns.get("count") == 3, "名單有 3 行,count 應該是 3"' },
        { name: "有印出", code: 'assert "3" in output, "記得 print(count)"' },
      ],
    },
    {
      id: "c9-tryexcept",
      planet: "🛡️",
      title: "例外防護罩",
      topic: "try…except",
      story: "除以零會讓程式當場爆炸!用 try…except 接住錯誤,讓程式優雅地活下來。",
      instructions: [
        "寫函式 <code>safe_div(a, b)</code>",
        "<code>try</code> 回傳 <code>a / b</code>",
        "<code>except ZeroDivisionError</code> 時回傳 <code>\"不能除以零\"</code>",
      ],
      starter: "def safe_div(a, b):\n    # try / except\n    pass\n\nprint(safe_div(10, 2))\nprint(safe_div(5, 0))\n",
      hint: "try: 底下 return a / b;except ZeroDivisionError: 底下 return \"不能除以零\"。",
      xp: 60,
      tests: [
        { name: "有使用 try…except", code: 'assert "try" in src and "except" in src, "要用 try…except 處理例外"' },
        { name: "正常除法", code: 'assert ns["safe_div"](10, 2) == 5.0, "safe_div(10, 2) 應該是 5.0"' },
        { name: "除以零被接住", code: 'assert ns["safe_div"](5, 0) == "不能除以零", "除以零時要回傳 不能除以零,不能讓程式爆炸"' },
      ],
    },
    {
      "id": "c9-finally",
      "planet": "🧪",
      "title": "return 被覆蓋了",
      "topic": "finally 仍會執行且可能蓋掉回傳值",
      "story": "即使 try 或 except 已準備 return，離開前仍會執行 finally。若 finally 又 return，先前的回傳值甚至未處理的例外都可能被蓋掉。",
      "instructions": [
        "修正 <code>parse_number(text, events)</code>：可轉成整數則回傳整數，遇到 ValueError 則回傳 None。",
        "無論成功或失敗，都在 finally 中向 events 加入 <code>\"done\"</code>，但不要改掉原本的回傳值。"
      ],
      "starter": "def parse_number(text, events):\n    try:\n        return int(text)\n    except ValueError:\n        return None\n    finally:\n        events.append(\"done\")\n        return 0\n",
      "hint": "保留 finally 的清理動作，移除其中的 return。finally 用來收尾，通常不應替換主要流程的結果。",
      "xp": 100,
      "tests": [
        {
          "name": "保留成功與失敗結果",
          "code": "for value, expected in [(\"42\", 42), (\"bad\", None), (\"0\", 0)]:\n    events = []\n    result = ns[\"parse_number\"](value, events)\n    assert result == expected and type(result) is type(expected), \"finally 不應覆蓋 try 或 except 的回傳值\"\n    assert events == [\"done\"], \"每次都必須執行收尾\""
        },
        {
          "name": "不吞掉其他例外",
          "code": "events = []\nraised = False\ntry:\n    ns[\"parse_number\"](None, events)\nexcept TypeError:\n    raised = True\nassert raised and events == [\"done\"], \"只處理 ValueError；TypeError 仍應拋出並完成收尾\""
        }
      ]
    },
    {
      "id": "c9-except-order",
      "planet": "🧪",
      "title": "大網先接走了錯誤",
      "topic": "except 依順序選第一個符合的類別",
      "story": "ValueError 是 Exception 的子類別。若把 except Exception 放前面，更具體的 ValueError 分支就沒有機會執行。",
      "instructions": [
        "修正 <code>classify(text)</code> 的 except 順序：能轉整數時回傳 <code>\"ok\"</code>。",
        "遇到 ValueError 回傳 <code>\"bad value\"</code>；其他 Exception 回傳 <code>\"other error\"</code>。"
      ],
      "starter": "def classify(text):\n    try:\n        int(text)\n        return \"ok\"\n    except Exception:\n        return \"other error\"\n    except ValueError:\n        return \"bad value\"\n",
      "hint": "把較具體的 except ValueError 放在 except Exception 前面，Python 只執行第一個匹配的 except。",
      "xp": 90,
      "tests": [
        {
          "name": "由具體到一般",
          "code": "assert ns[\"classify\"](\"12\") == \"ok\", \"合法數字正常返回\"\nassert ns[\"classify\"](\"abc\") == \"bad value\", \"ValueError 分支要排在 Exception 前面\"\nassert ns[\"classify\"](None) == \"other error\", \"TypeError 由一般 Exception 分支處理\""
        }
      ]
    },
    {
      id: "c9-assert",
      planet: "🏆",
      title: "最終試煉:assert 斷言",
      topic: "assert 程式斷言",
      story: "最後一道防線!assert 主動檢查資料合不合理,不合理就立刻拉警報。通過這關,你就是銀河傳奇!",
      instructions: [
        "寫函式 <code>set_hp(hp)</code>",
        "用 <code>assert 0 <= hp <= 100, \"血量超出範圍\"</code> 檢查",
        "檢查通過就回傳 hp",
      ],
      starter: "def set_hp(hp):\n    # assert 檢查後回傳\n    pass\n\nprint(set_hp(80))\n",
      hint: "assert 條件, \"錯誤訊息\" — 條件不成立時會拋出 AssertionError。",
      xp: 100,
      tests: [
        { name: "有使用 assert", code: 'assert "assert" in src, "要用 assert 斷言檢查"' },
        { name: "合法血量放行", code: 'assert ns["set_hp"](80) == 80 and ns["set_hp"](0) == 0 and ns["set_hp"](100) == 100, "0~100 的血量都要正常回傳"' },
        { name: "超標血量拉警報", code: 'ok = False\ntry:\n    ns["set_hp"](150)\nexcept AssertionError:\n    ok = True\nassert ok, "set_hp(150) 應該觸發 AssertionError"' },
      ],
    },
  ],
};
