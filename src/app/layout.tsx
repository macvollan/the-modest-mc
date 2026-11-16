import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://themodestmc.vercel.app"),
  title: "The Modest MC Entertainment | Bringing Pomp & Colour",
  description:
    "Top-tier Master of Ceremonies (MC), high-definition sound systems, energetic corporate team building, and event planning based in Gwa Kairo, Ruiru. Bringing Pomp and Colour across Kenya.",
  keywords: [
    "The Modest MC Entertainment",
    "MC Kenya",
    "Wedding MC Kenya",
    "Corporate MC Ruiru",
    "Team building Kenya",
    "Sound system rental Ruiru",
    "Events planner Kenya",
    "Gwa Kairo Ruiru events",
    "Pomp and Colour"
  ],
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "The Modest MC Entertainment | Bringing Pomp & Colour",
    description: "Unforgettable energy, crystal clear sound, and expert event hosting in Kenya.",
    url: "https://themodestmc.vercel.app",
    siteName: "The Modest MC Entertainment",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "The Modest MC Entertainment Logo",
      },
    ],
    locale: "en_KE",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-[#071126] text-slate-100 antialiased selection:bg-[#E5A827] selection:text-[#071126]">
        {children}
      </body>
    </html>
  );
}
