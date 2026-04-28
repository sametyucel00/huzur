import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { tr } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

export function LoadingState() {
  const theme = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
      <ActivityIndicator color={theme.colors.accent} />
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{tr.states.loading}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 24
  }
});
