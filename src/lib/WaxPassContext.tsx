import { createContext, useContext, useState, ReactNode } from 'react';
import { WaxService, SelectedPass } from '@/data/waxPassData';

interface WaxPassContextType {
  // Selected services in Phase 1
  selectedServices: WaxService[];
  addService: (service: WaxService) => void;
  removeService: (serviceId: string) => void;
  
  // Selected passes in Phase 2
  selectedPasses: SelectedPass[];
  addOrUpdatePass: (pass: SelectedPass) => void;
  removePass: (serviceId: string) => void;
  
  // Clear all selections
  clearSelections: () => void;
}

const WaxPassContext = createContext<WaxPassContextType | undefined>(undefined);

export const WaxPassProvider = ({ children }: { children: ReactNode }) => {
  const [selectedServices, setSelectedServices] = useState<WaxService[]>([]);
  const [selectedPasses, setSelectedPasses] = useState<SelectedPass[]>([]);

  const addService = (service: WaxService) => {
    // Don't add if already selected
    if (selectedServices.some(s => s.service_id === service.service_id)) return;
    setSelectedServices([...selectedServices, service]);
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.service_id !== serviceId));
    // Also remove any selected passes for this service
    setSelectedPasses(selectedPasses.filter(p => p.service_id !== serviceId));
  };

  const addOrUpdatePass = (pass: SelectedPass) => {
    setSelectedPasses(prev => {
      const exists = prev.some(p => p.service_id === pass.service_id);
      if (exists) {
        return prev.map(p => p.service_id === pass.service_id ? pass : p);
      } else {
        return [...prev, pass];
      }
    });
  };

  const removePass = (serviceId: string) => {
    setSelectedPasses(selectedPasses.filter(p => p.service_id !== serviceId));
  };

  const clearSelections = () => {
    setSelectedServices([]);
    setSelectedPasses([]);
  };

  return (
    <WaxPassContext.Provider value={{
      selectedServices,
      addService,
      removeService,
      selectedPasses,
      addOrUpdatePass,
      removePass,
      clearSelections
    }}>
      {children}
    </WaxPassContext.Provider>
  );
};

export const useWaxPass = () => {
  const context = useContext(WaxPassContext);
  if (context === undefined) {
    throw new Error('useWaxPass must be used within a WaxPassProvider');
  }
  return context;
}; 