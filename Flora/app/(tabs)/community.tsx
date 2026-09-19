import { ShortVideoFeed } from "@/components/agro/short-video-feed";
import {
  Button,
  C,
  Field,
  Icon,
  IconButton,
  Page,
  Sheet,
  Text,
  s
} from "@/components/agro/ui";
import { avatar, imageSource, photos, useAgro, type Post } from "@/contexts/agro-context";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";

export default function CommunityTab() {
  const { posts, setPosts, profile } = useAgro();
  const [feedView, setFeedView] = useState<"posts" | "shorts">("posts");
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState("");
  const [photo, setPhoto] = useState<string>();
  const [activePost, setActivePost] = useState<string>();
  const [comment, setComment] = useState("");
  const [story, setStory] = useState<string>();
  const [error, setError] = useState("");
  const selected = posts.find((p) => p.id === activePost);
  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } catch {
      setError("Could not open your photos. Please check photo permissions.");
    }
  };
  const publish = () => {
    if (!draft.trim()) return;
    setPosts((old) => [
      {
        id: String(Date.now()),
        name: profile.name,
        handle: `${profile.handle} · Just now`,
        avatar: 12,
        text: draft.trim(),
        image: photo,
        tag: "Your farm",
        likes: 0,
        comments: [],
      },
      ...old,
    ]);
    setDraft("");
    setPhoto(undefined);
    setComposer(false);
  };
  const like = (post: Post) =>
    setPosts((old) =>
      old.map((p) =>
        p.id === post.id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    );
  if (feedView === "shorts")
    return <ShortVideoFeed onBack={() => setFeedView("posts")} />;
  return (
    <Page>
      {/* <View style={s.row}>
        <Pill text="Posts" active />
        <Pill text="Short videos" onPress={() => setFeedView("shorts")} />
      </View> */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14 }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setComposer(true);
            setError("");
          }}
          style={styles.story}
        >
          <View style={[styles.storyImage, styles.add]}>
            <Icon name="add" />
          </View>
          <Text style={styles.storyLabel}>Add Story</Text>
        </Pressable>
        {["Kofi A.", "Aisha B.", "Bola F.", "Musa K."].map((name, i) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${name}'s story`}
            key={name}
            onPress={() => setStory(name)}
            style={styles.story}
          >
            <Image
              source={imageSource(avatar([11, 47, 13, 12][i]))}
              style={styles.storyImage}
            />
            <Text style={styles.storyLabel}>{name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {/* <Pressable
        accessibilityRole="button"
        onPress={() => setComposer(true)}
        style={styles.compose}
      >
        <Icon name="create-outline" size={19} />
        <Text style={s.small}>Share something from your farm…</Text>
        <Icon name="add-circle" size={22} />
      </Pressable> */}
      {/* <Text style={[s.label, { fontSize: 9 }]}>
        COMMUNITY PREVIEW · POSTS SAVED FOR THIS SESSION
      </Text> */}
      {posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <View style={[s.between, { padding: 14 }]}>
            <View style={[s.row, { flex: 1 }]}>
              <Image
                source={imageSource(avatar(post.avatar))}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{post.name}</Text>
                <Text style={[s.small, { fontSize: 10 }]}>{post.handle}</Text>
              </View>
            </View>
            <Text style={s.badge}>{post.tag}</Text>
          </View>
          {post.image && (
            <Image source={imageSource(post.image)} style={styles.postImage} />
          )}
          <Text style={[s.text, { paddingHorizontal: 14, paddingTop: 12 }]}>
            {post.text}
          </Text>
          <View
            style={[s.between, { paddingHorizontal: 12, paddingBottom: 8 }]}
          >
            <View style={s.row}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={post.liked ? "Unlike post" : "Like post"}
                accessibilityState={{ selected: !!post.liked }}
                onPress={() => like(post)}
                style={styles.action}
              >
                <Icon name={post.liked ? "heart" : "heart-outline"} size={21} />
                <Text style={s.small}>{post.likes}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View comments"
                onPress={() => setActivePost(post.id)}
                style={styles.action}
              >
                <Icon name="chatbubble-outline" size={19} />
                <Text style={s.small}>{post.comments.length}</Text>
              </Pressable>
            </View>
            <IconButton
              name="share-social-outline"
              label="Share post"
              onPress={() => {
                void Share.share({
                  message: `${post.name} on AGRO AI: ${post.text}`,
                }).catch(() =>
                  setError("Sharing is unavailable on this device."),
                );
              }}
            />
          </View>
        </View>
      ))}
      {!!error && <Text style={s.small}>{error}</Text>}
      <Sheet
        visible={composer}
        title="Follow"
        onClose={() => setComposer(false)}
      >
        <Text style={s.small}>Preview post · visible in this session</Text>
        <Field
          label="Your farm update"
          value={draft}
          onChangeText={setDraft}
          placeholder="What’s growing on your farm?"
          multiline
        />
        {photo && (
          <Image source={imageSource(photo)} style={styles.postImage} />
        )}
        <Button
          title="Add a photo"
          icon="image-outline"
          secondary
          onPress={() => void pickPhoto()}
        />
        {!!error && <Text style={s.small}>{error}</Text>}
        <Button
          title="Post update"
          disabled={!draft.trim()}
          onPress={publish}
        />
      </Sheet>
      <Sheet
        visible={!!selected}
        title="Comments"
        onClose={() => setActivePost(undefined)}
      >
        {selected?.comments.map((text, i) => (
          <View key={i} style={s.card}>
            <Text style={s.text}>{text}</Text>
          </View>
        ))}
        {!selected?.comments.length && (
          <Text style={s.small}>Start the conversation.</Text>
        )}
        <Field
          label="Your comment"
          value={comment}
          onChangeText={setComment}
          placeholder="Share an idea…"
        />
        <Button
          title="Add comment"
          disabled={!comment.trim()}
          onPress={() => {
            setPosts((old) =>
              old.map((p) =>
                p.id === activePost
                  ? { ...p, comments: [...p.comments, comment.trim()] }
                  : p,
              ),
            );
            setComment("");
          }}
        />
      </Sheet>
      <Sheet
        visible={!!story}
        title={`${story ?? ""} · Follow`}
        onClose={() => setStory(undefined)}
      >
        <Image
          source={imageSource(photos.farm)}
          style={[styles.postImage, { height: 340, borderRadius: 16 }]}
        />
        <Text style={s.text}>A fresh morning on the farm 🌱</Text>
        <Text style={s.small}>Sample story</Text>
      </Sheet>
    </Page>
  );
}
const styles = StyleSheet.create({
  story: { alignItems: "center", gap: 6 },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: C.mint,
    backgroundColor: C.raised,
  },
  storyLabel: { color: C.muted, fontSize: 10 },
  add: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#37664C",
  },
  compose: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 13,
    backgroundColor: C.card,
    borderRadius: 14,
  },
  post: {
    backgroundColor: C.card,
    // borderRadius: 17,
    overflow: "hidden",  
    width:"100%",
    gap: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.raised,
  },
  name: { color: C.text, fontSize: 13, fontWeight: "700" },
  postImage: { width: "100%", height: 230, backgroundColor: C.raised },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 2,
  },
});
