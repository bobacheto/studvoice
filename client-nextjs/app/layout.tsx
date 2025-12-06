import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"

import { AppLayout } from "@/components/studvoice/app-layout"
import { ThemeProvider } from "@/components/studvoice/theme-provider"

export const metadata: Metadata = {
  title: "StudVoice Dashboard",
  description: "Student voice platform powered by Next.js",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
