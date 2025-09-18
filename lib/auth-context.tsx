'use client'

import { createContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { authService, User, LoginCredentials } from '@/lib/auth-amplify-new'
import Cookies from 'js-cookie'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  getAppToken: () => Promise<string>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Função para verificar autenticação usando Amplify + fallback para cookies
  const checkAuthFromCookie = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Primeiro, tentar verificar com Amplify
      try {
        const isAmplifyAuthenticated = await authService.isAuthenticated()
        if (isAmplifyAuthenticated) {
          const amplifyUser = await authService.getCurrentUser()
          if (amplifyUser) {
            console.log('✅ Usuário autenticado via Amplify:', amplifyUser)
            setUser(amplifyUser)
            setIsLoading(false)
            setAuthChecked(true)
            return
          }
        }
      } catch (amplifyError) {
        console.warn('⚠️ Erro ao verificar autenticação com Amplify:', amplifyError)
      }
      
      // Fallback: verificar cookie
      const token = Cookies.get('access_token')
      
      if (!token) {
        console.log('❌ Nenhum token encontrado (nem Amplify nem cookie)')
        setUser(null)
        setIsLoading(false)
        setAuthChecked(true)
        return
      }

      // Decodificar o token para extrair informações do usuário
      const decoded = authService.decodeToken(token)
      
      if (!decoded || !decoded.exp) {
        console.warn('⚠️ Token inválido ou sem expiração')
        setUser(null)
        setIsLoading(false)
        setAuthChecked(true)
        return
      }

      // Verificar se o token não expirou
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp <= currentTime) {
        // Token expirado, limpar
        console.warn('⚠️ Token expirado, fazendo logout')
        authService.logout()
        setUser(null)
        setIsLoading(false)
        setAuthChecked(true)
        return
      }

      // Token válido, extrair dados do usuário
      const userData: User = {
        username: decoded.username || decoded['cognito:username'] || 'user',
        email: decoded.email,
        sub: decoded.sub,
      }

      console.log('✅ Usuário autenticado via cookie:', userData)
      setUser(userData)
      setIsLoading(false)
      setAuthChecked(true)
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error)
      setUser(null)
      setIsLoading(false)
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    // Verificar autenticação apenas uma vez na inicialização
    if (!authChecked) {
      checkAuthFromCookie()
    }
  }, [authChecked, checkAuthFromCookie])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const cognitoUser = await authService.login(credentials)
      
      // Extrair dados do usuário do token recém-obtido
      const token = Cookies.get('access_token')
      if (token) {
        const decoded = authService.decodeToken(token)
        if (decoded) {
          const userData: User = {
            username: decoded.username || decoded['cognito:username'] || credentials.username,
            email: decoded.email,
            sub: decoded.sub,
          }
          setUser(userData)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    // Não precisa fazer setIsLoading aqui pois é instantâneo
  }

  const getAppToken = async (): Promise<string> => {
    try {
      const token = await authService.getToken()
      return token || ''
    } catch (error) {
      console.error('Error getting app token:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    getAppToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}