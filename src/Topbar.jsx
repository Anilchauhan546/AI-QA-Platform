import "./Topbar.css"

export default function Topbar({ title, sub, cta }) {
  return (
    <header className="topbar">
      <div className="topbar-info">
        <div className="page-title">{title}</div>
        <div className="page-sub">{sub}</div>
      </div>
      <div className="topbar-actions">
        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input placeholder="Search..." />
        </div>
        <button className="btn btn-ghost">Export</button>
        <button className="btn btn-primary">{cta}</button>
      </div>
    </header>
  )
}
