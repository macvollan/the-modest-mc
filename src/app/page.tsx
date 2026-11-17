"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GALLERY_CATEGORIES,
  isVideoMedia,
  normalizeGalleryItem,
  type NormalizedGalleryItem,
} from "@/lib/gallery-categories";
import {
  Mic,
  Volume2,
  Users,
  PartyPopper,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Menu,
  X,
  Send,
  HeartHandshake,
  Award,
  ShieldCheck,
  Music,
  Play,
  Camera,
  Video,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";

const PRIMARY_PHONE = "+254729226453";
const SECONDARY_PHONE = "+254745558377";
const DISPLAY_PHONE_1 = "+254 729 226 453";
const DISPLAY_PHONE_2 = "+254 745 558 377";
const OFFICIAL_EMAIL = "info@themodestmcevents.co.ke";
const BACKUP_EMAIL = "themodestmckenya@gmail.com";
const YOUTUBE_URL = "https://youtube.com/@modestmckenya";
const TIKTOK_URL = "https://www.tiktok.com/@modestmckenya";
const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61595879638350";
const DOMAIN_URL = "https://themodestmcevents.co.ke";

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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const SERVICES = [
  {
    icon: Mic,
    title: "Master of Ceremonies (MC)",
    tag: "High Energy & Dignity",
    desc: "Seamless event flow, engaging humor, and vibrant stage presence. From glamorous weddings to executive corporate galas, we keep your guests captivated and on schedule.",
    features: [
      "Weddings & Ruracios",
      "Corporate Dinners & Product Launches",
      "State & Institutional Functions",
      "Church & Social Celebrations",
    ],
  },
  {
    icon: Volume2,
    title: "Professional Sound & PA Systems",
    tag: "Crystal-Clear Audio",
    desc: "Top-grade digital sound engineering, high-fidelity wireless microphones, acoustic tuning, and backup systems to ensure your speeches and music sound pristine.",
    features: [
      "Digital Mixers & Line-Array Speakers",
      "Wireless Handheld & Lapel Mics",
      "Pro DJ Setup & Mood Playlists",
      "Silent Generator Backup Support",
    ],
  },
  {
    icon: Users,
    title: "Team Building Facilitation",
    tag: "Synergy & Motivation",
    desc: "High-impact outdoor and indoor team building sessions designed to boost team morale, communication, leadership, and camaraderie with refreshing fun.",
    features: [
      "Customized Corporate Games",
      "Icebreakers & Energizers",
      "Debrief & Morale Building",
      "Full Day / Multi-Day Coordination",
    ],
  },
  {
    icon: PartyPopper,
    title: "Birthdays & Baby Showers",
    tag: "Joy & Milestone Moments",
    desc: "Bringing warmth, pomp, and colour to family milestones. We design interactive games and heartfelt moments that leave lasting memories for your loved ones.",
    features: [
      "Milestone Adult & Kids Birthdays",
      "Baby Showers & Gender Reveals",
      "Anniversaries & Graduations",
      "Themed Celebration Hosting",
    ],
  },
  {
    icon: Music,
    title: "Event Planning & Coordination",
    tag: "Zero Stress For You",
    desc: "End-to-end event execution. We coordinate service providers, manage schedules, synchronize sound, decor, and protocol so you enjoy every minute as a host.",
    features: [
      "Program & Script Drafting",
      "Vendor & Decor Synergy",
      "Timekeeping & Protocol Handling",
      "On-site Crisis Management",
    ],
  },
  {
    icon: Award,
    title: "Special Celebrations & Ruracio",
    tag: "Tradition Meets Pomp",
    desc: "Masterful handling of traditional ceremonies with deep cultural respect, vibrant humor, and coordinated negotiations that honor both families.",
    features: [
      "Ruracio & Dowry Ceremonies",
      "Bridal Showers & Send-offs",
      "Family Rehearsals & Etiquette",
      "Bilingual Hosting (English & Swahili)",
    ],
  },
];

const PACKAGES = [
  {
    name: "Classic Celebration",
    idealFor: "Birthdays, Baby Showers & Intimate Parties",
    highlight: false,
    services: [
      "Professional MC Hosting (Up to 5 Hours)",
      "Standard Crystal Sound Setup & Wireless Mics",
      "Tailored Playlist & Music Mixing",
      "Interactive Host-Led Games",
      "Pre-event Consultation",
    ],
  },
  {
    name: "Pomp & Colour Signature",
    idealFor: "Weddings, Corporate Events & Large Galas",
    highlight: true,
    badge: "Signature Experience",
    services: [
      "Headlining MC Services by The Modest MC",
      "Complete High-Definition PA System (Up to 600 Pax)",
      "Dedicated Sound Engineer & Resident Event DJ",
      "Full Reception & Evening Party Hosting",
      "Program & Protocol Coordination",
      "Client Direct Confirmation & Schedule Sync",
    ],
  },
  {
    name: "Corporate Synergy",
    idealFor: "Company Team Building & End-Year Parties",
    highlight: false,
    services: [
      "Lead Team Building Facilitator + Field Assistants",
      "Sound Equipment with Outdoor Portable Coverage",
      "Full Gear for 8+ Interactive Team Challenges",
      "High-energy Energizers & Awards Ceremony",
      "Detailed Corporate Brief & Debrief Report",
    ],
  },
];

const GALLERY_ITEMS = [
  {
    title: "Grand Wedding Reception",
    category: "Weddings",
    location: "Karen, Nairobi",
    tag: "Pomp & Colour",
    mediaType: "photo",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    desc: "Electrifying bride & groom entrance, seamless program, and royal energy.",
  },
  {
    title: "Corporate Team Building Games",
    category: "Team Building",
    location: "Naivasha Resort",
    tag: "High Energy",
    mediaType: "photo",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    desc: "Engaging corporate challenges, obstacle courses, and morale-boosting energizers.",
  },
  {
    title: "Vibrant Ruracio Ceremony",
    category: "Weddings",
    location: "Kiambu",
    tag: "Culture & Dignity",
    mediaType: "photo",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    desc: "Respectful cultural negotiations, bilingual hosting, and vibrant music.",
  },
  {
    title: "Milestone 40th Birthday Gala",
    category: "Birthdays",
    location: "Lavington",
    tag: "Celebration",
    mediaType: "photo",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    desc: "Cake cutting moments, roast-and-toast session, and crowd-moving party music.",
  },
  {
    title: "Line-Array Audio & Sound Engineering",
    category: "Sound & Setup",
    location: "Nairobi",
    tag: "Crystal Audio",
    mediaType: "photo",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    desc: "High-definition sound dispersion, acoustic calibration, and wireless clarity.",
  },
  {
    title: "Outdoor Corporate End-Year Gala",
    category: "Corporate",
    location: "Ruiru",
    tag: "Executive Excellence",
    mediaType: "photo",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    desc: "Award presentations, executive speeches, and evening celebration dance floor.",
  },
];

const REVIEWS = [
  {
    name: "Brian & Catherine Mwangi",
    event: "Wedding at Windsor Golf Club",
    text: "The Modest MC brought true Pomp and Colour to our big day! The energy from the grand entrance to the evening party was phenomenal. Our guests are still raving about the coordination and great sound.",
    rating: 5,
  },
  {
    name: "Eunice Kariuki",
    event: "Corporate Team Building (Naivasha)",
    text: "Hands down the best team building facilitator we have engaged. Energetic, respectful of corporate culture, and had everyone—from interns to managers—fully engaged throughout.",
    rating: 5,
  },
  {
    name: "Stephen Ochieng",
    event: "40th Birthday Celebration",
    text: "Punctual, professional, and very entertaining. The sound system was crisp, and the music choices matched our crowd perfectly. Modest MC is our official family event partner now!",
    rating: 5,
  },
];

const SLIDING_ITEMS = [
  {
    title: "Grand Bridal Entrance",
    tag: "Weddings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    location: "Karen, Nairobi",
    caption: "High-voltage royal entrance & crowd energizer",
  },
  {
    title: "Line-Array Audio Towers",
    tag: "Sound & PA",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    location: "Naivasha",
    caption: "Crystal acoustic dispersion & sub-bass punch",
  },
  {
    title: "Outdoor Team Challenge",
    tag: "Team Building",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
    location: "Sagana",
    caption: "High morale, bonding & leadership games",
  },
  {
    title: "Vibrant Ruracio Dowry Hosting",
    tag: "Culture",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    location: "Kiambu",
    caption: "Bilingual hosting & dignified cultural protocols",
  },
  {
    title: "Milestone 40th Birthday Toast",
    tag: "Birthdays",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    location: "Lavington",
    caption: "Electrifying toast, roast & celebration dance floor",
  },
  {
    title: "Executive Corporate Gala",
    tag: "Corporate",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    location: "Ruiru",
    caption: "Strict time-keeping & executive awards prestige",
  },
  {
    title: "Live Sound Engineering Desk",
    tag: "Audio Tech",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    location: "Nairobi",
    caption: "Zero audio feedback, digital live equalization",
  },
];

function getYouTubeId(url?: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedGallery, setUploadedGallery] = useState<NormalizedGalleryItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedPackageNotice, setSelectedPackageNotice] = useState<string | null>(null);

  const handleChoosePackage = (pkg: (typeof PACKAGES)[0]) => {
    if (pkg.name === "Corporate Synergy") {
      setEventType("Corporate Function");
      setSelectedServices([
        "Team Building & Corporate Facilitation",
        "Sound & PA System",
        "Full Event Coordination & Planning",
      ]);
    } else if (pkg.name === "Royal Elite") {
      setEventType("Wedding");
      setSelectedServices([
        "Master of Ceremonies (MC)",
        "Sound & PA System",
        "Full Event Coordination & Planning",
      ]);
    } else {
      setEventType("Wedding");
      setSelectedServices([
        "Master of Ceremonies (MC)",
        "Sound & PA System",
      ]);
    }
    setSelectedPackageNotice(pkg.name);
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.items)) {
          const normalized = data.items.map((item: any) =>
            normalizeGalleryItem(item)
          );
          setUploadedGallery(normalized);
        }
      })
      .catch((err) => console.warn("Live gallery fetch:", err));
  }, []);

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [clientPhoneDigits, setClientPhoneDigits] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [otherEventDetails, setOtherEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guestCount, setGuestCount] = useState("100-250");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Master of Ceremonies (MC)",
    "Sound & PA System",
  ]);
  const [specialNotes, setSpecialNotes] = useState("");

  // Submission & Success UI State
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<any>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleCountryCodeChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9+]/g, "");
    if (!cleaned) {
      setCountryCode("+");
      return;
    }
    const normalized = cleaned.startsWith("+")
      ? "+" + cleaned.slice(1).replace(/\+/g, "").slice(0, 4)
      : "+" + cleaned.replace(/\+/g, "").slice(0, 4);
    setCountryCode(normalized);
  };

  const handlePhoneDigitsChange = (raw: string) => {
    let digits = raw.replace(/[^0-9]/g, "");
    const cleanCodeDigits = countryCode.replace(/[^0-9]/g, "");
    if (cleanCodeDigits && digits.startsWith(cleanCodeDigits) && digits.length > 9) {
      digits = digits.slice(cleanCodeDigits.length);
    }
    if (digits.startsWith("0") && digits.length > 9) {
      digits = digits.slice(1);
    } else if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "");
    }
    setClientPhoneDigits(digits.slice(0, 9));
    if (phoneError) setPhoneError("");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = countryCode.replace(/[^0-9]/g, "") || "254";
    if (clientPhoneDigits.length !== 9) {
      setPhoneError("Please enter the 9 digits of your phone number (e.g. 712345678 or 112345678).");
      return;
    }
    setPhoneError("");
    setIsSubmitting(true);

    const finalEventType = eventType === "Other Celebration"
      ? `Other (${otherEventDetails || "Special Event"})`
      : eventType;

    const fullFormattedPhone = `+${cleanCode}${clientPhoneDigits}`;

    const submissionData = {
      name: clientName,
      countryCode: `+${cleanCode}`,
      phone: fullFormattedPhone,
      email: clientEmail,
      eventType: finalEventType,
      eventDate,
      eventLocation,
      guestCount,
      services: selectedServices.join(", "),
      notes: specialNotes,
    };

    try {
      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
    } catch (err) {
      console.warn("Background API dispatch:", err);
    } finally {
      setIsSubmitting(false);
      setLastSubmission(submissionData);
      setBookingConfirmed(true);

      // Automatically clear all input fields after booking!
      setClientName("");
      setCountryCode("+254");
      setClientPhoneDigits("");
      setClientEmail("");
      setEventType("Wedding");
      setOtherEventDetails("");
      setEventDate("");
      setEventLocation("");
      setSpecialNotes("");
      setSelectedServices(["Master of Ceremonies (MC)", "Sound & PA System"]);
      setGuestCount("100-250");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060D1E] text-slate-100 selection:bg-[#E5A827] selection:text-[#060D1E]">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#07193D] via-[#0E357F] to-[#07193D] border-b border-[#E5A827]/25 text-xs py-2 px-4 text-center">
        <span className="inline-flex items-center gap-2 font-medium text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A827]" />
          <span>Now Booking 2026/2027 • Bringing Pomp &amp; Colour to Every Event Across Kenya</span>
        </span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#060D1E]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A827] shadow-[0_0_18px_rgba(229,168,39,0.35)] transition-transform group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="The Modest MC Entertainment Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-base sm:text-lg text-white group-hover:text-[#E5A827] transition-colors leading-tight">
                THE MODEST MC
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#E5A827] font-semibold tracking-wider uppercase">
                Pomp &amp; Colour Entertainment
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-[#E5A827] transition-colors">
              Services
            </a>
            <a href="#gallery" className="hover:text-[#E5A827] transition-colors flex items-center gap-1.5">
              <span>Gallery</span>
              <span className="text-[10px] bg-[#E5A827]/20 text-[#E5A827] px-1.5 py-0.5 rounded-full font-bold">New</span>
            </a>
            <a href="#packages" className="hover:text-[#E5A827] transition-colors">
              Packages
            </a>
            <a href="#about" className="hover:text-[#E5A827] transition-colors">
              About Modest MC
            </a>
            <a href="#reviews" className="hover:text-[#E5A827] transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="hover:text-[#E5A827] transition-colors">
              Contact
            </a>
          </nav>

          {/* Contact Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=Hello%20Modest%20MC,%20I%20would%20like%20to%20inquire%20about%20booking%20an%20event.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href="#book"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:from-[#FBE07E] hover:to-[#F1B638] text-[#060D1E] font-extrabold px-5 py-2.5 rounded-full text-xs tracking-wide shadow-[0_4px_15px_rgba(229,168,39,0.35)] transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Event</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A1A3A] border-b border-white/10 px-4 py-6 space-y-4 text-center animate-in slide-in-from-top-4">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Services
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Pomp &amp; Colour Gallery
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Packages
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              About Modest MC
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Contact
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="#book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#060D1E] font-bold rounded-lg text-sm"
              >
                Book An Event
              </a>
              <a
                href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat On WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1044A3]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#E5A827]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1044A3]/30 border border-[#E5A827]/30 text-[#E5A827] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Modest MC Entertainment Brings Pomp &amp; Colour</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Unforgettable Energy. <br className="hidden sm:inline" />
                Flawless Sound. <br />
                <span className="gold-gradient-text">Pure Pomp &amp; Colour.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Kenya’s premier Master of Ceremonies, high-definition sound engineering, dynamic team building, and seamless event coordination. Turning ordinary milestones into extraordinary celebrations across the nation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:from-[#FBE07E] hover:to-[#F1B638] text-[#060D1E] font-black px-8 py-4 rounded-xl text-sm shadow-[0_10px_25px_-5px_rgba(229,168,39,0.4)] transition-all transform hover:-translate-y-1"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Reserve Your Date Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#gallery"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0C214A] hover:bg-[#112A5E] border border-[#1044A3] text-white px-7 py-4 rounded-xl text-sm font-bold transition-all"
                >
                  <Camera className="w-5 h-5 text-[#E5A827]" />
                  <span>Explore Event Highlights</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white">500+</div>
                  <div className="text-xs text-slate-400">Events Hosted</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-[#E5A827]">100%</div>
                  <div className="text-xs text-slate-400">Pomp &amp; Energy</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white">47</div>
                  <div className="text-xs text-slate-400">Counties Covered</div>
                </div>
              </div>
            </div>

            {/* Right Visual Crest Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-88 md:w-96 aspect-square rounded-3xl p-6 card-gradient shadow-[0_20px_50px_rgba(16,68,163,0.3)] border border-[#E5A827]/30 flex flex-col items-center justify-center text-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#E5A827] shadow-[0_0_30px_rgba(229,168,39,0.4)]">
                  <Image
                    src="/logo.jpg"
                    alt="The Modest MC Crest"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="mt-5 space-y-1">
                  <h3 className="font-black text-lg text-white tracking-wide">
                    The Modest MC Entertainment
                  </h3>
                  <p className="text-xs text-[#E5A827] font-semibold flex items-center justify-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#E5A827]" />
                    <span>Bringing Pomp &amp; Colour</span>
                    <Star className="w-3.5 h-3.5 fill-[#E5A827]" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Live Highlights Sliding Gallery Marquee */}
      <section className="py-12 bg-[#050B1A] border-y border-white/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A827]/10 text-[#E5A827] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Pomp &amp; Colour Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Event Highlights <span className="gold-gradient-text">In Motion</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Hover to pause • Click any frame to inspect the setup, venue, and celebratory energy.
          </p>
        </div>

        {/* The Infinite Sliding Track */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle gradient fades on left and right for seamless look */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#050B1A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#050B1A] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-5 py-2">
            {[...SLIDING_ITEMS, ...SLIDING_ITEMS].map((slide, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setSelectedMedia({
                    title: slide.title,
                    category: slide.tag,
                    location: slide.location,
                    mediaUrl: slide.image,
                    image: slide.image,
                    desc: slide.caption,
                    mediaType: "photo",
                  })
                }
                className="relative w-72 sm:w-80 h-52 shrink-0 rounded-2xl overflow-hidden card-gradient border border-white/10 hover:border-[#E5A827]/60 cursor-pointer group shadow-xl transition-all"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060D1E] via-[#060D1E]/40 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

                {/* Badge on slide */}
                <span className="absolute top-3 right-3 bg-[#E5A827] text-[#060D1E] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {slide.tag}
                </span>

                <div className="absolute bottom-3 left-3 right-3 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-[#E5A827] font-semibold">
                    <MapPin className="w-3 h-3" />
                    <span>{slide.location}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-[#E5A827] transition-colors truncate">
                    {slide.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-light truncate">
                    {slide.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-[#081530]/80 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
              Our Professional Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything Your Event Needs for <span className="gold-gradient-text">Complete Success</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              We create an electrifying atmosphere, manage time with military precision, and ensure every guest feels celebrated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-7 card-gradient card-gradient-hover transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/30 flex items-center justify-center text-[#E5A827] group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#E5A827] bg-[#E5A827]/10 px-2.5 py-1 rounded-full border border-[#E5A827]/20">
                        {s.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#E5A827] transition-colors">
                      {s.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {s.desc}
                    </p>

                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      {s.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A827] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4">
                    <a
                      href="#book"
                      onClick={() =>
                        setEventType(
                          s.title.includes("MC")
                            ? "Wedding"
                            : s.title.includes("Sound")
                            ? "Sound System Rental Only"
                            : s.title.includes("Team")
                            ? "Corporate Team Building"
                            : "Birthday Party"
                        )
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A827] hover:text-white transition-colors"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sound & Acoustic Engineering Excellence Section */}
      <section className="py-16 bg-[#07132B] border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
              High-Definition Sound &amp; PA Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Concert-Grade Audio Engineered for <span className="gold-gradient-text">High-Energy Crowds</span>
            </h2>
            <p className="text-sm text-slate-300">
              Zero audio feedback, acoustic precision calibration, and deep sub-bass punch that carries speeches and dance entrance music effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-gradient p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/30 flex items-center justify-center text-[#E5A827]">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Line-Array Acoustic Towers</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Wide horizontal sound dispersion ensuring the back-row guests hear as crisply and comfortably as the high table.
              </p>
            </div>

            <div className="card-gradient p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/30 flex items-center justify-center text-[#E5A827]">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Dual 18&quot; High-Excursion Subs</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Rich, punchy low-frequency resonance that makes bridal party entrances and evening party sets exhilarating.
              </p>
            </div>

            <div className="card-gradient p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/30 flex items-center justify-center text-[#E5A827]">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Dual UHF Wireless Mics</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Professional Shure vocal wireless systems with up to 150m uninterrupted roaming freedom across wide event gardens.
              </p>
            </div>

            <div className="card-gradient p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1044A3]/40 border border-[#E5A827]/30 flex items-center justify-center text-[#E5A827]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Silent Generator Backup</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Independent standby silent generator power guaranteeing zero celebration blackouts or sound stoppage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pomp & Colour Category Gallery Cards Section */}
      <section id="gallery" className="py-20 bg-[#060D1E] relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A827]/10 text-[#E5A827] text-xs font-semibold">
                <Camera className="w-3.5 h-3.5" />
                <span>Publicity &amp; Event Media Showcase</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                The <span className="gold-gradient-text">&quot;Pomp &amp; Colour&quot;</span> Gallery
              </h2>
              <p className="text-sm text-slate-300">
                Choose an event category below to explore its dedicated gallery page — neatly organized into Photos and Videos.
              </p>
            </div>
          </div>

          {/* Category Picture Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_CATEGORIES.map((cat) => {
              const catItems = uploadedGallery.filter(
                (item) => item.category.toLowerCase() === cat.dbCategory.toLowerCase()
              );
              const catPhotos = catItems.filter((item) => !isVideoMedia(item.mediaType));
              const catVideos = catItems.filter((item) => isVideoMedia(item.mediaType));
              const coverSrc =
                catPhotos[0]?.previewImage ||
                catItems[0]?.previewImage ||
                cat.fallbackCover;

              return (
                <Link
                  key={cat.slug}
                  href={`/gallery/${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden card-gradient border border-white/10 hover:border-[#E5A827]/70 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                    <Image
                      src={coverSrc}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060D1E] via-[#060D1E]/45 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                    {/* Top Media Counts Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/15">
                        <Camera className="w-3 h-3 text-[#E5A827]" />
                        <span>{catPhotos.length} {catPhotos.length === 1 ? "Photo" : "Photos"}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/15">
                        <Video className="w-3 h-3 text-[#E5A827]" />
                        <span>{catVideos.length} {catVideos.length === 1 ? "Video" : "Videos"}</span>
                      </span>
                    </div>

                    {/* Category Pill */}
                    <span className="absolute top-3 right-3 bg-[#E5A827] text-[#060D1E] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {cat.shortTitle}
                    </span>

                    {/* Overlay Title on Picture */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-black text-white text-xl group-hover:text-[#E5A827] transition-colors drop-shadow">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-[#E5A827] font-semibold truncate">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#E5A827]">
                      <span>Open Photos &amp; Videos</span>
                      <span className="w-7 h-7 rounded-full bg-[#E5A827]/15 group-hover:bg-[#E5A827] text-[#E5A827] group-hover:text-[#060D1E] flex items-center justify-center transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Lightbox / Media Viewer Modal */}
          {selectedMedia && (
            <div
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedMedia(null)}
            >
              <div
                className="relative max-w-3xl w-full bg-[#0A1A3A] border border-[#E5A827]/40 rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:text-[#E5A827] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Media Container */}
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
                        src={selectedMedia.mediaUrl || selectedMedia.image}
                        alt={selectedMedia.title}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="p-6 space-y-4 bg-[#081530]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-[#E5A827] uppercase tracking-wider">
                        {selectedMedia.category} &bull; {selectedMedia.location}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {selectedMedia.title}
                      </h3>
                    </div>
                    <a
                      href="#booking"
                      onClick={() => setSelectedMedia(null)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1044A3] to-[#1E60D5] text-white font-bold text-xs hover:shadow-lg transition-all"
                    >
                      <span>Book For Your Event</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  {selectedMedia.desc && (
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {selectedMedia.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social Feeds Callout (YouTube, TikTok, Facebook) */}
          <div className="mt-12 rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#0A204C] to-[#0D1830] border border-[#E5A827]/30 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <h4 className="font-extrabold text-white text-lg sm:text-xl">
                Watch Full Videos &amp; Event Reels Online
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Follow our official accounts for live entrance videos, comedy clips, and team building highlights.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>YouTube @modestmckenya</span>
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-900 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok @modestmckenya</span>
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1565cc] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook Page</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      <section id="packages" className="py-20 bg-[#081530]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
              Event Packages
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Tailored Packages Built for Every Celebration
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Customizable options depending on your guest count, venue acoustics, and program vision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PACKAGES.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  pkg.highlight
                    ? "bg-gradient-to-b from-[#1044A3]/50 to-[#0A1A3A] border-2 border-[#E5A827] shadow-[0_15px_40px_rgba(229,168,39,0.25)] scale-105 z-10"
                    : "card-gradient border border-white/10"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#060D1E] text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {pkg.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white">{pkg.name}</h3>
                    <p className="text-xs text-[#E5A827] font-medium mt-1">{pkg.idealFor}</p>
                  </div>

                  <div className="py-4 border-y border-white/10 space-y-3">
                    {pkg.services.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#E5A827] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleChoosePackage(pkg)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      pkg.highlight
                        ? "bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#060D1E] hover:brightness-110 shadow-lg font-black"
                        : "bg-[#1044A3]/50 hover:bg-[#1044A3] text-white border border-[#1044A3] hover:border-[#E5A827]/40"
                    }`}
                  >
                    <span>Select {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About The Modest MC Section */}
      <section id="about" className="py-20 bg-[#060D1E] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden card-gradient border border-[#E5A827]/30 p-8 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs text-[#E5A827] font-bold uppercase tracking-wider">
                    Our Philosophy
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Why We Say &quot;Pomp and Colour&quot;
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed pt-2 font-light">
                    An event is a once-in-a-lifetime milestone. We combine decorum, electric crowd engagement, and coordinated celebration so that hosts feel relaxed and guests leave exhilarated.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-[#E5A827]">
                    <Image src="/logo.jpg" alt="Modest MC" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">The Modest MC</h4>
                    <p className="text-xs text-[#E5A827]">Lead Facilitator &amp; Host</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
                  About The Brand
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Meet The Modest MC Entertainment
                </h2>
              </div>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-light">
                Established with a passion to redefine event hosting across Kenya, <strong>The Modest MC Entertainment</strong> blends corporate poise with unreserved Kenyan celebration energy. Whether it is keeping 1,000 corporate delegates engaged or guiding families through a blessed wedding, we guarantee perfection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#091735] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#E5A827]" />
                    <span>Punctuality &amp; Decorum</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light">
                    Early setup, meticulous sound checks, and total adherence to event protocol.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#091735] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <HeartHandshake className="w-4 h-4 text-[#E5A827]" />
                    <span>Universal Connection</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light">
                    Natural charisma that bridges elders, youths, and executives with humor and respect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-[#081530]/70 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Loved by Hosts &amp; Audiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, idx) => (
              <div key={idx} className="rounded-2xl p-6 card-gradient space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#E5A827]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E5A827]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed font-light">
                    &quot;{rev.text}&quot;
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                  <p className="text-xs text-[#E5A827]">{rev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Booking & Appointment Section */}
      <section id="book" className="py-20 bg-gradient-to-b from-[#081530] to-[#060D1E] border-t border-white/10 relative">
        <span id="booking" className="absolute -top-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A827]/10 border border-[#E5A827]/30 text-[#E5A827] text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Direct Event Reservation &amp; Quotation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Book The Modest MC For Your Date
            </h2>
            <p className="text-sm text-slate-300">
              Submit your inquiry below. All details are immediately processed and recorded directly for your event date.
            </p>
          </div>

          {/* Form Card */}
          <div className="card-gradient rounded-3xl p-6 sm:p-10 border border-[#E5A827]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Selected Package Notice Banner */}
            {selectedPackageNotice && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#1044A3]/50 to-[#E5A827]/20 border border-[#E5A827] flex items-center justify-between text-xs text-[#E5A827] shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2.5 font-bold">
                  <Sparkles className="w-4 h-4 text-[#E5A827] shrink-0" />
                  <span>
                    Package Selected: <strong>{selectedPackageNotice}</strong> • Form pre-filled for your convenience!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPackageNotice(null)}
                  className="text-slate-400 hover:text-white text-xs underline font-normal ml-3 shrink-0"
                >
                  Clear Selection
                </button>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Row 1: Name and Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Your Full Name / Organization <span className="text-[#E5A827]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Macvollan"
                    className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Your Phone / WhatsApp Number <span className="text-[#E5A827]">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-24 sm:w-28 shrink-0">
                      <input
                        type="text"
                        required
                        aria-label="Country Code"
                        title="Country Code (Default: Kenya +254)"
                        value={countryCode}
                        onChange={(e) => handleCountryCodeChange(e.target.value)}
                        placeholder="+254"
                        className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-3 py-3 text-sm text-center font-semibold text-[#E5A827] placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        minLength={9}
                        maxLength={9}
                        pattern="[0-9]{9}"
                        aria-label="9-digit Phone Number"
                        value={clientPhoneDigits}
                        onChange={(e) => handlePhoneDigitsChange(e.target.value)}
                        placeholder="712345678"
                        className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 pr-14 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors tracking-wide"
                      />
                      <span
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${
                          clientPhoneDigits.length === 9 ? "text-[#25D366]" : "text-slate-500"
                        }`}
                      >
                        {clientPhoneDigits.length}/9
                      </span>
                    </div>
                  </div>
                  {phoneError ? (
                    <p className="text-[11px] text-red-400 mt-1.5">{phoneError}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Country code (Kenya +254 default) + 9 digits (e.g. 712345678 or 112345678)
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Email and Event Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Event Date <span className="text-[#E5A827]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Event Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Event Category <span className="text-[#E5A827]">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5A827] transition-colors"
                  >
                    <option value="Wedding">Wedding Celebration</option>
                    <option value="Ruracio / Traditional Ceremony">Ruracio / Traditional Ceremony</option>
                    <option value="Corporate Team Building">Corporate Team Building</option>
                    <option value="Corporate Dinner / Gala">Corporate Dinner / Gala</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                    <option value="Sound System Rental Only">Sound System Rental Only</option>
                    <option value="Other Celebration">Other Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Venue / Town Location <span className="text-[#E5A827]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Gwa Kairo, Ruiru / Karen / Naivasha"
                    className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>
              </div>

              {/* NEW: Conditional Input for "Other Celebration" */}
              {eventType === "Other Celebration" && (
                <div className="p-4 rounded-xl bg-[#1044A3]/20 border border-[#E5A827]/40 animate-in fade-in duration-300">
                  <label className="block text-xs font-bold text-[#E5A827] uppercase tracking-wider mb-2">
                    Please Specify Your Event Type <span className="text-white">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={otherEventDetails}
                    onChange={(e) => setOtherEventDetails(e.target.value)}
                    placeholder="e.g. Thanksgiving, Graduation Party, Product Launch, Housewarming..."
                    className="w-full bg-[#060D1E] border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#E5A827]"
                  />
                </div>
              )}

              {/* Expected Guest Count */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Estimated Number of Guests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Under 50", "50 - 150", "150 - 400", "400+ Guests"].map((count) => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setGuestCount(count)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                        guestCount === count
                          ? "bg-[#1044A3] border-[#E5A827] text-white"
                          : "bg-[#060D1E] border-white/10 text-slate-400 hover:border-white/30"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Select Services Needed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Master of Ceremonies (MC)",
                    "Sound & PA System",
                    "DJ Entertainment",
                    "Team Building Facilitation",
                    "Event Planning & Coordination",
                  ].map((service) => {
                    const active = selectedServices.includes(service);
                    return (
                      <div
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-medium transition-all ${
                          active
                            ? "bg-[#1044A3]/30 border-[#E5A827] text-white"
                            : "bg-[#060D1E] border-white/10 text-slate-400 hover:border-white/25"
                        }`}
                      >
                        <span>{service}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            active
                              ? "bg-[#E5A827] border-[#E5A827] text-[#060D1E]"
                              : "border-white/20"
                          }`}
                        >
                          {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Any Special Notes or Program Requests?
                </label>
                <textarea
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Share your event theme, preferred timings, sound setup needs, or special requests..."
                  className="w-full bg-[#060D1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:from-[#FBE07E] hover:to-[#F1B638] text-[#060D1E] font-black text-sm tracking-wide shadow-[0_10px_25px_rgba(229,168,39,0.35)] flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#060D1E] border-t-transparent rounded-full animate-spin" />
                      <span>Processing &amp; Dispatching Notification...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Event Reservation</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3 font-light">
                  🔒 Fast response guaranteed. Your date will be tentatively reserved for follow-up.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Confirmation & Success Modal */}
      {bookingConfirmed && lastSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A1A3A] border-2 border-[#E5A827] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setBookingConfirmed(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#E5A827]/20 border border-[#E5A827] flex items-center justify-center mx-auto text-[#E5A827]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-white">Booking Inquiry Received!</h3>
              <p className="text-xs text-[#E5A827] font-semibold">
                Bringing Pomp and Colour to your celebration 🎉
              </p>
            </div>

            <div className="bg-[#060D1E] rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Client Name:</span>
                <span className="font-bold text-white">{lastSubmission.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Contact Phone:</span>
                <span className="font-bold text-white">{lastSubmission.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Event Type:</span>
                <span className="font-bold text-white">{lastSubmission.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Date:</span>
                <span className="font-bold text-white">{lastSubmission.eventDate || "To be confirmed"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Venue:</span>
                <span className="font-bold text-white">{lastSubmission.eventLocation}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Services:</span>
                <span className="font-bold text-[#E5A827]">{lastSubmission.services}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs text-center text-slate-300 leading-relaxed">
                Thank you, <strong>{lastSubmission.name}</strong>! Your event details have been officially recorded in our reservation queue.
              </p>

              {/* Primary Direct WhatsApp Button */}
              <a
                href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=${encodeURIComponent(
                  `🎉 Hello The Modest MC, I have just completed a reservation request on themodestmcevents.co.ke:\n\n👤 Name: ${lastSubmission.name}\n📞 Phone: ${lastSubmission.phone}\n🎊 Event: ${lastSubmission.eventType}\n📅 Date: ${lastSubmission.eventDate || "Upcoming date"}\n📍 Location: ${lastSubmission.eventLocation}\n🎙️ Services: ${lastSubmission.services}\n\nLet's connect and lock in our date!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-[0_10px_25px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chat Directly on WhatsApp (0729 226 453)</span>
              </a>

              {/* Secondary Options Grid: Hotline 2 and Direct Call */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/${SECONDARY_PHONE.replace("+", "")}?text=${encodeURIComponent(
                    `🎉 Hello The Modest MC, I submitted a reservation request on themodestmcevents.co.ke:\n\n👤 Name: ${lastSubmission.name}\n📞 Phone: ${lastSubmission.phone}\n🎊 Event: ${lastSubmission.eventType}\n📅 Date: ${lastSubmission.eventDate || "Upcoming date"}\n📍 Location: ${lastSubmission.eventLocation}\n🎙️ Services: ${lastSubmission.services}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-[#0C214A] hover:bg-[#112A5E] border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4 text-[#E5A827] shrink-0" />
                  <span>Hotline 2 WhatsApp</span>
                </a>

                <a
                  href={`tel:${PRIMARY_PHONE}`}
                  className="py-3 px-3 rounded-xl bg-[#1044A3]/50 hover:bg-[#1044A3] border border-[#E5A827]/30 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <Phone className="w-4 h-4 text-[#E5A827] shrink-0" />
                  <span>Call Hotline</span>
                </a>
              </div>

              {/* Multi-Rig Team Guarantee (No leak, pure reassurance) */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 text-center leading-relaxed">
                🛡️ <strong>Multi-Crew Guarantee:</strong> Every confirmed reservation is honored. Our nationwide firm operates multiple professional sound rigs and lead MCs for concurrent celebrations countrywide.
              </div>

              <button
                onClick={() => setBookingConfirmed(false)}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Close &amp; Return to Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Nationwide Presence Section */}
      <section id="contact" className="py-16 bg-[#060D1E] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 card-gradient border border-[#E5A827]/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1044A3]/30 text-[#E5A827] text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Contact &amp; Event Consultations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to Bring Pomp &amp; Colour to Your Date?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                Available for in-person consultations, sound checks, and event hosting across Nairobi, Kiambu, Machakos, Nakuru, and all 47 counties of Kenya.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <Phone className="w-4 h-4 text-[#E5A827]" />
                  <span>
                    <strong>Call / WhatsApp:</strong> {DISPLAY_PHONE_1} | {DISPLAY_PHONE_2}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <Mail className="w-4 h-4 text-[#E5A827]" />
                  <span>
                    <strong>Official Email:</strong>{" "}
                    <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-white hover:text-[#E5A827] underline transition-colors">
                      {OFFICIAL_EMAIL}
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <MapPin className="w-4 h-4 text-[#E5A827]" />
                  <span>
                    <strong>Physical Office:</strong> Gwa Kairo, Ruiru
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A1A3A] rounded-2xl p-6 border border-white/10 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#1044A3]/30 border border-[#E5A827]/50 flex items-center justify-center mx-auto text-[#E5A827]">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white">Event Inquiries &amp; Consultations</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sunday to Friday: 8:00 AM – 7:00 PM <br />
                  <span className="text-[#E5A827] font-semibold">Closed on Sabbath (Saturday)</span> <br />
                  Events Hosted Countrywide
                </p>
              </div>
              <a
                href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=Hello%20The%20Modest%20MC,%20I%20would%20like%20to%20plan%20an%20event%20consultation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A827] hover:underline"
              >
                <span>Schedule a Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#040814] border-t border-white/10 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden relative border border-[#E5A827]">
                  <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <span className="font-black text-white text-sm">THE MODEST MC</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                Bringing Pomp and Colour to every wedding, corporate event, and family celebration in Kenya.
              </p>
              {/* Social Icons Row */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-black border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#1877F2] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#25D366] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-[#E5A827]">Services</a></li>
                <li><a href="#gallery" className="hover:text-[#E5A827]">Gallery</a></li>
                <li><a href="#packages" className="hover:text-[#E5A827]">Packages</a></li>
                <li><a href="#about" className="hover:text-[#E5A827]">About Us</a></li>
                <li><a href="#book" className="hover:text-[#E5A827]">Book An Event</a></li>
                <li className="pt-1"><a href="/admin" className="text-slate-500 hover:text-[#E5A827] text-[11px] flex items-center gap-1"><span>Staff Portal</span> &rarr;</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Services</h4>
              <ul className="space-y-2">
                <li>Master of Ceremonies (MC)</li>
                <li>Sound &amp; PA Systems</li>
                <li>Corporate Team Building</li>
                <li>Birthdays &amp; Showers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Direct Contact</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2 font-light">
                Gwa Kairo, Ruiru, Kenya <br />
                {DISPLAY_PHONE_1} <br />
                {DISPLAY_PHONE_2} <br />
                <a href={`mailto:${OFFICIAL_EMAIL}`} className="hover:text-[#E5A827] underline transition-colors">
                  {OFFICIAL_EMAIL}
                </a>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[11px]">
              &copy; 2026 The Modest MC Entertainment. All rights reserved. Slogan: &quot;Bringing Pomp &amp; Colour&quot;.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                YouTube: @modestmckenya
              </a>
              <span>•</span>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                TikTok: @modestmckenya
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=Hello%20The%20Modest%20MC,%20I%20am%20chatting%20from%20your%20website%20and%20would%20like%20to%20inquire%20about%20your%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.5)] transition-all transform hover:scale-110 flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
