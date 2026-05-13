export interface ArchitecturePattern {
  id: string
  name: string
  description: string
  pros: string[]
  cons: string[]
  useCases: string[]
  components: ArchComponent[]
  color: string
  icon: string
}

export interface ArchComponent {
  id: string
  label: string
  type: "client" | "gateway" | "service" | "db" | "queue" | "cache" | "external"
  x: number
  y: number
}

export interface ArchConnection {
  from: string
  to: string
  label?: string
  style?: "solid" | "dashed"
}
