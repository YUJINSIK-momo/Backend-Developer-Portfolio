import { NavLink, useLocation } from "react-router-dom"
import { Github, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { cx } from "../yuyu"
import { findNote } from "../../data/notes"
import { profile } from "../../data/profile"

interface NavItem {
  to: string
  label: string
  /** 이 경로들에 있을 때도 켜진 것으로 본다 */
  match?: (pathname: string) => boolean
}

const navItems: readonly NavItem[] = [
  { to: "/", label: "홈", match: (p) => p === "/" },
  { to: "/work", label: "프로젝트", match: (p) => p.startsWith("/work") || p === "/drink-architecture" },
  { to: "/ax", label: "AI · AX" },
  { to: "/notes", label: "학습 노트", match: (p) => p === "/notes" || Boolean(findNote(p)) },
  { to: "/about", label: "About" },
]

function isActive(item: NavItem, pathname: string) {
  return item.match ? item.match(pathname) : pathname.startsWith(item.to)
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // 화면이 바뀌면 모바일 메뉴를 닫는다
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-yuyu-line/50 bg-yuyu-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5" aria-label="홈으로">
          <span className="flex h-7 w-7 items-center justify-center rounded-yuyu-md bg-yuyu-brand-strong font-mono text-xs font-bold text-white">
            yu
          </span>
          <span className="text-sm font-semibold text-yuyu-fg">
            {profile.name}
            <span className="ml-1.5 font-normal text-yuyu-fg-subtle">portfolio</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주 메뉴">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={cx(
                "rounded-yuyu-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(item, pathname)
                  ? "bg-yuyu-raised text-yuyu-fg"
                  : "text-yuyu-fg-muted hover:text-yuyu-fg",
              )}
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-yuyu-md text-yuyu-fg-muted transition-colors hover:bg-yuyu-raised hover:text-yuyu-fg"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
        </nav>

        <button
          type="button"
          className="p-1 text-yuyu-fg-muted hover:text-yuyu-fg md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-yuyu-line/50 bg-yuyu-bg md:hidden" aria-label="모바일 메뉴">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cx(
                  "rounded-yuyu-md px-3 py-2 text-sm font-medium",
                  isActive(item, pathname) ? "bg-yuyu-raised text-yuyu-fg" : "text-yuyu-fg-muted",
                )}
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-yuyu-md px-3 py-2 text-sm text-yuyu-fg-muted"
            >
              <Github size={15} /> GitHub
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
