import { useState } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { formatCurrency } from '@/lib/waxPassCalculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Edit, X } from 'lucide-react';
import { format, addMonths } from 'date-fns';

interface SummaryCheckoutProps {
  onBack: () => void;
}

export default function SummaryCheckout({ onBack }: SummaryCheckoutProps) {
  const { selectedPasses, removePass } = useWaxPass();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  // Calculate the total amount due today across all passes
  const totalDueToday = selectedPasses.reduce(
    (sum, pass) => sum + pass.selected_payment_plan.first_payment_due, 
    0
  );
  
  // Calculate total savings across all passes
  const totalSavings = selectedPasses.reduce(
    (sum, pass) => sum + pass.total_savings_achieved_for_this_pass,
    0
  );
  
  // Mock function to simulate payment processing
  const handlePayment = () => {
    // In a real implementation, this would integrate with your payment system
    setIsPaymentComplete(true);
  };
  
  // Get the next payment date (1 month from now)
  const getNextPaymentDate = () => {
    return format(addMonths(new Date(), 1), 'MMM d, yyyy');
  };
  
  if (isPaymentComplete) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-green-100 h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <Check className="text-green-600" size={48} />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
        <p className="text-muted-foreground mb-8">
          Your Wax Pass purchase has been completed successfully. You can view your passes in your account.
        </p>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Purchase Details</h3>
            <p className="text-muted-foreground">Amount Paid: {formatCurrency(totalDueToday)}</p>
            <p className="text-muted-foreground">Date: {format(new Date(), 'MMM d, yyyy')}</p>
            <p className="text-green-600 font-medium mt-2">
              Total Savings: {formatCurrency(totalSavings)}
            </p>
          </CardContent>
        </Card>
        
        <Button className="mt-8" onClick={() => window.location.href = "/"}>
          Return to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2" size={16} />
        Back to Pass Options
      </Button>
      
      <h2 className="text-2xl font-bold mb-6">Review Your Selections</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {selectedPasses.map((pass) => {
              // Calculate future payment dates if applicable
              const futurePayments = [];
              if (pass.selected_payment_plan.installments > 1) {
                for (let i = 1; i < pass.selected_payment_plan.installments; i++) {
                  futurePayments.push({
                    amount: pass.selected_payment_plan.amount_per_installment,
                    date: format(addMonths(new Date(), i), 'MMM d, yyyy')
                  });
                }
              }
              
              return (
                <Card key={pass.service_id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{pass.service_name}</h3>
                        <p className="text-muted-foreground">{pass.pass_title_display}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removePass(pass.service_id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-medium">{formatCurrency(pass.final_total_pass_cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Plan:</span>
                        <span>
                          {pass.selected_payment_plan.installments === 1 
                            ? 'Pay in Full' 
                            : `${pass.selected_payment_plan.installments} Payments`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Due Today:</span>
                        <span className="font-medium">{formatCurrency(pass.selected_payment_plan.first_payment_due)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Total Savings:</span>
                        <span className="font-medium">{formatCurrency(pass.total_savings_achieved_for_this_pass)}</span>
                      </div>
                    </div>
                    
                    {futurePayments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Future Payments</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {futurePayments.map((payment, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{payment.date}</span>
                              <span>{formatCurrency(payment.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-4">
                    <Button variant="outline" size="sm" className="ml-auto" onClick={onBack}>
                      <Edit size={14} className="mr-1" />
                      Change
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {selectedPasses.map((pass) => (
                  <div key={pass.service_id} className="flex justify-between text-sm">
                    <span>{pass.service_name}</span>
                    <span>{formatCurrency(pass.selected_payment_plan.first_payment_due)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between font-medium">
                  <span>Subtotal Due Today</span>
                  <span>{formatCurrency(totalDueToday)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Total Savings</span>
                  <span>{formatCurrency(totalSavings)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-8" 
                size="lg"
                onClick={handlePayment}
              >
                Complete Purchase
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>
          
          {/* Payment Plan Info */}
          {selectedPasses.some(pass => pass.selected_payment_plan.installments > 1) && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2">Payment Plan Information</h4>
                <p className="text-xs text-muted-foreground">
                  You have selected a payment plan for one or more passes. Your first payment will be charged today, and future payments will be automatically processed on a monthly basis starting {getNextPaymentDate()}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 