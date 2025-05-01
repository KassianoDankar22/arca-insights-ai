
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import type { FormValues } from './types';

interface FunnelStep1Props {
  form: UseFormReturn<FormValues>;
  onSubmit: () => void;
}

const FunnelStep1: React.FC<FunnelStep1Props> = ({ form, onSubmit }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">
          Informe seus dados para começar
        </h3>
        <p className="text-gray-500">
          Nossa calculadora personalizada ajudará você a entender o retorno do seu investimento
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite seu nome completo" className="h-12" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="seu-email@exemplo.com" className="h-12" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(00) 00000-0000" className="h-12" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4 flex justify-center">
          <Button 
            type="submit"
            className="px-8 py-6 h-auto bg-arca-purple hover:bg-arca-dark-purple text-white rounded-lg flex items-center justify-center gap-2"
          >
            <span>Avançar</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep1;
