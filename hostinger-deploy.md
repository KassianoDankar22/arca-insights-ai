# Guia de Deploy na Hostinger

Este guia explica como implantar a aplicação Arca Insights AI em um servidor compartilhado da Hostinger.

## Pré-requisitos

1. Uma conta na Hostinger com um plano de hospedagem compartilhada
2. Um domínio configurado na Hostinger
3. Acesso ao painel de controle da Hostinger (hPanel)

## Preparando o Projeto para Deploy

### 1. Configurar Variáveis de Ambiente

As variáveis de ambiente já estão configuradas no arquivo `.env.production`. Verifique se elas estão corretas:

```
VITE_SUPABASE_URL=https://dkykekkdjqajqfyrgqhi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWtla2tkanFhanFmeXJncWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjk0MjMsImV4cCI6MjA2MjgwNTQyM30.8D_vswzIPdAr5LMCTj0N-HTtiRMWIPIfVcOZP-4GyRo
```

### 2. Construir o Projeto

Execute o comando para criar a versão de produção:

```bash
npm run build
```

Isso criará uma pasta `dist` com todos os arquivos necessários para o deploy.

## Deploy na Hostinger

### 1. Acessar o Painel de Controle da Hostinger

1. Faça login no [hPanel](https://hpanel.hostinger.com/)
2. Selecione o domínio onde deseja hospedar a aplicação

### 2. Configurar o Diretório Raiz (opcional)

Se desejar hospedar a aplicação em um subdiretório:

1. No hPanel, vá para "Hospedagem" > "Gerenciador de Arquivos"
2. Crie uma pasta (ex: `app`) para hospedar a aplicação
3. Se for hospedar em um subdomínio, configure-o para apontar para esta pasta

### 3. Fazer Upload dos Arquivos

#### Opção 1: Via Gerenciador de Arquivos

1. No hPanel, vá para "Hospedagem" > "Gerenciador de Arquivos"
2. Navegue até o diretório raiz (normalmente `public_html` ou o subdiretório criado)
3. Clique em "Upload" e faça upload de todos os arquivos da pasta `dist` do seu projeto

#### Opção 2: Via FTP (recomendado para muitos arquivos)

1. No hPanel, vá para "Hospedagem" > "Contas FTP"
2. Crie uma nova conta FTP ou use a existente
3. Use um cliente FTP (como FileZilla) para fazer upload:
   - Host: seu domínio ou endereço FTP fornecido
   - Usuário e senha: credenciais FTP
   - Porta: 21 (padrão)
4. Faça upload de todos os arquivos da pasta `dist` para o diretório raiz (normalmente `public_html` ou o subdiretório criado)

### 4. Configurar o arquivo .htaccess

O arquivo `.htaccess` já foi criado na pasta `public` do projeto e será copiado para a pasta `dist` durante o build. Verifique se ele está presente no servidor após o upload.

Este arquivo é essencial para que o roteamento da SPA funcione corretamente, redirecionando todas as rotas para o `index.html`.

Se o arquivo não estiver presente, crie-o manualmente no diretório raiz do servidor com o seguinte conteúdo:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### 5. Configurações do Supabase

Verifique se o CORS está configurado corretamente no Supabase:

1. No dashboard do Supabase, vá para "Authentication" > "URL Configuration"
2. Em "Site URL", adicione o URL do seu site (ex: `https://seudominio.com`)
3. Em "Redirect URLs", adicione as URLs permitidas (ex: `https://seudominio.com/login`)

## Verificação pós-deploy

Após o deploy, verifique:

1. Se a aplicação está carregando corretamente
2. Se a conexão com o Supabase está funcionando
3. Se todas as rotas estão funcionando corretamente (teste a navegação)
4. Se as funcionalidades de autenticação estão operando como esperado

## Solução de Problemas

### Erro 404 ao navegar diretamente para uma rota

- Verifique se o arquivo `.htaccess` está corretamente configurado e presente no diretório raiz
- Certifique-se de que o modo de reescrita (mod_rewrite) está habilitado no servidor

### Problemas de CORS com o Supabase

- Verifique se o domínio correto está adicionado nas configurações de CORS do Supabase
- Certifique-se de que as URLs de redirecionamento estão corretamente configuradas

### Erros de Carregamento de Recursos

- Verifique o Console do navegador para identificar recursos que não estão carregando
- Verifique se os caminhos dos assets estão corretos (podem precisar ser ajustados se a aplicação estiver em um subdiretório)

## Atualizações Futuras

Para atualizar a aplicação:

1. Faça as alterações necessárias no código
2. Execute novamente o build: `npm run build`
3. Faça upload dos novos arquivos, substituindo os existentes no servidor 