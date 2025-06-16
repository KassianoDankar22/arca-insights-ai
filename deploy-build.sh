#!/bin/bash

# Script de Deploy para ARCA AI
# Automatiza o processo de build e verificação

echo "🚀 Iniciando processo de deploy da ARCA AI..."

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist
rm -rf node_modules/.vite

# Fazer novo build
echo "🔨 Fazendo novo build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Verificar arquivos essenciais
    echo "🔍 Verificando arquivos essenciais..."
    
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html - OK"
    else
        echo "❌ index.html - FALTANDO"
        exit 1
    fi
    
    if [ -f "dist/.htaccess" ]; then
        echo "✅ .htaccess - OK"
    else
        echo "❌ .htaccess - FALTANDO"
        exit 1
    fi
    
    if [ -f "dist/_redirects" ]; then
        echo "✅ _redirects - OK"
    else
        echo "❌ _redirects - FALTANDO"
        exit 1
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ pasta assets - OK"
    else
        echo "❌ pasta assets - FALTANDO"
        exit 1
    fi
    
    # Contar arquivos
    ASSET_COUNT=$(ls -1 dist/assets/*.js | wc -l)
    echo "📊 Arquivos JS: $ASSET_COUNT"
    
    CSS_COUNT=$(ls -1 dist/assets/*.css | wc -l)
    echo "📊 Arquivos CSS: $CSS_COUNT"
    
    echo ""
    echo "🎉 BUILD PRONTO PARA DEPLOY!"
    echo ""
    echo "📁 Arquivos gerados em: ./dist/"
    echo "📤 Para fazer upload, use todos os arquivos da pasta dist/"
    echo ""
    echo "🌍 Rotas configuradas:"
    echo "  ✅ / (Dashboard)"
    echo "  ✅ /ferramentas (Página de Ferramentas)"
    echo "  ✅ /ferramentas/tom (Redireciona para /analise/tom)"
    echo "  ✅ /analise/tom (Tom ROI)"
    echo ""
    echo "⚡ Para testar localmente: npx serve dist -p 3000"
    
else
    echo "❌ Erro no build!"
    exit 1
fi 