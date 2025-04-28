
import React from 'react';
import HumanBodySVG from './HumanBodySVG';
import { services } from '@/data/servicesData';

interface ServiceBodyMapProps {
  selectedServices: string[];
  toggleService: (serviceId: string) => void;
}

const ServiceBodyMap: React.FC<ServiceBodyMapProps> = ({ 
  selectedServices,
  toggleService 
}) => {
  return (
    <div className="bg-purple-50 rounded-2xl p-4 flex items-center justify-center h-full">
      <div className="max-w-full h-full">
        <HumanBodySVG 
          selectedServices={selectedServices}
          toggleService={toggleService}
        />
      </div>
    </div>
  );
};

export default ServiceBodyMap;
