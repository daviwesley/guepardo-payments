import { signIn, signOut, getCurrentUser, fetchAuthSession, signUp, confirmSignUp } from 'aws-amplify/auth'
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

class AmplifyAuthService {
  
  // Login usando AWS Amplify
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Iniciando login com Amplify para:', credentials.username)
      
      const { isSignedIn, nextStep } = await signIn({
        username: credentials.username,
        password: credentials.password,
      })

      if (isSignedIn) {
        // Obter token da sessão
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()
        const idToken = session.tokens?.idToken?.toString()
        
        if (accessToken) {
          // Salvar tokens nos cookies para compatibilidade
          Cookies.set('access_token', accessToken, {
            expires: 1, // 1 dia
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })

          if (idToken) {
            Cookies.set('id_token', idToken, {
              expires: 1,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
            })
          }

          // Obter informações do usuário atual
          const user = await getCurrentUser()
          const userData = {
            username: user.username,
            email: user.signInDetails?.loginId,
            sub: user.userId,
          }
          
          Cookies.set('user', JSON.stringify(userData), {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })

          console.log('✅ Login realizado com sucesso via Amplify')

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

      // Se chegou aqui, algo deu errado
      console.error('❌ Falha no login - não foi possível obter token')
      throw new Error('Authentication failed - no token received')
      
    } catch (error) {
      console.error('💥 Erro no login com Amplify:', error)
      throw new Error(`Login failed: ${error}`)
    }
  }

  // Logout usando Amplify
  async logout(): Promise<void> {
    try {
      await signOut()
      
      // Limpar cookies
      Cookies.remove('access_token')
      Cookies.remove('id_token')
      Cookies.remove('refresh_token')
      Cookies.remove('user')
      
      console.log('✅ Logout realizado com sucesso')
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      // Limpar cookies mesmo se o logout falhar
      Cookies.remove('access_token')
      Cookies.remove('id_token')
      Cookies.remove('refresh_token')
      Cookies.remove('user')
    }
  }

  // Verificar se usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await getCurrentUser()
      return !!user
    } catch (error) {
      // Fallback para cookie se Amplify falhar
      const token = Cookies.get('access_token')
      if (!token) return false
      
      // Verificar se o token não expirou
      try {
        const decoded = this.decodeToken(token)
        if (!decoded || !decoded.exp) return false
        
        const currentTime = Math.floor(Date.now() / 1000)
        return decoded.exp > currentTime
      } catch (decodeError) {
        return false
      }
    }
  }

  // Obter token atual
  async getToken(): Promise<string | undefined> {
    try {
      console.log('🔍 Tentando obter token do Amplify...')
      const session = await fetchAuthSession()
      const token = session.tokens?.accessToken?.toString()
      
      if (token) {
        console.log('✅ Token obtido do Amplify com sucesso')
        return token
      } else {
        console.warn('⚠️ Token não encontrado no Amplify, tentando cookie...')
        const cookieToken = Cookies.get('access_token')
        if (cookieToken) {
          console.log('✅ Token obtido do cookie')
          return cookieToken
        } else {
          console.warn('❌ Nenhum token encontrado')
          return undefined
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao obter token do Amplify, tentando cookie...', error)
      const cookieToken = Cookies.get('access_token')
      if (cookieToken) {
        console.log('✅ Token obtido do cookie (fallback)')
        return cookieToken
      } else {
        console.warn('❌ Nenhum token encontrado (fallback)')
        return undefined
      }
    }
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await getCurrentUser()
      return {
        username: user.username,
        email: user.signInDetails?.loginId,
        sub: user.userId,
      }
    } catch (error) {
      // Fallback para cookie
      const userCookie = Cookies.get('user')
      if (userCookie) {
        try {
          return JSON.parse(userCookie)
        } catch (parseError) {
          return null
        }
      }
      return null
    }
  }

  // Decodificar JWT token (método utilitário mantido)
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

  // Verificar se token é válido
  async isTokenValid(): Promise<boolean> {
    try {
      const token = await this.getToken()
      if (!token) return false

      const decoded = this.decodeToken(token)
      if (!decoded || !decoded.exp) return false

      const currentTime = Math.floor(Date.now() / 1000)
      return decoded.exp > currentTime
    } catch (error) {
      return false
    }
  }

  // Obter informações de debug
  getConfig() {
    return {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    }
  }
}

// Instância singleton
export const authService = new AmplifyAuthService()
export default authService