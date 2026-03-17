import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI Memory — Qdrant-Backed Vector Memory for AI Agents",
  description:
    "Cure AI amnesia with a Qdrant-backed vector database. 5 specialized collections, semantic decay, 3-layer security, dual embedding routing, and GitHub/Jira sync for Claude Code.",
  openGraph: {
    title: "AI Memory — Qdrant-Backed Vector Memory for AI Agents",
    description:
      "Cure AI amnesia with a Qdrant-backed vector database. 5 specialized collections, semantic decay, 3-layer security, and GitHub/Jira sync.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
