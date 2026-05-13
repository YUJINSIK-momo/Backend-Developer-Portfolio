import { useState } from "react"
import { Zap } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { techStacks, techCategories } from "../data/techStacks"
import type { TechCategory } from "../types/tech"

const categoryIcons: Record<TechCategory, string> = {
  Runtime: "⚙️",
  Framework: "🏗️",
  Database: "🗄️",
  Cache: "⚡",
  Auth: "🔐",
  Realtime: "📡",
  DevOps: "🐳",
  Cloud: "☁️",
  Testing: "🧪",
}

const levelConfig = {
  core: { label: "Core", variant: "blue" as const },
  used: { label: "Used", variant: "green" as const },
  learning: { label: "Learning", variant: "amber" as const },
}

export function TechStackPage() {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | "All">("All")
  const [selectedLevel, setSelectedLevel] = useState<"all" | "core" | "used" | "learning">("all")

  const filtered = techStacks.filter((t) => {
    const catMatch = selectedCategory === "All" || t.category === selectedCategory
    const levelMatch = selectedLevel === "all" || t.level === selectedLevel
    return catMatch && levelMatch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={20} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Tech Stack</h1>
          <Badge variant="blue">Overview</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          백엔드 개발에서 활용하는 주요 기술 스택을 카테고리별로 정리합니다.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selectedCategory === "All"
                ? "border-blue-500/60 bg-blue-500/20 text-blue-400"
                : "border-slate-700/50 text-slate-400 hover:bg-slate-700/40"
            }`}
          >
            All
          </button>
          {techCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? "border-blue-500/60 bg-blue-500/20 text-blue-400"
                  : "border-slate-700/50 text-slate-400 hover:bg-slate-700/40"
              }`}
            >
              {categoryIcons[cat]} {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(["all", "core", "used", "learning"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLevel(l)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-all ${
                selectedLevel === l
                  ? "border-slate-400 bg-slate-700/50 text-white"
                  : "border-slate-700/50 text-slate-500 hover:bg-slate-700/30"
              }`}
            >
              {l === "all" ? "전체" : levelConfig[l].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tech) => (
          <div key={tech.name} className="card-hover border border-slate-700/30 group">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className={`text-base font-bold ${tech.color} group-hover:brightness-110 transition-all`}>
                  {tech.name}
                </h3>
                <span className="text-xs text-slate-500">{tech.category}</span>
              </div>
              <Badge variant={levelConfig[tech.level].variant}>
                {levelConfig[tech.level].label}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{tech.description}</p>
            <div className="flex flex-wrap gap-1">
              {tech.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-400 border border-slate-600/30 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          해당 조건에 맞는 기술 스택이 없습니다
        </div>
      )}

      {/* Summary */}
      <div className="card border-slate-700/30">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          스택 요약
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(["core", "used", "learning"] as const).map((level) => {
            const count = techStacks.filter((t) => t.level === level).length
            return (
              <div key={level} className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{count}</div>
                <div className="text-xs text-slate-400">{levelConfig[level].label}</div>
              </div>
            )
          })}
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-mono">{techStacks.length}</div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="grid sm:grid-cols-2 gap-3">
            {techCategories.map((cat) => {
              const count = techStacks.filter((t) => t.category === cat).length
              return (
                <div key={cat} className="flex items-center gap-2">
                  <span className="text-sm">{categoryIcons[cat]}</span>
                  <span className="text-sm text-slate-400 flex-1">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500/60 rounded-full"
                        style={{ width: `${(count / techStacks.length) * 100 * 3}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
