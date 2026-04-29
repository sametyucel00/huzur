import { Pressable, Text, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface DailyActionCardProps {
  title: string;
  completed?: boolean;
  onPress?: () => void;
}

export function DailyActionCard({ title, completed = false, onPress }: DailyActionCardProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}${completed ? ", tamamlandı" : ", tamamlanmadı"}`}
      onPress={onPress}
      style={[styles.card, { backgroundColor: completed ? theme.colors.calmSoft : theme.colors.surface, borderColor: completed ? theme.colors.calm : theme.colors.border }]}
    >
      <View style={[styles.mark, { backgroundColor: completed ? theme.colors.calm : "transparent", borderColor: completed ? theme.colors.calm : theme.colors.border }]}>
        {completed ? <View style={[styles.markInner, { backgroundColor: theme.colors.primarySoft }]} /> : null}
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 16
  },
  mark: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    flexShrink: 0,
    width: 24
  },
  markInner: {
    borderRadius: 999,
    height: 8,
    width: 8
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: "800"
  }
});
