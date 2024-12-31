import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TechPerks - Employee Benefits Management Platform",
  description:
    "TechPerks is a modern employee benefits management platform that helps companies streamline their benefits administration and improve employee satisfaction.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}