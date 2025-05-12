// Define WaxService type directly here instead of importing it
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

export interface PaymentPlan {
  installments: number;
  amount_per_installment: number;
  first_payment_due: number;
}

export interface PrepaidPassRule {
  pass_rule_id: string;
  description: string;
  paid_services: number;
  free_services: number;
}

export interface UnlimitedPassOption {
  pass_type_code: string;
  description: string;
  total_pass_price: number;
  duration_months: number;
  visit_frequency_weeks: number;
  estimated_visits_for_savings_calculation: number;
}

// Utility functions to mock the data API
export const getApplicablePrepaidRules = (service: WaxService): PrepaidPassRule[] => {
  // Mock implementation
  return [
    { pass_rule_id: "B9G3", description: "Buy 9 Get 3", paid_services: 9, free_services: 3 },
    { pass_rule_id: "B6G1", description: "Buy 6 Get 1", paid_services: 6, free_services: 1 }
  ];
};

export const getApplicableUnlimitedOptions = (service: WaxService): UnlimitedPassOption[] => {
  // Mock implementation
  if (!service.is_eligible_for_unlimited_pass) return [];
  
  return [
    { 
      pass_type_code: "12U2", 
      description: "12 Month Unlimited - 2 weeks", 
      total_pass_price: 599, 
      duration_months: 12, 
      visit_frequency_weeks: 2,
      estimated_visits_for_savings_calculation: 24
    },
    { 
      pass_type_code: "12U3", 
      description: "12 Month Unlimited - 3 weeks", 
      total_pass_price: 499, 
      duration_months: 12, 
      visit_frequency_weeks: 3,
      estimated_visits_for_savings_calculation: 18
    }
  ];
};

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

/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Mock city data
export const mockCities = [
  { id: "sf", name: "San Francisco", state: "CA" },
  { id: "la", name: "Los Angeles", state: "CA" },
  { id: "sd", name: "San Diego", state: "CA" },
  { id: "ny", name: "New York", state: "NY" },
  { id: "bk", name: "Brooklyn", state: "NY" },
  { id: "ch", name: "Chicago", state: "IL" },
  { id: "hou", name: "Houston", state: "TX" },
  { id: "aus", name: "Austin", state: "TX" },
  { id: "mia", name: "Miami", state: "FL" },
  { id: "orl", name: "Orlando", state: "FL" },
];

// Mock wax center data by city
export const mockWaxCentersByCity: Record<string, Array<{ id: string; display_name: string }>> = {
  "sf": [
    { id: "249d7b8f-9932-42a8-b4fc-f55e6b2d0670", display_name: "San Francisco - Geary & Masonic" },
    { id: "dcf25fb1-e8cb-4b37-94b4-03a877d90e86", display_name: "San Francisco - Nob Hill" },
    { id: "8f44d8cf-7324-4953-aa52-9ac1e505fbd0", display_name: "San Francisco-Castro-Upr Mkt" },
  ],
  "la": [
    { id: "1e2c6a8f-db56-42e7-b742-a882ef2977dc", display_name: "Los Angeles - Downtown" },
    { id: "a7c43b9e-5a31-4f8d-bdc1-8192e754cf3b", display_name: "Los Angeles - Santa Monica" },
  ],
  "ny": [
    { id: "3f7d2a9b-c854-4e07-8b92-01f2e3a56c9d", display_name: "New York - Manhattan" },
    { id: "5e8b7c2d-9f34-4a12-8e90-6f123e789d0a", display_name: "New York - Upper East Side" },
    { id: "7d6a9f5c-2e84-49b3-a710-85c762e491bd", display_name: "New York - SoHo" },
  ],
  "ch": [
    { id: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d", display_name: "Chicago - The Loop" },
  ],
};

/**
 * Mock function to fetch wax centers for a city
 */
export const fetchWaxCentersForCity = (cityId: string): Promise<Array<{ id: string; display_name: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWaxCentersByCity[cityId] || []);
    }, 500);
  });
};

/**
 * Mock function to fetch nearest wax center based on coordinates
 */
export const fetchNearestWaxCenter = (
  latitude: number, 
  longitude: number
): Promise<{ id: string; display_name: string } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For the demo, just return the first SF center
      resolve(mockWaxCentersByCity["sf"]?.[0] || null);
    }, 800);
  });
};

// API response interfaces
export interface ApiServiceResponse {
  services: ApiService[];
  page_info: null | Record<string, unknown>;
}

export interface ApiService {
  id: string;
  code: string;
  name: string;
  description: string;
  price_info: {
    currency_id: number;
    sale_price: number;
  };
}

/**
 * Mock function to fetch services for a selected wax center
 */
export const fetchServicesForWaxCenter = (
  waxCenterId: string
): Promise<WaxService[]> => {
  return new Promise((resolve) => {
    // Mock API response
    const mockApiResponse: ApiServiceResponse = {
      "services": [
        {
          "id": "71265869-8380-4c46-9d32-642c244dc402",
          "code": "AF",
          "name": "Arms (Full)",
          "description": "Includes the entire length of the arms. Also includes the hands and fingers. (Does not include shoulders.)\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 55.0000
          }
        },
        {
          "id": "7267d1b6-e54d-4efc-9783-14c32125d9ab",
          "code": "AH",
          "name": "Arms (Half)",
          "description": "Includes either the upper or lower arms. Upper arms include everything from the elbows up to the shoulders (does not include the shoulders.) Lower arms include everything from the elbows down, including hands and fingers. \r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 47.0000
          }
        },
        {
          "id": "df1edae9-8ff2-4018-9c06-f0cbcea62632",
          "code": "FB",
          "name": "Back (Full)",
          "description": "Includes the entire length of the back. (Does not include shoulders.)\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 80.0000
          }
        },
        {
          "id": "644150be-b2d7-4b58-8de8-a07ecb08a20c",
          "code": "BL",
          "name": "Back (Lower)",
          "description": "Includes the lower third of the back. \r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 30.0000
          }
        },
        {
          "id": "b8bd79ae-9537-4bc6-abdc-056b1c231bd3",
          "code": "CHF",
          "name": "Chest (Full)",
          "description": "Includes the pectoral muscles starting at the collar bone. Also includes the nipples (Does not include shoulders or stomach.)\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 41.0000
          }
        },
        {
          "id": "62dae9b4-283f-468f-9239-d1b7a3ddb94a",
          "code": "CN",
          "name": "Chin",
          "description": "Includes the chin and lower lip. ",
          "price_info": {
            "currency_id": 148,
            "sale_price": 19.0000
          }
        },
        {
          "id": "dfffcf78-19a7-46c4-88a6-6f1a8ad7f520",
          "code": "EBT",
          "name": "Eyebrow Tint",
          "description": "A semi-permanent eyebrow tinting that adheres even to the tiniest hairs around the brow, delivering a fuller, bolder brow look that lasts approximately 3 weeks. *must be 16 years or older to receive this service.",
          "price_info": {
            "currency_id": 148,
            "sale_price": 20.0000
          }
        },
        {
          "id": "b495be08-156b-476f-9505-1a60b739f079",
          "code": "EB",
          "name": "Eyebrows",
          "description": "Includes eyebrow consultation and shaping complete with waxing, trimming, and tweezing. Also includes filling in the brows with our EWC brow products.",
          "price_info": {
            "currency_id": 148,
            "sale_price": 28.0000
          }
        },
        {
          "id": "97ae898e-e0c8-485d-beb4-fc8a725a1e86",
          "code": "FF",
          "name": "Full Face",
          "description": "Includes the hairline, eyebrows, nose, sideburns, cheeks, upper and lower lip, chin, and front of the neck from the ears forward. (Does not include back of neck.)",
          "price_info": {
            "currency_id": 148,
            "sale_price": 70.0000
          }
        },
        {
          "id": "d5d97023-c67b-4086-ac5f-0ae891d8d6bd",
          "code": "LF",
          "name": "Legs (Full)",
          "description": "Includes upper and lower legs. Also includes the knees, feet, and toes.\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 88.0000
          }
        },
        {
          "id": "54e998b0-6480-49d5-a051-4735cde0be6e",
          "code": "LL",
          "name": "Legs (Lower)",
          "description": "Includes the knees, lower legs, feet, and toes.\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 56.0000
          }
        },
        {
          "id": "eab40722-7943-4f90-9c52-7c08e0720719",
          "code": "LP",
          "name": "Upper Lip",
          "description": "Includes the upper lip. (Does not include the lower lip.)",
          "price_info": {
            "currency_id": 148,
            "sale_price": 18.0000
          }
        },
        {
          "id": "ae714604-5160-428b-a12e-84d559c8dd43",
          "code": "BKB",
          "name": "Brazilian - (V)",
          "description": "For guests with a vagina. Includes the bikini line, a butt strip between the cheeks, and hair off the front—we'll leave as much or as little as you want!\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 77.0000
          }
        },
        {
          "id": "264f6fd0-9e59-420f-bcf3-431e91d0d12c",
          "code": "BKL",
          "name": "Bikini Line - (V)",
          "description": "For guests with a vagina. Includes four finger-widths off the front starting at the natural bikini line, and two finger-widths starting from the top. (Does not include inner thigh.)\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 53.0000
          }
        },
        {
          "id": "c6b5a560-9cf7-4a5c-bcd7-473fe21548e3",
          "code": "UA",
          "name": "Underarms",
          "description": "Includes the underarms.\r\n",
          "price_info": {
            "currency_id": 148,
            "sale_price": 29.0000
          }
        }
      ],
      "page_info": null
    };

    // Convert API response to our WaxService format
    const mappedServices: WaxService[] = mockApiResponse.services.map(apiService => {
      // Determine category based on service name (simplified approach)
      let category = "Other";
      if (apiService.name.includes("Eyebrow") || apiService.name.includes("Lip") || 
          apiService.name.includes("Chin") || apiService.name.includes("Full Face")) {
        category = "Face";
      } else if (apiService.name.includes("Brazilian") || apiService.name.includes("Bikini")) {
        category = "Bikini Area";
      } else if (apiService.name.includes("Legs") || apiService.name.includes("Arms") || 
                apiService.name.includes("Back") || apiService.name.includes("Chest") || 
                apiService.name.includes("Underarms")) {
        category = "Body";
      }

      return {
        service_id: apiService.id,
        service_name: apiService.name,
        category: category,
        standard_price: apiService.price_info.sale_price,
        description: apiService.description,
        is_eligible_for_prepaid_pass: true,
        is_eligible_for_unlimited_pass: ["Eyebrows", "Brazilian", "Bikini Line", "Underarms", "Full Face"].some(
          name => apiService.name.includes(name)
        )
      };
    });

    // Simulate network delay
    setTimeout(() => {
      resolve(mappedServices);
    }, 600);
  });
}; 