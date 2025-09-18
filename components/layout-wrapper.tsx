"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import DynamicBreadcrumb from "@/components/dynamic-breadcrumb"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks"
import Header from "@/components/Header"
import PageWrapper from "@/components/PageWrapper"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  
  // Pages that don't need authentication
  const publicPages = ['/login', '/about']
  const isPublicPage = publicPages.includes(pathname)
  
  // Show sidebar only for authenticated users on non-public pages
  const shouldShowSidebar = isAuthenticated && !isPublicPage
  
  // Redirect to login if not authenticated and not on a public page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicPage) {
      console.log('🔄 Usuário não autenticado, redirecionando para login...')
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, isPublicPage, router])
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (shouldShowSidebar) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
            <div className="px-4 flex items-center">
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
  
  // Fallback to original layout for public pages or unauthenticated users
  return (
    <>
      <Header />
      <PageWrapper>
        {children}
      </PageWrapper>
    </>
  )
}