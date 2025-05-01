
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface PropertyDetailsCardProps {
  model: string;
  bedrooms: number;
  hasPiscina: boolean;
  propertyValue: number;
  resultText?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ 
  model, 
  bedrooms, 
  hasPiscina, 
  propertyValue,
  resultText,
  cardRef 
}) => {
  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div ref={cardRef}>
      <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-gray-800">Detalhes da Propriedade</h3>
            <p className="text-sm text-gray-500">
              {model} • {bedrooms} quartos • {hasPiscina ? 'Com piscina' : 'Sem piscina'} • {formatCurrency(propertyValue)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="prose prose-blue max-w-none">
          {resultText ? (
            <ReactMarkdown>{resultText}</ReactMarkdown>
          ) : (
            <p className="text-gray-600">Não foi possível carregar o resultado da análise.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyDetailsCard;
