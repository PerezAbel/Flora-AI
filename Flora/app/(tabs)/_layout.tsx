import { C, Icon, IconButton, s, Text } from "@/components/agro/ui";
import { avatar, imageSource } from "@/contexts/agro-context";
import { router, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTheme } from "@/contexts/theme-context";

function Header({ title, eyebrow }: { title: string; eyebrow: string }) {
  const { colors, mode } = useTheme();
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.bg }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={styles.header}>
        <View style={{ gap: 4 }}>
          <Text style={[s.label, { color: colors.mint }]}>{eyebrow}</Text>
          <Text style={[s.title, { color: colors.text }]}>{title}</Text>
        </View>
        <View style={s.row}>
          <IconButton
            name="notifications-outline"
            label="Alerts"
            onPress={() => router.navigate("/current-updates")}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="My profile"
            onPress={() => router.navigate("/profile")}
            style={styles.profile}
          >
            <Image source={imageSource(avatar(12))} style={styles.avatar} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        header: ({ options }) => (
          <Header title={options.title ?? "AGRO AI"} eyebrow="" />
        ),
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 3 },
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
          height: 72 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="community"
        options={{
          title: "Feed",
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "FARM",
          tabBarLabel: "Farm",
          header: () => <Header title="My Farm" eyebrow="" />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Farm Assistant",
          tabBarIcon: ({ color, size }) => (
            <Icon name="sparkles" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Market",
          tabBarLabel: "Shop",
          header: () => <Header title="Shop&Market" eyebrow="" />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="bag-handle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="current-updates"
        options={{
          title: "Notifications",
          tabBarLabel: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "My account", href: null }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  profile: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.mint,
    backgroundColor: C.raised,
  },
});
