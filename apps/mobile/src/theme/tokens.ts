export const colors = {
  light: {
    background: "#F8F6F1",
    surface: "#FFFFFF",
    surfaceMuted: "#F0ECE3",
    elevated: "#FFFFFF",
    text: "#101828",
    textMuted: "#667085",
    border: "#E0D8CB",
    primary: "#0B1628",
    primarySoft: "#10213B",
    secondary: "#D7C7AD",
    accent: "#B7792A",
    accentSoft: "#F3E4C8",
    calm: "#6BAEA5",
    calmSoft: "#E7F2EF",
    danger: "#B85F5A",
    success: "#4E8F76",
    overlay: "rgba(11, 22, 40, 0.08)"
  },
  dark: {
    background: "#070D18",
    surface: "#0D1728",
    surfaceMuted: "#142035",
    elevated: "#18263D",
    text: "#F8F2E9",
    textMuted: "#AAB4C5",
    border: "#263850",
    primary: "#F2DFC0",
    primarySoft: "#12213A",
    secondary: "#2A3B55",
    accent: "#E4B967",
    accentSoft: "#3A2F1E",
    calm: "#93C9BF",
    calmSoft: "#183830",
    danger: "#E08A87",
    success: "#79C4A5",
    overlay: "rgba(255, 252, 246, 0.08)"
  }
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  full: 999
} as const;

export const typography = {
  display: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800" as const
  },
  title: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: "800" as const
  },
  section: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800" as const
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const
  },
  caption: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600" as const
  },
  micro: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800" as const
  }
} as const;

export const shadows = {
  soft: {
    shadowColor: "#101C34",
    shadowOpacity: 0.07,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 4
  },
  calm: {
    shadowColor: "#8CC7BA",
    shadowOpacity: 0.14,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 5
  },
  deep: {
    shadowColor: "#0B1628",
    shadowOpacity: 0.18,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 22 },
    elevation: 7
  }
} as const;
