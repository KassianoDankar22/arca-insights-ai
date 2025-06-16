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

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export interface Property {
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
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateRealisticProperties = (): Property[] => {
    const locations = [
      'Lake Nona, Orlando, FL',
      'Downtown Orlando, FL',
      'Winter Garden, FL',
      'Kissimmee, FL',
      'Celebration, FL',
      'Windermere, FL',
      'Dr. Phillips, FL',
      'Winter Park, FL'
    ];

    const propertyTypes = ['Casa', 'Apartamento', 'Townhouse', 'Condominio'];
    const statuses: Array<'available' | 'hot' | 'new'> = ['available', 'hot', 'new'];

    const properties: Property[] = [];

    for (let i = 1; i <= 12; i++) {
      const basePrice = 200000 + Math.random() * 600000; // $200k - $800k
      const monthlyRent = basePrice * (0.006 + Math.random() * 0.004); // 0.6% - 1.0% do valor
      const annualRent = monthlyRent * 12;
      const roi = (annualRent / basePrice) * 100;
      const capRate = roi * (0.7 + Math.random() * 0.3); // 70% - 100% do ROI

      properties.push({
        id: `prop-${i}`,
        title: `${propertyTypes[Math.floor(Math.random() * propertyTypes.length)]} ${i < 4 ? 'de Luxo' : i < 7 ? 'Moderno' : 'Premium'} ${i}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        price: Math.round(basePrice),
        estimatedRoi: Math.round(roi * 10) / 10,
        bedrooms: Math.floor(Math.random() * 4) + 2, // 2-5 quartos
        bathrooms: Math.floor(Math.random() * 3) + 2, // 2-4 banheiros
        parking: Math.floor(Math.random() * 3) + 1, // 1-3 vagas
        hasPool: Math.random() > 0.4, // 60% chance de ter piscina
        imageUrl: `https://images.unsplash.com/photo-${1600000000000 + Math.floor(Math.random() * 100000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `Propriedade ${i < 4 ? 'excepcional' : i < 7 ? 'moderna' : 'premium'} com acabamentos de alta qualidade, localizada em área nobre com excelente potencial de valorização.`,
        monthlyIncome: Math.round(monthlyRent),
        capRate: Math.round(capRate * 10) / 10,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        squareFootage: Math.floor(Math.random() * 2000) + 1500, // 1500-3500 ft²
        yearBuilt: 2015 + Math.floor(Math.random() * 9), // 2015-2023
        lotSize: Math.floor(Math.random() * 5000) + 3000, // 3000-8000 ft²
        created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return properties.sort((a, b) => b.estimatedRoi - a.estimatedRoi); // Ordenar por ROI
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar buscar propriedades reais do Supabase
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);

      if (propertiesError && propertiesError.code !== 'PGRST116') {
        console.error('Erro ao buscar propriedades:', propertiesError);
      }

      // Se não houver propriedades no banco ou houver erro, usar dados realísticos gerados
      if (!propertiesData || propertiesData.length === 0) {
        console.log('📊 Gerando propriedades realísticas para demonstração');
        const realisticProperties = generateRealisticProperties();
        setProperties(realisticProperties);
      } else {
        // Converter dados do Supabase para o formato esperado
        const convertedProperties: Property[] = propertiesData.map((prop: any) => ({
          id: prop.id,
          title: prop.title,
          location: prop.address || 'Orlando, FL',
          price: prop.current_value || prop.purchase_value || 300000,
          estimatedRoi: prop.monthly_rent ? ((prop.monthly_rent * 12) / prop.current_value) * 100 : 8.5,
          bedrooms: 3, // Default values - seria ideal ter esses campos na tabela
          bathrooms: 2,
          parking: 2,
          hasPool: Math.random() > 0.5,
          imageUrl: `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`,
          status: 'available' as const,
          description: prop.title + ' - Propriedade de qualidade com excelente potencial de retorno.',
          monthlyIncome: prop.monthly_rent || (prop.current_value * 0.008),
          capRate: prop.monthly_rent ? ((prop.monthly_rent * 12) / prop.current_value) * 100 * 0.8 : 6.8,
          propertyType: prop.property_type || 'Casa',
          squareFootage: 2500,
          yearBuilt: 2018,
          lotSize: 6000,
          created_at: prop.created_at,
          updated_at: prop.updated_at
        }));

        setProperties(convertedProperties);
        console.log('✅ Propriedades carregadas do Supabase');
      }

    } catch (err: any) {
      console.error('Erro ao carregar propriedades:', err);
      setError(err.message);
      // Em caso de erro, ainda gerar dados realísticos
      const realisticProperties = generateRealisticProperties();
      setProperties(realisticProperties);
    } finally {
      setLoading(false);
    }
  };

  const getTopProperties = (limit: number = 6) => {
    return properties
      .sort((a, b) => b.estimatedRoi - a.estimatedRoi)
      .slice(0, limit);
  };

  const getPropertiesByLocation = (location: string) => {
    return properties.filter(prop => 
      prop.location.toLowerCase().includes(location.toLowerCase())
    );
  };

  const getPropertiesByPriceRange = (minPrice: number, maxPrice: number) => {
    return properties.filter(prop => 
      prop.price >= minPrice && prop.price <= maxPrice
    );
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    getTopProperties,
    getPropertiesByLocation,
    getPropertiesByPriceRange,
    refetch: fetchProperties
  };
}; 