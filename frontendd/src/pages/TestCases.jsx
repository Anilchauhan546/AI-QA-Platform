import { useState, useEffect } from "react"
import { testcasesAPI, projectsAPI } from "../api/api"

export default function TestCases() {
  const [cases, setCases]       = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title:"", steps:"", expected:"", project_id:"" })
  const [saving, setSaving]     = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true); setError("")
    try {
      const [tc, proj] = await Promise.all([testcasesAPI.getAll(), projectsAPI.getAll()])
      setCases(tc); setProjects(proj)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true)
    try {
      const created = await testcasesAPI.create({ ...form, project_id: parseInt(form.project_id) })
      setCases([...cases, created])
      setForm({ title:"", steps:"", expected:"", project_id:"" })
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this test case?")) return
    try {
      await testcasesAPI.delete(id)
      setCases(cases.filter(c => c.id !== id))
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>Loading test cases...</div>
  if (error)   return <div className="card" style={{ textAlign:"center", padding:40 }}><div style={{ color:"var(--red)", marginBottom:12 }}>{error}</div><button className="btn btn-ghost" onClick={fetchAll}>Retry</button></div>

  const projectName = (id) => projects.find(p => p.id === id)?.name || `Project ${id}`

  return (
    <>
      {showForm && (
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-header">
            <span className="card-title">New Test Case</span>
            <button className="btn btn-ghost" style={{ fontSize:11 }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[["TITLE","title","e.g. Verify login flow"],["STEPS","steps","Step 1, Step 2..."],["EXPECTED","expected","Expected outcome"]].map(([label, key, ph]) => (
              <div key={key}>
                <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>{label}</div>
                <input value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})} placeholder={ph} required
                  style={{ width:"100%", padding:"8px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:7, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5 }}>PROJECT</div>
              <select value={form.project_id} onChange={e => setForm({...form, project_id:e.target.value})} required
                style={{ width:"100%", padding:"8px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:7, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf:"flex-start" }} disabled={saving}>{saving ? "Saving..." : "Create Test Case"}</button>
          </form>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ fontSize:13, color:"var(--text3)" }}>{cases.length} test cases</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Case</button>
      </div>

      <div className="card" style={{ padding:0 }}>
        <table className="table">
          <thead><tr><th style={{ paddingLeft:18 }}>ID</th><th>Title</th><th>Project</th><th>Steps</th><th>Expected</th><th>Actions</th></tr></thead>
          <tbody>
            {cases.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", color:"var(--text3)", padding:24 }}>No test cases found</td></tr>
            ) : cases.map(c => (
              <tr key={c.id}>
                <td style={{ paddingLeft:18, fontFamily:"var(--mono)", color:"var(--accent2)", fontSize:11 }}>TC-{c.id}</td>
                <td style={{ fontWeight:500 }}>{c.title}</td>
                <td><span className="tag">{projectName(c.project_id)}</span></td>
                <td style={{ color:"var(--text3)", fontSize:11, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.steps}</td>
                <td style={{ color:"var(--text3)", fontSize:11, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.expected}</td>
                <td>
                  <button className="btn btn-ghost" style={{ fontSize:10, padding:"3px 10px", color:"var(--red)", borderColor:"rgba(239,68,68,.3)" }} onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
