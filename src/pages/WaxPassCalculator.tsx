import { useState } from 'react';
import { WaxPassProvider } from '@/lib/WaxPassContext';
import LocationSelection from '@/components/waxPass/LocationSelection';
import ServiceSelection from '@/components/waxPass/ServiceSelection';
import PassRecommendations from '@/components/waxPass/PassRecommendations';
import SummaryCheckout from '@/components/waxPass/SummaryCheckout';

type CalculatorPhase = 'location-selection' | 'service-selection' | 'pass-recommendations' | 'summary-checkout';

export default function WaxPassCalculator() {
  const [phase, setPhase] = useState<CalculatorPhase>('location-selection');

  return (
    <WaxPassProvider>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Wax Pass Calculator</h1>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div 
              className={`rounded-full w-8 h-8 flex items-center justify-center 
                ${phase === 'location-selection' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              1
            </div>
            <span className="text-sm font-medium">Location</span>
          </div>
          <div className={`h-0.5 w-10 mx-2 ${phase !== 'location-selection' ? 'bg-primary' : 'bg-muted'}`} />
          <div className="flex items-center space-x-3">
            <div 
              className={`rounded-full w-8 h-8 flex items-center justify-center 
                ${phase === 'service-selection' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              2
            </div>
            <span className="text-sm font-medium">Services</span>
          </div>
          <div className={`h-0.5 w-10 mx-2 ${phase === 'service-selection' || phase === 'pass-recommendations' ? 'bg-primary' : 'bg-muted'}`} />
          <div className="flex items-center space-x-3">
            <div 
              className={`rounded-full w-8 h-8 flex items-center justify-center 
                ${phase === 'pass-recommendations' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              3
            </div>
            <span className="text-sm font-medium">Passes</span>
          </div>
          <div className={`h-0.5 w-10 mx-2 ${phase === 'summary-checkout' ? 'bg-primary' : 'bg-muted'}`} />
          <div className="flex items-center space-x-3">
            <div 
              className={`rounded-full w-8 h-8 flex items-center justify-center 
                ${phase === 'summary-checkout' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              4
            </div>
            <span className="text-sm font-medium">Summary</span>
          </div>
        </div>
        
        {/* Phase Content */}
        {phase === 'location-selection' && (
          <LocationSelection onContinue={() => setPhase('service-selection')} />
        )}
        
        {phase === 'service-selection' && (
          <ServiceSelection 
            onBack={() => setPhase('location-selection')}
            onContinue={() => setPhase('pass-recommendations')} 
          />
        )}
        
        {phase === 'pass-recommendations' && (
          <PassRecommendations 
            onBack={() => setPhase('service-selection')}
            onContinue={() => setPhase('summary-checkout')}
          />
        )}
        
        {phase === 'summary-checkout' && (
          <SummaryCheckout
            onBack={() => setPhase('pass-recommendations')}
          />
        )}
      </div>
    </WaxPassProvider>
  );
} 