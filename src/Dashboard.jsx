import { useEffect, useRef } from "react"

const DEFECTS = [
  { id: "DEF-041", summary: "Login timeout on mobile Safari",  severity: "Critical", status: "Open"      },
  { id: "DEF-040", summary: "Export fails for >500 rows",      severity: "High",     status: "In Review" },
  { id: "DEF-039", summary: "Dashboard widget alignment",      severity: "Medium",   status: "Fixed"     },
  { id: "DEF-038", summary: "API rate limit not handled",      severity: "High",     status: "Open"      },
]

const RISKS = [
  { color: "var(--red)",   label: "High",   text: "Payment module has 78% failure risk — 3 untested edge cases detected." },
  { color: "var(--amber)", label: "Medium", text: "Auth service shows regression pattern from previous 2 sprints."        },
  { color: "var(--green)", label: "Low",    text: "Dashboard module stable — AI recommends reducing coverage by 15%."     },
]

const METRICS = [
  { label: "Total Test Cases", value: "248",   color: "var(--accent2)", delta: "▲ 18 this sprint",    up: true  },
  { label: "Pass Rate",        value: "87.4%", color: "var(--green)",   delta: "▲ 3.2% vs last",     up: true  },
  { label: "Open Defects",     value: "12",    color: "var(--red)",     delta: "▼ 3 critical",        up: false },
  { label: "AI Risk Score",    value: "6.2",   color: "var(--amber)",   delta: "▲ 0.8 from baseline", up: false },
]

const sevColor  = (s) => s === "Critical" ? "var(--red)" : s === "High" ? "var(--amber)" : "var(--green)"
const pillClass = (s) => s === "Open" ? "s-fail" : s === "Fixed" ? "s-pass" : "s-pending"

export default function Dashboard() {
  const trendRef = useRef(null)
  const donutRef = useRef(null)

  useEffect(() => { drawTrend(); drawDonut() }, [])

  function drawTrend() {
    const canvas = trendRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width = canvas.parentElement.clientWidth - 36
    const H = canvas.height = 130
    const days = ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10"]
    const pass = [72,78,80,75,83,86,85,88,87,89]
    const fail = [20,18,15,18,14,12,13,11,12,11]
    const pad = { l:30, r:10, t:10, b:24 }
    const ch = H - pad.t - pad.b, cw = W - pad.l - pad.r
    ctx.clearRect(0, 0, W, H)
    ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.lineWidth = 1
    ;[0,25,50,75,100].forEach(v => {
      const y = pad.t + ch * (1 - v/100)
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l+cw, y); ctx.stroke()
      ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.font = "10px DM Mono,monospace"
      ctx.textAlign = "right"; ctx.fillText(v+"%", pad.l-4, y+3)
    })
    const drawLine = (data, color) => {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2
      data.forEach((v,i) => { const x=pad.l+i*(cw/(days.length-1)), y=pad.t+ch*(1-v/100); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y) })
      ctx.stroke()
    }
    drawLine(pass, "#10b981"); drawLine(fail, "#ef4444")
    days.forEach((d,i) => { const x=pad.l+i*(cw/(days.length-1)); ctx.fillStyle="rgba(255,255,255,.3)"; ctx.font="10px DM Mono,monospace"; ctx.textAlign="center"; ctx.fillText(d,x,H-6) })
  }

  function drawDonut() {
    const canvas = donutRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width = canvas.parentElement.clientWidth - 36
    const H = canvas.height = 130
    const cx=W/2, cy=H/2, r=Math.min(cx,cy)-14, ir=r*0.58
    const slices=[{v:158,c:"#10b981"},{v:22,c:"#ef4444"},{v:18,c:"#f59e0b"},{v:50,c:"#475569"}]
    const total=slices.reduce((a,s)=>a+s.v,0)
    let angle=-Math.PI/2
    slices.forEach(s => { const ea=angle+(s.v/total)*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,ea); ctx.closePath(); ctx.fillStyle=s.c; ctx.fill(); angle=ea })
    ctx.beginPath(); ctx.arc(cx,cy,ir,0,Math.PI*2); ctx.fillStyle="#162035"; ctx.fill()
    ctx.fillStyle="#e2e8f0"; ctx.font="bold 16px DM Mono,monospace"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("248",cx,cy-6)
    ctx.fillStyle="#64748b"; ctx.font="10px DM Sans,sans-serif"; ctx.fillText("total",cx,cy+10)
  }

  return (
    <>
      <div className="metrics-grid">
        {METRICS.map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className={`metric-delta ${m.up ? "delta-up" : "delta-down"}`}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="three-col">
        <div className="card">
          <div className="card-header"><span className="card-title">Execution Trend — Sprint 14</span><span className="card-action">Full report →</span></div>
          <canvas ref={trendRef} />
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Result Distribution</span></div>
          <canvas ref={donutRef} />
          <div style={{ marginTop:12 }}>
            {[["Pass","var(--green)","158"],["Fail","var(--red)","22"],["Blocked","var(--amber)","18"],["Not Run","var(--text3)","50"]].map(([l,c,n]) => (
              <div key={l} style={{ display:"flex",alignItems:"center",gap:7,fontSize:11,color:"var(--text2)",marginBottom:5 }}>
                <div style={{ width:9,height:9,borderRadius:"50%",background:c,flexShrink:0 }}></div>
                {l}<span style={{ marginLeft:"auto",fontFamily:"var(--mono)",color:"var(--text)" }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header"><span className="card-title">Recent Defects</span><span className="card-action">View all →</span></div>
          <table className="table">
            <thead><tr><th>ID</th><th>Summary</th><th>Severity</th><th>Status</th></tr></thead>
            <tbody>
              {DEFECTS.map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily:"var(--mono)",color:"var(--accent2)" }}>{d.id}</td>
                  <td style={{ color:"var(--text2)" }}>{d.summary}</td>
                  <td style={{ fontSize:10,fontWeight:600,fontFamily:"var(--mono)",color:sevColor(d.severity) }}>{d.severity}</td>
                  <td><span className={`status-pill ${pillClass(d.status)}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ai-card">
          <div className="ai-badge">✦ AI Insights</div>
          <div className="card-title" style={{ marginBottom:12 }}>Risk Predictions</div>
          {RISKS.map(r => (
            <div className="ai-insight" key={r.label}>
              <div className="ai-dot" style={{ background:r.color }}></div>
              <div className="ai-text"><strong>{r.label} Risk:</strong> {r.text}</div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width:"100%",marginTop:12,fontSize:12 }}>Generate AI Test Cases</button>
        </div>
      </div>
    </>
  )
}
