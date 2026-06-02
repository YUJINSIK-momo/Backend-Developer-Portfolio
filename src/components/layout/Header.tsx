import { NavLink, useLocation } from "react-router-dom"
import { Server, Menu, X, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

type NavLeaf = { to: string; label: string; exact?: boolean }
type NavGroup = { label: string; items: NavLeaf[] }
type NavEntry = NavLeaf | NavGroup

const isGroup = (e: NavEntry): e is NavGroup => "items" in e

const navItems: NavEntry[] = [
  { to: "/", label: "Dashboard", exact: true },
  { to: "/drink-architecture", label: "Drink 아키텍처" },
  { to: "/about", label: "About" },
  {
    label: "Backend",
    items: [
      { to: "/backend-basics", label: "Basics" },
      { to: "/api-flow", label: "API Flow" },
      { to: "/socket", label: "Socket" },
      { to: "/architecture", label: "Architecture" },
      { to: "/tech-stack", label: "Tech Stack" },
    ],
  },
  {
    label: "Infra",
    items: [
      { to: "/aws-infra", label: "AWS 인프라" },
      { to: "/security", label: "보안/장애" },
      { to: "/test-env", label: "테스트 환경" },
    ],
  },
  {
    label: "AI",
    items: [
      { to: "/llm-flow", label: "LLM Flow" },
      { to: "/claude-guide", label: "Claude" },
      { to: "/claude-advanced", label: "Claude Advanced" },
    ],
  },
  {
    label: "Reference",
    items: [
      { to: "/glossary", label: "용어사전" },
      { to: "/roadmap", label: "Roadmap" },
    ],
  },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // 라우트 바뀌면 드롭다운 자동 닫기
  useEffect(() => {
    setOpenGroup(null)
    setMobileOpen(false)
  }, [location.pathname])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) {
        setOpenGroup(null)
      }
    }
    if (openGroup) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [openGroup])

  const isGroupActive = (g: NavGroup) =>
    g.items.some((item) => location.pathname === item.to)

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
          <nav ref={groupRef} className="hidden md:flex items-center gap-1">
            {navItems.map((entry) => {
              if (!isGroup(entry)) {
                return (
                  <NavLink
                    key={entry.to}
                    to={entry.to}
                    end={entry.exact}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                      }`
                    }
                  >
                    {entry.label}
                  </NavLink>
                )
              }

              const groupActive = isGroupActive(entry)
              const isOpen = openGroup === entry.label

              return (
                <div key={entry.label} className="relative">
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : entry.label)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      groupActive
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : isOpen
                        ? "bg-slate-700/40 text-slate-200"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                    }`}
                  >
                    <span>{entry.label}</span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1.5 min-w-[180px] bg-navy-800 border border-slate-700/50 rounded-lg shadow-xl py-1.5 overflow-hidden">
                      {entry.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-blue-600/15 text-blue-400"
                                : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
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
        <nav className="md:hidden border-t border-slate-700/50 bg-navy-900 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((entry) =>
              isGroup(entry) ? (
                <MobileGroup key={entry.label} group={entry} />
              ) : (
                <NavLink
                  key={entry.to}
                  to={entry.to}
                  end={entry.exact}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                    }`
                  }
                >
                  {entry.label}
                </NavLink>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

function MobileGroup({ group }: { group: NavGroup }) {
  const location = useLocation()
  const childActive = group.items.some((item) => location.pathname === item.to)
  const [open, setOpen] = useState(childActive)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          childActive
            ? "bg-blue-600/15 text-blue-400"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
        }`}
      >
        <span>{group.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-3 mt-1 border-l border-slate-700/50 pl-3 flex flex-col gap-0.5">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
