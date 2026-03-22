const RUNS = [
  { id:"RUN-089", name:"Smoke Suite — Payment",    executor:"Priya S.", progress:"94%",  started:"10:30 AM",  sc:"s-active" },
  { id:"RUN-088", name:"Regression — Auth Module", executor:"Dev T.",   progress:"100%", started:"Yesterday", sc:"s-pass"   },
  { id:"RUN-087", name:"API Contract Tests",        executor:"Rahul M.", progress:"67%",  started:"2 days ago",sc:"s-active" },
  { id:"RUN-086", name:"UI Sanity — Mobile",        executor:"Anjali R.",progress:"100%", started:"3 days ago",sc:"s-fail"   },
]

const runLabel = (sc) => sc === "s-active" ? "Running" : sc === "s-pass" ? "Passed" : "Failed"

export default function Execution() {
  return (
    <>
      <div className="metrics-grid">
        {[
          { label:"Executed", value:"186", sub:"of 248 total",    color:"var(--accent2)" },
          { label:"Passed",   value:"158", sub:"84.9% pass rate", color:"var(--green)"   },
          { label:"Failed",   value:"22",  sub:"11.8% fail rate", color:"var(--red)"     },
          { label:"Blocked",  value:"6",   sub:"3.2% blocked",    color:"var(--amber)"   },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color:m.color }}>{m.value}</div>
            <div className="metric-delta" style={{ color:"var(--text3)" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Active Execution Runs</span>
          <button className="btn btn-primary" style={{ fontSize:11 }}>+ Start Run</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Run ID</th><th>Suite Name</th><th>Executor</th><th>Progress</th><th>Started</th><th>Status</th></tr>
          </thead>
          <tbody>
            {RUNS.map(r => (
              <tr key={r.id}>
                <td style={{ fontFamily:"var(--mono)", color:"var(--accent2)", fontSize:11 }}>{r.id}</td>
                <td>{r.name}</td>
                <td style={{ color:"var(--text2)" }}>{r.executor}</td>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div className="progress-bar" style={{ flex:1, maxWidth:100 }}>
                      <div className="progress-fill" style={{ width:r.progress, background:"var(--accent)" }}></div>
                    </div>
                    <span style={{ fontSize:11, fontFamily:"var(--mono)" }}>{r.progress}</span>
                  </div>
                </td>
                <td style={{ color:"var(--text3)", fontSize:11 }}>{r.started}</td>
                <td><span className={`status-pill ${r.sc}`}>{runLabel(r.sc)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
