import { useState, useEffect, useRef } from "react"
import { Cpu, ChevronRight, Play, Square } from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { llmFlowSteps, sampleTokenizations, llmConcepts } from "../data/llmFlowSteps"

const colorConfig: Record<string, { border: string; text: string; bg: string; pulse: string }> = {
  blue: { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10", pulse: "bg-blue-500/20" },
  purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10", pulse: "bg-purple-500/20" },
  cyan: { border: "border-cyan-500/30", text: "text-cyan-400", bg: "bg-cyan-500/10", pulse: "bg-cyan-500/20" },
  amber: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10", pulse: "bg-amber-500/20" },
  green: { border: "border-green-500/30", text: "text-green-400", bg: "bg-green-500/10", pulse: "bg-green-500/20" },
  slate: { border: "border-slate-500/30", text: "text-slate-400", bg: "bg-slate-500/10", pulse: "bg-slate-500/20" },
  pink: { border: "border-pink-500/30", text: "text-pink-400", bg: "bg-pink-500/10", pulse: "bg-pink-500/20" },
}

const SAMPLE_RESPONSE =
  "백엔드 개발에서 소켓 통신은 매우 중요한 역할을 합니다. WebSocket을 사용하면 서버와 클라이언트가 실시간으로 양방향 데이터를 주고받을 수 있습니다. 이를 통해 채팅, 실시간 알림, 주식 시세 등의 기능을 구현할 수 있습니다."

function TokenChip({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono border mr-1 mb-1 ${color}`}>
      {text}
    </span>
  )
}

const tokenColors = [
  "border-blue-500/30 bg-blue-500/10 text-blue-300",
  "border-purple-500/30 bg-purple-500/10 text-purple-300",
  "border-green-500/30 bg-green-500/10 text-green-300",
  "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  "border-pink-500/30 bg-pink-500/10 text-pink-300",
]

export function LLMFlowPage() {
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [inputText, setInputText] = useState("백엔드 소켓 통신이란?")
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState("")
  const [temperature, setTemperature] = useState(0.7)
  const [activeFlowStep, setActiveFlowStep] = useState<number | null>(null)
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tokenized = inputText.split("").reduce<{ text: string; colorIdx: number }[]>((acc, char, i) => {
    if (i % 2 === 0 || char === " ") {
      acc.push({ text: char, colorIdx: acc.length % tokenColors.length })
    } else if (acc.length > 0) {
      acc[acc.length - 1].text += char
    }
    return acc
  }, [])

  const sampleTokens = sampleTokenizations.flatMap((s) => s.tokens)

  const startStreaming = () => {
    if (streaming) {
      if (streamRef.current) clearInterval(streamRef.current)
      setStreaming(false)
      return
    }
    setStreaming(true)
    setStreamedText("")
    setActiveFlowStep(0)

    let charIdx = 0
    let stepIdx = 0

    const stepInterval = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, llmFlowSteps.length - 1)
      setActiveFlowStep(stepIdx)
    }, 600)

    streamRef.current = setInterval(() => {
      if (charIdx >= SAMPLE_RESPONSE.length) {
        clearInterval(streamRef.current!)
        clearInterval(stepInterval)
        setStreaming(false)
        setActiveFlowStep(null)
        return
      }
      setStreamedText(SAMPLE_RESPONSE.slice(0, charIdx + 1))
      charIdx++
    }, 30)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) clearInterval(streamRef.current)
    }
  }, [])

  const selectedStep = activeStep ? llmFlowSteps.find((s) => s.id === activeStep) : null

  const contextSegments = [
    { label: "System Prompt", tokens: 150, color: "bg-purple-500/60" },
    { label: "History", tokens: 320, color: "bg-blue-500/60" },
    { label: "User Input", tokens: Math.max(10, inputText.length * 1.3 | 0), color: "bg-green-500/60" },
  ]
  const totalTokens = contextSegments.reduce((s, c) => s + c.tokens, 0)
  const maxTokens = 4096

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={20} className="text-amber-400" />
          <h1 className="text-2xl font-bold text-white">LLM Flow</h1>
          <Badge variant="amber">AI</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          사용자 입력부터 LLM 추론, 스트리밍 응답까지 전체 처리 파이프라인을 단계별로 시각화합니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Flow Steps */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Processing Pipeline
          </h2>
          <div className="space-y-1">
            {llmFlowSteps.map((step, i) => {
              const cv = colorConfig[step.color] ?? colorConfig.slate
              const isActive = activeFlowStep === i
              return (
                <div key={step.id}>
                  <button
                    onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? `${cv.pulse} ${cv.border} scale-[1.01]`
                        : activeStep === step.id
                        ? `${cv.bg} ${cv.border}`
                        : "border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-700/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${cv.text}`}>{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{step.title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">{step.subtitle}</span>
                          <span className={`text-xs font-mono ${cv.text}`}>{step.latency}</span>
                        </div>
                      </div>
                      <ChevronRight
                        size={13}
                        className={`text-slate-600 transition-transform ${activeStep === step.id ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>
                  {i < llmFlowSteps.length - 1 && (
                    <div className="flex justify-center py-0.5 text-slate-600 text-xs">↓</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Streaming Simulator */}
          <div className="card">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              스트리밍 시뮬레이터
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={streaming}
                  placeholder="질문 입력..."
                  className="flex-1 bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  onClick={startStreaming}
                  className={`btn px-4 ${streaming ? "btn-ghost border-red-500/30 text-red-400" : "btn-primary"}`}
                >
                  {streaming ? <><Square size={14} /> 중지</> : <><Play size={14} /> 실행</>}
                </button>
              </div>

              {/* Temperature slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-24">Temperature</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-xs font-mono text-amber-400 w-8">{temperature.toFixed(1)}</span>
                <span className="text-xs text-slate-500">
                  {temperature < 0.3 ? "정확" : temperature < 0.7 ? "균형" : "창의적"}
                </span>
              </div>

              {/* Response area */}
              <div className="bg-slate-900 rounded-lg p-4 min-h-24 border border-slate-700/50">
                {streamedText ? (
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {streamedText}
                    {streaming && <span className="animate-pulse text-amber-400">▌</span>}
                  </p>
                ) : (
                  <p className="text-slate-600 text-sm">위 버튼을 눌러 스트리밍 응답을 시뮬레이션하세요</p>
                )}
              </div>
            </div>
          </div>

          {/* Step Detail */}
          {selectedStep ? (
            <div className={`card border ${colorConfig[selectedStep.color]?.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-mono font-bold ${colorConfig[selectedStep.color]?.text}`}>
                  STEP {selectedStep.order}
                </span>
                <h3 className="font-bold text-white">{selectedStep.title}</h3>
                <Badge variant="amber">{selectedStep.latency}</Badge>
              </div>
              <p className="text-sm text-slate-400 mb-2">{selectedStep.description}</p>
              <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${colorConfig[selectedStep.color]?.bg}`}>
                <span className="text-slate-400 font-medium">PM 관점: </span>
                <span className={colorConfig[selectedStep.color]?.text}>{selectedStep.pmDescription}</span>
              </div>
              <ul className="space-y-1">
                {selectedStep.details.map((d) => (
                  <li key={d} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className={`w-1 h-1 rounded-full ${colorConfig[selectedStep.color]?.text.replace("text-", "bg-")} flex-shrink-0`} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Tokenization Visualizer */}
          <div className="card">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Tokenization 시각화
            </h2>
            <p className="text-xs text-slate-500 mb-3">입력 텍스트가 토큰 단위로 분리됩니다. (단순화된 시각화)</p>
            <div className="flex flex-wrap mb-2">
              {tokenized.map((t, i) =>
                t.text !== " " ? (
                  <TokenChip key={i} text={t.text} color={tokenColors[t.colorIdx]} />
                ) : (
                  <span key={i} className="w-2" />
                )
              )}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              예상 토큰 수: <span className="text-white font-mono">{tokenized.filter(t => t.text !== " ").length}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="text-xs text-slate-500 mb-2">실제 토큰 예시 (BPE 방식)</div>
              <div className="flex flex-wrap">
                {sampleTokens.map((token, i) => (
                  <TokenChip key={i} text={token} color={tokenColors[i % tokenColors.length]} />
                ))}
              </div>
            </div>
          </div>

          {/* Context Window */}
          <div className="card">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Context Window
            </h2>
            <div className="h-4 w-full rounded-full overflow-hidden bg-slate-800 flex mb-3">
              {contextSegments.map((seg) => (
                <div
                  key={seg.label}
                  className={`h-full transition-all duration-500 ${seg.color}`}
                  style={{ width: `${(seg.tokens / maxTokens) * 100}%` }}
                />
              ))}
              <div className="flex-1 bg-slate-700/30" />
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {contextSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${seg.color}`} />
                  <span className="text-slate-400">{seg.label}</span>
                  <span className="font-mono text-white">{seg.tokens}</span>
                </div>
              ))}
              <div className="ml-auto text-slate-500">
                {totalTokens} / {maxTokens.toLocaleString()} tokens
              </div>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="card">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              핵심 개념
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {llmConcepts.map((c) => (
                <div key={c.term} className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50">
                  <div className="text-xs">
                    <span className="font-semibold text-white">{c.term}</span>
                    <span className="text-slate-400"> — {c.desc}</span>
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
