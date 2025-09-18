# Deploy para GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages usando Static Export.

## 🚀 Como fazer o deploy

### 1. **Configurar o repositório no GitHub**

```bash
# Se ainda não tem um repositório
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/expo_learning.git
git push -u origin main
```

### 2. **Configurar GitHub Pages**

1. Vá para **Settings** > **Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. O workflow já está configurado em `.github/workflows/deploy.yml`

### 3. **Configurar variáveis de ambiente (se necessário)**

1. Vá para **Settings** > **Secrets and variables** > **Actions**
2. Adicione as variáveis de ambiente necessárias:
   - `NEXT_PUBLIC_COGNITO_REGION`
   - `NEXT_PUBLIC_COGNITO_CLIENT_ID`
   - etc.

### 4. **Deploy automático**

- Toda vez que você fizer push para `main`, o deploy será automático
- O site estará disponível em: `https://SEU_USUARIO.github.io/expo_learning`

## 🔧 Scripts disponíveis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Deploy manual (local)
npm run deploy
```

## 📝 Configurações importantes

### Static Export configurado
- `output: 'export'` no `next.config.js`
- `images.unoptimized: true` para compatibilidade
- `.nojekyll` para evitar processamento Jekyll

### GitHub Actions
- Build automático no push
- Type checking e linting
- Deploy para GitHub Pages
- Suporte a basePath para subdiretórios

## ⚠️ Limitações do Static Export

1. **Sem Server-Side Features**: 
   - Sem API routes
   - Sem revalidation
   - Sem middleware

2. **Autenticação**: 
   - Funciona apenas client-side
   - AWS Cognito funcionará normalmente
   - Tokens armazenados no browser

3. **Roteamento**:
   - Todas as rotas são estáticas
   - Redirecionamentos funcionam client-side

## 🔗 Links úteis

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages com Next.js](https://nextjs.org/learn/basics/deploying-nextjs-app/github)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Nota**: Lembre-se de atualizar as URLs no arquivo `.env.production.example` com o seu username do GitHub.