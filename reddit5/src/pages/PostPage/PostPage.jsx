import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3333"

  useEffect(() => {
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
  }, [id, apiBase])

  if (!post) return <p className="loading">Loading post...</p>

  return (
    <div className="post-page-wrapper">
      <div className="post-page-container">
        <button className="back-btn" onClick={() => navigate("/Home")}>← Back</button>
        <article className="post-box">
          <h1>{post.title}</h1>
          <p className="post-content">{post.content}</p>
          <small>Posted by {post.username || post.userEmail}</small>
        </article>
      </div>
    </div>
  )
}

export default PostPage