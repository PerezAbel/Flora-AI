import {
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
  Text,
  s,
} from "@/components/agro/ui";
import { imageSource, photos, useAgro, type Product } from "@/contexts/agro-context";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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
import { useTheme } from "@/contexts/theme-context";

const categories = [
  "All",
  "Seeds",
  "Fertilizers",
  "Pesticides",
  "Equipment",
  "Produce",
];
export default function ShopTab() {
  const { colors } = useTheme();
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

  // NEW: image + stock + sold tracking
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [stock, setStock] = useState("");
  const [sold, setSold] = useState<Record<string, number>>({});

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

  // NEW: pick an image from the gallery
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setNotice("Photo library permission is required to add an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
      setNotice("");
    }
  };

  const clearImage = () => setImageUri(undefined);

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
        imageUri, // NEW
        stock: Number(stock) || 0, // NEW
        seller: profile.name,
        badge: "Your listing",
      },
      ...old,
    ]);
    setName("");
    setPrice("");
    setStock("");
    setImageUri(undefined);
    setNotice("Listing saved in this preview.");
  };

  // NEW: derive "my shop" data
  const myListings = products.filter(
    (p) => p.id.startsWith("local-") || p.seller === profile.name,
  );
  const itemsSold = Object.values(sold).reduce((a, b) => a + b, 0);
  const revenue = myListings.reduce(
    (sum, p) => sum + (sold[p.id] ?? 0) * p.price,
    0,
  );

  return (
    <Page>
      <View style={s.row}>
        <View style={[styles.segment, { backgroundColor: colors.card }] }>
          {["Buy", "Sell", "My Shop"].map((m) => (
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
                { backgroundColor: mode === m ? colors.mint : colors.card },
              ]}
            >
              <Icon
                name={
                  m === "Buy"
                    ? "cart-outline"
                    : m === "Sell"
                      ? "pricetag-outline"
                      : "storefront-outline"
                }
                size={15}
                color={mode === m ? colors.bg : colors.muted}
              />
              <Text
                style={{
                  color: mode === m ? colors.bg : colors.muted,
                  fontSize: 12,
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
          <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Icon name="search" size={18} color={colors.muted} />
            <TextInput
              accessibilityLabel="Search products"
              placeholder="Search products, seeds, equipment…"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              style={{
                flex: 1,
                color: colors.text,
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
            style={[styles.banner, { backgroundColor: colors.card }]}
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
              <View key={p.id} style={[styles.product, { backgroundColor: colors.card }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`View ${p.name}`}
                  onPress={() => setDetail(p)}
                >
                  <Image
                    source={
                      p.imageUri ? { uri: p.imageUri } : imageSource(p.photo)
                    }
                    style={styles.productImage}
                  />
                  <Text style={[styles.productBadge, { backgroundColor: colors.raised, color: colors.mint }]}>{p.badge}</Text>
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
                    <Text style={{ color: colors.orange, fontSize: 10 }}>
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
                    style={{ color: colors.mint, fontSize: 17, fontWeight: "800" }}
                  >
                    ${p.price.toFixed(2)}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${p.name} to cart`}
                    onPress={() => add(p)}
                    style={[styles.add, { backgroundColor: colors.raised }]}
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
      ) : mode === "Sell" ? (
        <>
          <Card>
            <Label>YOUR FARM. YOUR MARKET.</Label>
            <Text style={s.title}>Start selling</Text>
            <Text style={s.small}>
              Create a sample listing for your produce, supplies or equipment.
            </Text>

            {/* NEW: Product image picker */}
            <Text style={[s.small, { marginTop: 8 }]}>Product photo</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pick product image"
              onPress={pickImage}
              style={[styles.imagePicker, { backgroundColor: colors.card, borderColor: colors.line }]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="camera-outline" size={26} color={colors.muted} />
                  <Text style={s.small}>Tap to choose from your gallery</Text>
                </View>
              )}
            </Pressable>
            {imageUri && (
              <View style={s.row}>
                <Button
                  title="Change photo"
                  secondary
                  icon="image-outline"
                  onPress={pickImage}
                />
                <Button
                  title="Remove"
                  secondary
                  icon="trash-outline"
                  onPress={clearImage}
                />
              </View>
            )}

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
            {/* NEW: Stock */}
            <Field
              label="Stock (units)"
              value={stock}
              onChangeText={setStock}
              numeric
              placeholder="e.g. 50"
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
          {myListings.map((p) => (
            <Card key={p.id}>
              <View style={s.between}>
                <View style={s.row}>
                  <Image
                    source={
                      p.imageUri ? { uri: p.imageUri } : imageSource(p.photo)
                    }
                    style={styles.thumb}
                  />
                  <View>
                    <Text style={s.text}>{p.name}</Text>
                    <Text style={s.small}>
                      Stock: {p.stock ?? 0} · Sold: {sold[p.id] ?? 0}
                    </Text>
                  </View>
                </View>
                <Text style={s.badge}>${p.price.toFixed(2)}</Text>
              </View>
            </Card>
          ))}
          <Text style={s.small}>
            Preview listings are saved for this session and are not published to
            other users.
          </Text>
        </>
      ) : (
        <>
          {/* NEW: My Shop dashboard */}
          <Card>
            <Label>FARMER DASHBOARD</Label>
            <Text style={s.title}>{profile.name}&apos;s Shop</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.mint }]}>{myListings.length}</Text>
                <Text style={s.small}>Listings</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.mint }]}>{itemsSold}</Text>
                <Text style={s.small}>Items sold</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: colors.mint }]}>${revenue.toFixed(2)}</Text>
                <Text style={s.small}>Revenue</Text>
              </View>
            </View>
          </Card>

          <Text style={s.sectionTitle}>All my items</Text>
          {myListings.length === 0 && (
            <Card>
              <Text style={s.small}>You haven&apos;t listed anything yet.</Text>
              <Button
                title="Create a listing"
                icon="add"
                onPress={() => setMode("Sell")}
              />
            </Card>
          )}
          {myListings.map((p) => {
            const soldCount = sold[p.id] ?? 0;
            const stockLeft = p.stock ?? 0;
            return (
              <Card key={p.id}>
                <View style={s.between}>
                  <View style={[s.row, { flex: 1 }]}>
                    <Image
                      source={
                        p.imageUri ? { uri: p.imageUri } : imageSource(p.photo)
                      }
                      style={styles.thumb}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={s.text}>{p.name}</Text>
                      <Text style={s.small}>
                        {p.category} · ${p.price.toFixed(2)}
                      </Text>
                      <View style={[s.row, { marginTop: 4, gap: 8 }]}>
                        <Pill text={`Stock ${stockLeft}`} />
                        <Pill text={`Sold ${soldCount}`} active />
                      </View>
                    </View>
                  </View>
                </View>
                <Button
                  title="Record a sale"
                  secondary
                  icon="checkmark-circle-outline"
                  onPress={() => {
                    if (stockLeft <= 0) return;
                    setProducts((old) =>
                      old.map((x) =>
                        x.id === p.id ? { ...x, stock: (x.stock ?? 0) - 1 } : x,
                      ),
                    );
                    setSold((old) => ({ ...old, [p.id]: (old[p.id] ?? 0) + 1 }));
                  }}
                />
              </Card>
            );
          })}
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
            <Button
              title="Proceed to checkout"
              icon="arrow-forward"
              onPress={() => {
                setShowCart(false);
                router.push("/checkout");
              }}
            />
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
              source={
                detail.imageUri
                  ? { uri: detail.imageUri }
                  : imageSource(detail.photo)
              }
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
  // NEW styles
  imagePicker: {
    height: 170,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: "#2A4636",
    marginVertical: 8,
  },
  imagePreview: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: C.raised,
    marginRight: 10,
  },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  stat: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1E3A2C",
    borderRadius: 12,
  },
  statValue: { color: C.mint, fontSize: 20, fontWeight: "800" },
});
