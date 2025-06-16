/**
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

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React, { memo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverButton } from "@/components/ui/hover-button";
import { ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AIAgentProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  isNew?: boolean;
  isSponsored?: boolean;
  isHighlight?: boolean;
  isLocked?: boolean;
}

// Componente otimizado com React.memo para evitar re-renderizações desnecessárias
const AIAgentCard: React.FC<AIAgentProps> = memo(({
  id,
  name,
  description,
  icon,
  route,
  isNew,
  isSponsored,
  isHighlight,
  isLocked
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(icon);
  
  // Tentar caminhos alternativos se a imagem falhar
  useEffect(() => {
    // Para o Tom, tentar caminhos alternativos se necessário
    if (id === 'tom-roi' && imageError) {
      if (icon.endsWith('.png')) {
        setImageSrc(icon.replace('.png', '.jpg'));
      } else if (icon.endsWith('.jpg') && icon.startsWith('/')) {
        setImageSrc('.' + icon);
      }
    }
  }, [imageError, icon, id]);
  
  // Preparar classes condicionalmente para evitar recálculos durante a renderização
  const cardClassName = `relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full ${isLocked ? 'bg-gray-800/90 text-gray-300 border-gray-700' : ''}`;
  
  // Estilo específico para a imagem do Tom
  const isTomAgent = id === 'tom-roi';
  const imageClassName = `${isTomAgent ? 'w-full h-full object-cover' : 'w-full h-full object-cover'} ${isLocked ? 'opacity-60' : ''}`;
  
  // Container com bordas específicas para o Tom
  const imageContainerClassName = `${isTomAgent 
    ? 'w-16 h-16 rounded-full border-2 border-arca-blue overflow-hidden mb-2 flex items-center justify-center bg-white shadow-md' 
    : 'w-12 h-12 rounded-lg overflow-hidden mb-2 flex items-center justify-center bg-white'}`;
  
  // Função para lidar com erros de carregamento de imagem
  const handleImageError = () => {
    console.log(`Erro ao carregar imagem: ${imageSrc}`);
    setImageError(true);
  };

  // Renderizar avatar do agente com fallback
  const renderAvatar = () => {
    if (!imageError) {
      return (
        <img
          src={imageSrc}
          alt={`${name} icon`}
          className={imageClassName}
          onError={handleImageError}
          width={isTomAgent ? 64 : 48}
          height={isTomAgent ? 64 : 48}
          loading="eager"
        />
      );
    }
    
    // Fallback com a primeira letra ou ícone específico para o Tom
    if (id === 'tom-roi') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-blue-100 text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs font-bold mt-1">Tom</span>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold">
        {name.charAt(0)}
      </div>
    );
  };
  
  // Renderizar badges de forma otimizada
  const renderBadge = () => {
    if (isNew && !isLocked) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <span className="flex items-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="mr-1">
              <path d="M7.99982 1.33334L10.0598 5.50668L14.6665 6.18001L11.3332 9.42668L12.1198 14.0133L7.99982 11.8467L3.87982 14.0133L4.66649 9.42668L1.33316 6.18001L5.93982 5.50668L7.99982 1.33334Z" fill="currentColor" />
            </svg>
            Novo
          </span>
        </Badge>
      );
    } else if (isSponsored && !isLocked) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <span className="flex items-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="mr-1">
              <path d="M13.3333 2.66667V5.33334H10.6666M2.66667 13.3333V10.6667H5.33333M13.3333 10.6667V13.3333H10.6666M2.66667 5.33334V2.66667H5.33333M8.00001 6.00001C8.00001 6.53044 7.78929 7.03915 7.41422 7.41422C7.03915 7.78929 6.53044 8.00001 6.00001 8.00001C5.46958 8.00001 4.96087 7.78929 4.5858 7.41422C4.21073 7.03915 4.00001 6.53044 4.00001 6.00001C4.00001 5.46958 4.21073 4.96087 4.5858 4.5858C4.96087 4.21073 5.46958 4.00001 6.00001 4.00001C6.53044 4.00001 7.03915 4.21073 7.41422 4.5858C7.78929 4.96087 8.00001 5.46958 8.00001 6.00001ZM12 10C12 10.5304 11.7893 11.0391 11.4142 11.4142C11.0392 11.7893 10.5304 12 10 12C9.46958 12 8.96087 11.7893 8.5858 11.4142C8.21073 11.0391 8.00001 10.5304 8.00001 10C8.00001 9.46958 8.21073 8.96087 8.5858 8.5858C8.96087 8.21073 9.46958 8.00001 10 8.00001C10.5304 8.00001 11.0392 8.21073 11.4142 8.5858C11.7893 8.96087 12 9.46958 12 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Patrocinado
          </span>
        </Badge>
      );
    } else if (isHighlight && !isLocked) {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <span className="flex items-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="mr-1">
              <path d="M14 10L8.00001 13.3333L2 10V2.66667L8.00001 6L14 2.66667V10Z" fill="currentColor" />
            </svg>
            Destaque
          </span>
        </Badge>
      );
    } else if (isLocked) {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
          <span className="flex items-center">
            <Lock size={12} className="mr-1" />
            Premium
          </span>
        </Badge>
      );
    }
    return null;
  };

  // Renderizar botão de forma otimizada
  const renderButton = () => {
    if (!isLocked) {
      return (
        <Link to={route} className="block mt-4">
          <HoverButton className="w-full mt-2 flex items-center justify-center gap-2">
            <span>Acessar</span>
            <ArrowRight size={16} />
          </HoverButton>
        </Link>
      );
    }
    return (
      <button className="w-full mt-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition-colors text-white flex items-center justify-center gap-2">
        <span>Desbloquear</span>
        <Lock size={16} />
      </button>
    );
  };

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className={imageContainerClassName}>
            {renderAvatar()}
          </div>
          <div className="flex-shrink-0">
          {renderBadge()}
          </div>
        </div>
        <CardTitle className="text-lg font-bold mb-1">{name}</CardTitle>
        <CardDescription className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderButton()}
      </CardContent>
    </Card>
  );
});

export default AIAgentCard;