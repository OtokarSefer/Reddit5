import admin from "firebase-admin"
import { getFirestore } from "firebase-admin/firestore"
import { readFileSync } from "fs"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let serviceAccount

if (process.env.FIREBASE_PRIVATE_KEY) {
  // Production environment (Netlify)
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }
} else {
  // Local development - use service account file
  try {
    // Try different possible paths
    const possiblePaths = [
      join(__dirname, 'config/serviceAccountKey.json'),
      join(__dirname, '../config/serviceAccountKey.json'),
      join(process.cwd(), 'config/serviceAccountKey.json'),
      join(process.cwd(), 'server/config/serviceAccountKey.json')
    ]
    
    let serviceAccountPath
    for (const path of possiblePaths) {
      try {
        readFileSync(path, 'utf8')
        serviceAccountPath = path
        break
      } catch (e) {
        // Continue to next path
      }
    }
    
    if (!serviceAccountPath) {
      throw new Error('Service account file not found in any expected location')
    }
    
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))
    console.log('Loaded service account from:', serviceAccountPath)
  } catch (error) {
    console.error('Error loading service account:', error.message)
    throw error
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = getFirestore()

export { admin, db }
export default admin