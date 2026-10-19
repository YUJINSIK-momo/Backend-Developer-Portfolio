import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { projects, featuredProjects } from "../src/data/projects"
import { caseStudies } from "../src/data/caseStudies"
import { allNotes, noteGroups } from "../src/data/notes"

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8")
const routePaths = new Set([...appSource.matchAll(/path="([^"]+)"/g)].map((m) => m[1]))

describe("프로젝트 데이터", () => {
  it("slug 가 겹치지 않는다", () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("대표 사례는 모두 상세 페이지가 있다", () => {
    expect(featuredProjects.length).toBeGreaterThan(0)
    for (const p of featuredProjects) {
      expect(p.detail, p.slug).toBeTruthy()
    }
  })

  it("/work/<slug> 상세 링크에는 사례 본문이 있다", () => {
    for (const p of projects) {
      if (p.detail?.startsWith("/work/")) {
        expect(caseStudies[p.detail.slice("/work/".length)], p.slug).toBeDefined()
      }
    }
  })

  it("사례 본문은 모두 프로젝트 목록에 있다", () => {
    const slugs = new Set(projects.map((p) => p.slug))
    for (const slug of Object.keys(caseStudies)) {
      expect(slugs.has(slug), slug).toBe(true)
    }
  })

  it("사례 본문의 섹션 id 가 한 페이지 안에서 겹치지 않는다", () => {
    for (const study of Object.values(caseStudies)) {
      const ids = study.sections.map((s) => s.id)
      expect(new Set(ids).size, study.slug).toBe(ids.length)
    }
  })

  it("바깥 링크는 https 이고, 비공개 저장소에는 코드 링크가 없다", () => {
    for (const p of projects) {
      for (const link of [p.live, p.repo]) {
        if (link) expect(link.href, p.slug).toMatch(/^https:\/\//)
      }
      if (p.privateRepo) expect(p.repo, p.slug).toBeUndefined()
    }
  })

  it("사이트 안 상세 경로는 실제 라우트다", () => {
    for (const p of projects) {
      if (p.detail && !p.detail.startsWith("/work/")) {
        expect(routePaths.has(p.detail), p.detail).toBe(true)
      }
    }
  })
})

describe("학습 노트 데이터", () => {
  it("경로가 겹치지 않는다", () => {
    const paths = allNotes.map((n) => n.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it("모든 노트 경로가 App.tsx 라우트에 있다", () => {
    for (const note of allNotes) {
      expect(routePaths.has(note.path), note.path).toBe(true)
    }
  })

  it("묶음 id 가 겹치지 않는다", () => {
    const ids = noteGroups.map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
