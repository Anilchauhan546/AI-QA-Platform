const PROJECTS = [
  { name:"QA Matrix Core",   cycle:"Release 3.2", status:"Active",   prog:87, dates:"Jan 15 – Mar 30", cases:42, defects:8 },
  { name:"Mobile App QA",    cycle:"Sprint 14",   status:"Active",   prog:62, dates:"Feb 1 – Mar 15",  cases:18, defects:3 },
  { name:"API Gateway Tests", cycle:"Regression", status:"Active",   prog:94, dates:"Ongoing",          cases:67, defects:1 },
  { name:"Legacy Portal",    cycle:"Maintenance", status:"On Hold",  prog:100,dates:"Completed",        cases:30, defects:0 },
  { name:"Data Pipeline QA", cycle:"Release 1.0", status:"Planning", prog:0,  dates:"Apr 1 – May 15",  cases:12, defects:0 },
  { name:"Security Audit",   cycle:"Phase 2",     status:"Active",   prog:45, dates:"Mar 10 – Apr 5",  cases:9,  defects:4 },
]

const statusClass = (s) => s === "Active" ? "s-active" : s === "On Hold" ? "s-pending" : "s-pass"
const barColor    = (p) => p > 80 ? "var(--green)" : p > 50 ? "var(--accent)" : "var(--amber)"

export default function Projects() {
  return (
    <>
      <div className="tabs">
        {["All Projects","Active","Archived"].map((t,i) => (
          <div key={t} className={`tab ${i===0?"active":""}`}>{t}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {PROJECTS.map(p => (
          <div className="card" key={p.name}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:11, color:"var(--text3)" }}>{p.cycle} · {p.dates}</div>
              </div>
              <span className={`status-pill ${statusClass(p.status)}`}>{p.status}</span>
            </div>
            <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4 }}>Progress — {p.prog}%</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${p.prog}%`, background:barColor(p.prog) }}></div>
            </div>
            <div style={{ display:"flex", gap:16, marginTop:14 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--mono)" }}>{p.cases}</div>
                <div style={{ fontSize:10, color:"var(--text3)" }}>Test Cases</div>
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--mono)", color:p.defects>0?"var(--red)":"var(--green)" }}>{p.defects}</div>
                <div style={{ fontSize:10, color:"var(--text3)" }}>Defects</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
