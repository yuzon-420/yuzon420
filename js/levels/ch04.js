// 第 4 章:迴圈
export const CH4 = {
  num: 4,
  emoji: "🔁",
  title: "迴圈星系",
  subtitle: "range、for、巢狀迴圈、break、continue、while",
  levels: [
    {
      id: "c4-range",
      planet: "📏",
      title: "range 產生器",
      topic: "認識 range 函式",
      story: "range 是迴圈的燃料,能產生一連串規律的數字。",
      instructions: [
        "建立 <code>r1 = list(range(1, 6))</code>",
        "建立 <code>r2 = list(range(10, 0, -2))</code>",
        "印出兩個串列,觀察規律",
      ],
      starter: "# range(起點, 終點, 間隔) — 不包含終點!\n",
      hint: "range(1,6) 是 1~5;range(10,0,-2) 是 10,8,6,4,2。用 list() 包起來才看得到內容。",
      xp: 40,
      tests: [
        { name: "r1 正確", code: 'assert ns.get("r1") == [1, 2, 3, 4, 5], "r1 應該是 [1, 2, 3, 4, 5](range 不含終點)"' },
        { name: "r2 正確", code: 'assert ns.get("r2") == [10, 8, 6, 4, 2], "r2 應該是 [10, 8, 6, 4, 2](間隔 -2)"' },
      ],
    },
    {
      id: "c4-for",
      planet: "➕",
      title: "百數總和",
      topic: "for 迴圈",
      story: "傳說數學家高斯小時候心算出 1 加到 100,你用 for 迴圈也能秒算!",
      instructions: [
        "建立 <code>total = 0</code>",
        "用 <code>for</code> 迴圈把 1 到 100 依序加進 total",
        "印出 total(不可以用 sum() 偷吃步!)",
      ],
      starter: "total = 0\n\n# 用 for 迴圈累加 1~100\n",
      hint: "for i in range(1, 101): 底下寫 total += i,迴圈外再 print(total)。",
      xp: 50,
      tests: [
        { name: "有使用 for 迴圈", code: 'assert "for" in src and "sum(" not in src, "要用 for 迴圈累加,不能用 sum()"' },
        { name: "total == 5050", code: 'assert ns.get("total") == 5050, "1 加到 100 應該是 5050"' },
        { name: "有印出", code: 'assert "5050" in output, "記得 print(total)"' },
      ],
    },
    {
      "id": "c4-iterator",
      "planet": "🧪",
      "title": "只能讀一次的訊號",
      "topic": "迭代器會被消耗",
      "story": "range 可以重新走訪，但 iter(range(...)) 取得的迭代器會記住進度。走到結尾後，再次讀取只會得到空資料。",
      "instructions": [
        "起始碼先用 <code>next(signal)</code> 取出第一項，存入 first。",
        "將 signal 剩餘內容用 <code>list(signal)</code> 存入 remaining，再讀一次存入 exhausted。",
        "重新用 <code>list(range(3))</code> 建立 fresh，觀察重新建立資料與重讀迭代器的差別。"
      ],
      "starter": "signal = iter(range(3))\nfirst = next(signal)\n\n# 建立 remaining、exhausted、fresh\n",
      "hint": "first 是 0；剩下 [1, 2]。迭代器耗盡後是 []，想從頭取得資料就重新建立。",
      "xp": 80,
      "tests": [
        {
          "name": "進度與耗盡",
          "code": "assert ns.get(\"first\") == 0 and ns.get(\"remaining\") == [1, 2], \"next 已先消耗 0，只剩 1 和 2\"\nassert ns.get(\"exhausted\") == [] and ns.get(\"fresh\") == [0, 1, 2], \"耗盡的迭代器不會自動重頭開始\""
        }
      ]
    },
    {
      "id": "c4-enumerate",
      "planet": "🧪",
      "title": "從一開始的點名",
      "topic": "enumerate(start=...) 的編號不改變資料",
      "story": "enumerate 同時提供編號與元素；start=1 只改變編號的起點，不會跳過第一個元素。",
      "instructions": [
        "使用 <code>for number, name in enumerate(crew, start=1)</code> 逐一印出編號與名字。",
        "每行格式為 <code>1:Ada</code>、<code>2:Lin</code>、<code>3:Bo</code>。"
      ],
      "starter": "crew = [\"Ada\", \"Lin\", \"Bo\"]\n\n# enumerate 會依序給出編號與名字\n",
      "hint": "for number, name in enumerate(crew, start=1): 底下 print(f\"{number}:{name}\")。不要從 crew[1:] 開始。",
      "xp": 80,
      "tests": [
        {
          "name": "完整點名",
          "code": "assert output.splitlines() == [\"1:Ada\", \"2:Lin\", \"3:Bo\"], \"start=1 是從編號 1 開始，不能漏掉 Ada\"\nimport ast\nassert any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == \"enumerate\" for n in ast.walk(ast.parse(src))), \"請實際使用 enumerate()\""
        }
      ]
    },
    {
      "id": "c4-zip",
      "planet": "🧪",
      "title": "配對為何少了一筆",
      "topic": "zip 在最短資料結束時停止",
      "story": "zip 把資料逐項配對，預設以最短的一邊為準，而且回傳的是只能消耗一次的迭代器。",
      "instructions": [
        "建立 <code>pairs = zip(names, scores)</code>。",
        "用 for 迴圈 <code>for name, score in pairs</code> 逐行印出 <code>Ada:90</code>、<code>Lin:80</code>。",
        "迴圈後建立 <code>leftover = list(pairs)</code>，觀察 pairs 是否還有資料。"
      ],
      "starter": "names = [\"Ada\", \"Lin\", \"Bo\"]\nscores = [90, 80]\n\n# zip 配對，再檢查 leftover\n",
      "hint": "zip 不會替 Bo 自動補分數；兩筆配對被迴圈讀完後，leftover 是空串列。",
      "xp": 80,
      "tests": [
        {
          "name": "最短配對與耗盡",
          "code": "assert output.splitlines() == [\"Ada:90\", \"Lin:80\"], \"zip 預設只產生兩筆配對\"\nassert ns.get(\"leftover\") == [], \"pairs 應為 zip 迭代器，被 for 讀完就沒有剩餘資料\""
        }
      ]
    },
    {
      id: "c4-nested",
      planet: "⭐",
      title: "星星三角形",
      topic: "巢狀 for 迴圈",
      story: "用迴圈裡的迴圈,排出一座星星三角形訊號塔!",
      instructions: [
        "用<strong>兩層</strong> for 迴圈印出 4 行星星:",
        "第 1 行 1 顆、第 2 行 2 顆……第 4 行 4 顆",
        "內層迴圈用 <code>print(\"*\", end=\"\")</code> 印星星,每行結束再換行",
      ],
      starter: '# 外層控制行數,內層控制每行星星數\nfor i in range(1, 5):\n    # 內層迴圈印 i 顆星星\n    # 最後 print() 換行\n    pass\n',
      hint: '內層:for j in range(i): print("*", end="")。內層跑完後用 print() 換行。',
      xp: 60,
      tests: [
        { name: "使用了兩層迴圈", code: 'assert src.count("for") >= 2, "要用巢狀(兩層)for 迴圈"' },
        { name: "三角形正確", code: 'assert [l for l in output.splitlines() if l.strip()] == ["*", "**", "***", "****"], "輸出要是 4 行星星:1、2、3、4 顆"' },
      ],
    },
    {
      id: "c4-break",
      planet: "🛑",
      title: "break 緊急煞車",
      topic: "break 命令",
      story: "在 2~90 裡找出第一個能整除 91 的數字,找到就立刻用 break 停止,不做多餘的搜索。",
      instructions: [
        "用 for 迴圈從 2 找到 90",
        "遇到第一個能整除 91 的數字(<code>91 % i == 0</code>)就印出它,然後 <code>break</code>",
      ],
      starter: "# 找出 91 的第一個因數(從 2 開始)\nfor i in range(2, 91):\n    pass\n",
      hint: "if 91 % i == 0: 印出 i 之後馬上 break,迴圈就會停止。",
      xp: 50,
      tests: [
        { name: "有使用 break", code: 'assert "break" in src, "要用 break 停止迴圈"' },
        { name: "找到 7", code: 'assert "7" in output, "91 = 7 × 13,第一個因數是 7"' },
        { name: "break 有生效", code: 'assert "13" not in output, "印出 7 之後就要 break,不該再找到 13"' },
      ],
    },
    {
      "id": "c4-loop-else",
      "planet": "🧪",
      "title": "迴圈也有 else",
      "topic": "for-else 取決於是否 break",
      "story": "迴圈的 else 在正常走完時執行，遇到 break 就不執行。即使一開始就是空串列，沒有發生 break，也會進入 else。",
      "instructions": [
        "完成 <code>locate(items, target)</code>：找到 target 時 break，回傳 <code>\"找到\"</code>；完整走完沒找到則回傳 <code>\"找不到\"</code>。",
        "使用 for-else，空串列也要回傳找不到。"
      ],
      "starter": "def locate(items, target):\n    for item in items:\n        # 找到時 break\n        pass\n    else:\n        # 沒有 break 才執行這裡\n        pass\n    return \"找到\"\n",
      "hint": "在 if item == target: 裡 break；與 for 對齊的 else 裡 return \"找不到\"。",
      "xp": 80,
      "tests": [
        {
          "name": "找到、找不到與空資料",
          "code": "assert ns[\"locate\"]([1, 2, 3], 2) == \"找到\", \"找到目標應跳出迴圈\"\nassert ns[\"locate\"]([1, 2, 3], 9) == \"找不到\" and ns[\"locate\"]([], 9) == \"找不到\", \"沒有 break 時，包括空串列，都要進入 else\"\nimport ast\nassert any(isinstance(n, ast.For) and n.orelse for n in ast.walk(ast.parse(src))), \"請把 else 接在 for 迴圈上\""
        }
      ]
    },
    {
      id: "c4-continue",
      planet: "⏭️",
      title: "continue 跳躍器",
      topic: "continue 命令",
      story: "訊號只在奇數頻道播放!用 continue 跳過偶數,不執行後面的程式。",
      instructions: [
        "用 for 迴圈從 1 到 10",
        "遇到偶數就 <code>continue</code> 跳過",
        "只印出奇數(每行一個)",
      ],
      starter: "for i in range(1, 11):\n    # 偶數 continue,奇數印出\n    pass\n",
      hint: "if i % 2 == 0: continue — 之後的 print(i) 就只有奇數會執行。",
      xp: 50,
      tests: [
        { name: "有使用 continue", code: 'assert "continue" in src, "要用 continue 跳過偶數"' },
        { name: "只印出奇數", code: 'assert [l.strip() for l in output.strip().splitlines()] == ["1", "3", "5", "7", "9"], "輸出應該是 1 3 5 7 9,一行一個"' },
      ],
    },
    {
      id: "c4-while",
      planet: "🔄",
      title: "while 存錢艙",
      topic: "while 迴圈",
      story: "不知道要跑幾次的時候用 while!持續累加 1、2、3…直到總和超過 500 才停。",
      instructions: [
        "建立 <code>num = 0</code>、<code>total = 0</code>",
        "用 <code>while total <= 500:</code> 迴圈:每次 num 加 1,再把 num 加進 total",
        "結束後印出 num 和 total",
      ],
      starter: "num = 0\ntotal = 0\n\n# while 迴圈:total 超過 500 就停\n",
      hint: "while total <= 500: 底下先 num += 1,再 total += num。",
      xp: 60,
      tests: [
        { name: "有使用 while", code: 'assert "while" in src, "要用 while 迴圈"' },
        { name: "num == 32", code: 'assert ns.get("num") == 32, "加到 32 時總和才會超過 500"' },
        { name: "total == 528", code: 'assert ns.get("total") == 528, "1+2+...+32 = 528"' },
      ],
    },
    {
      id: "c4-boss",
      planet: "🌌",
      title: "BOSS:黑洞密碼",
      topic: "綜合挑戰 FizzBuzz",
      story: "黑洞閘門只認傳說中的 FizzBuzz 咒語,用判斷式+迴圈破解它!",
      instructions: [
        "從 1 印到 15,每行一個",
        "3 的倍數改印 <code>Fizz</code>、5 的倍數改印 <code>Buzz</code>",
        "同時是 3 和 5 的倍數印 <code>FizzBuzz</code>",
      ],
      starter: "# 傳說中的 FizzBuzz:1 到 15\n",
      hint: "先判斷 i % 15 == 0(印 FizzBuzz),再判斷 3、再判斷 5,最後 else 印數字。",
      xp: 100,
      tests: [
        {
          name: "FizzBuzz 咒語正確",
          code: 'expected = ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]\nactual = [l.strip() for l in output.strip().splitlines()]\nassert actual == expected, "輸出和傳說的咒語不符,逐行對照看看哪裡不一樣"',
        },
      ],
    },
  ],
};
