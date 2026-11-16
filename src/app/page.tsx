"use client";

import { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";

const PRIMARY_PHONE = "+254729226453";
const SECONDARY_PHONE = "+254745558377";
const DISPLAY_PHONE_1 = "+254 729 226 453";
const DISPLAY_PHONE_2 = "+254 745 558 377";
const OFFICIAL_EMAIL = "themodestmckenya@gmail.com";
const YOUTUBE_URL = "https://youtube.com/@modestmckenya";
const LOCATION_TEXT = "Gwa Kairo, Ruiru, Kiambu County (Serving Nationwide)";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SERVICES = [
  {
    icon: Mic,
    title: "Master of Ceremonies (MC)",
    tag: "High Energy & Dignity",
    desc: "Seamless event flow, engaging humor, and vibrant stage presence. From glamorous weddings to executive corporate galas, we keep your guests captivated and on schedule.",
    features: ["Weddings & Ruracios", "Corporate Dinners & Product Launches", "State & Institutional Functions", "Church & Social Celebrations"],
  },
  {
    icon: Volume2,
    title: "Professional Sound & PA Systems",
    tag: "Crystal-Clear Audio",
    desc: "Top-grade digital sound engineering, high-fidelity wireless microphones, acoustic tuning, and backup systems to ensure your speeches and music sound pristine.",
    features: ["Digital Mixers & Line-Array Speakers", "Wireless Handheld & Lapel Mics", "Pro DJ Setup & Mood Playlists", "Silent Generator Backup Support"],
  },
  {
    icon: Users,
    title: "Team Building Facilitation",
    tag: "Synergy & Motivation",
    desc: "High-impact outdoor and indoor team building sessions designed to boost team morale, communication, leadership, and camaraderie with refreshing fun.",
    features: ["Customized Corporate Games", "Icebreakers & Energizers", "Debrief & Morale Building", "Full Day / Multi-Day Coordination"],
  },
  {
    icon: PartyPopper,
    title: "Birthdays & Baby Showers",
    tag: "Joy & Milestone Moments",
    desc: "Bringing warmth, pomp, and colour to family milestones. We design interactive games and heartfelt moments that leave lasting memories for your loved ones.",
    features: ["Milestone Adult & Kids Birthdays", "Baby Showers & Gender Reveals", "Anniversaries & Graduations", "Themed Celebration Hosting"],
  },
  {
    icon: Music,
    title: "Event Planning & Coordination",
    tag: "Zero Stress For You",
    desc: "End-to-end event execution. We coordinate service providers, manage schedules, synchronize sound, decor, and protocol so you enjoy every minute as a host.",
    features: ["Program & Script Drafting", "Vendor & Decor Synergy", "Timekeeping & Protocol Handling", "On-site Crisis Management"],
  },
  {
    icon: Award,
    title: "Special Celebrations & Ruracio",
    tag: "Tradition Meets Pomp",
    desc: "Masterful handling of traditional ceremonies with deep cultural respect, vibrant humor, and coordinated negotiations that honor both families.",
    features: ["Ruracio & Dowry Ceremonies", "Bridal Showers & Send-offs", "Family Rehearsals & Etiquette", "Bilingual Hosting (English & Swahili)"],
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
    badge: "Most Popular",
    services: [
      "Headlining MC Services by The Modest MC",
      "Complete High-Definition PA System (Up to 600 Pax)",
      "Dedicated Sound Engineer & Resident Event DJ",
      "Full Reception & Evening Party Hosting",
      "Program & Protocol Coordination",
      "Client WhatsApp Confirmation & Schedule Sync",
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

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [guestCount, setGuestCount] = useState("100-250");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Master of Ceremonies (MC)",
    "Sound & PA System",
  ]);
  const [specialNotes, setSpecialNotes] = useState("");

  // Confirmation modal state
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<any>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
      eventType,
      eventDate,
      eventLocation,
      guestCount,
      services: selectedServices.join(", "),
      notes: specialNotes,
      submittedAt: new Date().toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setLastSubmission(submissionData);
    setBookingConfirmed(true);

    // Build the formatted WhatsApp message for The Modest MC team
    const teamMessage = encodeURIComponent(
      `🎉 *NEW EVENT INQUIRY - THE MODEST MC ENTERTAINMENT*\n` +
      `-----------------------------------------\n` +
      `👤 *Client Name:* ${clientName}\n` +
      `📞 *Client Phone:* ${clientPhone}\n` +
      `📧 *Email:* ${clientEmail || "Not provided"}\n` +
      `🎈 *Event Type:* ${eventType}\n` +
      `📅 *Date:* ${eventDate || "To be confirmed"}\n` +
      `📍 *Location:* ${eventLocation || "Not specified"}\n` +
      `👥 *Estimated Guests:* ${guestCount}\n` +
      `🎙️ *Services Needed:* ${selectedServices.join(", ") || "General Inquiry"}\n` +
      `📝 *Notes:* ${specialNotes || "None"}\n` +
      `-----------------------------------------\n` +
      `_Submitted via themodestmc.vercel.app_`
    );

    // Open WhatsApp to send to The Modest MC
    window.open(`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=${teamMessage}`, "_blank");
  };

  // Helper to let client send themselves a WhatsApp confirmation copy
  const sendClientConfirmation = () => {
    if (!lastSubmission) return;
    const cleanPhone = lastSubmission.phone.replace(/[^0-9]/g, "");
    const formattedClientPhone = cleanPhone.startsWith("0")
      ? "254" + cleanPhone.slice(1)
      : cleanPhone.startsWith("254")
      ? cleanPhone
      : "254" + cleanPhone;

    const clientMsg = encodeURIComponent(
      `✨ *BOOKING CONFIRMATION: The Modest MC Entertainment*\n` +
      `_Bringing Pomp & Colour to Your Event!_\n\n` +
      `Hello ${lastSubmission.name},\n` +
      `Thank you for reaching out to *The Modest MC Entertainment*!\n\n` +
      `📋 *Your Event Details:*\n` +
      `• *Event:* ${lastSubmission.eventType}\n` +
      `• *Date:* ${lastSubmission.eventDate || "To be confirmed"}\n` +
      `• *Location:* ${lastSubmission.eventLocation}\n` +
      `• *Services:* ${lastSubmission.services}\n\n` +
      `📍 *Our Office:* Gwa Kairo, Ruiru\n` +
      `📞 *Hotline:* ${DISPLAY_PHONE_1} / ${DISPLAY_PHONE_2}\n` +
      `📧 *Email:* ${OFFICIAL_EMAIL}\n` +
      `📺 *Watch Us on YouTube:* ${YOUTUBE_URL}\n\n` +
      `🔔 *Note:* Our lead coordinator has received your request and will call you shortly to align on the program and finalize your reservation. An automated reminder will also be scheduled 48 hours prior to your event.`
    );

    window.open(`https://wa.me/${formattedClientPhone}?text=${clientMsg}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071126] text-slate-100">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#0A2D6E] via-[#1044A3] to-[#0A2D6E] border-b border-[#E5A827]/30 text-xs sm:text-sm py-2 px-4 text-center">
        <span className="inline-flex items-center gap-2 font-medium text-slate-100">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A827]" />
          <span>Now Booking 2026/2027 Weddings, Corporate Team Buildings & Celebrations</span>
          <span className="hidden md:inline">• Gwa Kairo, Ruiru & Countrywide</span>
          <a
            href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}`}
            className="text-[#E5A827] font-semibold underline underline-offset-2 hover:text-amber-300 ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat With Lead MC
          </a>
        </span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#071126]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A827] shadow-[0_0_15px_rgba(229,168,39,0.3)] transition-transform group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="The Modest MC Entertainment Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-[#E5A827] transition-colors leading-tight">
                THE MODEST MC
              </span>
              <span className="text-[11px] sm:text-xs text-[#E5A827] font-medium tracking-wider uppercase">
                Pomp & Colour Entertainment
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-[#E5A827] transition-colors">
              Services
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
            <a href="#location" className="hover:text-[#E5A827] transition-colors">
              Ruiru Base
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:from-[#FBE07E] hover:to-[#F1B638] text-[#071126] font-bold px-5 py-2.5 rounded-full text-xs tracking-wide shadow-[0_4px_14px_rgba(229,168,39,0.35)] transition-all transform hover:-translate-y-0.5"
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
          <div className="lg:hidden bg-[#0A1A3A] border-b border-white/10 px-4 py-6 space-y-4 text-center">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Services
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
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-[#E5A827] font-medium"
            >
              Location & Contact
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="#book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#071126] font-bold rounded-lg text-sm"
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
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1044A3]/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#E5A827]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1044A3]/30 border border-[#E5A827]/40 text-[#E5A827] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Modest MC Entertainment Brings Pomp & Colour</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Unforgettable Energy. <br className="hidden sm:inline" />
                Flawless Sound. <br />
                <span className="gold-gradient-text">Pure Pomp & Colour.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Elevate your special day with Kenya’s premier Master of Ceremonies, high-definition sound engineering, dynamic team building, and seamless event coordination. Based in <strong>Gwa Kairo, Ruiru</strong>, bringing life to celebrations nationwide.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:from-[#FBE07E] hover:to-[#F1B638] text-[#071126] font-extrabold px-8 py-4 rounded-xl text-sm shadow-[0_10px_25px_-5px_rgba(229,168,39,0.4)] transition-all transform hover:-translate-y-1"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Reserve Your Date Now</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=Hi%20Modest%20MC,%20I%20am%20interested%20in%20your%20Pomp%20and%20Colour%20event%20packages.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0D224D] hover:bg-[#122D66] border border-[#1044A3] text-white px-7 py-4 rounded-xl text-sm font-bold transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>WhatsApp Inquiries</span>
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
                  <div className="text-xs text-slate-400">Pomp & Energy</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white">47</div>
                  <div className="text-xs text-slate-400">Counties Covered</div>
                </div>
              </div>
            </div>

            {/* Right Visual / Logo Badge Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 sm:w-88 md:w-96 aspect-square rounded-3xl p-4 card-gradient shadow-[0_20px_50px_rgba(16,68,163,0.35)] border border-[#E5A827]/30 flex flex-col items-center justify-center text-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#E5A827] shadow-[0_0_30px_rgba(229,168,39,0.4)]">
                  <Image
                    src="/logo.jpg"
                    alt="The Modest MC Crest"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className="font-extrabold text-lg text-white tracking-wide">
                    The Modest MC Entertainment
                  </h3>
                  <p className="text-xs text-[#E5A827] font-semibold flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#E5A827]" />
                    <span>Bringing Pomp & Colour</span>
                    <Star className="w-3.5 h-3.5 fill-[#E5A827]" />
                  </p>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-4 bg-[#0A1A3A] border border-[#E5A827]/50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-[#E5A827]" />
                  <span>Headquartered in <strong>Gwa Kairo, Ruiru</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-20 bg-[#091735]/70 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
              Our Professional Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything Your Event Needs for <span className="gold-gradient-text">Complete Success</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              We specialize in creating an electrifying atmosphere while keeping timelines on track and every guest engaged.
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

                    <p className="text-sm text-slate-300 leading-relaxed">
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
                      onClick={() => setEventType(s.title.includes("MC") ? "Wedding" : s.title.includes("Sound") ? "Corporate" : "Team Building")}
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

      {/* Featured Packages Section */}
      <section id="packages" className="py-20 bg-[#071126] relative">
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
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#071126] text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
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
                  <a
                    href="#book"
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      pkg.highlight
                        ? "bg-gradient-to-r from-[#FAD961] to-[#E5A827] text-[#071126] hover:brightness-110 shadow-lg"
                        : "bg-[#1044A3]/40 hover:bg-[#1044A3] text-white border border-[#1044A3]"
                    }`}
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About The Modest MC Section */}
      <section id="about" className="py-20 bg-[#0A1A3A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden card-gradient border border-[#E5A827]/30 p-8 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs text-[#E5A827] font-bold uppercase tracking-wider">
                    Our Core Promise
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    Why We Say &quot;Pomp and Colour&quot;
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed pt-2">
                    An event is not just a gathering—it is a once-in-a-lifetime milestone. We bring decorum, high energy, laughter, and organized celebration without dull lulls or awkward moments.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-[#E5A827]">
                    <Image src="/logo.jpg" alt="Modest MC" fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">The Modest MC</h4>
                    <p className="text-xs text-[#E5A827]">Lead Facilitator & Host</p>
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

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Established with a vision to revolutionize event hosting in Kenya, <strong>The Modest MC Entertainment</strong> is known for delivering high-standard professionalism combined with infectious Kenyan celebration energy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#071126] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#E5A827]" />
                    <span>Punctuality & Decorum</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    We arrive early, soundcheck thoroughly, and maintain respect across all cultural and corporate protocols.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#071126] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <HeartHandshake className="w-4 h-4 text-[#E5A827]" />
                    <span>Audience Connection</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Natural charisma that connects with both the elderly and the youth, creating a warm, inclusive celebration.
                  </p>
                </div>
              </div>

              {/* YouTube Link Banner */}
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                    <YoutubeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Official YouTube Channel</h4>
                    <p className="text-xs text-slate-300">Watch highlight videos & live hosting clips at @modestmckenya</p>
                  </div>
                </div>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors"
                >
                  Visit Channel
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-[#071126]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#E5A827] tracking-widest uppercase">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Loved by Hosts & Audiences
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
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
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
      <section id="book" className="py-20 bg-gradient-to-b from-[#091735] to-[#071126] border-t border-white/10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A827]/10 border border-[#E5A827]/30 text-[#E5A827] text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Instant Appointment & Quote Booking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Book The Modest MC For Your Date
            </h2>
            <p className="text-sm text-slate-300">
              Fill in your event details below. You will receive an instant confirmation on WhatsApp and an automated reminder will be scheduled for your date.
            </p>
          </div>

          <div className="card-gradient rounded-3xl p-6 sm:p-10 border border-[#E5A827]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Row 1: Name and WhatsApp Number */}
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
                    placeholder="e.g. Dennis Kamau / Safaricom Team"
                    className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Your WhatsApp Phone Number <span className="text-[#E5A827]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 0712 345 678 or +254..."
                    className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your confirmation & event reminders will be sent to this WhatsApp number.
                  </p>
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
                    placeholder="e.g. name@example.com"
                    className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
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
                    className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Event Type & Venue Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    Event Category <span className="text-[#E5A827]">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5A827] transition-colors"
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
                    placeholder="e.g. Ruiru, Thika, Nairobi, Naivasha..."
                    className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                  />
                </div>
              </div>

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
                          : "bg-[#071126] border-white/10 text-slate-400 hover:border-white/30"
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
                            : "bg-[#071126] border-white/10 text-slate-400 hover:border-white/25"
                        }`}
                      >
                        <span>{service}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            active
                              ? "bg-[#E5A827] border-[#E5A827] text-[#071126]"
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
                  placeholder="Tell us about your theme, preferred start time, or any specific moments you want us to highlight..."
                  className="w-full bg-[#071126] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A827] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FAD961] to-[#E5A827] hover:from-[#FBE07E] hover:to-[#F1B638] text-[#071126] font-black text-sm tracking-wide shadow-[0_10px_25px_rgba(229,168,39,0.4)] flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Booking & Open WhatsApp Confirmation</span>
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">
                  🔒 Fast response within 1 hour. No advance commitment required for initial quote.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {bookingConfirmed && lastSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A1A3A] border-2 border-[#E5A827] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setBookingConfirmed(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#E5A827]/20 border border-[#E5A827] flex items-center justify-center mx-auto text-[#E5A827]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Booking Inquiry Submitted!</h3>
              <p className="text-xs text-[#E5A827] font-semibold">
                Bringing Pomp and Colour to your celebration 🎉
              </p>
            </div>

            <div className="bg-[#071126] rounded-2xl p-4 border border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Client:</span>
                <span className="font-bold text-white">{lastSubmission.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Phone:</span>
                <span className="font-bold text-white">{lastSubmission.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Event:</span>
                <span className="font-bold text-white">{lastSubmission.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Date:</span>
                <span className="font-bold text-white">{lastSubmission.eventDate || "To be confirmed"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Location:</span>
                <span className="font-bold text-white">{lastSubmission.eventLocation}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Services:</span>
                <span className="font-bold text-[#E5A827]">{lastSubmission.services}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={sendClientConfirmation}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Receipt to My Phone ({lastSubmission.phone})</span>
              </button>

              <button
                onClick={() => setBookingConfirmed(false)}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                Close & Return to Website
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              🔔 An automated reminder has been scheduled for your date ({lastSubmission.eventDate}). The Modest MC team will call you shortly.
            </p>
          </div>
        </div>
      )}

      {/* Location & Physical Presence Section */}
      <section id="location" className="py-16 bg-[#071126] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 card-gradient border border-[#E5A827]/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1044A3]/30 text-[#E5A827] text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Physical Base & Service Radius</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Located in Gwa Kairo, Ruiru
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Strategically situated along the Thika Superhighway corridor at <strong>Gwa Kairo, Ruiru</strong>. We provide swift sound dispatch, on-site event rehearsals, and in-person consultations across Kiambu, Nairobi, Machakos, Murang&apos;a, and all 47 counties of Kenya.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <Phone className="w-4 h-4 text-[#E5A827]" />
                  <span><strong>Call / WhatsApp:</strong> {DISPLAY_PHONE_1} | {DISPLAY_PHONE_2}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <Mail className="w-4 h-4 text-[#E5A827]" />
                  <span><strong>Official Email:</strong> {OFFICIAL_EMAIL}</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <YoutubeIcon className="w-4 h-4 text-red-500" />
                  <span><strong>YouTube:</strong> @modestmckenya</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A1A3A] rounded-2xl p-6 border border-white/10 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#1044A3]/30 border border-[#E5A827]/50 flex items-center justify-center mx-auto text-[#E5A827]">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Event Consultations & Rehearsals</h4>
                <p className="text-xs text-slate-300">
                  Monday to Saturday: 8:00 AM – 7:00 PM <br />
                  Events Hosted: 24/7 Nationwide
                </p>
              </div>
              <a
                href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}?text=Hello%20The%20Modest%20MC,%20I%20would%20like%20to%20plan%20a%20meeting%20or%20event%20consultation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A827] hover:underline"
              >
                <span>Schedule a Consultation in Ruiru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050D1E] border-t border-white/10 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden relative border border-[#E5A827]">
                  <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <span className="font-extrabold text-white text-sm">THE MODEST MC</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bringing Pomp and Colour to every wedding, corporate function, and celebration in Kenya.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-[#E5A827]">Services</a></li>
                <li><a href="#packages" className="hover:text-[#E5A827]">Packages</a></li>
                <li><a href="#about" className="hover:text-[#E5A827]">About Us</a></li>
                <li><a href="#book" className="hover:text-[#E5A827]">Book An Event</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Services</h4>
              <ul className="space-y-2">
                <li>Master of Ceremonies (MC)</li>
                <li>Sound & PA Systems</li>
                <li>Corporate Team Building</li>
                <li>Birthdays & Showers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Direct Contact</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                Gwa Kairo, Ruiru, Kenya <br />
                {DISPLAY_PHONE_1} <br />
                {DISPLAY_PHONE_2} <br />
                {OFFICIAL_EMAIL}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[11px]">
              &copy; 2026 The Modest MC Entertainment. All rights reserved. Slogan: &quot;Bringing Pomp &amp; Colour&quot;.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                YouTube: @modestmckenya
              </a>
              <span>•</span>
              <a
                href={`https://wa.me/${PRIMARY_PHONE.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition-colors"
              >
                WhatsApp Direct
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
