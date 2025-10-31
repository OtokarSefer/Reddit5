import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [me, setMe] = useState(null)
  const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3333"
  const token = localStorage.getItem("token")
  const isLoggedIn = useMemo(() => !!token, [token])

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(`${apiBase}/posts`)
      const data = await res.json()
      if (res.ok) setPosts(data)
    }
    fetchPosts()
  }, [apiBase])

  useEffect(() => {
    if (!isLoggedIn) return
    fetch(`${apiBase}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setMe)
      .catch(() => {})
  }, [apiBase, isLoggedIn, token])

  const addPost = async () => {
    if (!title.trim() || !content.trim()) return
    const res = await fetch(`${apiBase}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content })
    })
    const data = await res.json()
    if (res.ok) setPosts(prev => [data, ...prev])
  }

  const viewPost = (id) => navigate(`/post/${id}`)

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="home">
      <aside className="sidebar">
        <h2 className="logo">W4n0</h2>
        {isLoggedIn
          ? <button className="btn btn-primary" onClick={logout}>Logout</button>
          : <button className="btn btn-secondary" onClick={() => navigate("/login")}>Login</button>}
        <button className="btn btn-primary" onClick={() => navigate("/premium")}>Premium</button>
      </aside>

      <main className="main">
        {isLoggedIn && (
          <div className="create-post">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post..." />
            <button onClick={addPost} className="btn btn-primary">Post</button>
          </div>
        )}
        <div className="posts">
          {posts.map(p => (
            <div key={p.id} className="post" onClick={() => viewPost(p.id)}>
              <h3>{p.title}</h3>
              <p>{p.preview}{p.hasMore ? "..." : ""}</p>
              <small>by {p.username || p.userEmail}</small>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
