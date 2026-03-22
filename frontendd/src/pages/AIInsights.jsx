import { useState, useEffect } from "react"
import { getToken } from "../api/api"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function aiRequest(path, method = "GET", body = null) {
  const res = await fetch(`${BASE_URL}/ai${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: body ? JSON.stringify(body) : null
  })
  if (!res.ok) throw new Error("AI request failed")
  return res.json()
}

export default function AIInsights() {
  const [risks, setRisks]         = useState([])
  const [summary, setSummary]     = useState(null)
  const [patterns, setPatterns]   = useState(null)
  const [loading, setLoading]     = useState(true)

  // Generate test cases
  const [requirement, setRequirement] = useState("")
  const [genCases, setGenCases]       = useState([])
  const [generating, setGenerating]   = useState(false)

  // Analyze defect
  const [defectDesc, setDefectDesc] = useState("")
  const [defectResult, setDefectResult] = useState(null)
  const [analyzing, setAnalyzing]   = useState(false)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [riskData, summaryData, patternData] = await Promise.all([
        aiRequest("/risk-analysis"),
        aiRequest("/test-summary"),
        aiRequest("/defect-patterns")
      ])
      setRisks(riskData.risk_analysis || [])
      setSummary(summaryData)
      setPatterns(patternData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerate(e) {
    e.preventDefault(); setGenerating(true)
    try {
      const data = await aiRequest("/generate-testcases", "POST", { requirement })
      setGenCases(data.generated_testcases || [])
    } catch (err) { alert(err.message) }
    finally { setGenerating(false) }
  }

  async function handleAnalyze(e) {
    e.preventDefault(); setAnalyzing(true)
    try {
      const data = await aiRequest("/analyze-defect", "POST", { description: defectDesc })
      setDefectResult(data)
    } catch (err) { alert(err.message) }
    finally { setAnalyzing(false) }
  }

  const riskColor = (level) => level === "High" ? "var(--red)" : level === "Medium" ? "var(--amber)" : "var(--green)"
  const inputStyle = { width:"100%", padding:"8px 12px", background:"var(--navy3)", border:"1px solid var(--border)", borderRadius:7, color:"var(--text)", fontSize:13, fontFamily:"var(--font)", outline:"none" }

  if (loading) return <div className="card" style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>Loading AI insights...</div>

  return (
    <>
      {/* Summary Cards */}
      {summary && (
        <div className="metrics-grid" style={{ marginBottom:20 }}>
          {[
            { label:"Total Test Cases", value: summary.total_testcases, color:"var(--accent2)" },
            { label:"Total Defects",    value: summary.total_defects,   color:"var(--red)"     },
            { label:"Open Defects",     value: summary.open_defects,    color:"var(--amber)"   },
            { label:"Health Score",     value: summary.health_score,    color:"var(--green)"   },
          ].map(m => (
            <div className="metric-card" key={m.label}>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ color:m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="two-col">
        {/* Risk Analysis */}
        <div className="ai-card">
          <div className="ai-badge">✦ Risk Prediction Engine</div>
          <div className="card-title" style={{ marginBottom:4 }}>Module Risk Analysis</div>
          <div style={{ fontSize:11, color:"var(--text3)", marginBottom:14 }}>Based on real defect & test data</div>
          {risks.length === 0 ? (
            <div style={{ color:"var(--text3)", fontSize:12 }}>No projects found. Create projects first!</div>
          ) : risks.map(r => (
            <div key={r.module} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span style={{ color:"var(--text2)" }}>{r.module}</span>
                <span style={{ color:riskColor(r.risk_level), fontFamily:"var(--mono)", fontWeight:600 }}>{r.risk_score}% — {r.risk_level}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${r.risk_score}%`, background:riskColor(r.risk_level) }}></div>
              </div>
              <div style={{ fontSize:10, color:"var(--text3)", marginTop:3 }}>{r.recommendation}</div>
            </div>
          ))}
        </div>

        {/* Defect Patterns */}
        <div className="card">
          <div className="ai-badge" style={{ background:"rgba(239,68,68,.15)", color:"#f87171", borderColor:"rgba(239,68,68,.3)" }}>✦ Defect Patterns</div>
          <div className="card-title" style={{ marginBottom:12 }}>AI Pattern Detection</div>
          {patterns && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {Object.entries(patterns.severity_breakdown).map(([sev, count]) => (
                  <div key={sev} style={{ padding:"8px 12px", background:"rgba(0,0,0,.2)", borderRadius:7 }}>
                    <div style={{ fontSize:10, color:"var(--text3)", marginBottom:2 }}>{sev}</div>
                    <div style={{ fontSize:18, fontWeight:600, fontFamily:"var(--mono)", color:sev==="Critical"?"var(--red)":sev==="High"?"var(--amber)":"var(--text)" }}>{count}</div>
                  </div>
                ))}
              </div>
              {patterns.patterns.map((p, i) => (
                <div className="ai-insight" key={i}>
                  <div className="ai-dot" style={{ background:"var(--amber)" }}></div>
                  <div className="ai-text">{p}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="two-col" style={{ marginTop:14 }}>
        {/* Generate Test Cases */}
        <div className="card">
          <div className="ai-badge" style={{ background:"rgba(16,185,129,.15)", color:"#34d399", borderColor:"rgba(16,185,129,.3)" }}>✦ Test Generator</div>
          <div className="card-title" style={{ marginBottom:12 }}>Generate Test Cases from Requirement</div>
          <form onSubmit={handleGenerate} style={{ display:"flex", gap:8, marginBottom:14 }}>
            <input
              value={requirement}
              onChange={e => setRequirement(e.target.value)}
              placeholder="e.g. User login with email and password"
              required
              style={{ ...inputStyle, flex:1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={generating}>
              {generating ? "..." : "Generate"}
            </button>
          </form>
          {genCases.map((tc, i) => (
            <div className="ai-insight" key={i} style={{ marginBottom:6 }}>
              <div className="ai-dot" style={{ background:"var(--green)" }}></div>
              <div style={{ fontSize:12, color:"var(--text2)" }}>{tc}</div>
            </div>
          ))}
        </div>

        {/* Analyze Defect */}
        <div className="card">
          <div className="ai-badge" style={{ background:"rgba(245,158,11,.15)", color:"#fbbf24", borderColor:"rgba(245,158,11,.3)" }}>✦ Defect Analyzer</div>
          <div className="card-title" style={{ marginBottom:12 }}>AI Severity Prediction</div>
          <form onSubmit={handleAnalyze} style={{ display:"flex", gap:8, marginBottom:14 }}>
            <input
              value={defectDesc}
              onChange={e => setDefectDesc(e.target.value)}
              placeholder="Describe the defect..."
              required
              style={{ ...inputStyle, flex:1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={analyzing}>
              {analyzing ? "..." : "Analyze"}
            </button>
          </form>
          {defectResult && (
            <div style={{ padding:14, background:"rgba(0,0,0,.2)", borderRadius:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"var(--text2)" }}>Predicted Severity</span>
                <span style={{ fontWeight:600, fontFamily:"var(--mono)", color:riskColor(defectResult.predicted_severity === "Critical" ? "High" : defectResult.predicted_severity) }}>{defectResult.predicted_severity}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:12, color:"var(--text2)" }}>Confidence</span>
                <span style={{ fontFamily:"var(--mono)", color:"var(--green)" }}>{defectResult.confidence}</span>
              </div>
              <div style={{ fontSize:11, color:"var(--text3)", lineHeight:1.5, borderTop:"1px solid var(--border)", paddingTop:8 }}>{defectResult.suggestion}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
