import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { MotionProvider } from "@/components/shared/motion-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
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
    images: [{ url: "/ai-memory-banner.png", width: 1200, height: 630, alt: "AI Memory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Memory — Neural Memory for AI Agents",
    description:
      "Cure AI amnesia with a Qdrant-backed vector database. 5 specialized collections, semantic decay, and dual-embedding routing.",
    images: ["/ai-memory-banner.png"],
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-bg-base focus:text-primary focus:border focus:border-primary/30 focus:shadow-lg font-mono"
        >
          Skip to main content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AI Memory",
          description: "Neural memory system for AI agents with Qdrant vector search",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Linux, macOS, Windows",
          license: "https://opensource.org/licenses/MIT",
          url: "https://ai-memory.dev",
          codeRepository: "https://github.com/Hidden-History/ai-memory",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        })}} />
        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
