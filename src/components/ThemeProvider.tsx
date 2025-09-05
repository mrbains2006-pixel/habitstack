import { createContext, useContext } from 'react'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemeProvider>) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemeProvider>
  )
}