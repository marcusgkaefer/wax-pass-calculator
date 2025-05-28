import { config } from './config';

// Zenoti API interfaces
export interface ZenotiCenter {
  id: string;
  name: string;
  short_name: string;
  display_name: string;
  address_info: {
    address1: string;
    address2?: string;
    city: string;
    state_info: {
      code: string;
      name: string;
    };
    zip_code: string;
    country_info: {
      code: string;
      name: string;
    };
  };
  state: {
    code: string;
    name: string;
  };
  working_hours: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_closed: boolean;
  }>;
  phone: string;
  email?: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
}

export interface ZenotiCentersResponse {
  centers: ZenotiCenter[];
  page_info: {
    page: number;
    size: number;
    total: number;
  };
}

// Zenoti Services API interfaces
export interface ZenotiService {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  recovery_time: number;
  price_info: {
    currency_id: number;
    sale_price: number;
    tax_id?: string;
    ssg?: number;
    include_tax?: boolean;
    demand_group_id?: string;
  };
  additional_info?: {
    html_description?: string;
    category?: {
      id: string;
      name: string;
    };
    sub_category?: {
      id: string;
      name: string;
    };
    business_unit?: {
      id: string;
      name: string;
    };
  };
  catalog_info?: {
    show_in_catalog: boolean;
    can_book: boolean;
    show_price: boolean;
    display_name?: string;
    display_price?: number;
    display_order?: number;
    video_url?: string;
  };
  variants_info?: {
    is_variant: boolean;
    has_variant: boolean;
  };
  add_ons_info?: {
    is_add_on: boolean;
    has_add_ons: boolean;
    add_ons_list?: string[];
  };
  image_paths?: string;
  parallel_service_groups?: Record<string, unknown>;
  prerequisites_info?: Record<string, unknown>;
  finishing_services_info?: Record<string, unknown>;
}

export interface ZenotiServicesResponse {
  services: ZenotiService[];
  page_info: {
    page: number;
    size: number;
    total: number;
  } | null;
  error?: {
    code: number;
    message: string;
  };
}

// Cache interface
interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Cache utilities
class ApiCache {
  private static isExpired<T>(cachedItem: CachedData<T>): boolean {
    return Date.now() > cachedItem.expiry;
  }

  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const parsedCache: CachedData<T> = JSON.parse(cached);
      
      if (this.isExpired(parsedCache)) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedCache.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      localStorage.removeItem(key);
      return null;
    }
  }

  static set<T>(key: string, data: T, expirationTime: number): void {
    try {
      const cachedData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + expirationTime,
      };
      localStorage.setItem(key, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  static clear(key: string): void {
    localStorage.removeItem(key);
  }
}

// Zenoti API service
export class ZenotiApiService {
  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${config.zenoti.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `apikey ${config.zenoti.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zenoti API request failed:', error);
      throw error;
    }
  }

  static async getAllCenters(forceRefresh = false): Promise<ZenotiCenter[]> {
    const cacheKey = config.cache.centersKey;

    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cachedCenters = ApiCache.get<ZenotiCenter[]>(cacheKey);
      if (cachedCenters) {
        console.log('Returning cached centers data');
        return cachedCenters;
      }
    }

    console.log('Fetching centers from Zenoti API...');
    
    try {
      const response = await this.makeRequest<ZenotiCentersResponse>(
        '/centers?expand=working_hours'
      );

      // Cache the results
      ApiCache.set(cacheKey, response.centers, config.cache.expirationTime);
      
      console.log(`Fetched and cached ${response.centers.length} centers`);
      return response.centers;
    } catch (error) {
      console.error('Failed to fetch centers:', error);
      
      // If API fails, try to return stale cache data as fallback
      const staleData = localStorage.getItem(cacheKey);
      if (staleData) {
        try {
          const parsedCache: CachedData<ZenotiCenter[]> = JSON.parse(staleData);
          console.log('Returning stale cache data due to API failure');
          return parsedCache.data;
        } catch (parseError) {
          console.error('Failed to parse stale cache data:', parseError);
        }
      }
      
      throw error;
    }
  }

  static async getCentersByStateAndCity(stateName: string, cityName: string): Promise<ZenotiCenter[]> {
    const allCenters = await this.getAllCenters();
    
    return allCenters.filter(center => {
      const matchesState = center.state.name.toLowerCase() === stateName.toLowerCase();
      const matchesCity = center.address_info.city.toLowerCase() === cityName.toLowerCase();
      return matchesState && matchesCity;
    });
  }

  static async searchCenters(query: string): Promise<ZenotiCenter[]> {
    const allCenters = await this.getAllCenters();
    const searchTerm = query.toLowerCase();
    
    return allCenters.filter(center => {
      return (
        center.name.toLowerCase().includes(searchTerm) ||
        center.display_name.toLowerCase().includes(searchTerm) ||
        center.address_info.city.toLowerCase().includes(searchTerm) ||
        center.state.name.toLowerCase().includes(searchTerm) ||
        `${center.address_info.city}, ${center.state.name}`.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Clear cache manually (useful for debugging or force refresh)
  static clearCache(): void {
    ApiCache.clear(config.cache.centersKey);
  }

  // Services API methods
  static async getCenterServices(centerId: string, forceRefresh = false): Promise<ZenotiService[]> {
    const cacheKey = `${config.cache.servicesKey}_${centerId}`;

    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cachedServices = ApiCache.get<ZenotiService[]>(cacheKey);
      if (cachedServices) {
        console.log(`Returning cached services data for center ${centerId}`);
        return cachedServices;
      }
    }

    console.log(`Fetching services from Zenoti API for center ${centerId}...`);
    
    try {
      const response = await this.makeRequest<ZenotiServicesResponse>(
        `/centers/${centerId}/services?expand=additional_info,catalog_info,variants_info,add_ons_info,image_paths`
      );

      if (response.error) {
        throw new Error(`API Error ${response.error.code}: ${response.error.message}`);
      }

      // Filter out services that can't be booked or aren't shown in catalog
      const bookableServices = response.services.filter(service => 
        service.catalog_info?.can_book !== false && 
        service.catalog_info?.show_in_catalog !== false
      );

      // Cache the results
      ApiCache.set(cacheKey, bookableServices, config.cache.expirationTime);
      
      console.log(`Fetched and cached ${bookableServices.length} services for center ${centerId}`);
      return bookableServices;
    } catch (error) {
      console.error(`Failed to fetch services for center ${centerId}:`, error);
      
      // If API fails, try to return stale cache data as fallback
      const staleData = localStorage.getItem(cacheKey);
      if (staleData) {
        try {
          const parsedCache: CachedData<ZenotiService[]> = JSON.parse(staleData);
          console.log(`Returning stale cache data for center ${centerId} due to API failure`);
          return parsedCache.data;
        } catch (parseError) {
          console.error('Failed to parse stale cache data:', parseError);
        }
      }
      
      throw error;
    }
  }

  // Clear services cache for a specific center
  static clearServicesCache(centerId?: string): void {
    if (centerId) {
      ApiCache.clear(`${config.cache.servicesKey}_${centerId}`);
    } else {
      // Clear all services caches
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(config.cache.servicesKey)) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Clear all caches
  static clearAllCaches(): void {
    this.clearCache();
    this.clearServicesCache();
  }
} 