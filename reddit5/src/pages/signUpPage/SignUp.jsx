import { useState } from 'react'

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const apiBase = import.meta.env.VITE_SERVER_URL

  async function register(e) {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password || !username) {

      setIsLoading(false)
      return
    }

    if (password.length < 6) {

      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${apiBase}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)


      window.location.href = "/login"
    } catch (err) {
      console.error(err)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="header">
            <h2>Sign Up</h2>
          </div>
          <form className="form" onSubmit={register} noValidate>
            
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
                  disabled={isLoading}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
                <label htmlFor="username">Username</label>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="signup-link">
            <p>Have an account? <a href="/login">Sign In</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp