// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_5 = {
  "c5-create": {
    "concept": "串列依順序存放元素，可以用索引取得特定位置。",
    "syntax": "items = [值, 值]；items[index]",
    "example": "items = [\"map\", \"food\", \"radio\"]\nprint(items[0])   # map\nprint(items[-1])  # radio",
    "explanation": "索引從 0 開始；負索引從尾端往前計算，所以 -1 是最後一項。",
    "pitfall": "長度為 3 的串列沒有索引 3；越界會出現 IndexError。"
  },
  "c5-forin": {
    "concept": "直接遍歷串列會取得元素本身，不必手動管理索引。",
    "syntax": "for value in items: ...",
    "example": "for name in [\"Ada\", \"Lin\"]:\n    print(f\"歡迎 {name}\")",
    "explanation": "每一輪 name 指向目前的字串，因此可直接放進 f-string。",
    "pitfall": "當需要位置與元素時可用 enumerate；只需要元素時直接 for-in 即可。"
  },
  "c5-search": {
    "concept": "index 回報第一個匹配位置，count 回報符合值的數量。",
    "syntax": "items.index(value)；items.count(value)",
    "example": "items = [4, 8, 4]\nprint(items.index(4))  # 0\nprint(items.count(4))  # 2",
    "explanation": "index 找到第一次出現就停止；count 則統計整個串列。",
    "pitfall": "找不到時 index 會拋 ValueError，count 則回傳 0。"
  },
  "c5-append": {
    "concept": "append 在尾端加入一個物件；insert 在指定位置前插入。",
    "syntax": "items.append(value)；items.insert(index, value)",
    "example": "items = [2, 3]\nitems.append(4)\nitems.insert(0, 1)\nprint(items)  # [1, 2, 3, 4]",
    "explanation": "這些方法直接改變原串列，不需要重新指定 items。下一組題目會觀察別名與拷貝在修改時的差異。",
    "pitfall": "append([5, 6]) 加入的是一個內層串列，不是兩個獨立元素。"
  },
  "c5-remove": {
    "concept": "remove 按值刪除第一個符合項；pop 按索引刪除並回傳該項。",
    "syntax": "items.remove(value)；value = items.pop(index)",
    "example": "items = [7, 8, 7]\nitems.remove(7)\nlast = items.pop()\nprint(items, last)  # [8] 7",
    "explanation": "remove 只移除第一個 7；pop 未指定索引時取走最後一項，因此能同時取得被刪除的值。",
    "pitfall": "remove 找不到值會出錯；pop 空串列也會出錯。"
  },
  "c5-sort": {
    "concept": "sort 原地排序；reverse 原地反轉目前順序。",
    "syntax": "items.sort()；items.reverse()",
    "example": "items = [3, 1, 2]\nitems.sort()\nitems.reverse()\nprint(items)  # [3, 2, 1]",
    "explanation": "先排成遞增，再反轉就成為遞減。reverse 本身不做大小比較。",
    "pitfall": "這兩個方法回傳 None；不要寫 items = items.sort()。"
  },
  "c5-sorted": {
    "concept": "sorted 回傳新的排序串列，保留輸入物件的原有順序。",
    "syntax": "new_items = sorted(items, reverse=False)",
    "example": "items = [6, 2, 4]\nranked = sorted(items)\nprint(items)   # [6, 2, 4]\nprint(ranked)  # [2, 4, 6]",
    "explanation": "兩個外層串列是不同物件，但 sorted 不會遞迴深拷貝裡面的元素。",
    "pitfall": "sorted 與 list.sort 的差異是是否修改原串列，以及回傳值的型別。"
  },
  "c5-tuple": {
    "concept": "tuple 不允許替換、增刪自己的元素，適合表達一組固定位置的資料。",
    "syntax": "point = (x, y)；single = (x,)",
    "example": "point = (5, 6)\nitems = list(point)\nitems.append(7)\nnew_point = tuple(items)\nprint(point, new_point)",
    "explanation": "轉換建立新的容器，原 point 沒有被修改。tuple 內若放可變物件，那個物件本身仍可變，下一題會實驗。",
    "pitfall": "單元素 tuple 要有逗號：(5,) 才是 tuple，(5) 只是整數。"
  },
  "c5-alias": {
    "concept": "把串列指定給另一個變數，只是替同一個物件多取一個名字。內容相等與是否為同一個物件，是兩個不同問題。",
    "syntax": "alias = items；copied = items.copy()",
    "example": "items = [1]\nalias = items\ncopied = items.copy()\nalias.append(2)\nprint(items, copied)  # [1, 2] [1]",
    "explanation": "賦值只新增名稱與物件的綁定；copy 才建立新的外層容器。is 檢查物件身分，== 檢查內容。",
    "pitfall": "不要依賴小整數或字串的快取來示範 is；用容器更能穩定觀察身分。"
  },
  "c5-shallow": {
    "concept": "list.copy() 建立新外殼，裡面的物件參照仍然共用。因此修改內層會互相影響，新增外層元素卻不會。",
    "syntax": "copied = original.copy()",
    "example": "original = [[0]]\ncopied = original.copy()\ncopied[0].append(1)\nprint(original)  # [[0, 1]]\nprint(copied is original)  # False",
    "explanation": "複製外層只複製其中的參照，並沒有遞迴複製被參照的內層串列。",
    "pitfall": "切片 [:] 和 list(original) 也只是淺拷貝。"
  },
  "c5-deep": {
    "concept": "任務路線是串列裡還有串列的巢狀資料。只複製第一層，測試船修改路線時仍可能污染正式船。",
    "syntax": "import copy；cloned = copy.deepcopy(original)",
    "example": "import copy\noriginal = [[0]]\ncloned = copy.deepcopy(original)\ncloned[0].append(1)\nprint(original, cloned)  # [[0]] [[0, 1]]",
    "explanation": "copy 是標準函式庫；deepcopy 會遞迴處理這裡的巢狀串列，建立隔離的可變容器。",
    "pitfall": "不是所有物件都適合深拷貝；自訂類別可定義拷貝行為，檔案等資源也不等同一般資料。"
  },
  "c5-repeat": {
    "concept": "[[0] * cols] * rows 只是重複同一列的參照。一個座位被修改，其他列的同位置也會跟著變！",
    "syntax": "[新的一列 for _ in range(rows)]",
    "example": "grid = [[0] * 2 for _ in range(2)]\ngrid[0][0] = 7\nprint(grid)  # [[7, 0], [0, 0]]",
    "explanation": "生成式每輪重新建立一列。單純將同一列乘以 rows，只會重複那一列的參照。",
    "pitfall": "不可變整數 0 可以共用，會被修改的內層串列必須獨立。"
  },
  "c5-deep-shared": {
    "concept": "deepcopy 不等於把每次出現的物件都拆成不同副本。同一物件被引用兩次時，複製後通常仍共用同一份新物件，只是不再連到原物件。",
    "syntax": "deepcopy 用 memo 記錄已複製的物件",
    "example": "import copy\nshared = []\ncloned = copy.deepcopy([shared, shared])\nprint(cloned[0] is cloned[1])  # True\nprint(cloned[0] is shared)     # False",
    "explanation": "同一原物件被第二次遇見時，deepcopy 重用已建立的副本，因此保留內部的共享關係。",
    "pitfall": "整體深拷貝與對每個元素分別深拷貝，可能產生不同的參照結構。"
  },
  "c5-tuple-inner": {
    "concept": "tuple 固定的是每格指向的物件，並不會把裡面的串列一起凍結。要固定內層的這份字串名單，可以另外將它轉成 tuple。",
    "syntax": "tuple 固定參照；內層 list 仍可 append",
    "example": "box = ([1], \"A\")\nbox[0].append(2)\nprint(box)  # ([1, 2], 'A')",
    "explanation": "tuple 的第一格仍指向同一串列，改變的是那個串列的內容，因此沒有違反 tuple 的不可變性。",
    "pitfall": "tuple 不代表遞迴凍結所有物件；含 list 的 tuple 也不可雜湊。"
  },
  "c5-sort-return": {
    "concept": "sort() 直接修改串列，回傳值是 None。把它的回傳值當成排好的串列，是常見的錯誤。",
    "syntax": "result = items.sort() → result 是 None",
    "example": "items = [8, 2]\nresult = items.sort()\nprint(items)          # [2, 8]\nprint(result is None) # True",
    "explanation": "sort 透過修改物件交付結果；回傳 None，讓呼叫者區分原地修改與產生新值。",
    "pitfall": "items = items.sort() 會讓 items 指向 None。"
  },
  "c5-slice-assign": {
    "concept": "items = 新串列 只會讓這個名字指向新物件；items[:] = 新內容 則修改原物件，所有別名都會看見更新。",
    "syntax": "items[:] = new_values",
    "example": "items = [2, 4]\nalias = items\nitems[:] = [6]\nprint(alias)  # [6]",
    "explanation": "切片賦值替換原容器範圍內的內容，沒有建立新的外層物件綁定。",
    "pitfall": "items = [6] 只改名稱的指向，不會改到 alias 仍指向的舊串列。"
  }
};
