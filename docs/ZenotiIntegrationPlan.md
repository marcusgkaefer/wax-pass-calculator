# Zenoti API Integration Plan

## Overview
This document outlines the plan for integrating Zenoti API centers throughout the wax pass calculator application, replacing mock data with real wax center information.

## Implementation Status

### ✅ Phase 1: Core Infrastructure (COMPLETED)
- **Configuration Management**: Created `src/lib/config.ts` for environment variables
- **API Service**: Implemented `src/lib/zenotiApi.ts` with caching functionality
- **Type System**: Updated `WaxPassContext` to use `ZenotiCenter` type
- **Caching Strategy**: 
  - LocalStorage-based caching with 1-hour expiration
  - Fallback to stale data on API failures
  - Manual cache clearing for debugging

### ✅ Phase 2: Location Selection Enhancement (COMPLETED)
- **Enhanced Search**: Multi-field search (city, state, zip, center name)
- **Geolocation**: Distance-based sorting with "Near Me" functionality
- **Rich UI**: Detailed center cards with addresses, phone, hours
- **Real-time Loading**: Loading states and error handling
- **Force Refresh**: Manual cache refresh capability

### ✅ Phase 3: Service Integration (COMPLETED)
- **Real-time Service Fetching**: Services now loaded from Zenoti API per center
- **Center-specific Services**: Each center shows only its available services
- **Enhanced Service Data**: Includes descriptions, categories, pricing from API
- **Smart Caching**: Services cached per center with 1-hour expiration
- **Fallback Mechanism**: Mock data used if API fails
- **Data Consistency**: Services/passes cleared when center changes

## Next Steps

### 📋 Phase 4: Data Consistency
- Ensure all components use real center data
- Remove remaining mock data dependencies
- Update pass calculations to reflect center-specific pricing

### 🎯 Phase 5: Advanced Features
- **Center Details**: Add more center information (amenities, staff, reviews)
- **Operating Hours**: Real-time open/closed status
- **Booking Integration**: Direct appointment scheduling
- **Multi-location Support**: Handle chains and franchises

## API Integration Details

### Endpoints Used
- `GET /centers?expand=working_hours` - Fetch all centers with working hours
- `GET /centers/{center_id}/services?expand=additional_info,catalog_info,variants_info,add_ons_info,image_paths` - Fetch services for a specific center

### Data Structure
```typescript
interface ZenotiCenter {
  id: string;
  name: string;
  display_name: string;
  address_info: {
    address1: string;
    city: string;
    state_info: { name: string; code: string };
    zip_code: string;
  };
  state: { name: string; code: string };
  working_hours: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_closed: boolean;
  }>;
  phone: string;
  latitude?: number;
  longitude?: number;
}

interface ZenotiService {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  recovery_time: number;
  price_info: {
    currency_id: number;
    sale_price: number;
  };
  additional_info?: {
    category?: { id: string; name: string };
    sub_category?: { id: string; name: string };
  };
  catalog_info?: {
    show_in_catalog: boolean;
    can_book: boolean;
    display_name?: string;
  };
}
```

### Caching Strategy
- **Centers Key**: `zenoti_centers_cache`
- **Services Key**: `zenoti_services_cache_{center_id}` (per center)
- **TTL**: 1 hour (3,600,000ms)
- **Fallback**: Stale data on API failure
- **Storage**: localStorage

### Error Handling
- API failures gracefully handled
- User-friendly error messages
- Stale data fallback mechanism
- Network timeout handling

## Integration Points

### Current Usage
1. **LocationSelection Component**: ✅ Fully integrated
   - Real-time search across all centers
   - Geolocation-based filtering
   - Rich center information display

### Pending Integration
1. **Service Selection**: Update to fetch center-specific services
2. **Pass Calculations**: Ensure pricing reflects center-specific rates
3. **Summary/Checkout**: Display selected center information

## Performance Optimizations

### Implemented
- **Caching**: 1-hour cache reduces API calls
- **Lazy Loading**: Centers loaded on component mount
- **Search Optimization**: Client-side filtering after initial load
- **Debouncing**: Prevents excessive filtering on rapid typing

### Future Optimizations
- **Service Worker**: Background cache updates
- **Pagination**: Handle large numbers of centers
- **Compression**: Optimize data transfer size
- **CDN**: Cache static center images and assets

## Security Considerations

### Current Implementation
- API key stored in configuration file
- HTTPS-only API communication
- Input sanitization for search queries

### Production Recommendations
- Move API key to secure environment variables
- Implement rate limiting
- Add request signing/authentication
- Monitor API usage and implement alerts

## Testing Strategy

### Manual Testing
- Search functionality across different inputs
- Geolocation accuracy and error handling
- Cache behavior (fresh data, expired data, fallback)
- Network failure scenarios

### Automated Testing (Future)
- Unit tests for API service
- Integration tests for cache behavior
- E2E tests for user workflows
- Performance testing for large datasets

## Monitoring and Analytics

### Current Logging
- API call success/failure rates
- Cache hit/miss ratios
- User search patterns
- Geolocation usage

### Future Metrics
- Center selection patterns
- Popular search terms
- Geographic distribution of users
- API response times

## Migration Strategy

### Rollback Plan
- Keep mock data functions as fallback
- Feature flag for Zenoti integration
- Gradual rollout by user segments

### Data Validation
- Compare mock vs real data accuracy
- Validate center information completeness
- Ensure search functionality parity 