interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "blue" | "green" | "amber" | "red" | "purple" | "cyan" | "pink" | "slate"
  size?: "sm" | "md"
}

const variantMap: Record<string, string> = {
  default: "bg-slate-700/50 text-slate-300 border border-slate-600/50",
  blue: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  green: "bg-green-500/15 text-green-400 border border-green-500/30",
  amber: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  red: "bg-red-500/15 text-red-400 border border-red-500/30",
  purple: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
  pink: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
  slate: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
}

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}
        ${variantMap[variant]}
      `}
    >
      {children}
    </span>
  )
}
