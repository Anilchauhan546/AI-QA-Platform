import { useState, useEffect, useRef } from "react"
import { projectsAPI, testcasesAPI, defectsAPI, usersAPI } from "../api/api"

export default function Dashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const trendRef = useRef(null)
  const donutRef = useRef(null)

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { if (stats) { drawTrend(); drawDonut() } }, [stats])

  async function fetchStats() {
    setLoading(true)
    try {
      const [projects, testcases, defects, users] = await Promise.all([
        projectsAPI.getAll(),
        testcasesAPI.getAll(),
        defectsAPI.getAll(),
        usersAPI.getAll(),
      ])
      setStats({ projects, testcases, defects, users })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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
    const canvas = donutRef.current; if (!canvas || !stats) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width = canvas.parentElement.clientWidth - 36
    const H = canvas.height = 130
    const total = stats.testcases.length || 1
    const cx=W/2, cy=H/2, r=Math.min(cx,cy)-14, ir=r*0.58
    const slices=[{v:Math.max(1,total),c:"#10b981"},{v:stats.defects.length||0,c:"#ef4444"}]
    const sum = slices.reduce((a,s)=>a+s.v,0)
    let angle=-Math.PI/2
    slices.forEach(s => { const ea=angle+(s.v/sum)*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,angle,ea); ctx.closePath(); ctx.fillStyle=s.c; ctx.fill(); angle=ea })
    ctx.beginPath(); ctx.arc(cx,cy,ir,0,Math.PI*2); ctx.fillStyle="#162035"; ctx.fill()
    ctx.fillStyle="#e2e8f0"; ctx.font="bold 16px DM Mono,monospace"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(total,cx,cy-6)
    ctx.fillStyle="#64748b"; ctx.font="10px DM Sans,sans-serif"; ctx.fillText("cases",cx,cy+10)
  }

  if (loading) return <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>Loading dashboard...</div>

  const openDefects = stats.defects.filter(d => d.status === "Open").length

  return (
    <>
      <div className="metrics-grid">
        {[
          { label:"Projects",    value: stats.projects.length,  color:"var(--accent2)", delta:"from backend" },
          { label:"Test Cases",  value: stats.testcases.length, color:"var(--green)",   delta:"total cases"  },
          { label:"Open Defects",value: openDefects,            color:"var(--red)",     delta:"needs attention" },
          { label:"Team Members",value: stats.users.length,     color:"var(--amber)",   delta:"registered users" },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color:m.color }}>{m.value}</div>
            <div className="metric-delta" style={{ color:"var(--text3)" }}>{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="three-col">
        <div className="card">
          <div className="card-header"><span className="card-title">Execution Trend</span></div>
          <canvas ref={trendRef} />
        </div>
        <div className="card">
          <div className="card-header"><span className="card-title">Test Cases vs Defects</span></div>
          <canvas ref={donutRef} />
          <div style={{ marginTop:12 }}>
            {[["Test Cases","var(--green)",stats.testcases.length],["Defects","var(--red)",stats.defects.length]].map(([l,c,n]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"var(--text2)", marginBottom:5 }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:c, flexShrink:0 }}></div>
                {l}<span style={{ marginLeft:"auto", fontFamily:"var(--mono)", color:"var(--text)" }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header"><span className="card-title">Recent Projects</span></div>
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Description</th></tr></thead>
            <tbody>
              {stats.projects.slice(-4).reverse().map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily:"var(--mono)", color:"var(--accent2)", fontSize:11 }}>#{p.id}</td>
                  <td style={{ fontWeight:500 }}>{p.name}</td>
                  <td style={{ color:"var(--text3)", fontSize:11 }}>{p.description}</td>
                </tr>
              ))}
              {stats.projects.length === 0 && <tr><td colSpan={3} style={{ color:"var(--text3)", textAlign:"center" }}>No projects yet</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Recent Defects</span></div>
          <table className="table">
            <thead><tr><th>ID</th><th>Title</th><th>Status</th></tr></thead>
            <tbody>
              {stats.defects.slice(-4).reverse().map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily:"var(--mono)", color:"var(--red)", fontSize:11 }}>DEF-{d.id}</td>
                  <td style={{ fontSize:12 }}>{d.title}</td>
                  <td><span className={`status-pill ${d.status==="Open"?"s-fail":d.status==="Closed"?"s-pass":"s-pending"}`}>{d.status}</span></td>
                </tr>
              ))}
              {stats.defects.length === 0 && <tr><td colSpan={3} style={{ color:"var(--text3)", textAlign:"center" }}>No defects yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
