"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
      <Toaster 
        position="bottom-right"
        closeButton
        richColors
        expand={false}
        duration={3000}
        theme="light"
      />
    </NextThemesProvider>
  )
}