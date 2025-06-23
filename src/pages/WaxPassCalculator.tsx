import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle2, Heart, Gift, ArrowLeft, ArrowRight, Calendar, Phone, Star, ChevronDown } from 'lucide-react';
import { WaxPassProvider, useWaxPass } from '@/lib/WaxPassContext';
import LocationSelection from '@/components/waxPass/LocationSelection';
import ServiceSelection from '@/components/waxPass/ServiceSelection';
import PassRecommendations from '@/components/waxPass/PassRecommendations';
import SummaryCheckout from '@/components/waxPass/SummaryCheckout';
import BookingSuccess from '@/components/waxPass/BookingSuccess';
import CalculatorFooter from '@/components/waxPass/CalculatorFooter';
import { ZenotiCenter } from '@/lib/zenotiApi';
import { WaxService, SelectedPass } from '@/data/waxPassData';

type CalculatorPhase = 'location-selection' | 'service-selection' | 'pass-recommendations' | 'summary-checkout' | 'booking-success';

function WaxPassCalculatorContent() {
  const [phase, setPhase] = useState<CalculatorPhase>('location-selection');
  const { selectedWaxCenter, selectedServices, selectedPasses, clearSelections } = useWaxPass();
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Store booking data before clearing context for success page
  const [bookingData, setBookingData] = useState<{
    waxCenter: ZenotiCenter | null;
    services: WaxService[];
    passes: SelectedPass[];
  } | null>(null);

  const phases = [
    { id: 'location-selection', name: 'Location', icon: MapPin, description: 'Choose Center' },
    { id: 'service-selection', name: 'Services', icon: Heart, description: 'Select Services' },
    { id: 'pass-recommendations', name: 'Pass', icon: Gift, description: 'Choose Pass' },
    { id: 'summary-checkout', name: 'Booking', icon: CheckCircle2, description: 'Confirm Booking' },
    { id: 'booking-success', name: 'Success', icon: CheckCircle2, description: 'Confirmed' }
  ];

  const currentPhaseIndex = phases.findIndex(p => p.id === phase);

  // Scroll animation for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show header when near top
      if (currentScrollY < 50) {
        setHeaderCollapsed(false);
        setHeaderHidden(false);
        setLastScrollY(currentScrollY);
        return;
      }

      // Collapse header when scrolled a bit
      if (currentScrollY > 100) {
        setHeaderCollapsed(true);
      } else {
        setHeaderCollapsed(false);
      }

      // Only hide header when scrolling down significantly and fast
      const scrollDiff = currentScrollY - lastScrollY;
      if (scrollDiff > 10 && currentScrollY > 200) {
        // Scrolling down fast - hide header
        setHeaderHidden(true);
      } else if (scrollDiff < -5) {
        // Scrolling up - always show header
        setHeaderHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleReset = () => {
    setPhase('location-selection');
    setBookingData(null);
    clearSelections();
  };

  const handleBookingSuccess = () => {
    // Capture current booking data before clearing selections
    setBookingData({
      waxCenter: selectedWaxCenter,
      services: selectedServices,
      passes: selectedPasses
    });
    
    // Clear selections to prevent footer from showing
    clearSelections();
    
    // Navigate to success page
    setPhase('booking-success');
  };

  const getPhaseStatus = (phaseId: string) => {
    const phaseIndex = phases.findIndex(p => p.id === phaseId);
    if (phaseIndex < currentPhaseIndex) return 'completed';
    if (phaseIndex === currentPhaseIndex) return 'active';
    return 'upcoming';
  };

  // Don't show header on success page
  const showHeader = phase !== 'booking-success';
  const showFooter = phase !== 'booking-success';

  // Navigation functions for footer
  const getBackAction = () => {
    switch (phase) {
      case 'service-selection':
        return () => setPhase('location-selection');
      case 'pass-recommendations':
        return () => setPhase('service-selection');
      case 'summary-checkout':
        return () => setPhase('pass-recommendations');
      default:
        return undefined;
    }
  };

  const getContinueAction = () => {
    switch (phase) {
      case 'location-selection':
        return selectedWaxCenter ? () => setPhase('service-selection') : undefined;
      case 'service-selection':
        return selectedServices.length > 0 ? () => setPhase('pass-recommendations') : undefined;
      case 'pass-recommendations':
        // Allow continue if user has made a pass selection OR if they want to skip passes
        return selectedPasses.length > 0 ? () => setPhase('summary-checkout') : undefined;
      default:
        return undefined;
    }
  };

  const getCanContinue = () => {
    switch (phase) {
      case 'location-selection':
        return !!selectedWaxCenter;
      case 'service-selection':
        return selectedServices.length > 0;
      case 'pass-recommendations':
        // Can continue if passes are selected
        return selectedPasses.length > 0;
      default:
        return true;
    }
  };

  const getContinueText = () => {
    switch (phase) {
      case 'location-selection':
        return 'Select Services';
      case 'service-selection':
        return 'Choose Pass';
      case 'pass-recommendations':
        return selectedPasses.length > 0 ? 'Review Booking' : 'Choose Pass';
      default:
        return 'Continue';
    }
  };

  return (
    <div className="relative">
      {/* Animated Header */}
      {showHeader && (
        <div className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          headerHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          headerCollapsed 
            ? 'glass-premium border-white/30 shadow-lg' 
            : 'bg-transparent border-transparent backdrop-blur-none'
        }`}>
          <div className="container mx-auto px-4">
            <div className={`transition-all duration-500 ${headerCollapsed ? 'py-2' : 'py-4'}`}>
              {/* Header Content */}
              <div className="flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center transition-all duration-300 ${
                    headerCollapsed ? 'shadow-lg' : 'shadow-xl shadow-pink-500/25'
                  }`}>
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className={`font-bold transition-all duration-300 ${
                      headerCollapsed ? 'text-lg text-gray-800' : 'text-xl text-gray-900'
                    }`}>
                      Wax Pass Calculator
                    </h1>
                    {!headerCollapsed && (
                      <p className="text-sm text-gray-700">Find your perfect waxing package</p>
                    )}
                  </div>
                </div>

                {/* Center Info (when selected) */}
                {selectedWaxCenter && headerCollapsed && (
                  <div className="transition-all duration-500 opacity-100">
                    <Card className="glass-light border-white/40">
                      <CardContent className="p-2">
                        <div className="flex items-center gap-3">
                          <MapPin className="text-pink-500 h-4 w-4" />
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {selectedWaxCenter.display_name}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {selectedWaxCenter.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                4.9
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Header Actions - Only show when collapsed/scrolled */}
                {headerCollapsed && (
                  <div className="flex items-center gap-3">
                    {/* Back Button */}
                    {getBackAction() && (
                      <Button
                        onClick={getBackAction()}
                        variant="ghost"
                        size="sm"
                        className="glass-micro-interaction border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                      >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                      </Button>
                    )}

                    {/* Help Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="glass-micro-interaction border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                    >
                      <div className="text-xs">?</div>
                    </Button>

                    {/* Progress Indicator */}
                    <div className="glass-light border border-white/40 rounded-lg px-3 py-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse" />
                        <span className="font-medium text-gray-700 text-xs">
                          {currentPhaseIndex + 1}/4
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 ${showHeader ? 'pt-24' : 'pt-0'} ${showFooter ? 'pb-24' : 'pb-8'}`}>
        
        {/* Steps Progress Indicator - In Main Content */}
        {showHeader && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-6 mb-8">
                {phases.slice(0, 4).map((phaseItem, index) => {
                  const status = getPhaseStatus(phaseItem.id);
                  const isActive = status === 'active';
                  const isCompleted = status === 'completed';
                  const IconComponent = phaseItem.icon;

                  return (
                    <div key={phaseItem.id} className="flex items-center gap-6">
                      <div className="flex flex-col items-center group">
                        <div className={`
                          relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110
                          ${isActive 
                            ? 'glass-premium bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25' 
                            : isCompleted 
                              ? 'glass-premium bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                              : 'glass-light border border-gray-200/60 text-gray-600'
                          }
                        `}>
                          <IconComponent className="h-6 w-6" />
                          
                          {/* Glow effect for active phase */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 blur-lg opacity-30 -z-10 animate-pulse" />
                          )}
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-semibold transition-colors duration-300 ${
                            isActive ? 'text-pink-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {phaseItem.name}
                          </div>
                        </div>
                      </div>
                      {index < 3 && (
                        <div className={`w-12 h-0.5 transition-colors duration-500 ${
                          isCompleted ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Phase Components */}
        {phase === 'location-selection' && (
          <LocationSelection onContinue={() => setPhase('service-selection')} />
        )}

        {phase === 'service-selection' && (
          <ServiceSelection 
            onContinue={() => setPhase('pass-recommendations')}
            onBack={() => setPhase('location-selection')}
          />
        )}

        {phase === 'pass-recommendations' && (
          <PassRecommendations
            onContinue={() => setPhase('summary-checkout')}
            onBack={() => setPhase('service-selection')}
          />
        )}

        {phase === 'summary-checkout' && (
          <SummaryCheckout
            onBack={() => setPhase('pass-recommendations')}
            onComplete={handleBookingSuccess}
          />
        )}

        {phase === 'booking-success' && (
          <BookingSuccess 
            onComplete={handleReset}
            bookingData={bookingData}
          />
        )}
      </div>

      {/* Fixed Footer */}
      <CalculatorFooter
        currentPhase={phase}
        onBack={getBackAction()}
        onContinue={getContinueAction()}
        canContinue={getCanContinue()}
        continueText={getContinueText()}
      />
    </div>
  );
}

export default function WaxPassCalculator() {
  return (
    <WaxPassProvider>
      <WaxPassCalculatorContent />
    </WaxPassProvider>
  );
} 