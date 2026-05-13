export interface TechItem {
  name: string
  icon?: string
  description: string
  category: TechCategory
  tags: string[]
  color: string
  level: "core" | "used" | "learning"
}

export type TechCategory =
  | "Runtime"
  | "Framework"
  | "Database"
  | "Cache"
  | "Auth"
  | "Realtime"
  | "DevOps"
  | "Cloud"
  | "Testing"
