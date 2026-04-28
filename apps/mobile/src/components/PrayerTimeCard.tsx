import { Text, View, StyleSheet } from "react-native";
import type { PrayerTime } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

interface PrayerTimeCardProps {
  times: PrayerTime[];
  nextKey?: PrayerTime["key"];
}

export function PrayerTimeCard({ times, nextKey }: PrayerTimeCardProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.card, theme.shadows.soft, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {times.map((time) => {
        const active = time.key === nextKey;

        return (
          <View
            key={time.key}
            style={[
              styles.row,
              {
                backgroundColor: active ? theme.colors.accentSoft : "transparent",
                borderColor: active ? theme.colors.accent : "transparent"
              }
            ]}
          >
            <View style={styles.markerWrap}>
              <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
              <View style={[styles.dot, { backgroundColor: active ? theme.colors.accent : theme.colors.surfaceMuted, borderColor: active ? theme.colors.accent : theme.colors.border }]} />
            </View>
            <View style={styles.copy}>
              <Text style={[styles.label, { color: active ? theme.colors.text : theme.colors.textMuted }]}>
                {time.labelTr}
              </Text>
              {active ? <Text style={[styles.activeMeta, { color: theme.colors.accent }]}>Sıradaki vakit</Text> : null}
            </View>
            <Text style={[styles.time, { color: active ? theme.colors.text : theme.colors.text }]}>{time.time}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 6,
    padding: 10,
    alignSelf: "stretch",
    width: "100%"
  },
  row: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 62,
    paddingHorizontal: 12
  },
  markerWrap: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    marginRight: 12,
    width: 18
  },
  line: {
    height: 42,
    position: "absolute",
    width: 1
  },
  dot: {
    borderRadius: 999,
    borderWidth: 1,
    height: 12,
    width: 12
  },
  copy: {
    flex: 1,
    gap: 2
  },
  label: {
    fontSize: 15,
    fontWeight: "800"
  },
  activeMeta: {
    fontSize: 11,
    fontWeight: "900"
  },
  time: {
    fontSize: 18,
    fontWeight: "900"
  }
});
