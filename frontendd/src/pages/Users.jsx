import { useState, useEffect } from "react"
import { usersAPI } from "../api/api"

export default function Users() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState("")

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true); setError("")
    try {
      const data = await usersAPI.getAll()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return
    try {
      await usersAPI.delete(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <LoadingCard />
  if (error)   return <ErrorCard message={error} onRetry={fetchUsers} />

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Team Members & Roles</span>
        <span style={{ fontSize:11, color:"var(--text3)" }}>{users.length} users</span>
      </div>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Username</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign:"center", color:"var(--text3)", padding:24 }}>No users found</td></tr>
          ) : users.map((u, i) => (
            <tr key={u.id}>
              <td style={{ fontFamily:"var(--mono)", color:"var(--text3)", fontSize:11 }}>{i + 1}</td>
              <td>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div className="avatar" style={{ width:26, height:26, fontSize:10 }}>
                    {u.username.slice(0,2).toUpperCase()}
                  </div>
                  <span>{u.username}</span>
                </div>
              </td>
              <td><span className="status-pill s-active">{u.role}</span></td>
              <td>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize:10, padding:"3px 10px", color:"var(--red)", borderColor:"rgba(239,68,68,.3)" }}
                  onClick={() => handleDelete(u.id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="card" style={{ textAlign:"center", padding:40 }}>
      <div style={{ color:"var(--text3)", fontSize:13 }}>Loading users from backend...</div>
    </div>
  )
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="card" style={{ textAlign:"center", padding:40 }}>
      <div style={{ color:"var(--red)", fontSize:13, marginBottom:12 }}>Error: {message}</div>
      <button className="btn btn-ghost" onClick={onRetry}>Retry</button>
    </div>
  )
}
