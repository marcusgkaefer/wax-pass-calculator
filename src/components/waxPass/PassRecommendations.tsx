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
import { ArrowLeft, Info, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { format, addMonths } from 'date-fns';

interface PassRecommendationsProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function PassRecommendations({ onBack, onContinue }: PassRecommendationsProps) {
  const { selectedWaxCenter, selectedServices, selectedPasses, addOrUpdatePass } = useWaxPass();
  
  // Track selected payment plan for each pass
  const [selectedPaymentPlans, setSelectedPaymentPlans] = useState<Record<string, number>>({});
  
  // Handle selecting a payment plan for a specific pass
  const handlePaymentPlanChange = (serviceId: string, passType: string, passLevel: string, installments: number) => {
    const key = `${serviceId}-${passType}-${passLevel}`;
    setSelectedPaymentPlans(prev => ({
      ...prev,
      [key]: installments
    }));
  };
  
  // Get the selected installments for a specific pass
  const getSelectedInstallments = (serviceId: string, passType: string, passLevel: string): number => {
    const key = `${serviceId}-${passType}-${passLevel}`;
    return selectedPaymentPlans[key] || 1; // Default to 1 installment
  };
  
  // Calculate monthly price based on total price and installments
  const calculateMonthlyPrice = (totalPrice: number, installments: number): number => {
    return totalPrice / installments;
  };

  // Generate payment dates based on number of installments
  const getPaymentDates = (installments: number): Date[] => {
    const dates: Date[] = [new Date()]; // First payment is today
    
    for (let i = 1; i < installments; i++) {
      dates.push(addMonths(new Date(), i));
    }
    
    return dates;
  };
  
  // Handle selecting a pass
  const handleSelectPass = (
    serviceId: string,
    passType: 'unlimited' | 'prepaid',
    passLevel: string,
    price: number
  ) => {
    // Get the number of installments
    const installments = getSelectedInstallments(serviceId, passType, passLevel);
    
    addOrUpdatePass({
      service_id: serviceId,
      pass_type: passType,
      pass_level: passLevel,
      price: price,
      installments: installments
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
                      const selectedInstallments = getSelectedInstallments(service.service_id, 'prepaid', passLevel);
                      const monthlyPrice = calculateMonthlyPrice(option.totalPassCost, selectedInstallments);
                      const isSelected = isPassSelected(service.service_id, 'prepaid', passLevel);
                      const paymentDates = getPaymentDates(selectedInstallments);
                      
                      return (
                        <Card key={passLevel} className={`overflow-hidden ${isSelected ? 'border-primary' : ''}`}>
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
                              <div className="flex justify-between">
                                <p className="font-medium">Total Pass Cost:</p>
                                <p className="font-medium">{formatCurrency(option.totalPassCost)}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                For {option.totalServicesInPass} services total
                              </p>
                            </div>
                            
                            {/* Installment Selector */}
                            <div className="mb-4 border-t border-b py-3">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium">Payment Plan:</p>
                                <Select
                                  value={selectedInstallments.toString()}
                                  onValueChange={(value) => handlePaymentPlanChange(
                                    service.service_id, 
                                    'prepaid', 
                                    passLevel, 
                                    parseInt(value)
                                  )}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Installments" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Pay in Full</SelectItem>
                                    <SelectItem value="2">2 Payments</SelectItem>
                                    <SelectItem value="3">3 Payments</SelectItem>
                                    <SelectItem value="4">4 Payments</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {selectedInstallments > 1 && (
                                <div className="bg-muted p-3 rounded-md space-y-2">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium flex items-center">
                                      <Calendar size={14} className="mr-1" /> Payment Schedule:
                                    </p>
                                    <p className="text-sm font-medium">
                                      {formatCurrency(monthlyPrice)} × {selectedInstallments}
                                    </p>
                                  </div>
                                  <div className="space-y-1 pt-1 border-t border-border/30">
                                    {paymentDates.map((date, index) => (
                                      <div key={index} className="flex justify-between text-xs">
                                        <span>
                                          Payment {index + 1}: {format(date, 'MMM d, yyyy')}
                                        </span>
                                        <span className={index === 0 ? "font-medium" : ""}>
                                          {formatCurrency(monthlyPrice)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              className="w-full" 
                              onClick={() => handleSelectPass(
                                service.service_id,
                                'prepaid',
                                passLevel,
                                option.totalPassCost
                              )}
                              variant={isSelected ? "secondary" : "default"}
                            >
                              {isSelected 
                                ? selectedInstallments > 1 
                                  ? `Selected • ${formatCurrency(monthlyPrice)}/mo`
                                  : "Selected"
                                : selectedInstallments > 1 
                                  ? `Select • ${formatCurrency(monthlyPrice)}/mo`
                                  : "Select This Pass"
                              }
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
                      const selectedInstallments = getSelectedInstallments(service.service_id, 'unlimited', passLevel);
                      const monthlyPrice = calculateMonthlyPrice(option.totalPassPrice, selectedInstallments);
                      const isSelected = isPassSelected(service.service_id, 'unlimited', passLevel);
                      const paymentDates = getPaymentDates(selectedInstallments);
                      
                      return (
                        <Card key={passLevel} className={`overflow-hidden ${isSelected ? 'border-primary' : ''}`}>
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
                              <div className="flex justify-between">
                                <p className="font-medium">Total Pass Cost:</p>
                                <p className="font-medium">{formatCurrency(option.totalPassPrice)}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Unlimited visits for {option.durationMonths} months (approx. {option.estimatedVisits} visits)
                              </p>
                            </div>
                            
                            {/* Installment Selector */}
                            <div className="mb-4 border-t border-b py-3">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium">Payment Plan:</p>
                                <Select
                                  value={selectedInstallments.toString()}
                                  onValueChange={(value) => handlePaymentPlanChange(
                                    service.service_id, 
                                    'unlimited', 
                                    passLevel, 
                                    parseInt(value)
                                  )}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Installments" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">Pay in Full</SelectItem>
                                    <SelectItem value="2">2 Payments</SelectItem>
                                    <SelectItem value="3">3 Payments</SelectItem>
                                    <SelectItem value="4">4 Payments</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {selectedInstallments > 1 && (
                                <div className="bg-muted p-3 rounded-md space-y-2">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium flex items-center">
                                      <Calendar size={14} className="mr-1" /> Payment Schedule:
                                    </p>
                                    <p className="text-sm font-medium">
                                      {formatCurrency(monthlyPrice)} × {selectedInstallments}
                                    </p>
                                  </div>
                                  <div className="space-y-1 pt-1 border-t border-border/30">
                                    {paymentDates.map((date, index) => (
                                      <div key={index} className="flex justify-between text-xs">
                                        <span>
                                          Payment {index + 1}: {format(date, 'MMM d, yyyy')}
                                        </span>
                                        <span className={index === 0 ? "font-medium" : ""}>
                                          {formatCurrency(monthlyPrice)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              className="w-full" 
                              onClick={() => handleSelectPass(
                                service.service_id,
                                'unlimited',
                                passLevel,
                                option.totalPassPrice
                              )}
                              variant={isSelected ? "secondary" : "default"}
                            >
                              {isSelected 
                                ? selectedInstallments > 1 
                                  ? `Selected • ${formatCurrency(monthlyPrice)}/mo`
                                  : "Selected"
                                : selectedInstallments > 1 
                                  ? `Select • ${formatCurrency(monthlyPrice)}/mo`
                                  : "Select This Pass"
                              }
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