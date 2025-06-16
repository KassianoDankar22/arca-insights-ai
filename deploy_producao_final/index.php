<?php
// Fallback para casos onde o servidor não reconhece index.html
// Este arquivo força o servidor a servir o index.html correto

$indexPath = __DIR__ . '/index.html';

if (file_exists($indexPath)) {
    // Define o content-type correto
    header('Content-Type: text/html; charset=UTF-8');
    
    // Lê e exibe o conteúdo do index.html
    readfile($indexPath);
} else {
    // Se não encontrar o index.html, mostra erro
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><title>Erro</title></head><body>';
    echo '<h1>Erro 404</h1><p>Arquivo index.html não encontrado.</p>';
    echo '</body></html>';
}
?> 