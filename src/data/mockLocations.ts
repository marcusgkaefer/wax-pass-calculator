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

// Helper function to generate random coordinates within the US
const getRandomUSCoordinates = () => ({
  lat: 25 + Math.random() * 24, // Between 25-49 latitude (covers most of US)
  lng: -65 - Math.random() * 60  // Between -65 to -125 longitude (covers most of US)
});

const defaultHours = {
  monday: "9:00 AM - 7:00 PM",
  tuesday: "9:00 AM - 7:00 PM",
  wednesday: "9:00 AM - 7:00 PM",
  thursday: "9:00 AM - 7:00 PM",
  friday: "9:00 AM - 8:00 PM",
  saturday: "9:00 AM - 6:00 PM",
  sunday: "10:00 AM - 5:00 PM"
};

// Remove duplicates from the raw data based on CENTER_ID
const rawCenters = [
  {
    "CENTER_ID": "140",
    "CENTER_NAME": "Durham -Southpoint - 0140",
    "CENTER_CODE": "140",
    "STORE_STATE": "North Carolina"
  },
  {
    "CENTER_ID": "426",
    "CENTER_NAME": "Conroe - 0426",
    "CENTER_CODE": "426",
    "STORE_STATE": "Texas"
  },
  {
    "CENTER_ID": "425",
    "CENTER_NAME": "Vacaville - 0425",
    "CENTER_CODE": "425",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "842",
    "CENTER_NAME": "Bound Brook - 0842",
    "CENTER_CODE": "842",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "231",
    "CENTER_NAME": "Hartsdale - 0231",
    "CENTER_CODE": "231",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "815",
    "CENTER_NAME": "Brooklyn - Kings Highway - 0815",
    "CENTER_CODE": "815",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "305",
    "CENTER_NAME": "CL - Chicago - Lincoln Park- 0305",
    "CENTER_CODE": "305",
    "STORE_STATE": "Illinois"
  },
  {
    "CENTER_ID": "176",
    "CENTER_NAME": "Fairfield - 0176",
    "CENTER_CODE": "176",
    "STORE_STATE": "Connecticut"
  },
  {
    "CENTER_ID": "97",
    "CENTER_NAME": "Woodland Hills - 0097",
    "CENTER_CODE": "97",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "27",
    "CENTER_NAME": "Allen - 0027",
    "CENTER_CODE": "27",
    "STORE_STATE": "Texas"
  },
  {
    "CENTER_ID": "183",
    "CENTER_NAME": "Fairlawn - 0183",
    "CENTER_CODE": "183",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "1066",
    "CENTER_NAME": "Sterling - 1066",
    "CENTER_CODE": "1066",
    "STORE_STATE": "Virginia"
  },
  {
    "CENTER_ID": "358",
    "CENTER_NAME": "New York - 57th Street - 0358",
    "CENTER_CODE": "358",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "1005",
    "CENTER_NAME": "Center Valley-Shops at Saucon- 1005",
    "CENTER_CODE": "1005",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "171",
    "CENTER_NAME": "Manhattan Beach - 0171",
    "CENTER_CODE": "171",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "815",
    "CENTER_NAME": "Brooklyn - Kings Highway - 0815",
    "CENTER_CODE": "815",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "257",
    "CENTER_NAME": "Mesa -Red Mountain - 0257",
    "CENTER_CODE": "257",
    "STORE_STATE": "Arizona"
  },
  {
    "CENTER_ID": "1228",
    "CENTER_NAME": "Atlanta - Midtown - 1228",
    "CENTER_CODE": "1228",
    "STORE_STATE": "Georgia"
  },
  {
    "CENTER_ID": "912",
    "CENTER_NAME": "Mobile - 0912",
    "CENTER_CODE": "912",
    "STORE_STATE": "Alabama"
  },
  {
    "CENTER_ID": "325",
    "CENTER_NAME": "Levittown - 0325",
    "CENTER_CODE": "325",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "123",
    "CENTER_NAME": "Minneapolis – Lakes - 0123",
    "CENTER_CODE": "123",
    "STORE_STATE": "Minnesota"
  },
  {
    "CENTER_ID": "826",
    "CENTER_NAME": "Winter Garden - 0826",
    "CENTER_CODE": "826",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "94",
    "CENTER_NAME": "CL - Midland - 0094",
    "CENTER_CODE": "94",
    "STORE_STATE": "Texas"
  },
  {
    "CENTER_ID": "150",
    "CENTER_NAME": "Albuquerque - Paseo Crossing - 0150",
    "CENTER_CODE": "150",
    "STORE_STATE": "New Mexico"
  },
  {
    "CENTER_ID": "599",
    "CENTER_NAME": "Danbury - 0599",
    "CENTER_CODE": "599",
    "STORE_STATE": "Connecticut"
  },
  {
    "CENTER_ID": "491",
    "CENTER_NAME": "Burlington - 0491",
    "CENTER_CODE": "491",
    "STORE_STATE": "Massachusetts"
  },
  {
    "CENTER_ID": "75",
    "CENTER_NAME": "Capitola - 0075",
    "CENTER_CODE": "75",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "62",
    "CENTER_NAME": "Stony Brook - 0062",
    "CENTER_CODE": "62",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "473",
    "CENTER_NAME": "St. Paul - Grand Avenue - 0473",
    "CENTER_CODE": "473",
    "STORE_STATE": "Minnesota"
  },
  {
    "CENTER_ID": "320",
    "CENTER_NAME": "Tulsa - 0320",
    "CENTER_CODE": "320",
    "STORE_STATE": "Oklahoma"
  },
  {
    "CENTER_ID": "765",
    "CENTER_NAME": "Palm Beach Gardens - Mirasol - 0765",
    "CENTER_CODE": "765",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "764",
    "CENTER_NAME": "Asheville - 0764",
    "CENTER_CODE": "764",
    "STORE_STATE": "North Carolina"
  },
  {
    "CENTER_ID": "554",
    "CENTER_NAME": "Palm Beach Gardens - 0554",
    "CENTER_CODE": "554",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "29",
    "CENTER_NAME": "Garwood - 0029",
    "CENTER_CODE": "29",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "833",
    "CENTER_NAME": "Highland - 0833",
    "CENTER_CODE": "833",
    "STORE_STATE": "Indiana"
  },
  {
    "CENTER_ID": "970",
    "CENTER_NAME": "Moore - 0970",
    "CENTER_CODE": "970",
    "STORE_STATE": "Oklahoma"
  },
  {
    "CENTER_ID": "964",
    "CENTER_NAME": "Matthews - Sycamore Commons - 0964",
    "CENTER_CODE": "964",
    "STORE_STATE": "North Carolina"
  },
  {
    "CENTER_ID": "525",
    "CENTER_NAME": "Deerfield Beach - 0525",
    "CENTER_CODE": "525",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "43",
    "CENTER_NAME": "Denville - 0043",
    "CENTER_CODE": "43",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "429",
    "CENTER_NAME": "Littleton - 0429",
    "CENTER_CODE": "429",
    "STORE_STATE": "Colorado"
  },
  {
    "CENTER_ID": "419",
    "CENTER_NAME": "Long Island City - 0419",
    "CENTER_CODE": "419",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "852",
    "CENTER_NAME": "LaGrange - 0852",
    "CENTER_CODE": "852",
    "STORE_STATE": "Illinois"
  },
  {
    "CENTER_ID": "944",
    "CENTER_NAME": "South Falls Church- Barcroft - 0944",
    "CENTER_CODE": "944",
    "STORE_STATE": "Virginia"
  },
  {
    "CENTER_ID": "331",
    "CENTER_NAME": "Woodbury - 0331",
    "CENTER_CODE": "331",
    "STORE_STATE": "Minnesota"
  },
  {
    "CENTER_ID": "427",
    "CENTER_NAME": "Hauppauge - 0427",
    "CENTER_CODE": "427",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "686",
    "CENTER_NAME": "Baton Rouge - Highland Park - 0686",
    "CENTER_CODE": "686",
    "STORE_STATE": "Louisiana"
  },
  {
    "CENTER_ID": "225",
    "CENTER_NAME": "Boston - Historic South E - 0225",
    "CENTER_CODE": "225",
    "STORE_STATE": "Massachusetts"
  },
  {
    "CENTER_ID": "726",
    "CENTER_NAME": "Los Angeles- Wilshire/La Brea- 0726",
    "CENTER_CODE": "726",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "632",
    "CENTER_NAME": "Cottleville - 0632",
    "CENTER_CODE": "632",
    "STORE_STATE": "Missouri"
  },
  {
    "CENTER_ID": "281",
    "CENTER_NAME": "Sunnyvale - 0281",
    "CENTER_CODE": "281",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "920",
    "CENTER_NAME": "Providence - Wayland Ave - 0920",
    "CENTER_CODE": "920",
    "STORE_STATE": "Rhode Island"
  },
  {
    "CENTER_ID": "139",
    "CENTER_NAME": "Lakewood - 0139",
    "CENTER_CODE": "139",
    "STORE_STATE": "Colorado"
  },
  {
    "CENTER_ID": "303",
    "CENTER_NAME": "Chicago - Old Town - 0303",
    "CENTER_CODE": "303",
    "STORE_STATE": "Illinois"
  },
  {
    "CENTER_ID": "21",
    "CENTER_NAME": "Davis - 0021",
    "CENTER_CODE": "21",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "997",
    "CENTER_NAME": "O'Fallon/Shiloh (IL) - 0997",
    "CENTER_CODE": "997",
    "STORE_STATE": "Illinois"
  },
  {
    "CENTER_ID": "500",
    "CENTER_NAME": "Woodmere - Beachwood - 0500",
    "CENTER_CODE": "500",
    "STORE_STATE": "Ohio"
  },
  {
    "CENTER_ID": "76",
    "CENTER_NAME": "Saugus - 0076",
    "CENTER_CODE": "76",
    "STORE_STATE": "Massachusetts"
  },
  {
    "CENTER_ID": "301",
    "CENTER_NAME": "Santa Rosa - 0301",
    "CENTER_CODE": "301",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "15",
    "CENTER_NAME": "Roseville - Rocky Ridge - 0015",
    "CENTER_CODE": "15",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "522",
    "CENTER_NAME": "Vadnais Heights  - 0522",
    "CENTER_CODE": "522",
    "STORE_STATE": "Minnesota"
  },
  {
    "CENTER_ID": "778",
    "CENTER_NAME": "Sarasota - 0778",
    "CENTER_CODE": "778",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "488",
    "CENTER_NAME": "Pittsburgh - Walnut Street - 0488",
    "CENTER_CODE": "488",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "811",
    "CENTER_NAME": "Vernon Hills - 0811",
    "CENTER_CODE": "811",
    "STORE_STATE": "Illinois"
  },
  {
    "CENTER_ID": "1025",
    "CENTER_NAME": "Austin-Aldrich Strt at Mueller-1025",
    "CENTER_CODE": "1025",
    "STORE_STATE": "Texas"
  },
  {
    "CENTER_ID": "572",
    "CENTER_NAME": "McMurray - 0572",
    "CENTER_CODE": "572",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "109",
    "CENTER_NAME": "The Woodlands -Mkt St - 0109",
    "CENTER_CODE": "109",
    "STORE_STATE": "Texas"
  },
  {
    "CENTER_ID": "485",
    "CENTER_NAME": "Easton - 0485",
    "CENTER_CODE": "485",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "59",
    "CENTER_NAME": "Hoboken - 0059",
    "CENTER_CODE": "59",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "13",
    "CENTER_NAME": "Boca Raton - Town Center - 0013",
    "CENTER_CODE": "13",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "246",
    "CENTER_NAME": "Nashville - 0246",
    "CENTER_CODE": "246",
    "STORE_STATE": "Tennessee"
  },
  {
    "CENTER_ID": "183",
    "CENTER_NAME": "Fairlawn - 0183",
    "CENTER_CODE": "183",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "432",
    "CENTER_NAME": "Eagan - 0432",
    "CENTER_CODE": "432",
    "STORE_STATE": "Minnesota"
  },
  {
    "CENTER_ID": "249",
    "CENTER_NAME": "Las Vegas - Centennial Hills - 0249",
    "CENTER_CODE": "249",
    "STORE_STATE": "Nevada"
  },
  {
    "CENTER_ID": "411",
    "CENTER_NAME": "Stoneham - 0411",
    "CENTER_CODE": "411",
    "STORE_STATE": "Massachusetts"
  },
  {
    "CENTER_ID": "1322",
    "CENTER_NAME": "Crystal Lake - Crystal Point - 1322",
    "CENTER_CODE": "1322",
    "STORE_STATE": "Illinois"
  },
  {
    "CENTER_ID": "485",
    "CENTER_NAME": "Easton - 0485",
    "CENTER_CODE": "485",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "725",
    "CENTER_NAME": "Allentown - Hamilton Crossings - 0725",
    "CENTER_CODE": "725",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "455",
    "CENTER_NAME": "Baltimore - Pikesville - 0455",
    "CENTER_CODE": "455",
    "STORE_STATE": "Maryland"
  },
  {
    "CENTER_ID": "246",
    "CENTER_NAME": "Nashville - 0246",
    "CENTER_CODE": "246",
    "STORE_STATE": "Tennessee"
  },
  {
    "CENTER_ID": "701",
    "CENTER_NAME": "West Bloomfield - 0701",
    "CENTER_CODE": "701",
    "STORE_STATE": "Michigan"
  },
  {
    "CENTER_ID": "958",
    "CENTER_NAME": "Ramsey - 0958",
    "CENTER_CODE": "958",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "1099",
    "CENTER_NAME": "Jeffersonville - Town Center - 1099",
    "CENTER_CODE": "1099",
    "STORE_STATE": "Indiana"
  },
  {
    "CENTER_ID": "1029",
    "CENTER_NAME": "Madison - North Madison - 1029",
    "CENTER_CODE": "1029",
    "STORE_STATE": "Alabama"
  },
  {
    "CENTER_ID": "612",
    "CENTER_NAME": "Kansas City - Prairie Village - 0612",
    "CENTER_CODE": "612",
    "STORE_STATE": "Kansas"
  },
  {
    "CENTER_ID": "876",
    "CENTER_NAME": "Rocklin - 0876",
    "CENTER_CODE": "876",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "446",
    "CENTER_NAME": "Hollywood - 0446",
    "CENTER_CODE": "446",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "104",
    "CENTER_NAME": "San Diego - Carmel Mountain - 0104",
    "CENTER_CODE": "104",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "596",
    "CENTER_NAME": "Chattanooga - 0596",
    "CENTER_CODE": "596",
    "STORE_STATE": "Tennessee"
  },
  {
    "CENTER_ID": "69",
    "CENTER_NAME": "East Northport - 0069",
    "CENTER_CODE": "69",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "32",
    "CENTER_NAME": "Gilbert - San Tan Village - 0032",
    "CENTER_CODE": "32",
    "STORE_STATE": "Arizona"
  },
  {
    "CENTER_ID": "144",
    "CENTER_NAME": "Tuscaloosa - 0144",
    "CENTER_CODE": "144",
    "STORE_STATE": "Alabama"
  },
  {
    "CENTER_ID": "498",
    "CENTER_NAME": "Cranberry - 0498",
    "CENTER_CODE": "498",
    "STORE_STATE": "Pennsylvania"
  },
  {
    "CENTER_ID": "13",
    "CENTER_NAME": "Boca Raton - Town Center - 0013",
    "CENTER_CODE": "13",
    "STORE_STATE": "Florida"
  },
  {
    "CENTER_ID": "1299",
    "CENTER_NAME": "Stafford Marketplace - 1299",
    "CENTER_CODE": "1299",
    "STORE_STATE": "Virginia"
  },
  {
    "CENTER_ID": "425",
    "CENTER_NAME": "Vacaville - 0425",
    "CENTER_CODE": "425",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "108",
    "CENTER_NAME": "Shrewsbury - 0108",
    "CENTER_CODE": "108",
    "STORE_STATE": "New Jersey"
  },
  {
    "CENTER_ID": "359",
    "CENTER_NAME": "New York - Chambers St - 0359",
    "CENTER_CODE": "359",
    "STORE_STATE": "New York"
  },
  {
    "CENTER_ID": "97",
    "CENTER_NAME": "Woodland Hills - 0097",
    "CENTER_CODE": "97",
    "STORE_STATE": "California"
  },
  {
    "CENTER_ID": "778",
    "CENTER_NAME": "Sarasota - 0778",
    "CENTER_CODE": "778",
    "STORE_STATE": "Florida"
  }
].filter((center, index, self) => 
  index === self.findIndex((c) => c.CENTER_ID === center.CENTER_ID)
);

export const mockLocations: Location[] = rawCenters.map(center => ({
  id: center.CENTER_ID,
  name: center.CENTER_NAME,
  address: "123 Main Street", // Mock address since not provided in original data
  city: center.CENTER_NAME.split(' - ')[0],
  state: center.STORE_STATE,
  zip: "12345", // Mock zip code since not provided
  coordinates: getRandomUSCoordinates(),
  phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  hours: defaultHours,
  services: [
    "Bikini Line",
    "Brazilian",
    "Full Leg",
    "Half Leg",
    "Underarm"
  ].filter(() => Math.random() > 0.3), // Randomly remove some services
  passTypes: ["unlimited", "prepaid"]
}));

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
