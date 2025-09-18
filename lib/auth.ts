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

export interface CognitoUser {
  username: string
  accessToken?: string
  refreshToken?: string
  idToken?: string
}

class CognitoDirectService {
  private baseUrl = process.env.NEXT_PUBLIC_COGNITO_BASE_URL || 'https://cognito-idp.sa-east-1.amazonaws.com/'
  private clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '3u09lmo74ghv8i0n8dretje8p1'
  private region = process.env.NEXT_PUBLIC_COGNITO_REGION || 'sa-east-1'

  // Sobrecarga para aceitar LoginCredentials
  async login(credentials: LoginCredentials): Promise<CognitoUser>
  async login(email: string, password: string): Promise<CognitoUser>
  async login(emailOrCredentials: string | LoginCredentials, password?: string): Promise<CognitoUser> {
    const email = typeof emailOrCredentials === 'string' ? emailOrCredentials : emailOrCredentials.username
    const pass = typeof emailOrCredentials === 'string' ? password! : emailOrCredentials.password
    
    return this.performLogin(email, pass)
  }

  // Login usando a API direta do Cognito IDP com USER_PASSWORD_AUTH
  private async performLogin(email: string, password: string): Promise<CognitoUser> {
    try {
      console.log('🔐 Initiating login for:', email);
      
      const endpoint = `${process.env.NEXT_PUBLIC_COGNITO_ENDPOINT}`;
      console.log('📡 Using endpoint:', endpoint);
      
      // Usando exatamente o payload correto fornecido pelo usuário
      const payload = {
        "AuthFlow": "USER_PASSWORD_AUTH",
        "AuthParameters": {
          "PASSWORD": password,
          "USERNAME": email
        },
        "ClientId": process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
      };
      
      console.log('� Request payload:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📨 Response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.error('❌ Login failed:', data);
        throw new Error(data.message || data.__type || 'Login failed');
      }
      
      if (data.AuthenticationResult) {
        const tokens = data.AuthenticationResult;
        console.log('✅ Login successful! Tokens received:', Object.keys(tokens));
        
        // Store tokens
        if (tokens.AccessToken) {
          Cookies.set('access_token', tokens.AccessToken, { expires: 1 });
        }
        if (tokens.RefreshToken) {
          Cookies.set('refresh_token', tokens.RefreshToken, { expires: 30 });
        }
        if (tokens.IdToken) {
          Cookies.set('id_token', tokens.IdToken, { expires: 1 });
        }
        
        const user: CognitoUser = {
          username: email,
          accessToken: tokens.AccessToken,
          refreshToken: tokens.RefreshToken,
          idToken: tokens.IdToken,
        };
        
        return user;
      } else {
        console.error('❌ No authentication result in response');
        throw new Error('No authentication result received');
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
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
    try {
      const token = Cookies.get('access_token')
      if (!token) {
        return false
      }

      // Verificar se o token não expirou
      const decoded = this.decodeToken(token)
      if (!decoded || !decoded.exp) {
        return false
      }

      const currentTime = Math.floor(Date.now() / 1000)
      return decoded.exp > currentTime
    } catch (error) {
      console.error('Error checking authentication:', error)
      return false
    }
  }

  // Obter token atual
  async getToken(): Promise<string | undefined> {
    return Cookies.get('access_token')
  }

  // Obter usuário atual do token
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken()
      if (!token) {
        return null
      }

      const decoded = this.decodeToken(token)
      if (!decoded) {
        return null
      }

      return {
        username: decoded.username || decoded['cognito:username'] || 'user',
        email: decoded.email,
        sub: decoded.sub,
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
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

  // Método para debug - verificar configuração
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      clientId: this.clientId,
      region: this.region,
      authFlow: 'USER_PASSWORD_AUTH',
      endpoint: `${this.baseUrl}`,
      target: 'AWSCognitoIdentityProviderService.InitiateAuth',
    }
  }

  // Método para testar conectividade
  async testConnectivity() {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
        },
        body: JSON.stringify({
          AccessToken: 'test-token'
        }),
      })
      
      // Status 400 é esperado (token inválido), mas indica que o endpoint responde
      return {
        connected: response.status === 400,
        status: response.status,
        message: response.status === 400 ? 'Endpoint responding correctly' : 'Unexpected response'
      }
    } catch (error) {
      return {
        connected: false,
        status: 0,
        message: `Connection failed: ${error}`
      }
    }
  }
}

// Instância singleton
export const authService = new CognitoDirectService()
export default authService