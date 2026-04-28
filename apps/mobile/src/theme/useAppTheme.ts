import { useColorScheme } from "react-native";
import { useLocalProfileStore } from "@/stores/localProfileStore";
import { colors, radius, shadows, spacing, typography } from "./tokens";

export function useAppTheme() {
  const scheme = useColorScheme();
  const profileTheme = useLocalProfileStore((state) => state.profile?.theme ?? "system");
  const mode = profileTheme === "system" ? (scheme === "dark" ? "dark" : "light") : profileTheme;

  return {
    mode,
    colors: colors[mode],
    spacing,
    radius,
    typography,
    shadows
  };
}

export type AppTheme = ReturnType<typeof useAppTheme>;
