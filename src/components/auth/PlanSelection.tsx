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
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Building2, 
  Calculator,
  BarChart3,
  FileText,
  BookOpen,
  Users,
  Phone,
  Shield,
  Infinity,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Plan {
  id: 'starter' | 'professional' | 'premium';
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  badge?: string;
  badgeColor?: 'default' | 'secondary' | 'destructive';
  popular?: boolean;
  features: string[];
  icon: React.ElementType;
  gradient: string;
  buttonText: string;
  buttonVariant: 'outline' | 'default' | 'secondary';
}

interface PlanSelectionProps {
  onPlanSelected: (planId: string) => void;
  userEmail?: string;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ onPlanSelected, userEmail }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      period: 'Grátis para sempre',
      description: 'Perfeito para começar sua jornada de investimentos',
      features: [
        '10 análises ROI por mês',
        'Relatórios básicos',
        'Suporte por email',
        'Acesso à comunidade',
        'Calculadora básica'
      ],
      icon: Calculator,
      gradient: 'from-blue-500 to-blue-600',
      buttonText: 'Começar Grátis',
      buttonVariant: 'outline'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      originalPrice: 79,
      period: 'por mês',
      description: 'Para investidores sérios que querem mais análises',
      badge: 'Mais Popular',
      badgeColor: 'default',
      popular: true,
      features: [
        'Análises ROI ilimitadas',
        'Relatórios avançados',
        'Comparação de propriedades',
        'Suporte prioritário',
        'Análise de mercado',
        'Exportação de dados',
        'Dashboard personalizado'
      ],
      icon: BarChart3,
      gradient: 'from-emerald-500 to-emerald-600',
      buttonText: 'Escolher Professional',
      buttonVariant: 'default'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 99,
      originalPrice: 149,
      period: 'por mês',
      description: 'Solução completa para investidores profissionais',
      badge: 'Melhor Valor',
      badgeColor: 'secondary',
      features: [
        'Tudo do Professional',
        'Consultoria 1:1 mensal',
        'Análise de portfólio',
        'Alertas de mercado',
        'API personalizada',
        'Suporte 24/7',
        'Acesso à ARCA Academy',
        'Relatórios white-label'
      ],
      icon: Crown,
      gradient: 'from-purple-500 to-purple-600',
      buttonText: 'Escolher Premium',
      buttonVariant: 'secondary'
    }
  ];

  const handlePlanSelection = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Plano ${plans.find(p => p.id === planId)?.name} selecionado com sucesso!`);
      
      // Chamar callback para notificar o componente pai
      onPlanSelected(planId);
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro ao selecionar plano:', error);
      toast.error('Erro ao selecionar plano. Tente novamente.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const PlanCard = ({ plan }: { plan: Plan }) => {
    const isSelected = selectedPlan === plan.id;
    const isProcessing = isLoading && isSelected;

    return (
      <Card 
        className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
          plan.popular 
            ? 'border-emerald-500 shadow-emerald-100 shadow-xl' 
            : 'border-gray-200 hover:border-gray-300'
        } ${isSelected ? 'ring-4 ring-blue-200' : ''}`}
      >
        {/* Badge de destaque */}
        {plan.badge && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <Badge 
              variant={plan.badgeColor} 
              className={`px-4 py-1 text-xs font-semibold ${
                plan.popular ? 'bg-emerald-500 text-white' : ''
              }`}
            >
              {plan.badge}
            </Badge>
          </div>
        )}

        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />

        <CardHeader className="text-center pb-4 relative z-10">
          <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg mb-4`}>
            <plan.icon className="h-8 w-8" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {plan.name}
          </CardTitle>
          
          <div className="mb-3">
            <div className="flex items-center justify-center gap-2">
              {plan.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${plan.originalPrice}
                </span>
              )}
              <span className="text-4xl font-bold text-gray-900">
                ${plan.price}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{plan.period}</p>
          </div>
          
          <CardDescription className="text-gray-600 leading-relaxed">
            {plan.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className={`p-1 rounded-full bg-gradient-to-br ${plan.gradient}`}>
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => handlePlanSelection(plan.id)}
            disabled={isProcessing}
            variant={plan.buttonVariant}
            className={`w-full py-3 font-semibold transition-all duration-300 ${
              plan.popular 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl' 
                : plan.id === 'premium'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                : ''
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {plan.buttonText}
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>

          {plan.id === 'starter' && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Sem cartão de crédito necessário
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ARCA Insights
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o plano perfeito para você
          </h2>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Bem-vindo{userEmail ? `, ${userEmail.split('@')[0]}` : ''}! 
            Selecione o plano que melhor se adapta às suas necessidades de investimento imobiliário.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Seguro e confiável</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Ativação instantânea</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>+1000 investidores</span>
            </div>
          </div>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Recursos adicionais */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              Todos os planos incluem
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg mx-auto w-fit mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Análise ROI com IA</h4>
              <p className="text-sm text-gray-600">Análises precisas powered by OpenAI</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white shadow-lg mx-auto w-fit mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Dashboard Intuitivo</h4>
              <p className="text-sm text-gray-600">Interface moderna e fácil de usar</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg mx-auto w-fit mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Relatórios Detalhados</h4>
              <p className="text-sm text-gray-600">Exportação em PDF e Excel</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-lg mx-auto w-fit mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Suporte Especializado</h4>
              <p className="text-sm text-gray-600">Equipe de especialistas em investimentos</p>
            </div>
          </div>
        </div>

        {/* FAQ rápido */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Tem dúvidas? Entre em contato conosco ou comece com o plano gratuito.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/contact')}
              className="px-6 py-2"
            >
              Falar com especialista
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/faq')}
              className="px-6 py-2"
            >
              Ver FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection; 