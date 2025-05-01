
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import FormHeader from './form/FormHeader';
import PropertyDetailsSection from './form/PropertyDetailsSection';
import PropertyFeaturesSection from './form/PropertyFeaturesSection';
import PriceDetailsSection from './form/PriceDetailsSection';
import SubmitButton from './form/SubmitButton';

interface TomROIFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const TomROIForm: React.FC<TomROIFormProps> = ({ onSubmit, isLoading }) => {
  const { handleSubmit } = useFormContext();
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <FormHeader 
          title="Tom - Análise de ROI para Imóveis"
          description="Olá! Sou o Tom, seu assistente de ROI para imóveis. Vamos começar sua análise. Por favor, preencha os campos abaixo:"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl mx-auto">
          <PropertyDetailsSection />
          <PropertyFeaturesSection />
          <PriceDetailsSection />
          <SubmitButton isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
};

export default TomROIForm;
