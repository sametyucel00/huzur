import { Pressable, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function PrimaryButton({ label, onPress, accessibilityLabel }: ButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[styles.button, theme.shadows.soft, { backgroundColor: theme.mode === "dark" ? theme.colors.primary : theme.colors.primarySoft }]}
    >
      <Text style={[styles.text, { color: theme.mode === "dark" ? "#101C34" : "#FFFFFF" }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 999,
    minHeight: 54,
    justifyContent: "center",
    paddingHorizontal: 22
  },
  text: {
    fontSize: 15,
    fontWeight: "900"
  }
});
