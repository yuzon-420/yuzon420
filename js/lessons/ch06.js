// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_6 = {
  "c6-create": {
    "concept": "字典用鍵查找值，而不是用元素所在的位置。",
    "syntax": "data = {key: value}；data[key]",
    "example": "ship = {\"name\": \"Nova\", \"fuel\": 20}\nprint(ship[\"name\"])  # Nova",
    "explanation": "鍵像標籤，值是標籤對應的資料。方括號裡放的是鍵本身。",
    "pitfall": "直接存取不存在的鍵會有 KeyError；鍵必須可雜湊，串列不能直接當鍵。"
  },
  "c6-maintain": {
    "concept": "對鍵賦值可新增或覆寫項目，del 可移除指定鍵值對。",
    "syntax": "data[key] = value；del data[key]",
    "example": "stock = {\"food\": 2}\nstock[\"food\"] = 3\nstock[\"water\"] = 4\ndel stock[\"food\"]\nprint(stock)",
    "explanation": "同一個鍵只能對應一個值，所以再次賦值會更新該項，而不會增加第二個同名鍵。",
    "pitfall": "del 不存在的鍵會出錯；更新已存在的鍵不會改變它原本的插入順序。"
  },
  "c6-in": {
    "concept": "對字典使用 in 預設檢查鍵，不檢查值。",
    "syntax": "key in data；value in data.values()",
    "example": "data = {\"name\": \"Nova\"}\nprint(\"name\" in data)           # True\nprint(\"Nova\" in data)           # False\nprint(\"Nova\" in data.values())  # True",
    "explanation": "字典本身的成員判斷以鍵為主；需要查值時，要明確使用 values()。",
    "pitfall": "None 值不表示鍵不存在；判斷是否缺鍵應使用 in。"
  },
  "c6-keysvalues": {
    "concept": "keys 與 values 分別回傳鍵、值的動態檢視。",
    "syntax": "data.keys()；data.values()；list(view)",
    "example": "data = {\"x\": 2, \"y\": 4}\nprint(list(data.keys()))   # ['x', 'y']\nprint(list(data.values())) # [2, 4]",
    "explanation": "list() 將目前檢視列成串列；檢視本身則會隨字典的後續修改更新。",
    "pitfall": "若要保存當時狀態，需建立 list 快照，而不只是保存 view。"
  },
  "c6-items": {
    "concept": "items() 在每次遍歷時提供一組鍵與值。",
    "syntax": "for key, value in data.items(): ...",
    "example": "data = {\"fuel\": 8, \"water\": 3}\nfor key, value in data.items():\n    print(key, value)",
    "explanation": "key, value 是解包寫法，將每個二元素配對分別放入兩個名稱。",
    "pitfall": "遍歷字典時不要直接增刪鍵；需要增刪時可遍歷 list(data.items()) 的快照。"
  },
  "c6-setdefault": {
    "concept": "setdefault 在缺鍵時插入預設值，有鍵時保留並回傳原值。",
    "syntax": "value = data.setdefault(key, default)",
    "example": "data = {\"gold\": 2}\nprint(data.setdefault(\"gold\", 0))    # 2\nprint(data.setdefault(\"silver\", 1))  # 1\nprint(data)",
    "explanation": "與 get 不同，setdefault 在缺鍵時會修改字典，因此適合建立分組或初始計數。",
    "pitfall": "預設值若是同一個可變物件，被多個鍵共用時仍會互相影響。"
  },
  "c6-key-collision": {
    "concept": "字典用相等性與雜湊值辨認鍵。True、1、1.0 相等且雜湊值相同，所以會對應同一個項目；字串 \"1\" 則是另一個鍵。",
    "syntax": "相等且雜湊相同的鍵會對應同一字典項目",
    "example": "data = {1: \"first\"}\ndata[True] = \"updated\"\nprint(len(data), data[1])  # 1 updated",
    "explanation": "bool 是 int 的子類別；True 與 1 數值相等，字典將它們視為同一鍵。",
    "pitfall": "字串 \"1\" 與數值 1 不同；別用 bool 與整數鍵區分兩種業務資料。"
  },
  "c6-get-none": {
    "concept": "get(key, default) 只在鍵不存在時用預設值。如果鍵已存在、值剛好是 None，回傳的仍是 None。",
    "syntax": "data.get(key, default)",
    "example": "data = {\"x\": None}\nprint(data.get(\"x\", 5))  # None\nprint(data.get(\"y\", 5))  # 5",
    "explanation": "get 先確認鍵是否存在，只有不存在時才回傳 default，不會再檢查取出的值是否為 None。",
    "pitfall": "get(... ) or default 是另一套規則，連 0 與空字串都會被替換。"
  },
  "c6-live-view": {
    "concept": "keys() 回傳的是動態檢視，不是當下內容的固定副本。字典改變後，原先保存的檢視也會反映新內容。",
    "syntax": "view = data.keys()；snapshot = list(view)",
    "example": "data = {\"a\": 1}\nview = data.keys()\nsnapshot = list(view)\ndata[\"b\"] = 2\nprint(list(view), snapshot)",
    "explanation": "檢視保留與字典的連結；list(view) 則建立當時各鍵的外層串列。",
    "pitfall": "動態檢視不是不可變快照；遍歷時增刪字典鍵也可能引發錯誤。"
  },
  "c6-fromkeys": {
    "concept": "dict.fromkeys(names, []) 只建立一個空串列，所有鍵都指向它。每個人要有獨立背包，必須為每個鍵建立新的串列。",
    "syntax": "{key: [] for key in keys}",
    "example": "bags = {name: [] for name in [\"A\", \"B\"]}\nbags[\"A\"].append(1)\nprint(bags)  # {'A': [1], 'B': []}",
    "explanation": "生成式中的 [] 每次求值都產生新串列；fromkeys 的預設值參數只求值一次，再由所有鍵共用。",
    "pitfall": "fromkeys(keys, 0) 用於不可變計數初值通常沒此問題，但 [] 或 {} 要特別小心。"
  }
};
