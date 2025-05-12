// Service Data
export interface WaxService {
  service_id: string;
  service_name: string;
  standard_price: number;
  category: string;
  is_eligible_for_prepaid_pass: boolean;
  is_eligible_for_unlimited_pass: boolean;
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
  service_name: string;
  pass_type_selected: string;
  pass_title_display: string;
  final_total_pass_cost: number;
  selected_payment_plan: PaymentPlan;
  total_savings_achieved_for_this_pass: number;
}

// Mock Services Data (From Price Sheet.html)
export const waxServices: WaxService[] = [
  {
    service_id: "arms_full",
    service_name: "Arms - Full",
    standard_price: 52,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "arms_half",
    service_name: "Arms - Half",
    standard_price: 46,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "back_full",
    service_name: "Back - Full",
    standard_price: 75,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "back_lower",
    service_name: "Back - Lower",
    standard_price: 28,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "bikini_full",
    service_name: "Bikini Full",
    standard_price: 56,
    category: "Bikini Area",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"],
    unlimited_pass_options_available: ["12U2", "12U3", "13U2", "13U3"]
  },
  {
    service_id: "bikini_line",
    service_name: "Bikini Line",
    standard_price: 50,
    category: "Bikini Area",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"],
    unlimited_pass_options_available: ["12U2", "12U3", "13U2", "13U3"]
  },
  {
    service_id: "brazilian",
    service_name: "Brazilian",
    standard_price: 66,
    category: "Bikini Area",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"],
    unlimited_pass_options_available: ["12U2", "12U3", "13U2", "13U3"]
  },
  {
    service_id: "brow_tint",
    service_name: "Brow Tint",
    standard_price: 25,
    category: "Face",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "chin",
    service_name: "Chin",
    standard_price: 15,
    category: "Face",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "eyebrows",
    service_name: "Eyebrows",
    standard_price: 25,
    category: "Face",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"],
    unlimited_pass_options_available: ["12U2", "12U3", "13U2", "13U3"]
  },
  {
    service_id: "full_face",
    service_name: "Full Face",
    standard_price: 65,
    category: "Face",
    is_eligible_for_prepaid_pass: false,
    is_eligible_for_unlimited_pass: true,
    unlimited_pass_options_available: ["12U2", "12U3", "13U2", "13U3"]
  },
  {
    service_id: "legs_full",
    service_name: "Legs - Full",
    standard_price: 80,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "legs_lower",
    service_name: "Legs - Lower",
    standard_price: 52,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "lip_upper",
    service_name: "Lip - Upper",
    standard_price: 14,
    category: "Face",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: false,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"]
  },
  {
    service_id: "underarms",
    service_name: "Underarms",
    standard_price: 26,
    category: "Body",
    is_eligible_for_prepaid_pass: true,
    is_eligible_for_unlimited_pass: true,
    prepaid_pass_rules_applicable: ["B9G3", "B9G2", "B6G1"],
    unlimited_pass_options_available: ["12U2", "12U3", "13U2", "13U3"]
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