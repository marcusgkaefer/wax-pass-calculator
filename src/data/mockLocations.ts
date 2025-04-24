
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  passTypes: string[];
}

export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Downtown Center",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    zip: "78701",
    coordinates: {
      lat: 30.2672,
      lng: -97.7431
    },
    phone: "(512) 555-1234",
    hours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "10:00 AM - 5:00 PM"
    },
    services: ["Bikini Line", "Brazilian", "Full Leg", "Half Leg", "Underarm"],
    passTypes: ["unlimited", "prepaid"]
  },
  {
    id: "2",
    name: "Westlake Center",
    address: "456 Lake Drive",
    city: "Austin",
    state: "TX",
    zip: "78746",
    coordinates: {
      lat: 30.2985,
      lng: -97.8001
    },
    phone: "(512) 555-5678",
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 7:00 PM",
      saturday: "9:00 AM - 5:00 PM",
      sunday: "Closed"
    },
    services: ["Bikini Line", "Brazilian", "Full Leg", "Underarm", "Eyebrows"],
    passTypes: ["unlimited", "prepaid"]
  },
  {
    id: "3",
    name: "North Austin Center",
    address: "789 Northern Blvd",
    city: "Austin",
    state: "TX",
    zip: "78758",
    coordinates: {
      lat: 30.3850,
      lng: -97.7011
    },
    phone: "(512) 555-9012",
    hours: {
      monday: "10:00 AM - 7:00 PM",
      tuesday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      thursday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "9:00 AM - 6:00 PM",
      sunday: "11:00 AM - 5:00 PM"
    },
    services: ["Bikini Line", "Brazilian", "Half Leg", "Underarm", "Lip"],
    passTypes: ["unlimited"]
  }
];

export const pricingData = {
  passTypes: [
    { id: "unlimited", name: "Unlimited Pass", description: "Monthly membership with unlimited services" },
    { id: "prepaid", name: "Prepaid Pass", description: "Pre-purchase services at a discount" }
  ],
  packages: [
    { id: "basic", name: "Basic Package", description: "Essential waxing services" },
    { id: "premium", name: "Premium Package", description: "Complete waxing services with extras" }
  ],
  services: [
    { id: "bikini", name: "Bikini Line", basePrice: 35 },
    { id: "brazilian", name: "Brazilian", basePrice: 50 },
    { id: "underarm", name: "Underarm", basePrice: 20 },
    { id: "fullLeg", name: "Full Leg", basePrice: 65 },
    { id: "halfLeg", name: "Half Leg", basePrice: 40 },
    { id: "eyebrows", name: "Eyebrows", basePrice: 22 },
    { id: "lip", name: "Lip", basePrice: 15 }
  ],
  getPrice: (service: string, passType: string, package_: string, locationId: string): number => {
    const baseServices: Record<string, number> = {
      "bikini": 35,
      "brazilian": 50,
      "underarm": 20,
      "fullLeg": 65,
      "halfLeg": 40,
      "eyebrows": 22,
      "lip": 15
    };
    
    const basePrice = baseServices[service] || 30;
    
    // Apply location adjustments
    const locationMultipliers: Record<string, number> = {
      "1": 1.0,   // Downtown (standard price)
      "2": 1.15,  // Westlake (15% higher)
      "3": 0.95   // North Austin (5% lower)
    };
    
    // Apply pass type and package adjustments
    let adjustedPrice = basePrice * (locationMultipliers[locationId] || 1);
    
    if (passType === "unlimited") {
      // Unlimited pass provides a discount
      adjustedPrice *= 0.85;
    }
    
    if (package_ === "premium") {
      // Premium package has slightly higher prices
      adjustedPrice *= 1.1;
    }
    
    return Math.round(adjustedPrice * 100) / 100;
  }
};
