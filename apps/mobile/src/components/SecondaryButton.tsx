import { Pressable, Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryButton({ label, onPress, accessibilityLabel, style }: ButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }, style]}
    >
      <Text style={[styles.text, { color: theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: 18
  },
  text: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center"
  }
});
