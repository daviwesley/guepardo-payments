# Workflows Desabilitados

Os workflows de GitHub Pages foram desabilitados porque:

1. A aplicação possui **rotas dinâmicas** (`/cobranca/pix/detail/[pix_id]`)
2. Estas rotas fazem **chamadas de API em runtime**
3. GitHub Pages suporta apenas **sites estáticos** (sem servidor)

## Soluções de Deploy

Para hospedar esta aplicação, use uma das seguintes plataformas que suportam SSR:

### 1. Vercel (Recomendado)
- Deploy automático do GitHub
- Suporte completo a Next.js
- https://vercel.com

### 2. Railway
- Suporte a Docker e Node.js
- https://railway.app

### 3. Render
- Deploy gratuito de Node.js
- https://render.com

### 4. AWS Amplify
- Integração com AWS
- Já está configurado no projeto

## Por que não usar GitHub Pages?

Esta aplicação **NÃO é compatível** com GitHub Pages porque:

1. **Autenticação dinâmica**: AWS Cognito requer runtime para validar tokens
2. **Rotas dinâmicas**: `/cobranca/pix/detail/[pix_id]` com IDs desconhecidos em build time
3. **Chamadas de API**: Todas as páginas fazem fetch de dados em runtime
4. **Client-side rendering**: Hooks como `usePixData`, `usePixTransactions` são executados no cliente

### Tentou implementar `generateStaticParams()`?

Não funcionaria porque:
- Não sabemos todos os `pix_id` possíveis em build time
- Os dados mudam constantemente (novas transações PIX)
- A API requer autenticação que expira
- O período de datas é selecionado pelo usuário dinamicamente

**Conclusão**: Esta é uma aplicação **SSR/ISR** que requer um servidor Node.js. Use Vercel, Railway, Render ou AWS Amplify.
