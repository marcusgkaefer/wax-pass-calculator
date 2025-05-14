import { useState } from "react";
import { useWaxPass } from "@/lib/WaxPassContext";
import { formatCurrency } from "@/lib/waxPassCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  Edit,
  X,
  MapPin,
  CreditCard,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { format, addMonths } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SummaryCheckoutProps {
  onBack: () => void;
}

export default function SummaryCheckout({ onBack }: SummaryCheckoutProps) {
  const { selectedWaxCenter, selectedServices, selectedPasses, removePass } =
    useWaxPass();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [expandedPaymentPlans, setExpandedPaymentPlans] = useState<string[]>(
    []
  );

  // Calculate the total amount due
  const totalDue = selectedPasses.reduce((sum, pass) => sum + pass.price, 0);

  // Calculate first payment amount (including passes with installments)
  const firstPaymentAmount = selectedPasses.reduce((sum, pass) => {
    const installments = pass.installments || 1;
    return sum + pass.price / installments;
  }, 0);

  // Check if any pass has installments
  const hasInstallmentPlans = selectedPasses.some(
    (pass) => (pass.installments || 1) > 1
  );

  // Generate payment dates based on number of installments
  const getPaymentDates = (installments: number): Date[] => {
    const dates: Date[] = [new Date()]; // First payment is today

    for (let i = 1; i < installments; i++) {
      dates.push(addMonths(new Date(), i));
    }

    return dates;
  };

  // Toggle expanded state for a payment plan
  const togglePaymentPlanExpanded = (passId: string) => {
    setExpandedPaymentPlans((prev) =>
      prev.includes(passId)
        ? prev.filter((id) => id !== passId)
        : [...prev, passId]
    );
  };

  // Calculate future payments schedule
  const getFuturePayments = () => {
    const payments: { date: Date; amount: number }[] = [];

    // Get the maximum number of installments
    const maxInstallments = Math.max(
      ...selectedPasses.map((pass) => pass.installments || 1)
    );

    // Create payment schedule for each month
    for (let i = 1; i < maxInstallments; i++) {
      const paymentDate = addMonths(new Date(), i);
      const amount = selectedPasses.reduce((sum, pass) => {
        const installments = pass.installments || 1;
        // Only include this pass if it has more installments than the current index
        return sum + (i < installments ? pass.price / installments : 0);
      }, 0);

      if (amount > 0) {
        payments.push({ date: paymentDate, amount });
      }
    }

    return payments;
  };

  const futurePayments = getFuturePayments();

  // Mock function to simulate payment processing
  const handlePayment = () => {
    // In a real implementation, this would integrate with your payment system
    setIsPaymentComplete(true);
  };

  // Find service name by service ID
  const getServiceName = (serviceId: string) => {
    const service = selectedServices.find((s) => s.service_id === serviceId);
    return service ? service.service_name : "Unknown Service";
  };

  if (isPaymentComplete) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-green-100 h-24 w-24 flex items-center justify-center mx-auto mb-6">
          <Check className="text-green-600" size={48} />
        </div>

        <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
        <p className="text-muted-foreground mb-4">
          Your Wax Pass purchase has been completed successfully. You can view
          your passes in your account.
        </p>

        {hasInstallmentPlans && (
          <p className="text-sm text-muted-foreground mb-6">
            You've paid {formatCurrency(firstPaymentAmount)} today. Future
            payments will be automatically processed according to your payment
            schedule.
          </p>
        )}

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Purchase Details</h3>
            <p className="text-muted-foreground">
              Amount Paid Today: {formatCurrency(firstPaymentAmount)}
            </p>
            <p className="text-muted-foreground">
              Total Value: {formatCurrency(totalDue)}
            </p>
            <p className="text-muted-foreground">
              Date: {format(new Date(), "MMM d, yyyy")}
            </p>
            <p className="text-muted-foreground">
              Location: {selectedWaxCenter?.display_name}
            </p>

            {hasInstallmentPlans && futurePayments.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold mb-2">Future Payments</h4>
                {futurePayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <span>{format(payment.date, "MMM d, yyyy")}</span>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button className="mt-8" onClick={() => (window.location.href = "/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  if (!selectedWaxCenter) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">
          Please select a wax center first.
        </p>
        <Button onClick={onBack}>Back to Location Selection</Button>
      </div>
    );
  }

  if (selectedPasses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">
          Please select at least one pass first.
        </p>
        <Button onClick={onBack}>Back to Pass Options</Button>
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
          <p>
            Wax center:{" "}
            <span className="font-medium">
              {selectedWaxCenter.display_name}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {selectedPasses.map((pass) => {
              const serviceName = getServiceName(pass.service_id);
              const passTypeDisplay =
                pass.pass_type === "prepaid"
                  ? "Prepaid Pass"
                  : "Unlimited Pass";
              const installments = pass.installments || 1;
              const installmentAmount = pass.price / installments;
              const paymentDates = getPaymentDates(installments);
              const isExpanded = expandedPaymentPlans.includes(pass.service_id);
              const passId = pass.service_id;

              return (
                <Card key={passId}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{serviceName}</h3>
                        <p className="text-muted-foreground">
                          {passTypeDisplay} - {pass.pass_level}
                        </p>
                        {installments > 1 && (
                          <Badge
                            variant="outline"
                            className="mt-2 bg-blue-50 text-blue-700"
                          >
                            <Calendar className="mr-1 h-3 w-3" /> {installments}{" "}
                            monthly payments
                          </Badge>
                        )}
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
                        <span className="font-medium">
                          {formatCurrency(pass.price)}
                        </span>
                      </div>

                      {installments > 1 && (
                        <Collapsible
                          open={isExpanded}
                          onOpenChange={() => togglePaymentPlanExpanded(passId)}
                          className="border rounded-md p-2 mt-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Payment Plan:</span>
                            <div className="flex items-center">
                              <span className="text-sm mr-2">
                                {formatCurrency(installmentAmount)} ×{" "}
                                {installments} months
                              </span>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  {isExpanded ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>

                          <CollapsibleContent className="pt-2 mt-2 border-t">
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-muted-foreground mb-1">
                                <Calendar size={12} className="mr-1" /> Payment
                                Schedule:
                              </div>
                              {paymentDates.map((date, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-xs text-muted-foreground"
                                >
                                  <span>
                                    Payment {index + 1}:{" "}
                                    {format(date, "MMM d, yyyy")}
                                    {index === 0 && (
                                      <span className="text-primary">
                                        {" "}
                                        (Today)
                                      </span>
                                    )}
                                  </span>
                                  <span>
                                    {formatCurrency(installmentAmount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={onBack}
                    >
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
                {selectedPasses.map((pass) => {
                  const installments = pass.installments || 1;
                  return (
                    <div key={pass.service_id}>
                      <div className="flex justify-between text-sm">
                        <span>{getServiceName(pass.service_id)}</span>
                        <span>{formatCurrency(pass.price)}</span>
                      </div>
                      {installments > 1 && (
                        <div className="text-xs text-muted-foreground pl-4">
                          {installments} payments of{" "}
                          {formatCurrency(pass.price / installments)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between font-medium">
                  <span>Total Value</span>
                  <span>{formatCurrency(totalDue)}</span>
                </div>

                {hasInstallmentPlans && (
                  <div className="bg-primary/10 p-3 rounded-md mt-3">
                    <div className="flex justify-between font-semibold text-primary mb-1">
                      <span>Due Today</span>
                      <span>{formatCurrency(firstPaymentAmount)}</span>
                    </div>

                    {futurePayments.length > 0 && (
                      <div className="space-y-1 text-xs text-muted-foreground mt-2 pt-2 border-t border-primary/20">
                        {futurePayments.map((payment, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{format(payment.date, "MMM d, yyyy")}</span>
                            <span>{formatCurrency(payment.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button className="w-full mt-8" size="lg" onClick={handlePayment}>
                Book Now
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By completing your purchase, you agree to our Terms of Service
                and Privacy Policy.
                {hasInstallmentPlans &&
                  " Future payments will be automatically charged to your payment method."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
