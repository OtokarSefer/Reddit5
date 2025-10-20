import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3333"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    async function fetchPosts() {
      try {
        const res = await fetch(`${apiBase}/posts`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch posts")
        setPosts(data)
      } catch (err) {
        alert("Error loading posts: " + err.message)
      }
    }

    fetchPosts()
  }, [navigate, apiBase])

  const addPost = async () => {
    const token = localStorage.getItem("token")
    if (!title.trim() || !content.trim()) {
      alert("Both title and content are required")
      return
    }
    try {
      const res = await fetch(`${apiBase}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add post")
      setPosts((prev) => [data, ...prev])
      setTitle("")
      setContent("")
    } catch (err) {
      alert(err.message)
    }
  }

  const viewPost = (id) => {
    navigate(`/post/${id}`)
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="home">
      <aside className="sidebar">
        <h2 className="logo">W4n0</h2>
        <button className="btn btn-primary" onClick={logout}>Logout</button>
      </aside>

      <main className="main">
        <div className="create-post">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
          />
          <button onClick={addPost} className="btn btn-primary">Post</button>
        </div>
        <div className="posts">
          {posts.length === 0 ? (
            <p className="no-posts">No posts yet...</p>
          ) : (
            posts.map((p) => {
              const preview = p.content
                ? p.content.slice(0, 100)
                : p.text
                ? p.text.slice(0, 100)
                : "(no content)"
              return (
                <div key={p.id} className="post" onClick={() => viewPost(p.id)}>
                  <h3>{p.title || "Untitled Post"}</h3>
                  <p>{preview}...</p>
                  <small>by {p.username || p.userEmail}</small>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

export default Home