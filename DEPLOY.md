# Deploy da aplicação Arca Insights ROI

Este documento contém um guia rápido para fazer o deploy desta aplicação React/Vite.

## Opções de Hosting

Recomendamos as seguintes plataformas para hospedagem:

1. **Vercel** (Recomendada) - Fácil integração com Git, suporte nativo para aplicações Vite/React
2. **Netlify** - Similar à Vercel, com UI amigável
3. **GitHub Pages** - Opção gratuita, ideal para projetos pessoais ou demonstrações
4. **Firebase Hosting** - Boa integração com outros serviços do Firebase

## Checklist pré-deploy

- [x] Build testado localmente: `npm run build`
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase: URLs e tokens configurados
- [ ] Configurações de CORS atualizadas no Supabase

## Deploy rápido na Vercel

1. Push do código para um repositório Git (GitHub, GitLab, Bitbucket)
2. Acesse https://vercel.com
3. Clique em "New Project" e selecione o repositório
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Outras variáveis específicas se necessário
5. Clique em "Deploy"

## Suporte

Se encontrar problemas durante o deploy:

1. Verifique os logs na plataforma de hospedagem
2. Confirme se todas as variáveis de ambiente estão corretas
3. Teste a conectividade com o Supabase
4. Verifique as configurações de CORS

---

Para instruções mais detalhadas, consulte o arquivo `deploy-instructions.md` neste repositório. 