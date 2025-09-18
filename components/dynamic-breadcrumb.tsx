"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/components": "Components",
  "/about": "About",
  "/login": "Login",
}

export default function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Split the pathname into segments
  const segments = pathname.split('/').filter(segment => segment !== '')
  
  // Create breadcrumb items
  const breadcrumbItems = []
  
  // Always add Home as the first item if we're not on the home page
  if (pathname !== '/') {
    breadcrumbItems.push({
      href: '/',
      label: 'Home',
      isCurrentPage: false
    })
  }
  
  // Build path segments
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLastSegment = index === segments.length - 1
    
    breadcrumbItems.push({
      href: currentPath,
      label: routeNames[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
      isCurrentPage: isLastSegment
    })
  })
  
  // If we're on the home page, just show the home item
  if (pathname === '/') {
    breadcrumbItems.push({
      href: '/',
      label: 'Home',
      isCurrentPage: true
    })
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="mx-2" />}
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href as any}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}