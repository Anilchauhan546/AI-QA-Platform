import { useState, useEffect } from "react"
import { projectsAPI } from "../api/api"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ name:"", description:"" })
  const [saving, setSaving]     = useState(false)

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    setLoading(true); setError("")
    try {
      const data = await projectsAPI.getAll()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true)
    try {
      const created = await projectsAPI.create(form)
      setProjects([...projects, created])
      setForm({ name:"", description:"" })
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return
    try {
      await projectsAPI.delete(id)
      setProjects(projects.filter(p => p.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>Loading projects...</div>
  if (error)   return <div className="card" style={{ textAlign:"center", padding:40 }}><div style={{ color:"var(--red)", marginBottom:12 }}>{error}</div><button className="btn btn-ghost" onClick={fetchProjects}>Retry</button></div>

  return (
    <>
      {/* New Project Form */}
      {showForm && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-header">
            <span className="card-title">New Project</span>
            <button className="btn btn-ghost" style={{ fontSize:11 }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>PROJECT NAME</div>
              <input
                value={form.name}
                onChange={e => setForm({...form, name:e.target.value})}
                placeholder="e.g. Mobile App QA"
                required
                style={{ width:"100%", padding:"8px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:7, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }}
              />
            </div>
            <div>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>DESCRIPTION</div>
              <input
                value={form.description}
                onChange={e => setForm({...form, description:e.target.value})}
                placeholder="Short description..."
                required
                style={{ width:"100%", padding:"8px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:7, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }}
              />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Creating..." : "Create Project"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:13, color:"var(--text3)" }}>{projects.length} projects found</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Project</button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>
          No projects yet. Create your first project!
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {projects.map(p => (
            <div className="card" key={p.id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", lineHeight:1.4 }}>{p.description}</div>
                </div>
                <span className="status-pill s-active">Active</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
                <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--mono)" }}>ID: {p.id}</div>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize:10, padding:"3px 10px", color:"var(--red)", borderColor:"rgba(239,68,68,.3)" }}
                  onClick={() => handleDelete(p.id)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
