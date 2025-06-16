const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// SPA routing - redireciona todas as rotas para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Servidor SPA rodando em http://localhost:${port}`);
  console.log('✅ Todas as rotas redirecionam para index.html');
  console.log('🔧 Use Ctrl+C para parar');
}); 