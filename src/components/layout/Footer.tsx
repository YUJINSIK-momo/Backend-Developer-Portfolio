import { Github, Server } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-700/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-blue-400" />
            <span className="text-sm text-slate-400">Backend Architecture Portfolio</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>React + TypeScript + Vite</span>
            <span>·</span>
            <span>Tailwind CSS</span>
            <span>·</span>
            <a
              href="https://github.com/YUJINSIK-momo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <Github size={13} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
