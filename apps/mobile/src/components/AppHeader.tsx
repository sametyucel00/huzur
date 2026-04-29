import { Text, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface AppHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function AppHeader({ eyebrow, title, subtitle }: AppHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={[styles.eyebrow, { color: theme.colors.accent }]}>{eyebrow.toLocaleUpperCase("tr-TR")}</Text> : null}
      <Text style={[theme.typography.display, styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[theme.typography.body, styles.subtitle, { color: theme.colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    paddingTop: 4,
    minWidth: 0
  },
  title: {
    flexShrink: 1
  },
  subtitle: {
    flexShrink: 1
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900"
  }
});
