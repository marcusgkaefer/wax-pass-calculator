import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ShoppingCart, Info, CheckCircle } from 'lucide-react';
import { useWaxPass } from '@/lib/WaxPassContext';

interface CalculatorFooterProps {
  currentPhase: string;
  onBack?: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
  continueText?: string;
  backText?: string;
  showSummary?: boolean;
}

export default function CalculatorFooter({ 
  currentPhase, 
  onBack, 
  onContinue, 
  canContinue = true,
  continueText = 'Continue',
  backText = 'Back',
  showSummary = true
}: CalculatorFooterProps) {
  const { selectedWaxCenter, selectedServices, selectedPasses } = useWaxPass();

  // Don't show footer on success page or if no actions available
  if (currentPhase === 'booking-success' || (!onBack && !onContinue)) {
    return null;
  }

  // Only show if there are meaningful selections or actions
  const hasSelections = selectedWaxCenter || selectedServices.length > 0 || selectedPasses.length > 0;
  const hasActions = onBack || onContinue;

  if (!hasSelections && !hasActions) {
    return null;
  }

  const getSummaryText = () => {
    const parts = [];
    
    if (selectedServices.length > 0) {
      parts.push(`${selectedServices.length} service${selectedServices.length !== 1 ? 's' : ''}`);
    }
    
    if (selectedPasses.length > 0) {
      const totalValue = selectedPasses.reduce((sum, pass) => sum + pass.price, 0);
      parts.push(`$${totalValue}`);
    }

    return parts.join(' • ');
  };

  const getProgressPercent = () => {
    const phases = ['location-selection', 'service-selection', 'pass-recommendations', 'summary-checkout'];
    const currentIndex = phases.indexOf(currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-premium border-t border-white/30 shadow-lg backdrop-blur-xl">
      {/* Thin Progress Bar */}
      <div className="h-0.5 bg-gray-200/30">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${getProgressPercent()}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          {onBack ? (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="glass-micro-interaction border border-white/30 hover:bg-white/20 text-gray-700"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span className="text-xs">{backText}</span>
            </Button>
          ) : (
            <div />
          )}

          {/* Compact Summary */}
          {getSummaryText() && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <ShoppingCart className="h-3 w-3" />
              <span className="font-medium">{getSummaryText()}</span>
            </div>
          )}

          {/* Continue Button */}
          {onContinue ? (
            <Button
              onClick={onContinue}
              disabled={!canContinue}
              size="sm"
              className="glass-micro-interaction bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hover:from-pink-600 hover:to-purple-600 shadow-md disabled:opacity-50 disabled:hover:from-pink-500 disabled:hover:to-purple-500"
            >
              <span className="text-xs">{continueText}</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
} 