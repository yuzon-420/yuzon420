// 第 5 章:串列與元組
export const CH5 = {
  num: 5,
  emoji: "📦",
  title: "串列星系",
  subtitle: "串列宣告與存取、迴圈讀取、搜尋、增刪、排序、元組",
  levels: [
    {
      id: "c5-create",
      planet: "📦",
      title: "貨艙開箱",
      topic: "串列宣告與存取",
      story: "串列(List)是一排收納格,用索引取物——注意索引從 0 開始,-1 是最後一格!",
      instructions: [
        "建立 <code>scores = [80, 95, 70]</code>",
        "印出第一個元素 <code>scores[0]</code>",
        "印出最後一個元素 <code>scores[-1]</code>",
      ],
      starter: "# 建立 scores 串列並取出頭尾\n",
      hint: "scores[0] 是 80,scores[-1] 是 70(-1 代表倒數第一個)。",
      xp: 40,
      tests: [
        { name: "scores 正確", code: 'assert ns.get("scores") == [80, 95, 70], "scores 要是 [80, 95, 70]"' },
        { name: "印出頭尾", code: 'assert "80" in output and "70" in output, "要印出 scores[0] 和 scores[-1]"' },
      ],
    },
    {
      id: "c5-forin",
      planet: "👥",
      title: "隊員點名",
      topic: "for…in 讀取串列",
      story: "出發前要點名!用 for 迴圈把每位隊員逐一叫出來。",
      instructions: [
        "已有隊員串列 <code>crew</code>",
        "用 <code>for</code> 迴圈搭配 f-string,每行印出 <code>隊員:名字</code>",
      ],
      starter: 'crew = ["艾達", "小圖", "波波"]\n\n# for 變數 in 串列\n',
      hint: 'for member in crew: 底下 print(f"隊員:{member}")。',
      xp: 40,
      tests: [
        { name: "有使用 for…in", code: 'assert "for" in src and " in " in src, "要用 for…in 讀取串列"' },
        { name: "點名完整", code: 'assert [l.strip() for l in output.strip().splitlines()] == ["隊員:艾達", "隊員:小圖", "隊員:波波"], "三位隊員都要以 隊員:名字 格式印出"' },
      ],
    },
    {
      id: "c5-search",
      planet: "🔎",
      title: "搜尋與計次",
      topic: "index() 與 count()",
      story: "在訊號紀錄裡找出目標的位置,並統計某個數值出現幾次。",
      instructions: [
        "已有 <code>nums = [5, 3, 8, 3, 3]</code>",
        "建立 <code>idx = nums.index(8)</code>(8 的位置)",
        "建立 <code>cnt = nums.count(3)</code>(3 出現幾次)",
        "印出兩個結果",
      ],
      starter: "nums = [5, 3, 8, 3, 3]\n\n# 完成 idx 和 cnt 並印出\n",
      hint: "index() 回傳第一次出現的索引;count() 回傳出現次數。",
      xp: 40,
      tests: [
        { name: "idx == 2", code: 'assert ns.get("idx") == 2, "8 在索引 2 的位置(從 0 算起)"' },
        { name: "cnt == 3", code: 'assert ns.get("cnt") == 3, "3 出現了 3 次"' },
      ],
    },
    {
      id: "c5-append",
      planet: "📥",
      title: "裝貨作業",
      topic: "append() 與 insert()",
      story: "append 把貨物放到最後面,insert 可以插隊放到指定位置。",
      instructions: [
        "已有 <code>todo = [\"檢查引擎\"]</code>",
        "用 <code>append()</code> 加入 <code>\"補充燃料\"</code>",
        "用 <code>insert(0, ...)</code> 把 <code>\"穿太空衣\"</code> 插到最前面",
        "印出最後的 todo",
      ],
      starter: 'todo = ["檢查引擎"]\n\n# append 和 insert\n',
      hint: 'todo.append("補充燃料") 加到尾端;todo.insert(0, "穿太空衣") 插到索引 0。',
      xp: 40,
      tests: [
        { name: "有使用 append 和 insert", code: 'assert ".append(" in src and ".insert(" in src, "兩個方法都要用到"' },
        { name: "順序正確", code: 'assert ns.get("todo") == ["穿太空衣", "檢查引擎", "補充燃料"], "最後順序:穿太空衣、檢查引擎、補充燃料"' },
      ],
    },
    {
      "id": "c5-alias",
      "planet": "🪞",
      "title": "兩個名字一個貨艙",
      "topic": "賦值不是複製：is 與 ==",
      "story": "把串列指定給另一個變數，只是替同一個物件多取一個名字。內容相等與是否為同一個物件，是兩個不同問題。",
      "instructions": [
        "保留 <code>cargo = [\"氧氣\"]</code>，建立指向它的 <code>alias</code>，再建立內容相同但獨立的 <code>snapshot</code>。",
        "透過 alias 加入 <code>\"水\"</code>；cargo 應一起改變，snapshot 應保持 <code>[\"氧氣\"]</code>。"
      ],
      "starter": "cargo = [\"氧氣\"]\n\n# 建立 alias、snapshot，再透過 alias 加入水\n",
      "hint": "alias = cargo 共用同一物件；snapshot = cargo.copy() 建立新的外層串列。用 is 檢查身分，用 == 檢查內容。",
      "xp": 80,
      "tests": [
        {
          "name": "別名共用物件",
          "code": "assert ns.get(\"alias\") is ns.get(\"cargo\") and ns.get(\"cargo\") == [\"氧氣\", \"水\"], \"alias 必須就是 cargo，加入水後兩者一起改變\""
        },
        {
          "name": "快照獨立",
          "code": "assert ns.get(\"snapshot\") == [\"氧氣\"] and ns[\"snapshot\"] is not ns[\"cargo\"], \"snapshot 要在加入水之前複製，且不能只是另一個別名\""
        }
      ]
    },
    {
      "id": "c5-shallow",
      "planet": "📋",
      "title": "只複製了外殼",
      "topic": "淺拷貝仍共用內層物件",
      "story": "list.copy() 建立新外殼，裡面的物件參照仍然共用。因此修改內層會互相影響，新增外層元素卻不會。",
      "instructions": [
        "保留 <code>original = [[1, 2], [3, 4]]</code>，建立淺拷貝 <code>copied</code>。",
        "執行 <code>copied[0].append(9)</code>，再執行 <code>copied.append([5, 6])</code>。",
        "最後 original 應為 <code>[[1, 2, 9], [3, 4]]</code>，copied 則多出第三列。"
      ],
      "starter": "original = [[1, 2], [3, 4]]\n\n# 建立淺拷貝，再執行兩個 append\n",
      "hint": "copied = original.copy() 只複製最外層；copied is not original，但 copied[0] is original[0]。",
      "xp": 90,
      "tests": [
        {
          "name": "外層獨立",
          "code": "assert ns.get(\"copied\") == [[1, 2, 9], [3, 4], [5, 6]], \"copied 第一列要加入 9，外層要加入第三列\"\nassert ns.get(\"original\") == [[1, 2, 9], [3, 4]], \"original 會看到內層的 9，但不會多出第三列\"\nassert ns[\"copied\"] is not ns[\"original\"], \"外層必須是新串列\""
        },
        {
          "name": "內層共用",
          "code": "assert ns[\"copied\"][0] is ns[\"original\"][0] and ns[\"copied\"][1] is ns[\"original\"][1], \"淺拷貝的兩個內層串列都應沿用原參照\""
        }
      ]
    },
    {
      "id": "c5-deep",
      "planet": "🛡️",
      "title": "真正隔離的路線",
      "topic": "copy.deepcopy() 複製巢狀資料",
      "story": "任務路線是串列裡還有串列的巢狀資料。只複製第一層，測試船修改路線時仍可能污染正式船。",
      "instructions": [
        "<code>import copy</code> 載入 Python 內建的拷貝工具；用 <code>copy.deepcopy(routes)</code> 建立 <code>cloned</code>。",
        "在 <code>cloned[0][1]</code> 加入 <code>\"Europa\"</code>，原 routes 應保持不變。"
      ],
      "starter": "import copy\n\nroutes = [[\"Earth\", [\"Moon\"]], [\"Mars\", [\"Phobos\"]]]\n\n# 建立 cloned，再修改副本的第一條路線\n",
      "hint": "cloned = copy.deepcopy(routes)。淺拷貝只複製外殼，deepcopy 則會遞迴複製這些內層串列。",
      "xp": 100,
      "tests": [
        {
          "name": "深層修改互不干擾",
          "code": "assert ns.get(\"routes\") == [[\"Earth\", [\"Moon\"]], [\"Mars\", [\"Phobos\"]]], \"原路線不應跟著改變\"\nassert ns.get(\"cloned\") == [[\"Earth\", [\"Moon\", \"Europa\"]], [\"Mars\", [\"Phobos\"]]], \"副本的第一條路線要加入 Europa\"\nassert ns[\"cloned\"] is not ns[\"routes\"] and all(ns[\"cloned\"][i] is not ns[\"routes\"][i] and ns[\"cloned\"][i][1] is not ns[\"routes\"][i][1] for i in range(2)), \"兩條路線的每層串列都應獨立\""
        }
      ]
    },
    {
      "id": "c5-repeat",
      "planet": "🧱",
      "title": "同步變色的座位",
      "topic": "二維串列乘法的參照陷阱",
      "story": "[[0] * cols] * rows 只是重複同一列的參照。一個座位被修改，其他列的同位置也會跟著變！",
      "instructions": [
        "修正 grid 的建立方式，使它有 rows 列、每列 cols 個 0，每一列都是獨立串列。",
        "可用迴圈每次 append 新的一列，或使用 <code>[[0] * cols for _ in range(rows)]</code> 這種串列生成式。",
        "再執行 <code>grid[0][1] = 9</code>，其他列應保持全 0。"
      ],
      "starter": "rows = 3\ncols = 2\n\n# 修正共用列的問題，再修改第一列第二格\ngrid = [[0] * cols] * rows\n",
      "hint": "用 [[0] * cols for _ in range(rows)]，讓每次迴圈都建立新的一列。整數 0 不可變，所以單列內的 [0] * cols 沒有同樣問題。",
      "xp": 90,
      "tests": [
        {
          "name": "只有一個座位變色",
          "code": "assert ns.get(\"grid\") == [[0, 9], [0, 0], [0, 0]], \"重複列的參照會讓三列一起改變\"\nassert len({id(row) for row in ns[\"grid\"]}) == 3, \"每一列都要是不同的串列\""
        }
      ]
    },
    {
      "id": "c5-deep-shared",
      "planet": "🕸️",
      "title": "深拷貝也保留關係",
      "topic": "deepcopy 保留副本內部的共享參照",
      "story": "deepcopy 不等於把每次出現的物件都拆成不同副本。同一物件被引用兩次時，複製後通常仍共用同一份新物件，只是不再連到原物件。",
      "instructions": [
        "保留起始的 shared 與 original，使用 <code>copy.deepcopy(original)</code> 建立 cloned。",
        "透過 <code>cloned[0].append(\"B\")</code> 修改副本。",
        "cloned 兩項都應變成 <code>[\"A\", \"B\"]</code>，且仍指向同一物件；original 兩項都應維持 <code>[\"A\"]</code>。"
      ],
      "starter": "import copy\n\nshared = [\"A\"]\noriginal = [shared, shared]\n\n# 建立 cloned 並修改 cloned[0]\n",
      "hint": "deepcopy 使用 memo 記住已複製的物件。cloned[0] is cloned[1] 應為 True，但 cloned[0] is shared 為 False。",
      "xp": 110,
      "tests": [
        {
          "name": "隔離原資料",
          "code": "assert ns.get(\"original\") == [[\"A\"], [\"A\"]] and ns.get(\"shared\") == [\"A\"], \"修改副本不能影響 original 或 shared\"\nassert ns[\"original\"][0] is ns[\"shared\"] and ns[\"original\"][1] is ns[\"shared\"], \"保留 original 兩項對 shared 的參照\""
        },
        {
          "name": "副本保留內部共享",
          "code": "assert ns.get(\"cloned\") == [[\"A\", \"B\"], [\"A\", \"B\"]], \"修改 cloned[0] 後，第二項也會看到 B\"\nassert ns[\"cloned\"][0] is ns[\"cloned\"][1], \"deepcopy 會保留內部共享關係\"\nassert ns[\"cloned\"][0] is not ns[\"shared\"], \"副本內部不能再指向原本的 shared\""
        }
      ]
    },
    {
      id: "c5-remove",
      planet: "🗑️",
      title: "卸貨作業",
      topic: "remove() 與 pop()",
      story: "remove 依「值」刪除第一個符合的項目;pop 依「位置」取出項目(預設最後一個)。",
      instructions: [
        "已有 <code>items = [\"地圖\", \"故障零件\", \"羅盤\", \"故障零件\"]</code>",
        "用 <code>remove()</code> 刪除第一個 <code>\"故障零件\"</code>",
        "用 <code>last = items.pop()</code> 取出最後一項",
        "印出 items 和 last",
      ],
      starter: 'items = ["地圖", "故障零件", "羅盤", "故障零件"]\n\n# remove 和 pop\n',
      hint: 'items.remove("故障零件") 只刪第一個;items.pop() 取出並回傳最後一項。',
      xp: 50,
      tests: [
        { name: "items 剩下正確項目", code: 'assert ns.get("items") == ["地圖", "羅盤"], "刪掉一個故障零件、pop 掉另一個後,應剩 [地圖, 羅盤]"' },
        { name: "last 是故障零件", code: 'assert ns.get("last") == "故障零件", "pop() 取出的最後一項是 故障零件"' },
      ],
    },
    {
      "id": "c5-slice-assign",
      "planet": "🧪",
      "title": "保留貨艙的身分",
      "topic": "切片賦值與重新綁定",
      "story": "items = 新串列 只會讓這個名字指向新物件；items[:] = 新內容 則修改原物件，所有別名都會看見更新。",
      "instructions": [
        "保留 items 與 alias 的起始設定，把 items 的內容原地換成 <code>[8, 9]</code>。",
        "使用 <code>items[:] = ...</code>，讓 alias 同步看到新內容且仍是同一個串列。"
      ],
      "starter": "items = [1, 2, 3]\nalias = items\n\n# 原地替換全部內容\n",
      "hint": "items[:] = [8, 9]。切片 [:] 代表整個範圍，放在等號左邊可以替換內容而不更換容器。",
      "xp": 80,
      "tests": [
        {
          "name": "內容與物件身分",
          "code": "assert ns.get(\"items\") == [8, 9] and ns.get(\"alias\") == [8, 9], \"兩個名字都應看到更新內容\"\nassert ns[\"items\"] is ns[\"alias\"], \"不能讓 items 指向另一個串列\""
        }
      ]
    },
    {
      id: "c5-sort",
      planet: "📶",
      title: "排序天線陣",
      topic: "sort() 與 reverse()",
      story: "sort() 由小到大排;接著 reverse() 反轉,就變成由大到小!",
      instructions: [
        "已有 <code>scores = [75, 92, 60, 88]</code>",
        "先 <code>sort()</code> 再 <code>reverse()</code>,讓 scores 變成由大到小",
        "印出 scores",
      ],
      starter: "scores = [75, 92, 60, 88]\n\n# sort 之後 reverse\n",
      hint: "scores.sort() → [60,75,88,92];scores.reverse() → [92,88,75,60]。這兩個方法會直接改變原串列。",
      xp: 50,
      tests: [
        { name: "有使用 sort 和 reverse", code: 'assert ".sort(" in src and ".reverse(" in src, "要用 sort() 和 reverse() 兩個方法"' },
        { name: "由大到小", code: 'assert ns.get("scores") == [92, 88, 75, 60], "最後應該是 [92, 88, 75, 60]"' },
      ],
    },
    {
      "id": "c5-sort-return",
      "planet": "🧪",
      "title": "排好了卻拿到 None",
      "topic": "list.sort() 的回傳值",
      "story": "sort() 直接修改串列，回傳值是 None。把它的回傳值當成排好的串列，是常見的錯誤。",
      "instructions": [
        "保留 nums 的初始內容，執行 <code>result = nums.sort()</code>。",
        "建立 <code>is_none = result is None</code>，確認 nums 已排序，result 並不是排好的串列。"
      ],
      "starter": "nums = [3, 1, 2]\n\n# 呼叫 sort 並觀察 result\n",
      "hint": "nums 會變成 [1, 2, 3]，result 是 None。要保留原串列並取得排序副本，可在下一題學 sorted()。",
      "xp": 80,
      "tests": [
        {
          "name": "原地排序與回傳值",
          "code": "assert ns.get(\"nums\") == [1, 2, 3], \"sort 會改變原串列\"\nassert \"result\" in ns and ns[\"result\"] is None and ns.get(\"is_none\") is True, \"sort 的回傳值是 None，不是串列\""
        }
      ]
    },
    {
      id: "c5-sorted",
      planet: "🧬",
      title: "sorted 複製排序",
      topic: "sorted() 函式",
      story: "sort() 會改變原本的串列,sorted() 則是產生排好的新串列、原本的完好如初。",
      instructions: [
        "已有 <code>data = [9, 1, 7]</code>",
        "建立 <code>ranked = sorted(data)</code>",
        "印出 data 和 ranked,確認原串列沒變",
      ],
      starter: "data = [9, 1, 7]\n\n# 用 sorted() 產生新串列\n",
      hint: "ranked = sorted(data) — 注意是 sorted(data) 而不是 data.sort()。",
      xp: 50,
      tests: [
        { name: "有使用 sorted()", code: 'assert "sorted(" in src, "要用 sorted() 函式"' },
        { name: "ranked 排好了", code: 'assert ns.get("ranked") == [1, 7, 9], "ranked 應該是 [1, 7, 9]"' },
        { name: "data 保持原樣", code: 'assert ns.get("data") == [9, 1, 7], "sorted() 不會改變原串列,data 應該還是 [9, 1, 7]"' },
      ],
    },
    {
      id: "c5-tuple",
      planet: "🔒",
      title: "元組保險箱",
      topic: "元組 Tuple",
      story: "元組不能增刪或替換自己的元素；若要產生不同內容，可先轉成串列再轉回元組。內層物件是否可變，下一題會進一步實驗。",
      instructions: [
        "建立元組 <code>point = (3, 4)</code>",
        "轉成串列 <code>lst = list(point)</code>,用 append 加入 <code>5</code>",
        "轉回元組 <code>tp = tuple(lst)</code>,印出 tp",
      ],
      starter: "# 元組 → 串列 → 修改 → 元組\n",
      hint: "point = (3, 4) 用小括號;list() 和 tuple() 可以互相轉換。",
      xp: 50,
      tests: [
        { name: "point 是元組", code: 'assert ns.get("point") == (3, 4) and isinstance(ns.get("point"), tuple), "point 要是元組 (3, 4)"' },
        { name: "tp 轉換正確", code: 'assert ns.get("tp") == (3, 4, 5) and isinstance(ns.get("tp"), tuple), "tp 應該是元組 (3, 4, 5)"' },
      ],
    },
    {
      "id": "c5-tuple-inner",
      "planet": "🔐",
      "title": "保險箱裡的可變貨物",
      "topic": "元組不可變，不代表內層物件不可變",
      "story": "tuple 固定的是每格指向的物件，並不會把裡面的串列一起凍結。要固定內層的這份字串名單，可以另外將它轉成 tuple。",
      "instructions": [
        "保留 <code>manifest = ([\"氧氣\"], \"A1\")</code>。",
        "在 manifest 裡的串列加入 <code>\"水\"</code>，不要重建 manifest。",
        "把第一格的串列轉成元組，存入 <code>inner</code>，內容應為 <code>(\"氧氣\", \"水\")</code>。"
      ],
      "starter": "manifest = ([\"氧氣\"], \"A1\")\noriginal_manifest = manifest\n\n# 修改內層串列，再轉成 inner 元組\n",
      "hint": "manifest[0].append(\"水\") 沒有替換 tuple 的元素。inner = tuple(manifest[0]) 會另外產生元組。",
      "xp": 100,
      "tests": [
        {
          "name": "元組內層可以修改",
          "code": "assert ns.get(\"manifest\") == ([\"氧氣\", \"水\"], \"A1\"), \"只修改第一格裡的串列\"\nassert ns[\"manifest\"] is ns.get(\"original_manifest\"), \"不要重建元組；直接修改裡面的串列\""
        },
        {
          "name": "內層轉換",
          "code": "assert ns.get(\"inner\") == (\"氧氣\", \"水\"), \"將第一格的串列轉成 tuple\""
        }
      ]
    },
  ],
};
