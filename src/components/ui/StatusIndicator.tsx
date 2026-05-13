interface StatusIndicatorProps {
  status: "online" | "offline" | "connecting" | "error"
  label?: string
  size?: "sm" | "md"
}

const statusConfig = {
  online: { dot: "bg-green-400", pulse: "bg-green-400", label: "Online" },
  offline: { dot: "bg-slate-500", pulse: "", label: "Offline" },
  connecting: { dot: "bg-amber-400", pulse: "bg-amber-400", label: "Connecting" },
  error: { dot: "bg-red-400", pulse: "bg-red-400", label: "Error" },
}

export function StatusIndicator({ status, label, size = "sm" }: StatusIndicatorProps) {
  const config = statusConfig[status]
  const dotSize = size === "sm" ? "w-2 h-2" : "w-3 h-3"

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex">
        {(status === "online" || status === "connecting" || status === "error") && (
          <span
            className={`absolute inline-flex rounded-full opacity-75 animate-ping ${dotSize} ${config.pulse}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${config.dot}`} />
      </span>
      {label !== undefined ? (
        <span className="text-xs text-slate-400">{label}</span>
      ) : (
        <span className="text-xs text-slate-400">{config.label}</span>
      )}
    </span>
  )
}
