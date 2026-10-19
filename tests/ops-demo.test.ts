import { describe, expect, it } from "vitest"
import { demoInitialState, demoScenarios, demoStages } from "../src/data/opsDemo"
import { countPods, demoStateAt } from "../src/utils/opsDemo"

const states = (frames: (typeof demoScenarios)[number]["frames"]) =>
  frames.map((_, i) => demoStateAt(demoInitialState, frames, i + 1))

describe("운영 대시보드 미리 보기", () => {
  for (const scenario of demoScenarios) {
    describe(scenario.label, () => {
      it("장면 시각이 앞으로만 간다", () => {
        const times = scenario.frames.map((f) => f.at)
        expect([...times].sort()).toEqual(times)
        expect(new Set(times).size).toBe(times.length)
      })

      it("장면이 고치는 파드는 이미 있거나 같은 장면에서 뜬다", () => {
        let ids = new Set(demoInitialState.pods.map((p) => p.id))
        for (const frame of scenario.frames) {
          ids = new Set([...ids, ...(frame.add ?? []).map((p) => p.id)])
          for (const id of Object.keys(frame.pods ?? {})) expect(ids.has(id), `${frame.at} ${id}`).toBe(true)
        }
      })

      it("어느 장면에서도 서비스마다 정상 대상이 하나 이상 있다", () => {
        for (const state of states(scenario.frames)) {
          for (const service of ["api", "web"] as const) {
            const healthy = state.pods.filter((p) => p.service === service && p.target === "healthy")
            expect(healthy.length, service).toBeGreaterThan(0)
          }
        }
      })

      it("끝나면 배포 기록이 남고 진행 중인 단계가 없다", () => {
        const last = demoStateAt(demoInitialState, scenario.frames, scenario.frames.length)
        expect(last.stages.record).toBe("done")
        expect(demoStages.some((s) => last.stages[s.id] === "working")).toBe(false)
        expect(countPods(last.pods).progressing).toBe(0)
      })
    })
  }

  it("정상 배포는 옛 파드를 모두 내리고 새 리비전만 남긴다", () => {
    const scenario = demoScenarios.find((s) => s.id === "rolling")!
    const last = demoStateAt(demoInitialState, scenario.frames, scenario.frames.length)
    expect(last.sync).toBe("synced")
    expect(last.pods.filter((p) => p.phase === "running").map((p) => `${p.service}:${p.revision}`)).toEqual(["api:29", "web:28"])
  })

  it("롤백은 옛 api 를 그대로 두고 web 은 손대지 않는다", () => {
    const scenario = demoScenarios.find((s) => s.id === "rollback")!
    const last = demoStateAt(demoInitialState, scenario.frames, scenario.frames.length)
    expect(last.sync).toBe("rolledback")
    expect(last.stages.api).toBe("failed")
    expect(last.stages.web).toBe("skipped")
    expect(last.pods.filter((p) => p.phase === "running").map((p) => `${p.service}:${p.revision}`)).toEqual(["api:28", "web:27"])
  })
})
