import { useState } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { formatCurrency } from '@/lib/waxPassCalculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, Edit, X, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface SummaryCheckoutProps {
  onBack: () => void;
}

export default function SummaryCheckout({ onBack }: SummaryCheckoutProps) {
  const { selectedWaxCenter, selectedServices, selectedPasses, removePass } = useWaxPass();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  // Calculate the total amount due
  const totalDue = selectedPasses.reduce(
    (sum, pass) => sum + pass.price, 
    0
  );
  
  // Mock function to simulate payment processing
  const handlePayment = () => {
    // In a real implementation, this would integrate with your payment system
    setIsPaymentComplete(true);
  };
  
  // Find service name by service ID
  const getServiceName = (serviceId: string) => {
    const service = selectedServices.find(s => s.service_id === serviceId);
    return service ? service.service_name : 'Unknown Service';
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
            <p className="text-muted-foreground">Amount Paid: {formatCurrency(totalDue)}</p>
            <p className="text-muted-foreground">Date: {format(new Date(), 'MMM d, yyyy')}</p>
            <p className="text-muted-foreground">Location: {selectedWaxCenter?.display_name}</p>
          </CardContent>
        </Card>
        
        <Button className="mt-8" onClick={() => window.location.href = "/"}>
          Return to Home
        </Button>
      </div>
    );
  }
  
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
  
  if (selectedPasses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please select at least one pass first.</p>
        <Button onClick={onBack}>
          Back to Pass Options
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
      
      <div className="mb-4">
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          <p>Wax center: <span className="font-medium">{selectedWaxCenter.display_name}</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {selectedPasses.map((pass) => {
              const serviceName = getServiceName(pass.service_id);
              const passTypeDisplay = pass.pass_type === 'prepaid' ? 'Prepaid Pass' : 'Unlimited Pass';
              
              return (
                <Card key={pass.service_id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{serviceName}</h3>
                        <p className="text-muted-foreground">{passTypeDisplay} - {pass.pass_level}</p>
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
                        <span>Total Price:</span>
                        <span className="font-medium">{formatCurrency(pass.price)}</span>
                      </div>
                    </div>
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
                    <span>{getServiceName(pass.service_id)}</span>
                    <span>{formatCurrency(pass.price)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(totalDue)}</span>
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
        </div>
      </div>
    </div>
  );
} 