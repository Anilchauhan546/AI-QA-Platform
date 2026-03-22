import { useState } from "react"
import { authAPI, setToken, setUser } from "../api/api"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      const data = await authAPI.login(username, password)
      setToken(data.access_token)
      setUser({ username, role: data.role })
      onLogin({ username, role: data.role })
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--navy)" }}>
      <div style={{ background:"var(--navy2)", border:"1px solid var(--border)", borderRadius:14, padding:"40px 36px", width:360 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <div style={{ width:38, height:38, background:"var(--accent)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--mono)", fontWeight:700, fontSize:16, color:"#fff" }}>QA</div>
          <div>
            <div style={{ fontWeight:600, fontSize:16 }}>QAMatrix</div>
            <div style={{ fontSize:11, color:"var(--text3)" }}>AI-Driven Platform</div>
          </div>
        </div>

        <div style={{ fontSize:18, fontWeight:600, marginBottom:6 }}>Sign in</div>
        <div style={{ fontSize:12, color:"var(--text3)", marginBottom:24 }}>Enter your credentials to continue</div>

        {error && (
          <div style={{ background:"rgba(239,68,68,.12)", border:"1px solid rgba(239,68,68,.3)", color:"#f87171", borderRadius:8, padding:"10px 14px", fontSize:12, marginBottom:16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:6, fontWeight:500 }}>USERNAME</div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              style={{ width:"100%", padding:"9px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }}
            />
          </div>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:6, fontWeight:500 }}>PASSWORD</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{ width:"100%", padding:"9px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:8, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width:"100%", padding:"10px", background:"var(--accent)", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"var(--font)", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
