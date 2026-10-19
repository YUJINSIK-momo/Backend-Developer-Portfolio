import { Home } from "lucide-react"
import { Button, Container } from "../components/yuyu"

export function NotFoundPage() {
  return (
    <Container width="narrow" className="space-y-4 py-24 text-center">
      <p className="font-mono text-sm text-yuyu-brand">404</p>
      <h1 className="text-2xl font-bold text-yuyu-fg">찾는 페이지가 없습니다</h1>
      <p className="text-sm text-yuyu-fg-muted">주소가 바뀌었을 수 있어요. 홈이나 학습 노트에서 다시 찾아 주세요.</p>
      <div className="flex justify-center gap-2 pt-2">
        <Button to="/" icon={Home}>홈으로</Button>
        <Button to="/notes" variant="outline">학습 노트</Button>
      </div>
    </Container>
  )
}
