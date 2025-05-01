
export interface FormValues {
  condominio: string;
  tipo_investimento: string;
  localizacao: string;
  modelo: string;
  quartos: string;
  piscina: boolean;
  valor_imovel: string;
  entrada_valor: string;
  entrada_percentual: string;
}

export interface ROIAnalysisResult {
  id?: string;
  condominio: string;
  tipo_investimento: string;
  localizacao: string;
  modelo: string;
  quartos: number;
  piscina: boolean;
  valor_imovel: number;
  entrada_valor?: number;
  entrada_percentual?: number;
  resultado_texto?: string;
  criado_em?: string;
}
