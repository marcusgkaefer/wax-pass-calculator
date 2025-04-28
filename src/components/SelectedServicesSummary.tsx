
import React from 'react';
import { Button } from '@/components/ui/button';
import { Service, services } from '@/data/servicesData';

interface SelectedServicesSummaryProps {
  selectedServiceIds: string[];
  toggleService: (serviceId: string) => void;
}

const SelectedServicesSummary: React.FC<SelectedServicesSummaryProps> = ({
  selectedServiceIds,
  toggleService
}) => {
  const selectedServices = selectedServiceIds
    .map(id => services.find(service => service.id === id))
    .filter((service): service is Service => service !== undefined);

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  if (selectedServices.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Click on body parts to select services
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {selectedServices.map(service => (
        <div 
          key={service.id} 
          className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-full">
              <div className="w-5 h-5 text-purple-600"></div>
            </div>
            <span>{service.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">${service.price}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleService(service.id)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      
      <div className="mt-6">
        <div className="flex justify-between py-2 border-t border-b border-purple-100 my-4">
          <span className="font-semibold">Total:</span>
          <span className="font-bold">${totalPrice.toFixed(2)}</span>
        </div>
        
        <Button className="w-full">Continue</Button>
      </div>
    </div>
  );
};

export default SelectedServicesSummary;
