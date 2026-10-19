import type { DemoFrame, DemoPod, DemoState } from "../types/opsDemo"

/** 앞에서부터 count 개 장면을 차례로 적용한 상태 — 0 이면 배포 전 */
export function demoStateAt(initial: DemoState, frames: readonly DemoFrame[], count: number): DemoState {
  return frames.slice(0, count).reduce(applyFrame, initial)
}

function applyFrame(state: DemoState, frame: DemoFrame): DemoState {
  const added: DemoPod[] = (frame.add ?? []).map((pod) => ({ ...pod, steps: [] }))
  const pods = [...state.pods, ...added].map((pod) => {
    const patch = frame.pods?.[pod.id]
    if (!patch) return pod
    const { step, ...rest } = patch
    return { ...pod, ...rest, steps: step ? [...pod.steps, { at: frame.at, text: step }] : pod.steps }
  })
  return {
    stages: { ...state.stages, ...frame.stages },
    pods,
    migration: frame.migration ?? state.migration,
    etlRevision: frame.etlRevision ?? state.etlRevision,
    sync: frame.sync ?? state.sync,
  }
}

export interface PodCounts {
  healthy: number
  progressing: number
  unhealthy: number
  stopped: number
}

/** 요약 칸에 쓰는 파드 수 — 실제 대시보드처럼 정상 · 진행 중 · 비정상 · 종료됨으로 나눈다 */
export function countPods(pods: readonly DemoPod[]): PodCounts {
  const counts: PodCounts = { healthy: 0, progressing: 0, unhealthy: 0, stopped: 0 }
  for (const pod of pods) {
    if (pod.phase === "running") counts.healthy++
    else if (pod.phase === "starting" || pod.phase === "checking" || pod.phase === "stopping") counts.progressing++
    else if (pod.phase === "failing" || pod.phase === "failed") counts.unhealthy++
    else counts.stopped++
  }
  return counts
}
