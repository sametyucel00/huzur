import { PropsWithChildren } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/theme/useAppTheme";

interface AppScreenProps extends PropsWithChildren {
  scroll?: boolean;
}

export function AppScreen({ children, scroll = true }: AppScreenProps) {
  const theme = useAppTheme();
  const content = (
    <View
      style={[
        styles.frame,
        Platform.OS === "web" ? [styles.webFrame, theme.shadows.deep, { backgroundColor: theme.colors.background }] : null
      ]}
    >
      <View style={styles.content}>{children}</View>
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
    alignItems: "center"
  },
  scroll: {
    flexGrow: 1,
    width: "100%"
  },
  content: {
    alignItems: "stretch",
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    paddingBottom: 116,
    paddingTop: 14,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center"
  },
  frame: {
    alignSelf: "center",
    flex: 1,
    overflow: "hidden",
    width: "100%",
    maxWidth: 460
  },
  webFrame: {
    width: "100vw" as "100%",
    maxWidth: 460
  }
});
