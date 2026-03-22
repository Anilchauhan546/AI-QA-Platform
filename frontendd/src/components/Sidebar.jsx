import "./Sidebar.css"

const NAV = [
  { section: "Overview" },
  { id: "dashboard", label: "Dashboard",    icon: "⬛" },
  { section: "QA Modules" },
  { id: "projects",  label: "Projects",     icon: "◈" },
  { id: "testcases", label: "Test Cases",   icon: "✦" },
  { id: "defects",   label: "Defects",      icon: "⚠" },
  { section: "Intelligence" },
  { id: "ai",        label: "AI Insights",  icon: "✦" },
  { section: "Admin" },
  { id: "users",     label: "Users & Roles", icon: "◎" },
  { id: "settings",  label: "Settings",      icon: "⚙" },
]

export default function Sidebar({ activePage, onNavigate, user, onLogout }) {
  const initials = user?.username?.slice(0, 2).toUpperCase() || "??"

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">QA</div>
        <div>
          <div className="logo-text">QAMatrix</div>
          <div className="logo-sub">AI-Driven Platform</div>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section">{item.section}</div>
          ) : (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          )
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-chip">
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <div
            onClick={onLogout}
            title="Logout"
            style={{ cursor:"pointer", color:"var(--text3)", fontSize:14, padding:"2px 4px" }}
          >⏻</div>
        </div>
      </div>
    </aside>
  )
}
