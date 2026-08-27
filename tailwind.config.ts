import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ASTITVA 2K26 Cyberpunk Brand Accents
        fest: {
          cyan: {
            DEFAULT: "#06b6d4",
            glow: "#22d3ee",
            dark: "#0891b2",
          },
          purple: {
            DEFAULT: "#8b5cf6",
            glow: "#a855f7",
            dark: "#7c3aed",
          },
          amber: {
            DEFAULT: "#f59e0b",
            glow: "#fbbf24",
            dark: "#d97706",
          },
          emerald: {
            DEFAULT: "#10b981",
            glow: "#34d399",
            dark: "#059669",
          },
          crimson: {
            DEFAULT: "#ef4444",
            glow: "#f87171",
            dark: "#dc2626",
          },
          dark: {
            950: "#020617",
            900: "#0b0f19",
            850: "#0f172a",
            800: "#1e293b",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.5), 0 0 30px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 25px rgba(6, 182, 212, 0.8), 0 0 50px rgba(139, 92, 246, 0.5)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        "radar-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 4s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        "radar-spin": "radar-spin 6s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
