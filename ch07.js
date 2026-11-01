// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_7 = {
  "c7-def": {
    "concept": "函式將流程封裝成可以反覆呼叫的單位，參數是輸入，return 是輸出。",
    "syntax": "def name(parameters):\n    return result",
    "example": "def double(value):\n    return value * 2\n\nanswer = double(6)\nprint(answer)  # 12",
    "explanation": "執行 def 是建立函式；直到呼叫 double(6) 才執行內部計算。return 結束當次呼叫並交回結果。",
    "pitfall": "只 print 不 return 的函式，回傳值仍是 None。"
  },
  "c7-default": {
    "concept": "有預設值的參數可以省略，也可以在呼叫時覆蓋。",
    "syntax": "def name(required, optional=value): ...",
    "example": "def label(name, role=\"隊員\"):\n    return f\"{role}:{name}\"\nprint(label(\"Ada\"))\nprint(label(\"Lin\", role=\"技師\"))",
    "explanation": "省略 role 時使用定義時保存的值。一般情況下，沒有預設值的參數要排在有預設值的參數前面。",
    "pitfall": "預設值在定義時求值一次；下一題會處理把 [] 當預設值時的共用問題。"
  },
  "c7-scope": {
    "concept": "函式內賦值通常建立或重新綁定區域名稱；它與外部同名變數是不同的綁定。",
    "syntax": "用 return 傳出結果，再於外部賦值",
    "example": "fuel = 10\ndef increase(value):\n    value += 5\n    return value\nfuel = increase(fuel)\nprint(fuel)  # 15",
    "explanation": "整數不可變，函式內的 value += 5 不會直接改變外面的 fuel；外層接住回傳值才更新。",
    "pitfall": "這不代表函式無法影響外部物件；對傳入串列原地修改，外部仍看得到。"
  },
  "c7-numfunc": {
    "concept": "內建函式可對數值集合求極值、總和與取近似值。",
    "syntax": "max(data)、min(data)、sum(data)、round(value, digits)",
    "example": "data = [2, 4, 9]\nprint(min(data), max(data), sum(data))\nprint(round(2.5), round(3.5))  # 2 4",
    "explanation": "round 在恰好位於兩個候選值中間時，採取最接近的偶數，不是所有 .5 都向上進位；二進位浮點誤差也會影響是否剛好一半。",
    "pitfall": "max、min 對空資料需要另外處理；格式化小數顯示與數值取近似值是不同目的。"
  },
  "c7-split": {
    "concept": "split 把文字切成串列，join 則用指定分隔符接回文字。",
    "syntax": "text.split(separator)；separator.join(parts)",
    "example": "parts = \"A,,B\".split(\",\")\nprint(parts)          # ['A', '', 'B']\nprint(\"/\".join(parts)) # A//B",
    "explanation": "明確指定分隔符時，相鄰的分隔符中間會留下空字串。join 把每個元素之間插入分隔符。",
    "pitfall": "join 的元素必須都是字串；split() 不帶參數時按空白切分，規則與 split(\" \") 不同。"
  },
  "c7-replace": {
    "concept": "find 尋找第一個匹配位置，replace 產生完成取代的新字串。",
    "syntax": "text.find(part)；text.replace(old, new)",
    "example": "text = \"moon moon\"\nprint(text.find(\"moon\"))        # 0\nprint(text.find(\"sun\"))         # -1\nprint(text.replace(\"moon\", \"star\"))",
    "explanation": "find 找不到時回傳 -1；replace 預設替換所有符合位置，原 text 不會被修改。",
    "pitfall": "不要用 if text.find(...) 判斷找到與否：索引 0 是假值，-1 反而是真值。"
  },
  "c7-random": {
    "concept": "random 是 Python 標準函式庫的偽亂數模組，import 後即可使用。",
    "syntax": "import random；random.randint(a, b)",
    "example": "import random\nvalue = random.randint(2, 4)\nprint(2 <= value <= 4)  # True",
    "explanation": "randint 的上下界都包含，因此這裡可能得到 2、3 或 4；它的邊界規則與 range 不同。",
    "pitfall": "多次亂數有可能重複，不是每次都必須不同；random 不適合產生安全密碼。"
  },
  "c7-mutable-default": {
    "concept": "預設參數在 def 執行時建立，不會在每次呼叫時重建。把 [] 當預設值，可能讓多次呼叫共用同一份任務清單。",
    "syntax": "def f(value, items=None):\n    if items is None: items = []",
    "example": "def collect(value, items=None):\n    if items is None:\n        items = []\n    items.append(value)\n    return items\nprint(collect(1), collect(2))  # [1] [2]",
    "explanation": "None 作為缺省訊號，在函式每次執行時才建立新串列。明確傳入串列時則保留原物件。",
    "pitfall": "不要用 items or []，它會把呼叫者傳入的空串列替換掉。"
  },
  "c7-rebind": {
    "concept": "參數是指向物件的區域名稱。items = [] 只換掉區域名稱的綁定，items.clear() 才會清空呼叫者傳進來的串列。",
    "syntax": "原地修改：items.clear()；重新綁定：items = []",
    "example": "def clear(items):\n    items.clear()\nitems = [3]\nclear(items)\nprint(items)  # []",
    "explanation": "呼叫時傳入的是物件參照；區域名稱與外層名稱可以同時指向同一串列。修改物件會反映到所有別名。",
    "pitfall": "參數 = 新物件 只改區域綁定，不能藉此讓呼叫者的名稱也指向新物件。"
  },
  "c7-closure": {
    "concept": "lambda 建立小函式；若它讀取外層變數，通常會在呼叫時才讀取當時的值。迴圈結束後 i 已是最後一個數字，因此所有按鈕可能得到相同結果。",
    "syntax": "lambda captured=value: captured",
    "example": "buttons = []\nfor n in range(4, 6):\n    buttons.append(lambda n=n: n)\nprint([button() for button in buttons])  # [4, 5]",
    "explanation": "一般閉包在呼叫時查詢外層名稱。預設參數在建立函式時求值，可保存當圈的整數。",
    "pitfall": "保存可變物件的參照不等於拷貝；物件內容之後仍可能改變。"
  },
  "c7-generator": {
    "concept": "函式內有 yield 時，呼叫它會先得到生成器物件；函式內容要等 next() 或迴圈取值時才執行。yield 會暫停，下一次取值再繼續。",
    "syntax": "yield value 暫停；next(generator) 繼續",
    "example": "def countdown():\n    print(\"開始\")\n    yield 2\n    print(\"繼續\")\n    yield 1\nstream = countdown()\nprint(\"尚未取值\")\nprint(next(stream))",
    "explanation": "建立生成器時還未執行函式本體；第一次 next 才開始，遇到 yield 回傳一個值並保存執行位置。",
    "pitfall": "return 結束生成器；yield 則暫停並可繼續，兩者不是替代寫法。"
  }
};
