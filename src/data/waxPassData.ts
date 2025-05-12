// Service Data
export interface WaxService {
  service_id: string;
  service_name: string;
  category: string;
  standard_price: number;
  description?: string;
  is_eligible_for_prepaid_pass?: boolean;
  is_eligible_for_unlimited_pass?: boolean;
  prepaid_pass_rules_applicable?: string[];
  unlimited_pass_options_available?: string[];
}

// Prepaid Pass Rule Definitions
export interface PrepaidPassRule {
  pass_rule_id: string;
  description: string;
  paid_services: number;
  free_services: number;
}

// Unlimited Pass Option Definitions
export interface UnlimitedPassOption {
  unlimited_pass_config_id: string;
  service_id_fk: string;
  pass_type_code: string;
  description: string;
  total_pass_price: number;
  duration_months: number;
  visit_frequency_weeks: number;
  estimated_visits_for_savings_calculation: number;
}

// Payment plan interface
export interface PaymentPlan {
  installments: number;
  amount_per_installment: number;
  first_payment_due: number;
}

// Selected pass interface for checkout
export interface SelectedPass {
  service_id: string;
  pass_type: 'unlimited' | 'prepaid';
  pass_level: string;
  price: number;
}

// Mock Services Data (From Price Sheet.html)
export const waxServices: WaxService[] = [
  {
    service_id: 'eyebrow',
    service_name: 'Eyebrow Wax',
    category: 'Face',
    standard_price: 25,
    description: 'Shape and define your brows',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true
  },
  {
    service_id: 'lip',
    service_name: 'Lip Wax',
    category: 'Face',
    standard_price: 15,
    description: 'Smooth upper lip waxing',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false
  },
  {
    service_id: 'chin',
    service_name: 'Chin Wax',
    category: 'Face',
    standard_price: 15,
    description: 'Remove unwanted chin hair',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false
  },
  {
    service_id: 'fullface',
    service_name: 'Full Face Wax',
    category: 'Face',
    standard_price: 50,
    description: 'Complete facial waxing treatment',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true
  },
  {
    service_id: 'brazilian',
    service_name: 'Brazilian Wax',
    category: 'Body',
    standard_price: 60,
    description: 'Complete hair removal in the bikini area',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true
  },
  {
    service_id: 'bikini',
    service_name: 'Bikini Wax',
    category: 'Body',
    standard_price: 40,
    description: 'Basic bikini line waxing',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true
  },
  {
    service_id: 'leg-half',
    service_name: 'Half Leg Wax',
    category: 'Body',
    standard_price: 45,
    description: 'Waxing for lower or upper legs',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false
  },
  {
    service_id: 'leg-full',
    service_name: 'Full Leg Wax',
    category: 'Body',
    standard_price: 75,
    description: 'Complete leg waxing treatment',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false
  },
  {
    service_id: 'underarm',
    service_name: 'Underarm Wax',
    category: 'Body',
    standard_price: 20,
    description: 'Smooth underarm hair removal',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true
  },
  {
    service_id: 'back',
    service_name: 'Back Wax',
    category: 'Body',
    standard_price: 55,
    description: 'Full back hair removal',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false
  },
  {
    service_id: 'chest',
    service_name: 'Chest Wax',
    category: 'Body',
    standard_price: 50,
    description: 'Full chest hair removal',
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false
  }
];

// Mock Prepaid Pass Rules
export const prepaidPassRules: PrepaidPassRule[] = [
  {
    pass_rule_id: "B9G3",
    description: "Buy 9, Get 3 Free",
    paid_services: 9,
    free_services: 3
  },
  {
    pass_rule_id: "B9G2",
    description: "Buy 9, Get 2 Free",
    paid_services: 9,
    free_services: 2
  },
  {
    pass_rule_id: "B6G1",
    description: "Buy 6, Get 1 Free",
    paid_services: 6,
    free_services: 1
  }
];

// Mock Unlimited Pass Options
export const unlimitedPassOptions: UnlimitedPassOption[] = [
  // Brazilian options
  {
    unlimited_pass_config_id: "brazilian_12U2",
    service_id_fk: "brazilian",
    pass_type_code: "12U2",
    description: "12 Months Unlimited, visits every 2 weeks",
    total_pass_price: 842,
    duration_months: 12,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 26
  },
  {
    unlimited_pass_config_id: "brazilian_12U3",
    service_id_fk: "brazilian",
    pass_type_code: "12U3",
    description: "12 Months Unlimited, visits every 3 weeks",
    total_pass_price: 594,
    duration_months: 12,
    visit_frequency_weeks: 3,
    estimated_visits_for_savings_calculation: 17
  },
  {
    unlimited_pass_config_id: "brazilian_13U2",
    service_id_fk: "brazilian",
    pass_type_code: "13U2",
    description: "13 Months Unlimited, visits every 2 weeks",
    total_pass_price: 742,
    duration_months: 13,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 28
  },
  {
    unlimited_pass_config_id: "brazilian_13U3",
    service_id_fk: "brazilian",
    pass_type_code: "13U3",
    description: "13 Months Unlimited, visits every 3 weeks",
    total_pass_price: 620,
    duration_months: 13,
    visit_frequency_weeks: 3,
    estimated_visits_for_savings_calculation: 18
  },
  
  // Bikini Full options
  {
    unlimited_pass_config_id: "bikini_full_12U2",
    service_id_fk: "bikini_full",
    pass_type_code: "12U2",
    description: "12 Months Unlimited, visits every 2 weeks",
    total_pass_price: 714,
    duration_months: 12,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 26
  },
  {
    unlimited_pass_config_id: "bikini_full_12U3",
    service_id_fk: "bikini_full",
    pass_type_code: "12U3",
    description: "12 Months Unlimited, visits every 3 weeks",
    total_pass_price: 594,
    duration_months: 12,
    visit_frequency_weeks: 3,
    estimated_visits_for_savings_calculation: 17
  },
  
  // Bikini Line options
  {
    unlimited_pass_config_id: "bikini_line_12U2",
    service_id_fk: "bikini_line",
    pass_type_code: "12U2",
    description: "12 Months Unlimited, visits every 2 weeks",
    total_pass_price: 638,
    duration_months: 12,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 26
  },
  {
    unlimited_pass_config_id: "bikini_line_13U2",
    service_id_fk: "bikini_line",
    pass_type_code: "13U2",
    description: "13 Months Unlimited, visits every 2 weeks",
    total_pass_price: 662,
    duration_months: 13,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 28
  },
  
  // Underarms options
  {
    unlimited_pass_config_id: "underarms_12U2",
    service_id_fk: "underarms",
    pass_type_code: "12U2",
    description: "12 Months Unlimited, visits every 2 weeks",
    total_pass_price: 332,
    duration_months: 12,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 26
  },
  {
    unlimited_pass_config_id: "underarms_12U3",
    service_id_fk: "underarms",
    pass_type_code: "12U3",
    description: "12 Months Unlimited, visits every 3 weeks",
    total_pass_price: 272,
    duration_months: 12,
    visit_frequency_weeks: 3,
    estimated_visits_for_savings_calculation: 17
  },
  
  // Eyebrows options
  {
    unlimited_pass_config_id: "eyebrows_12U2",
    service_id_fk: "eyebrows",
    pass_type_code: "12U2",
    description: "12 Months Unlimited, visits every 2 weeks",
    total_pass_price: 319,
    duration_months: 12,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 26
  },
  {
    unlimited_pass_config_id: "eyebrows_13U3",
    service_id_fk: "eyebrows",
    pass_type_code: "13U3",
    description: "13 Months Unlimited, visits every 3 weeks",
    total_pass_price: 301,
    duration_months: 13,
    visit_frequency_weeks: 3,
    estimated_visits_for_savings_calculation: 18
  },
  
  // Full Face options
  {
    unlimited_pass_config_id: "full_face_12U2",
    service_id_fk: "full_face",
    pass_type_code: "12U2",
    description: "12 Months Unlimited, visits every 2 weeks",
    total_pass_price: 829,
    duration_months: 12,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 26
  },
  {
    unlimited_pass_config_id: "full_face_13U2",
    service_id_fk: "full_face",
    pass_type_code: "13U2",
    description: "13 Months Unlimited, visits every 2 weeks",
    total_pass_price: 861,
    duration_months: 13,
    visit_frequency_weeks: 2,
    estimated_visits_for_savings_calculation: 28
  }
];

// Helper functions
export const getApplicablePrepaidRules = (service: WaxService): PrepaidPassRule[] => {
  if (!service.is_eligible_for_prepaid_pass || !service.prepaid_pass_rules_applicable) {
    return [];
  }
  
  return prepaidPassRules.filter(rule => 
    service.prepaid_pass_rules_applicable?.includes(rule.pass_rule_id)
  );
};

export const getApplicableUnlimitedOptions = (service: WaxService): UnlimitedPassOption[] => {
  if (!service.is_eligible_for_unlimited_pass) {
    return [];
  }
  
  return unlimitedPassOptions.filter(option => 
    option.service_id_fk === service.service_id
  );
}; 