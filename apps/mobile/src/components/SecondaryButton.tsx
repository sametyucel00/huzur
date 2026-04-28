import { Pressable, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function SecondaryButton({ label, onPress, accessibilityLabel }: ButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[styles.button, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}
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
    fontSize: 14,
    fontWeight: "800"
  }
});
