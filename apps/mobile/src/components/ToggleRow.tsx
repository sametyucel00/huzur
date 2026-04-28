import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface ToggleRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: () => void;
}

export function ToggleRow({ title, subtitle, value, onToggle }: ToggleRowProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={title}
      onPress={onToggle}
      style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.track, { backgroundColor: value ? theme.colors.calm : theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
        <View style={[styles.thumb, { backgroundColor: value ? "#101C34" : theme.colors.textMuted, marginLeft: value ? 22 : 3 }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  copy: {
    flex: 1,
    gap: 3
  },
  title: {
    fontSize: 15,
    fontWeight: "700"
  },
  track: {
    borderRadius: 999,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 52
  },
  thumb: {
    borderRadius: 999,
    height: 24,
    width: 24
  }
});
