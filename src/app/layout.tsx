import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CommitKit - Search Errors. Generate Commands. Master Git.",
  description: "The single destination for Git and GitHub help. Search 1000+ Git errors, generate commands, create commit messages, and learn Git.",
  openGraph: { title: "CommitKit", description: "Search Errors. Generate Commands. Master Git.", type: "website" },
  twitter: { card: "summary_large_image", title: "CommitKit", description: "Search Errors. Generate Commands. Master Git." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
