import { useState } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { 
  calculatePaymentPlans, 
  formatCurrency, 
  getServicePassOptions,
  PrepaidPassDetails,
  UnlimitedPassDetails,
  PaymentPlan
} from '@/lib/waxPassCalculations';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PassRecommendationsProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function PassRecommendations({ onBack, onContinue }: PassRecommendationsProps) {
  const { selectedWaxCenter, selectedServices, selectedPasses, addOrUpdatePass } = useWaxPass();
  
  // Track selected payment plan for each pass
  const [selectedPaymentPlans, setSelectedPaymentPlans] = useState<Record<string, number>>({});
  
  // Handle selecting a payment plan for a specific pass
  const handlePaymentPlanChange = (serviceId: string, passType: string, installments: number) => {
    const key = `${serviceId}-${passType}`;
    setSelectedPaymentPlans(prev => ({
      ...prev,
      [key]: installments
    }));
  };
  
  // Handle selecting a pass
  const handleSelectPass = (
    serviceId: string,
    passType: 'unlimited' | 'prepaid',
    passLevel: string,
    price: number
  ) => {
    addOrUpdatePass({
      service_id: serviceId,
      pass_type: passType,
      pass_level: passLevel,
      price: price
    });
  };
  
  // Check if a specific pass is selected
  const isPassSelected = (serviceId: string, passType: 'unlimited' | 'prepaid', passLevel: string): boolean => {
    return selectedPasses.some(
      pass => pass.service_id === serviceId && 
              pass.pass_type === passType && 
              pass.pass_level === passLevel
    );
  };

  if (!selectedWaxCenter) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please select a wax center first.</p>
        <Button onClick={onBack}>
          Back to Location Selection
        </Button>
      </div>
    );
  }
  
  if (selectedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please select at least one service first.</p>
        <Button onClick={onBack}>
          Back to Service Selection
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2" size={16} />
        Back to Services
      </Button>
      
      <h2 className="text-2xl font-bold mb-6">Your Wax Pass Options</h2>
      
      <ScrollArea className="h-[600px] pr-4">
        {selectedServices.map(service => {
          const { prepaidOptions, unlimitedOptions } = getServicePassOptions(service);
          
          // Find the pass with the highest percentage savings for "Best Value" badge
          const allOptions = [...prepaidOptions, ...unlimitedOptions];
          const bestValueOption = allOptions.reduce((best, current) => {
            const currentSavingsPercent = (current.savingsPerVisit / service.standard_price) * 100;
            const bestSavingsPercent = best ? (best.savingsPerVisit / service.standard_price) * 100 : 0;
            return currentSavingsPercent > bestSavingsPercent ? current : best;
          }, null as (PrepaidPassDetails | UnlimitedPassDetails | null));
          
          const isBestValue = (option: PrepaidPassDetails | UnlimitedPassDetails) => {
            return bestValueOption && 
              ('passRuleId' in option && 'passRuleId' in bestValueOption && option.passRuleId === bestValueOption.passRuleId) ||
              ('passTypeCode' in option && 'passTypeCode' in bestValueOption && option.passTypeCode === bestValueOption.passTypeCode);
          };
          
          return (
            <div key={service.service_id} className="mb-10">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold">{service.service_name}</h3>
                <span className="ml-2 text-muted-foreground">
                  Standard Price: {formatCurrency(service.standard_price)}
                </span>
              </div>
              
              {/* Prepaid Pass Options */}
              {prepaidOptions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">Prepaid Pass Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prepaidOptions.map(option => {
                      const passLevel = option.passRuleId;
                      
                      return (
                        <Card key={passLevel} className={`overflow-hidden ${isPassSelected(service.service_id, 'prepaid', passLevel) ? 'border-primary' : ''}`}>
                          {isBestValue(option) && (
                            <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 text-center">
                              BEST VALUE
                            </div>
                          )}
                          <CardContent className="p-6">
                            <div className="mb-4">
                              <div className="flex justify-between items-start">
                                <h5 className="font-semibold text-lg">{service.service_name} - Prepaid</h5>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Info size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{option.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Your Price Per Visit</p>
                                <p className="font-semibold text-primary">{formatCurrency(option.discountedPricePerVisit)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Standard Price</p>
                                <p className="font-semibold">{formatCurrency(service.standard_price)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Savings Per Visit</p>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(option.savingsPerVisit)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Savings</p>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(option.totalSavings)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="font-medium">Total Pass Cost: {formatCurrency(option.totalPassCost)}</p>
                              <p className="text-sm text-muted-foreground">
                                For {option.totalServicesInPass} services total
                              </p>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              onClick={() => handleSelectPass(
                                service.service_id,
                                'prepaid',
                                passLevel,
                                option.totalPassCost
                              )}
                              variant={isPassSelected(service.service_id, 'prepaid', passLevel) ? "secondary" : "default"}
                            >
                              {isPassSelected(service.service_id, 'prepaid', passLevel) ? "Selected" : "Select This Pass"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Unlimited Pass Options */}
              {unlimitedOptions.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">Unlimited Pass Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unlimitedOptions.map(option => {
                      const passLevel = option.passTypeCode;
                      
                      return (
                        <Card key={passLevel} className={`overflow-hidden ${isPassSelected(service.service_id, 'unlimited', passLevel) ? 'border-primary' : ''}`}>
                          {isBestValue(option) && (
                            <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 text-center">
                              BEST VALUE
                            </div>
                          )}
                          <CardContent className="p-6">
                            <div className="mb-4">
                              <div className="flex justify-between items-start">
                                <h5 className="font-semibold text-lg">{service.service_name} - Unlimited</h5>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Info size={14} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{option.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Your Price Per Visit</p>
                                <p className="font-semibold text-primary">{formatCurrency(option.discountedPricePerVisit)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Standard Price</p>
                                <p className="font-semibold">{formatCurrency(service.standard_price)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Savings Per Visit</p>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(option.savingsPerVisit)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total Savings</p>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(option.totalSavings)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="font-medium">Total Pass Cost: {formatCurrency(option.totalPassPrice)}</p>
                              <p className="text-sm text-muted-foreground">
                                Unlimited visits for {option.durationMonths} months (approx. {option.estimatedVisits} visits)
                              </p>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              onClick={() => handleSelectPass(
                                service.service_id,
                                'unlimited',
                                passLevel,
                                option.totalPassPrice
                              )}
                              variant={isPassSelected(service.service_id, 'unlimited', passLevel) ? "secondary" : "default"}
                            >
                              {isPassSelected(service.service_id, 'unlimited', passLevel) ? "Selected" : "Select This Pass"}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <Separator className="my-6" />
            </div>
          );
        })}
      </ScrollArea>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onContinue} 
          disabled={selectedPasses.length === 0}
        >
          Continue to Summary
        </Button>
      </div>
    </div>
  );
} 