import { PropsWithChildren } from "react";
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/useAppTheme";

interface AppScreenProps extends PropsWithChildren {
  scroll?: boolean;
}

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = width < 360 ? 14 : 18;
  const bottomPadding = Platform.OS === "ios" ? Math.max(112, insets.bottom + 98) : 94;
  const content = (
    <View
      style={[
        styles.frame,
        Platform.OS === "web" ? [styles.webFrame, theme.shadows.deep, { backgroundColor: theme.colors.background }] : null
      ]}
    >
      <View style={[styles.content, { paddingBottom: bottomPadding, paddingHorizontal: horizontalPadding }]}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {scroll ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: "stretch"
  },
  scroll: {
    flexGrow: 1,
    width: "100%",
    alignItems: "stretch"
  },
  content: {
    alignItems: "stretch",
    flex: 1,
    gap: 16,
    paddingTop: 10,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center"
  },
  frame: {
    alignSelf: "center",
    flex: 1,
    overflow: "visible",
    width: "100%",
    maxWidth: 460
  },
  webFrame: {
    width: "100vw" as "100%",
    maxWidth: 460
  }
});
