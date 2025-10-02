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

## Para reativar GitHub Pages

Se quiser usar GitHub Pages, você precisará:

1. Converter todas as rotas dinâmicas para estáticas
2. Implementar `generateStaticParams()` em cada rota dinâmica
3. Remover todas as chamadas de API em runtime
4. Renomear os arquivos `.disabled` de volta para `.yml`
