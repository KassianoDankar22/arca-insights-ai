# Deploy da Aplicação Arca Insights na Hostinger

Este guia resume os passos para fazer deploy da aplicação Arca Insights AI em uma hospedagem compartilhada na Hostinger.

## ✅ Pré-requisitos

- [x] Build da aplicação já criado (`npm run build`)
- [x] Arquivo `.htaccess` configurado na pasta `dist`
- [x] Variáveis de ambiente configuradas no arquivo `.env.production`

## 📋 Passos para o Deploy

### 1. Preparar os Arquivos

O build já foi criado e está na pasta `dist`. Verifique se todos os arquivos estão presentes, incluindo:
- `index.html`
- `.htaccess`
- Pasta `assets` com todos os arquivos JS/CSS

### 2. Upload para a Hostinger

#### Via FTP (recomendado):

1. No painel da Hostinger, navegue até **Hospedagem > Contas FTP**
2. Crie uma nova conta FTP se necessário
3. Use um cliente FTP como FileZilla com os dados fornecidos:
   - Host: seu domínio ou endereço FTP
   - Usuário: fornecido pela Hostinger
   - Senha: definida por você
   - Porta: 21
4. Conecte e faça upload de todo o conteúdo da pasta `dist` para o diretório raiz (`public_html`)

#### Via Gerenciador de Arquivos:

1. No painel da Hostinger, navegue até **Hospedagem > Gerenciador de Arquivos**
2. Navegue até a pasta `public_html`
3. Faça upload de todos os arquivos da pasta `dist`

### 3. Configurar o Supabase

1. No dashboard do Supabase, vá para **Authentication > URL Configuration**
2. Adicione seu domínio na Hostinger como **Site URL**: `https://seudominio.com`
3. Adicione URLs de redirecionamento: `https://seudominio.com/login`

### 4. Verificar a Instalação

Acesse seu domínio e verifique:
- Se a página inicial carrega corretamente
- Se a navegação entre páginas funciona
- Se o login/autenticação está funcionando
- Se as funcionalidades principais estão operando como esperado

### 5. Solução de Problemas Comuns

- **Problema**: Erro 404 ao navegar entre páginas
  **Solução**: Verifique se o `.htaccess` está funcionando corretamente. Se necessário, ative o "mod_rewrite" no painel da Hostinger.

- **Problema**: Assets não carregam
  **Solução**: Verifique os caminhos no `index.html`. Se a aplicação estiver em um subdiretório, pode ser necessário ajustar os caminhos.

- **Problema**: Erros com o Supabase
  **Solução**: Verifique se o CORS está configurado corretamente no Supabase, apontando para seu domínio.

## 🔄 Atualizações Futuras

Para atualizar a aplicação:
1. Faça as modificações no código
2. Recrie o build: `npm run build`
3. Faça upload dos novos arquivos, substituindo os existentes no servidor

## 📚 Documentação Adicional

Para detalhes completos, consulte:
- [hostinger-deploy.md](./hostinger-deploy.md) - Guia detalhado de deploy
- [Documentação oficial da Hostinger](https://support.hostinger.com/en/articles/4455931-how-to-upload-website-to-hostinger)
- [Documentação do Supabase sobre CORS](https://supabase.com/docs/guides/auth/auth-cors) 