const RISKS = [
  { module:"Payment Gateway", pct:"78%", color:"var(--red)"   },
  { module:"Auth Service",    pct:"61%", color:"var(--amber)" },
  { module:"API Gateway",     pct:"44%", color:"var(--amber)" },
  { module:"Reporting",       pct:"29%", color:"var(--green)" },
  { module:"Dashboard",       pct:"18%", color:"var(--green)" },
  { module:"User Mgmt",       pct:"12%", color:"var(--green)" },
]

const GEN_CASES = [
  { id:"TC-AI-018", title:"Verify payment retry on gateway timeout with idempotency key", module:"Payments" },
  { id:"TC-AI-017", title:"SSO token refresh race condition — concurrent requests",        module:"Auth"     },
  { id:"TC-AI-016", title:"API pagination edge case: last page empty response",           module:"API"      },
]

const RECS = [
  { title:"Reduce Coverage",     desc:"Dashboard is over-tested by ~32%. Reallocate 15 cases to Payment gateway.", color:"var(--accent2)" },
  { title:"Prioritize Regression",desc:"Auth module shows recurring defect pattern. Run full regression before Release 3.2.", color:"var(--amber)" },
  { title:"Flaky Test Alert",    desc:"TC-201, TC-187, TC-165 show inconsistent results. Quarantine and re-evaluate.", color:"var(--red)" },
]

export default function AIInsights() {
  return (
    <>
      <div className="two-col">
        <div className="ai-card">
          <div className="ai-badge">✦ Risk Prediction Engine</div>
          <div className="card-title" style={{ marginBottom:4 }}>Module Risk Analysis</div>
          <div style={{ fontSize:11, color:"var(--text3)", marginBottom:14 }}>Last updated 15 minutes ago</div>
          {RISKS.map(r => (
            <div key={r.module} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span style={{ color:"var(--text2)" }}>{r.module}</span>
                <span style={{ color:r.color, fontFamily:"var(--mono)", fontWeight:600 }}>{r.pct}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:r.pct, background:r.color }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="ai-badge" style={{ background:"rgba(16,185,129,.15)", color:"#34d399", borderColor:"rgba(16,185,129,.3)" }}>✦ Test Generator</div>
          <div className="card-title" style={{ marginBottom:12 }}>AI-Generated Test Cases</div>
          {GEN_CASES.map(c => (
            <div className="ai-insight" key={c.id} style={{ marginBottom:8 }}>
              <div className="ai-dot" style={{ background:"var(--green)" }}></div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontFamily:"var(--mono)", color:"var(--accent2)", marginBottom:2 }}>
                  {c.id} <span className="tag">{c.module}</span>
                </div>
                <div style={{ fontSize:12, color:"var(--text2)" }}>{c.title}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width:"100%", marginTop:12, fontSize:12 }}>Generate 10 More Cases</button>
        </div>
      </div>

      <div className="card" style={{ marginTop:14 }}>
        <div className="card-header">
          <span className="card-title">AI Recommendations</span>
          <span className="ai-badge">✦ Powered by AI Engine</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {RECS.map(r => (
            <div key={r.title} style={{ padding:14, background:"rgba(0,0,0,.2)", borderRadius:8, borderLeft:`3px solid ${r.color}` }}>
              <div style={{ fontSize:12, fontWeight:600, color:r.color, marginBottom:6 }}>{r.title}</div>
              <div style={{ fontSize:11, color:"var(--text2)", lineHeight:1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
