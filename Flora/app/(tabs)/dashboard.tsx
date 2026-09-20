import { Text } from "@/components/agro/ui";
import { imageSource, photos } from "@/contexts/agro-context";
import { useState } from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/contexts/theme-context";
import {
  Button,
  C,
  Card,
  Icon,
  Label,
  Page,
  Pill,
  Sheet,
  s,
  type IconName,
} from "@/components/agro/ui";

const farms = [
  {
    name: "North Field",
    detail: "12ac · Maize",
    health: 87,
    moisture: 68,
    temperature: 27,
    humidity: 74,
    rain: 12,
  },
  {
    name: "South Field",
    detail: "8ac · Tomato",
    health: 64,
    moisture: 52,
    temperature: 29,
    humidity: 68,
    rain: 9,
  },
  {
    name: "Livestock Pen",
    detail: "4ac · Cattle & Poultry",
    health: 92,
    moisture: 62,
    temperature: 26,
    humidity: 71,
    rain: 12,
  },
];
const devices: {
  name: string;
  kind: string;
  icon: IconName;
  battery: number;
}[] = [
  { name: "AgriDrone X1", kind: "Drone", icon: "airplane", battery: 72 },
  { name: "SoilSense Pro", kind: "Soil sensor", icon: "radio", battery: 91 },
  { name: "IrriBot 3000", kind: "Irrigation", icon: "water", battery: 55 },
  {
    name: "WeatherMast",
    kind: "Weather station",
    icon: "partly-sunny",
    battery: 88,
  },
];
function Trend({ values }: { values: number[] }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(280);
  return (
    <View
      accessibilityLabel={`Seven-day trend: ${values.join(", ")}`}
      style={{ height: 100 }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View
        style={{
          height: 76,
          position: "relative",
          overflow: "hidden",
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}
      >
        {values.slice(0, -1).map((v, i) => {
          const dx = width / 6;
          const y = 73 - v * 0.65;
          const dy = (v - values[i + 1]) * 0.65;
          return (
            <View
              key={i}
              style={{
                position: "absolute",
                left: dx * i,
                top: y,
                width: Math.sqrt(dx * dx + dy * dy),
                height: 2,
                backgroundColor: colors.mint,
                transformOrigin: "left center",
                transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
              }}
            />
          );
        })}
      </View>
      <View style={s.between}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <Text key={i} style={[s.small, { fontSize: 9 }]}>
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}
export default function DashboardTab() {
  const { colors, mode } = useTheme();
  const [selected, setSelected] = useState(0);
  const [metric, setMetric] = useState("Health");
  const [device, setDevice] = useState<string>();
  const [pairing, setPairing] = useState(false);
  const [simulated, setSimulated] = useState(true);
  const farm = farms[selected];
  const trend =
    metric === "Health"
      ? [40, 28, 68, 53, 76, 87, 80]
      : metric === "Moisture"
        ? [50, 65, 42, 58, 76, 64, 68]
        : [35, 42, 40, 53, 45, 59, 52];
  return (
    <Page>
      <View style={s.between}>
        <Label>FARM OVERVIEW</Label>
        <Pill text="Connect device" onPress={() => setPairing(true)} />
      </View>
      <View style={{ flexDirection: "row", gap: 7 }}>
        {farms.map((f, i) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected === i }}
            onPress={() => setSelected(i)}
            key={f.name}
            style={[
              styles.farmTab,
              { backgroundColor: selected === i ? colors.mint : colors.card, borderColor: colors.line },
            ]}
          >
            <Text
              style={{
                color: selected === i ? colors.bg : colors.text,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {f.name}
            </Text>
            <Text
              style={{
                color: selected === i ? colors.bg : colors.muted,
                fontSize: 9,
                marginTop: 3,
              }}
            >
              {f.detail}
            </Text>
          </Pressable>
        ))}
      </View>
      <ImageBackground
        source={imageSource(photos.farm)}
        imageStyle={{ borderRadius: 17 }}
        style={[styles.hero, { backgroundColor: colors.card }]}
      >
        <View style={[styles.heroOverlay, { backgroundColor: mode === "dark" ? "rgba(9,30,17,0.32)" : "rgba(255,255,255,0.28)" }]}>
          <View style={s.between}>
            <Text style={s.badge}>DRONE VIEW · DEMO</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.navigate("/current-updates")}
            >
              <View style={[s.row, s.badge]}><Icon name="warning-outline" size={12} color={colors.orange} /><Text style={{ color: colors.orange, fontSize: 10, fontWeight: '700' }}>1 alert</Text></View>
            </Pressable>
          </View>
          <View style={s.between}>
            <View>
              <Text style={s.title}>{farm.name}</Text>
              <Text style={s.text}>{farm.detail}</Text>
            </View>
            <View>
              <Text style={[s.value, { color: colors.text, fontSize: 32 }] }>
                {farm.health}%
              </Text>
              <Text style={s.small}>Health</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.grid}>
        {(
          [
            {
              icon: "water",
              value: `${farm.moisture}%`,
              label: "Soil Moisture",
              badge: "+2%",
            },
            {
              icon: "thermometer",
              value: `${farm.temperature}°C`,
              label: "Temperature",
              badge: "Optimal",
            },
            {
              icon: "cloud",
              value: `${farm.humidity}%`,
              label: "Humidity",
              badge: "-1%",
            },
            {
              icon: "rainy",
              value: `${farm.rain}mm`,
              label: "Rainfall",
              badge: "This wk",
            },
          ] as const
        ).map((item, i) => (
          <View key={item.label} style={[styles.metric, { backgroundColor: colors.card }] }>
            <View style={s.between}>
              <Icon name={item.icon} color={i === 1 ? colors.orange : colors.mint} />
              <Text style={[s.badge, { fontSize: 9 }]}>{item.badge}</Text>
            </View>
            <Text style={[s.value, i === 1 && { color: colors.orange }] }>
              {item.value}
            </Text>
            <Text style={s.small}>{item.label}</Text>
          </View>
        ))}
      </View>
      <Card>
        <View style={s.between}>
          <Text style={s.sectionTitle}>7-Day Trends</Text>
          <Text style={s.small}>Sample week</Text>
        </View>
        <View style={s.row}>
          {["Health", "Moisture", "Temp"].map((m) => (
            <View key={m} style={{ flex: 1 }}>
              <Pill
                text={m}
                active={metric === m}
                onPress={() => setMetric(m)}
              />
            </View>
          ))}
        </View>
        <Trend values={trend} />
        <View style={[s.row, { gap: 24 }]}>
          {[
            ["Min", Math.min(...trend) + "%"],
            ["Max", Math.max(...trend) + "%"],
            ["Avg", Math.round(trend.reduce((a, b) => a + b, 0) / 7) + "%"],
            ["Trend", "↑ Up"],
          ].map(([k, v]) => (
            <View key={k}>
              <Text style={s.small}>{k}</Text>
              <Text style={{ color: colors.mint, fontWeight: "700", fontSize: 12 }}>
                {metric === "Temp" && k !== "Trend"
                  ? `${Math.round(parseInt(v) / 4 + 10)}°C`
                  : v}
              </Text>
            </View>
          ))}
        </View>
      </Card>
      <Card>
        <Text style={s.sectionTitle}>All Farms Overview</Text>
        {farms.map((f, i) => (
          <Pressable
            accessibilityRole="button"
            key={f.name}
            onPress={() => setSelected(i)}
            style={{ gap: 6, paddingVertical: 3 }}
          >
            <View style={s.between}>
              <Text style={[s.text, { fontSize: 13, fontWeight: "600" }]}>
                {f.name}
              </Text>
              <Text
                style={{
                  color: i === 1 ? colors.orange : colors.mint,
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >
                {f.health}%{" "}
                <Text style={s.small}>{f.detail.split(" · ")[0]}</Text>
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.line }]}>
              <View
                style={{
                  width: `${f.health}%`,
                  height: 6,
                  borderRadius: 4,
                  backgroundColor: i === 1 ? colors.orange : colors.mint,
                }}
              />
            </View>
          </Pressable>
        ))}
      </Card>
      <View style={s.between}>
        <Text style={s.sectionTitle}>Connected Devices</Text>
        <Text style={s.badge}>Demo setup</Text>
      </View>
      {devices.map((d) => (
        <Pressable
          accessibilityRole="button"
          key={d.name}
          onPress={() => setDevice(d.name)}
          style={[styles.device, { backgroundColor: colors.card }]}
        >
          <View style={[styles.deviceIcon, { backgroundColor: colors.raised }] }>
            <Icon name={d.icon} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.text, { fontWeight: "700", fontSize: 13 }]}>
              {d.name}
            </Text>
            <Text style={s.small}>{d.kind}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: colors.mint, fontSize: 10 }}>
              ● {simulated ? "Simulated" : "Offline"}
            </Text>
            <View style={s.row}>
              <Icon name="battery-half" size={13} color={colors.muted} />
              <Text style={s.small}>{d.battery}%</Text>
            </View>
          </View>
        </Pressable>
      ))}
      <Text style={s.small}>
        Preview farm data. Live readings appear once supported hardware is
        connected.
      </Text>
      <Button
        title="Scan this farm"
        icon="scan"
        onPress={() => router.navigate("/home")}
      />
      <Sheet
        visible={pairing || !!device}
        title={device ?? "Connect your farm"}
        onClose={() => {
          setPairing(false);
          setDevice(undefined);
        }}
      >
        <Icon name="bluetooth" size={42} />
        <Text style={s.text}>
          {device
            ? "Explore this device in the demo farm."
            : "Connect a drone, soil sensor, irrigation system or weather station."}
        </Text>
        <Text style={s.small}>
          This interface previews device management. Bluetooth pairing and live
          telemetry require a supported device integration.
        </Text>
        <Button
          title={simulated ? "Pause demo connection" : "Resume demo connection"}
          secondary
          onPress={() => setSimulated(!simulated)}
        />
        <Text style={s.badge}>
          Demo connection: {simulated ? "active" : "paused"}
        </Text>
      </Sheet>
    </Page>
  );
}
const styles = StyleSheet.create({
  farmTab: {
    flex: 1,
    padding: 11,
    borderRadius: 13,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
  },
  hero: {
    height: 170,
    backgroundColor: C.card,
    borderRadius: 17,
    overflow: "hidden",
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(9,30,17,0.32)",
    padding: 15,
    justifyContent: "space-between",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  metric: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: C.card,
    borderRadius: 17,
    padding: 13,
    gap: 6,
  },
  track: { backgroundColor: C.line, height: 6, borderRadius: 4 },
  device: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: C.card,
    marginTop: -7,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.raised,
    alignItems: "center",
    justifyContent: "center",
  },
});
