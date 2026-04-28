import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

interface ContentCardProps extends PropsWithChildren {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ContentCard({ children, onPress, style: customStyle }: ContentCardProps) {
  const theme = useAppTheme();
  const style = [styles.card, theme.shadows.soft, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, customStyle];

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={style}>
        {children}
      </Pressable>
    );
  }

  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 18,
    alignSelf: "stretch",
    width: "100%"
  }
});
