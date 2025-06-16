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
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Crown, 
  Zap, 
  Building2, 
  Users, 
  Star,
  CreditCard,
  Shield,
  Headphones,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useAnalysisLimits } from '@/hooks/useAnalysisLimits';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  icon: React.ReactNode;
  color: string;
  savings?: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    period: 'para sempre',
    description: 'Perfeito para começar',
    features: [
      '5 análises de ROI totais',
      'Calculadora básica',
      'Export em PDF',
      'Suporte por email',
      'Academy (cursos gratuitos)'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-gray-500'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49.90,
    period: 'mês',
    description: 'Para corretores profissionais',
    features: [
      '20 análises de ROI por mês',
      'Todas as ferramentas avançadas',
      'CRM completo com leads',
      'Arca AI Assistant',
      'Academy completa (45+ cursos)',
      'Relatórios personalizados',
      'Integração WhatsApp',
      'Suporte prioritário'
    ],
    highlighted: true,
    badge: 'MAIS POPULAR',
    icon: <Crown className="w-6 h-6" />,
    color: 'bg-blue-600',
    savings: 'Economia de R$ 120/ano',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.90,
    period: 'mês',
    description: 'Para equipes e imobiliárias',
    features: [
      'Análises de ROI ilimitadas',
      'Até 10 usuários inclusos',
      'Dashboard de gestão',
      'API personalizada',
      'White label disponível',
      'Treinamento exclusivo',
      'Account manager dedicado',
      'SLA de 99.9% uptime'
    ],
    badge: 'EMPRESARIAL',
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-purple-600'
  }
];

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Corretora Senior',
    company: 'Imobiliária Premium',
    content: 'O Arca AI revolucionou minha forma de trabalhar. Fechei 40% mais negócios desde que comecei a usar.',
    rating: 5
  },
  {
    name: 'João Santos',
    role: 'Diretor Comercial',
    company: 'Santos Imóveis',
    content: 'A Academy é fantástica! Minha equipe melhorou muito com os cursos especializados.',
    rating: 5
  },
  {
    name: 'Ana Costa',
    role: 'Corretora Autônoma',
    company: 'Freelancer',
    content: 'Investimento que se paga sozinho. Recomendo para todos os colegas!',
    rating: 5
  }
];

const PlansPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan: currentPlan } = useUserPlan();
  const { planType } = useAnalysisLimits();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  const getPrice = (basePrice: number) => {
    if (selectedPeriod === 'annual' && basePrice > 0) {
      return basePrice * 0.8; // 20% de desconto anual
    }
    return basePrice;
  };

  const handleSelectPlan = (plan: Plan) => {
    // Implemente a lógica para selecionar o plano
    console.log('Selecionando o plano:', plan);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Escolha seu Plano
            </h1>
          </div>
          <p className="text-gray-600">
            Desbloqueie todo o potencial do Arca AI e acelere seus resultados no mercado imobiliário
          </p>
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setSelectedPeriod('monthly')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedPeriod === 'monthly'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setSelectedPeriod('annual')}
          className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
            selectedPeriod === 'annual'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Anual
          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
            -20%
          </Badge>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative ${plan.highlighted ? 'scale-105 z-10' : ''}`}
          >
            <Card className={`h-full border-2 transition-all duration-300 hover:shadow-xl ${
              plan.highlighted 
                ? 'border-blue-500 shadow-2xl' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${plan.color} text-white px-4 py-2 text-sm font-semibold`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${plan.color} text-white mx-auto mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 mt-2">{plan.description}</p>
                
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">
                      R$ {plan.price === 0 ? '0' : getPrice(plan.price).toFixed(0).replace('.', ',')}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/{selectedPeriod === 'annual' ? 'ano' : plan.period}</span>
                    )}
                  </div>
                  {selectedPeriod === 'annual' && plan.price > 0 && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Economia de R$ {(plan.price * 2.4).toFixed(0)} por ano
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Button 
                    className={`w-full h-12 text-lg font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        : plan.id === 'free'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    disabled={plan.id === 'free'}
                  >
                    {plan.id === 'free' ? (
                      'Plano Atual'
                    ) : (
                      <>
                        Escolher {plan.name}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Por que escolher o Arca AI Pro?
          </CardTitle>
          <p className="text-gray-600">
            Recursos premium que farão diferença no seu dia a dia
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                IA Avançada
              </h3>
              <p className="text-gray-600">
                Assistant de IA que analisa mercado e sugere as melhores estratégias para cada cliente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                CRM Completo
              </h3>
              <p className="text-gray-600">
                Gerencie leads, acompanhe negociações e automatize follow-ups de forma inteligente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Academy Premium
              </h3>
              <p className="text-gray-600">
                Acesso completo a 45+ cursos especializados com certificações reconhecidas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Mais de 8.500+ corretores confiam no Arca AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim! Não há fidelidade. Você pode cancelar ou alterar seu plano a qualquer momento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como funciona o período de teste?
              </h3>
              <p className="text-gray-600">
                Oferecemos 7 dias grátis no plano Pro para você testar todas as funcionalidades premium.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Os cursos da Academy têm certificado?
              </h3>
              <p className="text-gray-600">
                Sim! Todos os cursos oferecidos na Academy possuem certificação digital reconhecida pelo CRECI.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlansPage; 