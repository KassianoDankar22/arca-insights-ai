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
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturedProperties: React.FC = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-8"
    >
      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex justify-between items-center">
            <span>Imóveis em Destaque</span>
            <button className="text-arca-blue text-xs font-medium hover:underline">
              Ver todos →
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <PropertyCard 
              imageUrl="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" 
              title="Casa de Luxo em Winter Garden" 
              location="Winter Garden, Orlando" 
              price="$650,000" 
              bedrooms={4} 
              bathrooms={3} 
              area={3100}
              index={0}
            />
            
            <PropertyCard 
              imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60" 
              title="Townhouse em Lake Nona" 
              location="Lake Nona, Orlando" 
              price="$425,000" 
              bedrooms={3} 
              bathrooms={2.5} 
              area={2260}
              index={1}
            />
            
            <PropertyCard 
              imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80" 
              title="Apartamento em Brickell" 
              location="Brickell, Miami" 
              price="$780,000" 
              bedrooms={2} 
              bathrooms={2} 
              area={1890}
              index={2}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeaturedProperties;
