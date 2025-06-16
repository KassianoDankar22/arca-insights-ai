#!/bin/bash

# Script para build e preparação dos arquivos para deploy na Hostinger
# Autor: Arca Insights Team
# Data: 15/05/2024

# Cores para formatação
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Build da Aplicação Arca Insights AI   🚀   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"

# Verifica se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Por favor, instale o Node.js para continuar.${NC}"
    exit 1
fi

# Verifica se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado. Por favor, instale o npm para continuar.${NC}"
    exit 1
fi

# Função para exibir mensagens de etapa
show_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

# 1. Verificar e atualizar dependências
show_step "Verificando e atualizando dependências..."
npm install

# 2. Limpar diretório de build anterior
show_step "Limpando diretório de build anterior..."
rm -rf dist

# 3. Verificar variáveis de ambiente
show_step "Verificando variáveis de ambiente..."
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Arquivo .env.production não encontrado.${NC}"
    echo -e "Criando arquivo .env.production com configurações padrão..."
    echo "VITE_SUPABASE_URL=https://dkykekkdjqajqfyrgqhi.supabase.co" > .env.production
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWtla2tkanFhanFmeXJncWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjk0MjMsImV4cCI6MjA2MjgwNTQyM30.8D_vswzIPdAr5LMCTj0N-HTtiRMWIPIfVcOZP-4GyRo" >> .env.production
    echo -e "${GREEN}✓ Arquivo .env.production criado.${NC}"
else
    echo -e "${GREEN}✓ Arquivo .env.production encontrado.${NC}"
fi

# 4. Verificar .htaccess
show_step "Verificando arquivo .htaccess..."
if [ ! -f public/.htaccess ]; then
    echo -e "${RED}❌ Arquivo .htaccess não encontrado em public/.${NC}"
    echo -e "Criando arquivo .htaccess..."
    mkdir -p public
    cat > public/.htaccess << 'EOL'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
EOL
    echo -e "${GREEN}✓ Arquivo .htaccess criado.${NC}"
else
    echo -e "${GREEN}✓ Arquivo .htaccess encontrado.${NC}"
fi

# 5. Criar build de produção
show_step "Criando build de produção..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao criar build.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build criado com sucesso.${NC}"

# 6. Ajustar caminhos dos assets para relativos
show_step "Ajustando caminhos dos assets para serem relativos..."
sed -i.bak 's|href="/favicon.ico"|href="./favicon.ico"|g' dist/index.html
sed -i.bak 's|src="/assets/|src="./assets/|g' dist/index.html
sed -i.bak 's|href="/assets/|href="./assets/|g' dist/index.html
rm -f dist/index.html.bak
echo -e "${GREEN}✓ Caminhos ajustados.${NC}"

# 7. Resumo do build
echo -e "\n${GREEN}✅ Build da aplicação concluído com sucesso!${NC}"
echo -e "${BLUE}📦 Arquivos gerados:${NC}"
find dist -type f | wc -l | xargs echo "   Total de arquivos:"
du -sh dist | awk '{print "   Tamanho total: " $1}'

echo -e "\n${YELLOW}📋 Próximos passos:${NC}"
echo -e "1. Upload dos arquivos da pasta dist/ para o servidor da Hostinger"
echo -e "2. Configurar CORS no Supabase para o domínio final"
echo -e "3. Testar todas as funcionalidades no ambiente de produção"

echo -e "\n${BLUE}Para mais informações, consulte README-HOSTINGER.md${NC}" 