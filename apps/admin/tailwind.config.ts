import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#101C34",
        ink: "#172033",
        pearl: "#F8F5EE",
        sand: "#DCC9A6",
        amber: "#D8A84E",
        mint: "#9ACEC2"
      },
      borderRadius: {
        panel: "8px"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(16, 28, 52, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
