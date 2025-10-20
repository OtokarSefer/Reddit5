import admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import { readFileSync } from "fs"

const serviceAccount = JSON.parse(
  readFileSync("./config/serviceAccountKey.json", "utf8")
)
console.log(serviceAccount.private_key)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = getFirestore()

export { admin, db }
export default admin