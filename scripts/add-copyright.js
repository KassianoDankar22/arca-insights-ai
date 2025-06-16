#!/usr/bin/env node

/**
 * Script para adicionar headers de copyright a todos os arquivos do projeto
 * Desenvolvido por: JimmyDev
 * Copyright (c) 2025 JimmyDev. All rights reserved.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COPYRIGHT_HEADER = `/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

`;

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const EXCLUDE_DIRS = ['node_modules', 'dist', '.git', 'build'];
const EXCLUDE_FILES = ['vite.config.ts', 'tailwind.config.js'];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);
  
  return EXTENSIONS.includes(ext) && !EXCLUDE_FILES.includes(fileName);
}

function shouldProcessDir(dirName) {
  return !EXCLUDE_DIRS.includes(dirName);
}

function addCopyrightHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se já tem header de copyright
    if (content.includes('Copyright (c) 2025 JimmyDev')) {
      console.log(`✓ Já protegido: ${filePath}`);
      return;
    }
    
    // Adicionar header no início do arquivo
    const newContent = COPYRIGHT_HEADER + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`🔒 Protegido: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && shouldProcessDir(item)) {
      processDirectory(fullPath);
    } else if (stat.isFile() && shouldProcessFile(fullPath)) {
      addCopyrightHeader(fullPath);
    }
  }
}

console.log('🛡️  Iniciando proteção de copyright...\n');
console.log('📁 Processando diretório: src/');

const srcPath = path.join(path.dirname(__dirname), 'src');
processDirectory(srcPath);

console.log('\n✅ Proteção de copyright concluída!');
console.log('🔒 Todos os arquivos foram protegidos com copyright de JimmyDev'); 