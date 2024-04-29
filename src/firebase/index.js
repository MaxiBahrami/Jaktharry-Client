import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBjXPtl_zln7-TurobN_OYx1Ep5JtpDK-k",
  authDomain: "jagarepic-99cab.firebaseapp.com",
  projectId: "jagarepic-99cab",
  storageBucket: "jagarepic-99cab.appspot.com",
  messagingSenderId: "406524797766",
  appId: "1:406524797766:web:dca80800e0e2a1c0fdbb47",
  measurementId: "G-KWKE2MK5HD"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }