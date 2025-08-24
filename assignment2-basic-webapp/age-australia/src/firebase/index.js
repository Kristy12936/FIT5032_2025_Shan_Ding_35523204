import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { setPersistence, browserLocalPersistence } from 'firebase/auth'

// Firebase 配置 - 替换为您自己的配置
const firebaseConfig = {
  apiKey: "AIzaSyB6FGA47W5d4mW6S7BqX_QSdvpNFEKnehE",
  authDomain: "ageaus-25996.firebaseapp.com",
  projectId: "ageaus-25996",
  storageBucket: "ageaus-25996.firebasestorage.app",
  messagingSenderId: "210240112150",
  appId: "1:210240112150:web:1646ef6acfd773b1c4d737",
  measurementId: "G-T6XYPQ5TX1"
};


// 初始化 Firebase
const app = initializeApp(firebaseConfig)

// 初始化 Firebase Authentication
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)

// 初始化 Firebase Firestore
export const db = getFirestore(app)

// 导出 Firebase 认证相关函数
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'

// Firestore 相关函数
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore'

const eventsRef = collection(db, 'events')

// 实时监听 events 集合
export const listenToEvents = (callback) => {
  return onSnapshot(eventsRef, (snapshot) => {
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(events)
  })
}

// 报名活动：将用户 email 加入 participants 数组
export const joinEvent = async (eventId, email) => {
  const docRef = doc(db, 'events', eventId)
  await updateDoc(docRef, {
    participants: arrayUnion(email)
  })
}

// 获取用户收藏的文章
export const getUserFavorites = async (userId) => {
  const q = query(
    collection(db, 'userFavorites'),
    where('userId', '==', userId)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// 添加文章到收藏
export const addToFavorites = async (userId, article) => {
  const favoritesRef = collection(db, 'userFavorites')
  await addDoc(favoritesRef, {
    userId,
    articleId: article.id,
    title: article.title,
    category: article.category,
    content: article.content,
    addedAt: new Date()
  })
}

// 从收藏中移除文章
export const removeFromFavorites = async (favoriteId) => {
  await deleteDoc(doc(db, 'userFavorites', favoriteId))
}

export default app