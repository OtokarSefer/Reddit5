import { useEffect, useState } from "react"

export default function SubscribePage() {
  const apiBase = import.meta.env.VITE_SERVER_URL || "http://localhost:3333"
  const token = localStorage.getItem("token")
  const [active, setActive] = useState(false)

  useEffect(() => {
    fetch(`${apiBase}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setActive(d.subscription?.active))
  }, [apiBase, token])

  const toggle = async () => {
    const r = await fetch(`${apiBase}/dev/toggle-subscription`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
    const d = await r.json()
    if (r.ok) setActive(d.active)
  }

  return (
    <div>
      <h1>Subscription</h1>
      <p>Status: {active ? "Active" : "Inactive"}</p>
      <button onClick={toggle}>Toggle Subscription (dev)</button>
    </div>
  )
}
