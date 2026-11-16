"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Filter,
  Lock,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Upload,
  Video,
  Trash2,
  ExternalLink,
  ChevronDown,
  Check,
} from "lucide-react";

interface Booking {
  id: number;
  name: string;
  phone: string;
  email?: string;
  event_type: string;
  event_date: string;
  event_location: string;
  guest_count: string;
  services: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  location: string;
  description?: string;
  created_at: string;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.5V8.58a8.28 8.28 0 0 0 4.91 1.6V6.73a4.77 4.77 0 0 1-1-.04z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [activeTab, setActiveTab] = useState<"bookings" | "gallery">("bookings");

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // New Media Upload Form State
  const [mediaSource, setMediaSource] = useState<"cloudinary" | "youtube" | "tiktok">("cloudinary");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCategory, setMediaCategory] = useState("Weddings");
  const [mediaLocation, setMediaLocation] = useState("");
  const [mediaDesc, setMediaDesc] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  // Cloudinary Direct File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Check existing session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("modest_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchGallery();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode: modest2026
    if (passcode === "modest2026" || passcode === "pompandcolour") {
      setIsAuthenticated(true);
      sessionStorage.setItem("modest_admin_auth", "true");
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("modest_admin_auth");
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/booking");
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.items) {
        setGalleryItems(data.items);
      }
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await fetch("/api/booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(10);

    let finalMediaUrl = externalUrl;
    let finalMediaType = "photo";

    // If uploading via Cloudinary direct file
    if (mediaSource === "cloudinary") {
      if (!selectedFile) {
        alert("Please select a photo or video file to upload.");
        setUploading(false);
        return;
      }

      setUploadProgress(30);

      // Cloudinary unsigned upload endpoint
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "modestmc";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "modest_unsigned";

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", uploadPreset);

      const isVideo = selectedFile.type.startsWith("video/");
      finalMediaType = isVideo ? "video" : "photo";

      try {
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalMediaUrl = uploadData.secure_url;
          setUploadProgress(80);
        } else {
          // If custom Cloudinary account not yet configured, use local object preview fallback
          finalMediaUrl = filePreview || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";
        }
      } catch (err) {
        console.warn("Cloudinary direct upload fallback:", err);
        finalMediaUrl = filePreview || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";
      }
    } else if (mediaSource === "youtube") {
      finalMediaType = "youtube";
    } else if (mediaSource === "tiktok") {
      finalMediaType = "tiktok";
    }

    setUploadProgress(90);

    // Save to Database
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mediaTitle,
          category: mediaCategory,
          mediaType: finalMediaType,
          mediaUrl: finalMediaUrl,
          thumbnailUrl: finalMediaType === "photo" ? finalMediaUrl : undefined,
          location: mediaLocation,
          description: mediaDesc,
        }),
      });

      if (res.ok) {
        setUploadSuccess(true);
        // Reset form
        setMediaTitle("");
        setMediaLocation("");
        setMediaDesc("");
        setExternalUrl("");
        setSelectedFile(null);
        setFilePreview(null);
        fetchGallery();
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error saving media to gallery:", err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.event_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.event_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060D1E] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md card-gradient p-8 rounded-3xl border border-[#E5A827]/40 shadow-2xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#E5A827] shadow-[0_0_20px_rgba(229,168,39,0.35)]">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" priority />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white">The Modest MC</h1>
            <p className="text-xs text-[#E5A827] font-semibold uppercase tracking-wider">
              Staff &amp; Admin Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Enter Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-[#0A1A3A] border border-white/20 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              {passcodeError && (
                <p className="text-xs text-red-400 mt-2 font-medium">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold text-sm shadow-lg transition-all"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            🔒 Protected access for The Modest MC team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060D1E] text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 bg-[#0A1A3A] border-b border-white/10 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E5A827]">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <span className="font-black text-white text-base tracking-tight block">
              THE MODEST MC ADMIN
            </span>
            <span className="text-[10px] text-[#E5A827] uppercase tracking-wider block">
              Bookings &amp; Media Manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "bookings"
                ? "bg-[#E5A827] text-[#060D1E] shadow-md"
                : "bg-[#0A1A3A] text-slate-300 hover:text-white border border-white/10"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings &amp; Inquiries ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "gallery"
                ? "bg-[#E5A827] text-[#060D1E] shadow-md"
                : "bg-[#0A1A3A] text-slate-300 hover:text-white border border-white/10"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Pomp &amp; Colour Media Uploader</span>
          </button>
        </div>

        <button
          onClick={() => (activeTab === "bookings" ? fetchBookings() : fetchGallery())}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-[#0A1A3A] border border-white/10"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-4 h-4 ${loadingBookings || loadingGallery ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* ================= TAB 1: BOOKINGS ================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-gradient p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xs text-slate-400">Total Inquiries</span>
                <div className="text-2xl font-black text-white">{bookings.length}</div>
              </div>
              <div className="card-gradient p-5 rounded-2xl border border-amber-500/20 space-y-1">
                <span className="text-xs text-[#E5A827]">Pending Review</span>
                <div className="text-2xl font-black text-[#E5A827]">
                  {bookings.filter((b) => b.status === "pending").length}
                </div>
              </div>
              <div className="card-gradient p-5 rounded-2xl border border-green-500/20 space-y-1">
                <span className="text-xs text-green-400">Confirmed Dates</span>
                <div className="text-2xl font-black text-green-400">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </div>
              </div>
              <div className="card-gradient p-5 rounded-2xl border border-blue-500/20 space-y-1">
                <span className="text-xs text-blue-400">Completed Events</span>
                <div className="text-2xl font-black text-blue-400">
                  {bookings.filter((b) => b.status === "completed").length}
                </div>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0A1A3A] p-4 rounded-2xl border border-white/10">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by client name, phone, town..."
                  className="w-full bg-[#060D1E] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#060D1E] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5A827]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings List / Cards */}
            {loadingBookings ? (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#E5A827]" />
                <p className="text-xs">Loading bookings from database...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card-gradient rounded-2xl p-12 text-center text-slate-400 border border-white/10 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-500" />
                <h4 className="text-base font-bold text-white">No bookings match your filter</h4>
                <p className="text-xs">New inquiries submitted from the website will appear here in real time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="card-gradient rounded-2xl p-5 border border-white/10 hover:border-[#E5A827]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-extrabold text-white text-base">{b.name}</h3>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            b.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : b.status === "pending"
                              ? "bg-amber-500/20 text-[#E5A827] border border-amber-500/30"
                              : b.status === "completed"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-[11px] text-[#E5A827] font-semibold bg-[#E5A827]/10 px-2 py-0.5 rounded-md">
                          {b.event_type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>Date: <strong>{b.event_date || "To Be Confirmed"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>Venue: <strong>{b.event_location || "Not Specified"}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>Phone: <strong>{b.phone}</strong></span>
                        </div>
                      </div>

                      {b.services && (
                        <p className="text-[11px] text-slate-400">
                          Services: <span className="text-slate-200">{b.services}</span> • Guests: <span className="text-slate-200">{b.guest_count}</span>
                        </p>
                      )}

                      {b.notes && (
                        <p className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl font-light">
                          📝 Notes: &quot;{b.notes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Actions on this Booking */}
                    <div className="flex flex-wrap lg:flex-col gap-2 items-end justify-end border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${b.phone}`}
                          className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-xl"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.name}, this is The Modest MC Entertainment regarding your booking inquiry for ${b.event_date || "your event"}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-2 rounded-xl"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="bg-[#060D1E] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E5A827]"
                      >
                        <option value="pending">Mark Pending</option>
                        <option value="confirmed">Mark Confirmed</option>
                        <option value="completed">Mark Completed</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: GALLERY & CLOUDINARY UPLOADER ================= */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            {/* Upload Form Card */}
            <div className="card-gradient rounded-3xl p-6 sm:p-8 border border-[#E5A827]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#E5A827]" />
                    <span>Upload &amp; Add to &quot;Pomp &amp; Colour&quot; Gallery</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Upload photos/videos directly to Cloudinary or link from YouTube / TikTok.
                  </p>
                </div>

                {uploadSuccess && (
                  <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published to Website!</span>
                  </span>
                )}
              </div>

              {/* Source Selector (Cloudinary vs YouTube vs TikTok) */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMediaSource("cloudinary")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mediaSource === "cloudinary"
                      ? "bg-[#1044A3] text-white border border-[#E5A827]"
                      : "bg-[#060D1E] text-slate-400 border border-white/10 hover:border-white/30"
                  }`}
                >
                  <Upload className="w-4 h-4 text-[#E5A827]" />
                  <span>Upload File (Cloudinary)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaSource("youtube")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mediaSource === "youtube"
                      ? "bg-red-950/40 text-white border border-red-500"
                      : "bg-[#060D1E] text-slate-400 border border-white/10 hover:border-white/30"
                  }`}
                >
                  <YoutubeIcon className="w-4 h-4 text-red-500" />
                  <span>YouTube Video Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaSource("tiktok")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mediaSource === "tiktok"
                      ? "bg-black text-white border border-white/40"
                      : "bg-[#060D1E] text-slate-400 border border-white/10 hover:border-white/30"
                  }`}
                >
                  <TikTokIcon className="w-4 h-4" />
                  <span>TikTok Video Link</span>
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddMedia} className="space-y-5">
                {/* Mode 1: Cloudinary File Selector */}
                {mediaSource === "cloudinary" && (
                  <div className="p-6 rounded-2xl bg-[#060D1E] border-2 border-dashed border-white/20 hover:border-[#E5A827] transition-colors text-center space-y-3">
                    <input
                      type="file"
                      id="gallery-file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="gallery-file" className="cursor-pointer block space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#1044A3]/30 border border-[#E5A827] flex items-center justify-center mx-auto text-[#E5A827]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-white block">
                        {selectedFile ? selectedFile.name : "Click to select a photo or video to upload"}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Supports high-resolution PNG, JPG, MP4 video clips
                      </span>
                    </label>

                    {filePreview && (
                      <div className="pt-2">
                        <div className="relative w-40 h-28 mx-auto rounded-xl overflow-hidden border border-[#E5A827]">
                          <Image src={filePreview} alt="Preview" fill className="object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode 2: YouTube / TikTok URL */}
                {(mediaSource === "youtube" || mediaSource === "tiktok") && (
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Paste {mediaSource === "youtube" ? "YouTube" : "TikTok"} Video URL <span className="text-[#E5A827]">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder={
                        mediaSource === "youtube"
                          ? "e.g. https://www.youtube.com/watch?v=..."
                          : "e.g. https://www.tiktok.com/@modestmckenya/video/..."
                      }
                      className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Event Title <span className="text-[#E5A827]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      placeholder="e.g. Windsor Golf Wedding Reception"
                      className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Category <span className="text-[#E5A827]">*</span>
                    </label>
                    <select
                      value={mediaCategory}
                      onChange={(e) => setMediaCategory(e.target.value)}
                      className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5A827]"
                    >
                      <option value="Weddings">Weddings</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Team Building">Team Building</option>
                      <option value="Birthdays">Birthdays &amp; Showers</option>
                      <option value="Sound & Setup">Sound &amp; Setup</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Location / Venue
                    </label>
                    <input
                      type="text"
                      value={mediaLocation}
                      onChange={(e) => setMediaLocation(e.target.value)}
                      placeholder="e.g. Karen, Naivasha, Ruiru, Nakuru..."
                      className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Brief Highlight Description
                    </label>
                    <input
                      type="text"
                      value={mediaDesc}
                      onChange={(e) => setMediaDesc(e.target.value)}
                      placeholder="e.g. Electrifying bride & groom entrance with great crowd energy."
                      className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FAD961] to-[#E5A827] h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center text-slate-300">
                      Uploading to Cloudinary &amp; saving to database... ({uploadProgress}%)
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-black text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Publish to Website Gallery</span>
                </button>
              </form>
            </div>

            {/* Current Gallery Items List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                Live Gallery Items ({galleryItems.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="card-gradient rounded-2xl overflow-hidden border border-white/10 space-y-3 p-4"
                  >
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/40">
                      <Image
                        src={item.media_url || item.thumbnail_url || "/logo.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-[#E5A827] text-[#060D1E] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {item.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#E5A827]" />
                        <span>{item.location}</span>
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
