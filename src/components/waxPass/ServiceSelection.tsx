import { useState } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { waxServices } from '@/data/waxPassData';
import { formatCurrency } from '@/lib/waxPassCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, X } from 'lucide-react';

interface ServiceSelectionProps {
  onContinue: () => void;
}

export default function ServiceSelection({ onContinue }: ServiceSelectionProps) {
  const { selectedServices, addService, removeService } = useWaxPass();
  const [searchQuery, setSearchQuery] = useState('');

  // Group services by category
  const servicesByCategory = waxServices.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof waxServices>);

  // Filter services based on search query
  const filteredServicesByCategory = Object.entries(servicesByCategory).reduce((acc, [category, services]) => {
    const filteredServices = services.filter(service => 
      service.service_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredServices.length > 0) {
      acc[category] = filteredServices;
    }
    
    return acc;
  }, {} as Record<string, typeof waxServices>);

  // Calculate subtotal
  const subtotal = selectedServices.reduce((sum, service) => sum + service.standard_price, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Service Selection List */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Choose Your Services</h2>
        
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
        
        {/* Services List */}
        <ScrollArea className="h-[500px] pr-4">
          {Object.entries(filteredServicesByCategory).map(([category, services]) => (
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
          ))}
        </ScrollArea>
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