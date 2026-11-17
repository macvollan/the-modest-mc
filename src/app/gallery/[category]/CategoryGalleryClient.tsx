"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Film,
  MapPin,
  MessageCircle,
  Play,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  findCategoryBySlug,
  getYouTubeId,
  isVideoMedia,
  normalizeGalleryItem,
  type NormalizedGalleryItem,
} from "@/lib/gallery-categories";

const PRIMARY_PHONE = "254729226453";
const YOUTUBE_URL = "https://youtube.com/@modestmckenya";
const TIKTOK_URL = "https://www.tiktok.com/@modestmckenya";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.5V8.58a8.28 8.28 0 0 0 4.91 1.6V6.73a4.77 4.77 0 0 1-1-.04z" />
    </svg>
  );
}

export default function CategoryGalleryClient({ slug }: { slug: string }) {
  const categoryDef = findCategoryBySlug(slug) || GALLERY_CATEGORIES[0];

  const [items, setItems] = useState<NormalizedGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"all" | "photos" | "videos">("all");
  const [selectedMedia, setSelectedMedia] = useState<NormalizedGalleryItem | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/gallery?category=${encodeURIComponent(categoryDef.dbCategory)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const raw = Array.isArray(data.items) ? data.items : [];
        const normalized = raw.map((item: any) =>
          normalizeGalleryItem(item, categoryDef.fallbackCover)
        );
        setItems(normalized);
      })
      .catch((err) => console.error("Failed loading category gallery:", err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [categoryDef.dbCategory, categoryDef.fallbackCover]);

  const photos = items.filter((item) => !isVideoMedia(item.mediaType));
  const videos = items.filter((item) => isVideoMedia(item.mediaType));

  const activeModalList = selectedMedia
    ? isVideoMedia(selectedMedia.mediaType)
      ? videos
      : photos
    : [];
  const currentModalIndex = selectedMedia
    ? activeModalList.findIndex((i) => i.id === selectedMedia.id)
    : -1;

  const goPrev = () => {
    if (currentModalIndex > 0) {
      setSelectedMedia(activeModalList[currentModalIndex - 1]);
    }
  };
  const goNext = () => {
    if (currentModalIndex >= 0 && currentModalIndex < activeModalList.length - 1) {
      setSelectedMedia(activeModalList[currentModalIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060D1E] text-slate-100 selection:bg-[#E5A827] selection:text-[#060D1E]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#060D1E]/95 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#E5A827] shadow-[0_0_15px_rgba(229,168,39,0.3)]">
              <Image
                src="/logo.jpg"
                alt="The Modest MC Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-black text-white text-sm sm:text-base tracking-tight block group-hover:text-[#E5A827] transition-colors">
                THE MODEST MC
              </span>
              <span className="text-[10px] text-[#E5A827] font-semibold uppercase tracking-wider block">
                Pomp &amp; Colour Gallery
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/#gallery"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E5A827]" />
              <span className="hidden sm:inline">All Categories</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <Link
              href="/#book"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Event</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Category Hero Banner */}
      <section className="relative overflow-hidden border-b border-white/10 py-14 sm:py-16">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={photos[0]?.previewImage || categoryDef.fallbackCover}
            alt={categoryDef.title}
            fill
            className="object-cover blur-sm scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060D1E]/80 via-[#060D1E]/85 to-[#060D1E]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Quick Category Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {GALLERY_CATEGORIES.map((cat) => {
              const isCurrent = cat.slug === categoryDef.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/gallery/${cat.slug}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-[#E5A827] text-[#060D1E] shadow-md"
                      : "bg-[#0A1A3A]/90 text-slate-300 border border-white/15 hover:border-[#E5A827]/60 hover:text-white"
                  }`}
                >
                  {cat.shortTitle}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A827]/15 border border-[#E5A827]/30 text-[#E5A827] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{categoryDef.tagline}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {categoryDef.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                {categoryDef.description}
              </p>
            </div>

            {/* Photos vs Videos Division Controls */}
            <div className="flex flex-wrap items-center gap-2 bg-[#0A1A3A]/90 p-1.5 rounded-2xl border border-white/10 self-start lg:self-end">
              <button
                type="button"
                onClick={() => setActiveView("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === "all"
                    ? "bg-[#E5A827] text-[#060D1E] shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                All ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveView("photos")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === "photos"
                    ? "bg-[#E5A827] text-[#060D1E] shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos ({photos.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("videos")}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeView === "videos"
                    ? "bg-[#E5A827] text-[#060D1E] shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videos ({videos.length})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Divided into Photos & Videos */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-16">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#E5A827] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              Loading {categoryDef.title} photos &amp; videos...
            </p>
          </div>
        ) : (
          <>
            {/* ================= SECTION 1: PHOTOS ================= */}
            {(activeView === "all" || activeView === "photos") && (
              <section id="photos" className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/40 flex items-center justify-center text-[#E5A827]">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        Photos
                      </h2>
                      <p className="text-xs text-slate-400">
                        High-resolution event snapshots &amp; moments
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E5A827]/15 border border-[#E5A827]/30 text-[#E5A827] text-xs font-bold">
                    {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                {photos.length === 0 ? (
                  <div className="rounded-2xl p-10 card-gradient border border-white/10 text-center space-y-2">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                    <h3 className="text-sm font-bold text-white">
                      No photos uploaded under {categoryDef.title} yet
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Fresh photos from our recent celebrations will appear here as soon as they are published from our studio.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedMedia(photo)}
                        className="group rounded-2xl overflow-hidden card-gradient border border-white/10 hover:border-[#E5A827]/60 transition-all cursor-pointer flex flex-col justify-between shadow-lg"
                      >
                        <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                          <Image
                            src={photo.previewImage}
                            alt={photo.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#060D1E] via-transparent to-transparent opacity-70 group-hover:opacity-45 transition-opacity" />
                          <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/15 flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#E5A827]" />
                            <span>Photo</span>
                          </span>
                        </div>

                        <div className="p-5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#E5A827] font-semibold">
                              {categoryDef.shortTitle}
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#E5A827]" />
                              <span>{photo.location}</span>
                            </span>
                          </div>
                          <h3 className="font-bold text-white text-base group-hover:text-[#E5A827] transition-colors">
                            {photo.title}
                          </h3>
                          {photo.description && (
                            <p className="text-xs text-slate-300 font-light line-clamp-2">
                              {photo.description}
                            </p>
                          )}
                          <div className="pt-1 flex items-center gap-1.5 text-xs text-[#E5A827] font-semibold group-hover:underline">
                            <span>View Full Photo</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ================= SECTION 2: VIDEOS & REELS ================= */}
            {(activeView === "all" || activeView === "videos") && (
              <section id="videos" className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/40 flex items-center justify-center text-[#E5A827]">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        Videos &amp; Event Reels
                      </h2>
                      <p className="text-xs text-slate-400">
                        Live entrances, crowd energy, sound demos &amp; highlight reels
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E5A827]/15 border border-[#E5A827]/30 text-[#E5A827] text-xs font-bold">
                    {videos.length} {videos.length === 1 ? "Video" : "Videos"}
                  </span>
                </div>

                {videos.length === 0 ? (
                  <div className="rounded-2xl p-10 card-gradient border border-white/10 text-center space-y-4">
                    <Video className="w-8 h-8 text-slate-500 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">
                        No videos uploaded under {categoryDef.title} yet
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Check back soon for highlight clips, or watch our latest live reels on YouTube and TikTok!
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                      <a
                        href={YOUTUBE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        <YoutubeIcon className="w-4 h-4" />
                        <span>YouTube @modestmckenya</span>
                      </a>
                      <a
                        href={TIKTOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        <TikTokIcon className="w-4 h-4" />
                        <span>TikTok @modestmckenya</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((vid) => {
                      const isYoutube = vid.mediaType === "youtube";
                      const isTiktok = vid.mediaType === "tiktok";

                      return (
                        <div
                          key={vid.id}
                          onClick={() => setSelectedMedia(vid)}
                          className="group rounded-2xl overflow-hidden card-gradient border border-white/10 hover:border-[#E5A827]/60 transition-all cursor-pointer flex flex-col justify-between shadow-lg"
                        >
                          <div className="relative aspect-video bg-black overflow-hidden">
                            {isTiktok ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1A3A] to-black gap-2">
                                <TikTokIcon className="w-12 h-12 text-[#E5A827]" />
                                <span className="text-xs font-bold text-slate-300">
                                  TikTok Event Reel
                                </span>
                              </div>
                            ) : (
                              <Image
                                src={vid.previewImage}
                                alt={vid.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-[#1044A3]/90 border-2 border-[#E5A827] text-[#E5A827] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                {isYoutube ? (
                                  <YoutubeIcon className="w-6 h-6 text-white" />
                                ) : isTiktok ? (
                                  <TikTokIcon className="w-6 h-6 text-white" />
                                ) : (
                                  <Play className="w-6 h-6 fill-current ml-0.5" />
                                )}
                              </div>
                            </div>

                            <span className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/15 flex items-center gap-1">
                              <Video className="w-3 h-3 text-[#E5A827]" />
                              <span>
                                {isYoutube ? "YouTube" : isTiktok ? "TikTok" : "Video"}
                              </span>
                            </span>
                          </div>

                          <div className="p-5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#E5A827] font-semibold">
                                {categoryDef.shortTitle}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#E5A827]" />
                                <span>{vid.location}</span>
                              </span>
                            </div>
                            <h3 className="font-bold text-white text-base group-hover:text-[#E5A827] transition-colors">
                              {vid.title}
                            </h3>
                            {vid.description && (
                              <p className="text-xs text-slate-300 font-light line-clamp-2">
                                {vid.description}
                              </p>
                            )}
                            <div className="pt-1 flex items-center gap-1.5 text-xs text-[#E5A827] font-semibold group-hover:underline">
                              <span>Watch Video</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Bottom Booking CTA Banner */}
        <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#0A204C] via-[#1044A3]/40 to-[#0D1830] border border-[#E5A827]/35 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-bold text-[#E5A827] uppercase tracking-wider">
              Inspired by what you see?
            </span>
            <h3 className="text-2xl font-black text-white">
              Bring Pomp &amp; Colour to Your {categoryDef.shortTitle} Event
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Reserve your date online or chat directly with our team on WhatsApp for tailored MC, PA sound, and full event coordination packages.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/#book"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-black px-6 py-3.5 rounded-xl text-xs shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Date</span>
            </Link>
            <a
              href={`https://wa.me/${PRIMARY_PHONE}?text=${encodeURIComponent(
                `Hello The Modest MC! I was just viewing your ${categoryDef.title} gallery and would like to inquire about booking an event.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-3.5 rounded-xl text-xs shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </section>
      </main>

      {/* Lightbox / Theater Viewer Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0A1A3A] border border-[#E5A827]/40 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 text-white hover:text-[#E5A827] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev / Next Navigation Arrows */}
            {currentModalIndex > 0 && (
              <button
                onClick={goPrev}
                aria-label="Previous item"
                className="absolute left-3 top-1/3 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E5A827] text-white hover:text-[#060D1E] flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {currentModalIndex >= 0 && currentModalIndex < activeModalList.length - 1 && (
              <button
                onClick={goNext}
                aria-label="Next item"
                className="absolute right-3 top-1/3 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E5A827] text-white hover:text-[#060D1E] flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Media Player / Photo Stage */}
            <div className="bg-black relative aspect-video flex items-center justify-center overflow-hidden">
              {selectedMedia.mediaType === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${
                    getYouTubeId(selectedMedia.mediaUrl) || ""
                  }?autoplay=1`}
                  title={selectedMedia.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedMedia.mediaType === "tiktok" ? (
                <div className="p-8 text-center space-y-4">
                  <TikTokIcon className="w-16 h-16 text-[#E5A827] mx-auto" />
                  <h4 className="text-white font-bold text-lg">
                    {selectedMedia.title}
                  </h4>
                  <p className="text-slate-300 text-xs">
                    Watch this event reel directly on TikTok
                  </p>
                  <a
                    href={selectedMedia.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E5A827] text-[#060D1E] font-bold text-sm hover:brightness-110 transition-all"
                  >
                    <span>Open in TikTok</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ) : selectedMedia.mediaType === "video" ? (
                <video
                  src={selectedMedia.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedMedia.mediaUrl || selectedMedia.previewImage}
                    alt={selectedMedia.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="p-6 bg-[#081530] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#E5A827] uppercase tracking-wider">
                  {categoryDef.title} &bull; {selectedMedia.location}
                </span>
                <h3 className="text-xl font-bold text-white">
                  {selectedMedia.title}
                </h3>
                {selectedMedia.description && (
                  <p className="text-xs sm:text-sm text-slate-300 font-light">
                    {selectedMedia.description}
                  </p>
                )}
              </div>

              <Link
                href="/#book"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#060D1E] font-extrabold text-xs hover:brightness-110 transition-all shrink-0"
              >
                <span>Book For Your Event</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
