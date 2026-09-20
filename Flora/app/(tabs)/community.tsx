
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import * as ImagePicker from "expo-image-picker";

import {
  useVideoPlayer,
  VideoView,
} from "expo-video";

import {
  ShortVideoFeed,
} from "@/components/agro/short-video-feed";

import {
  Button,
  C,
  Field,
  Icon,
  IconButton,
  s,
  Sheet,
  Text,
} from "@/components/agro/ui";

import {
  avatar,
  imageSource,
  photos,
  useAgro,
  type Post,
} from "@/contexts/agro-context";
import { useTheme } from "@/contexts/theme-context";

/* =====================================================
   TYPES
===================================================== */

type CommunityScreen =
  | "feed"
  | "editor"
  | "discover"
  | "farmer"
  | "shorts";

type Farmer = {
  name: string;
  handle: string;
  avatarId: Post["avatar"];
  posts: Post[];
};

/* =====================================================
   THEME
===================================================== */

const COLORS = {
  background: "#101715",
  surface: "#202923",
  elevated: "#2C3830",
  border: "#35463B",
  text: "#FFFFFF",
  muted: "#A4B5AA",
  mint: "#79C89C",
  blue: "#39795A",
  red: "#FF5268",
};

/* =====================================================
   VIDEO PLAYER

   Supports video playback in:
   - Community posts
   - Post editor
   - Farmer profiles

   This is separate from the TikTok-style short
   video feed component.
===================================================== */

function PostVideo({
  uri,
  height = 320,
}: {
  uri: string;
  height?: number;
}) {
  const player = useVideoPlayer(
    uri,
    (instance) => {
      instance.loop = false;
      instance.muted = false;
    }
  );

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  return (
    <View
      style={[
        styles.videoContainer,
        { height },
      ]}
    >
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        nativeControls
      />
    </View>
  );
}

function StoryViewer({ name, mediaUri, onClose }: { name: string; mediaUri?: string; onClose: () => void }) {
  const { colors, mode } = useTheme();
  const [reply, setReply] = useState("");
  return (
    <Modal visible animationType="fade" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[styles.storyViewer, { backgroundColor: colors.bg }] }>
        {mediaUri && /\.(mp4|mov|m4v)(\?|$)/i.test(mediaUri) ? <PostVideo uri={mediaUri} height={Dimensions.get('window').height} /> : <Image source={imageSource(mediaUri ?? photos.farm)} style={StyleSheet.absoluteFill} resizeMode="cover" />}
        <View style={styles.storyShade} />
        <View style={styles.storyProgress}><View style={styles.storyProgressFill} /></View>
        <View style={styles.storyViewerHeader}>
          <View style={styles.storyViewerUser}><Image source={imageSource(avatar(name === "Kofi A." ? 11 : name === "Aisha B." ? 47 : 12))} style={styles.storyViewerAvatar} /><View><Text style={styles.storyViewerName}>{name}</Text><Text style={styles.storyViewerTime}>2h ago · Farm story</Text></View></View>
          <IconButton name="close" label="Close story" onPress={onClose} />
        </View>
        <View style={[styles.storyViewerBottom, { backgroundColor: mode === "dark" ? "rgba(2,11,6,0.55)" : "rgba(255,255,255,0.72)" }]}><Text style={[styles.storyViewerCaption, { color: colors.text }]}>A fresh morning on the farm. Sharing the work, the lessons and the harvest with our community.</Text><View style={[styles.storyReply, { borderColor: colors.line, backgroundColor: colors.card }]}><TextInput accessibilityLabel="Reply to story" value={reply} onChangeText={setReply} placeholder="Reply to story…" placeholderTextColor={colors.muted} style={[styles.storyReplyInput, { color: colors.text }]} /><Pressable accessibilityRole="button" accessibilityLabel="Send story reply" onPress={() => setReply("")} style={[styles.storySend, { backgroundColor: colors.mint }]}><Icon name="send" size={18} color={colors.bg} /></Pressable></View></View>
      </View>
    </Modal>
  );
}

function StoryComposer({ visible, onClose, onPreview }: { visible: boolean; onClose: () => void; onPreview: (uri: string) => void }) {
  const { colors } = useTheme();
  const [notice, setNotice] = useState("");
  const [recentMedia, setRecentMedia] = useState<string[]>([]);
  const chooseMedia = async (camera = false) => {
    try {
      const result = camera ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.9 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.9 });
      if (!result.canceled && result.assets[0]?.uri) {
        const selected = result.assets.map(asset => asset.uri).filter(Boolean) as string[];
        setRecentMedia(old => Array.from(new Set([...selected, ...old])));
        onPreview(selected[0]);
      }
    } catch { setNotice("We could not open your media. Check your photo permissions and try again."); }
  };
  return <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}><View style={[styles.storyComposer, { backgroundColor: colors.bg }]}><View style={styles.storyComposerHeader}><IconButton name="close" label="Close story picker" onPress={onClose} /><Text style={[styles.storyComposerTitle, { color: colors.text }]}>Create story</Text><View style={{ width: 44 }} /></View><Text style={[styles.storyComposerDate, { color: colors.text }]}>Your story</Text><Text style={[styles.storyComposerSource, { color: colors.muted }]}>Choose media from this device</Text><View style={styles.storyTools}>{[{ icon: "copy-outline" as const, title: "Templates", subtitle: "Add yours" }, { icon: "musical-notes-outline" as const, title: "Music", subtitle: "Add sound" }, { icon: "grid-outline" as const, title: "Collage", subtitle: "Combine photos" }].map(tool => <Pressable accessibilityRole="button" accessibilityLabel={`${tool.title} story`} onPress={() => void chooseMedia()} key={tool.title} style={[styles.storyTool, { backgroundColor: colors.card }]}><Icon name={tool.icon} size={30} /><Text style={[styles.storyToolTitle, { color: colors.text }]}>{tool.title}</Text><Text style={[styles.storyToolSub, { color: colors.muted }]}>{tool.subtitle}</Text></Pressable>)}</View><Text style={[styles.storyRecent, { color: colors.text }]}>Recents <Icon name="chevron-down" size={18} /></Text>{recentMedia.length ? <View style={styles.storyRecentGrid}>{recentMedia.map((uri, i) => <Pressable accessibilityRole="button" accessibilityLabel={`Use recent photo ${i + 1}`} key={`${uri}-${i}`} onPress={() => onPreview(uri)} style={[styles.storyRecentItem, { backgroundColor: colors.card }]}><Image source={{ uri }} style={styles.storyRecentImage} /></Pressable>)}</View> : <View style={[styles.storyEmptyRecent, { borderColor: colors.line, backgroundColor: colors.card }]}><Icon name="images-outline" size={34} color={colors.muted} /><Text style={[styles.storyEmptyRecentTitle, { color: colors.text }]}>No recent photos or videos</Text><Text style={[styles.storyToolSub, { color: colors.muted }]}>Select media from your device to see it here.</Text></View>}{!!notice && <Text style={s.small}>{notice}</Text>}<Pressable accessibilityRole="button" accessibilityLabel="Choose from gallery" onPress={() => void chooseMedia()} style={[styles.storyGalleryButton, { backgroundColor: colors.raised }]}><Icon name="images-outline" size={21} /><Text style={s.text}>Choose from device</Text></Pressable></View></Modal>;
}

/* =====================================================
   COMMUNITY TAB
===================================================== */

export default function CommunityTab() {
  const { colors } = useTheme();
  const {
    posts,
    setPosts,
    profile,
  } = useAgro();

  /* =====================================================
     GLOBAL HEADER PARAMETERS
  ===================================================== */

  const params = useLocalSearchParams<{
    action?: string;
    q?: string;
    requestId?: string;
  }>();

  /* =====================================================
     SCREEN STATE
  ===================================================== */

  const [screen, setScreen] =
    useState<CommunityScreen>("feed");

  const [shortsReturn, setShortsReturn] =
    useState<"feed" | "editor">("feed");

  /* =====================================================
     CREATE POST STATE
  ===================================================== */

  const [draft, setDraft] = useState("");

  const [photo, setPhoto] =
    useState<string>();

  const [video, setVideo] =
    useState<string>();

  const [pickingMedia, setPickingMedia] =
    useState(false);

  const [publishing, setPublishing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     COMMENT STATE
  ===================================================== */

  const [activePost, setActivePost] =
    useState<string>();

  const [comment, setComment] =
    useState("");

  /* =====================================================
     FARMER STATE
  ===================================================== */

  const [farmerSearch, setFarmerSearch] =
    useState("");

  const [selectedFarmer, setSelectedFarmer] =
    useState<string>();

  const [following, setFollowing] =
    useState<string[]>([]);

  /* =====================================================
     STORY STATE
  ===================================================== */

  const [story, setStory] =
    useState<string>();
  const [storyMedia, setStoryMedia] = useState<string>();
  const [storyComposer, setStoryComposer] = useState(false);

  const selectedPost = posts.find(
    (post) => post.id === activePost
  );

  /* =====================================================
     DISCOVER FARMERS

     Farmers are derived from the current community
     posts rather than invented account records.
  ===================================================== */

  const farmers = useMemo(() => {
    const farmerMap =
      new Map<string, Farmer>();

    posts.forEach((post) => {
      const handle =
        post.handle.split(" · ")[0];

      if (
        handle === profile.handle ||
        post.name === profile.name
      ) {
        return;
      }

      const key = handle || post.name;

      const existing = farmerMap.get(key);

      if (existing) {
        existing.posts.push(post);
      } else {
        farmerMap.set(key, {
          name: post.name,
          handle: key,
          avatarId: post.avatar,
          posts: [post],
        });
      }
    });

    return Array.from(
      farmerMap.values()
    );
  }, [
    posts,
    profile.handle,
    profile.name,
  ]);

  /* =====================================================
     SEARCH FARMERS
  ===================================================== */

  const visibleFarmers = useMemo(() => {
    const query =
      farmerSearch.trim().toLowerCase();

    if (!query) {
      return farmers;
    }

    return farmers.filter(
      (farmer) =>
        farmer.name
          .toLowerCase()
          .includes(query) ||

        farmer.handle
          .toLowerCase()
          .includes(query)
    );
  }, [
    farmers,
    farmerSearch,
  ]);

  const currentFarmer = farmers.find(
    (farmer) =>
      farmer.handle === selectedFarmer
  );

  /* =====================================================
     OPEN CREATE POST
  ===================================================== */

  const openCreatePost = () => {
    setError("");
    setDraft("");

    setPhoto(undefined);
    setVideo(undefined);

    setScreen("editor");
  };

  const openStoryComposer = () => {
    setStory(undefined);
    setStoryMedia(undefined);
    setStoryComposer(true);
  };

  /* =====================================================
     OPEN SHORT VIDEOS
  ===================================================== */

  const openShortVideos = (
    returnTo: "feed" | "editor" = "feed"
  ) => {
    setShortsReturn(returnTo);

    setScreen("shorts");
  };

  /* =====================================================
     HANDLE ACTIONS FROM GLOBAL HEADER
  ===================================================== */

  // This effect responds to navigation actions emitted by the global header.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (params.action === "create") {
      openCreatePost();
      return;
    }

    if (params.action === "shorts") {
      openShortVideos("feed");
      return;
    }

    if (params.action === "search") {
      setFarmerSearch(params.q ?? "");

      setScreen("discover");
    }
  }, [
    params.action,
    params.q,
    params.requestId,
  ]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* =====================================================
     SELECT PHOTO FROM DEVICE
  ===================================================== */

  const pickPhoto = async () => {
    if (pickingMedia) return;

    try {
      setPickingMedia(true);
      setError("");

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.9,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        setPhoto(
          result.assets[0].uri
        );
      }
    } catch (err) {
      console.error(
        "Photo picker error:",
        err
      );

      setError(
        "Unable to select a photo. Please check your device permissions."
      );
    } finally {
      setPickingMedia(false);
    }
  };

  /* =====================================================
     SELECT VIDEO FROM DEVICE
  ===================================================== */

  const pickVideo = async () => {
    if (pickingMedia) return;

    try {
      setPickingMedia(true);
      setError("");

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["videos"],
          allowsEditing: false,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        setVideo(
          result.assets[0].uri
        );
      }
    } catch (err) {
      console.error(
        "Video picker error:",
        err
      );

      setError(
        "Unable to select a video. Please try again."
      );
    } finally {
      setPickingMedia(false);
    }
  };

  /* =====================================================
     TAKE PHOTO WITH CAMERA
  ===================================================== */

  const takePhoto = async () => {
    if (pickingMedia) return;

    try {
      setPickingMedia(true);
      setError("");

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setError(
          "Camera permission is required to take a photo."
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.9,
        });

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        setPhoto(
          result.assets[0].uri
        );
      }
    } catch (err) {
      console.error(
        "Camera error:",
        err
      );

      setError(
        "Unable to open the camera."
      );
    } finally {
      setPickingMedia(false);
    }
  };



  /* =====================================================
     REMOVE SELECTED MEDIA
  ===================================================== */

  const removePhoto = () => {
    setPhoto(undefined);
  };

  const removeVideo = () => {
    setVideo(undefined);
  };

  /* =====================================================
     PUBLISH POST

     Supports:
     - Text only
     - Photo only
     - Video only
     - Photo + video
     - Caption + photo + video
  ===================================================== */

  const publish = () => {
    if (publishing) return;

    if (
      !draft.trim() &&
      !photo &&
      !video
    ) {
      setError(
        "Add a caption, photo or video before publishing."
      );

      return;
    }

    try {
      setPublishing(true);
      setError("");

      const newPost: Post = {
        id: String(Date.now()),

        name: profile.name,

        handle:
          `${profile.handle} · Just now`,

        avatar: 12,

        text: draft.trim(),

        image: photo,

        videoUri: video,

        tag: "Your farm",

        likes: 0,

        comments: [],
      };

      setPosts((old) => [
        newPost,
        ...old,
      ]);

      setDraft("");

      setPhoto(undefined);

      setVideo(undefined);

      setScreen("feed");
    } catch (err) {
      console.error(
        "Publish error:",
        err
      );

      setError(
        "Unable to publish your post."
      );
    } finally {
      setPublishing(false);
    }
  };

  /* =====================================================
     LIKE POST
  ===================================================== */

  const like = (post: Post) => {
    setPosts((old) =>
      old.map((p) =>
        p.id === post.id
          ? {
              ...p,

              liked: !p.liked,

              likes:
                p.likes +
                (p.liked ? -1 : 1),
            }
          : p
      )
    );
  };

  /* =====================================================
     ADD COMMENT
  ===================================================== */

  const addComment = () => {
    if (!comment.trim()) {
      return;
    }

    setPosts((old) =>
      old.map((p) =>
        p.id === activePost
          ? {
              ...p,

              comments: [
                ...p.comments,
                comment.trim(),
              ],
            }
          : p
      )
    );

    setComment("");
  };

  /* =====================================================
     SHARE POST
  ===================================================== */

  const sharePost = async (
    post: Post
  ) => {
    try {
      await Share.share({
        message:
          `${post.name} on AGRO AI:\n\n${post.text}`,
      });
    } catch {
      setError(
        "Sharing is unavailable on this device."
      );
    }
  };

  /* =====================================================
     FARMER ACTIONS
  ===================================================== */

  const openFarmer = (
    farmer: Farmer
  ) => {
    setSelectedFarmer(
      farmer.handle
    );

    setScreen("farmer");
  };

  const toggleFollow = (
    handle: string
  ) => {
    setFollowing((old) =>
      old.includes(handle)
        ? old.filter(
            (item) => item !== handle
          )
        : [
            ...old,
            handle,
          ]
    );
  };

  /* =====================================================
     BACK NAVIGATION
  ===================================================== */

  const goBack = () => {
    setScreen("feed");

    setError("");
  };

  /* =====================================================
     REUSABLE ICON BUTTON
  ===================================================== */

  const actionIcon = (
    name: import('@/components/agro/ui').IconName,
    label: string,
    onPress: () => void
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.iconButton}
    >
      <Icon
        name={name}
        size={25}
        color={colors.text}
      />
    </Pressable>
  );

  /* =====================================================
     REUSABLE POST COMPONENT
  ===================================================== */

  const renderPost = (
    post: Post
  ) => (
    <View
      key={post.id}
      style={[styles.post, { backgroundColor: colors.card, borderColor: colors.line }]}
    >
      {/* POST HEADER */}

      <View style={styles.postHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            `View ${post.name}'s profile`
          }
          onPress={() => {
            const farmer =
              farmers.find(
                (item) =>
                  item.handle ===
                  post.handle.split(" · ")[0]
              );

            if (farmer) {
              openFarmer(farmer);
            } else {
              router.navigate("/profile");
            }
          }}
        >
          <Image
            source={imageSource(
              avatar(post.avatar)
            )}
            style={styles.avatar}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {post.name}
          </Text>

          <Text style={styles.postHandle}>
            {post.handle}
          </Text>
        </View>

        <Text style={s.badge}>
          {post.tag}
        </Text>
      </View>

      {/* POST PHOTO */}

      {post.image && (
        <Image
          source={imageSource(
            post.image
          )}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      {/* POST VIDEO */}

      {post.videoUri && (
        <PostVideo
          uri={post.videoUri}
          height={350}
        />
      )}

      {/* POST CAPTION */}

      {!!post.text && (
        <Text style={[styles.postCaption, { color: colors.text }]}>
          {post.text}
        </Text>
      )}

      {/* POST ACTIONS */}

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>

          {/* LIKE */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              post.liked
                ? "Unlike post"
                : "Like post"
            }
            accessibilityState={{
              selected: !!post.liked,
            }}
            onPress={() =>
              like(post)
            }
            style={styles.postAction}
          >
            <Icon
              name={
                post.liked
                  ? "heart"
                  : "heart-outline"
              }
              size={23}
              color={
                post.liked
                  ? COLORS.red
                  : C.text
              }
            />

            <Text style={s.small}>
              {post.likes}
            </Text>
          </Pressable>

          {/* COMMENTS */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View comments"
            onPress={() =>
              setActivePost(post.id)
            }
            style={styles.postAction}
          >
            <Icon
              name="chatbubble-outline"
              size={22}
              color={colors.text}
            />

            <Text style={s.small}>
              {post.comments.length}
            </Text>
          </Pressable>

        </View>

        {/* SHARE */}

        <IconButton
          name="share-social-outline"
          label="Share post"
          onPress={() =>
            void sharePost(post)
          }
        />

      </View>
    </View>
  );

  /* =====================================================
     SCREEN RENDERING
  ===================================================== */

  const renderScreen = () => {

    /* =================================================
       TIKTOK-STYLE SHORT VIDEO FEED
    ================================================= */

    if (screen === "shorts") {
      return (
        <ShortVideoFeed
          onBack={() =>
            setScreen(shortsReturn)
          }
        />
      );
    }

    /* =================================================
       CREATE POST EDITOR

       PHOTO + VIDEO UPLOAD
    ================================================= */

    if (screen === "editor") {
      return (
        <View style={[styles.editorScreen, { backgroundColor: colors.bg }]}>

          {/* EDITOR HEADER */}

          <View style={[styles.editorHeader, { backgroundColor: colors.bg, borderBottomColor: colors.line }]}>

            {actionIcon(
              "arrow-back",
              "Back to community",
              goBack
            )}

            <Text style={[styles.editorTitle, { color: colors.text }]}>
              New post
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share post"
              onPress={publish}
              disabled={
                publishing ||
                (
                  !draft.trim() &&
                  !photo &&
                  !video
                )
              }
              style={[styles.publishButton, { backgroundColor: colors.mint }]}
            >
              <Text
                style={[
                  styles.publishText,
                  { color: colors.bg },

                  (
                    !draft.trim() &&
                    !photo &&
                    !video
                  ) && {
                    opacity: 0.4,
                  },
                ]}
              >
                Share
              </Text>
            </Pressable>

          </View>

          {/* EDITOR CONTENT */}

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={
              styles.editorContent
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* AUTHOR */}

            <View style={styles.editorAuthor}>

              <Image
                source={imageSource(
                  avatar(12)
                )}
                style={styles.avatar}
              />

              <View>
                <Text style={styles.name}>
                  {profile.name}
                </Text>

                <Text style={styles.postHandle}>
                  {profile.handle}
                </Text>
              </View>

            </View>

            {/* MEDIA SELECTION HEADER */}

            <View style={styles.sectionHeader}>

              <Text style={styles.sectionTitle}>
                Add media
              </Text>

              <Text style={styles.sectionSubtitle}>
                Photos and videos
              </Text>

            </View>

            {/* MEDIA OPTIONS */}

            <View style={styles.mediaOptions}>

              {/* SELECT PHOTO */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Select photo"
                onPress={() =>
                  void pickPhoto()
                }
                disabled={pickingMedia}
                style={styles.mediaOption}
              >
                <Icon
                  name="images-outline"
                  size={28}
                  color={colors.text}
                />

                <Text style={styles.mediaOptionLabel}>
                  Photo
                </Text>
              </Pressable>

              {/* SELECT VIDEO */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Select video"
                onPress={() =>
                  void pickVideo()
                }
                disabled={pickingMedia}
                style={styles.mediaOption}
              >
                <Icon
                  name="videocam-outline"
                  size={29}
                  color={colors.text}
                />

                <Text style={styles.mediaOptionLabel}>
                  Video
                </Text>
              </Pressable>

              {/* TAKE PHOTO */}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Take photo"
                onPress={() =>
                  void takePhoto()
                }
                disabled={pickingMedia}
                style={styles.mediaOption}
              >
                <Icon
                  name="camera-outline"
                  size={28}
                  color={colors.text}
                />

                <Text style={styles.mediaOptionLabel}>
                  Camera
                </Text>
              </Pressable>

            </View>

            {/* MEDIA PICKER LOADING */}

            {pickingMedia && (
              <View style={styles.loadingRow}>
                <ActivityIndicator
                  color={C.mint}
                />

                <Text style={s.small}>
                  Opening media picker...
                </Text>
              </View>
            )}

            {/* ===========================================
                PHOTO PREVIEW
            =========================================== */}

            {photo && (

              <View style={styles.mediaPreview}>

                <View style={styles.previewHeader}>

                  <Text style={styles.previewTitle}>
                    Selected photo
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove photo"
                    onPress={removePhoto}
                  >
                    <Icon
                      name="close-circle"
                      size={24}
                      color={colors.text}
                    />
                  </Pressable>

                </View>

                <Image
                  source={imageSource(photo)}
                  style={styles.editorImage}
                  resizeMode="contain"
                />

              </View>

            )}

            {/* ===========================================
                VIDEO PREVIEW
            =========================================== */}

            {video && (

              <View style={styles.mediaPreview}>

                <View style={styles.previewHeader}>

                  <Text style={styles.previewTitle}>
                    Selected video
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove video"
                    onPress={removeVideo}
                  >
                    <Icon
                      name="close-circle"
                      size={24}
                      color={colors.text}
                    />
                  </Pressable>

                </View>

                <PostVideo
                  uri={video}
                  height={300}
                />

              </View>

            )}

            {/* NO MEDIA SELECTED */}

            {!photo && !video && (

              <View style={styles.emptyMedia}>

                <Icon
                  name="images-outline"
                  size={45}
                  color={C.muted}
                />

                <Text style={styles.emptyMediaTitle}>
                  Your media will appear here
                </Text>

                <Text style={styles.emptyMediaSubtitle}>
                  Add a photo, a video, or both
                  to your post.
                </Text>

              </View>

            )}

            {/* CAPTION */}

            <View style={styles.captionSection}>

              <Text style={styles.sectionTitle}>
                Caption
              </Text>

              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Share something about your farm..."
                placeholderTextColor={C.muted}
                multiline
                maxLength={2200}
                style={styles.captionInput}
                textAlignVertical="top"
              />

              <Text style={styles.characterCount}>
                {draft.length}/2200
              </Text>

            </View>

            {/* ERROR */}

            {!!error && (
              <Text style={styles.errorText}>
                {error}
              </Text>
            )}

            {/* PUBLISH */}

            <Button
              title={
                publishing
                  ? "Publishing..."
                  : "Share post"
              }
              disabled={
                publishing ||
                (
                  !draft.trim() &&
                  !photo &&
                  !video
                )
              }
              onPress={publish}
            />

            <Text style={styles.uploadNote}>
              Posts are currently stored in
              your community preview session.
            </Text>

          </ScrollView>

        </View>
      );
    }

    /* =================================================
       DISCOVER FARMERS
    ================================================= */

    if (screen === "discover") {
      return (
        <View style={styles.discoverScreen}>

          {/* HEADER */}

          <View style={styles.discoverHeader}>

            {actionIcon(
              "arrow-back",
              "Back to community",
              goBack
            )}

            <Text style={styles.discoverTitle}>
              Discover Farmers
            </Text>

            <View style={{ width: 40 }} />

          </View>

          {/* SEARCH */}

          <View style={styles.searchBox}>

            <Icon
              name="search-outline"
              size={21}
              color={C.muted}
            />

            <TextInput
              value={farmerSearch}
              onChangeText={setFarmerSearch}
              placeholder="Search farmers..."
              placeholderTextColor={C.muted}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!!farmerSearch && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() =>
                  setFarmerSearch("")
                }
              >
                <Icon
                  name="close-circle"
                  size={20}
                  color={C.muted}
                />
              </Pressable>
            )}

          </View>

          {/* FARMER LIST */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {visibleFarmers.map(
              (farmer) => {

                const isFollowing =
                  following.includes(
                    farmer.handle
                  );

                return (
                  <View
                    key={farmer.handle}
                    style={styles.farmerCard}
                  >

                    {/* FARMER AVATAR */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        `View ${farmer.name}'s profile`
                      }
                      onPress={() =>
                        openFarmer(farmer)
                      }
                    >
                      <Image
                        source={imageSource(
                          avatar(
                            farmer.avatarId
                          )
                        )}
                        style={styles.farmerAvatar}
                      />
                    </Pressable>

                    {/* FARMER DETAILS */}

                    <Pressable
                      style={{ flex: 1 }}
                      onPress={() =>
                        openFarmer(farmer)
                      }
                    >
                      <Text style={styles.farmerName}>
                        {farmer.name}
                      </Text>

                      <Text style={styles.farmerHandle}>
                        {farmer.handle}
                      </Text>

                      <Text style={styles.farmerStats}>
                        {farmer.posts.length} posts
                      </Text>
                    </Pressable>

                    {/* FOLLOW */}

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        isFollowing
                          ? `Unfollow ${farmer.name}`
                          : `Follow ${farmer.name}`
                      }
                      style={[
                        styles.followButton,

                        isFollowing &&
                          styles.followingButton,
                      ]}
                      onPress={() =>
                        toggleFollow(
                          farmer.handle
                        )
                      }
                    >
                      <Text style={styles.followText}>
                        {isFollowing
                          ? "Following"
                          : "Follow"}
                      </Text>
                    </Pressable>

                  </View>
                );
              }
            )}

            {visibleFarmers.length === 0 && (
              <View style={styles.emptyFarmers}>

                <Icon
                  name="people-outline"
                  size={48}
                  color={C.muted}
                />

                <Text style={styles.emptyTitle}>
                  No farmers found
                </Text>

                <Text style={styles.emptyDescription}>
                  Farmer profiles will appear
                  here when their community
                  posts are available.
                </Text>

              </View>
            )}

          </ScrollView>

        </View>
      );
    }

    /* =================================================
       FARMER PROFILE
    ================================================= */

    if (
      screen === "farmer" &&
      currentFarmer
    ) {

      const isFollowing =
        following.includes(
          currentFarmer.handle
        );

      return (
        <ScrollView
          style={styles.farmerProfile}
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER */}

          <View style={styles.profileHeader}>

            {actionIcon(
              "arrow-back",
              "Back to farmers",
              () =>
                setScreen("discover")
            )}

            <Text
              style={styles.profileUsername}
              numberOfLines={1}
            >
              {currentFarmer.handle}
            </Text>

            <View style={{ width: 40 }} />

          </View>

          {/* PROFILE STATISTICS */}

          <View style={styles.profileInfo}>

            <Image
              source={imageSource(
                avatar(
                  currentFarmer.avatarId
                )
              )}
              style={styles.profileAvatar}
            />

            <View style={styles.profileStatistics}>

              {/* POSTS */}

              <View style={styles.profileStat}>

                <Text style={styles.statNumber}>
                  {currentFarmer.posts.length}
                </Text>

                <Text style={styles.statLabel}>
                  posts
                </Text>

              </View>

              {/* FOLLOWERS */}

              <View style={styles.profileStat}>

                <Text style={styles.statNumber}>
                  —
                </Text>

                <Text style={styles.statLabel}>
                  followers
                </Text>

              </View>

              {/* FOLLOWING */}

              <View style={styles.profileStat}>

                <Text style={styles.statNumber}>
                  —
                </Text>

                <Text style={styles.statLabel}>
                  following
                </Text>

              </View>

            </View>

          </View>

          {/* PROFILE NAME */}

          <Text style={styles.profileName}>
            {currentFarmer.name}
          </Text>

          {/* PROFILE BIO */}

          <Text style={styles.profileBio}>
            Farmer | AGRO AI Community
          </Text>

          {/* FOLLOW BUTTON */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isFollowing
                ? "Unfollow farmer"
                : "Follow farmer"
            }
            style={[
              styles.profileFollowButton,

              isFollowing &&
                styles.followingButton,
            ]}
            onPress={() =>
              toggleFollow(
                currentFarmer.handle
              )
            }
          >
            <Text style={styles.followText}>
              {isFollowing
                ? "Following"
                : "Follow"}
            </Text>
          </Pressable>

          {/* PROFILE POSTS HEADER */}

          <View style={styles.profilePostsHeader}>

            <Icon
              name="grid-outline"
              size={23}
              color={colors.text}
            />

            <Text style={styles.profilePostsTitle}>
              Posts
            </Text>

          </View>

          {/* POST GRID */}

          <View style={styles.profileGrid}>

            {currentFarmer.posts.map(
              (post) => (

                <Pressable
                  key={post.id}
                  accessibilityRole="button"
                  accessibilityLabel="View farmer post"
                  style={styles.profileGridItem}
                  onPress={() =>
                    setActivePost(post.id)
                  }
                >

                  {post.image ? (

                    <Image
                      source={imageSource(
                        post.image
                      )}
                      style={styles.profileGridImage}
                      resizeMode="cover"
                    />

                  ) : post.videoUri ? (

                    <View style={styles.videoGridTile}>

                      <Icon
                        name="play-circle-outline"
                        size={35}
                        color="#FFFFFF"
                      />

                      <Text style={styles.gridVideoLabel}>
                        Video
                      </Text>

                    </View>

                  ) : (

                    <View style={styles.textPost}>

                      <Text
                        style={styles.textPostText}
                        numberOfLines={5}
                      >
                        {post.text}
                      </Text>

                    </View>

                  )}

                  {/* VIDEO INDICATOR */}

                  {post.videoUri && post.image && (

                    <View style={styles.videoIndicator}>

                      <Icon
                        name="play"
                        size={17}
                        color="#FFFFFF"
                      />

                    </View>

                  )}

                </Pressable>

              )
            )}

          </View>

          {/* FARMER'S FULL POSTS */}

          <View style={styles.farmerPostSection}>

            {currentFarmer.posts.map(
              renderPost
            )}

          </View>

        </ScrollView>
      );
    }

    /* =================================================
       MAIN COMMUNITY FEED
    ================================================= */

    return (
      <ScrollView
        style={[styles.feed, { backgroundColor: colors.bg }]}
        showsVerticalScrollIndicator={false}
      >

        {/* =============================================
            STORIES / STATUS
        ============================================= */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.storiesContainer
          }
          style={styles.storiesScroll}
        >

          {/* YOUR STORY */}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Your story"
            onPress={openStoryComposer}
            style={styles.story}
          >

            <View style={styles.myStoryCircle}>

              <Image
                source={imageSource(
                  avatar(12)
                )}
                style={styles.myStoryImage}
              />

              <View style={[styles.storyPlus, { borderColor: colors.bg, backgroundColor: colors.mint }]}>

                <Icon
                  name="add"
                  size={17}
                  color="#FFFFFF"
                />

              </View>

            </View>

            <Text style={[styles.storyLabel, { color: colors.text }]}>
              Your story
            </Text>

          </Pressable>

          {/* OTHER FARMERS' STORIES */}

          {[
            "Kofi A.",
            "Aisha B.",
            "Bola F.",
            "Musa K.",
          ].map((name, i) => (

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                `View ${name}'s story`
              }
              key={name}
              onPress={() => setStory(name)}
              style={styles.story}
            >

              <View style={styles.storyRing}>

                <Image
                  source={imageSource(
                    avatar(
                      [11, 47, 13, 12][i]
                    )
                  )}
                  style={[styles.storyImage, { borderColor: colors.bg, backgroundColor: colors.raised }]}
                />

              </View>

              <Text
                style={[styles.storyLabel, { color: colors.text }]}
                numberOfLines={1}
              >
                {name}
              </Text>

            </Pressable>

          ))}

        </ScrollView>

        {/* =============================================
            ACTION ICONS BELOW STORIES
        ============================================= */}

        <View style={[styles.postsHeader, { backgroundColor: colors.bg, borderColor: colors.line }]}>

          <Text style={[styles.postsTitle, { color: colors.text }]}>
            Posts
          </Text>

          <View style={styles.postsHeaderActions}>

            {/* SHORT VIDEOS */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Watch short videos"
              onPress={() =>
                openShortVideos("feed")
              }
              style={[styles.headerIconButton, { backgroundColor: colors.raised }]}
            >

              <Icon
                name="play-circle-outline"
                size={28}
                color={colors.text}
              />

            </Pressable>

            {/* ADD POST */}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create a post"
              onPress={openCreatePost}
              style={[styles.headerIconButton, { backgroundColor: colors.raised }]}
            >

              <Icon
                name="add"
                size={29}
                color={colors.text}
              />

            </Pressable>

          </View>

        </View>

        {/* =============================================
            DISCOVER FARMERS
        ============================================= */}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Discover farmers"
          onPress={() => {
            setFarmerSearch("");

            setScreen("discover");
          }}
          style={[styles.discoverBanner, { backgroundColor: colors.card }]}
        >

          <View style={[styles.discoverBannerIcon, { backgroundColor: colors.raised }] }>

            <Icon
              name="people-outline"
              size={25}
              color={C.mint}
            />

          </View>

          <View style={{ flex: 1 }}>

            <Text style={[styles.discoverBannerTitle, { color: colors.text }] }>
              Discover Farmers
            </Text>

            <Text style={[styles.discoverBannerSubtitle, { color: colors.muted }] }>
              Find farmers, follow them and explore
              their posts.
            </Text>

          </View>

          <Icon
            name="chevron-forward"
            size={21}
            color={C.muted}
          />

        </Pressable>

        {/* =============================================
            COMMUNITY POSTS
        ============================================= */}

        {posts.map(renderPost)}

        {/* EMPTY FEED */}

        {posts.length === 0 && (

          <View style={styles.emptyFeed}>

            <Icon
              name="images-outline"
              size={43}
              color={C.muted}
            />

            <Text style={styles.emptyTitle}>
              No posts yet
            </Text>

            <Text style={styles.emptyDescription}>
              Be the first to share an update
              with your farming community.
            </Text>

            <Button
              title="Create a post"
              onPress={openCreatePost}
            />

          </View>

        )}

        {!!error && (

          <Text style={styles.errorText}>
            {error}
          </Text>

        )}

      </ScrollView>
    );
  };

  /* =====================================================
     MAIN RETURN
  ===================================================== */

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>

      {renderScreen()}

      {/* ================================================
          COMMENTS
      ================================================= */}

      <Sheet
        visible={!!selectedPost}
        title="Comments"
        onClose={() => {
          setActivePost(undefined);

          setComment("");
        }}
      >

        {selectedPost?.comments.map(
          (text, i) => (

            <View
              key={i}
              style={s.card}
            >

              <Text style={s.text}>
                {text}
              </Text>

            </View>

          )
        )}

        {!selectedPost?.comments.length && (

          <Text style={s.small}>
            Start the conversation.
          </Text>

        )}

        <Field
          label="Your comment"
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
        />

        <Button
          title="Post comment"
          disabled={!comment.trim()}
          onPress={addComment}
        />

      </Sheet>

      {/* ================================================
          STORY VIEWER
      ================================================= */}

      {story ? <StoryViewer name={story} mediaUri={storyMedia} onClose={() => { setStory(undefined); setStoryMedia(undefined); }} /> : null}
      <StoryComposer visible={storyComposer} onClose={() => setStoryComposer(false)} onPreview={(uri) => { setStoryComposer(false); setStoryMedia(uri); setStory("Your story"); }} />

    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  storyViewer: { flex: 1, backgroundColor: '#050806', justifyContent: 'space-between' },
  storyShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(2, 11, 6, 0.22)' },
  storyProgress: { position: 'absolute', top: 18, left: 14, right: 14, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' },
  storyProgressFill: { width: '42%', height: 3, backgroundColor: '#FFFFFF' },
  storyViewerHeader: { marginTop: 28, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storyViewerUser: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  storyViewerAvatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: '#FFFFFF' },
  storyViewerName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  storyViewerTime: { color: '#D5E3D9', fontSize: 11, marginTop: 2 },
  storyViewerBottom: { padding: 18, gap: 14, backgroundColor: 'rgba(2, 11, 6, 0.55)' },
  storyViewerCaption: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
  storyReply: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  storyReplyInput: { flex: 1, height: 44, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)', borderRadius: 22, paddingHorizontal: 16, color: '#FFFFFF' },
  storySend: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.mint, alignItems: 'center', justifyContent: 'center' },
  storyComposer: { flex: 1, backgroundColor: '#0B0C0B', paddingHorizontal: 10, paddingTop: 16, gap: 15 },
  storyComposerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  storyComposerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  storyComposerDate: { color: '#FFFFFF', fontSize: 26, fontWeight: '600', marginTop: 6 },
  storyComposerSource: { color: '#C9D0CB', fontSize: 15 },
  storyTools: { flexDirection: 'row', gap: 10 },
  storyTool: { flex: 1, minHeight: 112, borderRadius: 14, backgroundColor: '#202120', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 8 },
  storyToolTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  storyToolSub: { color: '#AEB6B0', fontSize: 10 },
  storyRecent: { color: '#FFFFFF', fontSize: 22, fontWeight: '600', flexDirection: 'row', alignItems: 'center' },
  storyRecentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  storyRecentItem: { width: '32.5%', height: 150, backgroundColor: '#191B1A' },
  storyRecentImage: { width: '100%', height: '100%' },
  storyEmptyRecent: { minHeight: 150, borderRadius: 14, borderWidth: 1, borderColor: '#39433D', backgroundColor: '#191B1A', alignItems: 'center', justifyContent: 'center', gap: 8 },
  storyEmptyRecentTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  storyCameraOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.28)' },
  storyGalleryButton: { borderRadius: 13, backgroundColor: '#1D3427', padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },

  /* =====================================================
     MAIN
  ===================================================== */

  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  feed: {
    flex: 1,
    backgroundColor: C.bg,
  },

  iconButton: {
    width: 40,
    height: 42,

    alignItems: "center",
    justifyContent: "center",
  },

  /* =====================================================
     STORIES
  ===================================================== */

  storiesScroll: {
    flexGrow: 0,
  },

  storiesContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,

    gap: 13,
  },

  story: {
    width: 82,

    alignItems: "center",
    gap: 7,
  },

  storyRing: {
    width: 82,
    height: 82,

    borderRadius: 41,

    borderWidth: 3,

    borderTopColor: "#E9349D",
    borderRightColor: "#CE26BE",
    borderBottomColor: "#FF9C32",
    borderLeftColor: "#FF643B",

    alignItems: "center",
    justifyContent: "center",
  },

  storyImage: {
    width: 72,
    height: 72,

    borderRadius: 36,

    borderWidth: 2,
    borderColor: C.bg,

    backgroundColor: C.raised,
  },

  myStoryCircle: {
    width: 82,
    height: 82,

    alignItems: "center",
    justifyContent: "center",
  },

  myStoryImage: {
    width: 76,
    height: 76,

    borderRadius: 38,

    backgroundColor: C.raised,
  },

  storyPlus: {
    position: "absolute",

    right: 0,
    bottom: 0,

    width: 25,
    height: 25,

    borderRadius: 13,

    borderWidth: 2,
    borderColor: C.bg,

    backgroundColor: COLORS.blue,

    alignItems: "center",
    justifyContent: "center",
  },

  storyLabel: {
    color: C.text,

    fontSize: 11,

    textAlign: "center",

    maxWidth: 82,
  },

  /* =====================================================
     POSTS HEADER
  ===================================================== */

  postsHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: C.bg,

    paddingHorizontal: 15,
    paddingVertical: 9,

    borderTopWidth: 1,
    borderBottomWidth: 1,

    borderColor: C.line,
  },

  postsTitle: {
    color: C.text,

    fontSize: 17,
    fontWeight: "700",
  },

  postsHeaderActions: {
    flexDirection: "row",

    alignItems: "center",

    gap: 13,
  },

  headerIconButton: {
    width: 43,
    height: 43,

    borderRadius: 12,

    backgroundColor: C.raised,

    alignItems: "center",
    justifyContent: "center",
  },

  /* =====================================================
     DISCOVER FARMERS
  ===================================================== */

  discoverBanner: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    paddingHorizontal: 15,
    paddingVertical: 14,

    backgroundColor: C.card,

    marginBottom: 8,
  },

  discoverBannerIcon: {
    width: 43,
    height: 43,

    borderRadius: 22,

    backgroundColor: C.raised,

    alignItems: "center",
    justifyContent: "center",
  },

  discoverBannerTitle: {
    color: C.text,

    fontSize: 14,
    fontWeight: "700",
  },

  discoverBannerSubtitle: {
    color: C.muted,

    fontSize: 11,

    marginTop: 4,
  },

  /* =====================================================
     POSTS
  ===================================================== */

  post: {
    backgroundColor: C.card,

    width: "100%",

    overflow: "hidden",

    marginBottom: 9,
  },

  postHeader: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    padding: 13,
  },

  avatar: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: C.raised,
  },

  name: {
    color: C.text,

    fontSize: 13,
    fontWeight: "700",
  },

  postHandle: {
    color: C.muted,

    fontSize: 10,

    marginTop: 3,
  },

  postImage: {
    width: "100%",

    height: 310,

    backgroundColor: C.raised,
  },

  videoContainer: {
    width: "100%",

    backgroundColor: "#000000",

    overflow: "hidden",
  },

  postCaption: {
    color: C.text,

    fontSize: 13,
    lineHeight: 20,

    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },

  postActions: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  postActionsLeft: {
    flexDirection: "row",

    alignItems: "center",

    gap: 14,
  },

  postAction: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    minHeight: 42,
  },

  /* =====================================================
     POST EDITOR
  ===================================================== */

  editorScreen: {
    flex: 1,

    backgroundColor: C.bg,
  },

  editorHeader: {
    height: 60,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,
  },

  editorTitle: {
    color: C.text,

    fontSize: 18,
    fontWeight: "700",
  },

  publishButton: {
    minWidth: 54,

    paddingHorizontal: 10,
    paddingVertical: 8,

    alignItems: "center",
  },

  publishText: {
    color: C.mint,

    fontSize: 15,
    fontWeight: "700",
  },

  editorContent: {
    padding: 15,

    gap: 15,

    paddingBottom: 40,
  },

  editorAuthor: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    paddingBottom: 7,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 4,
  },

  sectionTitle: {
    color: C.text,

    fontSize: 15,
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: C.muted,

    fontSize: 12,
  },

  /* =====================================================
     MEDIA SELECTION
  ===================================================== */

  mediaOptions: {
    flexDirection: "row",

    gap: 10,
  },

  mediaOption: {
    flex: 1,

    height: 94,

    borderRadius: 12,

    backgroundColor: C.card,

    borderWidth: 1,
    borderColor: C.line,

    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },

  mediaOptionLabel: {
    color: C.text,

    fontSize: 12,
    fontWeight: "600",
  },

  recordButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    minHeight: 52,

    borderRadius: 12,

    backgroundColor: C.raised,

    paddingHorizontal: 15,
  },

  recordButtonText: {
    color: C.text,

    fontSize: 14,
    fontWeight: "600",

    flex: 1,
  },

  loadingRow: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 12,

    paddingVertical: 12,
  },

  /* =====================================================
     MEDIA PREVIEWS
  ===================================================== */

  mediaPreview: {
    width: "100%",

    backgroundColor: C.card,

    borderRadius: 12,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: C.line,
  },

  previewHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  previewTitle: {
    color: C.text,

    fontSize: 14,
    fontWeight: "700",
  },

  editorImage: {
    width: "100%",

    height: 310,

    backgroundColor: "#000000",
  },

  emptyMedia: {
    width: "100%",

    minHeight: 170,

    borderRadius: 12,

    backgroundColor: C.card,

    borderWidth: 1,
    borderColor: C.line,

    alignItems: "center",
    justifyContent: "center",

    gap: 11,

    padding: 20,
  },

  emptyMediaTitle: {
    color: C.text,

    fontSize: 15,
    fontWeight: "700",

    textAlign: "center",
  },

  emptyMediaSubtitle: {
    color: C.muted,

    fontSize: 12,
    lineHeight: 19,

    textAlign: "center",
  },

  /* =====================================================
     CAPTION
  ===================================================== */

  captionSection: {
    backgroundColor: C.card,

    borderRadius: 12,

    padding: 13,

    borderWidth: 1,
    borderColor: C.line,
  },

  captionInput: {
    minHeight: 100,

    color: C.text,

    fontSize: 15,
    lineHeight: 22,

    textAlignVertical: "top",

    paddingTop: 12,
    paddingBottom: 10,
  },

  characterCount: {
    color: C.muted,

    fontSize: 11,

    textAlign: "right",
  },

  uploadNote: {
    color: C.muted,

    fontSize: 11,
    lineHeight: 18,

    textAlign: "center",
  },

  /* =====================================================
     FARMER DISCOVERY
  ===================================================== */

  discoverScreen: {
    flex: 1,

    backgroundColor: C.bg,
  },

  discoverHeader: {
    height: 60,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 12,
  },

  discoverTitle: {
    color: C.text,

    fontSize: 18,
    fontWeight: "700",
  },

  searchBox: {
    height: 45,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: C.raised,

    borderRadius: 12,

    marginHorizontal: 13,
    marginBottom: 13,

    paddingHorizontal: 12,

    gap: 10,
  },

  searchInput: {
    flex: 1,

    height: 45,

    color: C.text,

    fontSize: 14,
  },

  farmerCard: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    padding: 14,

    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },

  farmerAvatar: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: C.raised,
  },

  farmerName: {
    color: C.text,

    fontSize: 14,
    fontWeight: "700",
  },

  farmerHandle: {
    color: C.muted,

    fontSize: 12,

    marginTop: 3,
  },

  farmerStats: {
    color: C.muted,

    fontSize: 11,

    marginTop: 4,
  },

  followButton: {
    backgroundColor: COLORS.blue,

    minWidth: 84,
    height: 36,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 9,
  },

  followingButton: {
    backgroundColor: C.raised,
  },

  followText: {
    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "700",
  },

  emptyFarmers: {
    minHeight: 280,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 28,

    gap: 15,
  },

  /* =====================================================
     FARMER PROFILE
  ===================================================== */

  farmerProfile: {
    flex: 1,

    backgroundColor: C.bg,
  },

  profileHeader: {
    height: 60,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 10,
  },

  profileUsername: {
    color: C.text,

    fontSize: 19,
    fontWeight: "700",

    flexShrink: 1,
  },

  profileInfo: {
    flexDirection: "row",

    alignItems: "center",

    gap: 15,

    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 12,
  },

  profileAvatar: {
    width: 87,
    height: 87,

    borderRadius: 44,

    backgroundColor: C.raised,
  },

  profileStatistics: {
    flex: 1,

    flexDirection: "row",

    justifyContent: "space-around",
  },

  profileStat: {
    alignItems: "center",

    gap: 5,
  },

  statNumber: {
    color: C.text,

    fontSize: 18,
    fontWeight: "700",
  },

  statLabel: {
    color: C.text,

    fontSize: 12,
  },

  profileName: {
    color: C.text,

    fontSize: 14,
    fontWeight: "700",

    marginHorizontal: 15,
  },

  profileBio: {
    color: C.muted,

    fontSize: 12,

    marginHorizontal: 15,
    marginTop: 5,
  },

  profileFollowButton: {
    height: 40,

    backgroundColor: COLORS.blue,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",

    marginHorizontal: 15,
    marginTop: 18,
    marginBottom: 20,
  },

  profilePostsHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    height: 50,

    borderTopWidth: 1,
    borderBottomWidth: 1,

    borderColor: C.line,
  },

  profilePostsTitle: {
    color: C.text,

    fontSize: 14,
    fontWeight: "700",
  },

  /* =====================================================
     PROFILE POST GRID
  ===================================================== */

  profileGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 2,
  },

  profileGridItem: {
    width: "33%",

    aspectRatio: 1,

    backgroundColor: C.raised,

    position: "relative",
  },

  profileGridImage: {
    width: "100%",
    height: "100%",
  },

  videoGridTile: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#16281D",

    gap: 7,
  },

  gridVideoLabel: {
    color: C.text,

    fontSize: 11,
    fontWeight: "600",
  },

  videoIndicator: {
    position: "absolute",

    top: 8,
    right: 8,

    backgroundColor:
      "rgba(0,0,0,0.5)",

    borderRadius: 12,

    padding: 4,
  },

  textPost: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    padding: 8,
  },

  textPostText: {
    color: C.text,

    fontSize: 11,

    textAlign: "center",
  },

  farmerPostSection: {
    paddingTop: 15,
  },

  /* =====================================================
     EMPTY STATES
  ===================================================== */

  emptyFeed: {
    minHeight: 260,

    alignItems: "center",
    justifyContent: "center",

    gap: 14,

    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: C.text,

    fontSize: 19,
    fontWeight: "700",

    textAlign: "center",
  },

  emptyDescription: {
    color: C.muted,

    fontSize: 13,
    lineHeight: 20,

    textAlign: "center",
  },

  errorText: {
    color: "#FF7777",

    fontSize: 12,

    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  /* =====================================================
     STORY VIEWER
  ===================================================== */

  storyPreview: {
    width: "100%",

    height: 340,

    borderRadius: 16,

    backgroundColor: C.raised,
  },

});
