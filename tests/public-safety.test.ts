import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

// 이 사이트는 공개 GitHub Pages 에 올라간다.
// 회사 인프라 이야기를 쓰더라도 계정 · 네트워크 · 채널 식별자가 섞여 들어가지 않게 막는다.
const forbidden: readonly { name: string; pattern: RegExp }[] = [
  { name: "AWS 계정 ID(12자리 숫자)", pattern: /(?<![\d.])\d{12}(?![\d.])/ },
  { name: "계정이 박힌 AWS ARN", pattern: /arn:aws[a-z-]*:[a-z0-9-]*:[a-z0-9-]*:\d{12}:/ },
  { name: "VPC · 서브넷 · 보안그룹 ID", pattern: /\b(?:vpc|subnet|sg|igw|nat|rtb|eni)-[0-9a-f]{8,}\b/ },
  { name: "Route 53 호스팅 영역 ID", pattern: /\bZ0[0-9A-Z]{12,}\b/ },
  { name: "Slack 채널 · 워크스페이스 ID", pattern: /\b[CTUG]0[0-9A-Z]{8,}\b/ },
  { name: "Slack 앱 ID", pattern: /\bA0[0-9A-Z]{8,}\b/ },
  { name: "Tailscale 사설망 주소", pattern: /\.ts\.net\b/ },
  { name: "액세스 키 모양", pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { name: "토큰 모양", pattern: /\b(?:ghp|gho|xox[abp])[-_][0-9A-Za-z-]{10,}/ },
  // 회사 서비스는 「상권 프로젝트」로만 부른다
  { name: "회사 서비스 이름 · 도메인", pattern: /blue[\s_-]?maps|블루맵스/i },
]

const root = fileURLToPath(new URL("../src", import.meta.url))

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return listFiles(path)
    return /\.(ts|tsx|css)$/.test(name) ? [path] : []
  })
}

// 메일 주소는 공개용으로 정한 것과 예시 도메인만 허용한다
const allowedEmails = new Set(["jinsik2036@gmail.com"])
const isExample = (email: string) => /@(?:example\.(?:com|org|net)|db\.supabase\.co)$/.test(email)
const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g

describe("공개해도 되는 내용만 있다", () => {
  const files = listFiles(root)

  it("검사할 파일이 있다", () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it("공개용이 아닌 메일 주소가 없다", () => {
    const hits = files.flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(emailPattern)]
        .map((m) => m[0])
        .filter((email) => !allowedEmails.has(email) && !isExample(email))
        .map((email) => `${file.slice(root.length + 1)}: ${email}`),
    )
    expect(hits).toEqual([])
  })

  for (const rule of forbidden) {
    it(`${rule.name} 이 없다`, () => {
      const hits = files.flatMap((file) =>
        readFileSync(file, "utf8")
          .split("\n")
          .map((line, i) => ({ file: file.slice(root.length + 1), line: i + 1, text: line }))
          .filter(({ text }) => rule.pattern.test(text)),
      )
      expect(hits.map((h) => `${h.file}:${h.line}`)).toEqual([])
    })
  }
})
