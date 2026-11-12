// Firebase 連線設定
// 到 Firebase Console → 專案設定(齒輪)→ 一般 → 您的應用程式 → 網頁應用程式(</>)
// 註冊一個網頁應用程式後,會看到 firebaseConfig,把裡面的值填到下面。
//
// 這些值設計上就是公開的(每個訪客的瀏覽器都看得到),不是密碼;
// 資料安全是靠 firebase/firestore.rules 這份規則把關。
//
// 尚未填寫時,網站以「訪客模式」運作:一切可玩,進度只存在瀏覽器本機。

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAuI3RfEFUWkpFUnwp-oK3nhPYS2QuMRj0",
  authDomain: "teacher-ae61f.firebaseapp.com",
  projectId: "teacher-ae61f",
  appId: "1:424754953584:web:e31e0fdc901629b7e7e3b5",
};
