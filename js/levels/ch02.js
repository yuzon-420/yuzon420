// 第 2 章:變數與資料型態
export const CH2 = {
  num: 2,
  emoji: "🌍",
  title: "變數星系",
  subtitle: "變數、資料型態、輸出與輸入、運算式",
  levels: [
    {
      id: "c2-var",
      planet: "🌍",
      title: "建立變數",
      topic: "認識變數",
      story: "太空船的電腦需要記住資料,變數就是幫資料取名字的收納盒。",
      instructions: [
        "建立變數 <code>msg</code>,值是字串 <code>我會Python</code>",
        "用 <code>print(msg)</code> 印出來",
      ],
      starter: "# 建立變數 msg 並印出\n",
      hint: 'msg = "我會Python" 就是把字串放進變數,再 print(msg)。',
      xp: 30,
      tests: [
        { name: "msg 變數內容正確", code: 'assert ns.get("msg") == "我會Python", "msg 的值要是 我會Python"' },
        { name: "有印出來", code: 'assert "我會Python" in output, "記得 print(msg)"' },
      ],
    },
    {
      id: "c2-naming",
      planet: "🏷️",
      title: "命名規則",
      topic: "變數命名規則",
      story: "變數名稱不能以數字開頭，也不能使用連字號或空格。本課程使用英文與底線命名；Python 也允許許多 Unicode 字母。幫這些資料取合法的名字!",
      instructions: [
        "建立變數 <code>player_1</code>,值是 <code>\"小艾\"</code>",
        "建立變數 <code>hp_max</code>,值是 <code>100</code>",
        "把兩個變數都印出來",
      ],
      starter: "# 錯誤示範(不能這樣命名):\n# 1player = \"小艾\"   ← 不能以數字開頭\n# hp-max = 100      ← 不能用連字號\n\n# 請用合法名稱建立變數\n",
      hint: "英文、數字、底線可以混用,但開頭要是英文或底線:player_1、hp_max。",
      xp: 30,
      tests: [
        { name: "player_1 正確", code: 'assert ns.get("player_1") == "小艾", "player_1 的值要是 小艾"' },
        { name: "hp_max 正確", code: 'assert ns.get("hp_max") == 100, "hp_max 的值要是 100"' },
        { name: "有印出來", code: 'assert "小艾" in output and "100" in output, "記得把兩個變數都 print 出來"' },
      ],
    },
    {
      id: "c2-comment",
      planet: "📝",
      title: "寫下註解",
      topic: "註解",
      story: "好的程式要留下說明給未來的自己。井字號 # 後面的文字不會被執行。",
      instructions: [
        "第一行寫一行以 <code>#</code> 開頭的註解(內容自由)",
        "接著用 <code>print()</code> 印出 <code>開始執行</code>",
      ],
      starter: "",
      hint: "# 這是註解 ← 這樣的行不會執行。註解寫完換行再寫 print(\"開始執行\")。",
      xp: 30,
      tests: [
        { name: "有寫註解", code: 'assert any(l.strip().startswith("#") for l in src.splitlines()), "要有一行以 # 開頭的註解"' },
        { name: "印出 開始執行", code: 'assert "開始執行" in output, "記得 print(\\"開始執行\\")"' },
      ],
    },
    {
      id: "c2-types",
      planet: "🔢",
      title: "三種型態",
      topic: "數值與字串型態",
      story: "整數、浮點數、字串是最基本的三種資料型態,先各準備一個。",
      instructions: [
        "建立 <code>a = 7</code>(整數)",
        "建立 <code>b = 3.14</code>(浮點數)",
        "建立 <code>c = \"Python\"</code>(字串)",
      ],
      starter: "# 建立三種型態的變數 a、b、c\n",
      hint: "整數不用小數點,浮點數有小數點,字串要加引號。",
      xp: 30,
      tests: [
        { name: "a 是整數 7", code: 'assert ns.get("a") == 7 and isinstance(ns.get("a"), int), "a 要是整數 7"' },
        { name: "b 是浮點數 3.14", code: 'assert ns.get("b") == 3.14 and isinstance(ns.get("b"), float), "b 要是浮點數 3.14"' },
        { name: "c 是字串 Python", code: 'assert ns.get("c") == "Python" and isinstance(ns.get("c"), str), "c 要是字串 Python(記得引號)"' },
      ],
    },
    {
      "id": "c2-string-immutable",
      "planet": "🧪",
      "title": "字串改了卻沒改？",
      "topic": "字串不可變與方法回傳值",
      "story": "replace() 會回傳新字串，不會改掉原字串。呼叫完卻沒接住結果，修改就不會留下來。",
      "instructions": [
        "修正起始程式，把 <code>\"Mars base\"</code> 中的 Mars 換成 Moon，存入 <code>updated</code>。",
        "保留 <code>text</code> 原值，updated 應為 <code>\"Moon base\"</code>。"
      ],
      "starter": "text = \"Mars base\"\ntext.replace(\"Mars\", \"Moon\")\n\n# 把取代結果存入 updated\n",
      "hint": "updated = text.replace(\"Mars\", \"Moon\")。字串的方法不會直接修改原字串。",
      "xp": 50,
      "tests": [
        {
          "name": "原字串與新字串",
          "code": "assert ns.get(\"text\") == \"Mars base\" and ns.get(\"updated\") == \"Moon base\", \"replace 的回傳值要另外接住，原字串保持不變\""
        }
      ]
    },
    {
      id: "c2-typecmd",
      planet: "🔍",
      title: "type 偵測器",
      topic: "type 命令",
      story: "不確定資料是什麼型態?用 type() 掃描它!",
      instructions: [
        "已有變數 <code>x</code>、<code>y</code>、<code>z</code>",
        "用 <code>print(type(x))</code> 的方式,把三個變數的型態都印出來",
      ],
      starter: 'x = 87\ny = "87"\nz = 3.14\n\n# 印出三個變數的型態\n',
      hint: "print(type(x)) 會印出 <class 'int'>。三個都要印。",
      xp: 30,
      tests: [
        { name: "印出 int 型態", code: "assert \"<class 'int'>\" in output, \"x 是整數,要看到 <class 'int'>\"" },
        { name: "印出 str 型態", code: "assert \"<class 'str'>\" in output, \"y 是字串,要看到 <class 'str'>\"" },
        { name: "印出 float 型態", code: "assert \"<class 'float'>\" in output, \"z 是浮點數,要看到 <class 'float'>\"" },
      ],
    },
    {
      id: "c2-convert",
      planet: "🔄",
      title: "型態轉換器",
      topic: "資料型態轉換",
      story: "字串 \"100\" 不能直接拿來加減,要先用 int() 轉成數字;數字要接在字串後面,則要用 str() 轉換。",
      instructions: [
        "已有 <code>s = \"100\"</code>:建立 <code>n = int(s) + 50</code> 並印出",
        "已有 <code>num = 87</code>:建立 <code>msg = \"成績:\" + str(num)</code> 並印出",
      ],
      starter: 's = "100"\nnum = 87\n\n# 完成 n 和 msg\n',
      hint: "int(s) 把字串轉整數;str(num) 把整數轉字串,才能用 + 接起來。",
      xp: 30,
      tests: [
        { name: "n 等於 150", code: 'assert ns.get("n") == 150, "n 應該是 int(s) + 50 = 150"' },
        { name: "msg 組合正確", code: 'assert ns.get("msg") == "成績:87", "msg 應該是 成績:87(用 str() 轉換後相接)"' },
        { name: "有印出結果", code: 'assert "150" in output and "成績:87" in output, "兩個結果都要印出來"' },
      ],
    },
    {
      id: "c2-print",
      planet: "🖨️",
      title: "print 進階技",
      topic: "print 輸出命令",
      story: "print 有隱藏參數:sep 控制項目之間的分隔、end 控制結尾(預設是換行)。",
      instructions: [
        "用一個 print 印出三種水果,以頓號分隔:<code>蘋果、香蕉、芒果</code>(使用 <code>sep=\"、\"</code>)",
        "用 <code>end=\"...\"</code> 讓兩個 print 接在同一行,印出 <code>載入中...完成</code>",
      ],
      starter: '# 第一題:print("蘋果", "香蕉", "芒果", sep=?)\n\n# 第二題:兩個 print 接在同一行\n',
      hint: 'print("蘋果","香蕉","芒果",sep="、") / print("載入中",end="...") 再 print("完成")。',
      xp: 40,
      tests: [
        { name: "sep 分隔正確", code: 'assert "蘋果、香蕉、芒果" in output, "要用 sep=\\"、\\" 讓三個水果以頓號分隔"' },
        { name: "end 接續正確", code: 'assert "載入中...完成" in output, "第一個 print 用 end=\\"...\\" 才不會換行"' },
      ],
    },
    {
      "id": "c2-number-format",
      "planet": "🧾",
      "title": "帳單顯示器",
      "topic": "千分位與固定小數位",
      "story": "同一個數值可以有不同的顯示方式。格式化產生字串，不會把原本的數字改掉；數字轉成一般字串也不保證保留小數末尾的零。",
      "instructions": [
        "把 amount 格式化成有千分位、固定兩位小數的字串，存入 <code>formatted</code>。",
        "formatted 應為 <code>\"12,345.50\"</code>；保留 amount 原本的數值與型別。"
      ],
      "starter": "amount = 12345.5\n\n# 完成任務\n",
      "hint": "f\"{amount:,.2f}\" 中，逗號加入千分位，.2f 固定顯示兩位小數；回傳的是 str。",
      "xp": 70,
      "tests": [
        {
          "name": "格式與資料正確",
          "code": "assert ns.get(\"formatted\") == \"12,345.50\", \"千分位與最後的 0 都要保留\"\nassert ns.get(\"amount\") == 12345.5 and type(ns[\"amount\"]) is float, \"格式化不應改變原本的數字\""
        }
      ]
    },
    {
      "id": "c2-padding",
      "planet": "🏷️",
      "title": "艙位標籤機",
      "topic": "補零、靠左對齊與最小寬度",
      "story": "欄位寬度是最小寬度，文字太長不會自動截斷。補零則能讓編號整齊排列。",
      "instructions": [
        "建立 <code>label</code>：code 至少 4 位、不足補零，接上 <code>|</code>，再接上靠左且至少 6 字元的 name。",
        "label 應為 <code>\"0007|Io    \"</code>，保留尾端空白。",
        "將 long_name 用相同的名稱欄位格式存入 <code>wide</code>，確認超長文字完整保留。"
      ],
      "starter": "code = 7\nname = \"Io\"\nlong_name = \"Neptune\"\n\n# 完成任務\n",
      "hint": "f\"{code:04d}|{name:<6}\"：04d 是整數補零，<6 是靠左補空格。尾端空白也是答案的一部分。",
      "xp": 70,
      "tests": [
        {
          "name": "格式與資料正確",
          "code": "assert ns.get(\"label\") == \"0007|Io    \", \"編號補零，名稱後面保留 4 個空格\"\nassert ns.get(\"wide\") == \"Neptune\", \"寬度是下限，不應截斷超長文字\""
        }
      ]
    },
    {
      "id": "c2-percent",
      "planet": "🔋",
      "title": "電量百分比",
      "topic": "百分比格式自動乘以 100",
      "story": "百分比格式會自己乘以 100 再加上 %。如果先乘一次，就會把 0.375 誤顯示成 3750.0%。",
      "instructions": [
        "把 ratio 格式化成一位小數的百分比字串，存入 <code>percent</code>。",
        "預期為 <code>\"37.5%\"</code>，保留 ratio 原值。"
      ],
      "starter": "ratio = 0.375\n\n# 完成任務\n",
      "hint": "直接使用 f\"{ratio:.1%}\"；輸入已經是比例，不必先乘以 100。",
      "xp": 70,
      "tests": [
        {
          "name": "格式與資料正確",
          "code": "assert ns.get(\"percent\") == \"37.5%\", \"百分比格式會自動乘以 100，別乘兩次\"\nassert ns.get(\"ratio\") == 0.375, \"格式化不需改掉 ratio\""
        }
      ]
    },
    {
      "id": "c2-dynamic",
      "planet": "🎛️",
      "title": "可調精度儀表",
      "topic": "格式規格中嵌入變數",
      "story": "格式規格本身也能放變數，不需要為每一種精度寫一個 if。精度為 0 時，不應留下小數點。",
      "instructions": [
        "使用 f-string，把 width 與 digits 放進格式規格：將 value 靠右補到至少 width 字元、保留 digits 位小數，存入 <code>reading</code>。",
        "把 digits 改為 <code>0</code>，用相同寫法建立 <code>whole</code>。",
        "reading 應為 <code>\"    3.50\"</code>；whole 應為 7 個空格接上 <code>4</code>。"
      ],
      "starter": "value = 3.5\nwidth = 8\ndigits = 2\n\n# 完成任務\n",
      "hint": "f\"{value:{width}.{digits}f}\" 可以把 width 與 digits 放在格式規格裡。寬度包含符號與小數點。",
      "xp": 80,
      "tests": [
        {
          "name": "格式與資料正確",
          "code": "assert ns.get(\"reading\") == \"    3.50\", \"檢查寬度 8、兩位小數\"\nassert ns.get(\"whole\") == \"       4\", \"精度改為 0 後不要小數點\"\nimport ast\nassert any(isinstance(n, ast.FormattedValue) and isinstance(n.format_spec, ast.JoinedStr) and any(isinstance(v, ast.FormattedValue) for v in n.format_spec.values) for n in ast.walk(ast.parse(src))), \"請在 f-string 的格式規格中嵌入變數\""
        }
      ]
    },
    {
      "id": "c2-braces",
      "planet": "📡",
      "title": "大括號訊號",
      "topic": "str.format() 與字面大括號",
      "story": "通訊模板需要同時保留大括號、替換欄位。format() 把單層大括號當欄位，雙層大括號才代表文字本身。",
      "instructions": [
        "使用 <code>str.format()</code> 建立 <code>packet</code>，值為 <code>'{\"value\": 7}'</code>，冒號後有一個空格。",
        "模板要同時保留外層大括號，並代入 value。"
      ],
      "starter": "value = 7\n\n# 完成任務\n",
      "hint": "模板可寫成 '{{\"value\": {}}}'，再呼叫 .format(value)。最外層的 {{ 和 }} 會各變成一個字面大括號。",
      "xp": 80,
      "tests": [
        {
          "name": "格式與資料正確",
          "code": "assert ns.get(\"packet\") == '{\"value\": 7}', \"檢查大括號、雙引號與冒號後的空格\"\nimport ast\nassert any(isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and n.func.attr == \"format\" for n in ast.walk(ast.parse(src))), \"請實際呼叫 .format()，註解不算\""
        }
      ]
    },
    {
      "id": "c2-repr",
      "planet": "🔍",
      "title": "看見隱形字元",
      "topic": "f-string 的 !r 與 repr()",
      "story": "一般顯示會把換行真的換成下一行，除錯時反而不容易看出資料原貌。repr() 會用含引號與跳脫字元的表示法揭露這些細節。",
      "instructions": [
        "使用 f-string 的 <code>!r</code> 或 <code>repr()</code>，把 <code>raw=</code> 接上 text 的除錯表示法，存入 <code>debug</code>。",
        "debug 應包含表示字串的引號，以及換行、tab 的跳脫表示法。"
      ],
      "starter": "text = \"line1\\nline2\\t\"\n\n# 完成任務\n",
      "hint": "f\"raw={text!r}\" 等同 \"raw=\" + repr(text)。!r 是先取得表示法，再格式化。",
      "xp": 80,
      "tests": [
        {
          "name": "格式與資料正確",
          "code": "assert ns.get(\"debug\") == \"raw=\" + repr(\"line1\\nline2\\t\"), \"請使用 repr 表示法，而不是直接插入換行或 tab\""
        }
      ]
    },
    {
      id: "c2-input",
      planet: "⌨️",
      title: "input 對話機",
      topic: "input 輸入命令",
      story: "太空站的登記系統要跟使用者對話!input() 可以取得輸入,但拿到的一定是字串,算年齡前要先轉成整數。",
      instructions: [
        "用 <code>input()</code> 取得名字,存進 <code>name</code>",
        "用 <code>int(input())</code> 取得年齡,存進 <code>age</code>",
        "印出 <code>{name} 明年 {age+1} 歲</code>(f-string)",
        "測試時系統會自動依序輸入:<code>小艾</code>、<code>12</code>",
      ],
      starter: "# 取得 name 和 age,印出明年幾歲\n",
      hint: 'name = input("名字:") 、 age = int(input("年齡:")),再 print(f"{name} 明年 {age+1} 歲")。',
      xp: 50,
      stdin: ["小艾", "12"],
      tests: [
        { name: "有使用 input", code: 'assert "input(" in src, "要用 input() 取得輸入"' },
        { name: "有轉換成整數", code: 'assert "int(" in src, "年齡要用 int() 轉成整數才能 +1"' },
        { name: "輸出正確", code: 'assert "小艾 明年 13 歲" in output, "輸出要是:小艾 明年 13 歲"' },
      ],
    },
    {
      id: "c2-arith",
      planet: "➗",
      title: "算術運算站",
      topic: "算術運算子",
      story: "加減乘除之外,Python 還有整除 //、餘數 %、次方 ** 三個好用的運算子。",
      instructions: [
        "已有 <code>a = 17</code>、<code>b = 5</code>",
        "建立 <code>add = a + b</code>、<code>quo = a // b</code>、<code>rem = a % b</code>、<code>power = b ** 2</code>",
        "把四個結果都印出來",
      ],
      starter: "a = 17\nb = 5\n\n# 完成 add、quo、rem、power 並印出\n",
      hint: "// 取整數商(17//5=3),% 取餘數(17%5=2),** 是次方(5**2=25)。",
      xp: 40,
      tests: [
        { name: "add == 22", code: 'assert ns.get("add") == 22, "add 應該是 17+5=22"' },
        { name: "quo == 3", code: 'assert ns.get("quo") == 3, "quo 應該是 17//5=3(整除)"' },
        { name: "rem == 2", code: 'assert ns.get("rem") == 2, "rem 應該是 17%5=2(餘數)"' },
        { name: "power == 25", code: 'assert ns.get("power") == 25, "power 應該是 5**2=25(次方)"' },
      ],
    },
    {
      "id": "c2-negative-division",
      "planet": "🧪",
      "title": "負數整除的方向",
      "topic": "// 向下取整與餘數",
      "story": "Python 的 // 是向負無限大取整，不是把小數直接丟掉。商與餘數仍滿足 a == (a // b) * b + a % b。",
      "instructions": [
        "保留 a 與 b，計算 <code>quotient = a // b</code>、<code>remainder = a % b</code>。",
        "建立 <code>rebuilt = quotient * b + remainder</code>；先預測負數整除的結果，再執行。"
      ],
      "starter": "a = -7\nb = 3\n\n# 計算 quotient、remainder、rebuilt\n",
      "hint": "-7 / 3 約是 -2.33，向下取整是 -3；餘數是 2，因為 -3 * 3 + 2 = -7。",
      "xp": 70,
      "tests": [
        {
          "name": "整除與餘數",
          "code": "assert ns.get(\"quotient\") == -3 and ns.get(\"remainder\") == 2, \"// 遇到負數要向下取整，不能用 int(a / b) 代替\"\nassert ns.get(\"rebuilt\") == -7, \"商乘除數再加餘數要還原被除數\""
        }
      ]
    },
    {
      "id": "c2-float-close",
      "planet": "🧪",
      "title": "小數加法誤差",
      "topic": "浮點數近似與 math.isclose()",
      "story": "二進位浮點數無法精確表示某些十進位小數，因此 0.1 + 0.2 可能不等於 0.3。比較計算結果時，可以接受合理的小誤差。",
      "instructions": [
        "保留 <code>total = 0.1 + 0.2</code>，建立 <code>exact = total == 0.3</code>。",
        "起始碼的 <code>import math</code> 載入數學工具；使用 <code>math.isclose(total, 0.3)</code> 建立 <code>close</code>。",
        "不要先把 total 四捨五入，觀察 exact 與 close 的不同。"
      ],
      "starter": "import math\n\ntotal = 0.1 + 0.2\n\n# 建立 exact 與 close\n",
      "hint": "exact 為 False；math.isclose() 允許很小的誤差，close 為 True。實際應用需依資料尺度選容許誤差。",
      "xp": 70,
      "tests": [
        {
          "name": "精確比較與近似比較",
          "code": "assert ns.get(\"total\") == 0.1 + 0.2, \"保留原本浮點數運算結果\"\nassert ns.get(\"exact\") is False and ns.get(\"close\") is True, \"直接比較不相等，但允許微小誤差時應相等\""
        }
      ]
    },
    {
      id: "c2-logic",
      planet: "⚖️",
      title: "真假判官",
      topic: "比較與邏輯運算子",
      story: "比較運算的結果只有 True 或 False,它們是之後「判斷式」的基礎!",
      instructions: [
        "已有 <code>score = 75</code>",
        "建立 <code>is_pass = score >= 60</code>",
        "建立 <code>is_great = score >= 90</code>",
        "建立 <code>is_mid = score >= 60 and score < 80</code>",
        "把三個結果都印出來",
      ],
      starter: "score = 75\n\n# 完成 is_pass、is_great、is_mid 並印出\n",
      hint: ">= 是「大於等於」;and 表示兩個條件都要成立。",
      xp: 40,
      tests: [
        { name: "is_pass 是 True", code: 'assert ns.get("is_pass") is True, "75 >= 60,is_pass 應該是 True"' },
        { name: "is_great 是 False", code: 'assert ns.get("is_great") is False, "75 < 90,is_great 應該是 False"' },
        { name: "is_mid 是 True", code: 'assert ns.get("is_mid") is True, "75 介於 60~79,is_mid 應該是 True"' },
      ],
    },
    {
      id: "c2-compound",
      planet: "💰",
      title: "複合指定金庫",
      topic: "複合指定運算子",
      story: "money = money + 50 可以簡寫成 money += 50,這就是複合指定運算子。",
      instructions: [
        "已有 <code>money = 100</code>",
        "用 <code>+=</code> 增加 50",
        "再用 <code>*=</code> 變成 2 倍",
        "印出最後金額(應該是 300)",
      ],
      starter: "money = 100\n\n# 用 += 和 *= 操作 money,最後印出\n",
      hint: "money += 50 → 150;money *= 2 → 300。",
      xp: 40,
      tests: [
        { name: "有使用 +=", code: 'assert "+=" in src, "要用 += 運算子"' },
        { name: "有使用 *=", code: 'assert "*=" in src, "要用 *= 運算子"' },
        { name: "最後金額 300", code: 'assert ns.get("money") == 300 and "300" in output, "最後 money 應該是 300 並印出"' },
      ],
    },
    {
      id: "c2-priority",
      planet: "🧮",
      title: "優先順序試煉",
      topic: "運算子的優先順序",
      story: "次方最先算、再乘除、最後加減。讓 Python 算給你看,驗證你的預測!",
      instructions: [
        "建立 <code>result = 2 + 3 * 4 ** 2</code>(照抄這個算式)",
        "印出 result,先自己心算再看答案!",
      ],
      starter: "# 先心算:2 + 3 * 4 ** 2 = ?\n",
      hint: "先算 4**2=16,再算 3*16=48,最後 2+48=50。",
      xp: 40,
      tests: [
        { name: "result == 50", code: 'assert ns.get("result") == 50, "運算順序:4**2=16 → 3*16=48 → 2+48=50"' },
        { name: "有印出", code: 'assert "50" in output, "記得 print(result)"' },
      ],
    },
    {
      "id": "c2-power-sign",
      "planet": "🧪",
      "title": "負號與次方誰先算",
      "topic": "一元負號和次方的優先順序",
      "story": "-2 ** 2 會先算次方再加負號；(-2) ** 2 則把負數當底數。括號的位置會改變答案。",
      "instructions": [
        "分別計算 <code>outside = -2 ** 2</code>、<code>inside = (-2) ** 2</code>、<code>inverse = 2 ** -2</code>。",
        "不要改動算式，先猜三個結果，再執行。"
      ],
      "starter": "# 負號在次方左側或右側，結果有什麼不同？\n",
      "hint": "outside 是 -(2 ** 2) = -4；inside 是 4；次方右側可直接接受負指數，inverse 是 0.25。",
      "xp": 70,
      "tests": [
        {
          "name": "三個算式",
          "code": "assert ns.get(\"outside\") == -4 and ns.get(\"inside\") == 4 and ns.get(\"inverse\") == 0.25, \"底數的括號與負指數各有不同意義\""
        }
      ]
    },
  ],
};
