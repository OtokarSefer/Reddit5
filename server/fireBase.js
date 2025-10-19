// fireBase.js
import admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import dotenv from "dotenv"

dotenv.config() // Load .env variables

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})

const db = getFirestore()

export { admin, db }
export default admin
