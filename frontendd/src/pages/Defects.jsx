import { useState, useEffect } from "react"
import { defectsAPI, projectsAPI } from "../api/api"

export default function Defects() {
  const [defects, setDefects]   = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title:"", severity:"Medium", status:"Open", project_id:"" })
  const [saving, setSaving]     = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true); setError("")
    try {
      const [def, proj] = await Promise.all([defectsAPI.getAll(), projectsAPI.getAll()])
      setDefects(def); setProjects(proj)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true)
    try {
      const created = await defectsAPI.create({ ...form, project_id: parseInt(form.project_id) })
      setDefects([...defects, created])
      setForm({ title:"", severity:"Medium", status:"Open", project_id:"" })
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this defect?")) return
    try {
      await defectsAPI.delete(id)
      setDefects(defects.filter(d => d.id !== id))
    } catch (err) { alert(err.message) }
  }

  const sevColor  = (s) => s === "Critical" ? "var(--red)" : s === "High" ? "var(--amber)" : s === "Medium" ? "var(--accent2)" : "var(--green)"
  const pillClass = (s) => s === "Open" ? "s-fail" : s === "Closed" ? "s-pass" : "s-pending"
  const projectName = (id) => projects.find(p => p.id === id)?.name || `Project ${id}`

  const inputStyle = { width:"100%", padding:"8px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:7, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }

  if (loading) return <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>Loading defects...</div>
  if (error)   return <div className="card" style={{ textAlign:"center", padding:40 }}><div style={{ color:"var(--red)", marginBottom:12 }}>{error}</div><button className="btn btn-ghost" onClick={fetchAll}>Retry</button></div>

  return (
    <>
      {showForm && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-header">
            <span className="card-title">Log New Defect</span>
            <button className="btn btn-ghost" style={{ fontSize:11 }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <form onSubmit={handleCreate} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>TITLE</div>
              <input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Defect title..." required style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>SEVERITY</div>
              <select value={form.severity} onChange={e => setForm({...form, severity:e.target.value})} style={inputStyle}>
                {["Critical","High","Medium","Low"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>STATUS</div>
              <select value={form.status} onChange={e => setForm({...form, status:e.target.value})} style={inputStyle}>
                {["Open","In Progress","Resolved","Closed"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>PROJECT</div>
              <select value={form.project_id} onChange={e => setForm({...form, project_id:e.target.value})} required style={inputStyle}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf:"flex-start" }} disabled={saving}>{saving ? "Saving..." : "Log Defect"}</button>
          </form>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:13, color:"var(--text3)" }}>{defects.length} defects found</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log Defect</button>
      </div>

      <div className="card" style={{ padding:0 }}>
        <table className="table">
          <thead><tr><th style={{ paddingLeft:18 }}>ID</th><th>Title</th><th>Project</th><th>Severity</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {defects.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--text3)", padding:24 }}>No defects found</td></tr>
            ) : defects.map(d => (
              <tr key={d.id}>
                <td style={{ paddingLeft:18, fontFamily:"var(--mono)", color:"var(--red)", fontSize:11 }}>DEF-{d.id}</td>
                <td style={{ fontWeight:500 }}>{d.title}</td>
                <td><span className="tag">{projectName(d.project_id)}</span></td>
                <td style={{ fontSize:10, fontWeight:600, fontFamily:"var(--mono)", color:sevColor(d.severity) }}>{d.severity}</td>
                <td><span className={`status-pill ${pillClass(d.status)}`}>{d.status}</span></td>
                <td>
                  <button className="btn btn-ghost" style={{ fontSize:10, padding:"3px 10px", color:"var(--red)", borderColor:"rgba(239,68,68,.3)" }} onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
