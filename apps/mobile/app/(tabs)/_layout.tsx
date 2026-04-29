import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tr } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

const tabIcons = {
  index: "home-outline",
  "prayer-times": "time-outline",
  duas: "book-outline",
  quran: "library-outline",
  zikr: "radio-button-on-outline",
  settings: "settings-outline"
} as const;

export default function TabsLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [iconsLoaded] = useFonts(Ionicons.font);

  if (!iconsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => {
        const iconName = tabIcons[route.name as keyof typeof tabIcons] ?? "ellipse-outline";

        return {
          headerShown: false,
          lazy: true,
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarItemStyle: {
            justifyContent: "center",
            paddingTop: 3,
            minWidth: 0
          },
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name={iconName} size={20} color={color} />
          ),
          tabBarIconStyle: {
            marginBottom: 0
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: "800"
          },
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: 24,
            borderTopWidth: 1,
            borderWidth: 1,
            bottom: Math.max(4, insets.bottom > 0 ? insets.bottom - 8 : 4),
            elevation: 0,
            height: 64,
            left: 8,
            paddingBottom: 6,
            paddingTop: 6,
            position: "absolute",
            right: 8,
            shadowColor: theme.mode === "dark" ? "#000000" : "#0B1628",
            shadowOpacity: theme.mode === "dark" ? 0.28 : 0.08,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 }
          }
        };
      }}
    >
      <Tabs.Screen name="index" options={{ title: tr.navigation.home }} />
      <Tabs.Screen name="prayer-times" options={{ title: tr.navigation.prayerTimes }} />
      <Tabs.Screen name="duas" options={{ title: tr.navigation.duas }} />
      <Tabs.Screen name="quran" options={{ title: tr.navigation.quran }} />
      <Tabs.Screen name="zikr" options={{ title: tr.navigation.zikr }} />
      <Tabs.Screen name="settings" options={{ title: tr.navigation.settings }} />
      <Tabs.Screen name="qibla" options={{ href: null }} />
      <Tabs.Screen name="moods" options={{ href: null }} />
      <Tabs.Screen name="goals" options={{ href: null }} />
      <Tabs.Screen name="badges" options={{ href: null }} />
      <Tabs.Screen name="paywall" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
      <Tabs.Screen name="sources" options={{ href: null }} />
      <Tabs.Screen name="weekly-reflection" options={{ href: null }} />
      <Tabs.Screen name="daily/[id]" options={{ href: null }} />
      <Tabs.Screen name="dua/[id]" options={{ href: null }} />
      <Tabs.Screen name="event/[id]" options={{ href: null }} />
      <Tabs.Screen name="zikr/[id]" options={{ href: null }} />
      <Tabs.Screen name="quran/[chapterNumber]" options={{ href: null }} />
    </Tabs>
  );
}
