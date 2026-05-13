import { useState } from "react"
import { Layers, CheckCircle, XCircle, Zap } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { architecturePatterns } from "../data/architecturePatterns"

const colorVariants: Record<string, {
  border: string
  activeBorder: string
  text: string
  bg: string
  badge: "blue" | "green" | "purple" | "amber" | "cyan" | "pink"
}> = {
  blue: { border: "border-blue-500/20", activeBorder: "border-blue-500/60", text: "text-blue-400", bg: "bg-blue-500/10", badge: "blue" },
  green: { border: "border-green-500/20", activeBorder: "border-green-500/60", text: "text-green-400", bg: "bg-green-500/10", badge: "green" },
  purple: { border: "border-purple-500/20", activeBorder: "border-purple-500/60", text: "text-purple-400", bg: "bg-purple-500/10", badge: "purple" },
  amber: { border: "border-amber-500/20", activeBorder: "border-amber-500/60", text: "text-amber-400", bg: "bg-amber-500/10", badge: "amber" },
  cyan: { border: "border-cyan-500/20", activeBorder: "border-cyan-500/60", text: "text-cyan-400", bg: "bg-cyan-500/10", badge: "cyan" },
  pink: { border: "border-pink-500/20", activeBorder: "border-pink-500/60", text: "text-pink-400", bg: "bg-pink-500/10", badge: "pink" },
}

const nodeTypeColor: Record<string, string> = {
  client: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  gateway: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  service: "border-green-500/40 bg-green-500/10 text-green-300",
  db: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  queue: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  cache: "border-red-500/40 bg-red-500/10 text-red-300",
  external: "border-slate-500/40 bg-slate-500/10 text-slate-300",
}

export function ArchitecturePage() {
  const [selected, setSelected] = useState(architecturePatterns[0].id)

  const pattern = architecturePatterns.find((p) => p.id === selected)!
  const cv = colorVariants[pattern.color] ?? colorVariants.blue

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers size={20} className="text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Architecture Patterns</h1>
          <Badge variant="purple">Design</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          대표적인 백엔드 아키텍처 패턴의 구조, 장단점, 실제 사용 사례를 비교해보세요.
        </p>
      </div>

      {/* Pattern Selector */}
      <div className="flex flex-wrap gap-2">
        {architecturePatterns.map((p) => {
          const cv2 = colorVariants[p.color] ?? colorVariants.blue
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                selected === p.id
                  ? `${cv2.activeBorder} ${cv2.bg} ${cv2.text}`
                  : "border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              }`}
            >
              {p.name}
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Title card */}
          <div className={`card border ${cv.border}`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cv.bg}`}>
                <Zap size={18} className={cv.text} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${cv.text}`}>{pattern.name}</h2>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{pattern.description}</p>
              </div>
            </div>
          </div>

          {/* Architecture diagram - visual node graph */}
          <div className={`card border ${cv.border}`}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Architecture Diagram
            </h3>
            <div className="flex flex-wrap items-center gap-3 py-2">
              {pattern.components.map((comp, i) => (
                <div key={comp.id} className="flex items-center gap-2">
                  <div className={`px-3 py-2 rounded-lg border text-xs font-mono font-medium ${nodeTypeColor[comp.type]}`}>
                    <div>{comp.label}</div>
                    <div className="text-xs opacity-60 font-normal capitalize">{comp.type}</div>
                  </div>
                  {i < pattern.components.length - 1 && (
                    <div className="text-slate-600 text-lg">→</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-slate-700/50">
              {Object.entries(nodeTypeColor).map(([type]) => (
                <span key={type} className={`text-xs px-2 py-0.5 rounded border ${nodeTypeColor[type]}`}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Use cases */}
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              적합한 사용 사례
            </h3>
            <div className="flex flex-wrap gap-2">
              {pattern.useCases.map((uc) => (
                <Badge key={uc} variant={cv.badge}>{uc}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Pros/Cons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card border-green-500/20">
            <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle size={13} /> 장점 (Pros)
            </h3>
            <ul className="space-y-2">
              {pattern.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-500 flex-shrink-0 mt-0.5">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-red-500/20">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <XCircle size={13} /> 단점 (Cons)
            </h3>
            <ul className="space-y-2">
              {pattern.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-red-500 flex-shrink-0 mt-0.5">−</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern comparison mini chart */}
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              패턴 비교
            </h3>
            <div className="space-y-2.5">
              {[
                { label: "초기 복잡도", values: { monolith: 10, layered: 30, microservices: 80, "event-driven": 75, "api-gateway": 60, bff: 55 } },
                { label: "확장성", values: { monolith: 20, layered: 40, microservices: 95, "event-driven": 90, "api-gateway": 70, bff: 65 } },
                { label: "팀 자율성", values: { monolith: 15, layered: 35, microservices: 90, "event-driven": 70, "api-gateway": 65, bff: 80 } },
                { label: "운영 비용", values: { monolith: 15, layered: 25, microservices: 85, "event-driven": 80, "api-gateway": 65, bff: 60 } },
              ].map((metric) => {
                const val = metric.values[selected as keyof typeof metric.values] ?? 50
                return (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{metric.label}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cv.bg.replace("/10", "/60")}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
