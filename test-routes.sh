#!/bin/bash

# Script para testar roteamento SPA
# Testa se todas as rotas retornam 200 e servem o index.html

echo "🧪 TESTANDO ROTEAMENTO SPA"
echo "=========================="

# URL base do servidor
BASE_URL="http://localhost:3000"

# Lista de rotas para testar
ROUTES=(
  "/"
  "/ferramentas"
  "/ferramentas/tom"
  "/analise/tom"
  "/login"
  "/dashboard"
  "/not-existing-route"
)

echo "🔗 URL Base: $BASE_URL"
echo ""

# Função para testar uma rota
test_route() {
  local route=$1
  local url="$BASE_URL$route"
  
  echo -n "Testando $route ... "
  
  # Faz requisição e captura status code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status_code" = "200" ]; then
    echo "✅ OK ($status_code)"
  else
    echo "❌ ERRO ($status_code)"
  fi
}

# Verifica se o servidor está rodando
echo "🔍 Verificando se servidor está ativo..."
if curl -s "$BASE_URL" > /dev/null; then
  echo "✅ Servidor ativo em $BASE_URL"
  echo ""
else
  echo "❌ Servidor não está rodando em $BASE_URL"
  echo "💡 Execute: node serve-spa.js"
  echo ""
  exit 1
fi

# Testa todas as rotas
echo "🚀 Testando todas as rotas:"
echo ""

for route in "${ROUTES[@]}"; do
  test_route "$route"
done

echo ""
echo "✅ Teste concluído!"
echo ""
echo "💡 Dicas:"
echo "  - Todas as rotas devem retornar 200"
echo "  - Se alguma retornar 404, há problema no servidor"
echo "  - Para produção, teste em navegador com F5" 