import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono, Fraunces } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: "ETS Kontrol — Kontratlı tesis yönetim sistemi",
  description:
    "ETS Tur için Elektraweb tarzında, kontratlı otelleri merkezden yöneten otel kontrol sistemi.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f1ea] text-slate-900">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
