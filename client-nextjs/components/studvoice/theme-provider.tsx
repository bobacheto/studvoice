"use client"

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" enableSystem={false} defaultTheme="light" disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  )
}
