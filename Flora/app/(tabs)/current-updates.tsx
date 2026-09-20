import {
  Text,
  Button,
  Card,
  Icon,
  Page,
  Pill,
  Sheet,
  s,
} from "@/components/agro/ui";
import { useState } from "react";
import { Image, View } from "react-native";
import { useAgentData } from "@/contexts/agent-data-context";
import { imageSource, photos } from "@/contexts/agro-context";
import { useTheme } from "@/contexts/theme-context";

export default function AlertsTab() {
  const { colors } = useTheme();
  const { alerts } = useAgentData();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string>();
  const alert = alerts.find((a) => a.id === selected);
  const visible = alerts.filter(
    (a) =>
      filter === "All" || a.mode === (filter === "Crops" ? "crop" : "animal"),
  );
  return (
    <Page>
      <View style={s.row}>
        {["All", "Crops", "Livestock"].map((f) => (
          <Pill
            key={f}
            text={f}
            active={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>
      <Text style={s.small}>Preview alerts · sample farm data</Text>
      {visible.map((a) => (
        <Card key={a.id}>
          <Image source={imageSource(a.mode === "animal" ? photos.livestock : photos.maize)} style={styles.alertImage} accessibilityLabel={`${a.mode === "animal" ? "Animal" : "Plant"} alert image`} />
          <View style={s.between}>
            <View style={[s.row, { flex: 1 }]}>
              <Icon name="warning-outline" color={colors.orange} />
              <Text style={[s.sectionTitle, { flex: 1 }]}>{a.title}</Text>
            </View>
            <Text style={[s.badge, { color: colors.orange }]}>{a.level}</Text>
          </View>
          <Text style={s.text}>{a.detail}</Text>
          <Text style={s.small}>
            {a.zone} · {a.time}
          </Text>
          <Button
            title="View details"
            secondary
            onPress={() => setSelected(a.id)}
          />
        </Card>
      ))}
      {!visible.length && (
        <Card>
          <Icon name="checkmark-circle-outline" size={36} />
          <Text style={s.sectionTitle}>You’re all caught up</Text>
          <Text style={s.small}>New farm alerts will appear here.</Text>
        </Card>
      )}
      <Sheet
        visible={!!alert}
        title={alert?.title ?? "Alert"}
        onClose={() => setSelected(undefined)}
      >
        <Text style={s.badge}>SAMPLE ALERT</Text>
        <Text style={s.text}>{alert?.summary}</Text>
        <Text style={s.small}>Field: {alert?.zone}</Text>
        <Text style={s.text}>
          Inspect the affected area and record what you observe. This preview
          alert is not a verified diagnosis.
        </Text>
      </Sheet>
    </Page>
  );
}

const styles = { alertImage: { width: "100%" as const, height: 140, borderRadius: 12, marginBottom: 8 } };
