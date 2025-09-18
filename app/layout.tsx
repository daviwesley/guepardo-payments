import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import LayoutWrapper from '@/components/layout-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { AmplifyProvider } from '@/components/amplify-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Expo Learning - Next.js App',
  description: 'Aplicação Next.js para aprendizado com autenticação AWS Cognito',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AmplifyProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </AmplifyProvider>
      </body>
    </html>
  )
}