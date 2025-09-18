# Sistema de Autenticação AWS Cognito

Este arquivo contém informações sobre o sistema de autenticação implementado na aplicação usando **amazon-cognito-identity-js**.

## 🔐 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_CLIENT_ID=3u09lmo74ghv8i0n8dretje8p1
NEXT_PUBLIC_COGNITO_BASE_URL=https://cognito-idp.sa-east-1.amazonaws.com/
NEXT_PUBLIC_COGNITO_REGION=sa-east-1

# AWS Amplify Configuration (extract from actual User Pool)
NEXT_PUBLIC_COGNITO_USER_POOL_ID=sa-east-1_aBcDe12Fg

# Next.js
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-here-change-in-production
```

### Biblioteca Utilizada

**amazon-cognito-identity-js** - Biblioteca oficial da AWS para integração com Cognito User Pools:

```json
{
    "AuthFlow": "USER_PASSWORD_AUTH",
    "AuthParameters": {
        "PASSWORD": "user_password",
        "USERNAME": "user_email"
    },
    "ClientId": "3u09lmo74ghv8i0n8dretje8p1"
}
```

## � Por que amazon-cognito-identity-js?

### Comparação de Bibliotecas:

| Biblioteca | Downloads/Semana | Status | Adequação |
|-----------|------------------|--------|-----------|
| **amazon-cognito-identity-js** | 719k | ✅ Ativa | **🏆 Perfeita** |
| AWS Amplify | 743k | ✅ Ativa | ⚠️ Overkill |
| NextAuth.js | 1.5M | ✅ Ativa | ⚠️ Complexa |

### Vantagens da Implementação Atual:

1. **Específica para Cognito**: Projetada exclusivamente para User Pools
2. **Leve e Focada**: Sem dependências desnecessárias
3. **Controle Total**: Acesso direto às APIs do Cognito
4. **Flexibilidade**: Suporte a fluxos customizados (MFA, senha temporária, etc.)
5. **Maturidade**: Biblioteca testada e estável

## 🛡️ Proteção de Rotas

### Rotas Públicas
- `/` - Página inicial (redireciona se autenticado)
- `/login` - Página de login
- `/about` - Sobre o projeto
- `/components` - Demonstração de componentes

### Rotas Protegidas
- `/dashboard` - Dashboard principal (requer autenticação)

### Como Proteger uma Rota
```typescript
'use client'

import { useRequireAuth } from '@/lib/auth-context'

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useRequireAuth()

  if (isLoading) return <div>Carregando...</div>
  if (!isAuthenticated) return null // Redirecionamento automático

  return <div>Conteúdo protegido</div>
}
```

## 🔧 Serviços Implementados

### AuthService (`lib/auth.ts`)
- **login(credentials)** - Autentica usuário
- **logout()** - Remove tokens e limpa sessão
- **getAppToken()** - Obtém token de aplicação
- **isAuthenticated()** - Verifica se usuário está logado
- **getCurrentUser()** - Retorna dados do usuário atual
- **validateSession()** - Valida sessão atual

### AuthContext (`lib/auth-context.tsx`)
- Gerencia estado global de autenticação
- Prove hooks `useAuth()` e `useRequireAuth()`
- Persiste estado entre recarregamentos

## 🎨 Componentes de UI

### LoginForm
Formulário completo de login com:
- Validação de campos
- Exibição de erros
- Estados de loading
- Interface responsiva

### Header
Cabeçalho com:
- Informações do usuário
- Botão de logout
- Exibido apenas para usuários autenticados

## 📱 Funcionalidades

✅ **Login seguro** com AWS Cognito  
✅ **Logout** com limpeza completa de sessão  
✅ **Proteção automática** de rotas  
✅ **Validação de tokens** JWT  
✅ **Persistência de sessão** via cookies  
✅ **Redirecionamento inteligente** baseado em estado  
✅ **Interface moderna** com shadcn/ui  
✅ **Gerenciamento de estado** global  

## 🔄 Fluxo da Aplicação

1. **Usuário não autenticado**: Página inicial → botão "Login" → formulário de login
2. **Login bem-sucedido**: Token salvo → redirecionamento para dashboard
3. **Usuário autenticado**: Acesso a rotas protegidas + header com logout
4. **Logout**: Tokens removidos → redirecionamento para página inicial
5. **Acesso a rota protegida sem auth**: Redirecionamento automático para login

## ⚠️ Segurança

- Tokens JWT armazenados em cookies seguros
- Validação automática de expiração
- Client secret mantido seguro no servidor
- Cookies com flags de segurança (secure, sameSite)
- Limpeza completa na desconexão

## 🚀 Teste da Aplicação

1. Acesse `http://localhost:3000`
2. Clique em "Fazer Login"
3. Use credenciais válidas do Cognito
4. Navegue pelo dashboard protegido
5. Teste o logout

## 📋 Variáveis de Ambiente

```env
NEXT_PUBLIC_COGNITO_CLIENT_ID=20ldjp2nlgvh8ck1atfdfr54bc
COGNITO_CLIENT_SECRET=d84qm3or21atv8r7tojoape30k7jtitgn3pkob8jdltlenn2b1k
NEXT_PUBLIC_COGNITO_DOMAIN=https://auth-c1be92c0-9057-11ed-a746-06825974e954.auth.sa-east-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_REGION=sa-east-1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-change-in-production
```