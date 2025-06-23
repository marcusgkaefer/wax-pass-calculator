import { useState, useEffect } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { formatCurrency, fetchServicesForWaxCenter, WaxService } from '@/lib/waxPassCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  X, 
  Loader2, 
  Check,
  Sparkles,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';

export interface ServiceSelectionProps {
  onContinue: () => void;
  onBack?: () => void;
}

// Service categories for elegant grouping
const SERVICE_CATEGORIES = {
  face: {
    name: 'Face & Brow',
    emoji: '✨',
    gradient: 'from-rose-400 to-pink-500',
    keywords: ['face', 'eyebrow', 'brow', 'lip', 'chin', 'cheek']
  },
  body: {
    name: 'Body & Arms',
    emoji: '💫',
    gradient: 'from-purple-400 to-indigo-500',
    keywords: ['arm', 'leg', 'back', 'chest', 'underarm', 'body']
  },
  intimate: {
    name: 'Intimate Areas',
    emoji: '🌸',
    gradient: 'from-cyan-400 to-blue-500',
    keywords: ['bikini', 'brazilian', 'intimate', 'private']
  },
  premium: {
    name: 'Premium Packages',
    emoji: '👑',
    gradient: 'from-amber-400 to-orange-500',
    keywords: ['full', 'complete', 'package', 'premium', 'deluxe']
  }
};

export default function ServiceSelection({ onContinue, onBack }: ServiceSelectionProps) {
  const { selectedWaxCenter, selectedServices, addService, removeService } = useWaxPass();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<WaxService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services when wax center changes
  useEffect(() => {
    if (selectedWaxCenter) {
      setIsLoading(true);
      setError(null);
      
      fetchServicesForWaxCenter(selectedWaxCenter.id)
        .then(fetchedServices => {
          setServices(fetchedServices);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching services:", err);
          setError("Unable to load services. Please try again.");
          setIsLoading(false);
        });
    }
  }, [selectedWaxCenter]);

  // Categorize services intelligently
  const categorizeService = (service: WaxService) => {
    const serviceName = service.service_name.toLowerCase();
    
    for (const [key, category] of Object.entries(SERVICE_CATEGORIES)) {
      if (category.keywords.some(keyword => serviceName.includes(keyword))) {
        return key;
      }
    }
    return 'body'; // default category
  };

  // Filter and group services
  const filteredServices = services.filter(service => 
    service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = categorizeService(service);
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, WaxService[]>);

  // Sort services within each category by price
  Object.keys(groupedServices).forEach(category => {
    groupedServices[category].sort((a, b) => a.standard_price - b.standard_price);
  });

  const handleServiceToggle = (service: WaxService) => {
    const isSelected = selectedServices.some(s => s.service_id === service.service_id);
    if (isSelected) {
      removeService(service.service_id);
    } else {
      addService(service);
    }
  };

  const isServiceSelected = (service: WaxService) => {
    return selectedServices.some(s => s.service_id === service.service_id);
  };

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.standard_price, 0);

  if (!selectedWaxCenter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center glass-light rounded-3xl p-8 border border-white/20">
          <p className="text-gray-600">Please select a wax center first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Title Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Select Your Services</h1>
            </div>
            
            {/* Selected Center */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-pink-500" />
              <span>{selectedWaxCenter.display_name}</span>
              <span className="text-gray-400">•</span>
              <span>{selectedWaxCenter.address_info.city}, {selectedWaxCenter.state.name}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="glass-card rounded-2xl border border-white/20">
              <div className="flex items-center px-4 py-2.5">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-gray-400 text-gray-700 h-7"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="ml-2 h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading services...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="glass-light rounded-3xl p-8 border border-red-200/50 bg-red-50/30 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-red-200/50"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Services by Category */}
        {!isLoading && !error && (
          <div className="space-y-8">
            {Object.entries(groupedServices).map(([categoryKey, categoryServices]) => {
              const category = SERVICE_CATEGORIES[categoryKey as keyof typeof SERVICE_CATEGORIES];
              
              return (
                <div key={categoryKey} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center text-sm`}>
                      {category.emoji}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                      <p className="text-sm text-gray-500">{categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="space-y-3">
                    {categoryServices.map((service) => {
                      const isSelected = isServiceSelected(service);
                      
                      return (
                        <Card
                          key={service.service_id}
                          className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                            isSelected 
                              ? 'ring-2 ring-pink-500 glass-premium shadow-xl shadow-pink-500/25 scale-[1.02] border-pink-200/50' 
                              : 'glass-light border-white/30 hover:glass-card hover:shadow-md'
                          }`}
                          onClick={() => handleServiceToggle(service)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                              {/* Service Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-gray-800 text-base leading-tight pr-4">
                                    {service.service_name}
                                  </h3>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="flex items-center gap-1 text-green-600">
                                      <DollarSign className="h-4 w-4" />
                                      <span className="font-bold text-lg">
                                        {formatCurrency(service.standard_price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{Math.max(15, Math.round(service.standard_price / 3))} min</span>
                                  </div>
                                </div>
                              </div>

                              {/* Selection Indicator */}
                              <div className="ml-4">
                                <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                                  isSelected 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500 shadow-lg' 
                                    : 'border-gray-300 hover:border-purple-400'
                                }`}>
                                  {isSelected ? (
                                    <Check className="h-3 w-3 text-white" />
                                  ) : (
                                    <Plus className="h-3 w-3 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {Object.keys(groupedServices).length === 0 && (
              <div className="text-center py-20">
                <div className="glass-light rounded-3xl p-12 border border-white/30 max-w-md mx-auto">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery ? `No services match "${searchQuery}"` : 'No services available'}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery('')}
                      className="border-white/30"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Summary - Updated Design */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 glass-premium border-t border-white/30 shadow-lg backdrop-blur-xl">
          {/* Thin Progress Bar */}
          <div className="h-0.5 bg-gray-200/30">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: '50%' }}
            />
          </div>

          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Service Summary */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span className="font-medium">
                    {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-bold text-lg">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectedServices.forEach(s => removeService(s.service_id))}
                  className="glass-micro-interaction border border-white/30 hover:bg-white/20 text-gray-700 text-xs h-8"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Padding for Fixed Summary */}
      {selectedServices.length > 0 && <div className="h-20" />}
    </div>
  );
} 