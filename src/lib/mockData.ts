import { ZenotiCenter, ZenotiService } from './zenotiApi';

// Mock Zenoti Centers data
export const mockCenters: ZenotiCenter[] = [
  {
    id: 'mock-center-1',
    name: 'Wax Center Downtown',
    short_name: 'WC Downtown',
    display_name: 'Wax Center - Downtown Location',
    address_info: {
      address1: '123 Main Street',
      city: 'New York',
      state_info: {
        code: 'NY',
        name: 'New York'
      },
      zip_code: '10001',
      country_info: {
        code: 'US',
        name: 'United States'
      }
    },
    state: {
      code: 'NY',
      name: 'New York'
    },
    working_hours: [
      { day_of_week: 0, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 1, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 2, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 3, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 4, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 5, start_time: '10:00', end_time: '18:00', is_closed: false },
      { day_of_week: 6, start_time: '10:00', end_time: '18:00', is_closed: false }
    ],
    phone: '(212) 555-0100',
    email: 'downtown@waxcenter.com',
    timezone: 'America/New_York',
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: 'mock-center-2',
    name: 'Wax Center Midtown',
    short_name: 'WC Midtown',
    display_name: 'Wax Center - Midtown Location',
    address_info: {
      address1: '456 Park Avenue',
      city: 'New York',
      state_info: {
        code: 'NY',
        name: 'New York'
      },
      zip_code: '10022',
      country_info: {
        code: 'US',
        name: 'United States'
      }
    },
    state: {
      code: 'NY',
      name: 'New York'
    },
    working_hours: [
      { day_of_week: 0, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 1, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 2, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 3, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 4, start_time: '09:00', end_time: '20:00', is_closed: false },
      { day_of_week: 5, start_time: '10:00', end_time: '18:00', is_closed: false },
      { day_of_week: 6, start_time: '10:00', end_time: '18:00', is_closed: false }
    ],
    phone: '(212) 555-0200',
    email: 'midtown@waxcenter.com',
    timezone: 'America/New_York',
    latitude: 40.7614,
    longitude: -73.9776
  },
  {
    id: 'mock-center-3',
    name: 'Wax Center Brooklyn',
    short_name: 'WC Brooklyn',
    display_name: 'Wax Center - Brooklyn Location',
    address_info: {
      address1: '789 Atlantic Avenue',
      city: 'Brooklyn',
      state_info: {
        code: 'NY',
        name: 'New York'
      },
      zip_code: '11217',
      country_info: {
        code: 'US',
        name: 'United States'
      }
    },
    state: {
      code: 'NY',
      name: 'New York'
    },
    working_hours: [
      { day_of_week: 0, start_time: '09:00', end_time: '19:00', is_closed: false },
      { day_of_week: 1, start_time: '09:00', end_time: '19:00', is_closed: false },
      { day_of_week: 2, start_time: '09:00', end_time: '19:00', is_closed: false },
      { day_of_week: 3, start_time: '09:00', end_time: '19:00', is_closed: false },
      { day_of_week: 4, start_time: '09:00', end_time: '19:00', is_closed: false },
      { day_of_week: 5, start_time: '10:00', end_time: '17:00', is_closed: false },
      { day_of_week: 6, start_time: '10:00', end_time: '17:00', is_closed: false }
    ],
    phone: '(718) 555-0300',
    email: 'brooklyn@waxcenter.com',
    timezone: 'America/New_York',
    latitude: 40.6782,
    longitude: -73.9442
  }
];

// Mock Zenoti Services data
export const mockServices: ZenotiService[] = [
  {
    id: 'service-1',
    code: 'BWX001',
    name: 'Brazilian Wax',
    description: 'Full Brazilian waxing service with premium quality wax',
    duration: 30,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 65.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Our signature Brazilian wax service using gentle, premium quality wax suitable for sensitive skin.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-1',
        name: 'Brazilian'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Brazilian Wax',
      display_price: 65.00,
      display_order: 1
    }
  },
  {
    id: 'service-2',
    code: 'BWX002',
    name: 'Bikini Wax',
    description: 'Classic bikini line waxing',
    duration: 20,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 45.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Classic bikini wax that removes hair from the sides and top of the bikini area.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-2',
        name: 'Bikini'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Bikini Wax',
      display_price: 45.00,
      display_order: 2
    }
  },
  {
    id: 'service-3',
    code: 'LWX001',
    name: 'Full Leg Wax',
    description: 'Complete leg waxing from ankle to hip',
    duration: 45,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 85.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Full leg wax covering from ankles to hips for silky smooth legs.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-3',
        name: 'Legs'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Full Leg Wax',
      display_price: 85.00,
      display_order: 3
    }
  },
  {
    id: 'service-4',
    code: 'LWX002',
    name: 'Half Leg Wax',
    description: 'Lower leg waxing from ankle to knee',
    duration: 25,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 45.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Half leg wax covering from ankles to knees.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-3',
        name: 'Legs'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Half Leg Wax',
      display_price: 45.00,
      display_order: 4
    }
  },
  {
    id: 'service-5',
    code: 'AWX001',
    name: 'Underarm Wax',
    description: 'Complete underarm waxing',
    duration: 15,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 25.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Quick and efficient underarm waxing for smooth, hair-free underarms.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-4',
        name: 'Arms'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Underarm Wax',
      display_price: 25.00,
      display_order: 5
    }
  },
  {
    id: 'service-6',
    code: 'AWX002',
    name: 'Full Arm Wax',
    description: 'Complete arm waxing from wrist to shoulder',
    duration: 30,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 55.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Full arm wax from wrists to shoulders for completely smooth arms.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-4',
        name: 'Arms'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Full Arm Wax',
      display_price: 55.00,
      display_order: 6
    }
  },
  {
    id: 'service-7',
    code: 'FWX001',
    name: 'Eyebrow Wax',
    description: 'Precision eyebrow shaping and waxing',
    duration: 15,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 20.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Expert eyebrow shaping and waxing for perfectly groomed brows.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-5',
        name: 'Face'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Eyebrow Wax',
      display_price: 20.00,
      display_order: 7
    }
  },
  {
    id: 'service-8',
    code: 'FWX002',
    name: 'Lip Wax',
    description: 'Upper lip hair removal',
    duration: 10,
    recovery_time: 0,
    price_info: {
      currency_id: 1,
      sale_price: 15.00,
      include_tax: true
    },
    additional_info: {
      html_description: '<p>Gentle upper lip waxing for smooth, hair-free skin.</p>',
      category: {
        id: 'cat-1',
        name: 'Waxing Services'
      },
      sub_category: {
        id: 'subcat-5',
        name: 'Face'
      }
    },
    catalog_info: {
      show_in_catalog: true,
      can_book: true,
      show_price: true,
      display_name: 'Lip Wax',
      display_price: 15.00,
      display_order: 8
    }
  }
];

// Helper function to get mock services for any center
export const getMockServicesForCenter = (centerId: string): ZenotiService[] => {
  // Return the same services for all mock centers
  // In a real scenario, you might want to vary services by center
  return mockServices;
}; 