import { useState, useEffect } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { formatCurrency, fetchServicesForWaxCenter, WaxService } from '@/lib/waxPassCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, X, Loader2 } from 'lucide-react';

export interface ServiceSelectionProps {
  onContinue: () => void;
  onBack?: () => void;
}

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
          setError("Unable to load services for this location. Please try again.");
          setIsLoading(false);
        });
    }
  }, [selectedWaxCenter]);

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, WaxService[]>);

  // Filter services based on search query
  const filteredServicesByCategory = Object.entries(servicesByCategory).reduce((acc, [category, categoryServices]) => {
    const filteredServices = categoryServices.filter(service => 
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredServices.length > 0) {
      acc[category] = filteredServices;
    }
    
    return acc;
  }, {} as Record<string, WaxService[]>);

  // Calculate subtotal
  const subtotal = selectedServices.reduce((sum, service) => sum + service.standard_price, 0);

  if (!selectedWaxCenter) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please select a wax center first.</p>
        {onBack && (
          <Button onClick={onBack}>
            Back to Location Selection
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Service Selection List */}
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Choose Your Services</h2>
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-sm text-gray-600">
            Services available at {selectedWaxCenter.display_name}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : (
          /* Services List */
          <ScrollArea className="h-[500px] pr-4">
            {Object.keys(filteredServicesByCategory).length === 0 ? (
              searchQuery ? (
                <p className="text-center py-8 text-gray-500">No services match your search.</p>
              ) : (
                <p className="text-center py-8 text-gray-500">No services available at this location.</p>
              )
            ) : (
              Object.entries(filteredServicesByCategory).map(([category, services]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{category}</h3>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <Card key={service.service_id}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{service.service_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(service.standard_price)}
                            </p>
                            {service.description && (
                              <p className="text-xs text-gray-500 mt-1 max-w-md">
                                {service.description}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => addService(service)}
                            disabled={selectedServices.some(s => s.service_id === service.service_id)}
                          >
                            <Plus size={18} />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        )}
      </div>
      
      {/* My Selections Summary */}
      <div>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">My Selections</h3>
            
            {selectedServices.length === 0 ? (
              <p className="text-muted-foreground mb-4">No services selected yet.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {selectedServices.map((service) => (
                  <div key={service.service_id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{service.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(service.standard_price)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeService(service.service_id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center font-semibold mb-6">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={onContinue}
              disabled={selectedServices.length === 0}
            >
              Find My Best Pass
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 