import { useState, useMemo } from "react"
import { Search, BookOpen, X } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { glossaryTerms } from "../data/glossaryTerms"
import type { GlossaryCategory, DifficultyLevel } from "../types/glossary"

const categoryConfig: Record<GlossaryCategory, { label: string; emoji: string; badge: "green" | "blue" | "amber" }> = {
  server: { label: "서버 / 백엔드", emoji: "🖥️", badge: "green" },
  frontend: { label: "프론트엔드", emoji: "🌐", badge: "blue" },
  llm: { label: "LLM / AI", emoji: "🤖", badge: "amber" },
}

const difficultyConfig: Record<DifficultyLevel, { label: string; variant: "green" | "blue" | "purple" }> = {
  beginner: { label: "초급", variant: "green" },
  intermediate: { label: "중급", variant: "blue" },
  advanced: { label: "심화", variant: "purple" },
}

export function GlossaryPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all")
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel | "all">("all")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return glossaryTerms.filter((t) => {
      const catMatch = activeCategory === "all" || t.category === activeCategory
      const diffMatch = activeDifficulty === "all" || t.difficulty === activeDifficulty
      const searchMatch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.pmAnalogy.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      return catMatch && diffMatch && searchMatch
    })
  }, [search, activeCategory, activeDifficulty])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-pink-400" />
          <h1 className="text-2xl font-bold text-white">PM 용어사전</h1>
          <Badge variant="pink">Glossary</Badge>
        </div>
        <p className="text-slate-400 text-sm max-w-2xl">
          개발팀과 더 잘 소통하고 싶은 PM, 기획자, 디자이너를 위해 만들어졌습니다.
          기술 용어를 친숙한 비유로 설명합니다.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="용어 검색..."
            className="w-full bg-navy-800 border border-slate-700/50 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeCategory === "all"
                ? "border-pink-500/60 bg-pink-500/15 text-pink-400"
                : "border-slate-700/50 text-slate-400 hover:bg-slate-700/40"
            }`}
          >
            전체
          </button>
          {(Object.keys(categoryConfig) as GlossaryCategory[]).map((cat) => {
            const conf = categoryConfig[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "all" : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeCategory === cat
                    ? "border-pink-500/60 bg-pink-500/15 text-pink-400"
                    : "border-slate-700/50 text-slate-400 hover:bg-slate-700/40"
                }`}
              >
                {conf.emoji} {conf.label}
              </button>
            )
          })}
        </div>

        <div className="flex gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDifficulty(d)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-all ${
                activeDifficulty === d
                  ? "border-slate-400 bg-slate-700/50 text-white"
                  : "border-slate-700/50 text-slate-500 hover:bg-slate-700/30"
              }`}
            >
              {d === "all" ? "전체" : difficultyConfig[d].label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          {filtered.length}개 용어 {search && `("${search}" 검색 결과)`}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((term) => {
          const isExpanded = expanded === term.id
          const catConf = categoryConfig[term.category]
          const diffConf = difficultyConfig[term.difficulty]

          return (
            <button
              key={term.id}
              onClick={() => setExpanded(isExpanded ? null : term.id)}
              className={`card-hover text-left border transition-all duration-200 ${
                isExpanded
                  ? "border-pink-500/30 bg-navy-700/80"
                  : "border-slate-700/30"
              }`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{catConf.emoji}</span>
                    <h3 className="text-sm font-bold text-white">{term.term}</h3>
                  </div>
                  {term.pronunciation && (
                    <div className="text-xs text-slate-500 mt-0.5 ml-6">
                      🔊 {term.pronunciation}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={catConf.badge}>{catConf.label}</Badge>
                    <Badge variant={diffConf.variant}>{diffConf.label}</Badge>
                  </div>
                </div>
              </div>

              {/* Definition */}
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{term.definition}</p>

              {/* PM Analogy */}
              <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/30">
                <span className="text-xs text-pink-400 font-medium">PM 비유: </span>
                <span className="text-xs text-slate-300">{term.pmAnalogy}</span>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2">
                  {term.example && (
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1">실제 예시</div>
                      <div className="text-xs text-slate-300 font-mono bg-slate-900 rounded px-2 py-1.5">
                        {term.example}
                      </div>
                    </div>
                  )}
                  {term.relatedTerms.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1">연관 용어</div>
                      <div className="flex flex-wrap gap-1">
                        {term.relatedTerms.map((rt) => {
                          const related = glossaryTerms.find((t) => t.id === rt)
                          return related ? (
                            <span
                              key={rt}
                              className="text-xs px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20"
                            >
                              {related.term}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                  {term.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {term.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-500 border border-slate-600/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <div className="text-4xl">🔍</div>
          <div className="text-slate-400">"{search}"에 대한 결과가 없습니다</div>
          <button onClick={() => { setSearch(""); setActiveCategory("all") }} className="text-sm text-pink-400 hover:underline">
            필터 초기화
          </button>
        </div>
      )}
    </div>
  )
}
