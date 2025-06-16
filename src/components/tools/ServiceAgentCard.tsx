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

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from 'lucide-react';

/**
 * Props para o componente ServiceAgentCard.
 */
export interface ServiceAgentProps {
  /** Identificador único do agente. */
  id: string;
  /** Título ou nome do agente. */
  title: string;
  /** Categoria principal do agente. */
  category: string;
  /** Descrição curta do agente. */
  description: string;
  /** URL da imagem de avatar do agente. */
  avatarUrl: string;
  /** Lista de tags secundárias ou palavras-chave associadas ao agente. */
  tags: string[];
  /** Rota de navegação ao clicar no card. */
  route: string;
}

/**
 * Componente ServiceAgentCard
 * 
 * Renderiza um card de apresentação para um agente de IA ou serviço.
 * Exibe avatar, categoria, título, descrição e tags, sendo totalmente clicável.
 */
const ServiceAgentCard: React.FC<ServiceAgentProps> = ({
  id,
  title,
  category,
  description,
  avatarUrl,
  tags,
  route,
}) => {

  /**
   * Determina o estilo e o ícone para uma tag específica.
   * @param tag A string da tag a ser estilizada.
   * @returns Um objeto contendo `className` para o estilo CSS e, opcionalmente, `isIcon` e `iconName` se a tag tiver um ícone associado.
   */
  const getTagVariant = (tag: string): {className: string, isIcon?: boolean, iconName?: keyof typeof LucideIcons} => {
    const lowerCaseTag = tag.toLowerCase();
    if (lowerCaseTag === 'premium') {
      return { className: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200", isIcon: true, iconName: 'Lock' };
    }
    if (lowerCaseTag === 'novo!') {
      return { className: "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200", isIcon: true, iconName: 'Sparkles' };
    }
    return { className: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200" };
  };

  return (
    <Link to={route} className="block group h-full">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-arca-blue dark:hover:border-arca-blue focus-within:ring-2 focus-within:ring-arca-blue focus-within:ring-offset-2 dark:focus-within:ring-offset-background flex flex-col">
        <CardContent className="p-5 flex flex-col items-start space-y-3 flex-grow">
          {avatarUrl && (
            <div className="w-12 h-12 rounded-lg overflow-hidden mb-2 flex items-center justify-center bg-gray-100 group-hover:ring-2 group-hover:ring-arca-blue/50 transition-all duration-300">
              <img 
                src={avatarUrl} 
                alt={`${title} avatar`} 
                className="w-full h-full object-cover"
                onError={(e) => { 
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = "w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-xl";
                  fallbackDiv.textContent = title.charAt(0).toUpperCase();
                  if(target.parentElement) {
                    target.parentElement.innerHTML = ''; 
                    target.parentElement.appendChild(fallbackDiv);
                  }
                }}
              />
            </div>
          )}
          <p className="text-xs font-semibold text-arca-blue uppercase tracking-wider group-hover:text-arca-dark-blue transition-colors duration-300">
            {category}
          </p>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 group-hover:text-arca-blue transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex-grow min-h-[40px]">
            {description}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
              {tags.map((tag, index) => {
                const tagStyle = getTagVariant(tag);
                const TagIcon = tagStyle.isIcon && tagStyle.iconName ? LucideIcons[tagStyle.iconName] as React.ElementType : null;
                return (
                  <Badge
                    key={`${id}-tag-${index}`}
                    variant="outline"
                    className={`text-xs px-2 py-0.5 ${tagStyle.className}`}
                  >
                    {TagIcon && <TagIcon className="h-3 w-3 mr-1" />}
                    {tag}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceAgentCard; 