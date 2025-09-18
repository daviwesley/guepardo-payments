import { Amplify } from 'aws-amplify'

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'sa-east-1_ft43eo9cn',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '3u09lmo74ghv8i0n8dretje8p1',
      identityPoolId: '', // Não é necessário para este caso
      loginWith: {
        oauth: {
          domain: 'cognito-idp.sa-east-1.amazonaws.com',
          scopes: ['aws.cognito.signin.user.admin', 'email', 'openid', 'phone', 'profile'],
          redirectSignIn: ['http://localhost:3000/parseauth', 'http://localhost:3001/parseauth', 'http://localhost:3002/parseauth'],
          redirectSignOut: ['http://localhost:3000/login', 'http://localhost:3001/login', 'http://localhost:3002/login'],
          responseType: 'code' as const,
        },
        username: true,
        email: true,
      }
    }
  }
}

export function configureAmplify() {
  Amplify.configure(amplifyConfig)
}

export default amplifyConfig