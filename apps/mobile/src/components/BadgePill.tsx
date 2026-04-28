import { Text, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface BadgePillProps {
  label: string;
  tone?: "accent" | "calm" | "neutral";
}

export function BadgePill({ label, tone = "neutral" }: BadgePillProps) {
  const theme = useAppTheme();
  const backgroundColor =
    tone === "accent" ? theme.colors.accentSoft : tone === "calm" ? theme.colors.calmSoft : theme.colors.surfaceMuted;

  return (
    <View style={[styles.pill, { backgroundColor, borderColor: theme.colors.border }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  text: {
    fontSize: 11,
    fontWeight: "900"
  }
});
