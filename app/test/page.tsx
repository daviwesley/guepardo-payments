'use client'

import { useState } from 'react'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TestConnection() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string>('')

  const testConnection = async () => {
    setTesting(true)
    setResult('')
    
    try {
      const config = authService.getConfig()
      console.log('Config:', config)
      
      // Teste básico de conectividade
      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        },
        body: JSON.stringify({
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            PASSWORD: 'test',
            USERNAME: 'test',
          },
          ClientId: config.clientId,
        }),
      })
      
      const text = await response.text()
      console.log('Response status:', response.status)
      console.log('Response text:', text)
      
      if (response.status === 400) {
        setResult(`✅ Conectividade OK. Endpoint responde corretamente.\nStatus: ${response.status}\nResponse: ${text}`)
      } else {
        setResult(`ℹ️ Resposta inesperada.\nStatus: ${response.status}\nResponse: ${text}`)
      }
    } catch (error) {
      console.error('Test error:', error)
      setResult(`❌ Erro de conexão: ${error}`)
    } finally {
      setTesting(false)
    }
  }

  const testWithCredentials = async () => {
    setTesting(true)
    setResult('')
    
    try {
      await authService.login({
        username: 'neodent@bs.nttdata.com',
        password: 'Nttdata@bl2023'
      })
      setResult('✅ Login realizado com sucesso!')
    } catch (error) {
      console.error('Login test error:', error)
      setResult(`❌ Erro no login: ${error}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Teste de Conectividade Cognito</CardTitle>
          <CardDescription>
            Verifique se a configuração está correta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={testing}
            className="w-full"
          >
            {testing ? 'Testando...' : 'Testar Conectividade'}
          </Button>
          
          <Button 
            onClick={testWithCredentials} 
            disabled={testing}
            className="w-full"
            variant="outline"
          >
            {testing ? 'Testando...' : 'Testar com Credenciais'}
          </Button>
          
          {result && (
            <Alert>
              <AlertDescription className="whitespace-pre-wrap">
                {result}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}