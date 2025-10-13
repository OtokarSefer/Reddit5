import { useState } from 'react'
import './SignUp.css'
import * as MinimalLoginForm from './script'

function SignUp() {
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
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Sign Up</h2>
        </div>
            
        <form class="login-form" id="loginForm" novalidate>
          <div class="form-group">
            <div class="input-wrapper">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                id="email" 
                name="email" 
                required autocomplete="email"/>
              <label for="email">Email</label>
            </div>
            <span class="error-message" id="emailError"></span>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                id="password" 
                name="password" 
                required autocomplete="current-password"/>
              <label for="password">Password</label>
              <button type="button" class="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
                <span class="toggle-icon"></span>
              </button>
            </div>
            <span class="error-message" id="passwordError"></span>
          </div>

          <button onClick={register} type="submit" class="login-btn">
            <span class="btn-text">Sign Up</span>
            <span class="btn-loader"></span>
          </button>
        </form>

        <div class="signup-link">
          <p>Have an account? <a href="/Login">Sign In</a></p>
        </div>

        <div class="success-message" id="successMessage">
          <p>Redirecting to Sign-in page...</p>
        </div>
      </div>
    </div>
  );
}

export default SignUp