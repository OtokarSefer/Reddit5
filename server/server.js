import express from "express"
import dotenv from "dotenv"
dotenv.config({ path: "./config/.env" })
import bodyParser from "body-parser"
import admin from "./fireBase.js"
import fetch from "node-fetch"
import cors from "cors"

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(bodyParser.json())

app.post("/register", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await admin.auth().createUser({
            email,
            password,
        })
        res.json({ message: "User created", user})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// only works if use client sdk or rest api
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try{
        //sdk cant login directly. use rest api for auth
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, returnSecureToken: true}),
            }
        )
        const data = await response.json()
        if (data.error) throw new Error(data.error.message)
        res.json({
            message: "Logged in successfully",
            idToken: data.idToken,
            refreshToken: data.refreshToken,
    })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" })
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = await admin.auth().verifyIdToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" })
    } 
}

app.get("/protected", verifyToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.email}!`, user: req.user})
})
app.listen(3333, () => console.log("Server Running on http://localhost:3333"))