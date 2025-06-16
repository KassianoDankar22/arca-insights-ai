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

import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Bath, 
  Bed, 
  Car, 
  Waves,
  Star,
  Heart,
  Share2,
  Calculator,
  Calendar,
  Home,
  Shield,
  Wifi,
  AirVent,
  Zap,
  TreePine,
  Camera,
  Copy,
  Check,
  Flame,
  Sparkles
} from 'lucide-react';

interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  estimatedRoi: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  hasPool: boolean;
  imageUrl: string;
  status: 'available' | 'hot' | 'new';
  description: string;
  monthlyIncome: number;
  capRate: number;
  propertyType: string;
  squareFootage?: number;
  yearBuilt?: number;
  lotSize?: number;
}

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Dados podem vir do state da navegação ou serem buscados por ID
  const propertyData: PropertyData = location.state?.propertyData || {
    id: id || '1',
    title: 'Casa de Luxo em Lake Nona',
    location: 'Lake Nona, Orlando, FL',
    price: 485000,
    estimatedRoi: 12.8,
    bedrooms: 15,
    bathrooms: 3,
    parking: 2,
    hasPool: true,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80',
    status: 'hot',
    description: 'Casa moderna com acabamentos premium em condomínio de alto padrão. Esta propriedade oferece o melhor em luxo e conforto, com vista panorâmica e acabamentos de primeira qualidade.',
    monthlyIncome: 3200,
    capRate: 7.9,
    propertyType: 'Casa',
    squareFootage: 2850,
    yearBuilt: 2019,
    lotSize: 8500
  };

  const additionalImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  // Combinar imagem principal com imagens adicionais
  const allImages = [propertyData.imageUrl, ...additionalImages];
  
  // Estado para controlar qual imagem está sendo exibida
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'hot') {
      return <Badge variant="destructive" className="text-sm"><Flame className="inline w-3 h-3 mr-1" /> Quente</Badge>;
    } else if (status === 'new') {
      return <Badge variant="secondary" className="text-sm"><Sparkles className="inline w-3 h-3 mr-1" /> Novo</Badge>;
    } else {
      return <Badge variant="outline" className="text-sm"><MapPin className="inline w-3 h-3 mr-1" /> Disponível</Badge>;
    }
  };

  const handleAnalyzeROI = () => {
    navigate('/analise/tom', { 
      state: { 
        prefilledData: {
          condominio: propertyData.title,
          localizacao: propertyData.location,
          valor_imovel: propertyData.price.toString(),
          quartos: propertyData.bedrooms.toString(),
          piscina: propertyData.hasPool
        }
      }
    });
  };

  // Função para trocar a imagem principal
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Função para compartilhar a propriedade
  const handleShare = async () => {
    const shareData = {
      title: propertyData.title,
      text: `Confira esta propriedade: ${propertyData.title} - ${formatCurrency(propertyData.price)} | ROI: ${propertyData.estimatedRoi}%`,
      url: window.location.href
    };

    try {
      // Tentar usar Web Share API (principalmente mobile)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Propriedade compartilhada com sucesso!');
      } else {
        // Fallback: copiar link para área de transferência
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para área de transferência!', {
          description: 'Cole o link onde quiser compartilhar esta propriedade.'
        });
      }
    } catch (error) {
      // Se tudo falhar, mostrar o link para o usuário
      console.error('Erro ao compartilhar:', error);
      toast.error('Não foi possível compartilhar automaticamente', {
        description: `Copie este link: ${window.location.href}`,
        duration: 5000
      });
    }
  };

  const amenities = [
    { icon: Wifi, label: 'Wi-Fi Incluído' },
    { icon: AirVent, label: 'Ar Condicionado' },
    { icon: Shield, label: 'Segurança 24h' },
    { icon: TreePine, label: 'Área Verde' },
    { icon: Zap, label: 'Sistema Smart' },
    { icon: Camera, label: 'Monitoramento' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Favoritar</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Título Mobile */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{propertyData.title}</h1>
          <div className="flex items-center gap-1 text-gray-500 mb-4">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{propertyData.location}</span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            {getStatusBadge(propertyData.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagem Principal */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={allImages[currentImageIndex]}
                  alt={propertyData.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  {getStatusBadge(propertyData.status)}
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} de {allImages.length} fotos
                </div>
              </div>
            </Card>

            {/* Galeria de Imagens */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Galeria de Fotos</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {allImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      currentImageIndex === index 
                        ? 'ring-2 ring-blue-500 ring-offset-2' 
                        : 'hover:opacity-75'
                    }`}
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={image}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {currentImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <Camera className="h-3 w-3" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Descrição */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Sobre a Propriedade</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {propertyData.description}
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Área</p>
                  <p className="font-semibold">{propertyData.squareFootage} ft²</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Construído</p>
                  <p className="font-semibold">{propertyData.yearBuilt}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <TreePine className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-sm text-gray-600">Terreno</p>
                  <p className="font-semibold">{propertyData.lotSize} ft²</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-semibold">{propertyData.propertyType}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Comodidades</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <amenity.icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações Básicas */}
            <Card className="p-6">
              <div className="mb-6 hidden lg:block">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{propertyData.title}</h1>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{propertyData.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mb-6 lg:mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xl lg:text-2xl font-bold text-blue-600">{formatCurrency(propertyData.price)}</p>
                  <p className="text-sm text-gray-600">Preço</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xl lg:text-2xl font-bold text-green-600">{propertyData.estimatedRoi}%</p>
                  <p className="text-sm text-gray-600">ROI Estimado</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm">{propertyData.bedrooms} quartos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm">{propertyData.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm">{propertyData.parking} vagas</span>
                  </div>
                  {propertyData.hasPool && (
                    <div className="flex items-center gap-2">
                      <Waves className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Piscina</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Análise Financeira */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Análise Financeira</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Renda Mensal Estimada:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(propertyData.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Cap Rate:</span>
                  <span className="font-semibold">{propertyData.capRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Renda Anual:</span>
                  <span className="font-semibold">{formatCurrency(propertyData.monthlyIncome * 12)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-gray-600 text-sm">Yield Anual:</span>
                  <span className="font-semibold text-blue-600">{((propertyData.monthlyIncome * 12 / propertyData.price) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </Card>

            {/* Ações */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleAnalyzeROI}
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Analisar ROI Completo</span>
                  <span className="sm:hidden">Analisar ROI</span>
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Agendar Visita</span>
                  <span className="sm:hidden">Agendar</span>
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Solicitar Mais Informações</span>
                  <span className="sm:hidden">Mais Info</span>
                </Button>
              </div>
            </Card>

            {/* Localização */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Localização</h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Mapa interativo</p>
                  <p className="text-xs">{propertyData.location}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 