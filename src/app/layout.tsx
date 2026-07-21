import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientProviders } from "@/context/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialGraph Atlas - Social Intelligence & OSINT Dashboard",
  description: "Cross-platform social media profile analysis, relationship mapping, and geointelligence visualizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-slate-100`}>
        <ClientProviders>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
