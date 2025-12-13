import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://herewego-advisor.com"),
  title: {
    default: "Here We Go Advisor | Agencia de Viajes Disney & Universal",
    template: "%s | Here We Go Advisor"
  },
  description: "Planea tu viaje mágico a Disney World, Disneyland, Universal Studios y Cruceros Disney con Ana Karen, Agente Certificada. Asesoría personalizada y paquetes a tu medida.",
  keywords: [
    "Agencia de Viajes Disney",
    "Agente Certificado Disney",
    "Paquetes Disney World",
    "Viajes a Disneyland",
    "Universal Studios Orlando",
    "Disney Cruise Line",
    "Planeación de viajes Disney",
    "Ana Karen",
    "Here We Go Advisor",
    "Agente Disney Mexico",
    "Vacaciones en Familia",
    "Orlando Florida",
    "Universal Epic Universe"
  ],
  authors: [{ name: "Ana Karen" }],
  creator: "Here We Go Advisor",
  openGraph: {
    title: "Here We Go Advisor | Experiencias Mágicas Disney",
    description: "Agencia premium de planificación de viajes Disney por Ana Karen. Diseñamos tus sueños.",
    url: "https://herewego-advisor.com",
    siteName: "Here We Go Advisor",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 1200,
        alt: "Here We Go Advisor - Experiencias Disney",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "Here We Go Advisor",
  "image": "https://herewego-advisor.com/images/og-image.png",
  "description": "Agencia especializada en la planificación de viajes a Disney y Universal.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MX"
  },
  "url": "https://herewego-advisor.com",
  "founder": {
    "@type": "Person",
    "name": "Ana Karen"
  },
  "sameAs": [
    "https://www.instagram.com/herewego_advisor/",
    "https://www.facebook.com/profile.php?id=61553712201003",
    "https://www.tiktok.com/@herewego_advisor"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-black selection:text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
