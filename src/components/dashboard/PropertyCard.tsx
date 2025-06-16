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
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface PropertyCardProps {
  imageUrl: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  imageUrl, 
  title, 
  location, 
  price, 
  bedrooms, 
  bathrooms, 
  area,
  index = 0
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all"
    >
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-900">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-lg font-bold text-arca-blue mb-4">{price}</p>
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed size={14} />
            <span>{bedrooms} {bedrooms === 1 ? 'quarto' : 'quartos'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={14} />
            <span>{bathrooms} {bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={14} />
            <span>{area} sq.ft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
