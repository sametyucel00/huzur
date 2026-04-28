import { Pressable, Text, View, StyleSheet } from "react-native";
import { tr } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

export function ErrorState({
  message = tr.states.error,
  title = "Bir şey yolunda gitmedi",
  actionLabel,
  onAction
}: {
  message?: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.danger }]}>
      <Text style={[styles.kicker, { color: theme.colors.danger }]}>{title}</Text>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={[styles.action, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.actionText, { color: theme.colors.text }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    padding: 16
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900"
  },
  action: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 4,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  actionText: {
    fontSize: 13,
    fontWeight: "900"
  }
});
