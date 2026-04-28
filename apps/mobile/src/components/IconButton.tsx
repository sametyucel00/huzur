import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress?: () => void;
}

export function IconButton({ icon, accessibilityLabel, onPress }: IconButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
    width: 46
  }
});
