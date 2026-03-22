import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import TestCases from "./pages/TestCases"
import Execution from "./pages/Execution"
import Defects from "./pages/Defects"
import AIInsights from "./pages/AIInsights"
import Users from "./pages/Users"
import Settings from "./pages/Settings"
import "./styles/global.css"

const PAGES = {
  dashboard: { title: "Quality Dashboard",      sub: "Sprint 14 · Cycle: Release 3.2",    cta: "+ New Test",    component: Dashboard  },
  projects:  { title: "Projects & Test Cycles", sub: "Manage active projects and cycles",  cta: "+ New Project", component: Projects   },
  testcases: { title: "Test Case Repository",   sub: "248 cases across 6 modules",         cta: "+ New Case",    component: TestCases  },
  execution: { title: "Test Execution Tracker", sub: "Current sprint execution status",    cta: "+ Run Suite",   component: Execution  },
  defects:   { title: "Defect Management",      sub: "12 open defects · 3 critical",       cta: "+ Log Defect",  component: Defects    },
  ai:        { title: "AI Insights Engine",     sub: "Risk prediction & auto-generation",  cta: "Run Analysis",  component: AIInsights },
  users:     { title: "Users & Roles",          sub: "RBAC management",                    cta: "+ Add User",    component: Users      },
  settings:  { title: "Settings",               sub: "Platform configuration",             cta: "Save Changes",  component: Settings   },
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard")
  const page = PAGES[activePage]
  const PageComponent = page.component

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="main">
        <Topbar title={page.title} sub={page.sub} cta={page.cta} />
        <div className="content">
          <PageComponent />
        </div>
      </div>
    </div>
  )
}
