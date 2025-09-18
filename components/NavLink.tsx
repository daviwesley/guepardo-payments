'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href as any} // Fix temporário para TypeScript tipado
      className={cn(
        'transition-colors duration-200 hover:text-foreground/80',
        isActive ? 'text-foreground' : 'text-foreground/60',
        className
      )}
      prefetch={true} // Pré-carrega a página para navegação mais rápida
    >
      {children}
    </Link>
  )
}