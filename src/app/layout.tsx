import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import "../stylesheets/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memescape",
  description: "Find memes, create memes, share memes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(
        inter.className,
        'bg-secondary text-tertiary min-h-screen antialiased'
      )}>
        {children}
      </body>
    </html>
  );
}
