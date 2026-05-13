export type GlossaryCategory = "server" | "frontend" | "llm"
export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface GlossaryTerm {
  id: string
  term: string
  category: GlossaryCategory
  difficulty: DifficultyLevel
  definition: string
  pmAnalogy: string
  example?: string
  relatedTerms: string[]
  tags: string[]
}
