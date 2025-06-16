# Deploy do Projeto na Vercel

Este guia mostra como implantar o projeto de análise ROI na plataforma Vercel.

## Pré-requisitos

1. Uma conta na [Vercel](https://vercel.com)
2. Git instalado na sua máquina
3. Seu projeto em um repositório no GitHub, GitLab ou Bitbucket

## Passos para o Deploy

### 1. Prepare o projeto para produção

1. Verifique se todas as variáveis de ambiente estão configuradas corretamente:
   - Crie um arquivo `.env.production` na raiz do projeto (se já não existir)
   - Adicione todas as variáveis necessárias, especialmente as relacionadas ao Supabase:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
VITE_API_URL=url_da_sua_api (se aplicável)
```

2. Teste o build localmente para garantir que tudo está funcionando:

```bash
npm run build
npm run preview
```

### 2. Deploy na Vercel

#### Opção 1: Deploy através do Dashboard da Vercel

1. Faça login na [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório Git
4. Configure as variáveis de ambiente:
   - Na página de configuração do projeto, vá para "Settings" > "Environment Variables"
   - Adicione todas as variáveis do arquivo `.env.production` aqui
5. Clique em "Deploy"

#### Opção 2: Deploy usando a CLI da Vercel

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Autentique na sua conta:
```bash
vercel login
```

3. Deploy do projeto:
```bash
vercel
```

4. Siga as instruções na tela. Quando perguntado sobre variáveis de ambiente, adicione todas as que estão no seu arquivo `.env.production`.

### 3. Configurações adicionais

#### Domínio personalizado (opcional)

1. No dashboard da Vercel, vá para seu projeto
2. Clique em "Settings" > "Domains"
3. Adicione seu domínio personalizado e siga as instruções

#### Configuração de CORS no Supabase

Se estiver usando o Supabase, verifique se as configurações de CORS estão corretas:

1. No dashboard do Supabase, vá para "Settings" > "API"
2. Em "CORS (Cross-Origin Resource Sharing)", adicione o domínio do seu deploy:
   - Para a Vercel: `https://seu-projeto.vercel.app`
   - Seu domínio personalizado, se estiver usando um

## Verificação pós-deploy

Após o deploy, verifique:

1. Se a aplicação está carregando corretamente
2. Se a conexão com o Supabase está funcionando
3. Se todas as funcionalidades estão operando como esperado

Se encontrar problemas, verifique os logs na dashboard da Vercel e as configurações das variáveis de ambiente.

## Atualizações futuras

Para atualizar a aplicação:

1. Faça suas alterações no código
2. Commit e push para o repositório
3. A Vercel detectará automaticamente as mudanças e fará um novo deploy

Você também pode configurar previews automáticos para pull requests no GitHub através das integrações da Vercel. 