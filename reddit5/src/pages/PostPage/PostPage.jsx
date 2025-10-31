import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"

function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [previewPost, setPreviewPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3333"
  const token = localStorage.getItem("token")
  const isLoggedIn = useMemo(() => !!token, [token])

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await fetch(`${apiBase}/posts/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        if (res.status === 200) {
          setPost(await res.json())
        } else if (res.status === 402) {
          const data = await res.json()
          setPreviewPost(data.post)
        } else {
          throw new Error("Failed to fetch post")
        }
      } catch (err) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, apiBase, token])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (loading) return <p>Loading...</p>

  if (post) {
    return (
      <div className="home">
        <aside className="sidebar">
          <h2 className="logo">W4n0</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/home")}>← Back</button>
          <button className="btn btn-primary" onClick={logout}>Logout</button>
        </aside>
        <main className="main">
          <h1>{post.title}</h1>
          <p className="post-content">{post.content}</p>
          <small>Posted by {post.username || post.userEmail}</small>
        </main>
      </div>
    )
  }

  if (previewPost) {
    return (
      <div className="home">
        <aside className="sidebar">
          <h2 className="logo">W4n0</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/home")}>← Back</button>
          {isLoggedIn
            ? <button className="btn btn-primary" onClick={logout}>Logout</button>
            : <button className="btn btn-secondary" onClick={() => navigate("/login")}>Login</button>}
        </aside>

        <main className="main">
          <h1>{previewPost.title}</h1>
          <p>{previewPost.preview}{previewPost.hasMore ? "..." : ""}</p>
          <div className="paywall">
            <h3>Subscribe to continue reading</h3>
            {isLoggedIn
              ? <button className="btn btn-primary" onClick={() => navigate("/Premium")}>Get Premium</button>
              : <button className="btn btn-secondary" onClick={() => navigate("/register")}>Create account</button>}
          </div>
        </main>
      </div>
    )
  }

  return null
}

export default PostPage