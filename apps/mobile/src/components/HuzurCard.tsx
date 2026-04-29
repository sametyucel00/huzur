import { Text, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface HuzurCardProps {
  title: string;
  message: string;
}

export function HuzurCard({ title, message }: HuzurCardProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.card, theme.shadows.deep, { backgroundColor: theme.colors.primarySoft }]}>
      <View style={[styles.topRule, { backgroundColor: theme.colors.accent }]} />
      <View style={styles.copy}>
        <Text style={[styles.kicker, { color: theme.colors.accent }]}>Bugünün sükûneti</Text>
        <Text style={[theme.typography.title, styles.title, { color: "#FFF8ED" }]}>{title}</Text>
        <Text style={[theme.typography.body, styles.message, { color: "#EDE4D7" }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    gap: 16,
    overflow: "hidden",
    padding: 20,
    width: "100%"
  },
  topRule: {
    borderRadius: 999,
    height: 3,
    opacity: 0.86,
    width: 72
  },
  copy: {
    gap: 12
  },
  kicker: {
    fontSize: 11,
    fontWeight: "900"
  },
  title: {
    flexShrink: 1
  },
  message: {
    flexShrink: 1
  }
});
