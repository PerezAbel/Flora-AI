import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileSettings } from "@/components/agro/profile-settings";
import { Text } from "@/components/agro/ui";
import { imageSource, avatar, useAgro } from "@/contexts/agro-context";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import { useAgentData } from "@/contexts/agent-data-context";
import {
  Button,
  C,
  Card,
  Field,
  Icon,
  Page,
  Sheet,
  s,
  type IconName,
} from "@/components/agro/ui";

export default function ProfileTab() {
  const { profile, setProfile } =
    useAgro();
  const { colors } = useTheme();
  const { scanHistory } = useAgentData();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [panel, setPanel] = useState<string>();
  const settings: { title: string; icon: IconName }[] = [
    { title: "Appearance & Settings", icon: "color-palette-outline" },
    { title: "Privacy & Security", icon: "lock-closed" },
    { title: "Payment Methods", icon: "card" },
    { title: "Language & Region", icon: "globe" },
    { title: "Scan History", icon: "clipboard" },
    { title: "Help & Support", icon: "help-buoy" },
  ];
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#1C6035" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: "#1C6035" }}><Image source={imageSource(avatar(12))} style={{ width: 52, height: 52, borderRadius: 26 }} /><View style={{ flex: 1 }}><Text style={{ color: "#FFFFFF", fontFamily: "serif", fontSize: 21, fontWeight: "700" }}>{profile.name}</Text><Text style={{ color: "#D0E4D4", fontSize: 11 }}>{profile.location}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Edit profile" onPress={() => { setDraft(profile); setEdit(true); }}><Icon name="create-outline" color="#FFFFFF" /></Pressable></View>
    <Page>
      <ProfileSettings />
      <Text style={s.sectionTitle}>Account</Text>
      <View style={[styles.group, { backgroundColor: colors.card }]}>
        {settings.map((item, i) => (
          <Pressable
            accessibilityRole="button"
            key={item.title}
          onPress={() => item.title === "Appearance & Settings" ? router.push("/settings") : setPanel(item.title)}
            style={[styles.setting, i < settings.length - 1 && styles.line, { borderBottomColor: colors.line }]}
          >
            <View style={s.row}>
              <Icon name={item.icon} size={18} />
              <Text style={s.text}>{item.title}</Text>
            </View>
            <Icon name="chevron-forward" size={16} color={colors.muted} />
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setPanel("Sign Out")}
        style={[styles.signout, { backgroundColor: colors.card, borderColor: colors.line }]}
      >
        <Text style={{ color: colors.orange, fontWeight: "700" }}>Sign Out</Text>
      </Pressable>
      <Sheet visible={edit} title="Edit profile" onClose={() => setEdit(false)}>
        <Field
          label="Name"
          value={draft.name}
          onChangeText={(name) => setDraft({ ...draft, name })}
        />
        <Field
          label="Handle"
          value={draft.handle}
          onChangeText={(handle) => setDraft({ ...draft, handle })}
        />
        <Field
          label="Location"
          value={draft.location}
          onChangeText={(location) => setDraft({ ...draft, location })}
        />
        <Field
          label="Bio"
          value={draft.bio}
          onChangeText={(bio) => setDraft({ ...draft, bio })}
          multiline
        />
        <Text style={s.small}>Changes are saved for this preview session.</Text>
        <Button
          title="Save changes"
          disabled={!draft.name.trim()}
          onPress={() => {
            setProfile(draft);
            setEdit(false);
          }}
        />
      </Sheet>
      <Sheet
        visible={!!panel}
        title={panel ?? ""}
        onClose={() => setPanel(undefined)}
      >
        {panel === "Scan History" ? (
          <>
            {!scanHistory.length && (
              <Text style={s.text}>
                No scans yet. Your crop and livestock checks will appear here.
              </Text>
            )}
            {scanHistory.map((entry) => (
              <Card key={entry.id}>
                <Text style={s.sectionTitle}>{entry.result}</Text>
                <Text style={s.small}>
                  {entry.mode} · {entry.time} · Demo scan
                </Text>
              </Card>
            ))}
          </>
        ) : panel === "Sign Out" ? (
          <>
            <Text style={s.text}>Return to the login screen?</Text>
            <Button
              title="Sign Out"
              onPress={() => {
                setPanel(undefined);
                router.replace("/login");
              }}
            />
          </>
        ) : panel === "Payment Methods" ? (
          <>
            <Icon name="card-outline" size={40} />
            <Text style={s.sectionTitle}>No payment methods added</Text>
            <Text style={s.small}>
              Payments are not available in the marketplace preview.
            </Text>
          </>
        ) : panel === "Privacy & Security" ? (
          <>
            <Icon name="shield-checkmark-outline" size={40} />
            <Text style={s.text}>You control your farm profile</Text>
            <Text style={s.small}>
              Posts, profile edits and shopping activity in this preview stay in
              the current app session. Account security controls will be
              available when sign-in is connected.
            </Text>
          </>
        ) : panel === "Language & Region" ? (
          <>
            <Text style={s.text}>Current region: {profile.location}</Text>
            <Button
              title="Language settings"
              secondary
              onPress={() => {
                setPanel(undefined);
                router.push("/language-settings");
              }}
            />
          </>
        ) : (
          <>
            <Text style={s.sectionTitle}>How can we help?</Text>
            <Text style={s.text}>
              Use Agro AI to explore crop and livestock scans. Visit Farm to
              preview monitoring devices, Feed to share an update, and Shop to
              browse or create a listing.
            </Text>
            <Text style={s.small}>
              This preview does not provide a verified diagnosis, live device
              connections or checkout.
            </Text>
          </>
        )}
      </Sheet>
    </Page></SafeAreaView>
  );
}
const styles = StyleSheet.create({
  cover: {
    height: 125,
    backgroundColor: C.card,
    marginHorizontal: -16,
    marginTop: -16,
  },
  coverShade: { flex: 1, backgroundColor: "rgba(9,31,18,0.24)" },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: C.bg,
    backgroundColor: C.raised,
  },
  verified: {
    position: "absolute",
    bottom: -2,
    right: -3,
    backgroundColor: C.mint,
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: C.card,
    borderRadius: 17,
    paddingVertical: 17,
  },
  badgeCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 16,
    paddingVertical: 15,
    gap: 5,
  },
  group: { backgroundColor: C.card, borderRadius: 17, overflow: "hidden" },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 55,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  line: { borderBottomWidth: 1, borderBottomColor: C.line },
  signout: {
    borderWidth: 1,
    borderColor: "#5B4824",
    borderRadius: 14,
    backgroundColor: "#252F1C",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
