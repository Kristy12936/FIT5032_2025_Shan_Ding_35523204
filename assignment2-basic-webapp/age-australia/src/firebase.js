import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6FGA47W5d4mW6S7BqX_QSdvpNFEKnehE",
  authDomain: "ageaus-25996.firebaseapp.com",
  projectId: "ageaus-25996",
  storageBucket: "ageaus-25996.firebasestorage.app",
  messagingSenderId: "210240112150",
  appId: "1:210240112150:web:1646ef6acfd773b1c4d737"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ 新增

export { auth, db }; // ✅ 一起导出
