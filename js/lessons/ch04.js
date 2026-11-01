// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_4 = {
  "c4-range": {
    "concept": "range 表示規律的整數序列，包含起點、不包含終點。",
    "syntax": "range(start, stop, step)",
    "example": "print(list(range(2, 7, 2)))   # [2, 4, 6]\nprint(list(range(5, 0, -2)))  # [5, 3, 1]",
    "explanation": "每次加上 step，直到下一個值將越過終點邊界。list() 可把這段序列具體列出。",
    "pitfall": "step 不能為 0；負 step 才能從大數往小數走。"
  },
  "c4-for": {
    "concept": "for 依序取得可迭代物件的每個元素，重複執行區塊。",
    "syntax": "for item in iterable:\n    動作",
    "example": "total = 0\nfor n in range(1, 4):\n    total += n\nprint(total)  # 6",
    "explanation": "total 放在迴圈外初始化，讓每次加法保留先前的累計值；最後只印一次總和。",
    "pitfall": "把 total = 0 放進迴圈會一直歸零；print 放在迴圈內則會印出每步結果。"
  },
  "c4-nested": {
    "concept": "外層每走一次，內層都會從頭走完一輪。",
    "syntax": "for row in ...:\n    for col in ...: ...",
    "example": "for row in range(2):\n    for col in range(3):\n        print(row, col)",
    "explanation": "這裡共執行 2 × 3 次 print。外層固定 row 時，內層遍歷三個 col。",
    "pitfall": "要在每行末尾換行時，換行敘述應在內層外、外層內。"
  },
  "c4-break": {
    "concept": "break 立即結束所在的最內層迴圈。",
    "syntax": "if 停止條件:\n    break",
    "example": "for n in range(1, 8):\n    if n == 4:\n        break\n    print(n)  # 依序印 1、2、3",
    "explanation": "遇到 4 時跳離迴圈，因此本輪後面的 print 與往後所有輪次都不執行。",
    "pitfall": "巢狀迴圈的 break 只離開一層，不會直接離開所有迴圈。"
  },
  "c4-continue": {
    "concept": "continue 跳過這一輪剩下的敘述，進入下一輪。",
    "syntax": "if 跳過條件:\n    continue",
    "example": "for n in range(4):\n    if n == 2:\n        continue\n    print(n)  # 0、1、3",
    "explanation": "n 為 2 時跳過 print，但迴圈仍繼續到 3。break 則會結束整個迴圈。",
    "pitfall": "while 中若在更新控制變數之前 continue，可能造成無窮迴圈。"
  },
  "c4-while": {
    "concept": "while 在每輪開始前檢查條件，條件為真就繼續。",
    "syntax": "while 條件:\n    更新狀態",
    "example": "fuel = 3\nwhile fuel > 0:\n    print(fuel)\n    fuel -= 1",
    "explanation": "每輪減少燃料，最後變成 0，下一次檢查才停止。若一開始條件為假，區塊一次也不執行。",
    "pitfall": "必須讓控制條件有機會改變，避免無限執行。"
  },
  "c4-boss": {
    "concept": "當多個條件重疊時，應先處理最具體的組合情況。",
    "syntax": "if 同時符合: ...\nelif 條件一: ...\nelif 條件二: ...",
    "example": "n = 12\nif n % 2 == 0 and n % 3 == 0:\n    print(\"同時整除\")\nelif n % 2 == 0:\n    print(\"只符合第一項\")",
    "explanation": "12 同時符合兩個條件，若先處理較寬鬆的條件，組合分支就無法到達。",
    "pitfall": "FizzBuzz 中同時被 3 和 5 整除的情況，要放在單獨條件之前。"
  },
  "c4-iterator": {
    "concept": "range 可以重新走訪，但 iter(range(...)) 取得的迭代器會記住進度。走到結尾後，再次讀取只會得到空資料。",
    "syntax": "it = iter(data)；next(it)；list(it)",
    "example": "it = iter(range(4, 7))\nprint(next(it))  # 4\nprint(list(it))  # [5, 6]\nprint(list(it))  # []",
    "explanation": "迭代器保存目前位置。list 也會往後消耗元素，直到資料結束。",
    "pitfall": "耗盡後 next(it) 會拋 StopIteration；重新走訪需建立新的迭代器。"
  },
  "c4-enumerate": {
    "concept": "enumerate 同時提供編號與元素；start=1 只改變編號的起點，不會跳過第一個元素。",
    "syntax": "for index, value in enumerate(data, start=1): ...",
    "example": "for index, value in enumerate([\"Sun\", \"Moon\"], start=1):\n    print(index, value)",
    "explanation": "enumerate 包裝原資料，額外提供遞增編號；它不會改變原資料的取值起點。",
    "pitfall": "start 不代表原串列索引，也不會略過元素。"
  },
  "c4-zip": {
    "concept": "zip 把資料逐項配對，預設以最短的一邊為準，而且回傳的是只能消耗一次的迭代器。",
    "syntax": "zip(left, right) → 逐項配對",
    "example": "pairs = zip([\"x\", \"y\", \"z\"], [1, 2])\nprint(list(pairs))  # [('x', 1), ('y', 2)]\nprint(list(pairs))  # []",
    "explanation": "預設配對到最短一邊結束；zip 物件也是迭代器，讀完便耗盡。",
    "pitfall": "若需求是長度必須相等，可用 zip(..., strict=True) 偵測不匹配，而不是默默接受少資料。"
  },
  "c4-loop-else": {
    "concept": "迴圈的 else 在正常走完時執行，遇到 break 就不執行。即使一開始就是空串列，沒有發生 break，也會進入 else。",
    "syntax": "for ...:\n    if 找到: break\nelse:\n    沒有找到",
    "example": "for n in range(3):\n    if n == 9:\n        break\nelse:\n    print(\"走完也沒找到\")",
    "explanation": "else 的判準是迴圈有沒有被 break 中止；正常耗盡（含空資料）會進入 else。",
    "pitfall": "else 與 for 對齊，不是與內層 if 對齊。"
  }
};
