import "./Sidebar.css"

const NAV = [
  { section: "Overview" },
  { id: "dashboard", label: "Dashboard",   icon: "⬛" },
  { section: "QA Modules" },
  { id: "projects",  label: "Projects",    icon: "◈" },
  { id: "testcases", label: "Test Cases",  icon: "✦", badge: "248" },
  { id: "execution", label: "Execution",   icon: "▶" },
  { id: "defects",   label: "Defects",     icon: "⚠", badge: "12", badgeRed: true },
  { section: "Intelligence" },
  { id: "ai",        label: "AI Insights", icon: "✦" },
  { section: "Admin" },
  { id: "users",     label: "Users & Roles", icon: "◎" },
  { id: "settings",  label: "Settings",      icon: "⚙" },
]

export default function Sidebar({ activePage, onNavigate }) {
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
              {item.badge && (
                <span className={`badge ${item.badgeRed ? "red" : ""}`}>{item.badge}</span>
              )}
            </div>
          )
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-chip">
          <div className="avatar">AK</div>
          <div>
            <div className="user-name">Arjun Kumar</div>
            <div className="user-role">QA Lead</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
