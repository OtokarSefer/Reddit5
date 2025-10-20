import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3333"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    async function fetchPost() {
      try {
        const res = await fetch(`${apiBase}/posts/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch post")
        setPost(data)
      } catch (err) {
        alert("Error: " + err.message)
      }
    }
    fetchPost()
  }, [id, apiBase, navigate])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (!post) return (
    <div className="home">
      <aside className="sidebar">
        <h2 className="logo">W4n0</h2>
        <button className="btn btn-primary" onClick={logout}>Logout</button>
      </aside>
      <main className="main">
        <p className="loading">Loading post...</p>
      </main>
    </div>
  )

  return (
    <div className="home">
      <aside className="sidebar">
        <h2 className="logo">W4n0</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/home")}>← Back</button>
        <button className="btn btn-primary" onClick={logout}>Logout</button>
      </aside>

      <main className="main">
        <article className="post-detail">
          <h1>{post.title}</h1>
          <p className="post-content">{post.content}</p>
          <small>Posted by {post.username || post.userEmail}</small>
        </article>
      </main>
    </div>
  )
}

export default PostPage