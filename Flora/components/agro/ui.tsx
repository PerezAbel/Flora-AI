import { useSyncExternalStore } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, PropsWithChildren } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as NativeText,
  type TextProps,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/theme-context";

export function Text({ style, ...props }: TextProps) {
  const { colors } = useTheme();
  return (
    <NativeText
      {...props}
      style={[
        {
          fontFamily:
            Platform.OS === "web"
              ? "system-ui"
              : Platform.OS === "ios"
                ? "System"
                : "sans-serif",
          color: colors.text,
        },
        style,
      ]}
    />
  );
}

export const C = {
  bg: "#0C2218",
  card: "#142F21",
  raised: "#1C3D2D",
  mint: "#79CBA4",
  muted: "#88A397",
  text: "#F5F5E9",
  line: "#254332",
  orange: "#EE8B36",
};
export type IconName = ComponentProps<typeof Ionicons>["name"];
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function Icon({
  name,
  size = 22,
  color,
}: {
  name: IconName;
  size?: number;
  color?: ComponentProps<typeof Ionicons>["color"];
}) {
  const { colors } = useTheme();
  // Icon fonts can be preloaded in the browser but unavailable during export.
  // Keep the first client render identical to the server's placeholder.
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientSnapshot,
    serverSnapshot,
  );
  if (!hydrated) return <View style={{ width: size, height: size }} />;
  return <Ionicons name={name} size={size} color={color ?? colors.mint} accessible={false} />;
}
export function Page({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={[s.screen, { backgroundColor: colors.bg }]}
      contentContainerStyle={s.page}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
export function Card({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return <View style={[s.card, { backgroundColor: colors.card }]}>{children}</View>;
}
export function Label({ children }: PropsWithChildren) {
  return <Text style={s.label}>{children}</Text>;
}
export function Pill({
  text,
  active = false,
  onPress,
}: {
  text: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={text}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[s.pill, { backgroundColor: active ? colors.mint : colors.card }, active && s.pillActive]}
    >
      <Text style={[s.pillText, { color: active ? colors.bg : colors.muted }]}>{text}</Text>
    </Pressable>
  );
}
export function Button({
  title,
  onPress,
  icon,
  secondary,
  disabled,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        { backgroundColor: secondary ? colors.raised : colors.mint },
        secondary && s.secondary,
        (pressed || disabled) && { opacity: 0.55 },
      ]}
    >
      {icon && <Icon name={icon} size={18} color={secondary ? colors.mint : colors.bg} />}
      <Text style={[s.buttonText, { color: secondary ? colors.mint : colors.bg }] }>
        {title}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.iconButton, pressed && { opacity: 0.6 }]}
    >
      <Icon name={name} />
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  numeric,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numeric?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.small}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={numeric ? "decimal-pad" : "default"}
        style={[
          s.input,
          { backgroundColor: colors.card, borderColor: colors.line, color: colors.text },
          multiline && { minHeight: 110, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
export function Sheet({
  visible,
  title,
  onClose,
  children,
}: PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
}>) {
  const { colors } = useTheme();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={s.scrim}>
        <SafeAreaView style={[s.sheet, { backgroundColor: colors.bg }]}>
          <View style={s.between}>
            <Text style={s.sectionTitle}>{title}</Text>
            <IconButton name="close" label="Close" onPress={onClose} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 18, paddingBottom: 24 }}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  page: {
    padding: 16,
    gap: 18,
    paddingBottom: 32,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  card: { backgroundColor: C.card, borderRadius: 18, padding: 16, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    color: C.text,
    fontSize: 27,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "700",
  },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: "700" },
  text: { color: C.text, fontSize: 14, lineHeight: 22 },
  small: { color: C.muted, fontSize: 12, lineHeight: 18 },
  label: {
    color: C.mint,
    fontSize: 10,
    letterSpacing: 1.4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  value: { color: C.mint, fontSize: 25, fontWeight: "800" },
  pill: {
    backgroundColor: C.card,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 24,
  },
  pillActive: { backgroundColor: C.mint },
  pillText: { color: C.muted, fontSize: 12, fontWeight: "700" },
  button: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: C.mint,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: { color: C.bg, fontSize: 14, fontWeight: "700" },
  secondary: {
    backgroundColor: C.raised,
    borderColor: "#37684F",
    borderWidth: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.card,
    borderRadius: 12,
    color: C.text,
    padding: 14,
    fontSize: 14,
  },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    width: "100%",
    maxWidth: 760,
    maxHeight: "90%",
    gap: 16,
  },
  divider: { height: 1, backgroundColor: C.line },
  badge: {
    backgroundColor: C.raised,
    color: C.mint,
    overflow: "hidden",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: "700",
  },
});
