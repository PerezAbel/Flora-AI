import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { VetListing } from '@/services/vet-directory';

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
  videoUri?: string;
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
      "Small moments in the garden. Share what’s growing on your farm. #FarmLife #InBloom",
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
  imageUri?: string;
  stock?: number;
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
  livestock:
    "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=900&q=85&fit=crop",
};
export const avatar = (id: number) => `https://i.pravatar.cc/100?img=${id}`;
const initialPosts: Post[] = [
  { id: "p1", name: "Samuel Oduya", handle: "Kakamega · 35m ago", avatar: 12, image: photos.seeds, text: "My maize leaves have yellow stripes — could this be Maize Streak Virus? The symptoms appeared 3 days ago after heavy rain.", tag: "Crop Issues", likes: 24, comments: [] },
  { id: "p2", name: "Agnes Mutua", handle: "Machakos · 2h ago", avatar: 47, text: "My goat has been off-feed for 2 days, slightly bloated on left side. Has anyone experienced this? Looking for a local vet.", tag: "Animal Health", likes: 8, comments: [] },
];
const initialProducts: Product[] = [
  { id: "1", name: "Fresh Tomatoes", seller: "John Mwangi · Nakuru", price: 80, category: "Vegetables", photo: photos.vegetables, badge: "Vegetables" },
  { id: "2", name: "Grade A Maize", seller: "Mary Wanjiku · Eldoret", price: 45, category: "Cereals", photo: photos.seeds, badge: "Cereals" },
  { id: "3", name: "Fresh Milk (Raw)", seller: "Peter Njoroge · Kiambu", price: 60, category: "Dairy", photo: photos.livestock, badge: "Dairy" },
  { id: "4", name: "French Beans", seller: "Grace Achieng · Meru", price: 120, category: "Vegetables", photo: photos.tools, badge: "Vegetables" },
];
function useAgroState() {
  const [vetListings, setVetListings] = useState<VetListing[]>([]);
  const [posts, setPosts] = useState(initialPosts);
  const [videos, setVideos] = useState<FarmVideo[]>(initialVideos);
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [profile, setProfile] = useState({
    name: "Kwame Asante",
    handle: "@kwame_asante",
    location: "Kumasi, Ghana 🇬🇭",
    bio: "3rd generation farmer | Maize & Cassava specialist | Using tech to grow smarter",
  });
  const [metric, setMetric] = useState(true);
  const [notifications, setNotifications] = useState([true, true, false, true]);
  return {
    metric,
    setMetric,
    vetListings,
    setVetListings,
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
  [photos.seeds]: require("@/assets/images/agro/tools.jpg"),
  [photos.livestock]: require("@/assets/images/agro/livestock.jpg"),
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
