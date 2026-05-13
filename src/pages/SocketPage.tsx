import { useState, useRef, useCallback } from "react"
import { Radio, Send, Wifi, WifiOff, Users, Trash2, ChevronRight } from "lucide-react"
import { StatusIndicator } from "../components/ui/StatusIndicator"
import { Badge } from "../components/ui/Badge"
import { eventScenarios } from "../data/socketEvents"

interface LogEntry {
  id: string
  timestamp: string
  event: string
  direction: "in" | "out" | "broadcast"
  payload: string
  status: "success" | "error"
}

const nodeConfig = [
  { id: "client", label: "Client", sub: "Browser/App", color: "blue" },
  { id: "server", label: "WebSocket Server", sub: "Node.js / Socket.IO", color: "purple" },
  { id: "handler", label: "Event Handler", sub: "Business Logic", color: "green" },
  { id: "db", label: "Database", sub: "PostgreSQL", color: "cyan" },
  { id: "notify", label: "Notification Service", sub: "Push / Email", color: "amber" },
]

const colorMap: Record<string, string> = {
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  green: "border-green-500/30 bg-green-500/10 text-green-400",
  cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
}

const directionConfig = {
  in: { label: "→ Server", class: "border-l-blue-500 bg-blue-500/5 text-blue-300" },
  out: { label: "← Client", class: "border-l-green-500 bg-green-500/5 text-green-300" },
  broadcast: { label: "⇄ Broadcast", class: "border-l-amber-500 bg-amber-500/5 text-amber-300" },
}

function makeLog(event: string, direction: "in" | "out" | "broadcast", payload: string): LogEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
    event,
    direction,
    payload,
    status: "success",
  }
}

export function SocketPage() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [message, setMessage] = useState("")
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set())
  const logEndRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((entry: LogEntry) => {
    setLogs((prev) => [...prev.slice(-99), entry])
    setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
  }, [])

  const highlightNode = useCallback((nodeId: string) => {
    setActiveNodes((prev) => new Set([...prev, nodeId]))
    setTimeout(() => {
      setActiveNodes((prev) => {
        const next = new Set(prev)
        next.delete(nodeId)
        return next
      })
    }, 800)
  }, [])

  const handleConnect = () => {
    if (connected) {
      setConnected(false)
      addLog(makeLog("client:disconnect", "out", '{ reason: "manual" }'))
      highlightNode("client")
      return
    }
    setConnecting(true)
    highlightNode("client")
    setTimeout(() => {
      highlightNode("server")
      setTimeout(() => {
        setConnected(true)
        setConnecting(false)
        addLog(makeLog("client:connect", "in", '{ clientId: "usr_' + Math.random().toString(36).slice(2, 8) + '", room: "general" }'))
        highlightNode("handler")
      }, 400)
    }, 600)
  }

  const handleSend = () => {
    if (!connected || !message.trim()) return
    const text = message.trim()
    setMessage("")
    addLog(makeLog("message:send", "in", `{ text: "${text}", room: "general" }`))
    highlightNode("client")
    setTimeout(() => {
      highlightNode("server")
      setTimeout(() => {
        highlightNode("handler")
        addLog(makeLog("handler:process", "out", '{ valid: true, persist: true }'))
        setTimeout(() => {
          highlightNode("db")
          setTimeout(() => {
            addLog(makeLog("server:broadcast", "broadcast", `{ text: "${text}", from: "me", room: "general" }`))
            highlightNode("server")
            setTimeout(() => {
              highlightNode("notify")
              addLog(makeLog("notification:push", "out", '{ type: "NEW_MESSAGE", count: 1 }'))
            }, 300)
          }, 300)
        }, 200)
      }, 300)
    }, 200)
  }

  const runScenario = (scenarioId: string) => {
    if (!connected) return
    const scenario = eventScenarios.find((s) => s.id === scenarioId)
    if (!scenario) return
    setActiveScenario(scenarioId)
    scenario.events.forEach((ev, i) => {
      setTimeout(() => {
        const dir: "in" | "out" | "broadcast" =
          ev.direction === "client-to-server" ? "in"
          : ev.direction === "server-to-all" ? "broadcast"
          : "out"
        addLog(makeLog(ev.name, dir, '{ ...payload }'))
        const nodeMap: Record<string, string[]> = {
          "client-to-server": ["client", "server"],
          "server-to-client": ["server", "client"],
          "server-to-all": ["server"],
        }
        nodeMap[ev.direction]?.forEach((n) => highlightNode(n))
        if (i === scenario.events.length - 1) {
          setTimeout(() => setActiveScenario(null), 500)
        }
      }, ev.delay + i * 200)
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Radio size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-white">Socket Communication</h1>
          <Badge variant="cyan">Realtime</Badge>
        </div>
        <p className="text-slate-400 text-sm">
          WebSocket 기반 실시간 양방향 통신 흐름을 시각화합니다. 직접 연결하고 메시지를 전송해보세요.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Architecture Nodes */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Architecture</h2>
          <div className="space-y-2">
            {nodeConfig.map((node, i) => (
              <div key={node.id}>
                <div
                  className={`card transition-all duration-300 ${
                    activeNodes.has(node.id)
                      ? "border-white/30 scale-[1.02] shadow-lg shadow-white/5"
                      : `border ${colorMap[node.color]?.split(" ")[0]}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-semibold ${activeNodes.has(node.id) ? "text-white" : colorMap[node.color]?.split(" ").pop()}`}>
                        {node.label}
                      </div>
                      <div className="text-xs text-slate-500">{node.sub}</div>
                    </div>
                    {node.id === "client" && (
                      <StatusIndicator
                        status={connecting ? "connecting" : connected ? "online" : "offline"}
                      />
                    )}
                    {node.id === "server" && connected && (
                      <StatusIndicator status="online" />
                    )}
                  </div>
                </div>
                {i < nodeConfig.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ChevronRight size={14} className="text-slate-600 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Scenarios */}
          <div className="mt-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              시나리오 시뮬레이션
            </h2>
            <div className="space-y-2">
              {eventScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => runScenario(s.id)}
                  disabled={!connected || activeScenario !== null}
                  className={`w-full text-left card-hover border border-slate-700/50 p-3 rounded-lg transition-all ${
                    !connected || activeScenario !== null ? "opacity-40 cursor-not-allowed" : ""
                  } ${activeScenario === s.id ? "border-cyan-500/40 bg-cyan-500/5" : ""}`}
                >
                  <div className="text-sm font-medium text-white">{s.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Users size={12} />
                Connection Control
              </h2>
              <StatusIndicator
                status={connecting ? "connecting" : connected ? "online" : "offline"}
                label={connecting ? "연결 중..." : connected ? "연결됨" : "연결 안됨"}
              />
            </div>

            <button
              onClick={handleConnect}
              className={`btn ${connected ? "btn-ghost border-red-500/30 text-red-400 hover:bg-red-500/10" : "btn-primary"} w-full justify-center`}
            >
              {connected ? (
                <><WifiOff size={14} /> 연결 해제</>
              ) : (
                <><Wifi size={14} /> WebSocket 연결</>
              )}
            </button>

            {connected && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="메시지 입력..."
                  className="flex-1 bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="btn-primary px-3"
                >
                  <Send size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Event Log */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Radio size={12} />
                Event Log
              </h2>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <Trash2 size={11} /> Clear
              </button>
            </div>

            <div className="h-72 overflow-y-auto space-y-1.5 scrollbar-thin">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                  WebSocket에 연결하면 이벤트 로그가 표시됩니다
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`log-entry ${directionConfig[log.direction].class}`}
                  >
                    <span className="text-slate-600 flex-shrink-0">{log.timestamp}</span>
                    <span className="text-slate-300 flex-shrink-0">{log.event}</span>
                    <span className="text-slate-500 truncate">{log.payload}</span>
                    <span className={`ml-auto flex-shrink-0 text-xs px-1.5 py-0.5 rounded ${
                      log.direction === "in" ? "bg-blue-500/10 text-blue-400"
                      : log.direction === "broadcast" ? "bg-amber-500/10 text-amber-400"
                      : "bg-green-500/10 text-green-400"
                    }`}>
                      {directionConfig[log.direction].label}
                    </span>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Concept cards */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Room / Namespace", desc: "소켓을 논리적 채널로 분리. 특정 그룹에만 메시지 전달", color: "border-purple-500/20 text-purple-400" },
              { label: "Broadcast", desc: "특정 방의 모든 클라이언트에게 동시 메시지 발송", color: "border-cyan-500/20 text-cyan-400" },
              { label: "Fallback", desc: "WebSocket 미지원 환경에서 Long Polling으로 자동 전환", color: "border-amber-500/20 text-amber-400" },
            ].map((c) => (
              <div key={c.label} className={`card border ${c.color}`}>
                <div className={`text-xs font-semibold mb-1 ${c.color.split(" ").pop()}`}>{c.label}</div>
                <div className="text-xs text-slate-400">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
