import {
  avatar,
  imageSource,
  useAgro,
  type FarmVideo,
} from "@/contexts/agro-context";
import { useEvent } from "expo";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Image,
  Pressable,
  Share,
  StyleSheet,
  View,
  type ViewToken,
} from "react-native";
import { Button, C, Field, Icon, IconButton, s, Sheet, Text } from "./ui";

function ClipPlayer({
  source,
  active,
  muted,
  onDuration,
}: {
  source: string | number;
  active: boolean;
  muted: boolean;
  onDuration?: (duration: number) => void;
}) {
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  useEffect(() => {
    player.muted = muted;
  }, [player, muted]);
  useEffect(() => {
    if (active) player.play();
    else player.pause();
    return () => {
      player.pause();
    };
  }, [player, active]);
  useEffect(() => {
    if (status === "readyToPlay" && onDuration) onDuration(player.duration);
  }, [onDuration, player, status]);
  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause video" : "Play video"}
        onPress={() => (isPlaying ? player.pause() : player.play())}
        style={styles.playSurface}
      >
        {!isPlaying && status !== "loading" && status !== "error" && (
          <View style={styles.playBadge}>
            <Icon name="play" size={34} color="#FFFFFF" />
          </View>
        )}
      </Pressable>
      {status === "loading" && (
        <View pointerEvents="none" style={styles.center}>
          <ActivityIndicator size="large" color={C.mint} />
        </View>
      )}
      {status === "error" && (
        <View
          style={[
            styles.center,
            { backgroundColor: "rgba(0,0,0,0.8)", padding: 25 },
          ]}
        >
          <Icon name="videocam-off-outline" size={35} />
          <Text style={[s.text, { textAlign: "center" }]}>
            This video could not play. Try another video or check the file
            format.
          </Text>
        </View>
      )}
    </View>
  );
}

export function ShortVideoFeed({ onBack }: { onBack: () => void }) {
  const { videos, setVideos, profile } = useAgro();
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(
    AppState.currentState === "active",
  );
  const [activeId, setActiveId] = useState(videos[0]?.id);
  const [height, setHeight] = useState(540);
  const [muted, setMuted] = useState(true);
  const [picking, setPicking] = useState(false);
  const [draft, setDraft] = useState<string>();
  const [duration, setDuration] = useState<number>();
  const [caption, setCaption] = useState("");
  const [commentVideo, setCommentVideo] = useState<string>();
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");
  const selected = videos.find((v) => v.id === commentVideo);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) =>
      setAppActive(state === "active"),
    );
    return () => subscription.remove();
  }, []);
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<FarmVideo>[] }) => {
      if (viewableItems[0]) setActiveId(viewableItems[0].item.id);
    },
    [],
  );
  const pickVideo = async () => {
    setPicking(true);
    setNotice("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset.duration && asset.duration > 120000) {
          setNotice("Choose a short video of 2 minutes or less.");
          return;
        }
        setDuration(undefined);
        setCaption("");
        setDraft(asset.uri);
      }
    } catch {
      setNotice(
        "Could not open your videos. Check photo library permissions and try again.",
      );
    } finally {
      setPicking(false);
    }
  };
  const publish = () => {
    if (!draft || !duration || duration > 120 || !caption.trim()) return;
    const id = `video-${Date.now()}`;
    setVideos((old) => [
      {
        id,
        source: draft,
        author: profile.name,
        handle: profile.handle,
        avatar: 12,
        caption: caption.trim(),
        likes: 0,
        comments: [],
      },
      ...old,
    ]);
    setActiveId(id);
    setDraft(undefined);
    setCaption("");
    setNotice("Video added to this preview session.");
  };
  const like = (id: string) =>
    setVideos((old) =>
      old.map((v) =>
        v.id === id
          ? { ...v, liked: !v.liked, likes: v.likes + (v.liked ? -1 : 1) }
          : v,
      ),
    );
  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={s.row}>
          <IconButton
            name="arrow-back"
            label="Back to posts"
            onPress={onBack}
          />
          <View>
            <Text style={s.sectionTitle}>Farm Shorts</Text>
            <Text style={[s.small, { fontSize: 10 }]}>
              Swipe up to discover
            </Text>
          </View>
        </View>
        <Button
          title={picking ? "Opening…" : "Add video"}
          icon="add"
          onPress={() => void pickVideo()}
          disabled={picking}
        />
      </View>
      {!!notice && (
        <View style={[s.between, styles.notice]}>
          <Text accessibilityLiveRegion="polite" style={[s.small, { flex: 1 }]}>
            {notice}
          </Text>
          <IconButton
            name="close"
            label="Dismiss message"
            onPress={() => setNotice("")}
          />
        </View>
      )}
      <View
        style={{ flex: 1 }}
        onLayout={(event) => {
          if (event.nativeEvent.layout.height > 0)
            setHeight(event.nativeEvent.layout.height);
        }}
      >
        <FlatList
          key={videos[0]?.id ?? "empty"}
          data={videos}
          keyExtractor={(item) => item.id}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
          extraData={{
            activeId,
            focused,
            appActive,
            draft,
            muted,
            commentVideo,
          }}
          initialNumToRender={1}
          windowSize={3}
          renderItem={({ item, index }) => (
            <View style={[styles.clip, { height }]}>
              {item.id === activeId && (
                <ClipPlayer
                  key={item.id}
                  source={item.source}
                  muted={muted}
                  active={
                    focused && appActive && !draft && !selected && !picking
                  }
                />
              )}
              <View pointerEvents="box-none" style={styles.topOverlay}>
                <Text style={styles.topBadge}>
                  {item.sample ? "SAMPLE CLIP" : "YOUR VIDEO · SESSION PREVIEW"}
                </Text>
                <IconButton
                  name={muted ? "volume-mute" : "volume-high"}
                  label={muted ? "Unmute video" : "Mute video"}
                  onPress={() => setMuted(!muted)}
                />
              </View>
              <View pointerEvents="box-none" style={styles.bottomOverlay}>
                <View style={styles.caption}>
                  <View style={s.row}>
                    <Image
                      source={imageSource(avatar(item.avatar))}
                      style={styles.avatar}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          s.sectionTitle,
                          { color: "#FFFFFF", fontSize: 14 },
                        ]}
                      >
                        {item.author}
                      </Text>
                      <Text style={{ color: "#CEE6D8", fontSize: 11 }}>
                        {item.handle}
                      </Text>
                    </View>
                  </View>
                  <Text
                    numberOfLines={4}
                    style={{ color: "#FFFFFF", fontSize: 14, lineHeight: 21 }}
                  >
                    {item.caption}
                  </Text>
                  <View style={s.row}>
                    <Icon name="musical-notes" size={14} color="#FFFFFF" />
                    <Text style={{ color: "#CEE6D8", fontSize: 11 }}>
                      Original audio · {item.author}
                    </Text>
                  </View>
                  <Text style={{ color: "#CEE6D8", fontSize: 10 }}>
                    {index + 1} / {videos.length} ·{" "}
                    {videos.length > 1
                      ? "Swipe for the next farm story"
                      : "Add your video to keep the feed growing"}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      item.liked ? "Unlike video" : "Like video"
                    }
                    accessibilityState={{ selected: !!item.liked }}
                    onPress={() => like(item.id)}
                    style={styles.action}
                  >
                    <Icon
                      name={item.liked ? "heart" : "heart-outline"}
                      color={item.liked ? "#FF797E" : "#FFFFFF"}
                      size={31}
                    />
                    <Text style={styles.count}>{item.likes}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Video comments"
                    onPress={() => {
                      setComment("");
                      setCommentVideo(item.id);
                    }}
                    style={styles.action}
                  >
                    <Icon
                      name="chatbubble-ellipses-outline"
                      color="#FFFFFF"
                      size={29}
                    />
                    <Text style={styles.count}>{item.comments.length}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Share video caption"
                    onPress={() => {
                      void Share.share({
                        message: `${item.author} on AGRO AI: ${item.caption}`,
                      }).catch(() =>
                        setNotice("Sharing is unavailable on this device."),
                      );
                    }}
                    style={styles.action}
                  >
                    <Icon
                      name="share-social-outline"
                      color="#FFFFFF"
                      size={27}
                    />
                    <Text style={styles.count}>Share</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <Sheet
        visible={!!draft}
        title="Share a farm short"
        onClose={() => setDraft(undefined)}
      >
        {!!draft && (
          <View style={styles.preview}>
            <ClipPlayer
              key={draft}
              source={draft}
              active={focused && appActive}
              muted={true}
              onDuration={setDuration}
            />
          </View>
        )}
        <Text style={s.small}>
          Up to 2 minutes. Videos are saved only for this preview session.
        </Text>
        {duration !== undefined && duration > 120 && (
          <Text style={{ color: C.orange }}>
            This clip is too long. Choose a video of 2 minutes or less.
          </Text>
        )}
        <Field
          label="Video caption"
          value={caption}
          onChangeText={setCaption}
          placeholder="Share a farming tip, your harvest or a day on the farm…"
          multiline
        />
        <Button
          title="Add to shorts"
          disabled={!caption.trim() || !duration || duration > 120}
          onPress={publish}
        />
      </Sheet>
      <Sheet
        visible={!!selected}
        title="Video comments"
        onClose={() => setCommentVideo(undefined)}
      >
        {!selected?.comments.length && (
          <Text style={s.small}>Be the first to share an idea.</Text>
        )}
        {selected?.comments.map((text, i) => (
          <View key={i} style={s.card}>
            <Text style={s.text}>{text}</Text>
          </View>
        ))}
        <Field
          label="Your video comment"
          value={comment}
          onChangeText={setComment}
          placeholder="Ask a question or share an idea…"
        />
        <Button
          title="Post comment"
          disabled={!comment.trim()}
          onPress={() => {
            setVideos((old) =>
              old.map((v) =>
                v.id === commentVideo
                  ? { ...v, comments: [...v.comments, comment.trim()] }
                  : v,
              ),
            );
            setComment("");
          }}
        />
      </Sheet>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050E09",
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.bg,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  notice: { backgroundColor: C.card, paddingLeft: 15 },
  clip: { backgroundColor: "#050E09", overflow: "hidden" },
  playSurface: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playBadge: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 40,
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  topOverlay: {
    position: "absolute",
    top: 8,
    left: 15,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBadge: {
    color: "#FFFFFF",
    backgroundColor: "rgba(0,0,0,0.4)",
    fontSize: 9,
    letterSpacing: 1,
    borderRadius: 8,
    padding: 7,
    overflow: "hidden",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 17,
    paddingTop: 22,
    backgroundColor: "rgba(2,14,8,0.65)",
  },
  caption: { flex: 1, gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  actions: { gap: 17, width: 48, alignItems: "center" },
  action: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    minWidth: 44,
    minHeight: 48,
  },
  count: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  preview: {
    height: 250,
    backgroundColor: "#000000",
    borderRadius: 15,
    overflow: "hidden",
  },
});
