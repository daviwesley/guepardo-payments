import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import Cookies from 'js-cookie'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  AuthenticationResult: {
    AccessToken: string
    RefreshToken: string
    TokenType: string
    ExpiresIn: number
  }
}

export interface User {
  username: string
  email?: string
  sub?: string
}

class AuthService {
  
  // Para user authentication usando AWS Amplify
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { isSignedIn } = await signIn({
        username: credentials.username,
        password: credentials.password,
      })

      if (isSignedIn) {
        // Obter token da sessão
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()
        
        if (accessToken) {
          // Salvar token nos cookies para compatibilidade
          Cookies.set('access_token', accessToken, {
            expires: 1, // 1 dia
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })

          // Retornar no formato esperado pelos componentes existentes
          return {
            AuthenticationResult: {
              AccessToken: accessToken,
              RefreshToken: '', // Amplify gerencia refresh automaticamente
              TokenType: 'Bearer',
              ExpiresIn: 86400, // 24 horas em segundos
            }
          }
        }
      }

      throw new Error('Authentication failed')
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(`Login failed: ${error}`)
    }
  }

  // Logout - usando Amplify
  async logout(): Promise<void> {
    try {
      await signOut()
      Cookies.remove('access_token')
      Cookies.remove('user')
    } catch (error) {
      console.error('Logout error:', error)
      // Remove cookies mesmo se o logout falhar
      Cookies.remove('access_token')
      Cookies.remove('user')
    }
  }

  // Verificar se usuário está autenticado - usando Amplify
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await getCurrentUser()
      return !!user
    } catch (error) {
      // Fallback para cookie se Amplify falhar
      const token = Cookies.get('access_token')
      return !!token
    }
  }

  // Obter token atual - usando Amplify
  async getToken(): Promise<string | undefined> {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.accessToken?.toString()
    } catch (error) {
      return Cookies.get('access_token')
    }
  }

  // Obter usuário atual - usando Amplify
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await getCurrentUser()
      return {
        username: user.username,
        sub: user.userId,
      }
    } catch (error) {
      return null
    }
  }

  // Decodificar JWT token (base64) - método utilitário mantido
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]
      const decoded = atob(payload)
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Verificar se token é válido - usando Amplify
  async isTokenValid(): Promise<boolean> {
    try {
      const session = await fetchAuthSession()
      return !!session.tokens?.accessToken
    } catch (error) {
      return false
    }
  }
}

// Instância singleton
export const authService = new AuthService()
export default authService