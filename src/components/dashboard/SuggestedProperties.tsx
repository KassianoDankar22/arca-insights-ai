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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Bath, 
  Bed, 
  Car, 
  Waves,
  Star,
  Heart,
  Eye,
  ArrowRight,
  Loader2,
  Flame,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';

interface SuggestedPropertiesProps {
  limit?: number;
}

const SuggestedProperties: React.FC<SuggestedPropertiesProps> = ({ limit = 3 }) => {
  const navigate = useNavigate();
  const { properties, loading, error, getTopProperties } = useProperties();

  // Pegar as melhores propriedades por ROI
  const suggestedProperties = getTopProperties(limit);

  const getStatusBadge = (status: string) => {
    if (status === 'hot') {
      return <Badge variant="destructive" className="text-xs"><Flame className="inline w-3 h-3 mr-1" /> Quente</Badge>;
    } else if (status === 'new') {
      return <Badge variant="secondary" className="text-xs"><Sparkles className="inline w-3 h-3 mr-1" /> Novo</Badge>;
    } else {
      return <Badge variant="outline" className="text-xs"><MapPin className="inline w-3 h-3 mr-1" /> Disponível</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAnalyzeProperty = (property: any) => {
    navigate('/analise/tom', { 
      state: { 
        prefilledData: {
          condominio: property.title,
          localizacao: property.location,
          valor_imovel: property.price.toString(),
          quartos: property.bedrooms.toString(),
          piscina: property.hasPool
        }
      }
    });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Imóveis Sugeridos
          </CardTitle>
          <CardDescription>
            Carregando propriedades selecionadas...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Imóveis Sugeridos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Erro ao carregar propriedades</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Imóveis Sugeridos
            </CardTitle>
            <CardDescription>
              Propriedades selecionadas com base no seu perfil de investimento
              <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                Dados Reais
              </Badge>
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/ferramentas')}>
            Ver Todas
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestedProperties.length === 0 ? (
          <div className="text-center py-8">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma propriedade encontrada</h3>
            <p className="text-gray-500">Aguarde enquanto carregamos as melhores oportunidades para você.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestedProperties.map((property) => (
              <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Imagem da propriedade */}
                  <div className="flex-shrink-0 relative">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  
                  {/* Informações da propriedade */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 truncate">
                          {property.title}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4" />
                          {property.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Métricas principais */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1 text-blue-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">{formatCurrency(property.price)}</span>
                        </div>
                        <p className="text-xs text-blue-600">Preço</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">{property.estimatedRoi}%</span>
                        </div>
                        <p className="text-xs text-green-600">ROI Estimado</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <div className="flex items-center gap-1 text-purple-600">
                          <Star className="h-4 w-4" />
                          <span className="font-semibold">{property.capRate}%</span>
                        </div>
                        <p className="text-xs text-purple-600">Cap Rate</p>
                      </div>
                    </div>
                    
                    {/* Características do imóvel */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.bedrooms} quartos
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.bathrooms} banheiros
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4" />
                        {property.parking} vagas
                      </div>
                      {property.hasPool && (
                        <div className="flex items-center gap-1">
                          <Waves className="h-4 w-4" />
                          Piscina
                        </div>
                      )}
                    </div>
                    
                    {/* Renda mensal e ações */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Renda mensal estimada:
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(property.monthlyIncome)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAnalyzeProperty(property)}
                        >
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Analisar ROI
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => navigate(`/property/${property.id}`, {
                            state: { propertyData: property }
                          })}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedProperties; 