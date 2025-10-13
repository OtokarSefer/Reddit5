import { useState } from 'react'

function App() {
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ token, setToken ] = useState("")
  const [ message, setMessage ] = useState("")

  const apiBase = import.meta.env.VITE_SERVER_URL

  async function register() {
    try{
      const res = await fetch(`${apiBase}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
        alert("User created")
    } catch (err) {
      alert(`${err.message}`)
    }
  }

    async function login() {
    try{
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setToken(data.idToken)
      alert("Logged In")
    } catch (err) {
      alert(`${err.message}`)
    }    
  }

    async function callProtect() {
    try{
      const res = await fetch(`${apiBase}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
        setMessage(JSON.stringify(data, null, 2))
    } catch (err) {
      setMessage(`${err.message}`)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Node + Firebase Auth (Frontend)</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={register}>Register</button>
      <button onClick={login} style={{ marginLeft: 10 }}>
        Login
      </button>

      {token && (
        <div style={{ marginTop: 20 }}>
          <button onClick={callProtect}>Call Protected Route</button>
        </div>
      )}

      <pre style={{ marginTop: 20 }}>{message}</pre>
    </div>
  );
}

export default App
