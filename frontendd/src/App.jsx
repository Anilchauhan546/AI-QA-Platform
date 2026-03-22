import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import TestCases from "./pages/TestCases"
import Defects from "./pages/Defects"
import AIInsights from "./pages/AIInsights"
import Users from "./pages/Users"
import Settings from "./pages/Settings"
import { getToken, getUser, clearAuth } from "./api/api"
import "./styles/global.css"

const PAGES = {
  dashboard: { title: "Quality Dashboard",      sub: "Live data from backend",            cta: "+ New Test",    component: Dashboard  },
  projects:  { title: "Projects & Test Cycles", sub: "Manage active projects and cycles", cta: "+ New Project", component: Projects   },
  testcases: { title: "Test Case Repository",   sub: "All test cases",                    cta: "+ New Case",    component: TestCases  },
  defects:   { title: "Defect Management",      sub: "Track and manage defects",          cta: "+ Log Defect",  component: Defects    },
  ai:        { title: "AI Insights Engine",     sub: "Risk prediction & auto-generation", cta: "Run Analysis",  component: AIInsights },
  users:     { title: "Users & Roles",          sub: "RBAC management",                   cta: "+ Add User",    component: Users      },
  settings:  { title: "Settings",               sub: "Platform configuration",            cta: "Save Changes",  component: Settings   },
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(getToken() ? getUser() : null)
  const [activePage, setActivePage]   = useState("dashboard")

  function handleLogin(user) {
    setCurrentUser(user)
    setActivePage("dashboard")
  }

  function handleLogout() {
    clearAuth()
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  const page = PAGES[activePage]
  const PageComponent = page.component

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} user={currentUser} onLogout={handleLogout} />
      <div className="main">
        <Topbar title={page.title} sub={page.sub} cta={page.cta} />
        <div className="content">
          <PageComponent />
        </div>
      </div>
    </div>
  )
}
