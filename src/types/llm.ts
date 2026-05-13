export interface LLMFlowStep {
  id: string
  order: number
  title: string
  subtitle: string
  description: string
  pmDescription: string
  latency: string
  color: string
  icon: string
  details: string[]
}

export interface TokenVisualization {
  text: string
  token: string
  color: string
}

export interface ContextWindowSegment {
  label: string
  tokens: number
  maxTokens: number
  color: string
  description: string
}
