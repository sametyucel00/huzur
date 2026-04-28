import { Text, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface SectionTitleProps {
  title: string;
  action?: string;
}

export function SectionTitle({ title, action }: SectionTitleProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.row}>
      <Text style={[theme.typography.section, { color: theme.colors.text }]}>{title}</Text>
      {action ? <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4
  }
});
