import { NavLink } from "react-router-dom"
import { Server, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/backend-basics", label: "Basics" },
  { to: "/socket", label: "Socket" },
  { to: "/architecture", label: "Architecture" },
  { to: "/api-flow", label: "API Flow" },
  { to: "/llm-flow", label: "LLM Flow" },
  { to: "/tech-stack", label: "Tech Stack" },
  { to: "/glossary", label: "용어사전" },
  { to: "/aws-infra", label: "AWS 인프라" },
  { to: "/test-env", label: "테스트 환경" },
  { to: "/security", label: "보안/장애" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/claude-guide", label: "Claude" },
  { to: "/claude-advanced", label: "Claude Advanced" },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-navy-900/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:border-blue-400/50 transition-colors">
              <Server size={14} className="text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              Backend<span className="text-blue-400">Portfolio</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-slate-700/50 bg-navy-900">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
