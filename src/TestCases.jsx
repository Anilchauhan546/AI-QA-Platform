const CASES = [
  { id:"TC-248", title:"Verify payment gateway timeout handling", module:"Payments",    priority:"High",     type:"Functional", run:"2h ago",  status:"Pass"    },
  { id:"TC-247", title:"Login with SSO provider redirect",        module:"Auth",        priority:"Critical", type:"Regression", run:"1d ago",  status:"Fail"    },
  { id:"TC-246", title:"Export CSV with special characters",      module:"Reports",     priority:"Medium",   type:"Functional", run:"3d ago",  status:"Pass"    },
  { id:"TC-245", title:"API rate limit enforcement",              module:"API Gateway", priority:"High",     type:"API",        run:"4d ago",  status:"Pass"    },
  { id:"TC-244", title:"Dashboard widget data accuracy",          module:"Dashboard",   priority:"Low",      type:"UI",         run:"5d ago",  status:"Pending" },
  { id:"TC-243", title:"User role permission boundaries",         module:"Users",       priority:"Critical", type:"Security",   run:"1w ago",  status:"Pass"    },
  { id:"TC-242", title:"Mobile responsive layout — 375px",        module:"Frontend",    priority:"Medium",   type:"UI",         run:"1w ago",  status:"Fail"    },
]

const priColor  = (p) => p === "Critical" ? "var(--red)" : p === "High" ? "var(--amber)" : "var(--text2)"
const pillClass = (s) => s === "Pass" ? "s-pass" : s === "Fail" ? "s-fail" : "s-pending"

export default function TestCases() {
  return (
    <>
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
        <div className="tabs" style={{ marginBottom:0 }}>
          {["All","Functional","Regression","API","UI"].map((t,i) => (
            <div key={t} className={`tab ${i===0?"active":""}`}>{t}</div>
          ))}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <button className="btn btn-ghost">Filter</button>
          <button className="btn btn-ghost">Import</button>
          <button className="btn btn-primary">+ New Case</button>
        </div>
      </div>

      <div className="card" style={{ padding:0 }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ paddingLeft:18 }}>ID</th>
              <th>Title</th><th>Module</th><th>Priority</th><th>Type</th><th>Last Run</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {CASES.map(c => (
              <tr key={c.id}>
                <td style={{ paddingLeft:18, fontFamily:"var(--mono)", color:"var(--accent2)", fontSize:11 }}>{c.id}</td>
                <td>{c.title}</td>
                <td><span className="tag">{c.module}</span></td>
                <td style={{ color:priColor(c.priority), fontWeight:500, fontSize:12 }}>{c.priority}</td>
                <td style={{ color:"var(--text3)", fontSize:11 }}>{c.type}</td>
                <td style={{ color:"var(--text3)", fontSize:11 }}>{c.run}</td>
                <td><span className={`status-pill ${pillClass(c.status)}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
