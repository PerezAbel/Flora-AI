import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

export type Post = {
  id: string;
  name: string;
  handle: string;
  avatar: number;
  image?: string;
  text: string;
  tag: string;
  likes: number;
  liked?: boolean;
  comments: string[];
};
export type FarmVideo = {
  id: string;
  source: string | number;
  author: string;
  handle: string;
  avatar: number;
  caption: string;
  likes: number;
  liked?: boolean;
  comments: string[];
  sample?: boolean;
};
const initialVideos: FarmVideo[] = [
  {
    id: "sample-flowers",
    source: require("@/assets/images/agro/flower-short.mp4"),
    author: "AGRO AI",
    handle: "@agro_ai",
    avatar: 47,
    caption:
      "Small moments in the garden 🌸 Share what’s growing on your farm. #FarmLife #InBloom",
    likes: 0,
    comments: [],
    sample: true,
  },
];
export type Product = {
  id: string;
  name: string;
  seller: string;
  price: number;
  category: string;
  photo: string;
  badge: string;
};
export const photos = {
  farm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&q=85&fit=crop",
  maize:
    "https://images.unsplash.com/photo-1601593768799-93e8ab7e5a96?w=900&q=85&fit=crop",
  seeds:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85&fit=crop",
  vegetables:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85&fit=crop",
  tools:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85&fit=crop",
};
export const avatar = (id: number) => `https://i.pravatar.cc/100?img=${id}`;
const initialPosts: Post[] = [
  {
    id: "p1",
    name: "Amara Diallo",
    handle: "@amara_farms · 2h ago",
    avatar: 47,
    image: photos.maize,
    text: "A little progress, every day 🌽 The maize is looking greener this week. What has worked well on your farm this season?",
    tag: "Success Story",
    likes: 284,
    comments: [
      "The field looks wonderful!",
      "Regular field checks have helped us a lot.",
    ],
  },
  {
    id: "p2",
    name: "Kwame Mensah",
    handle: "@kwame_agri · 5h ago",
    avatar: 12,
    image: photos.farm,
    text: "Spotted changes in a few leaves during my morning walk. Keeping a record and checking with our local agronomist. How do you track crop health?",
    tag: "Field Notes",
    likes: 126,
    comments: [],
  },
];
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Garden Hand Tool Set",
    seller: "AgroChemKe",
    price: 24.99,
    category: "Equipment",
    photo: photos.tools,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Organic Compost · 20kg",
    seller: "FarmSupply",
    price: 38.5,
    category: "Fertilizers",
    photo: photos.farm,
    badge: "Top Rated",
  },
  {
    id: "3",
    name: "Organic Maize Seeds",
    seller: "GreenSeed",
    price: 12.99,
    category: "Seeds",
    photo: photos.maize,
    badge: "Organic",
  },
  {
    id: "4",
    name: "Fresh Farm Produce Box",
    seller: "Harvest Hub",
    price: 18,
    category: "Produce",
    photo: photos.vegetables,
    badge: "New",
  },
];
function useAgroState() {
  const [posts, setPosts] = useState(initialPosts);
  const [videos, setVideos] = useState<FarmVideo[]>(initialVideos);
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState({
    name: "Kwame Asante",
    handle: "@kwame_asante",
    location: "Kumasi, Ghana 🇬🇭",
    bio: "3rd generation farmer 🌿 | Maize & Cassava specialist | Using tech to grow smarter",
  });
  const [notifications, setNotifications] = useState([true, true, false, true]);
  return {
    posts,
    setPosts,
    videos,
    setVideos,
    products,
    setProducts,
    cart,
    setCart,
    profile,
    setProfile,
    notifications,
    setNotifications,
  };
}
const Context = createContext<ReturnType<typeof useAgroState> | null>(null);
export function AgroProvider({ children }: PropsWithChildren) {
  const value = useAgroState();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAgro() {
  const value = useContext(Context);
  if (!value) throw new Error("AgroProvider is required");
  return value;
}

const bundledPhotos: Record<string, number> = {
  [photos.farm]: require("@/assets/images/agro/farm.jpg"),
  [photos.maize]: require("@/assets/images/agro/maize.jpg"),
  [photos.tools]: require("@/assets/images/agro/tools.jpg"),
  [photos.vegetables]: require("@/assets/images/agro/vegetables.jpg"),
  [avatar(12)]: require("@/assets/images/agro/avatar-12.jpg"),
  [avatar(47)]: require("@/assets/images/agro/avatar-47.jpg"),
  [avatar(11)]: require("@/assets/images/agro/avatar-11.jpg"),
  [avatar(44)]: require("@/assets/images/agro/avatar-44.jpg"),
  [avatar(13)]: require("@/assets/images/agro/avatar-13.jpg"),
};
export function imageSource(uri: string) {
  return bundledPhotos[uri] ?? { uri };
}
