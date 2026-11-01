// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_2 = {
  "c2-var": {
    "concept": "變數是物件的名字。賦值先計算右邊，再讓左邊名稱指向結果。",
    "syntax": "名稱 = 值",
    "example": "fuel = 20\nfuel = fuel + 5\nprint(fuel)  # 25",
    "explanation": "第二行先讀取原本的 20、加上 5，再讓 fuel 指向 25。= 表示賦值，不是數學上的恆等式。",
    "pitfall": "使用尚未定義的名稱會出現 NameError；文字值要加引號。"
  },
  "c2-naming": {
    "concept": "名稱要能被 Python 辨認，也要讓讀程式的人理解用途。",
    "syntax": "英文字母或底線開頭；後面可接數字",
    "example": "fuel_left = 30\npilot_2 = \"Ada\"\nprint(fuel_left, pilot_2)",
    "explanation": "底線可以分隔單字。Python 其實也允許許多 Unicode 字母（包含中文），但本課程統一使用英文與底線，方便協作。",
    "pitfall": "名稱不能以數字開頭；class、for 等關鍵字不能用作變數；大小寫不同就是不同名稱。"
  },
  "c2-comment": {
    "concept": "註解是留給人讀的說明，不參與程式執行。",
    "syntax": "# 註解文字",
    "example": "# 單位：公升\nfuel = 12\nprint(\"#\", fuel)",
    "explanation": "引號外的 # 到行尾是註解；引號內的 # 是字串內容，因此仍會被印出。",
    "pitfall": "不要只描述「加一」；寫下為什麼要加一、單位或限制，通常更有幫助。"
  },
  "c2-types": {
    "concept": "整數、浮點數與字串使用不同的運算規則。",
    "syntax": "int：整數；float：浮點數；str：字串",
    "example": "print(6 + 2)      # 8\nprint(\"6\" + \"2\")  # 62\nprint(6 / 2)      # 3.0",
    "explanation": "數字的 + 做加法，字串的 + 做串接；/ 即使整除，結果也是浮點數。",
    "pitfall": "引號會改變型別：\"6\" 並不是整數 6。"
  },
  "c2-typecmd": {
    "concept": "type() 回傳物件的型別，能協助確認資料實際長什麼樣子。",
    "syntax": "type(物件)",
    "example": "print(type(4))    # <class 'int'>\nprint(type(\"4\"))  # <class 'str'>",
    "explanation": "畫面看起來相似的值，內部型別可能不同。先檢查型別，可以找出字串與數字混用的問題。",
    "pitfall": "型別屬於物件；同一變數名稱可以在之後被指定成另一種型別。"
  },
  "c2-convert": {
    "concept": "型別轉換會建立適合後續運算的值。",
    "syntax": "int(text)、float(text)、str(value)",
    "example": "text = \"25\"\nprint(int(text) + 1)  # 26\nprint(\"編號:\" + str(8))",
    "explanation": "int 把整數文字解析成數值；str 把數字變成可串接的文字。原 text 仍是字串。",
    "pitfall": "int(\"3.5\") 會失敗；小數文字先用 float() 解析，並確認是否真的需要轉成整數。"
  },
  "c2-print": {
    "concept": "print() 將多個值轉成文字輸出。f-string 則先組好字串，可在大括號內放變數或運算式。",
    "syntax": "print(*values, sep=\" \", end=\"\\n\")；f\"文字{運算式}\"",
    "example": "name = \"Ada\"\nprint(f\"你好，{name}\")\nprint(\"A\", \"B\", sep=\"/\", end=\"!\")\nprint(\"完成\")  # 接在上一個 ! 後",
    "explanation": "f 放在引號前才會代入大括號內容；sep 控制同一次 print 的值之間，end 控制整次輸出的結尾。下一組題目會練習冒號後的格式規格。",
    "pitfall": "沒有 f 的 \"{name}\" 只會保留原文字；end 改為非換行字串後，下次 print 會接著印。"
  },
  "c2-input": {
    "concept": "input() 暫停並取得一行文字，輸入看似數字也仍是 str。",
    "syntax": "name = input(prompt)；age = int(input(prompt))",
    "example": "# 在自己的終端機可執行：\n# age = int(input(\"年齡：\"))\ntext = \"14\"  # 模擬輸入\nprint(int(text) + 1)  # 15",
    "explanation": "先取得文字，再轉成數字，才能做加法。這個平台會依關卡設定自動提供輸入。",
    "pitfall": "input() 不會自動判斷數字型別；無法解析的文字會在轉換時出錯。"
  },
  "c2-arith": {
    "concept": "Python 提供除法、向下整除、餘數與次方，各自回答不同問題。",
    "syntax": "+、-、*、/、//、%、**",
    "example": "print(11 / 4)   # 2.75\nprint(11 // 4)  # 2\nprint(11 % 4)   # 3\nprint(4 ** 2)   # 16",
    "explanation": "11 可分成 2 組 4，剩 3。// 取向下整數商，% 取得餘數；下一題會觀察負數的向下方向。",
    "pitfall": "^ 是位元 XOR，不是次方；次方要用 **。"
  },
  "c2-logic": {
    "concept": "比較式產生布林值，可用 and、or、not 組合條件。",
    "syntax": "==、!=、<、<=、>、>=；and、or、not",
    "example": "speed = 45\nprint(speed >= 30 and speed < 60)  # True\nprint(not (speed == 45))          # False",
    "explanation": "兩個比較都成立時 and 才成立。比較使用 ==；= 則是賦值。",
    "pitfall": "and、or 本身不保證回傳 bool，它們會回傳選中的運算元；搭配比較式時結果才是這裡的布林值。"
  },
  "c2-compound": {
    "concept": "複合賦值把運算與更新名稱寫在一起。",
    "syntax": "x += y、x *= y",
    "example": "energy = 8\nenergy += 2\nenergy *= 3\nprint(energy)  # 30",
    "explanation": "每一步都使用上一步更新後的值。對這裡的整數而言，+= 可理解成相加後重新綁定。",
    "pitfall": "不要推論所有物件都一樣；串列的 += 可能直接修改原物件。"
  },
  "c2-priority": {
    "concept": "運算子有預設的結合順序，括號可以明確指定先算哪一段。",
    "syntax": "括號 → 次方 → 乘除 → 加減",
    "example": "print(1 + 2 * 3 ** 2)  # 19\nprint((1 + 2) * 3 ** 2)  # 27",
    "explanation": "第一行先算 3 的平方，再乘以 2，最後加 1。第二行的括號讓加法提前。",
    "pitfall": "負號與次方有特別的結合規則；下一題用 -2 ** 2 與 (-2) ** 2 比較。"
  },
  "c2-number-format": {
    "concept": "同一個數值可以有不同的顯示方式。格式化產生字串，不會把原本的數字改掉；數字轉成一般字串也不保證保留小數末尾的零。",
    "syntax": ":,.2f → 千分位＋固定兩位小數",
    "example": "price = 2300.5\nprint(f\"{price:,.2f}\")  # 2,300.50",
    "explanation": "冒號後是格式規格。逗號每三位分組，.2 指兩位小數，f 表示固定小數格式。",
    "pitfall": "顯示的末尾 0 是字串的一部分，不代表原數值增加精度。"
  },
  "c2-padding": {
    "concept": "欄位寬度是最小寬度，文字太長不會自動截斷。補零則能讓編號整齊排列。",
    "syntax": ":04d 補零；:<6 靠左且至少六字元",
    "example": "print(f\"{23:04d}\")     # 0023\nprint(f\"|{'Sun':<6}|\") # |Sun   |",
    "explanation": "d 表示十進位整數；0 代表用零填補。< 控制靠左，未指定填補字元時使用空格。",
    "pitfall": "寬度是下限，不會截斷超長內容；不要對需要空格的結果使用 strip()。"
  },
  "c2-percent": {
    "concept": "百分比格式會自己乘以 100 再加上 %。如果先乘一次，就會把 0.375 誤顯示成 3750.0%。",
    "syntax": ":.1% → 一位小數的百分比",
    "example": "fraction = 0.625\nprint(f\"{fraction:.1%}\")  # 62.5%",
    "explanation": "% 格式會先把比例乘以 100，再顯示指定小數位與百分號。",
    "pitfall": "不要先乘 100 又套用 % 格式。"
  },
  "c2-dynamic": {
    "concept": "格式規格本身也能放變數，不需要為每一種精度寫一個 if。精度為 0 時，不應留下小數點。",
    "syntax": "f\"{value:{width}.{digits}f}\"",
    "example": "value, width, digits = 8.25, 7, 1\nprint(f\"|{value:{width}.{digits}f}|\")  # |    8.2|",
    "explanation": "內層大括號先代入格式參數，外層再依結果格式化 value；寬度包含小數點和符號。",
    "pitfall": "精度為 0 時不顯示小數點；邊界取近似值也受偶數捨入規則影響。"
  },
  "c2-braces": {
    "concept": "通訊模板需要同時保留大括號、替換欄位。format() 把單層大括號當欄位，雙層大括號才代表文字本身。",
    "syntax": "{{、}} 表示字面大括號；{} 表示替換欄位",
    "example": "print(\"{{id: {}}}\".format(3))  # {id: 3}",
    "explanation": "format 解析模板時，雙大括號輸出一個字面括號，單組欄位則插入傳入的值。",
    "pitfall": "不是所有大括號都要加倍；替換欄位仍保留單層。"
  },
  "c2-repr": {
    "concept": "一般顯示會把換行真的換成下一行，除錯時反而不容易看出資料原貌。repr() 會用含引號與跳脫字元的表示法揭露這些細節。",
    "syntax": "f\"{value!r}\" 等同先呼叫 repr(value)",
    "example": "text = \"A\\nB\"\nprint(text)          # 真正換行\nprint(f\"{text!r}\")   # 顯示 'A\\nB'",
    "explanation": "!r 要求用可辨認引號與跳脫字元的表示法，適合看清空白、tab 與換行。",
    "pitfall": "repr 可能依內容選擇單引號或雙引號；不要自行硬包一種引號模擬。"
  },
  "c2-string-immutable": {
    "concept": "replace() 會回傳新字串，不會改掉原字串。呼叫完卻沒接住結果，修改就不會留下來。",
    "syntax": "new_text = text.replace(old, new)",
    "example": "text = \"red ship\"\nnew_text = text.replace(\"red\", \"blue\")\nprint(text, new_text)",
    "explanation": "字串不可變，因此 replace 產生新值，原字串的內容保持不變。",
    "pitfall": "若沒接住回傳值，原變數不會自動更新。"
  },
  "c2-negative-division": {
    "concept": "Python 的 // 是向負無限大取整，不是把小數直接丟掉。商與餘數仍滿足 a == (a // b) * b + a % b。",
    "syntax": "a == (a // b) * b + a % b",
    "example": "print(-8 // 3)  # -3\nprint(-8 % 3)   # 1\nprint(-3 * 3 + 1)  # -8",
    "explanation": "向下取整是在數線上往較小的整數移動；負數的較小值是更負。",
    "pitfall": "// 不能概括成刪除小數；餘數為非零時與除數同號。"
  },
  "c2-float-close": {
    "concept": "二進位浮點數無法精確表示某些十進位小數，因此 0.1 + 0.2 可能不等於 0.3。比較計算結果時，可以接受合理的小誤差。",
    "syntax": "math.isclose(a, b, rel_tol=..., abs_tol=...)",
    "example": "import math\nprint(0.1 + 0.1 + 0.1 == 0.3)  # False\nprint(math.isclose(0.1 + 0.1 + 0.1, 0.3))  # True",
    "explanation": "浮點數保存的是有限位二進位近似值，多次運算後可能有微小誤差。isclose 根據誤差門檻比較。",
    "pitfall": "接近 0 時常需設定 abs_tol；格式化顯示相同不保證內部數值完全相同。"
  },
  "c2-power-sign": {
    "concept": "-2 ** 2 會先算次方再加負號；(-2) ** 2 則把負數當底數。括號的位置會改變答案。",
    "syntax": "-x ** n 與 (-x) ** n",
    "example": "print(-3 ** 2)    # -9\nprint((-3) ** 2)  # 9\nprint(3 ** -2)    # 約 0.1111",
    "explanation": "左側負號通常在次方之後套用；右側負指數則構成指數本身。",
    "pitfall": "想明確把負數當底數，請加括號。"
  }
};
