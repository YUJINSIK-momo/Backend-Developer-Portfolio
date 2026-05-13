import { useState } from "react"
import { GitBranch, ArrowDown, ChevronRight } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { CodeBlock } from "../components/ui/CodeBlock"
import { apiFlowSteps, apiExamples, httpStatusCodes } from "../data/apiFlows"

const colorConfig: Record<string, {
  border: string
  text: string
  bg: string
  activeBg: string
}> = {
  blue: { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10", activeBg: "bg-blue-500/20" },
  purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10", activeBg: "bg-purple-500/20" },
  green: { border: "border-green-500/30", text: "text-green-400", bg: "bg-green-500/10", activeBg: "bg-green-500/20" },
  amber: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10", activeBg: "bg-amber-500/20" },
  cyan: { border: "border-cyan-500/30", text: "text-cyan-400", bg: "bg-cyan-500/10", activeBg: "bg-cyan-500/20" },
  slate: { border: "border-slate-500/30", text: "text-slate-400", bg: "bg-slate-500/10", activeBg: "bg-slate-500/20" },
}

const methodColor: Record<string, string> = {
  GET: "bg-green-500/15 text-green-400 border-green-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  PATCH: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
}

const statusColor: Record<string, string> = {
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
}

export function ApiFlowPage() {
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [selectedExample, setSelectedExample] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [activeSteps, setActiveSteps] = useState<Set<number>>(new Set())

  const runAnimation = () => {
    if (animating) return
    setAnimating(true)
    setActiveSteps(new Set())
    apiFlowSteps.forEach((_, i) => {
      setTimeout(() => {
        setActiveSteps((prev) => new Set([...prev, i]))
        if (i === apiFlowSteps.length - 1) {
          setTimeout(() => {
            setAnimating(false)
            setActiveSteps(new Set())
          }, 1500)
        }
      }, i * 350)
    })
  }

  const example = apiExamples[selectedExample]
  const step = activeStep ? apiFlowSteps.find((s) => s.id === activeStep) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GitBranch size={20} className="text-green-400" />
          <h1 className="text-2xl font-bold text-white">API Flow</h1>
          <Badge variant="green">REST</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          Frontend에서 Database까지 API 요청이 어떤 레이어를 거쳐 처리되는지 단계별로 확인하세요.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Flow Steps */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Request Pipeline
            </h2>
            <button
              onClick={runAnimation}
              disabled={animating}
              className={`btn-primary text-xs px-3 py-1.5 ${animating ? "opacity-50" : ""}`}
            >
              {animating ? "실행 중..." : "▶ 시뮬레이션"}
            </button>
          </div>

          <div className="space-y-1">
            {apiFlowSteps.map((step, i) => {
              const cv = colorConfig[step.color] ?? colorConfig.slate
              const isActive = activeSteps.has(i)
              return (
                <div key={step.id}>
                  <button
                    onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? `${cv.activeBg} ${cv.border} scale-[1.01]`
                        : activeStep === step.id
                        ? `${cv.bg} ${cv.border}`
                        : "border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-700/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${cv.text}`}>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{step.label}</div>
                        <div className="text-xs text-slate-500">{step.description}</div>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`ml-auto text-slate-600 transition-transform ${activeStep === step.id ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>
                  {i < apiFlowSteps.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown size={14} className="text-slate-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          {step ? (
            <div className={`card border ${colorConfig[step.color]?.border ?? "border-slate-700/50"}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-sm font-bold ${colorConfig[step.color]?.text}`}>
                  Layer {apiFlowSteps.findIndex((s) => s.id === step.id) + 1}
                </span>
                <h2 className="text-lg font-bold text-white">{step.label}</h2>
              </div>
              <p className="text-slate-400 text-sm mb-4">{step.description}</p>

              {step.code && (
                <div className="mb-4">
                  <CodeBlock code={step.code} language="typescript" />
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  처리 내용
                </h3>
                <ul className="space-y-1.5">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className={`w-1 h-1 rounded-full ${colorConfig[step.color]?.bg.replace("/10", "")} flex-shrink-0`} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-48 text-slate-500 text-sm">
              왼쪽 레이어를 클릭하면 상세 정보가 표시됩니다
            </div>
          )}

          {/* API Examples */}
          <div className="card">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              API 예시
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {apiExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedExample(i)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${
                    selectedExample === i
                      ? methodColor[ex.method]
                      : "border-slate-700/50 text-slate-400 hover:bg-slate-700/40"
                  }`}
                >
                  <span className="font-mono font-bold">{ex.method}</span>
                  <span>{ex.path.split("?")[0]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`badge border ${methodColor[example.method]} font-mono font-bold`}>
                  {example.method}
                </span>
                <code className="text-sm font-mono text-slate-300">{example.path}</code>
                <span className={`ml-auto badge border ${statusColor.green}`}>
                  {example.statusCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">{example.description}</p>

              {example.request && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Request Body</div>
                  <CodeBlock code={JSON.stringify(example.request, null, 2)} language="json" />
                </div>
              )}
              <div>
                <div className="text-xs text-slate-500 mb-1">Response</div>
                <CodeBlock
                  code={Object.keys(example.response).length === 0 ? "(No body)" : JSON.stringify(example.response, null, 2)}
                  language="json"
                />
              </div>
            </div>
          </div>

          {/* HTTP Status Codes */}
          <div className="card">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              HTTP Status Codes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {httpStatusCodes.map((s) => (
                <div
                  key={s.code}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${statusColor[s.color]}`}
                >
                  <span className="font-mono font-bold">{s.code}</span>
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="opacity-70">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
