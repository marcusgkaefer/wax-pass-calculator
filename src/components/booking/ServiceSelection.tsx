import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ZenotiApiService, ZenotiService } from '@/lib/zenotiApi';
import { 
  Clock, 
  DollarSign, 
  Star,
  Gift,
  Sparkles
} from 'lucide-react';

interface ServiceSelectionProps {
  centerId: string;
  showFirstTimeOffer?: boolean;
  onServiceSelect: (service: ZenotiService) => void;
  selectedService?: ZenotiService;
}

const ServiceSelection = ({
  centerId,
  showFirstTimeOffer = true,
  onServiceSelect,
  selectedService
}: ServiceSelectionProps) => {
  const [services, setServices] = useState<ZenotiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const firstTimeServices = [
    'eyebrow',
    'underarm', 
    'bikini'
  ];

  useEffect(() => {
    const loadServices = async () => {
      if (!centerId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const centerServices = await ZenotiApiService.getCenterServices(centerId);
        setServices(centerServices);
      } catch (err) {
        console.error('Failed to load services:', err);
        setError('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [centerId]);

  const isFirstTimeEligible = (service: ZenotiService) => {
    return firstTimeServices.some(term => 
      service.name.toLowerCase().includes(term)
    );
  };

  const getServiceCategory = (service: ZenotiService) => {
    if (service.additional_info?.category?.name) {
      return service.additional_info.category.name;
    }
    
    const serviceName = service.name.toLowerCase();
    if (serviceName.includes('eyebrow') || serviceName.includes('lip') || 
        serviceName.includes('chin') || serviceName.includes('face')) {
      return 'Face';
    } else if (serviceName.includes('brazilian') || serviceName.includes('bikini')) {
      return 'Bikini Area';
    } else if (serviceName.includes('legs') || serviceName.includes('arms') || 
              serviceName.includes('back') || serviceName.includes('chest') || 
              serviceName.includes('underarms')) {
      return 'Body';
    }
    return 'Other';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Services...</h2>
          <p className="text-gray-600">Please wait while we fetch available services</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Services</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">No Services Available</h2>
        <p className="text-gray-600">Please select a different location or try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Select Your Service</h2>
        <p className="text-gray-600">Choose from our expert waxing services</p>
      </div>

      {/* First Time Guest Services */}
      {showFirstTimeOffer && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5 text-green-600" />
            <h3 className="text-xl font-semibold text-green-800">
              First Time Free Services
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services
              .filter(isFirstTimeEligible)
              .map((service) => (
                <Card 
                  key={`free-${service.id}`}
                  className={`cursor-pointer transition-all border-green-200 bg-green-50 hover:shadow-lg ${
                    selectedService?.id === service.id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => onServiceSelect(service)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <Badge className="bg-green-100 text-green-800 mt-2">
                          <Gift className="h-3 w-3 mr-1" />
                          FREE for New Guests
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-700 line-through">
                          ${service.price_info.sale_price}
                        </div>
                        <div className="text-2xl font-bold text-green-600">FREE</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {service.description || 'Professional waxing service'}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(service.duration)}
                      </div>
                      <Badge variant="outline" className="border-green-200">
                        {getServiceCategory(service)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Services */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold">All Services</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const isFirstTime = isFirstTimeEligible(service);
            const isPopular = service.name.toLowerCase().includes('brazilian') || 
                             service.name.toLowerCase().includes('eyebrow');
            
            return (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedService?.id === service.id ? 'ring-2 ring-purple-500' : ''
                } ${isFirstTime && showFirstTimeOffer ? 'opacity-75' : ''}`}
                onClick={() => onServiceSelect(service)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        {isPopular && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {isFirstTime && showFirstTimeOffer && (
                          <Badge variant="outline" className="border-green-200 text-green-700">
                            First Time Free
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-700">
                        ${service.price_info.sale_price}
                      </div>
                      <div className="text-sm text-gray-500">starting</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {service.description || 'Professional waxing service tailored to your needs'}
                  </CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(service.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${service.price_info.sale_price}
                    </div>
                    <Badge variant="outline">
                      {getServiceCategory(service)}
                    </Badge>
                  </div>

                  <Button 
                    className={`w-full ${
                      selectedService?.id === service.id 
                        ? 'bg-purple-700 hover:bg-purple-800' 
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-700 hover:text-white'
                    }`}
                  >
                    {selectedService?.id === service.id ? 'Selected' : 'Select Service'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection; 