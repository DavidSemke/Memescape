import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Inertable from "@/components/jsx/modal/Inertable"
import clsx from "clsx"
import "../stylesheets/globals.css"
import { ModalProvider } from "@/components/jsx/context/ModalContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Memescape",
  description: "Find memes, create memes, share memes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.className,
          "flex min-h-screen flex-col items-center bg-secondary text-color antialiased",
        )}
      >
        <ModalProvider>
          <Inertable>
            {children}
          </Inertable>
        </ModalProvider>
      </body>
    </html>
  )
}
