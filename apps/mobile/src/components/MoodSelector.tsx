import { Pressable, Text, View, StyleSheet } from "react-native";
import { MOOD_KEYS, MOOD_LABELS_TR, type MoodKey } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

interface MoodSelectorProps {
  selectedMood?: MoodKey;
  maxItems?: number;
  onSelect?: (mood: MoodKey) => void;
}

export function MoodSelector({ selectedMood, maxItems, onSelect }: MoodSelectorProps) {
  const theme = useAppTheme();
  const moods = MOOD_KEYS.filter((mood) => mood !== "focused").slice(0, maxItems);

  return (
    <View style={styles.grid}>
      {moods.map((mood) => {
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
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
    justifyContent: "center"
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    flexBasis: "46%",
    flexGrow: 1,
    gap: 12,
    maxWidth: "48%",
    minHeight: 86,
    minWidth: 0,
    padding: 14,
    width: "46%"
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
