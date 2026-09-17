import { Text, C, s, Icon, IconButton } from "@/components/agro/ui";
import { imageSource, avatar } from "@/contexts/agro-context";
import { router, Tabs } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function Header({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: C.bg }}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={{ gap: 4 }}>
          <Text style={s.label}>{eyebrow}</Text>
          <Text style={s.title}>{title}</Text>
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
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        header: ({ options }) => (
          <Header title={options.title ?? "AGRO AI"} eyebrow="AGRO AI" />
        ),
        tabBarActiveTintColor: C.mint,
        tabBarInactiveTintColor: "#647D6E",
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 3 },
        tabBarStyle: {
          backgroundColor: C.bg,
          borderTopColor: C.line,
          height: 72 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
        },
        sceneStyle: { backgroundColor: C.bg },
      }}
    >
      <Tabs.Screen
        name="community"
        options={{
          title: "Farmer Feed",
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Farm",
          header: () => <Header title="Dashboard" eyebrow="FARM CONTROL" />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Agro AI",
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.scanIcon,
                focused && { backgroundColor: "#39795A" },
              ]}
            >
              <Icon name="scan" size={27} color={C.text} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Marketplace",
          tabBarLabel: "Shop",
          header: () => <Header title="Marketplace" eyebrow="AGRO MARKET" />,
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
  scanIcon: {
    width: 50,
    height: 48,
    borderRadius: 17,
    backgroundColor: "#24553E",
    marginTop: -18,
    borderWidth: 1,
    borderColor: "#356B4D",
  },
});
