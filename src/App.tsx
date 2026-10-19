import { lazy, Suspense, useEffect, type ComponentType } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { NoteLayout } from "./components/layout/NoteLayout"

// 페이지마다 따로 내려받도록 나눈다 — 이름 있는 export 를 lazy 가 읽는 default 로 바꿔 준다
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((m) => ({ default: m[name] })))
}

const HomePage = page(() => import("./pages/HomePage"), "HomePage")
const WorkPage = page(() => import("./pages/WorkPage"), "WorkPage")
const CaseStudyPage = page(() => import("./pages/CaseStudyPage"), "CaseStudyPage")
const AxPage = page(() => import("./pages/AxPage"), "AxPage")
const NotesPage = page(() => import("./pages/NotesPage"), "NotesPage")
const AboutPage = page(() => import("./pages/AboutPage"), "AboutPage")
const YuyuPage = page(() => import("./pages/YuyuPage"), "YuyuPage")
const NotFoundPage = page(() => import("./pages/NotFoundPage"), "NotFoundPage")
const DrinkArchPage = page(() => import("./pages/DrinkArchPage"), "DrinkArchPage")

// 학습 노트 — 경로는 예전 그대로 둔다(밖에 걸린 링크가 깨지지 않게)
const WebBasicsPage = page(() => import("./pages/WebBasicsPage"), "WebBasicsPage")
const BigDataPage = page(() => import("./pages/BigDataPage"), "BigDataPage")
const SocketPage = page(() => import("./pages/SocketPage"), "SocketPage")
const ArchitecturePage = page(() => import("./pages/ArchitecturePage"), "ArchitecturePage")
const ApiFlowPage = page(() => import("./pages/ApiFlowPage"), "ApiFlowPage")
const LLMFlowPage = page(() => import("./pages/LLMFlowPage"), "LLMFlowPage")
const TechStackPage = page(() => import("./pages/TechStackPage"), "TechStackPage")
const GlossaryPage = page(() => import("./pages/GlossaryPage"), "GlossaryPage")
const AwsInfraPage = page(() => import("./pages/AwsInfraPage"), "AwsInfraPage")
const TestEnvPage = page(() => import("./pages/TestEnvPage"), "TestEnvPage")
const DockerPage = page(() => import("./pages/DockerPage"), "DockerPage")
const SecurityPage = page(() => import("./pages/SecurityPage"), "SecurityPage")
const ClaudeGuidePage = page(() => import("./pages/ClaudeGuidePage"), "ClaudeGuidePage")
const ClaudeAdvancedPage = page(() => import("./pages/ClaudeAdvancedPage"), "ClaudeAdvancedPage")
const DynamicWorkflowsPage = page(() => import("./pages/DynamicWorkflowsPage"), "DynamicWorkflowsPage")
const ProjectFlowPage = page(() => import("./pages/ProjectFlowPage"), "ProjectFlowPage")
const BackendBasicsPage = page(() => import("./pages/BackendBasicsPage"), "BackendBasicsPage")
const RoadmapPage = page(() => import("./pages/RoadmapPage"), "RoadmapPage")

// 화면이 바뀌면 맨 위로, #앵커가 있으면 그 자리로 간다.
// 페이지를 나눠 내려받으므로 앵커 요소가 그려질 때까지 잠깐 기다린다.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    let frame = 0
    const seek = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) target.scrollIntoView({ block: "start" })
      else if (tries++ < 60) frame = requestAnimationFrame(seek)
    }
    seek()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}

function PageFallback() {
  return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-yuyu-fg-subtle">불러오는 중…</div>
}

export default function App() {
  return (
    <BrowserRouter basename="/Backend-Developer-Portfolio">
      <ScrollManager />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
              <Route path="/drink-architecture" element={<DrinkArchPage />} />
              <Route path="/ax" element={<AxPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/yuyu" element={<YuyuPage />} />

              <Route element={<NoteLayout />}>
                <Route path="/web-basics" element={<WebBasicsPage />} />
                <Route path="/backend-basics" element={<BackendBasicsPage />} />
                <Route path="/api-flow" element={<ApiFlowPage />} />
                <Route path="/socket" element={<SocketPage />} />
                <Route path="/architecture" element={<ArchitecturePage />} />
                <Route path="/tech-stack" element={<TechStackPage />} />
                <Route path="/aws-infra" element={<AwsInfraPage />} />
                <Route path="/docker" element={<DockerPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/test-env" element={<TestEnvPage />} />
                <Route path="/big-data" element={<BigDataPage />} />
                <Route path="/llm-flow" element={<LLMFlowPage />} />
                <Route path="/claude-guide" element={<ClaudeGuidePage />} />
                <Route path="/claude-advanced" element={<ClaudeAdvancedPage />} />
                <Route path="/dynamic-workflows" element={<DynamicWorkflowsPage />} />
                <Route path="/project-flow" element={<ProjectFlowPage />} />
                <Route path="/glossary" element={<GlossaryPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
              </Route>

              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
