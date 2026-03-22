const DEFECTS = [
  { id:"DEF-041", summary:"Login timeout on mobile Safari",          module:"Auth",        severity:"Critical", assignee:"Priya S.", created:"2h ago", status:"Open"      },
  { id:"DEF-040", summary:"Export fails for datasets > 500 rows",    module:"Reports",     severity:"High",     assignee:"Dev T.",   created:"1d ago", status:"In Review" },
  { id:"DEF-039", summary:"Dashboard chart colors inverted",         module:"Dashboard",   severity:"Low",      assignee:"Anjali R.",created:"2d ago", status:"Fixed"     },
  { id:"DEF-038", summary:"API rate limit returns 200 instead of 429",module:"API Gateway",severity:"High",    assignee:"Rahul M.", created:"3d ago", status:"Open"      },
  { id:"DEF-037", summary:"Password reset email link expires early", module:"Auth",        severity:"Medium",   assignee:"Priya S.", created:"5d ago", status:"Fixed"     },
  { id:"DEF-036", summary:"CSV import fails for UTF-8 BOM files",    module:"Data",        severity:"Medium",   assignee:"Dev T.",   created:"6d ago", status:"In Review" },
]

const sevColor  = (s) => s === "Critical" ? "var(--red)" : s === "High" ? "var(--amber)" : s === "Medium" ? "var(--accent2)" : "var(--green)"
const pillClass = (s) => s === "Open" ? "s-fail" : s === "Fixed" ? "s-pass" : "s-pending"

export default function Defects() {
  return (
    <>
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
        <div className="tabs" style={{ marginBottom:0 }}>
          {["All","Open","In Review","Closed"].map((t,i) => (
            <div key={t} className={`tab ${i===0?"active":""}`}>{t}</div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginLeft:"auto" }}>+ Log Defect</button>
      </div>

      <div className="card" style={{ padding:0 }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ paddingLeft:18 }}>ID</th>
              <th>Summary</th><th>Module</th><th>Severity</th><th>Assignee</th><th>Created</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {DEFECTS.map(d => (
              <tr key={d.id}>
                <td style={{ paddingLeft:18, fontFamily:"var(--mono)", color:"var(--red)", fontSize:11 }}>{d.id}</td>
                <td style={{ color:"var(--text)" }}>{d.summary}</td>
                <td><span className="tag">{d.module}</span></td>
                <td style={{ fontSize:10, fontWeight:600, fontFamily:"var(--mono)", color:sevColor(d.severity) }}>{d.severity}</td>
                <td style={{ color:"var(--text2)", fontSize:12 }}>{d.assignee}</td>
                <td style={{ color:"var(--text3)", fontSize:11 }}>{d.created}</td>
                <td><span className={`status-pill ${pillClass(d.status)}`}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
