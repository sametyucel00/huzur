import { Animated, Pressable, Text, View, StyleSheet } from "react-native";
import { useRef } from "react";
import { useAppTheme } from "@/theme/useAppTheme";

interface ZikrCounterProps {
  count: number;
  target: number;
  onIncrement: () => void;
}

export function ZikrCounter({ count, target, onIncrement }: ZikrCounterProps) {
  const theme = useAppTheme();
  const ringScale = useRef(new Animated.Value(1)).current;
  const progress = Math.min(100, Math.round((count / target) * 100));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(ringScale, {
        duration: 90,
        toValue: 0.94,
        useNativeDriver: true
      }),
      Animated.spring(ringScale, {
        friction: 5,
        tension: 150,
        toValue: 1,
        useNativeDriver: true
      })
    ]).start();
    onIncrement();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Zikir sayacı, ${count} / ${target}. Artırmak için dokun.`}
      onPress={handlePress}
      style={[
        styles.wrap,
        theme.shadows.deep,
        {
          backgroundColor: theme.colors.primarySoft
        }
      ]}
    >
      <Animated.View style={[styles.ring, { borderColor: theme.colors.calm, transform: [{ scale: ringScale }] }]}>
        <View style={[styles.innerRing, { borderColor: theme.colors.accentSoft }]} />
        <Text style={[styles.count, { color: "#F8F5EE" }]}>{count}</Text>
        <Text style={[theme.typography.caption, { color: "#DCC9A6" }]}>hedef {target}</Text>
      </Animated.View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.colors.accent }]} />
      </View>
      <Text style={[theme.typography.caption, { color: "#ECE7DA" }]}>{progress}% tamamlandı</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    borderRadius: 34,
    gap: 16,
    minHeight: 286,
    justifyContent: "center",
    padding: 24
  },
  ring: {
    alignItems: "center",
    borderRadius: 104,
    borderWidth: 1,
    height: 206,
    justifyContent: "center",
    width: 206
  },
  innerRing: {
    borderRadius: 88,
    borderWidth: 1,
    height: 176,
    opacity: 0.24,
    position: "absolute",
    width: 176
  },
  count: {
    fontSize: 68,
    fontWeight: "900"
  },
  progressTrack: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    height: 5,
    overflow: "hidden",
    width: "72%"
  },
  progressFill: {
    borderRadius: 999,
    height: 5
  }
});
