import {
  Text,
  Button,
  C,
  Card,
  Icon,
  Label,
  Page,
  Pill,
  s,
} from "@/components/agro/ui";
import { imageSource, photos } from "@/contexts/agro-context";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  useAgentData,
  type AgentMode,
  type ScanEntry,
} from "@/contexts/agent-data-context";
import { useTheme } from "@/contexts/theme-context";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { addUploadedSnapshot } = useAgentData();
  const [mode, setMode] = useState<AgentMode>("crop");
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ScanEntry>();
  const [error, setError] = useState("");
  const pick = async (camera: boolean) => {
    setError("");
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError(
            "Allow camera access to photograph your crop or animal, or upload a photo instead.",
          );
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        quality: 0.85,
      };
      const photo = camera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!photo.canceled) {
        setImage(photo.assets[0].uri);
        setResult(undefined);
      }
    } catch {
      setError(
        "Could not open the camera or photo library. Try uploading an image.",
      );
    }
  };
  const analyze = async () => {
    if (!image) return;
    setBusy(true);
    setError("");
    try {
      setResult(await addUploadedSnapshot(mode, image));
    } catch {
      setError("The scan could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Page>
      <View style={{ alignItems: "center", gap: 8, marginVertical: 6 }}>
        <Label>HEALTHIER FARMS START HERE</Label>
        <Text style={[s.title, { fontSize: 29, textAlign: "center" }]}>
          A little insight. A lot of growth.
        </Text>
        <Text style={[s.small, { textAlign: "center" }]}>
          Crop, plant and livestock health in one place.
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
        <Pill
          text="Crops & Plants"
          active={mode === "crop"}
          onPress={() => {
            setMode("crop");
            setResult(undefined);
          }}
        />
        <Pill
          text="Livestock"
          active={mode === "animal"}
          onPress={() => {
            setMode("animal");
            setResult(undefined);
          }}
        />
      </View>
      <ImageBackground
        source={imageSource(image ?? photos.farm)}
        style={[styles.frame, { backgroundColor: colors.card }]}
        imageStyle={{ borderRadius: 23 }}
      >
        <View
          style={[
            styles.frameOverlay,
            image && { backgroundColor: "rgba(5,20,10,0.12)" },
          ]}
        >
          <View style={s.between}>
            <Text style={s.badge}>
              {mode === "crop" ? "PLANT HEALTH" : "ANIMAL HEALTH"}
            </Text>
            <Text style={s.badge}>DEMO SCANNER</Text>
          </View>
          <View style={styles.target}>
            <View style={styles.corner} />
            <View
              style={[
                styles.corner,
                { right: 0, left: "auto", transform: [{ rotate: "90deg" }] },
              ]}
            />
            <View
              style={[
                styles.corner,
                {
                  top: "auto",
                  bottom: 0,
                  transform: [{ rotate: "-90deg" }],
                },
              ]}
            />
            <View
              style={[
                styles.corner,
                {
                  top: "auto",
                  bottom: 0,
                  left: "auto",
                  right: 0,
                  transform: [{ rotate: "180deg" }],
                },
              ]}
            />
            {!image && (
              <Icon
                name={mode === "crop" ? "leaf-outline" : "paw-outline"}
                size={48}
                color={colors.text}
              />
            )}
          </View>
          <Text style={{ color: colors.text, fontSize: 12, textAlign: "center" }}>
            {image
              ? "Photo ready for a sample analysis"
              : "Take a clear photo or choose one from your gallery"}
          </Text>
        </View>
      </ImageBackground>
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Button
            title="Take photo"
            icon="camera-outline"
            onPress={() => void pick(true)}
            disabled={busy}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Upload"
            icon="image-outline"
            secondary
            onPress={() => void pick(false)}
            disabled={busy}
          />
        </View>
      </View>
      {!!image && (
        <Button
          title={busy ? "Analyzing…" : "Preview analysis"}
          icon="scan"
          disabled={busy}
          onPress={() => void analyze()}
        />
      )}
      {busy && <ActivityIndicator color={colors.mint} />}
      {!!error && (
        <Text accessibilityRole="alert" style={[s.text, { color: colors.orange }] }>
          {error}
        </Text>
      )}
      <Text style={s.small}>
        Demo mode: results are sample data, not a diagnosis of your photo. A
        verified disease model is needed for real analysis.
      </Text>
      {result && (
        <Card>
          <Image source={imageSource(result.imageUri ?? (mode === "crop" ? photos.maize : photos.livestock))} style={styles.resultImage} resizeMode="cover" accessibilityLabel={`${mode === "crop" ? "Plant" : "Animal"} scan image`} />
          <View style={s.between}>
            <Label>SAMPLE ANALYSIS</Label>
            <Text style={s.badge}>{result.confidence} · demo</Text>
          </View>
          <Text style={s.title}>{result.result}</Text>
          <Text style={s.text}>{result.description}</Text>
          <Text style={s.sectionTitle}>Care & next steps</Text>
          <Text style={s.text}>
            Record symptoms and seek guidance from an agronomist or veterinarian
            before choosing treatment.
          </Text>
          <Button
            title="View scan history"
            secondary
            icon="time-outline"
            onPress={() => router.push("/history")}
          />
        </Card>
      )}
      <Card>
        <View style={s.row}>
          <Icon name="sparkles-outline" />
          <Text style={s.sectionTitle}>Make every scan count</Text>
        </View>
        <Text style={s.text}>01 Get close to the affected area</Text>
        <Text style={s.text}>02 Use daylight and keep the photo sharp</Text>
        <Text style={s.text}>03 Include the whole leaf or visible symptom</Text>
      </Card>
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Button
            title="Farm dashboard"
            secondary
            icon="grid-outline"
            onPress={() => router.navigate("/dashboard")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Scan history"
            secondary
            icon="time-outline"
            onPress={() => router.push("/history")}
          />
        </View>
      </View>
    </Page>
  );
}
const styles = StyleSheet.create({
  resultImage: { width: '100%', height: 180, borderRadius: 14, backgroundColor: C.raised },
  frame: {
    height: 300,
    borderRadius: 23,
    overflow: "hidden",
    backgroundColor: C.card,
  },
  frameOverlay: {
    flex: 1,
    padding: 17,
    justifyContent: "space-between",
    alignItems: "stretch",
    backgroundColor: "rgba(5,25,12,0.48)",
  },
  target: {
    width: 175,
    height: 150,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 28,
    height: 28,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: C.mint,
    borderTopLeftRadius: 9,
  },
});
