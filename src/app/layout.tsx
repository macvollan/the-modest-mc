import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#071126",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = "https://themodestmcevents.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Modest MC Entertainment | Top Event MC & PA Sound System Rental Kenya",
    template: "%s | The Modest MC Entertainment",
  },
  description:
    "Premier Master of Ceremonies (MC), high-definition PA concert sound systems, corporate team building facilitation, weddings, ruracios & event planning based in Gwa Kairo, Ruiru. Bringing Pomp and Colour across Kenya.",
  applicationName: "The Modest MC Entertainment",
  authors: [{ name: "The Modest MC", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "The Modest MC Entertainment",
    "The Modest MC Events",
    "The Modest MC",
    "MC Kenya",
    "Wedding MC Kenya",
    "Wedding MC Ruiru",
    "Corporate MC Nairobi",
    "Corporate MC Kenya",
    "Best MC in Kenya",
    "Sound system rental Ruiru",
    "PA system hire Nairobi",
    "Sound engineering Kiambu",
    "Corporate team building Kenya",
    "Ruracio MC Kenya",
    "Dowry payment ceremony MC",
    "Baby shower MC Kenya",
    "Sound equipment hire Gwa Kairo",
    "Event planner Ruiru",
    "Events planner Kenya",
    "Pomp and Colour",
    "Gwa Kairo Ruiru events",
    "Concert sound hire Kenya",
  ],
  referrer: "origin-when-cross-origin",
  creator: "The Modest MC Entertainment",
  publisher: "The Modest MC Entertainment",
  category: "Entertainment & Events",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/logo.jpg", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/logo.jpg", sizes: "180x180" }],
    shortcut: "/logo.jpg",
  },
  openGraph: {
    title: "The Modest MC Entertainment | Bringing Pomp & Colour",
    description:
      "Unforgettable energy, crystal clear concert sound, and expert event hosting for weddings, corporate galas, team building, and traditional ceremonies across Kenya.",
    url: SITE_URL,
    siteName: "The Modest MC Entertainment",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "The Modest MC Entertainment Official Crest Logo",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Modest MC Entertainment | Bringing Pomp & Colour",
    description:
      "Top-tier Master of Ceremonies, high-definition sound systems, and event planning across Kenya.",
    images: ["/logo.jpg"],
    creator: "@themodestmc",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "KE-13",
    "geo.placename": "Ruiru, Kiambu, Kenya",
    "geo.position": "-1.1466;36.9608",
    "ICBM": "-1.1466, 36.9608",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: "The Modest MC Entertainment",
  alternateName: [
    "The Modest MC Events",
    "Modest MC Kenya",
    "The Modest MC",
    "Modest MC Sound & Entertainment",
  ],
  slogan: "Bringing Pomp and Colour",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  image: `${SITE_URL}/logo.jpg`,
  description:
    "Premier Master of Ceremonies (MC), high-fidelity concert PA sound system rental, corporate team building facilitation, and traditional ceremony planning based in Gwa Kairo, Ruiru, serving all of Kenya.",
  telephone: ["+254729226453", "+254745558377"],
  email: "info@themodestmcevents.co.ke",
  priceRange: "KSh 15,000 - KSh 120,000",
  currenciesAccepted: "KES",
  paymentAccepted: "Cash, M-Pesa, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gwa Kairo, Ruiru-Kamiti Road",
    addressLocality: "Ruiru",
    addressRegion: "Kiambu County",
    postalCode: "00232",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.1466,
    longitude: 36.9608,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  areaServed: [
    { "@type": "City", "name": "Ruiru" },
    { "@type": "City", "name": "Nairobi" },
    { "@type": "City", "name": "Kiambu" },
    { "@type": "City", "name": "Thika" },
    { "@type": "City", "name": "Nakuru" },
    { "@type": "City", "name": "Machakos" },
    { "@type": "Country", "name": "Kenya" },
  ],
  sameAs: ["https://web.facebook.com/profile.php?id=61595879638350"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Event Entertainment & Production Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Master of Ceremonies (MC)",
          description:
            "Professional bilingual (English & Swahili) MC hosting for weddings, corporate dinners, galas, ruracios, baby showers, and birthday parties.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "High-Definition Sound & PA System Rental",
          description:
            "Concert-grade dual 18-inch subwoofers, active line arrays, Shure UHF wireless microphones, digital mixing consoles, and backup generator power.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Corporate Team Building Facilitation",
          description:
            "High-energy group dynamic activities, morale boosting challenges, communication games, and outdoor team coordination.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Traditional Ceremonies (Ruracio & Ngurario)",
          description:
            "Culturally informed protocol management, bridal team reception, negotiation coordination, and celebration entertainment.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#071126] text-slate-100 antialiased selection:bg-[#E5A827] selection:text-[#071126]">
        {children}
      </body>
    </html>
  );
}
