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

// Tabela oficial de HOA mensal por condomínio e quartos
// Valores baseados em dados reais de mercado - Orlando/Kissimmee 2024
// Lista dos 20 principais condomínios de casas de férias em Orlando

export interface HOAData {
  condominio: string;
  quartos3: number;
  quartos4: number;
  quartos5: number;
  quartos6Plus: number;
  localizacao: string;
}

export const HOA_TABLE: HOAData[] = [
  {
    condominio: "Solterra Resort",
    quartos3: 400,
    quartos4: 430,
    quartos5: 465,
    quartos6Plus: 500,
    localizacao: "Davenport"
  },
  {
    condominio: "Storey Lake Resort",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Paradise Palms Resort",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "ChampionsGate Resort",
    quartos3: 400,
    quartos4: 430,
    quartos5: 465,
    quartos6Plus: 500,
    localizacao: "Davenport"
  },
  {
    condominio: "Windsor Island Resort",
    quartos3: 730,
    quartos4: 760,
    quartos5: 790,
    quartos6Plus: 810,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Bella Vida Resort",
    quartos3: 250,
    quartos4: 280,
    quartos5: 315,
    quartos6Plus: 350,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Emerald Island Resort",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Bridgewater Crossing",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "Calabria",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "Compass Bay",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Crescent Lakes",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Crystal Cove Resort",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Eagle Pointe",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Encantada Resort",
    quartos3: 250,
    quartos4: 280,
    quartos5: 315,
    quartos6Plus: 350,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Fiesta Key",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Formosa Valley",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Hampton Lakes",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "Indian Creek",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Lake Berkley Resort",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Le Reve",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Liberty Village",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Lindfields",
    quartos3: 250,
    quartos4: 280,
    quartos5: 315,
    quartos6Plus: 350,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Lucaya Village",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Magic Village Views",
    quartos3: 450,
    quartos4: 480,
    quartos5: 515,
    quartos6Plus: 550,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Magic Village Yards",
    quartos3: 450,
    quartos4: 480,
    quartos5: 515,
    quartos6Plus: 550,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Margaritaville Resort Orlando",
    quartos3: 500,
    quartos4: 530,
    quartos5: 565,
    quartos6Plus: 600,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Oakwater Resort",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Paradiso Grande",
    quartos3: 400,
    quartos4: 430,
    quartos5: 465,
    quartos6Plus: 500,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Regal Oaks Resort",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Regal Palms Resort & Spa at Highlands Reserve",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Davenport"
  },
  {
    condominio: "Reunion Resort",
    quartos3: 500,
    quartos4: 580,
    quartos5: 640,
    quartos6Plus: 700,
    localizacao: "Reunion"
  },
  {
    condominio: "Seasons",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Secret Lake Resort",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Solara Resort",
    quartos3: 400,
    quartos4: 430,
    quartos5: 465,
    quartos6Plus: 500,
    localizacao: "Davenport"
  },
  {
    condominio: "Sonoma Resort",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Summerville Resort",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Sunset Lakes",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Terra Esmeralda",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Terra Verde Resort",
    quartos3: 250,
    quartos4: 280,
    quartos5: 315,
    quartos6Plus: 350,
    localizacao: "Kissimmee"
  },
  {
    condominio: "The Enclaves at Festival",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "The Hub at Westside Reserve",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "The Manors at Westridge",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "The Palms at Lake Davenport",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "Veranda Palms",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Villas at Seven Dwarfs",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Vista Cay",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Orlando"
  },
  {
    condominio: "West Lucaya",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Wilshire Oaks",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "Windsor at Westside",
    quartos3: 400,
    quartos4: 430,
    quartos5: 465,
    quartos6Plus: 500,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Windsor Cay",
    quartos3: 485,
    quartos4: 520,
    quartos5: 560,
    quartos6Plus: 600,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Windsor Hills Resort",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Windsor Palms Resort",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Crystal Cove",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Cumbrian Lakes",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Encore Resort at Reunion",
    quartos3: 450,
    quartos4: 480,
    quartos5: 515,
    quartos6Plus: 550,
    localizacao: "Reunion"
  },
  {
    condominio: "Paradise Palms",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Regal Oaks",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Kissimmee"
  },
  {
    condominio: "Reunion",
    quartos3: 500,
    quartos4: 580,
    quartos5: 640,
    quartos6Plus: 700,
    localizacao: "Reunion"
  },
  {
    condominio: "Sandy Ridge",
    quartos3: 300,
    quartos4: 330,
    quartos5: 365,
    quartos6Plus: 400,
    localizacao: "Davenport"
  },
  {
    condominio: "Serenity at Silver Creek",
    quartos3: 350,
    quartos4: 380,
    quartos5: 415,
    quartos6Plus: 450,
    localizacao: "Clermont"
  }
];

// Função para buscar HOA baseado no condomínio e quartos
export const getHOAByCondominiumAndBedrooms = (
  condominio: string, 
  quartos: number
): number | null => {
  // Normalizar nome do condomínio para busca (remover acentos, case insensitive)
  const condominioNormalized = condominio.toLowerCase()
    .replace(/[áàâãä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôõö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .trim();

  // Buscar condomínio na tabela
  const hoaData = HOA_TABLE.find(item => 
    item.condominio.toLowerCase().includes(condominioNormalized) ||
    condominioNormalized.includes(item.condominio.toLowerCase())
  );

  if (!hoaData) {
    return null;
  }

  // Retornar valor baseado no número de quartos
  switch (quartos) {
    case 3:
      return hoaData.quartos3;
    case 4:
      return hoaData.quartos4;
    case 5:
      return hoaData.quartos5;
    case 6:
    default:
      return hoaData.quartos6Plus;
  }
};

// Função para obter estimativa padrão quando condomínio não é encontrado
export const getDefaultHOAByBedrooms = (quartos: number): number => {
  // Valores médios baseados na tabela atualizada acima
  const defaultValues = {
    3: 350, // Média dos 3 quartos
    4: 380, // Média dos 4 quartos  
    5: 415, // Média dos 5 quartos
    6: 450  // Média dos 6+ quartos
  };

  return defaultValues[quartos as keyof typeof defaultValues] || defaultValues[6];
};

// Função para listar todos os condomínios disponíveis
export const getAvailableCondominiums = (): string[] => {
  return HOA_TABLE.map(item => item.condominio);
}; 