// 講義範例使用獨立資料，可直接閱讀，不計入提示次數。
export const LESSONS_8 = {
  "c8-bubble": {
    "concept": "泡沫排序反覆比較相鄰元素，把較大的值逐步推向右端。",
    "syntax": "若 items[j] > items[j + 1] 就交換",
    "example": "items = [3, 1, 2]\nfor end in range(len(items) - 1, 0, -1):\n    for j in range(end):\n        if items[j] > items[j + 1]:\n            items[j], items[j + 1] = items[j + 1], items[j]\nprint(items)",
    "explanation": "每一輪把未排序部分的最大值送到右端，所以下一輪的比較範圍可以縮短。",
    "pitfall": "j + 1 必須在有效範圍內；先算好右邊再同時賦值，可避免交換時覆蓋資料。"
  },
  "c8-linear": {
    "concept": "循序搜尋從頭逐一比較，資料不需要預先排序。",
    "syntax": "逐一比較，符合時回傳索引",
    "example": "def find_index(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1\nprint(find_index([8, 3, 6], 3))",
    "explanation": "找到就立即 return；-1 放在迴圈外，代表所有位置都檢查過仍未找到。",
    "pitfall": "如果把 return -1 放進迴圈，可能只檢查第一項就提前離開。"
  },
  "c8-binary": {
    "concept": "二分搜尋每次排除一半區間，前提是資料已按相同規則排序。",
    "syntax": "mid = (left + right) // 2",
    "example": "items = [2, 4, 6, 8, 10]\nleft, right = 0, len(items) - 1\nmid = (left + right) // 2\nprint(items[mid])  # 6",
    "explanation": "若目標比中間值小，只需找左半；若比較大，只需找右半。更新界線時要排除已比較過的中間位置。",
    "pitfall": "未排序資料不能套用此推理；用 mid - 1 或 mid + 1 確保區間確實縮小。"
  }
};
