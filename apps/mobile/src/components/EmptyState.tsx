import { Text, View, StyleSheet } from "react-native";
import { tr } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

export function EmptyState({ message = tr.states.empty }: { message?: string }) {
  const theme = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
      <View style={[styles.rule, { backgroundColor: theme.colors.calm }]} />
      <Text style={[theme.typography.body, styles.text, { color: theme.colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 20
  },
  rule: {
    borderRadius: 999,
    height: 3,
    width: 42
  },
  text: {
    textAlign: "center"
  }
});
