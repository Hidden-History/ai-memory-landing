import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI Memory — Neural Memory for AI Agents",
  description:
    "Cure AI amnesia. Qdrant-backed vector memory with semantic decay, 3-layer security, dual embedding routing, and GitHub/Jira sync. Your AI never forgets.",
  openGraph: {
    title: "AI Memory — Neural Memory for AI Agents",
    description:
      "Cure AI amnesia with a Qdrant-backed vector database. 5 specialized collections, semantic decay, and dual-embedding routing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          orbitron.variable,
          bebasNeue.variable,
          outfit.variable,
          jetbrainsMono.variable,
          "antialiased"
        )}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
