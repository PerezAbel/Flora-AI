import { type PropsWithChildren } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";
import { Icon, Text } from "@/components/agro/ui";
import { useTheme } from "@/contexts/theme-context";
import { useLanguage } from "@/contexts/language-context";
import { useAgro } from "@/contexts/agro-context";

function Group({ title, children }: PropsWithChildren<{ title: string }>) {
  const { colors } = useTheme();
  return <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.line }]}><Text style={[styles.heading, { color: colors.muted, borderBottomColor: colors.line }]}>{title}</Text><View style={styles.body}>{children}</View></View>;
}
export function ProfileSettings() {
  const { colors, mode, setMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { notifications, setNotifications, metric, setMetric } = useAgro();
  return <View style={{ gap: 10 }}>
    <Group title="APPEARANCE"><Text style={styles.label}>Theme</Text><View style={styles.row}>{(["light", "dark"] as const).map(value => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: mode === value }} onPress={() => setMode(value)} style={[styles.theme, { borderColor: colors.line, backgroundColor: mode === value ? colors.mint : colors.card }]}><Icon name={value === "light" ? "sunny-outline" : "moon-outline"} size={15} color={mode === value ? "#FFFFFF" : colors.text} /><Text style={{ fontSize: 12, color: mode === value ? "#FFFFFF" : colors.text }}>{value === "light" ? "Light Mode" : "Dark Mode"}</Text></Pressable>)}</View></Group>
    <Group title="LANGUAGE & REGION"><Text style={styles.label}>Display Language</Text><View style={[styles.row, { flexWrap: "wrap" }]}>{([{ code: "en", label: "English" }, { code: "sw", label: "Kiswahili" }] as const).map(item => <Pressable key={item.code} accessibilityRole="button" accessibilityState={{ selected: language === item.code }} onPress={() => setLanguage(item.code)} style={[styles.chip, { backgroundColor: language === item.code ? colors.mint : colors.raised }]}><Text style={{ fontSize: 11, color: language === item.code ? "#FFFFFF" : colors.text }}>{item.label}</Text></Pressable>)}{["Kikuyu", "Luo", "Kalenjin"].map(label => <View key={label} accessibilityLabel={`${label}, coming soon`} style={[styles.chip, { backgroundColor: colors.raised, opacity: 0.5 }]}><Text style={{ fontSize: 11 }}>{label}</Text></View>)}</View><Text style={{ fontSize: 10, color: colors.muted }}>More languages coming soon.</Text><View style={[styles.row, { justifyContent: "space-between" }]}><View><Text style={styles.label}>Measurement Units</Text><Text style={{ color: colors.muted, fontSize: 12 }}>{metric ? "Metric" : "Imperial"}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Switch measurement units" onPress={() => setMetric(value => !value)} style={[styles.chip, { backgroundColor: colors.raised }]}><Text style={{ fontSize: 12 }}>Switch</Text></Pressable></View></Group>
    <Group title="NOTIFICATIONS">{[["Disease Alerts", "Crop and animal health warnings"], ["Vet Reminders", "Vaccination and appointment reminders"], ["Market Updates", "New buyers and price alerts"], ["Community Replies", "Responses to your posts"]].map(([title, subtitle], index) => <View key={title} style={[styles.row, { justifyContent: "space-between" }]}><View style={{ flex: 1 }}><Text style={styles.label}>{title}</Text><Text style={{ fontSize: 12, color: colors.muted }}>{subtitle}</Text></View><Switch accessibilityLabel={title} value={notifications[index]} onValueChange={value => setNotifications(old => old.map((item, i) => i === index ? value : item))} trackColor={{ false: colors.line, true: colors.mint }} thumbColor="#FFFFFF" /></View>)}</Group>
  </View>;
}
const styles = StyleSheet.create({ group: { borderWidth: 1, borderRadius: 15, overflow: "hidden" }, heading: { fontSize: 12, fontWeight: "600", padding: 14, borderBottomWidth: 1 }, body: { padding: 15, gap: 12 }, label: { fontSize: 14 }, row: { flexDirection: "row", alignItems: "center", gap: 8 }, theme: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 7 } });
