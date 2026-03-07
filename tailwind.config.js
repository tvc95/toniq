/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores principais
        primary: "#6C63FF", // roxo elétrico — identidade do app
        secondary: "#2EC4B6", // verde-água — acertos e feedback positivo
        danger: "#E84855", // vermelho — erros e feedback negativo
        warning: "#FFB703", // amarelo — alertas e streaks

        // Superfícies (tema escuro)
        bg: {
          base: "#0F0F13", // fundo principal
          surface: "#1A1A24", // cards e painéis
          elevated: "#24243A", // modais e dropdowns
        },

        // Texto
        text: {
          primary: "#F0EFF4", // títulos
          secondary: "#9B99A9", // subtítulos e labels
          muted: "#5C5B6B", // placeholders
        },

        // Bordas
        border: {
          DEFAULT: "#2E2E45",
          focus: "#6C63FF",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        display: ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
        heading: ["1.75rem", { lineHeight: "1.2", fontWeight: "600" }],
        title: ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        micro: ["0.75rem", { lineHeight: "1.4" }],
      },

      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },

      boxShadow: {
        "glow-primary": "0 0 20px rgba(108, 99, 255, 0.35)",
        "glow-secondary": "0 0 20px rgba(46, 196, 182, 0.35)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        shake: "shake 0.4s ease-in-out", // feedback de erro
        pop: "pop 0.15s ease-out", // feedback de acerto
        "pulse-slow": "pulse 2.5s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
