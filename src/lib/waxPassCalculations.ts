import { 
  WaxService, 
  PrepaidPassRule, 
  UnlimitedPassOption,
  getApplicablePrepaidRules,
  getApplicableUnlimitedOptions,
  PaymentPlan
} from '@/data/waxPassData';

// Calculate prepaid pass details
export interface PrepaidPassDetails {
  passRuleId: string;
  description: string;
  totalPassCost: number;
  totalServicesInPass: number;
  discountedPricePerVisit: number;
  savingsPerVisit: number;
  totalSavings: number;
}

export const calculatePrepaidPassDetails = (
  service: WaxService, 
  rule: PrepaidPassRule
): PrepaidPassDetails => {
  const totalPassCost = service.standard_price * rule.paid_services;
  const totalServicesInPass = rule.paid_services + rule.free_services;
  const discountedPricePerVisit = totalPassCost / totalServicesInPass;
  const savingsPerVisit = service.standard_price - discountedPricePerVisit;
  const totalSavings = savingsPerVisit * totalServicesInPass;

  return {
    passRuleId: rule.pass_rule_id,
    description: rule.description,
    totalPassCost,
    totalServicesInPass,
    discountedPricePerVisit,
    savingsPerVisit,
    totalSavings
  };
};

// Calculate unlimited pass details
export interface UnlimitedPassDetails {
  passTypeCode: string;
  description: string;
  totalPassPrice: number;
  durationMonths: number;
  visitFrequencyWeeks: number;
  estimatedVisits: number;
  discountedPricePerVisit: number;
  savingsPerVisit: number;
  totalSavings: number;
}

export const calculateUnlimitedPassDetails = (
  service: WaxService,
  option: UnlimitedPassOption
): UnlimitedPassDetails => {
  const discountedPricePerVisit = option.total_pass_price / option.estimated_visits_for_savings_calculation;
  const savingsPerVisit = service.standard_price - discountedPricePerVisit;
  const totalSavings = savingsPerVisit * option.estimated_visits_for_savings_calculation;

  return {
    passTypeCode: option.pass_type_code,
    description: option.description,
    totalPassPrice: option.total_pass_price,
    durationMonths: option.duration_months,
    visitFrequencyWeeks: option.visit_frequency_weeks,
    estimatedVisits: option.estimated_visits_for_savings_calculation,
    discountedPricePerVisit,
    savingsPerVisit,
    totalSavings
  };
};

// Calculate payment plan options
export const calculatePaymentPlans = (totalCost: number): PaymentPlan[] => {
  return [
    { installments: 1, amount_per_installment: totalCost, first_payment_due: totalCost },
    { installments: 2, amount_per_installment: totalCost / 2, first_payment_due: totalCost / 2 },
    { installments: 3, amount_per_installment: totalCost / 3, first_payment_due: totalCost / 3 },
    { installments: 4, amount_per_installment: totalCost / 4, first_payment_due: totalCost / 4 }
  ];
};

// Get all pass options for a service
export interface ServicePassOptions {
  prepaidOptions: PrepaidPassDetails[];
  unlimitedOptions: UnlimitedPassDetails[];
}

export const getServicePassOptions = (service: WaxService): ServicePassOptions => {
  const prepaidRules = getApplicablePrepaidRules(service);
  const unlimitedOptions = getApplicableUnlimitedOptions(service);

  return {
    prepaidOptions: prepaidRules.map(rule => calculatePrepaidPassDetails(service, rule)),
    unlimitedOptions: unlimitedOptions.map(option => calculateUnlimitedPassDetails(service, option))
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}; 