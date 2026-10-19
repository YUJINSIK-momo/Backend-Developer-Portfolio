// 빌드 뒤에 라우트마다 dist/<경로>/index.html 을 둔다.
// GitHub Pages 는 없는 경로를 404 상태로 돌려주므로(404.html 우회는 브라우저에서만 동작),
// 공유 링크 미리보기 · 검색엔진에서도 상세 페이지가 200 으로 열리게 한다.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dist = join(root, "dist")
const app = readFileSync(join(root, "src/App.tsx"), "utf8")
const cases = readFileSync(join(root, "src/data/caseStudies.ts"), "utf8")

const routes = new Set(
  [...app.matchAll(/<Route path="(\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => !p.includes(":") && p !== "/dashboard"),
)
for (const [, slug] of cases.matchAll(/^ {2}"([a-z0-9-]+)": \{/gm)) routes.add(`/work/${slug}`)

for (const route of routes) {
  const target = join(dist, route, "index.html")
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(join(dist, "index.html"), target)
}
console.log(`라우트 페이지 ${routes.size}개를 만들었습니다`)
