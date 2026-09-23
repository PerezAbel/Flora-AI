import { useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Button, Card, Field, Icon, IconButton, Label, Page, Text, s, type IconName } from "@/components/agro/ui";
import { imageSource, useAgro } from "@/contexts/agro-context";
import { useTheme } from "@/contexts/theme-context";

const paymentMethods = [
  { id: "mpesa", name: "M-Pesa", icon: "phone-portrait-outline", description: "Pay with your M-Pesa mobile wallet." },
  { id: "paypal", name: "PayPal", icon: "wallet-outline", description: "Pay using your PayPal account." },
  { id: "visa", name: "Visa", icon: "card-outline", description: "Pay with a Visa debit or credit card." },
  { id: "mastercard", name: "Mastercard", icon: "card-outline", description: "Pay with a Mastercard debit or credit card." },
] as const satisfies readonly { id: string; name: string; icon: IconName; description: string }[];

type PaymentMethod = typeof paymentMethods[number]["id"];
type Receipt = { reference: string; total: number; method: string; count: number };

const money = (amount: number) => `USD $${amount.toFixed(2)}`;
const createDemoReference = () => `DEMO-${Date.now()}`;

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const { products, cart, setCart, profile } = useAgro();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [notice, setNotice] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const submitted = useRef(false);
  const items = products.filter((product) => Number.isInteger(cart[product.id]) && cart[product.id] > 0);
  const total = items.reduce((sum, product) => sum + Math.round(product.price * 100) * cart[product.id], 0) / 100;
  const count = items.reduce((sum, product) => sum + cart[product.id], 0);
  const selectedMethod = paymentMethods.find((option) => option.id === method)!;
  const backToShop = () => router.replace("/(tabs)/shop");

  const completeDemoPayment = () => {
    if (submitted.current) return;
    if (!items.length || !Number.isFinite(total) || total <= 0) {
      setNotice("Add an item to your cart before checking out.");
      return;
    }
    if (!name.trim() || !address.trim()) {
      setNotice("Enter your full name and delivery address.");
      return;
    }
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    if (!/^\+?\d{9,15}$/.test(normalizedPhone)) {
      setNotice("Enter a valid contact phone number, including the country code where needed.");
      return;
    }
    if (method === "mpesa" && !/^(?:\+?254|0)[17]\d{8}$/.test(normalizedPhone)) {
      setNotice("For M-Pesa, enter a Kenyan number such as 0712345678 or +254712345678.");
      return;
    }
    submitted.current = true;
    setNotice("");
    setReceipt({ reference: createDemoReference(), total, method: selectedMethod.name, count });
    setCart({});
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Page>
          <View style={s.row}>
            <IconButton name="arrow-back" label="Back to shop" onPress={backToShop} />
            <Text style={s.title}>Checkout</Text>
          </View>
          {receipt ? (
            <Card>
              <Icon name="checkmark-circle-outline" size={52} />
              <Label>DEMO COMPLETE</Label>
              <Text style={s.title}>Payment preview complete</Text>
              <Text style={s.text}>No money was charged and no order was sent to a seller.</Text>
              <Text style={s.small}>{receipt.reference}</Text>
              <View style={s.between}>
                <Text style={s.text}>{receipt.count} items · {receipt.method}</Text>
                <Text style={s.sectionTitle}>{money(receipt.total)}</Text>
              </View>
              <Text style={s.small}>Your demo cart has been cleared. This receipt is available only on this screen.</Text>
              <Button title="Continue shopping" onPress={backToShop} />
            </Card>
          ) : !items.length ? (
            <Card>
              <Icon name="bag-outline" size={42} />
              <Text style={s.sectionTitle}>Your cart is empty</Text>
              <Text style={s.small}>Add something for your farm to get started.</Text>
              <Button title="Browse the shop" onPress={backToShop} />
            </Card>
          ) : (
            <>
              <Card>
                <Label>DEMO CHECKOUT</Label>
                <Text style={s.small}>Try the payment flow with sample details. No money will be charged and no delivery will be arranged.</Text>
              </Card>
              <Card>
                <Text style={s.sectionTitle}>Order summary · {count} items</Text>
                {items.map((product) => (
                  <View key={product.id} style={s.row}>
                    <Image source={product.imageUri ? { uri: product.imageUri } : imageSource(product.photo)} style={styles.thumbnail} />
                    <View style={styles.screen}>
                      <Text style={s.text}>{product.name}</Text>
                      <Text style={s.small}>{cart[product.id]} × {money(product.price)}</Text>
                    </View>
                    <Text style={s.text}>{money(Math.round(product.price * 100) * cart[product.id] / 100)}</Text>
                  </View>
                ))}
                <View style={[styles.divider, { backgroundColor: colors.line }]} />
                <View style={s.between}>
                  <Text style={s.text}>Delivery (demo)</Text>
                  <Text style={s.text}>Free</Text>
                </View>
                <View style={s.between}>
                  <Text style={s.sectionTitle}>Total</Text>
                  <Text style={s.value}>{money(total)}</Text>
                </View>
                <Button title="Edit cart" secondary onPress={backToShop} />
              </Card>
              <Card>
                <Text style={s.sectionTitle}>Delivery details</Text>
                <Field label="Full name" value={name} onChangeText={setName} placeholder="Recipient name" />
                <Field label={method === "mpesa" ? "M-Pesa / contact phone" : "Contact phone"} value={phone} onChangeText={setPhone} placeholder="e.g. +254712345678" />
                <Field label="Delivery address" value={address} onChangeText={setAddress} placeholder="Town, street and delivery instructions" multiline />
              </Card>
              <Card>
                <Text style={s.sectionTitle}>Payment method</Text>
                {paymentMethods.map((option) => (
                  <Pressable
                    key={option.id}
                    accessibilityRole="radio"
                    accessibilityLabel={option.name}
                    accessibilityState={{ checked: method === option.id }}
                    onPress={() => { setMethod(option.id); setNotice(""); }}
                    style={[styles.method, { borderColor: method === option.id ? colors.mint : colors.line, backgroundColor: method === option.id ? colors.raised : colors.card }]}
                  >
                    <Icon name={option.icon} />
                    <View style={styles.screen}>
                      <Text style={s.sectionTitle}>{option.name}</Text>
                      <Text style={s.small}>{option.description}</Text>
                    </View>
                    <Icon name={method === option.id ? "radio-button-on" : "radio-button-off"} />
                  </Pressable>
                ))}
                <Text style={s.small}>
                  {method === "mpesa"
                    ? "Demo only: no M-Pesa prompt will be sent. Prices remain in USD; no KES conversion or charge is performed."
                    : method === "paypal"
                      ? "Demo only: you will not be redirected to PayPal or asked to sign in."
                      : "Demo only: no card number, expiry date or security code is needed."}
                </Text>
              </Card>
              {!!notice && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.text}>{notice}</Text>}
              <Button title={`Simulate payment · ${money(total)}`} icon="checkmark-circle-outline" onPress={completeDemoPayment} />
              <Text style={s.small}>Selected: {selectedMethod.name}. This is a demo payment, not a real purchase.</Text>
            </>
          )}
        </Page>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  thumbnail: { width: 52, height: 52, borderRadius: 10 },
  divider: { height: 1, marginVertical: 4 },
  method: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1, borderRadius: 14 },
});
