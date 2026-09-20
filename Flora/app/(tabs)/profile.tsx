import { Text } from "@/components/agro/ui";
import { imageSource, avatar, photos, useAgro } from "@/contexts/agro-context";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Switch,
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
  const { profile, setProfile, notifications, setNotifications, posts } =
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
    <Page>
      <ImageBackground
        source={imageSource(photos.farm)}
        style={[styles.cover, { backgroundColor: colors.card }]}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.coverShade} />
      </ImageBackground>
      <View style={[s.between, { marginTop: -55, alignItems: "flex-end" }]}>
        <View>
          <Image source={imageSource(avatar(12))} style={[styles.avatar, { borderColor: colors.bg, backgroundColor: colors.raised }]} />
          <View style={[styles.verified, { backgroundColor: colors.mint }]}>
            <Icon name="leaf" size={15} color={colors.bg} />
          </View>
        </View>
        <Button
          title="Edit Profile"
          secondary
          onPress={() => {
            setDraft(profile);
            setEdit(true);
          }}
        />
      </View>
      <View style={{ gap: 5 }}>
        <View style={s.row}>
          <Text style={s.title}>{profile.name}</Text>
          <Icon name="leaf" size={16} />
        </View>
        <Text style={s.small}>
          {profile.handle} · {profile.location}
        </Text>
        <Text style={[s.text, { marginTop: 5 }]}>{profile.bio}</Text>
      </View>
      <View style={[styles.stats, { backgroundColor: colors.card }]}>
        {[
          [
            String(
              posts.filter((p) => p.handle.startsWith(profile.handle)).length,
            ),
            "Posts",
          ],
          ["1.2K", "Followers"],
          ["234", "Following"],
          [String(scanHistory.length), "Scans"],
        ].map(([v, k]) => (
          <View style={{ alignItems: "center", gap: 4 }} key={k}>
            <Text style={{ color: colors.mint, fontSize: 18, fontWeight: "800" }}>
              {v}
            </Text>
            <Text style={[s.small, { fontSize: 10 }]}>{k}</Text>
          </View>
        ))}
      </View>
      <Text style={s.sectionTitle}>Badges Earned</Text>
      <View style={s.row}>
        {[
          ["leaf-outline", "Crop Expert", "50+ scans"],
          ["people-outline", "Community Pro", "Top contributor"],
          ["ribbon-outline", "Harvest Hero", "1K+ followers"],
        ].map(([icon, title, sub]) => (
          <View style={[styles.badgeCard, { backgroundColor: colors.card }]} key={title}>
                <Icon name={icon as import('@/components/agro/ui').IconName} size={27} />
            <Text
              style={{
                color: colors.text,
                fontSize: 10,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {title}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 8 }}>{sub}</Text>
          </View>
        ))}
      </View>
      <Text style={[s.small, { fontSize: 10 }]}>
        Sample profile · follower counts and badges are illustrative
      </Text>
      <Text style={s.sectionTitle}>Notifications</Text>
      <View style={[styles.group, { backgroundColor: colors.card }]}>
        {[
          "Disease Alerts",
          "Community Posts",
          "Market Deals",
          "Weather Alerts",
        ].map((name, i) => (
          <View style={[styles.setting, i < 3 && styles.line]} key={name}>
            <View style={s.row}><Icon name={(["warning-outline", "people-outline", "pricetag-outline", "sunny-outline"] as const)[i]} size={18} /><Text style={s.text}>{name}</Text></View>
            <Switch
              accessibilityLabel={name}
              value={notifications[i]}
              onValueChange={(value) =>
                setNotifications((old) =>
                  old.map((v, j) => (j === i ? value : v)),
                )
              }
              trackColor={{ false: colors.line, true: colors.raised }}
              thumbColor={notifications[i] ? colors.mint : colors.muted}
            />
          </View>
        ))}
      </View>
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
    </Page>
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
