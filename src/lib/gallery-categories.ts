export interface GalleryCategoryDef {
  slug: string;
  dbCategory: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  fallbackCover: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryDef[] = [
  {
    slug: "weddings",
    dbCategory: "Weddings",
    title: "Weddings & Ruracios",
    shortTitle: "Weddings",
    tagline: "Royal Entrances, Dowry Ceremonies & Unforgettable Vows",
    description:
      "Relive electrifying bridal entrances, bilingual Ruracio cultural protocols, and high-energy wedding receptions across Kenya.",
    fallbackCover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "corporate",
    dbCategory: "Corporate",
    title: "Corporate Events & Galas",
    shortTitle: "Corporate",
    tagline: "Executive Poise, Product Launches & Awards Nights",
    description:
      "Sharp timekeeping, executive hosting, and crystal-clear stage production for corporate dinners, conferences, and institutional launches.",
    fallbackCover:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "team-building",
    dbCategory: "Team Building",
    title: "Team Building",
    shortTitle: "Team Building",
    tagline: "High-Energy Challenges, Synergy & Morale Boosting",
    description:
      "Action-packed outdoor challenges, creative icebreakers, and unforgettable corporate bonding sessions across Kenya's top resorts.",
    fallbackCover:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "birthdays",
    dbCategory: "Birthdays",
    title: "Birthdays & Baby Showers",
    shortTitle: "Birthdays & Showers",
    tagline: "Milestone Celebrations, Joy & Family Moments",
    description:
      "Heartfelt toasts, interactive family games, milestone birthday parties, gender reveals, and vibrant baby showers.",
    fallbackCover:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "sound-setup",
    dbCategory: "Sound & Setup",
    title: "Sound & PA Engineering",
    shortTitle: "Sound & Setup",
    tagline: "Concert-Grade Line Arrays, Sub-Bass & Wireless Clarity",
    description:
      "Behind the decks and on the field — inspect our active line-array towers, dual 18-inch subs, digital mixers, and stage rigs.",
    fallbackCover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
  },
];

export function findCategoryBySlug(slug: string): GalleryCategoryDef | undefined {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  return GALLERY_CATEGORIES.find(
    (c) =>
      c.slug === normalized ||
      c.dbCategory.toLowerCase() === normalized
  );
}

export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export interface NormalizedGalleryItem {
  id: number;
  title: string;
  category: string;
  location: string;
  mediaType: "photo" | "video" | "youtube" | "tiktok";
  mediaUrl: string;
  previewImage: string;
  description: string;
  createdAt?: string;
}

export function isVideoMedia(mediaType: string): boolean {
  return mediaType === "video" || mediaType === "youtube" || mediaType === "tiktok";
}

export function normalizeGalleryItem(
  item: any,
  fallbackCover = "/logo.jpg"
): NormalizedGalleryItem {
  const url: string = item.media_url || item.mediaUrl || "";
  const rawType: string = (item.media_type || item.mediaType || "photo").toLowerCase();

  const isYoutube =
    rawType === "youtube" ||
    url.includes("youtu.be") ||
    url.includes("youtube.com");
  const isTiktok = rawType === "tiktok" || url.includes("tiktok.com");
  const isDirectVideo =
    rawType === "video" || /\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(url);

  const mediaType: NormalizedGalleryItem["mediaType"] = isYoutube
    ? "youtube"
    : isTiktok
    ? "tiktok"
    : isDirectVideo
    ? "video"
    : "photo";

  let previewImage = item.thumbnail_url || item.thumbnailUrl || "";
  if (!previewImage) {
    if (isYoutube) {
      const ytId = getYouTubeId(url);
      previewImage = ytId
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : fallbackCover;
    } else if (isDirectVideo && url.includes("cloudinary.com")) {
      previewImage = url.replace(/\.(mp4|mov|webm|m4v|ogg)(\?.*)?$/i, ".jpg");
    } else if (mediaType === "photo" && url) {
      previewImage = url;
    } else {
      previewImage = fallbackCover;
    }
  }

  return {
    id: item.id,
    title: item.title || "Event Highlight",
    category: item.category || "Weddings",
    location: item.location || "Kenya",
    mediaType,
    mediaUrl: url,
    previewImage,
    description: item.description || item.desc || "",
    createdAt: item.created_at,
  };
}
