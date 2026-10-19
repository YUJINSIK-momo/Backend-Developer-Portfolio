/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--yuyu-${name}) / <alpha-value>)`

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        yuyu: {
          bg: token("bg"),
          surface: token("surface"),
          raised: token("raised"),
          overlay: token("overlay"),
          line: token("line"),
          "line-strong": token("line-strong"),
          fg: token("fg"),
          "fg-muted": token("fg-muted"),
          "fg-subtle": token("fg-subtle"),
          brand: token("brand"),
          "brand-strong": token("brand-strong"),
          ai: token("ai"),
          infra: token("infra"),
          web: token("web"),
          success: token("success"),
          warning: token("warning"),
          danger: token("danger"),
        },
        // 학습 노트 페이지들이 쓰던 navy 단계를 yuyu 바탕 토큰에 묶어 같은 팔레트로 보이게 한다
        navy: {
          900: token("bg"),
          800: token("surface"),
          700: token("raised"),
          600: token("overlay"),
        },
      },
      borderRadius: {
        "yuyu-sm": "var(--yuyu-radius-sm)",
        "yuyu-md": "var(--yuyu-radius-md)",
        "yuyu-lg": "var(--yuyu-radius-lg)",
      },
      boxShadow: {
        "yuyu-raised": "var(--yuyu-shadow-raised)",
      },
      fontFamily: {
        sans: ["var(--yuyu-font-sans)"],
        mono: ["var(--yuyu-font-mono)"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        typing: "typing 1s steps(20, end) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
