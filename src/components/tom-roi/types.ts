
export interface TomRoiFormValues {
  projectName: string;
  location: string;
  modelType: string;
  bedrooms: string;
  hasPool: boolean;
  purchasePrice: string;
}

export interface TomRoiResultData {
  property: {
    value: number;
    downPayment: number;
    financedAmount: number;
    interestRate: number;
    term: number;
  };
  rental: {
    averageRate: number;
    occupancyRate: number;
    monthlyGross: number;
    yearlyGross: number;
  };
  expenses: {
    management: number;
    pool: number;
    utilities: number;
    hoa: number;
    propertyTax: number;
    insurance: number;
    totalMonthly: number;
  };
  roi: {
    netMonthlyIncome: number;
    afterFinancing: number;
    annualAppreciation: number;
    totalAnnual: number;
  };
  formData: TomRoiFormValues;
}
