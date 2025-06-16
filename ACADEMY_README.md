# 🎓 Arca Academy

Uma plataforma de cursos online para corretores imobiliários com design inspirado no Netflix/Max.

## ✨ Características

### 🎬 Design Estilo Streaming
- **Hero Section** com curso em destaque
- **Layout escuro** com gradientes cinematográficos
- **Animações suaves** com Framer Motion
- **Cards responsivos** com efeitos hover

### 📚 Funcionalidades dos Cursos
- **Categorias dinâmicas** (Fundamentos, Vendas, Marketing, etc.)
- **Sistema de busca** em tempo real
- **Filtros por categoria** com contadores
- **Badges de status** (Novo, Bestseller, Premium)
- **Avaliações e estatísticas** de cada curso

### 🔍 Sistema de Busca e Filtros
- **Busca inteligente** por título, descrição ou instrutor
- **Categorias interativas** com ícones
- **Filtros avançados** (em desenvolvimento)
- **Contadores de cursos** por categoria

### 📊 Estatísticas da Plataforma
- **45+ Cursos** disponíveis
- **8.5k+ Alunos** ativos
- **4.8 Avaliação** média
- **15+ Instrutores** especialistas

## 🚀 Como Acessar

1. Execute o projeto: `npm run dev`
2. Acesse: `http://localhost:5174/academy`
3. Navegue pelos cursos e categorias

## 🎨 Componentes Principais

### AcademyPage
- Componente principal da página
- Gerencia estado de busca e filtros
- Renderiza hero section e grid de cursos

### Course Interface
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  rating: number;
  students: number;
  thumbnail: string;
  category: string;
  price: number;
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}
```

## 🎯 Próximas Funcionalidades

- [ ] **Sistema de Login** e progresso do usuário
- [ ] **Player de vídeo** integrado
- [ ] **Comentários e avaliações** dos alunos
- [ ] **Certificados** de conclusão
- [ ] **Wishlist** de cursos
- [ ] **Modo offline** para download de conteúdo
- [ ] **Integração com pagamento** (Stripe/PagSeguro)
- [ ] **Dashboard do instrutor** para upload de cursos

## 🎨 Paleta de Cores

- **Background**: Gradientes de cinza escuro para preto
- **Primary**: Azul (#3b82f6)
- **Secondary**: Verde (#10b981)
- **Accent**: Amarelo (#f59e0b)
- **Text**: Branco e tons de cinza

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid adaptativo**: 1 coluna no mobile, até 4 no desktop
- **Categorias scrolláveis** horizontalmente no mobile
- **Hero responsivo** com textos adaptativos

## 🔧 Tecnologias Utilizadas

- **React** + TypeScript
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Lucide Icons** para ícones
- **Shadcn/ui** para componentes base

## 🎭 Inspiração Visual

O design foi inspirado em:
- **Netflix** - Grid de conteúdo e cards hover
- **HBO Max** - Hero section e layout escuro
- **Disney+** - Categorias e navegação
- **Udemy** - Informações dos cursos e filtros 