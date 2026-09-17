import {
  Text,
  Button,
  C,
  Card,
  Field,
  Icon,
  IconButton,
  Label,
  Page,
  Pill,
  Sheet,
  s,
} from "@/components/agro/ui";
import { imageSource } from "@/contexts/agro-context";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { photos, useAgro, type Product } from "@/contexts/agro-context";

const categories = [
  "All",
  "Seeds",
  "Fertilizers",
  "Pesticides",
  "Equipment",
  "Produce",
];
export default function ShopTab() {
  const { products, setProducts, cart, setCart, profile } = useAgro();
  const [mode, setMode] = useState("Buy");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [detail, setDetail] = useState<Product>();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [listingCategory, setListingCategory] = useState("Seeds");
  const [notice, setNotice] = useState("");
  const visible = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      `${p.name} ${p.seller}`.toLowerCase().includes(query.toLowerCase()),
  );
  const total = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] ?? 0),
    0,
  );
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const add = (p: Product) =>
    setCart((old) => ({ ...old, [p.id]: (old[p.id] ?? 0) + 1 }));
  const save = () => {
    const amount = Number(price);
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a product name and a price greater than zero.");
      return;
    }
    setProducts((old) => [
      {
        id: `local-${Date.now()}`,
        name: name.trim(),
        price: amount,
        category: listingCategory,
        photo: listingCategory === "Produce" ? photos.vegetables : photos.tools,
        seller: profile.name,
        badge: "Your listing",
      },
      ...old,
    ]);
    setName("");
    setPrice("");
    setNotice("Listing saved in this preview.");
  };
  return (
    <Page>
      <View style={s.row}>
        <View style={styles.segment}>
          {["Buy", "Sell"].map((m) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: mode === m }}
              accessibilityLabel={m}
              key={m}
              onPress={() => {
                setMode(m);
                setNotice("");
              }}
              style={[
                styles.segmentItem,
                mode === m && { backgroundColor: "#398565" },
              ]}
            >
              <Icon
                name={m === "Buy" ? "cart-outline" : "pricetag-outline"}
                size={15}
                color={mode === m ? C.text : C.muted}
              />
              <Text
                style={{
                  color: mode === m ? C.text : C.muted,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cart, ${count} items`}
          onPress={() => setShowCart(true)}
          style={styles.cart}
        >
          <Icon name="bag-outline" />
          <Text style={s.badge}>{count}</Text>
        </Pressable>
      </View>
      {mode === "Buy" ? (
        <>
          <View style={styles.search}>
            <Icon name="search" size={18} color={C.muted} />
            <TextInput
              accessibilityLabel="Search products"
              placeholder="Search products, seeds, equipment…"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
              style={{
                flex: 1,
                color: C.text,
                fontSize: 13,
                paddingVertical: 14,
              }}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {categories.map((c) => (
              <Pill
                key={c}
                text={c}
                active={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </ScrollView>
          <ImageBackground
            source={imageSource(photos.vegetables)}
            style={styles.banner}
            imageStyle={{ borderRadius: 16 }}
          >
            <View style={styles.bannerShade}>
              <Label>GROW MORE, TOGETHER</Label>
              <Text style={[s.title, { fontSize: 23, maxWidth: 210 }]}>
                Good things start{"\n"}with your farm.
              </Text>
              <Text style={s.small}>Explore the sample marketplace</Text>
            </View>
          </ImageBackground>
          <View style={styles.grid}>
            {visible.map((p) => (
              <View key={p.id} style={styles.product}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`View ${p.name}`}
                  onPress={() => setDetail(p)}
                >
                  <Image
                    source={imageSource(p.photo)}
                    style={styles.productImage}
                  />
                  <Text style={styles.productBadge}>{p.badge}</Text>
                  <View style={{ padding: 12, gap: 4 }}>
                    <Text style={[s.small, { fontSize: 10 }]}>{p.seller}</Text>
                    <Text
                      style={[
                        s.text,
                        { fontWeight: "700", fontSize: 13, lineHeight: 18 },
                      ]}
                    >
                      {p.name}
                    </Text>
                    <Text style={{ color: C.orange, fontSize: 10 }}>
                      ★ 4.8 · Sample listing
                    </Text>
                  </View>
                </Pressable>
                <View
                  style={[
                    s.between,
                    { paddingHorizontal: 12, paddingBottom: 10 },
                  ]}
                >
                  <Text
                    style={{ color: C.mint, fontSize: 17, fontWeight: "800" }}
                  >
                    ${p.price.toFixed(2)}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${p.name} to cart`}
                    onPress={() => add(p)}
                    style={styles.add}
                  >
                    <Icon name="add" size={18} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          {!visible.length && (
            <Card>
              <Text style={s.sectionTitle}>No products found</Text>
              <Text style={s.small}>Try another search or category.</Text>
              <Button
                title="Clear filters"
                secondary
                onPress={() => {
                  setQuery("");
                  setCategory("All");
                }}
              />
            </Card>
          )}
        </>
      ) : (
        <>
          <Card>
            <Label>YOUR FARM. YOUR MARKET.</Label>
            <Text style={s.title}>Start selling</Text>
            <Text style={s.small}>
              Create a sample listing for your produce, supplies or equipment.
            </Text>
            <Field
              label="Product name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Fresh maize · 10kg"
            />
            <Field
              label="Price (USD)"
              value={price}
              onChangeText={setPrice}
              numeric
              placeholder="0.00"
            />
            <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
              {categories.slice(1).map((c) => (
                <Pill
                  key={c}
                  text={c}
                  active={listingCategory === c}
                  onPress={() => setListingCategory(c)}
                />
              ))}
            </ScrollView>
            <Button title="Save listing" icon="add" onPress={save} />
            {!!notice && (
              <Text accessibilityLiveRegion="polite" style={s.text}>
                {notice}
              </Text>
            )}
          </Card>
          <Text style={s.sectionTitle}>Your listings</Text>
          {products
            .filter((p) => p.id.startsWith("local-"))
            .map((p) => (
              <Card key={p.id}>
                <View style={s.between}>
                  <Text style={s.text}>{p.name}</Text>
                  <Text style={s.badge}>${p.price.toFixed(2)}</Text>
                </View>
              </Card>
            ))}
          <Text style={s.small}>
            Preview listings are saved for this session and are not published to
            other users.
          </Text>
        </>
      )}
      <Sheet
        visible={showCart}
        title={`Your cart · ${count} items`}
        onClose={() => setShowCart(false)}
      >
        {products
          .filter((p) => cart[p.id])
          .map((p) => (
            <View style={s.card} key={p.id}>
              <Text style={s.sectionTitle}>{p.name}</Text>
              <View style={s.between}>
                <Text style={s.text}>${(p.price * cart[p.id]).toFixed(2)}</Text>
                <View style={s.row}>
                  <IconButton
                    name="remove"
                    label={`Remove one ${p.name}`}
                    onPress={() =>
                      setCart((old) => ({
                        ...old,
                        [p.id]: Math.max(0, old[p.id] - 1),
                      }))
                    }
                  />
                  <Text style={s.text}>{cart[p.id]}</Text>
                  <IconButton
                    name="add"
                    label={`Add one ${p.name}`}
                    onPress={() => add(p)}
                  />
                </View>
              </View>
            </View>
          ))}
        {!count ? (
          <Text style={s.text}>
            Your cart is empty. Find something for your farm.
          </Text>
        ) : (
          <>
            <View style={s.between}>
              <Text style={s.sectionTitle}>Total</Text>
              <Text style={s.value}>${total.toFixed(2)}</Text>
            </View>
            <Text style={s.small}>
              This is a marketplace preview. Checkout and payments are not
              available yet.
            </Text>
          </>
        )}
      </Sheet>
      <Sheet
        visible={!!detail}
        title={detail?.name ?? "Product"}
        onClose={() => setDetail(undefined)}
      >
        {detail && (
          <>
            <Image
              source={imageSource(detail.photo)}
              style={[styles.productImage, { height: 220, borderRadius: 14 }]}
            />
            <Text style={s.text}>Sold by {detail.seller}</Text>
            <Text style={s.value}>${detail.price.toFixed(2)}</Text>
            <Text style={s.small}>
              {detail.category} · Sample marketplace listing
            </Text>
            <Button
              title="Add to cart"
              icon="bag-add-outline"
              onPress={() => {
                add(detail);
                setDetail(undefined);
                setShowCart(true);
              }}
            />
          </>
        )}
      </Sheet>
    </Page>
  );
}
const styles = StyleSheet.create({
  segment: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },
  cart: { flexDirection: "row", gap: 3, alignItems: "center", minHeight: 44 },
  search: {
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: C.card,
    borderRadius: 13,
  },
  banner: {
    height: 135,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: "hidden",
  },
  bannerShade: {
    flex: 1,
    backgroundColor: "rgba(5,27,15,0.72)",
    padding: 16,
    gap: 6,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  product: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: "hidden",
    maxWidth: "49%",
  },
  productImage: { width: "100%", height: 135, backgroundColor: C.raised },
  productBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#24553E",
    color: C.mint,
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  add: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#244D37",
    alignItems: "center",
    justifyContent: "center",
  },
});
