import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Here We Go Advisor | Experiencias Mágicas Disney",
  description: "Agencia premium de planificación de viajes Disney por Ana Karen.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Here We Go Advisor | Experiencias Mágicas Disney",
    description: "Agencia premium de planificación de viajes Disney por Ana Karen.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Here We Go Advisor Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-black selection:text-white`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
