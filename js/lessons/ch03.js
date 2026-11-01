// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_3 = {
  "c3-indent": {
    "concept": "Python 用縮排界定程式區塊，同一層的敘述屬於同一區塊。",
    "syntax": "if 條件:\n    區塊內敘述",
    "example": "if True:\n    print(\"區塊內\")\nprint(\"區塊外\")",
    "explanation": "冒號開啟區塊；縮排結束就回到外層。最後一行不受 if 條件控制。",
    "pitfall": "建議每層四個空格，避免混用 tab 與空格。"
  },
  "c3-if": {
    "concept": "if 只在條件的真值為真時執行縮排區塊。",
    "syntax": "if 條件:\n    動作",
    "example": "fuel = 8\nif fuel < 10:\n    print(\"補充燃料\")",
    "explanation": "fuel < 10 為 True，所以執行 print。若條件為 False，直接跳過整個區塊。",
    "pitfall": "if 的條件不一定是比較式；0、空字串、None 等也有假值。"
  },
  "c3-ifelse": {
    "concept": "if-else 依條件選擇其中一條路徑。",
    "syntax": "if 條件: ...\nelse: ...",
    "example": "def access(code):\n    if code == \"open\":\n        return \"通過\"\n    else:\n        return \"拒絕\"\nprint(access(\"open\"))",
    "explanation": "這裡先借用函式框架方便測試：def 定義流程，參數接收資料，return 把結果傳回且結束本次呼叫。完整函式觀念在第 7 章展開。",
    "pitfall": "else 不接條件，並且要與對應的 if 對齊；return 與 print 用途不同。"
  },
  "c3-elif": {
    "concept": "if-elif-else 從上到下，只執行第一個成立的分支。",
    "syntax": "if 條件一: ...\nelif 條件二: ...\nelse: ...",
    "example": "score = 85\nif score >= 80:\n    print(\"高分\")\nelif score >= 60:\n    print(\"及格\")\nelse:\n    print(\"再練習\")",
    "explanation": "85 同時符合前兩個範圍，但第一個分支已成立，所以後面不再檢查。",
    "pitfall": "較嚴格的高分門檻要放前面；多個獨立 if 可能執行多個分支。"
  },
  "c3-nested": {
    "concept": "巢狀判斷是在某條路徑中繼續做下一層決策。",
    "syntax": "外層 if 區塊中再放 if",
    "example": "has_ticket = True\nis_vip = False\nif has_ticket:\n    if is_vip:\n        print(\"VIP 入口\")\n    else:\n        print(\"一般入口\")",
    "explanation": "內層只有在外層成立時才會執行；else 的縮排決定它配對哪個 if。",
    "pitfall": "先畫出兩層問題的順序，避免把內層 else 對到外層 if。"
  },
  "c3-text-bool": {
    "concept": "bool() 判斷字串是否為空，不會把文字 False 解析成布林值。讀取文字設定時要明確比較內容。",
    "syntax": "bool(text)；text.strip().lower() == \"true\"",
    "example": "print(bool(\"0\"))       # True\nprint(bool(\"\"))        # False\nprint(\" TRUE \".strip().lower() == \"true\")",
    "explanation": "字串的真值取決於是否為空，與其中的詞語意思無關。文字設定需要額外解析規則。",
    "pitfall": "bool(\"False\") 不等於 False。"
  },
  "c3-none-default": {
    "concept": "x or 預設值 會把 0、空字串、False 都當成要替換的值。如果 0 代表合法數量，只應在 x is None 時補預設值。",
    "syntax": "if value is None: 使用預設值",
    "example": "value = 0\nprint(value or 5)  # 5\nprint(value is None)  # False",
    "explanation": "or 遇到假值就選右側運算元；is None 只匹配代表缺值的 None。",
    "pitfall": "0、空字串與 False 可能都是有效資料，不應一律被預設值覆蓋。"
  },
  "c3-short-circuit": {
    "concept": "and 由左到右檢查，左邊是假就不計算右邊。把危險運算放在保護條件後面，就能避免除以零。",
    "syntax": "保護條件 and 危險運算",
    "example": "denominator = 0\nsafe = denominator != 0 and 8 / denominator > 1\nprint(safe)  # False",
    "explanation": "左側已為假，整個 and 不可能為真，因此 Python 不再計算右側。",
    "pitfall": "交換兩個條件可能改變副作用，甚至引發原本可避免的例外。"
  },
  "c3-chain": {
    "concept": "Python 可以把兩次比較連在一起：0 <= value < 100 表示 value 同時符合左右兩個條件，不是先把 True 或 False 拿去和 100 比。",
    "syntax": "lower <= value < upper",
    "example": "value = 5\nprint(1 <= value < 8)  # True\nprint((1 <= value) < 8)  # 這是不同的比較！",
    "explanation": "連鎖比較共享中間值，等同把兩次比較用 and 連接；中間運算式只求值一次。",
    "pitfall": "包含下界與是否包含上界需分別決定。"
  }
};
