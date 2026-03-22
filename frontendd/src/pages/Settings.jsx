const SECTIONS = [
  { title:"General",        desc:"Platform name, timezone, and defaults"  },
  { title:"Authentication", desc:"JWT settings, SSO, session timeout"     },
  { title:"Notifications",  desc:"Email alerts, Slack integration"        },
  { title:"AI Engine",      desc:"Model config, confidence thresholds"    },
  { title:"Integrations",   desc:"Jira, GitHub CI, Docker registry"       },
]

export default function Settings() {
  return (
    <div style={{ maxWidth:600, display:"flex", flexDirection:"column", gap:14 }}>
      {SECTIONS.map(s => (
        <div className="card" key={s.title} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
          <div>
            <div style={{ fontWeight:600, fontSize:13, marginBottom:3 }}>{s.title}</div>
            <div style={{ fontSize:11, color:"var(--text3)" }}>{s.desc}</div>
          </div>
          <span style={{ color:"var(--text3)" }}>→</span>
        </div>
      ))}
    </div>
  )
}
