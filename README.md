# Expo Learning - Next.js App

Uma aplicação Next.js moderna criada para fins de aprendizado e experimentação com as melhores práticas de desenvolvimento web, incluindo **autenticação segura com AWS Cognito**.

## 🚀 Tecnologias

- **[Next.js 14](https://nextjs.org/)** - Framework React para produção com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes modernos e acessíveis
- **[AWS Cognito](https://aws.amazon.com/cognito/)** - Autenticação e autorização segura
- **[ESLint](https://eslint.org/)** - Ferramenta de linting para qualidade de código
- **[Prettier](https://prettier.io/)** - Formatador de código automático

## 📦 Instalação

1. Clone o repositório
```bash
git clone <seu-repositorio>
cd expo_learning
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais do AWS Cognito
```

4. Execute o servidor de desenvolvimento
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint
npm run lint:fix     # Executa ESLint e corrige automaticamente
npm run type-check   # Verifica tipos TypeScript
```

## � Autenticação

Esta aplicação implementa autenticação segura usando **AWS Cognito**:

- **Login/Logout** com interface moderna
- **Proteção automática** de rotas
- **Gerenciamento de sessão** com JWT tokens
- **Validação automática** de tokens
- **Redirecionamento inteligente** baseado em estado de autenticação

### Páginas da Aplicação
- `/` - Página inicial (redireciona se autenticado)
- `/login` - Formulário de autenticação
- `/dashboard` - Área protegida (requer login)
- `/about` - Informações sobre o projeto
- `/components` - Demonstração de componentes shadcn/ui

Para mais detalhes sobre autenticação, consulte [AUTHENTICATION.md](./AUTHENTICATION.md).

## �📁 Estrutura do Projeto

```
expo_learning/
├── .github/
│   └── copilot-instructions.md  # Instruções para GitHub Copilot
├── app/                        # App Router do Next.js 13+
│   ├── dashboard/
│   │   └── page.tsx           # Página protegida (dashboard)
│   ├── login/
│   │   └── page.tsx           # Página de login
│   ├── about/
│   │   └── page.tsx           # Página sobre
│   ├── globals.css            # Estilos globais + shadcn/ui
│   ├── layout.tsx             # Layout raiz com AuthProvider
│   └── page.tsx               # Página inicial
├── components/                 # Componentes React reutilizáveis
│   ├── auth/
│   │   └── LoginForm.tsx      # Formulário de login
│   ├── ui/                    # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── alert.tsx
│   └── Header.tsx             # Cabeçalho com logout
├── lib/                       # Utilitários e configurações
│   ├── auth.ts               # Serviço de autenticação
│   ├── auth-context.tsx      # Context de autenticação
│   └── utils.ts              # Funções utilitárias
├── public/                     # Arquivos estáticos
├── .eslintrc.json             # Configuração ESLint
├── .prettierrc                # Configuração Prettier
├── next.config.js             # Configuração Next.js
├── package.json               # Dependências e scripts
├── postcss.config.js          # Configuração PostCSS
├── tailwind.config.js         # Configuração Tailwind
└── tsconfig.json              # Configuração TypeScript
```

## 🎨 Funcionalidades

- ✅ **App Router** - Utiliza o novo sistema de roteamento do Next.js 13+
- ✅ **TypeScript** - Tipagem completa em todo o projeto
- ✅ **Tailwind CSS** - Estilização utilitária moderna
- ✅ **Modo Escuro** - Suporte automático ao tema escuro
- ✅ **ESLint + Prettier** - Qualidade e formatação de código
- ✅ **shadcn/ui Components** - Biblioteca moderna de componentes
- ✅ **AWS Cognito Auth** - Sistema completo de autenticação
- ✅ **Protected Routes** - Proteção automática de páginas
- ✅ **JWT Token Management** - Gerenciamento seguro de tokens
- ✅ **Session Persistence** - Persistência de sessão via cookies
- ✅ **Smart Redirects** - Redirecionamentos baseados em estado de auth

## 🧩 Componentes

### Button
Componente de botão customizável com variantes e tamanhos.

```tsx
import Button from '@/components/Button'

<Button variant="primary" size="md">
  Clique aqui
</Button>
```

### Card
Componente de card para organizar conteúdo.

```tsx
import Card from '@/components/Card'

<Card title="Título" description="Descrição">
  Conteúdo do card
</Card>
```

## 🔧 Configuração

### Tailwind CSS
O projeto está configurado com classes customizadas e suporte a modo escuro automático.

### TypeScript
Configuração completa com path mapping para imports mais limpos:
- `@/*` - Raiz do projeto
- `@/components/*` - Componentes
- `@/lib/*` - Utilitários

### ESLint + Prettier
Configuração otimizada para projetos Next.js com TypeScript.

## 🚀 Deploy

Para fazer deploy da aplicação, você pode usar:

- **[Vercel](https://vercel.com/)** (recomendado para Next.js)
- **[Netlify](https://netlify.com/)**
- **[Railway](https://railway.app/)**

## 📚 Aprendizado

Este projeto foi criado para explorar:
- Next.js 13+ App Router
- TypeScript em projetos React
- Tailwind CSS para estilização
- Configuração de ferramentas de desenvolvimento
- Estruturação de projetos modernos

## 🤝 Contribuição

Sinta-se à vontade para abrir issues e pull requests para melhorias!

## 📝 Licença

Este projeto é para fins educacionais e está disponível sob a licença MIT.