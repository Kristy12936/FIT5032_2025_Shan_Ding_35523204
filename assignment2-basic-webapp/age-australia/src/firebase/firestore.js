import { db } from './index'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
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
