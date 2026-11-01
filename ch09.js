// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_9 = {
  "c9-file": {
    "concept": "檔案物件依模式讀寫，寫入後要關閉或確實刷新才能保證資料送出。",
    "syntax": "open(path, \"w\", encoding=\"utf-8\")；read()；write(text)",
    "example": "f = open(\"lesson.txt\", \"w\", encoding=\"utf-8\")\nf.write(\"hello\")\nf.close()\nf = open(\"lesson.txt\", \"r\", encoding=\"utf-8\")\nprint(f.read())\nf.close()",
    "explanation": "w 會建立檔案或清空既有內容；r 讀取既有內容。這個平台的檔案位於瀏覽器中的 Python 虛擬檔案系統。",
    "pitfall": "不要用 w 開啟要保留的舊資料；需要追加時使用 a。"
  },
  "c9-withas": {
    "concept": "with 透過上下文管理器處理進入與離開時的動作；檔案可自動關閉。",
    "syntax": "with open(...) as f:\n    使用檔案",
    "example": "with open(\"lesson.txt\", \"w\", encoding=\"utf-8\") as f:\n    f.write(\"A\\nB\\n\")\nprint(f.closed)  # True",
    "explanation": "離開 with 區塊時會關檔，即使區塊內發生例外也會執行離開動作。readlines() 取得每行字串，通常包含行尾換行。",
    "pitfall": "自動關檔不等於自動吞掉錯誤；例外仍會傳出。"
  },
  "c9-tryexcept": {
    "concept": "try 包住可能出錯的操作，except 接住指定種類的例外。",
    "syntax": "try: ...\nexcept ErrorType: ...",
    "example": "try:\n    number = int(\"oops\")\nexcept ValueError:\n    print(\"不是整數文字\")",
    "explanation": "轉換失敗後，try 中剩下的敘述會跳過，轉到匹配的 except。若沒有匹配的處理器，例外會向外傳遞。",
    "pitfall": "盡量接住預期的具體例外，避免用過大的捕捉範圍掩蓋程式錯誤。"
  },
  "c9-assert": {
    "concept": "assert 用來檢查程式內部應成立的假設，失敗時拋出 AssertionError。",
    "syntax": "assert condition, message",
    "example": "value = 8\nassert value >= 0, \"value 應為非負數\"\nprint(value)",
    "explanation": "條件為假時立即中止目前路徑並報錯，因此適合除錯與測試。",
    "pitfall": "Python 最佳化模式可能移除 assert；正式的輸入驗證應使用 if 搭配 raise，而不能只靠 assert。"
  },
  "c9-finally": {
    "concept": "即使 try 或 except 已準備 return，離開前仍會執行 finally。若 finally 又 return，先前的回傳值甚至未處理的例外都可能被蓋掉。",
    "syntax": "try/except 的結果決定後，finally 仍負責收尾",
    "example": "events = []\ndef work():\n    try:\n        return 7\n    finally:\n        events.append(\"cleanup\")\nprint(work(), events)  # 7 ['cleanup']",
    "explanation": "先準備回傳值，執行 finally，再真正返回。finally 裡如果再次 return，便會覆蓋先前的返回路徑。",
    "pitfall": "finally 中 return 也可能吞掉待拋出的例外，因此通常只做清理。"
  },
  "c9-except-order": {
    "concept": "ValueError 是 Exception 的子類別。若把 except Exception 放前面，更具體的 ValueError 分支就沒有機會執行。",
    "syntax": "具體例外在前；一般例外在後",
    "example": "try:\n    int(\"no\")\nexcept ValueError:\n    print(\"格式錯誤\")\nexcept Exception:\n    print(\"其他問題\")",
    "explanation": "例外匹配接受類別及其子類別，Python 從上往下選第一個符合的 except。",
    "pitfall": "Exception 放在最前面會搶先接走 ValueError 等子類別例外。"
  }
};
