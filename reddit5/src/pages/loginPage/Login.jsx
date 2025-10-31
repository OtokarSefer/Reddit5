import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const apiBase = import.meta.env.VITE_SERVER_URL

  async function login(e) {
    e.preventDefault();
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="header">
            <h2>Log In</h2>
          </div>
                
          <form className="form" id="loginForm" noValidate>
            <div className="form-group">
              <div className="input-wrapper">
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  autoComplete="email"
                />
                <label htmlFor="email">Email</label>
              </div>
              <span className="error-message" id="emailError"></span>
            </div>

            <div className="form-group">
              <div className="input-wrapper password-input-wrapper">
                <input 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  name="password" 
                  required 
                  autoComplete="current-password"
                />
                <label htmlFor="password">Password</label>
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className={`toggle-icon ${showPassword ? 'show-password' : ''}`}></span>
                </button>
              </div>
              <span className="error-message" id="passwordError"></span>
            </div>

            <button onClick={login} type="submit" className="btn btn-primary">
              <span className="btn-text">Log In</span>
              <span className="btn-loader"></span>
            </button>
          </form>

          <div className="link">
            <p>Don't have an account? <a href="/SignUp">Create one</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login