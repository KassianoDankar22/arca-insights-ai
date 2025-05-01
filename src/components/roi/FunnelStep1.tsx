
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { FormValues } from './types';

interface FunnelStep1Props {
  onSubmit: () => void;
}

const FunnelStep1: React.FC<FunnelStep1Props> = ({ onSubmit }) => {
  const { control } = useFormContext<FormValues>();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold mb-2 text-gray-800`}>
          Informe seus dados para começar
        </h3>
        <p className={`text-gray-500 ${isMobile ? 'text-sm px-3' : ''}`}>
          Nossa calculadora personalizada ajudará você a entender o retorno do seu investimento
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5">
        <div className="space-y-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Seu Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite seu nome completo" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="seu-email@exemplo.com" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-3 flex justify-center">
          <Button 
            type="submit"
            className={`${isMobile ? 'px-6 py-4 text-sm' : 'px-8 py-6'} h-auto bg-arca-purple hover:bg-arca-dark-purple text-white rounded-lg flex items-center justify-center gap-2`}
          >
            <span>Avançar</span>
            <ArrowRight size={isMobile ? 16 : 18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep1;
