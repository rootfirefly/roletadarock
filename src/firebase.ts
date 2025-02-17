import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAGMEZRyqdtyjq9iSoAi6klOWEG7KOg_nM",
  authDomain: "roletadafelicida.firebaseapp.com",
  projectId: "roletadafelicida",
  storageBucket: "roletadafelicida.firebasestorage.app",
  messagingSenderId: "943591715136",
  appId: "1:943591715136:web:131ff2e8cb114bf0238aa5",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

