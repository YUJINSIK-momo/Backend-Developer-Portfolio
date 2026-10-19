import { Link } from "react-router-dom"
import { Github, Mail } from "lucide-react"
import { profile } from "../../data/profile"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-yuyu-line/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-yuyu-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name} · React 19 · Vite · Tailwind ·{" "}
          <Link to="/yuyu" className="text-yuyu-fg-muted hover:text-yuyu-fg">yuyu UI</Link> 로 만들었습니다
        </p>
        <div className="flex items-center gap-4">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-yuyu-fg">
            <Mail size={13} /> {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-yuyu-fg"
          >
            <Github size={13} /> GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
