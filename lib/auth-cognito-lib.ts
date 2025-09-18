import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'
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

class CognitoAuthService {
  private userPool: CognitoUserPool

  constructor() {
    // Configuração do User Pool baseada no Client ID
    const poolData = {
      UserPoolId: this.extractUserPoolId(),
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '3u09lmo74ghv8i0n8dretje8p1',
    }
    
    this.userPool = new CognitoUserPool(poolData)
  }

  // Extrair User Pool ID do Client ID (padrão AWS)
  private extractUserPoolId(): string {
    // Para região sa-east-1, o formato típico é sa-east-1_XXXXXXXX
    // Como não temos o User Pool ID exato, vamos usar um padrão baseado na região
    return process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'sa-east-1_XXXXXXXXX'
  }

  // Login com username e password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      const authenticationData = {
        Username: credentials.username,
        Password: credentials.password,
      }

      const authenticationDetails = new AuthenticationDetails(authenticationData)

      const userData = {
        Username: credentials.username,
        Pool: this.userPool,
      }

      const cognitoUser = new CognitoUser(userData)

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          const accessToken = session.getAccessToken().getJwtToken()
          const refreshToken = session.getRefreshToken().getToken()
          
          // Salvar tokens nos cookies
          Cookies.set('access_token', accessToken, {
            expires: 1, // 1 dia
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })

          Cookies.set('refresh_token', refreshToken, {
            expires: 30, // 30 dias
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })

          // Retornar no formato esperado
          resolve({
            AuthenticationResult: {
              AccessToken: accessToken,
              RefreshToken: refreshToken,
              TokenType: 'Bearer',
              ExpiresIn: session.getAccessToken().getExpiration() - Math.floor(Date.now() / 1000),
            }
          })
        },

        onFailure: (error) => {
          console.error('Authentication failed:', error)
          reject(new Error(`Login failed: ${error.message || error}`))
        },

        mfaRequired: (codeDeliveryDetails) => {
          // Por enquanto, rejeitamos MFA - pode ser implementado depois
          reject(new Error('MFA not implemented yet'))
        },

        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // Senha temporária - pode ser implementado depois
          reject(new Error('New password required - not implemented yet'))
        }
      })
    })
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const cognitoUser = this.userPool.getCurrentUser()
      
      if (cognitoUser) {
        cognitoUser.signOut()
      }
      
      // Limpar cookies
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      Cookies.remove('user')
    } catch (error) {
      console.error('Logout error:', error)
      // Limpar cookies mesmo com erro
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      Cookies.remove('user')
    }
  }

  // Verificar se está autenticado
  async isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      const cognitoUser = this.userPool.getCurrentUser()
      
      if (!cognitoUser) {
        resolve(false)
        return
      }

      cognitoUser.getSession((error: any, session: CognitoUserSession | null) => {
        if (error || !session) {
          resolve(false)
          return
        }
        
        resolve(session.isValid())
      })
    })
  }

  // Obter token atual
  async getToken(): Promise<string | undefined> {
    return new Promise((resolve) => {
      const cognitoUser = this.userPool.getCurrentUser()
      
      if (!cognitoUser) {
        resolve(Cookies.get('access_token'))
        return
      }

      cognitoUser.getSession((error: any, session: CognitoUserSession | null) => {
        if (error || !session) {
          resolve(Cookies.get('access_token'))
          return
        }
        
        resolve(session.getAccessToken().getJwtToken())
      })
    })
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const cognitoUser = this.userPool.getCurrentUser()
      
      if (!cognitoUser) {
        resolve(null)
        return
      }

      cognitoUser.getSession((error: any, session: CognitoUserSession | null) => {
        if (error || !session) {
          resolve(null)
          return
        }

        cognitoUser.getUserAttributes((error, attributes) => {
          if (error) {
            // Fallback para dados básicos do token
            const token = session.getAccessToken().getJwtToken()
            const decoded = this.decodeToken(token)
            
            resolve({
              username: cognitoUser.getUsername(),
              sub: decoded?.sub,
              email: decoded?.email,
            })
            return
          }

          const userData: User = {
            username: cognitoUser.getUsername(),
            sub: attributes?.find(attr => attr.getName() === 'sub')?.getValue(),
            email: attributes?.find(attr => attr.getName() === 'email')?.getValue(),
          }

          resolve(userData)
        })
      })
    })
  }

  // Decodificar JWT token
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
    return this.isAuthenticated()
  }

  // Refresh token (automático pelo Cognito)
  async refreshToken(): Promise<string | null> {
    return new Promise((resolve) => {
      const cognitoUser = this.userPool.getCurrentUser()
      
      if (!cognitoUser) {
        resolve(null)
        return
      }

      cognitoUser.getSession((error: any, session: CognitoUserSession | null) => {
        if (error || !session) {
          resolve(null)
          return
        }

        if (session.isValid()) {
          const newToken = session.getAccessToken().getJwtToken()
          
          // Atualizar cookie
          Cookies.set('access_token', newToken, {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
          })
          
          resolve(newToken)
        } else {
          resolve(null)
        }
      })
    })
  }
}

// Instância singleton
export const authService = new CognitoAuthService()
export default authService