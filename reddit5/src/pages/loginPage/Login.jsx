import { useState } from 'react'
import './login.css'


function Login() {
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ token, setToken ] = useState("")
  const [ message, setMessage ] = useState("")

  const apiBase = import.meta.env.VITE_SERVER_URL

  async function login(e) {
    e.preventDefault(); // Prevent form submission
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem("token", data.idToken);
      window.location.href = "/home";
    } catch (err) {
      alert(`Login failed: ${err.message}`)
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Log In</h2>
        </div>
            
        <form className="login-form" id="loginForm" noValidate>
          <div className="form-group">
            <div className="input-wrapper">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                id="email" 
                name="email" 
                required autoComplete="email"/>
              <label htmlFor="email">Email</label>
            </div>
            <span className="error-message" id="emailError"></span>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                id="password" 
                name="password" 
                required autoComplete="current-password"/>
              <label htmlFor="password">Password</label>
              <button type="button" className="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
                <span className="toggle-icon"></span>
              </button>
            </div>
            <span className="error-message" id="passwordError"></span>
          </div>

          <button onClick={login} type="submit" className="login-btn">
            <span className="btn-text">Sign In</span>
            <span className="btn-loader"></span>
          </button>
        </form>

        <div className="signup-link">
          <p>Don't have an account? <a href="/SignUp">Create one</a></p>
        </div>

        <div className="success-message" id="successMessage">
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    </div>
  );
}

export default Login