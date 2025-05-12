import { createContext, useContext, useState, ReactNode } from 'react';
import { WaxService, SelectedPass } from '@/data/waxPassData';

// Wax Center type definition
interface WaxCenter {
  id: string;
  display_name: string;
}

interface WaxPassContextType {
  // Selected wax center in Phase 0
  selectedWaxCenter: WaxCenter | null;
  setSelectedWaxCenter: (center: WaxCenter | null) => void;
  
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
  const [selectedWaxCenter, setSelectedWaxCenter] = useState<WaxCenter | null>(null);
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
    setSelectedWaxCenter(null);
    setSelectedServices([]);
    setSelectedPasses([]);
  };

  return (
    <WaxPassContext.Provider value={{
      selectedWaxCenter,
      setSelectedWaxCenter,
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