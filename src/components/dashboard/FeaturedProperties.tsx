
import React from 'react';
import PropertyCard from './PropertyCard';

const FeaturedProperties: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6">Imóveis em Destaque</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PropertyCard 
          imageUrl="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" 
          title="Casa de Luxo em Winter Garden" 
          location="Winter Garden, Orlando" 
          price="R$ 650.000" 
          bedrooms={4} 
          bathrooms={3} 
          area={280}
          index={0}
        />
        
        <PropertyCard 
          imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60" 
          title="Townhouse em Lake Nona" 
          location="Lake Nona, Orlando" 
          price="R$ 425.000" 
          bedrooms={3} 
          bathrooms={2.5} 
          area={210}
          index={1}
        />
        
        <PropertyCard 
          imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80" 
          title="Apartamento em Brickell" 
          location="Brickell, Miami" 
          price="R$ 780.000" 
          bedrooms={2} 
          bathrooms={2} 
          area={175}
          index={2}
        />
      </div>
    </div>
  );
};

export default FeaturedProperties;
