import { Pressable, Text, View, StyleSheet } from "react-native";
import { MOOD_KEYS, MOOD_LABELS_TR, type MoodKey } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

interface MoodSelectorProps {
  selectedMood?: MoodKey;
  onSelect?: (mood: MoodKey) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.grid}>
      {MOOD_KEYS.filter((mood) => mood !== "focused").map((mood) => {
        const selected = selectedMood === mood;

        return (
          <Pressable
            key={mood}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={MOOD_LABELS_TR[mood]}
            onPress={() => onSelect?.(mood)}
            style={[
              styles.card,
              {
                backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
                borderColor: selected ? theme.colors.accent : theme.colors.border
              }
            ]}
          >
            <View style={[styles.rule, { backgroundColor: selected ? theme.colors.accent : theme.colors.calm }]} />
            <Text style={[styles.label, { color: selected ? "#FFF8ED" : theme.colors.text }]}>
              {MOOD_LABELS_TR[mood]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between"
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    minHeight: 86,
    padding: 14,
    width: "48%"
  },
  rule: {
    borderRadius: 999,
    height: 3,
    width: 34
  },
  label: {
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18
  }
});
