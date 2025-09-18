'use client'

import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import NavLink from '@/components/NavLink'
import { ModeToggle } from '@/components/mode-toggle'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login') // Navegação SPA mais rápida
  }

  // Sempre renderizar o header com o toggle de tema
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/5 transition-all duration-300 ease-in-out">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
        <NavLink 
          href="/" 
          className="font-bold text-xl text-foreground hover:text-primary transition-colors duration-200"
        >
          Expo Learning
        </NavLink>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-foreground/80">
              <User className="h-4 w-4" />
              <span>Olá, {user?.username}</span>
            </div>
          )}
          
          <ModeToggle />
          
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              className="hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}