import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "./components/layout/Header"
import { Footer } from "./components/layout/Footer"
import { DashboardPage } from "./pages/DashboardPage"
import { SocketPage } from "./pages/SocketPage"
import { ArchitecturePage } from "./pages/ArchitecturePage"
import { ApiFlowPage } from "./pages/ApiFlowPage"
import { LLMFlowPage } from "./pages/LLMFlowPage"
import { TechStackPage } from "./pages/TechStackPage"
import { GlossaryPage } from "./pages/GlossaryPage"
import { AwsInfraPage } from "./pages/AwsInfraPage"
import { TestEnvPage } from "./pages/TestEnvPage"

export default function App() {
  return (
    <BrowserRouter basename="/Backend-Developer-Portfolio">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/socket" element={<SocketPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/api-flow" element={<ApiFlowPage />} />
            <Route path="/llm-flow" element={<LLMFlowPage />} />
            <Route path="/tech-stack" element={<TechStackPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/aws-infra" element={<AwsInfraPage />} />
            <Route path="/test-env" element={<TestEnvPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
