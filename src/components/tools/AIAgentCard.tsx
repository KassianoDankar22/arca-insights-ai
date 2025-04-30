
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverButton } from "@/components/ui/hover-button";
import { ArrowRight } from 'lucide-react';
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
}

const AIAgentCard: React.FC<AIAgentProps> = ({
  name,
  description,
  icon,
  route,
  isNew,
  isSponsored,
  isHighlight
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-lg overflow-hidden mb-2">
            <img
              src={icon}
              alt={`${name} icon`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {isNew && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="flex items-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="mr-1">
                  <path d="M7.99982 1.33334L10.0598 5.50668L14.6665 6.18001L11.3332 9.42668L12.1198 14.0133L7.99982 11.8467L3.87982 14.0133L4.66649 9.42668L1.33316 6.18001L5.93982 5.50668L7.99982 1.33334Z" fill="currentColor" />
                </svg>
                Novo
              </span>
            </Badge>
          )}
          
          {isSponsored && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <span className="flex items-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="mr-1">
                  <path d="M13.3333 2.66667V5.33334H10.6666M2.66667 13.3333V10.6667H5.33333M13.3333 10.6667V13.3333H10.6666M2.66667 5.33334V2.66667H5.33333M8.00001 6.00001C8.00001 6.53044 7.78929 7.03915 7.41422 7.41422C7.03915 7.78929 6.53044 8.00001 6.00001 8.00001C5.46958 8.00001 4.96087 7.78929 4.5858 7.41422C4.21073 7.03915 4.00001 6.53044 4.00001 6.00001C4.00001 5.46958 4.21073 4.96087 4.5858 4.5858C4.96087 4.21073 5.46958 4.00001 6.00001 4.00001C6.53044 4.00001 7.03915 4.21073 7.41422 4.5858C7.78929 4.96087 8.00001 5.46958 8.00001 6.00001ZM12 10C12 10.5304 11.7893 11.0391 11.4142 11.4142C11.0392 11.7893 10.5304 12 10 12C9.46958 12 8.96087 11.7893 8.5858 11.4142C8.21073 11.0391 8.00001 10.5304 8.00001 10C8.00001 9.46958 8.21073 8.96087 8.5858 8.5858C8.96087 8.21073 9.46958 8.00001 10 8.00001C10.5304 8.00001 11.0392 8.21073 11.4142 8.5858C11.7893 8.96087 12 9.46958 12 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Patrocinado
              </span>
            </Badge>
          )}
          
          {isHighlight && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <span className="flex items-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="mr-1">
                  <path d="M14 10L8.00001 13.3333L2 10V2.66667L8.00001 6L14 2.66667V10Z" fill="currentColor" />
                </svg>
                Destaque
              </span>
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-xl mt-2">{name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Link to={route} className="block mt-4">
          <HoverButton className="w-full mt-2 flex items-center justify-center gap-2">
            <span>Acessar</span>
            <ArrowRight size={16} />
          </HoverButton>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AIAgentCard;
