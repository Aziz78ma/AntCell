import animate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        background: "#05070d",
        foreground: "#f7f4e9",
        panel: "#0a111c",
        glass: "rgba(7, 14, 24, 0.72)",
        border: "rgba(138, 196, 255, 0.16)",
        cyan: {
          DEFAULT: "#6ef2ff",
          bright: "#9ef8ff",
          muted: "#1e9eaf",
        },
        gold: {
          DEFAULT: "#d4a95d",
          bright: "#f4cf88",
          muted: "#7b5a2a",
        },
        danger: "#ff6b8e",
        success: "#66f7b1",
      },
      backgroundImage: {
        "panel-grid":
          "linear-gradient(rgba(110,242,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(110,242,255,0.05) 1px, transparent 1px)",
        aurora:
          "radial-gradient(circle at top left, rgba(110, 242, 255, 0.22), transparent 26%), radial-gradient(circle at top right, rgba(212, 169, 93, 0.18), transparent 30%), radial-gradient(circle at bottom center, rgba(57, 103, 255, 0.18), transparent 35%)",
      },
      boxShadow: {
        panel:
          "0 24px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        cyan: "0 0 0 1px rgba(110, 242, 255, 0.18), 0 0 24px rgba(110, 242, 255, 0.18)",
        gold: "0 0 0 1px rgba(212, 169, 93, 0.16), 0 0 20px rgba(212, 169, 93, 0.18)",
        glow: "0 12px 48px rgba(110, 242, 255, 0.14)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Segoe UI Variable Display", "sans-serif"],
        display: ["Orbitron", "Space Grotesk", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -8px, 0)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.92)", opacity: "0.45" },
          "100%": { transform: "scale(1.08)", opacity: "0.05" },
        },
      },
      animation: {
        shimmer: "shimmer 3.2s linear infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.4s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
