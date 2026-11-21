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
  Users,
  Edit,
  X,
  Link as LinkIcon,
  Globe,
  SlidersHorizontal,
  ArrowUpDown,
  UserCheck,
  UserX,
  FileText,
  AlertCircle,
  CheckSquare,
  Square,
  Copy,
  Table as TableIcon,
  LayoutGrid,
  Shield,
  Info,
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
  uploaded_by?: string;
  created_at: string;
}

interface CrewMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo_url: string;
  specialties?: string;
  experience_years?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

interface StagedLocalFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  category: string;
  location: string;
  desc: string;
  isVideo: boolean;
  selected: boolean;
}

interface ExtractedCandidate {
  id: string;
  url: string;
  previewUrl: string;
  type: "photo" | "video" | "youtube" | "tiktok";
  title: string;
  selected: boolean;
  category: string;
  location: string;
  description: string;
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

function getYouTubeId(url?: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [userRole, setUserRole] = useState<"admin" | "crew">("admin");
  const [crewMemberName, setCrewMemberName] = useState("");

  const [activeTab, setActiveTab] = useState<"bookings" | "gallery" | "crew">("bookings");

  // ================= BOOKINGS STATE ================= //
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [datePreset, setDatePreset] = useState<"all" | "upcoming" | "this_month" | "next_month" | "past" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [sortBy, setSortBy] = useState<
    "date_asc" | "date_desc" | "status_pending" | "status_confirmed" | "status_cancelled" | "created_desc" | "created_asc"
  >("date_asc");
  const [bookingViewMode, setBookingViewMode] = useState<"table" | "cards">("table");
  const [deletingBookingId, setDeletingBookingId] = useState<number | null>(null);

  // ================= GALLERY STATE ================= //
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("all");
  const [galleryTypeFilter, setGalleryTypeFilter] = useState<"all" | "photos" | "videos">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Upload Modes: Local Multi-Upload vs Link Extractor vs Social Link
  const [uploadMode, setUploadMode] = useState<"local" | "link" | "social">("local");

  // 1. Local Multi-File Upload State
  const [stagedFiles, setStagedFiles] = useState<StagedLocalFile[]>([]);
  const [batchCategory, setBatchCategory] = useState("Weddings");
  const [batchLocation, setBatchLocation] = useState("");
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [batchSuccessNotice, setBatchSuccessNotice] = useState("");
  const [batchErrorNotice, setBatchErrorNotice] = useState("");

  // 2. Link Media Extractor State
  const [linkInput, setLinkInput] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedCandidates, setExtractedCandidates] = useState<ExtractedCandidate[]>([]);
  const [extractError, setExtractError] = useState("");
  const [linkDefaultCategory, setLinkDefaultCategory] = useState("Weddings");
  const [linkDefaultLocation, setLinkDefaultLocation] = useState("");
  const [isImportingLinkItems, setIsImportingLinkItems] = useState(false);
  const [importNotice, setImportNotice] = useState("");

  // 3. Single Social Link State
  const [socialUrl, setSocialUrl] = useState("");
  const [socialTitle, setSocialTitle] = useState("");
  const [socialCategory, setSocialCategory] = useState("Weddings");
  const [socialLocation, setSocialLocation] = useState("");
  const [socialDesc, setSocialDesc] = useState("");
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);

  // ================= CREW STATE ================= //
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [loadingCrew, setLoadingCrew] = useState(false);
  const [crewForm, setCrewForm] = useState<{
    id?: number;
    name: string;
    role: string;
    bio: string;
    photoUrl: string;
    specialties: string;
    experienceYears: string;
    displayOrder: number;
    isActive: boolean;
  }>({
    name: "",
    role: "",
    bio: "",
    photoUrl: "",
    specialties: "",
    experienceYears: "5+ Years",
    displayOrder: 1,
    isActive: true,
  });
  const [isEditingCrew, setIsEditingCrew] = useState(false);
  const [crewSelectedFile, setCrewSelectedFile] = useState<File | null>(null);
  const [crewFilePreview, setCrewFilePreview] = useState<string | null>(null);
  const [isSavingCrew, setIsSavingCrew] = useState(false);
  const [crewNotice, setCrewNotice] = useState("");
  const [deletingCrewId, setDeletingCrewId] = useState<number | null>(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Check existing session
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("modest_admin_auth");
    const savedRole = (sessionStorage.getItem("modest_user_role") as "admin" | "crew") || "admin";
    const savedCrewName = sessionStorage.getItem("modest_crew_name") || "";
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setCrewMemberName(savedCrewName);
    }
  }, []);

  // Fetch data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchGallery();
      if (userRole === "admin") {
        fetchCrew();
      }
    }
  }, [isAuthenticated, userRole]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === "modest2026" || cleanPass === "pompandcolour") {
      setIsAuthenticated(true);
      setUserRole("admin");
      sessionStorage.setItem("modest_admin_auth", "true");
      sessionStorage.setItem("modest_user_role", "admin");
      sessionStorage.setItem("modest_crew_name", crewMemberName.trim() || "Admin");
      setPasscodeError("");
    } else if (cleanPass === "crew2026" || cleanPass === "modestcrew" || cleanPass === "themodestcrew") {
      setIsAuthenticated(true);
      setUserRole("crew");
      sessionStorage.setItem("modest_admin_auth", "true");
      sessionStorage.setItem("modest_user_role", "crew");
      sessionStorage.setItem("modest_crew_name", crewMemberName.trim() || "Crew Member");
      setActiveTab("bookings");
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect passcode. Enter Admin (e.g. modest2026) or Crew passcode (e.g. crew2026).");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("modest_admin_auth");
    sessionStorage.removeItem("modest_user_role");
    sessionStorage.removeItem("modest_crew_name");
  };

  // ================= DATA FETCHERS ================= //
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

  const fetchCrew = async () => {
    setLoadingCrew(true);
    try {
      const res = await fetch("/api/crew?all=true");
      const data = await res.json();
      if (data.crew) {
        setCrewMembers(data.crew);
      }
    } catch (err) {
      console.error("Error fetching crew:", err);
    } finally {
      setLoadingCrew(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (userRole !== "admin") return;
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

  const handleDeleteBooking = async (id: number, clientName: string) => {
    if (userRole !== "admin") return;
    const confirmed = window.confirm(
      `Are you sure you want to delete the booking for "${clientName}" (ID #${id})? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingBookingId(id);
    try {
      const res = await fetch(`/api/booking?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to delete booking: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Network error while deleting booking.");
    } finally {
      setDeletingBookingId(null);
    }
  };

  // ================= GALLERY ACTIONS ================= //
  const handleDeleteMedia = async (item: GalleryItem) => {
    // If crew, verify 30-minute window
    if (userRole === "crew") {
      const itemTime = item.created_at ? new Date(item.created_at).getTime() : 0;
      const diffMinutes = (Date.now() - itemTime) / (1000 * 60);
      if (diffMinutes > 30) {
        alert(
          "⚠️ Deletion window expired (uploads can only be deleted directly within 30 minutes by crew).\n\nPlease click 'Request Admin to Delete'."
        );
        return;
      }
    }

    const confirmed = window.confirm(
      `Delete "${item.title}" (${item.category}) from the website gallery? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    try {
      const res = await fetch(
        `/api/gallery?id=${item.id}&role=${userRole}&crewName=${encodeURIComponent(
          crewMemberName || "Crew"
        )}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((g) => g.id !== item.id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to delete item: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      alert("Network error while deleting file. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestAdminDelete = (item: GalleryItem) => {
    const adminPhone = "254745558377";
    const sender = crewMemberName || "Crew Team Member";
    const itemDate = item.created_at
      ? new Date(item.created_at).toLocaleString()
      : "recently";
    const msg = `Hello Admin Macvollan, I am requesting deletion of gallery media item #${item.id} ("${item.title}", Category: ${item.category}) uploaded at ${itemDate}. Submitted by ${sender}.`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(msg);
    }

    const proceed = window.confirm(
      `A deletion request has been copied to your clipboard:\n\n"${msg}"\n\nClick OK to open WhatsApp and message Admin Macvollan directly (+254 745 558 377).`
    );
    if (proceed) {
      window.open(
        `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    }
  };

  // 1. Local Multi-Upload Handlers
  const handleLocalFilesPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files);

    const newStaged: StagedLocalFile[] = filesArray.map((file) => {
      const isVid = file.type.startsWith("video/");
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();
      const capitalized =
        cleanName.length > 2
          ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
          : "Event Highlight";

      return {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        preview: URL.createObjectURL(file),
        title: capitalized,
        category: batchCategory || "Weddings",
        location: batchLocation || "",
        desc: "",
        isVideo: isVid,
        selected: true,
      };
    });

    setStagedFiles((prev) => [...prev, ...newStaged]);
    e.target.value = "";
    setBatchSuccessNotice("");
    setBatchErrorNotice("");
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const applyBatchMetaToAll = () => {
    setStagedFiles((prev) =>
      prev.map((f) => ({
        ...f,
        category: batchCategory,
        location: batchLocation || f.location,
      }))
    );
  };

  const uploadStagedFilesToCloudinary = async () => {
    const selected = stagedFiles.filter((f) => f.selected);
    if (selected.length === 0) {
      alert("Please select at least one file from the list to upload.");
      return;
    }

    setIsUploadingBatch(true);
    setBatchSuccessNotice("");
    setBatchErrorNotice("");
    setBatchProgress({ current: 0, total: selected.length, percent: 0 });

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ixd00ban";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "modestmc";

    let successCount = 0;
    let failedCount = 0;
    const newlyCreatedItems: GalleryItem[] = [];
    const remainingStaged: StagedLocalFile[] = [...stagedFiles];

    for (let i = 0; i < selected.length; i++) {
      const fileItem = selected[i];
      try {
        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("upload_preset", uploadPreset);

        const endpoint = fileItem.isVideo
          ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
          : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const cloudRes = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!cloudRes.ok) {
          throw new Error(`Cloudinary upload failed: ${cloudRes.statusText}`);
        }

        const cloudData = await cloudRes.json();
        const secureUrl = cloudData.secure_url;

        // Save to Database
        const dbRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: fileItem.title.trim() || "Event Highlight",
            category: fileItem.category,
            mediaType: fileItem.isVideo ? "video" : "photo",
            mediaUrl: secureUrl,
            thumbnailUrl: fileItem.isVideo ? undefined : secureUrl,
            location: fileItem.location.trim(),
            description: fileItem.desc.trim(),
            uploadedBy: userRole === "admin" ? "Admin" : (crewMemberName || "Crew"),
          }),
        });

        if (!dbRes.ok) {
          throw new Error("Failed to save media metadata to database");
        }

        const dbData = await dbRes.json();
        if (dbData.item) {
          newlyCreatedItems.push(dbData.item);
        }

        successCount++;
        // Remove from staging queue
        const rmIdx = remainingStaged.findIndex((s) => s.id === fileItem.id);
        if (rmIdx !== -1) {
          URL.revokeObjectURL(remainingStaged[rmIdx].preview);
          remainingStaged.splice(rmIdx, 1);
        }
      } catch (err: any) {
        console.error(`Error uploading ${fileItem.file.name}:`, err);
        failedCount++;
      } finally {
        const currentDone = i + 1;
        setBatchProgress({
          current: currentDone,
          total: selected.length,
          percent: Math.round((currentDone / selected.length) * 100),
        });
      }
    }

    setStagedFiles(remainingStaged);
    if (newlyCreatedItems.length > 0) {
      setGalleryItems((prev) => [...newlyCreatedItems, ...prev]);
    }

    setIsUploadingBatch(false);
    if (successCount > 0 && failedCount === 0) {
      setBatchSuccessNotice(`🎉 Successfully uploaded all ${successCount} media files!`);
    } else if (successCount > 0 && failedCount > 0) {
      setBatchSuccessNotice(`Uploaded ${successCount} files. (${failedCount} files failed).`);
    } else if (failedCount > 0) {
      setBatchErrorNotice(`Failed to upload ${failedCount} files. Please check internet connection.`);
    }
  };

  // 2. Link Media Extractor Handlers
  const handleExtractFromLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;

    setIsExtracting(true);
    setExtractError("");
    setImportNotice("");
    setExtractedCandidates([]);

    try {
      const res = await fetch("/api/media-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setExtractError(data.error || "Could not extract media from that link.");
        return;
      }

      if (!data.media || data.media.length === 0) {
        setExtractError("No photos or videos could be automatically found at this link.");
        return;
      }

      const formatted: ExtractedCandidate[] = data.media.map((m: any, idx: number) => ({
        id: `${m.id || idx}-${Date.now()}`,
        url: m.url,
        previewUrl: m.previewUrl || m.url,
        type: m.type || "photo",
        title: m.title || "Event Highlight",
        selected: true,
        category: linkDefaultCategory,
        location: linkDefaultLocation,
        description: "",
      }));

      setExtractedCandidates(formatted);
    } catch (err: any) {
      console.error("Link extract error:", err);
      setExtractError("Network error while scanning link. Please verify URL.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImportSelectedLinkMedia = async () => {
    const selected = extractedCandidates.filter((c) => c.selected);
    if (selected.length === 0) {
      alert("Please select at least one media item to import.");
      return;
    }

    setIsImportingLinkItems(true);
    setImportNotice("");

    let successCount = 0;
    const importedItems: GalleryItem[] = [];

    for (const candidate of selected) {
      try {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: candidate.title.trim() || "Event Highlight",
            category: candidate.category || linkDefaultCategory,
            mediaType: candidate.type === "photo" ? "photo" : "video",
            mediaUrl: candidate.url,
            thumbnailUrl: candidate.previewUrl,
            location: candidate.location.trim() || linkDefaultLocation.trim(),
            description: candidate.description.trim(),
            uploadedBy: userRole === "admin" ? "Admin" : (crewMemberName || "Crew"),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.item) {
            importedItems.push(data.item);
            successCount++;
          }
        }
      } catch (err) {
        console.error("Error importing extracted media:", err);
      }
    }

    if (importedItems.length > 0) {
      setGalleryItems((prev) => [...importedItems, ...prev]);
    }

    setIsImportingLinkItems(false);
    setImportNotice(`🎉 Successfully imported ${successCount} items into your gallery!`);
    setExtractedCandidates([]);
    setLinkInput("");
  };

  // 3. Single Social Link Handler
  const handleSaveSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialUrl.trim() || !socialTitle.trim()) {
      alert("Please enter both a title and a video link.");
      return;
    }

    setIsSubmittingSocial(true);
    try {
      const ytId = getYouTubeId(socialUrl.trim());
      const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined;

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: socialTitle.trim(),
          category: socialCategory,
          mediaType: "video",
          mediaUrl: socialUrl.trim(),
          thumbnailUrl: thumb,
          location: socialLocation.trim(),
          description: socialDesc.trim(),
          uploadedBy: userRole === "admin" ? "Admin" : (crewMemberName || "Crew"),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setGalleryItems((prev) => [data.item, ...prev]);
        }
        setSocialUrl("");
        setSocialTitle("");
        setSocialLocation("");
        setSocialDesc("");
        alert("Video link saved to gallery!");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`Failed to save: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error saving social link:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmittingSocial(false);
    }
  };

  // ================= CREW MANAGEMENT HANDLERS (ADMIN ONLY) ================= //
  const handleCrewFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setCrewSelectedFile(file);
    setCrewFilePreview(URL.createObjectURL(file));
  };

  const handleGenerateBioWithAI = async () => {
    if (!crewForm.name.trim() || !crewForm.role.trim()) {
      alert("Please enter the crew member's Full Name and Role first so AI can tailor their biography.");
      return;
    }

    setIsGeneratingBio(true);
    try {
      const res = await fetch("/api/ai/crew-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: crewForm.name.trim(),
          role: crewForm.role.trim(),
          experienceYears: crewForm.experienceYears.trim(),
          specialties: crewForm.specialties.trim(),
        }),
      });

      const data = await res.json();
      if (data?.bio) {
        setCrewForm((prev) => ({ ...prev, bio: data.bio }));
        setCrewNotice("✨ AI generated an authentic Kenyan event biography! Feel free to review or tweak.");
      } else {
        alert("Could not generate bio at this time. Please try again.");
      }
    } catch (err) {
      console.error("AI bio generation error:", err);
      alert("Network error generating bio. Please try again.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSaveCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewForm.name.trim() || !crewForm.role.trim()) {
      alert("Please enter the crew member's name and role.");
      return;
    }

    setIsSavingCrew(true);
    setCrewNotice("");

    try {
      let finalPhotoUrl = (crewForm.photoUrl || "").trim();

      // If a local image file was picked, upload it to Cloudinary
      if (crewSelectedFile) {
        try {
          const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ixd00ban";
          const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "modestmc";

          const formData = new FormData();
          formData.append("file", crewSelectedFile);
          formData.append("upload_preset", uploadPreset);

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
          );

          if (cloudRes.ok) {
            const cloudData = await cloudRes.json();
            if (cloudData?.secure_url) {
              finalPhotoUrl = cloudData.secure_url;
            }
          }
        } catch (uploadErr) {
          console.warn("Cloudinary photo upload had a hiccup, falling back gracefully:", uploadErr);
        }
      }

      if (!finalPhotoUrl) {
        finalPhotoUrl = "/logo.jpg";
      }

      if (isEditingCrew && crewForm.id) {
        // PATCH
        const res = await fetch("/api/crew", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: crewForm.id,
            name: crewForm.name.trim(),
            role: crewForm.role.trim(),
            bio: crewForm.bio.trim(),
            photoUrl: finalPhotoUrl,
            specialties: crewForm.specialties.trim(),
            experienceYears: crewForm.experienceYears.trim(),
            displayOrder: Number(crewForm.displayOrder) || 1,
            isActive: Boolean(crewForm.isActive),
          }),
        });

        if (!res.ok) throw new Error("Failed to update crew member");
        const data = await res.json();
        setCrewMembers((prev) =>
          prev.map((c) => (c.id === crewForm.id ? data.member : c))
        );
        setCrewNotice(`✅ Updated ${crewForm.name}'s profile successfully.`);
      } else {
        // POST
        const res = await fetch("/api/crew", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: crewForm.name.trim(),
            role: crewForm.role.trim(),
            bio: crewForm.bio.trim(),
            photoUrl: finalPhotoUrl,
            specialties: crewForm.specialties.trim(),
            experienceYears: crewForm.experienceYears.trim(),
            displayOrder: Number(crewForm.displayOrder) || 1,
            isActive: Boolean(crewForm.isActive),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create crew member");
        }
        const data = await res.json();
        if (data?.member) {
          setCrewMembers((prev) => [...prev.filter((c) => c.id !== data.member.id), data.member]);
          setCrewNotice(`✅ Added ${crewForm.name} to the crew roster!`);
        }
      }

      resetCrewForm();
      fetchCrew();
    } catch (err: any) {
      console.error("Error saving crew member:", err);
      alert(`Error: ${err.message || "Failed to save crew member"}`);
    } finally {
      setIsSavingCrew(false);
    }
  };

  const startEditCrew = (member: CrewMember) => {
    setIsEditingCrew(true);
    setCrewForm({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      photoUrl: member.photo_url,
      specialties: member.specialties || "",
      experienceYears: member.experience_years || "5+ Years",
      displayOrder: member.display_order || 1,
      isActive: member.is_active ?? true,
    });
    setCrewFilePreview(member.photo_url);
    setCrewSelectedFile(null);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const resetCrewForm = () => {
    setIsEditingCrew(false);
    setCrewForm({
      name: "",
      role: "",
      bio: "",
      photoUrl: "",
      specialties: "",
      experienceYears: "5+ Years",
      displayOrder: 1,
      isActive: true,
    });
    if (crewFilePreview && !crewFilePreview.startsWith("http")) {
      URL.revokeObjectURL(crewFilePreview);
    }
    setCrewFilePreview(null);
    setCrewSelectedFile(null);
  };

  const handleDeleteCrew = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Delete "${name}" from the crew roster? They will no longer appear on the website.`
    );
    if (!confirmed) return;

    // Optimistically remove from view immediately
    setDeletingCrewId(id);
    setCrewMembers((prev) => prev.filter((c) => c.id !== id));
    if (isEditingCrew && crewForm.id === id) {
      resetCrewForm();
    }

    try {
      const res = await fetch(`/api/crew?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to delete: ${errData.error || "Unknown error"}`);
        fetchCrew();
      }
    } catch (err) {
      console.error("Error deleting crew member:", err);
      alert("Network error.");
      fetchCrew();
    } finally {
      setDeletingCrewId(null);
    }
  };

  const handleToggleCrewActive = async (member: CrewMember) => {
    try {
      const nextActive = !member.is_active;
      const res = await fetch("/api/crew", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, isActive: nextActive }),
      });
      if (res.ok) {
        setCrewMembers((prev) =>
          prev.map((c) => (c.id === member.id ? { ...c, is_active: nextActive } : c))
        );
      }
    } catch (err) {
      console.error("Toggle crew active error:", err);
    }
  };

  // ================= ADVANCED FILTERING & SORTING LOGIC ================= //
  const filteredBookings = bookings
    .filter((b) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (b.name || "").toLowerCase().includes(q);
        const matchesPhone = (b.phone || "").toLowerCase().includes(q);
        const matchesLocation = (b.event_location || "").toLowerCase().includes(q);
        const matchesNotes = (b.notes || "").toLowerCase().includes(q);
        const matchesServices = (b.services || "").toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesLocation && !matchesNotes && !matchesServices) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "all" && b.status !== statusFilter) {
        return false;
      }

      // 3. Event Type Filter
      if (eventTypeFilter !== "all" && (b.event_type || "").toLowerCase() !== eventTypeFilter.toLowerCase()) {
        return false;
      }

      // 4. Date Presets & Custom Range
      if (datePreset !== "all" && b.event_date) {
        const evDate = new Date(b.event_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (datePreset === "upcoming") {
          if (evDate < today) return false;
        } else if (datePreset === "past") {
          if (evDate >= today) return false;
        } else if (datePreset === "this_month") {
          if (
            evDate.getFullYear() !== today.getFullYear() ||
            evDate.getMonth() !== today.getMonth()
          ) {
            return false;
          }
        } else if (datePreset === "next_month") {
          const nextMonth = (today.getMonth() + 1) % 12;
          const nextYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
          if (evDate.getFullYear() !== nextYear || evDate.getMonth() !== nextMonth) {
            return false;
          }
        } else if (datePreset === "custom") {
          if (customStartDate) {
            const start = new Date(customStartDate);
            if (evDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (evDate > end) return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date_asc") {
        const dateA = a.event_date ? new Date(a.event_date).getTime() : Infinity;
        const dateB = b.event_date ? new Date(b.event_date).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === "date_desc") {
        const dateA = a.event_date ? new Date(a.event_date).getTime() : -Infinity;
        const dateB = b.event_date ? new Date(b.event_date).getTime() : -Infinity;
        return dateB - dateA;
      }
      if (sortBy === "status_pending") {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return 0;
      }
      if (sortBy === "status_confirmed") {
        if (a.status === "confirmed" && b.status !== "confirmed") return -1;
        if (b.status === "confirmed" && a.status !== "confirmed") return 1;
        return 0;
      }
      if (sortBy === "status_cancelled") {
        if (a.status === "cancelled" && b.status !== "cancelled") return -1;
        if (b.status === "cancelled" && a.status !== "cancelled") return 1;
        return 0;
      }
      if (sortBy === "created_desc") {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === "created_asc") {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeA - timeB;
      }
      return 0;
    });

  // Calculate concurrent events count per date to warn about rig/crew allocation
  const dateCounts = bookings.reduce((acc, b) => {
    if (b.event_date && b.status !== "cancelled") {
      acc[b.event_date] = (acc[b.event_date] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // ================= LOGIN SCREEN ================= //
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
                Enter Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admin or Crew passcode..."
                  className="w-full bg-[#0A1A3A] border border-white/20 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              {passcodeError && (
                <p className="text-xs text-red-400 mt-2 font-medium">{passcodeError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Your Name / Crew Member Identity <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={crewMemberName}
                  onChange={(e) => setCrewMemberName(e.target.value)}
                  placeholder="e.g. DJ Steve, Faith Wanjiku, Brian..."
                  className="w-full bg-[#0A1A3A] border border-white/20 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold text-sm shadow-lg transition-all cursor-pointer"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="text-[11px] text-slate-400 space-y-1 bg-[#0A1A3A]/60 p-3 rounded-xl border border-white/10 text-left">
            <p className="font-semibold text-slate-300">🔑 Portal Access Rules:</p>
            <p>• <strong>Admin Passcode:</strong> Full superadmin access to bookings, crew roster, and media.</p>
            <p>• <strong>Crew Passcode:</strong> Read-only bookings roster view and media uploader (30-min delete window).</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060D1E] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0A1A3A] border-b border-white/10 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E5A827]">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight block">
                THE MODEST MC PORTAL
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  userRole === "admin"
                    ? "bg-[#E5A827]/20 text-[#E5A827] border border-[#E5A827]/40"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                }`}
              >
                {userRole === "admin" ? "🛡️ Administrator" : `👥 Crew: ${crewMemberName || "Staff"}`}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {userRole === "admin"
                ? "Full Dashboard • Bookings, Media & Crew Manager"
                : "Staff View • Event Bookings & Media Uploader"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#E5A827] px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#E5A827]/30 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 pb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "bg-[#E5A827] text-[#060D1E] shadow-md"
                : "bg-[#0A1A3A] text-slate-300 hover:text-white border border-white/10"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {userRole === "admin" ? `Bookings & Inquiries (${bookings.length})` : `Event Bookings (${bookings.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#E5A827] text-[#060D1E] shadow-md"
                : "bg-[#0A1A3A] text-slate-300 hover:text-white border border-white/10"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Media Uploader &amp; Gallery</span>
          </button>

          {userRole === "admin" && (
            <button
              type="button"
              onClick={() => setActiveTab("crew")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "crew"
                  ? "bg-[#E5A827] text-[#060D1E] shadow-md"
                  : "bg-[#0A1A3A] text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Meet The Crew ({crewMembers.length})</span>
            </button>
          )}
        </div>

        <button
          onClick={() => {
            if (activeTab === "bookings") fetchBookings();
            if (activeTab === "gallery") fetchGallery();
            if (activeTab === "crew") fetchCrew();
          }}
          className="p-2 text-slate-400 hover:text-white rounded-lg bg-[#0A1A3A] border border-white/10 cursor-pointer"
          title="Refresh Current Tab"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              loadingBookings || loadingGallery || loadingCrew ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {/* ================= TAB 1: ADVANCED BOOKINGS & FILTERS ================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Notice for Crew */}
            {userRole === "crew" && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
                <div className="flex items-center gap-2.5">
                  <Info className="w-5 h-5 text-[#E5A827] shrink-0" />
                  <span>
                    <strong>Crew View (Read-Only)</strong>: Review upcoming event dates, locations, guest counts, and audio requirements to prepare your gear and schedule. Status changes and cancellations are reserved for Admin.
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-[#E5A827] border border-amber-500/40 shrink-0 self-start sm:self-auto">
                  View-Only Mode
                </span>
              </div>
            )}

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setStatusFilter("all")}
                className={`card-gradient p-5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  statusFilter === "all" ? "border-[#E5A827] ring-1 ring-[#E5A827]" : "border-white/10"
                }`}
              >
                <span className="text-xs text-slate-400">Total Inquiries</span>
                <div className="text-2xl font-black text-white">{bookings.length}</div>
              </div>

              <div
                onClick={() => setStatusFilter("pending")}
                className={`card-gradient p-5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  statusFilter === "pending" ? "border-[#E5A827] ring-1 ring-[#E5A827]" : "border-amber-500/30"
                }`}
              >
                <span className="text-xs text-[#E5A827]">Pending Review</span>
                <div className="text-2xl font-black text-[#E5A827]">
                  {bookings.filter((b) => b.status === "pending").length}
                </div>
              </div>

              <div
                onClick={() => setStatusFilter("confirmed")}
                className={`card-gradient p-5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  statusFilter === "confirmed" ? "border-green-400 ring-1 ring-green-400" : "border-green-500/30"
                }`}
              >
                <span className="text-xs text-green-400">Confirmed / Approved</span>
                <div className="text-2xl font-black text-green-400">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </div>
              </div>

              <div
                onClick={() => setStatusFilter("cancelled")}
                className={`card-gradient p-5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                  statusFilter === "cancelled" ? "border-red-400 ring-1 ring-red-400" : "border-red-500/30"
                }`}
              >
                <span className="text-xs text-red-400">Cancelled Gigs</span>
                <div className="text-2xl font-black text-red-400">
                  {bookings.filter((b) => b.status === "cancelled").length}
                </div>
              </div>
            </div>

            {/* Advanced Filters & Sorting Control Panel */}
            <div className="card-gradient p-5 rounded-3xl border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search client, phone, venue, notes..."
                    className="w-full bg-[#060D1E] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>

                {/* Event Type & Sort Selectors */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Event Type Filter */}
                  <div className="flex items-center gap-1.5 bg-[#060D1E] border border-white/15 rounded-xl px-3 py-2 text-xs">
                    <Filter className="w-3.5 h-3.5 text-[#E5A827]" />
                    <select
                      value={eventTypeFilter}
                      onChange={(e) => setEventTypeFilter(e.target.value)}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#0A1A3A]">All Event Types</option>
                      <option value="Wedding" className="bg-[#0A1A3A]">Weddings</option>
                      <option value="Traditional Wedding (Ruracio / Ngurario)" className="bg-[#0A1A3A]">Traditional / Ruracio</option>
                      <option value="Corporate Event / Gala" className="bg-[#0A1A3A]">Corporate Gala</option>
                      <option value="Corporate Team Building" className="bg-[#0A1A3A]">Team Building Facilitation</option>
                      <option value="Birthday Celebration" className="bg-[#0A1A3A]">Birthday Party</option>
                      <option value="Baby Shower / Bridal Shower" className="bg-[#0A1A3A]">Baby / Bridal Shower</option>
                      <option value="Sound System Rental Only" className="bg-[#0A1A3A]">Sound System Rental &amp; PA</option>
                      <option value="Church / Religious Event" className="bg-[#0A1A3A]">Church / Religious</option>
                      <option value="Other Celebrations" className="bg-[#0A1A3A]">Other Celebrations</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5 bg-[#060D1E] border border-white/15 rounded-xl px-3 py-2 text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#E5A827]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-white focus:outline-none cursor-pointer"
                    >
                      <option value="date_asc" className="bg-[#0A1A3A]">Event Date (Soonest First)</option>
                      <option value="date_desc" className="bg-[#0A1A3A]">Event Date (Latest First)</option>
                      <option value="status_pending" className="bg-[#0A1A3A]">Status: Pending First</option>
                      <option value="status_confirmed" className="bg-[#0A1A3A]">Status: Approved First</option>
                      <option value="status_cancelled" className="bg-[#0A1A3A]">Status: Cancelled First</option>
                      <option value="created_desc" className="bg-[#0A1A3A]">Booking Date (Newest)</option>
                      <option value="created_asc" className="bg-[#0A1A3A]">Booking Date (Oldest)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Presets Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-2">
                  Date Filter:
                </span>
                {(
                  [
                    { id: "all", label: "All Dates" },
                    { id: "upcoming", label: "Upcoming Gigs" },
                    { id: "this_month", label: "This Month" },
                    { id: "next_month", label: "Next Month" },
                    { id: "past", label: "Past Events" },
                    { id: "custom", label: "Custom Range" },
                  ] as const
                ).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setDatePreset(preset.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      datePreset === preset.id
                        ? "bg-[#E5A827] text-[#060D1E] font-bold shadow-sm"
                        : "bg-[#060D1E] text-slate-300 hover:text-white border border-white/10"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}

                {/* Custom Date Pickers */}
                {datePreset === "custom" && (
                  <div className="flex items-center gap-2 bg-[#060D1E] border border-white/15 rounded-xl px-3 py-1 text-xs">
                    <span className="text-slate-400 text-[11px]">From:</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="bg-transparent text-white focus:outline-none text-xs"
                    />
                    <span className="text-slate-400 text-[11px]">To:</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="bg-transparent text-white focus:outline-none text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Results Count & View Mode Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>
                    Showing <strong>{filteredBookings.length}</strong> of {bookings.length} inquiries
                  </span>
                  {(searchQuery || statusFilter !== "all" || eventTypeFilter !== "all" || datePreset !== "all") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setEventTypeFilter("all");
                        setDatePreset("all");
                        setCustomStartDate("");
                        setCustomEndDate("");
                      }}
                      className="text-[#E5A827] hover:underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* View Mode Toggle for Admin */}
                {userRole === "admin" && (
                  <div className="flex items-center gap-1 bg-[#060D1E] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setBookingViewMode("table")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        bookingViewMode === "table"
                          ? "bg-[#E5A827] text-[#060D1E]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Table View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingViewMode("cards")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        bookingViewMode === "cards"
                          ? "bg-[#E5A827] text-[#060D1E]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Cards View</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bookings Content */}
            {loadingBookings ? (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#E5A827]" />
                <p className="text-xs">Loading bookings from database...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card-gradient rounded-3xl p-12 text-center text-slate-400 border border-white/10 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-500" />
                <h4 className="text-base font-bold text-white">No bookings match your current filter</h4>
                <p className="text-xs">Try adjusting your date range or event type filter.</p>
              </div>
            ) : bookingViewMode === "table" || userRole === "crew" ? (
              /* ================= TABULAR FORMAT FOR BOOKINGS ================= */
              <div className="overflow-x-auto rounded-3xl border border-white/10 card-gradient shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#060D1E]/90 text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                      <th className="py-4 px-4">#</th>
                      <th className="py-4 px-4 min-w-[180px]">Client &amp; Contact</th>
                      <th className="py-4 px-4 min-w-[140px]">Event Type</th>
                      <th className="py-4 px-4 min-w-[150px]">Date &amp; Schedule</th>
                      <th className="py-4 px-4 min-w-[140px]">Venue / Location</th>
                      <th className="py-4 px-4 min-w-[180px]">Guests &amp; Services</th>
                      <th className="py-4 px-4 min-w-[130px]">Status</th>
                      {userRole === "admin" && <th className="py-4 px-4 min-w-[80px]">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">#{b.id}</td>

                        {/* Client Name & Phone */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-white text-sm">{b.name}</div>
                          <div className="text-[11px] text-slate-400">{b.phone}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <a
                              href={`tel:${b.phone}`}
                              className="inline-flex items-center gap-1 text-[10px] text-slate-300 hover:text-white bg-white/10 px-2 py-0.5 rounded transition-colors"
                            >
                              <Phone className="w-3 h-3 text-[#E5A827]" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${b.name}, this is The Modest MC Entertainment following up on your ${b.event_type} inquiry for ${b.event_date || "your celebration"} at ${b.event_location || "your venue"}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-green-300 hover:text-white bg-[#25D366]/20 px-2 py-0.5 rounded transition-colors"
                            >
                              <MessageCircle className="w-3 h-3 text-[#25D366]" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>

                        {/* Event Type */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block bg-[#E5A827]/10 text-[#E5A827] border border-[#E5A827]/25 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                            {b.event_type}
                          </span>
                        </td>

                        {/* Date & Schedule */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#E5A827]" />
                            <span>{b.event_date || "TBD"}</span>
                          </div>
                          {b.event_date && (dateCounts[b.event_date] || 0) > 1 && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 mt-1">
                              <Users className="w-3 h-3" />
                              <span>Concurrent ({dateCounts[b.event_date]})</span>
                            </span>
                          )}
                        </td>

                        {/* Venue */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#E5A827]" />
                            <span>{b.event_location || "Not specified"}</span>
                          </div>
                        </td>

                        {/* Guests & Services & Notes */}
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="text-slate-300">
                            <strong>{b.guest_count}</strong> guests • {b.services || "General"}
                          </div>
                          {b.notes && (
                            <div className="text-[11px] text-amber-200/90 bg-amber-950/20 p-1.5 rounded-lg border border-amber-500/20 font-light">
                              📝 &quot;{b.notes}&quot;
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {userRole === "admin" ? (
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              className={`rounded-xl px-2.5 py-1 text-xs font-bold border focus:outline-none cursor-pointer ${
                                b.status === "confirmed"
                                  ? "bg-green-950 text-green-300 border-green-500/40"
                                  : b.status === "pending"
                                  ? "bg-amber-950 text-[#E5A827] border-amber-500/40"
                                  : b.status === "completed"
                                  ? "bg-blue-950 text-blue-300 border-blue-500/40"
                                  : "bg-red-950 text-red-300 border-red-500/40"
                              }`}
                            >
                              <option value="pending" className="bg-[#060D1E] text-white">Pending</option>
                              <option value="confirmed" className="bg-[#060D1E] text-white">Approved / Confirmed</option>
                              <option value="completed" className="bg-[#060D1E] text-white">Completed</option>
                              <option value="cancelled" className="bg-[#060D1E] text-white">Cancelled</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                b.status === "confirmed"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : b.status === "pending"
                                  ? "bg-amber-500/20 text-[#E5A827] border border-amber-500/30"
                                  : b.status === "completed"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {b.status === "confirmed" ? "Approved" : b.status}
                            </span>
                          )}
                        </td>

                        {/* Actions (Admin Only) */}
                        {userRole === "admin" && (
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              disabled={deletingBookingId === b.id}
                              onClick={() => handleDeleteBooking(b.id, b.name)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-600/30 transition-all cursor-pointer disabled:opacity-50"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ================= CARDS VIEW (ADMIN OPTIONAL) ================= */
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="card-gradient rounded-3xl p-5 border border-white/10 hover:border-[#E5A827]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                  >
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-extrabold text-white text-base sm:text-lg">{b.name}</h3>
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
                          {b.status === "confirmed" ? "Approved / Confirmed" : b.status}
                        </span>
                        <span className="text-[11px] text-[#E5A827] font-semibold bg-[#E5A827]/10 px-2.5 py-0.5 rounded-md">
                          {b.event_type}
                        </span>

                        {b.event_date && (dateCounts[b.event_date] || 0) > 1 && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Users className="w-3 h-3 text-purple-400" />
                            <span>
                              Concurrent Gig: {dateCounts[b.event_date]} Events on {b.event_date} (Allocate Rigs &amp; Crew)
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>
                            Event Date: <strong>{b.event_date || "To Be Confirmed"}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>
                            Venue: <strong>{b.event_location || "Not Specified"}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>
                            Contact: <strong>{b.phone}</strong>
                          </span>
                        </div>
                      </div>

                      {b.services && (
                        <p className="text-[11px] text-slate-400">
                          Services: <span className="text-slate-200">{b.services}</span> • Guests:{" "}
                          <span className="text-slate-200">{b.guest_count}</span>
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
                          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#E5A827]" />
                          <span>Call</span>
                        </a>

                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${b.name}, this is The Modest MC Entertainment following up on your ${b.event_type} inquiry for ${b.event_date || "your celebration"} at ${b.event_location || "your venue"}. We are ready to bring Pomp & Colour to your event!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Status:</span>
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="bg-[#060D1E] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E5A827]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Approved / Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          type="button"
                          disabled={deletingBookingId === b.id}
                          onClick={() => handleDeleteBooking(b.id, b.name)}
                          className="p-2 rounded-xl text-red-400 hover:text-white hover:bg-red-600/30 transition-all cursor-pointer disabled:opacity-50"
                          title="Delete booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: ADVANCED MEDIA UPLOADER (MULTI-UPLOAD & LINK IMPORT) ================= */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            {/* Upload Method Selector */}
            <div className="card-gradient p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#E5A827]" />
                    <span>Upload New Media (Photos &amp; Videos)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Add high-energy footage and photos from your recent weddings, corporate galas, and sound setups.
                  </p>
                </div>

                {/* Sub Mode Selector */}
                <div className="flex items-center gap-2 bg-[#060D1E] p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setUploadMode("local")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      uploadMode === "local"
                        ? "bg-[#E5A827] text-[#060D1E] shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Local Multi-Upload</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadMode("link")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      uploadMode === "link"
                        ? "bg-[#E5A827] text-[#060D1E] shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>From Link (URL Extractor)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadMode("social")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      uploadMode === "social"
                        ? "bg-[#E5A827] text-[#060D1E] shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Social / Video Link</span>
                  </button>
                </div>
              </div>

              {/* ---------------- MODE 1: LOCAL MULTI-FILE UPLOAD ---------------- */}
              {uploadMode === "local" && (
                <div className="space-y-6">
                  {/* Drag & Drop Area */}
                  <div className="relative border-2 border-dashed border-white/20 hover:border-[#E5A827]/60 rounded-3xl p-8 text-center transition-all bg-[#060D1E]/40 hover:bg-[#060D1E]/70">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleLocalFilesPicked}
                      disabled={isUploadingBatch}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="space-y-3 pointer-events-none">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E5A827]/10 border border-[#E5A827]/30 flex items-center justify-center text-[#E5A827]">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Click to browse or drag and drop multiple photos &amp; videos
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Select multiple files from your phone or PC (JPG, PNG, WEBP, MP4, MOV)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Batch Global Category/Location Bar */}
                  {stagedFiles.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[#060D1E] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="font-bold text-slate-300">Batch Settings for Selected:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Category:</span>
                          <select
                            value={batchCategory}
                            onChange={(e) => setBatchCategory(e.target.value)}
                            className="bg-[#0A1A3A] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                          >
                            <option value="Weddings">Weddings</option>
                            <option value="Traditional">Traditional / Ruracio</option>
                            <option value="Corporate">Corporate Events</option>
                            <option value="Team Building">Team Building</option>
                            <option value="Sound & Lighting">Sound &amp; Lighting</option>
                            <option value="Parties & Birthdays">Parties &amp; Birthdays</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">Venue:</span>
                          <input
                            type="text"
                            value={batchLocation}
                            onChange={(e) => setBatchLocation(e.target.value)}
                            placeholder="e.g. Windsor Golf Hotel, Nairobi"
                            className="bg-[#0A1A3A] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={applyBatchMetaToAll}
                          className="px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        >
                          Apply to All Files
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setStagedFiles((prev) => prev.map((f) => ({ ...f, selected: true })))
                          }
                          className="text-[11px] text-[#E5A827] hover:underline cursor-pointer"
                        >
                          Select All
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() =>
                            setStagedFiles((prev) => prev.map((f) => ({ ...f, selected: false })))
                          }
                          className="text-[11px] text-slate-400 hover:underline cursor-pointer"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Staged Files Preview List */}
                  {stagedFiles.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>
                          <strong>{stagedFiles.filter((f) => f.selected).length}</strong> of {stagedFiles.length} files selected for upload:
                        </span>
                        <button
                          type="button"
                          onClick={() => setStagedFiles([])}
                          disabled={isUploadingBatch}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer"
                        >
                          Clear Staging List
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                        {stagedFiles.map((sf) => (
                          <div
                            key={sf.id}
                            className={`p-3 rounded-2xl border transition-all flex gap-3 ${
                              sf.selected
                                ? "bg-[#091735] border-[#E5A827]/40"
                                : "bg-[#060D1E]/60 border-white/5 opacity-60"
                            }`}
                          >
                            {/* Checkbox & Thumbnail */}
                            <div className="flex flex-col items-center gap-2">
                              <input
                                type="checkbox"
                                checked={sf.selected}
                                onChange={(e) =>
                                  setStagedFiles((prev) =>
                                    prev.map((item) =>
                                      item.id === sf.id ? { ...item, selected: e.target.checked } : item
                                    )
                                  )
                                }
                                className="w-4 h-4 rounded text-[#E5A827] focus:ring-0 cursor-pointer mt-1"
                              />

                              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                {sf.isVideo ? (
                                  <video
                                    src={sf.preview}
                                    className="w-full h-full object-cover"
                                    muted
                                  />
                                ) : (
                                  <Image
                                    src={sf.preview}
                                    alt={sf.title}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  {sf.isVideo ? "Video" : "Photo"}
                                </span>
                              </div>
                            </div>

                            {/* Editable Fields */}
                            <div className="flex-1 space-y-2 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={sf.title}
                                  onChange={(e) =>
                                    setStagedFiles((prev) =>
                                      prev.map((item) =>
                                        item.id === sf.id ? { ...item, title: e.target.value } : item
                                      )
                                    )
                                  }
                                  placeholder="Item Title"
                                  className="w-full bg-[#060D1E] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none focus:border-[#E5A827]"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeStagedFile(sf.id)}
                                  disabled={isUploadingBatch}
                                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                                  title="Remove from queue"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <select
                                  value={sf.category}
                                  onChange={(e) =>
                                    setStagedFiles((prev) =>
                                      prev.map((item) =>
                                        item.id === sf.id ? { ...item, category: e.target.value } : item
                                      )
                                    )
                                  }
                                  className="bg-[#060D1E] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                >
                                  <option value="Weddings">Weddings</option>
                                  <option value="Traditional">Traditional / Ruracio</option>
                                  <option value="Corporate">Corporate Events</option>
                                  <option value="Team Building">Team Building</option>
                                  <option value="Sound & Lighting">Sound &amp; Lighting</option>
                                  <option value="Parties & Birthdays">Parties &amp; Birthdays</option>
                                </select>

                                <input
                                  type="text"
                                  value={sf.location}
                                  onChange={(e) =>
                                    setStagedFiles((prev) =>
                                      prev.map((item) =>
                                        item.id === sf.id ? { ...item, location: e.target.value } : item
                                      )
                                    )
                                  }
                                  placeholder="Location / Venue"
                                  className="bg-[#060D1E] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                                />
                              </div>

                              <input
                                type="text"
                                value={sf.desc}
                                onChange={(e) =>
                                  setStagedFiles((prev) =>
                                    prev.map((item) =>
                                      item.id === sf.id ? { ...item, desc: e.target.value } : item
                                    )
                                  )
                                }
                                placeholder="Short description / notes (optional)"
                                className="w-full bg-[#060D1E] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Progress Bar during Upload */}
                      {isUploadingBatch && (
                        <div className="space-y-2 p-4 rounded-2xl bg-[#060D1E] border border-[#E5A827]/30">
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E5A827]" />
                              <span>
                                Uploading {batchProgress.current} of {batchProgress.total} items to Cloudinary...
                              </span>
                            </span>
                            <span className="font-mono font-bold text-[#E5A827]">
                              {batchProgress.percent}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#FAD961] to-[#E5A827] transition-all duration-300"
                              style={{ width: `${batchProgress.percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Feedback notices */}
                      {batchSuccessNotice && (
                        <p className="text-xs text-green-400 font-medium bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                          {batchSuccessNotice}
                        </p>
                      )}
                      {batchErrorNotice && (
                        <p className="text-xs text-red-400 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                          {batchErrorNotice}
                        </p>
                      )}

                      {/* Submit Button */}
                      <button
                        type="button"
                        disabled={isUploadingBatch || stagedFiles.filter((f) => f.selected).length === 0}
                        onClick={uploadStagedFilesToCloudinary}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold text-sm shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>
                          {isUploadingBatch
                            ? `Uploading (${batchProgress.current}/${batchProgress.total})...`
                            : `Upload Selected Files (${stagedFiles.filter((f) => f.selected).length}) to Website`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- MODE 2: LINK MEDIA EXTRACTOR ---------------- */}
              {uploadMode === "link" && (
                <div className="space-y-6">
                  <form onSubmit={handleExtractFromLink} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Paste Link (Public Album, Drive, YouTube, Webpage, Direct URLs)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            required
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            placeholder="https://drive.google.com/..., https://youtube.com/..., or any public album URL"
                            className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                          />
                          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>

                        <button
                          type="submit"
                          disabled={isExtracting || !linkInput.trim()}
                          className="px-6 py-3 rounded-xl bg-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                        >
                          {isExtracting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Scanning Link...</span>
                            </>
                          ) : (
                            <>
                              <Search className="w-3.5 h-3.5" />
                              <span>Scan &amp; Extract Media</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Supports scanning web pages, public galleries, Google Drive preview links, and YouTube video/Shorts.
                      </p>
                    </div>

                    {extractError && (
                      <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        ⚠️ {extractError}
                      </p>
                    )}
                  </form>

                  {/* Extracted Candidates Grid with Checkboxes */}
                  {extractedCandidates.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#060D1E] p-4 rounded-2xl border border-white/10">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white">
                            Discovered Media Candidates ({extractedCandidates.length} found)
                          </h4>
                          <p className="text-xs text-slate-400">
                            Check the specific photos or videos you want to publish on your website.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExtractedCandidates((prev) =>
                                prev.map((c) => ({ ...c, selected: true }))
                              )
                            }
                            className="text-xs text-[#E5A827] hover:underline cursor-pointer"
                          >
                            Select All
                          </button>
                          <span className="text-slate-600">•</span>
                          <button
                            type="button"
                            onClick={() =>
                              setExtractedCandidates((prev) =>
                                prev.map((c) => ({ ...c, selected: false }))
                              )
                            }
                            className="text-xs text-slate-400 hover:underline cursor-pointer"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
                        {extractedCandidates.map((cand) => (
                          <div
                            key={cand.id}
                            className={`p-3 rounded-2xl border transition-all space-y-2.5 ${
                              cand.selected
                                ? "bg-[#091735] border-[#E5A827]/40"
                                : "bg-[#060D1E]/60 border-white/5 opacity-60"
                            }`}
                          >
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10">
                              <Image
                                src={cand.previewUrl}
                                alt={cand.title}
                                fill
                                className="object-cover"
                              />
                              <input
                                type="checkbox"
                                checked={cand.selected}
                                onChange={(e) =>
                                  setExtractedCandidates((prev) =>
                                    prev.map((c) =>
                                      c.id === cand.id ? { ...c, selected: e.target.checked } : c
                                    )
                                  )
                                }
                                className="absolute top-2 left-2 w-5 h-5 rounded text-[#E5A827] focus:ring-0 cursor-pointer shadow"
                              />
                              <span className="absolute top-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {cand.type}
                              </span>
                            </div>

                            <input
                              type="text"
                              value={cand.title}
                              onChange={(e) =>
                                setExtractedCandidates((prev) =>
                                  prev.map((c) =>
                                    c.id === cand.id ? { ...c, title: e.target.value } : c
                                  )
                                )
                              }
                              placeholder="Title"
                              className="w-full bg-[#060D1E] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                            />

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <select
                                value={cand.category}
                                onChange={(e) =>
                                  setExtractedCandidates((prev) =>
                                    prev.map((c) =>
                                      c.id === cand.id ? { ...c, category: e.target.value } : c
                                    )
                                  )
                                }
                                className="bg-[#060D1E] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                              >
                                <option value="Weddings">Weddings</option>
                                <option value="Traditional">Traditional / Ruracio</option>
                                <option value="Corporate">Corporate Events</option>
                                <option value="Team Building">Team Building</option>
                                <option value="Sound & Lighting">Sound &amp; Lighting</option>
                                <option value="Parties & Birthdays">Parties &amp; Birthdays</option>
                              </select>

                              <input
                                type="text"
                                value={cand.location}
                                onChange={(e) =>
                                  setExtractedCandidates((prev) =>
                                    prev.map((c) =>
                                      c.id === cand.id ? { ...c, location: e.target.value } : c
                                    )
                                  )
                                }
                                placeholder="Location"
                                className="bg-[#060D1E] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={isImportingLinkItems || extractedCandidates.filter((c) => c.selected).length === 0}
                        onClick={handleImportSelectedLinkMedia}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold text-sm shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {isImportingLinkItems
                            ? "Importing selected items..."
                            : `Import Selected Media (${extractedCandidates.filter((c) => c.selected).length}) to Database`}
                        </span>
                      </button>
                    </div>
                  )}

                  {importNotice && (
                    <p className="text-xs text-green-400 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                      {importNotice}
                    </p>
                  )}
                </div>
              )}

              {/* ---------------- MODE 3: SINGLE SOCIAL / VIDEO LINK ---------------- */}
              {uploadMode === "social" && (
                <form onSubmit={handleSaveSocialLink} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Video URL (YouTube or TikTok)
                      </label>
                      <input
                        type="url"
                        required
                        value={socialUrl}
                        onChange={(e) => setSocialUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or shorts/..."
                        className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Title / Caption
                      </label>
                      <input
                        type="text"
                        required
                        value={socialTitle}
                        onChange={(e) => setSocialTitle(e.target.value)}
                        placeholder="e.g. Electric Bridal Grand Entrance in Karen"
                        className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        value={socialCategory}
                        onChange={(e) => setSocialCategory(e.target.value)}
                        className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Weddings">Weddings</option>
                        <option value="Traditional">Traditional / Ruracio</option>
                        <option value="Corporate">Corporate Events</option>
                        <option value="Team Building">Team Building</option>
                        <option value="Sound & Lighting">Sound &amp; Lighting</option>
                        <option value="Parties & Birthdays">Parties &amp; Birthdays</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Location / Venue
                      </label>
                      <input
                        type="text"
                        value={socialLocation}
                        onChange={(e) => setSocialLocation(e.target.value)}
                        placeholder="e.g. Enashipai Resort, Naivasha"
                        className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={socialDesc}
                      onChange={(e) => setSocialDesc(e.target.value)}
                      placeholder="Brief highlight details..."
                      className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSocial}
                    className="w-full py-3 rounded-xl bg-[#E5A827] hover:brightness-110 text-[#060D1E] font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingSocial ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save Video to Website</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ================= EXISTING GALLERY MEDIA REPOSITORY ================= */}
            <div className="card-gradient p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#E5A827]" />
                    <span>Live Gallery Media ({galleryItems.length} items)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {userRole === "admin"
                      ? "Manage published photos and videos. Delete any item anytime."
                      : "Staff View: Direct deletion is permitted within 30 minutes of uploading. After 30m, please request Admin deletion."}
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={galleryCategoryFilter}
                    onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                    className="bg-[#060D1E] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Weddings">Weddings</option>
                    <option value="Traditional">Traditional / Ruracio</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Team Building">Team Building</option>
                    <option value="Sound & Lighting">Sound &amp; Lighting</option>
                    <option value="Parties & Birthdays">Parties &amp; Birthdays</option>
                  </select>

                  <select
                    value={galleryTypeFilter}
                    onChange={(e) => setGalleryTypeFilter(e.target.value as any)}
                    className="bg-[#060D1E] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="photos">Photos Only</option>
                    <option value="videos">Videos Only</option>
                  </select>
                </div>
              </div>

              {/* Gallery Items Grid */}
              {loadingGallery ? (
                <div className="text-center py-16 text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#E5A827]" />
                  <p className="text-xs">Loading gallery media...</p>
                </div>
              ) : (() => {
                const filtered = galleryItems.filter((item) => {
                  if (galleryCategoryFilter !== "all" && item.category !== galleryCategoryFilter) {
                    return false;
                  }
                  if (galleryTypeFilter === "photos" && item.media_type !== "photo") {
                    return false;
                  }
                  if (galleryTypeFilter === "videos" && item.media_type === "photo") {
                    return false;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Camera className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs">No media found matching this category filter.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => {
                      const isVideo = item.media_type === "video";
                      const isYoutube = item.media_url.includes("youtube") || item.media_url.includes("youtu.be");
                      const isTiktok = item.media_url.includes("tiktok");
                      const ytId = isYoutube ? getYouTubeId(item.media_url) : null;
                      const thumb = item.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : item.media_url);

                      // 30-Minute Crew Deletion Check
                      const itemTime = item.created_at ? new Date(item.created_at).getTime() : 0;
                      const diffMins = itemTime > 0 ? (Date.now() - itemTime) / (1000 * 60) : 999;
                      const isWithin30Mins = diffMins >= 0 && diffMins <= 30;
                      const minutesLeft = Math.max(0, 30 - Math.floor(diffMins));

                      return (
                        <div
                          key={item.id}
                          className="bg-[#091735] rounded-2xl border border-white/10 overflow-hidden p-4 space-y-3 flex flex-col justify-between hover:border-[#E5A827]/40 transition-all"
                        >
                          <div className="space-y-3">
                            {/* Media Preview Box */}
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10">
                              {isVideo && !thumb ? (
                                <video
                                  src={item.media_url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              ) : (
                                <Image
                                  src={thumb}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              )}

                              <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 border border-white/15">
                                {isVideo ? (
                                  <>
                                    <Video className="w-3 h-3 text-[#E5A827]" />
                                    <span>{isYoutube ? "YouTube" : isTiktok ? "TikTok" : "Video"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Camera className="w-3 h-3 text-[#E5A827]" />
                                    <span>Photo</span>
                                  </>
                                )}
                              </span>

                              <span className="absolute top-2 right-2 bg-[#E5A827] text-[#060D1E] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                {item.category}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="font-bold text-white text-sm">{item.title}</h4>
                              {item.location && (
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#E5A827]" />
                                  <span>{item.location}</span>
                                </p>
                              )}
                              {item.description && (
                                <p className="text-[11px] text-slate-300 leading-relaxed font-light line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 pt-1">
                                Uploaded: {item.uploaded_by || "Admin"} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                              </p>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                            <a
                              href={item.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-[#E5A827] transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View File</span>
                            </a>

                            {/* Deletion Control: Admin vs Crew */}
                            {userRole === "admin" ? (
                              <button
                                type="button"
                                disabled={deletingId === item.id}
                                onClick={() => handleDeleteMedia(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{deletingId === item.id ? "Deleting..." : "Delete"}</span>
                              </button>
                            ) : isWithin30Mins ? (
                              <button
                                type="button"
                                disabled={deletingId === item.id}
                                onClick={() => handleDeleteMedia(item)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                title="Allowed within 30 minutes of uploading"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete ({minutesLeft}m left)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRequestAdminDelete(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer"
                                title="Upload is older than 30 minutes. Request Admin Macvollan to delete."
                              >
                                <Lock className="w-3 h-3 text-[#E5A827]" />
                                <span>Request Admin</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CREW & TEAM MANAGEMENT (ADMIN ONLY) ================= */}
        {activeTab === "crew" && userRole === "admin" && (
          <div className="space-y-8">
            {/* Form to Add or Edit Crew Member */}
            <div className="card-gradient p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#E5A827]" />
                    <span>{isEditingCrew ? "Edit Crew Member Profile" : "Add New Crew Member"}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Profiles added here will be featured publicly on your website under &quot;About &gt; Meet The Crew&quot;.
                  </p>
                </div>

                {isEditingCrew && (
                  <button
                    type="button"
                    onClick={resetCrewForm}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCrew} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={crewForm.name}
                      onChange={(e) => setCrewForm({ ...crewForm, name: e.target.value })}
                      placeholder="e.g. Macvollan, Faith Wanjiku, DJ Steve..."
                      className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Public Role / Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={crewForm.role}
                      onChange={(e) => setCrewForm({ ...crewForm, role: e.target.value })}
                      placeholder="e.g. Lead Event MC, Resident Sound Engineer, Protocol Officer..."
                      className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Experience Badge
                    </label>
                    <input
                      type="text"
                      value={crewForm.experienceYears}
                      onChange={(e) => setCrewForm({ ...crewForm, experienceYears: e.target.value })}
                      placeholder="e.g. 8+ Years, 5+ Years"
                      className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Display Order (1 = Top)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={crewForm.displayOrder}
                      onChange={(e) => setCrewForm({ ...crewForm, displayOrder: Number(e.target.value) || 1 })}
                      className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5A827]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Website Visibility
                    </label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="crewActiveCheckbox"
                        checked={crewForm.isActive}
                        onChange={(e) => setCrewForm({ ...crewForm, isActive: e.target.checked })}
                        className="w-4 h-4 rounded text-[#E5A827] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="crewActiveCheckbox" className="text-xs text-slate-300 cursor-pointer">
                        Active (Visible on Website)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Specialties &amp; Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={crewForm.specialties}
                    onChange={(e) => setCrewForm({ ...crewForm, specialties: e.target.value })}
                    placeholder="e.g. Bilingual Emceeing, Sound Calibration, Traditional Ruracio Protocol, Team Energizers"
                    className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                  />
                </div>

                {/* Photo Upload: File Picker or Direct URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Crew Member Photo (Upload file or enter URL) *
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCrewFilePicked}
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E5A827] file:text-[#060D1E] hover:file:brightness-110 cursor-pointer"
                      />
                    </div>

                    <div>
                      <input
                        type="url"
                        value={crewForm.photoUrl}
                        onChange={(e) => {
                          setCrewForm({ ...crewForm, photoUrl: e.target.value });
                          setCrewFilePreview(e.target.value);
                        }}
                        placeholder="Or paste direct image URL (https://...)"
                        className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                      />
                    </div>
                  </div>

                  {crewFilePreview && (
                    <div className="pt-2 flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#E5A827] shadow">
                        <Image src={crewFilePreview} alt="Preview" fill className="object-cover" />
                      </div>
                      <span className="text-xs text-slate-400">Photo preview ready</span>
                    </div>
                  )}
                </div>

                {/* Public Biography */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Public Professional Biography
                    </label>
                    <button
                      type="button"
                      disabled={isGeneratingBio}
                      onClick={handleGenerateBioWithAI}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow transition-all cursor-pointer disabled:opacity-50"
                      title="Generate an authentic Kenyan event biography using AI"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingBio ? "animate-spin text-amber-300" : "text-amber-300"}`} />
                      <span>{isGeneratingBio ? "Generating Bio..." : "✨ Suggest Bio with AI"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={crewForm.bio}
                    onChange={(e) => setCrewForm({ ...crewForm, bio: e.target.value })}
                    placeholder="Write a client-facing bio or click 'Suggest Bio with AI' to generate one automatically!"
                    className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827]"
                  />
                </div>

                {crewNotice && (
                  <p className="text-xs text-green-400 bg-green-500/10 p-3 rounded-xl border border-green-500/20 font-medium">
                    {crewNotice}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSavingCrew}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:brightness-110 text-[#060D1E] font-extrabold text-sm shadow-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSavingCrew ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Profile to Roster...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditingCrew ? "Update Crew Member" : "Save Crew Member to Website"}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* List of Existing Crew Members */}
            <div className="card-gradient p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">Current Crew Roster</h3>
                  <p className="text-xs text-slate-400">
                    Active crew members appear automatically on the public &quot;Meet The Crew&quot; section.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#E5A827] bg-[#E5A827]/10 px-3 py-1 rounded-lg">
                  {crewMembers.length} Members
                </span>
              </div>

              {loadingCrew ? (
                <div className="text-center py-12 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#E5A827]" />
                  <p className="text-xs mt-2">Loading crew list...</p>
                </div>
              ) : crewMembers.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-xs">No crew members added yet. Fill out the form above to add your team!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {crewMembers.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                        m.is_active
                          ? "bg-[#091735] border-white/10 hover:border-[#E5A827]/40"
                          : "bg-[#060D1E]/60 border-white/5 opacity-60"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E5A827]/40 shrink-0">
                          <Image src={m.photo_url} alt={m.name} fill className="object-cover" />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-white text-base truncate">{m.name}</h4>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                m.is_active
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                              }`}
                            >
                              {m.is_active ? "Active" : "Hidden"}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#E5A827]">{m.role}</p>
                          {m.experience_years && (
                            <span className="inline-block text-[10px] bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/10">
                              {m.experience_years}
                            </span>
                          )}
                          {m.specialties && (
                            <p className="text-[11px] text-slate-300 font-light line-clamp-1 pt-1">
                              🎯 {m.specialties}
                            </p>
                          )}
                          {m.bio && (
                            <p className="text-[11px] text-slate-400 leading-relaxed font-light line-clamp-2 pt-1">
                              {m.bio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleCrewActive(m)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {m.is_active ? <UserX className="w-3.5 h-3.5 text-amber-400" /> : <UserCheck className="w-3.5 h-3.5 text-green-400" />}
                          <span>{m.is_active ? "Hide from Website" : "Show on Website"}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditCrew(m)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold cursor-pointer transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            disabled={deletingCrewId === m.id}
                            onClick={() => handleDeleteCrew(m.id, m.name)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 font-bold cursor-pointer transition-all disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{deletingCrewId === m.id ? "Deleting..." : "Delete"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
