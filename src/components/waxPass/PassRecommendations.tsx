import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  Award,
  ArrowLeft,
  Sparkles,
  Gift,
  CheckCircle,
  Calculator,
  Calendar,
  CreditCard,
  Check,
} from "lucide-react";
import { useWaxPass } from "@/lib/WaxPassContext";
import { WaxService } from "@/data/waxPassData";

// Enhanced WaxPass interface matching price sheet structure
interface WaxPass {
  id: string;
  name: string;
  description: string;
  passType: "prepaid" | "unlimited";
  passLevel: "B9G3" | "B9G2" | "B6G1" | "12U2" | "12U3" | "13U2" | "13U3";
  totalSessions: number;
  freeSessions?: number; // For prepaid passes
  validityMonths: number;
  currentPrice: number;
  discountedPrice: number;
  savingsPerVisit: number;
  totalSavings: number;
  recommendationType: "best-value" | "most-popular" | "recommended" | "premium";
  benefits: string[];
  installmentOptions: InstallmentOption[];
}

interface InstallmentOption {
  id: string;
  installments: number;
  amountPerInstallment: number;
  totalAmount: number;
  firstPaymentDate: string;
  frequency: "monthly" | "bi-weekly" | "weekly";
  processingFee: number;
  dueDate: string;
}

interface PassRecommendationsProps {
  onContinue: () => void;
  onBack?: () => void;
}

export default function PassRecommendations({
  onContinue,
  onBack,
}: PassRecommendationsProps) {
  const {
    selectedServices,
    selectedWaxCenter,
    addOrUpdatePass,
    selectedPasses,
  } = useWaxPass();
  const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
  const [selectedInstallments, setSelectedInstallments] = useState<
    Record<string, string>
  >({});

  // Auto-select first installment option for each pass
  useEffect(() => {
    const waxPasses = generatePasses();
    const initialInstallments: Record<string, string> = {};
    waxPasses.forEach((pass) => {
      initialInstallments[pass.id] =
        pass.installmentOptions[0]?.id || "1-payment";
    });
    setSelectedInstallments(initialInstallments);
  }, [selectedServices]);

  // Update context when selection changes
  useEffect(() => {
    if (selectedPassId && selectedInstallments[selectedPassId]) {
      const waxPasses = generatePasses();
      const selectedPass = waxPasses.find((p) => p.id === selectedPassId);
      const selectedInstallment = selectedPass?.installmentOptions.find(
        (opt) => opt.id === selectedInstallments[selectedPassId]
      );

      if (selectedPass && selectedInstallment) {
        addOrUpdatePass({
          service_id: selectedPass.id,
          pass_type: selectedPass.passType,
          pass_level: selectedPass.passLevel,
          price: selectedInstallment.totalAmount,
        });
      }
    }
  }, [selectedPassId, selectedInstallments, addOrUpdatePass]);

  // Calculate real pricing based on price sheet logic
  const calculatePassPricing = (
    services: WaxService[],
    passLevel: string
  ): {
    price: number;
    discountedPrice: number;
    savingsPerVisit: number;
    totalSavings: number;
  } => {
    // Average service price for calculation
    const totalServicePrice = services.reduce(
      (sum, service) => sum + (service.standard_price || 50),
      0
    );
    const avgServicePrice = totalServicePrice / services.length || 50;

    let price = 0;
    let discountedPrice = 0;
    let savingsPerVisit = 0;
    let totalSavings = 0;

    switch (passLevel) {
      case "B9G3": // Buy 9, Get 3 Free = 12 sessions for price of 9
        price = avgServicePrice * 9; // Pay for 9 sessions
        discountedPrice = avgServicePrice * 0.75; // Effective rate per session (9/12)
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 3; // 3 free sessions
        break;
      case "B9G2": // Buy 9, Get 2 Free = 11 sessions for price of 9
        price = avgServicePrice * 9;
        discountedPrice = avgServicePrice * (9 / 11); // Effective rate per session
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 2;
        break;
      case "B6G1": // Buy 6, Get 1 Free = 7 sessions for price of 6
        price = avgServicePrice * 6;
        discountedPrice = avgServicePrice * (6 / 7); // Effective rate per session
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 1;
        break;
      case "12U2": // 12 months unlimited, every 2 weeks = ~26 sessions
        price = avgServicePrice * 12.77; // Based on price sheet calculations
        discountedPrice = avgServicePrice * 0.49; // ~50% savings typical
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 13.23; // Estimated based on sheet
        break;
      case "12U3": // 12 months unlimited, every 3 weeks = ~17 sessions
        price = avgServicePrice * 18.76;
        discountedPrice = avgServicePrice * 1.1;
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 6.24;
        break;
      case "13U2": // 13 months unlimited, every 2 weeks = ~28 sessions
        price = avgServicePrice * 11.39;
        discountedPrice = avgServicePrice * 0.41;
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 16.61;
        break;
      case "13U3": // 13 months unlimited, every 3 weeks = ~18 sessions
        price = avgServicePrice * 17.72;
        discountedPrice = avgServicePrice * 0.98;
        savingsPerVisit = avgServicePrice - discountedPrice;
        totalSavings = avgServicePrice * 8.28;
        break;
    }

    return {
      price: Math.round(price),
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      savingsPerVisit: Math.round(savingsPerVisit * 100) / 100,
      totalSavings: Math.round(totalSavings),
    };
  };

  const generateInstallmentOptions = (
    passPrice: number
  ): InstallmentOption[] => {
    const today = new Date();
    const options: InstallmentOption[] = [];

    // 1 installment - Full payment
    options.push({
      id: "1-payment",
      installments: 1,
      amountPerInstallment: passPrice,
      totalAmount: passPrice,
      firstPaymentDate: today.toISOString().split("T")[0],
      frequency: "monthly",
      processingFee: 0,
      dueDate: today.toISOString().split("T")[0],
    });

    // 2 installments
    options.push({
      id: "2-payments",
      installments: 2,
      amountPerInstallment: Math.ceil(passPrice / 2),
      totalAmount: passPrice,
      firstPaymentDate: today.toISOString().split("T")[0],
      frequency: "monthly",
      processingFee: 0,
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    // 3 installments
    options.push({
      id: "3-payments",
      installments: 3,
      amountPerInstallment: Math.ceil(passPrice / 3),
      totalAmount: passPrice,
      firstPaymentDate: today.toISOString().split("T")[0],
      frequency: "monthly",
      processingFee: 0,
      dueDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    // 4 installments
    options.push({
      id: "4-payments",
      installments: 4,
      amountPerInstallment: Math.ceil(passPrice / 4),
      totalAmount: passPrice,
      firstPaymentDate: today.toISOString().split("T")[0],
      frequency: "monthly",
      processingFee: 0,
      dueDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    return options;
  };

  // Generate passes based on selected services using real EWC price sheet logic
  const generatePasses = (): WaxPass[] => {
    if (!selectedServices.length) return [];

    const passes: WaxPass[] = [];
    const avgServicePrice =
      selectedServices.reduce(
        (sum, service) => sum + (service.standard_price || 50),
        0
      ) / selectedServices.length || 50;

    // NEW GUEST OFFERS (show these first if applicable)
    // Welcome Wax Pass - 4 sessions, 6 months validity, 25% savings
    const welcomePricing = calculatePassPricing(selectedServices, "B6G1"); // Using B6G1 as base for 4+1 concept
    passes.push({
      id: "welcome",
      name: "Welcome Wax Pass",
      description:
        "Perfect for first-time guests! 4 sessions with select services.",
      passType: "prepaid",
      passLevel: "B6G1",
      totalSessions: 4,
      freeSessions: 0,
      validityMonths: 6,
      currentPrice: Math.round(avgServicePrice * 3), // 4 sessions at 25% discount
      discountedPrice: avgServicePrice * 0.75,
      savingsPerVisit: avgServicePrice * 0.25,
      totalSavings: Math.round(avgServicePrice),
      recommendationType: "recommended",
      benefits: [
        "4 total sessions for select services",
        "6 months validity",
        "First visit only offer",
        "Use at any location",
        "No payment plan required",
      ],
      installmentOptions: generateInstallmentOptions(
        Math.round(avgServicePrice * 3)
      ),
    });

    // 9+3 New Guest Pass - 12 sessions, never expires, 25% savings
    const newGuest12Pricing = calculatePassPricing(selectedServices, "B9G3");
    passes.push({
      id: "new-guest-12",
      name: "9+3 New Guest Pass",
      description: "Amazing value for new guests! Buy 9 sessions, get 3 free.",
      passType: "prepaid",
      passLevel: "B9G3",
      totalSessions: 12,
      freeSessions: 3,
      validityMonths: 999, // Never expires
      currentPrice: newGuest12Pricing.price,
      discountedPrice: newGuest12Pricing.discountedPrice,
      savingsPerVisit: newGuest12Pricing.savingsPerVisit,
      totalSavings: newGuest12Pricing.totalSavings,
      recommendationType: "best-value",
      benefits: [
        "12 total sessions (9 paid + 3 free)",
        "Never expires",
        "First or second visit only",
        "Use at any location",
        "No payment plan available",
      ],
      installmentOptions: generateInstallmentOptions(newGuest12Pricing.price),
    });

    // REGULAR PASSES
    // Single Center Pass - 12 sessions, never expires, 25% savings, location-restricted
    const singleCenterPricing = calculatePassPricing(selectedServices, "B9G2");
    passes.push({
      id: "single-center-12",
      name: "Single Center Wax Pass",
      description:
        "Great value for guests who visit once a month or less at one location.",
      passType: "prepaid",
      passLevel: "B9G2",
      totalSessions: 12,
      freeSessions: 2,
      validityMonths: 999, // Never expires
      currentPrice: Math.round(singleCenterPricing.price * 0.9), // Slightly cheaper than redeem anywhere
      discountedPrice: singleCenterPricing.discountedPrice,
      savingsPerVisit: singleCenterPricing.savingsPerVisit,
      totalSavings: singleCenterPricing.totalSavings,
      recommendationType: "most-popular",
      benefits: [
        "12 total sessions with free bonus sessions",
        "Never expires - use at your pace",
        "Valid at selected center only",
        "Perfect for monthly visits",
        "Online purchase available",
        "No payment plan available",
      ],
      installmentOptions: generateInstallmentOptions(
        Math.round(singleCenterPricing.price * 0.9)
      ),
    });

    // Redeem Anywhere Pass - 12 or 7 sessions, never expires, flexibility premium
    const redeemAnywhere12Pricing = calculatePassPricing(
      selectedServices,
      "B9G3"
    );
    passes.push({
      id: "redeem-anywhere-12",
      name: "Redeem Anywhere Pass (12)",
      description:
        "Maximum flexibility! Use at any location with payment plan options.",
      passType: "prepaid",
      passLevel: "B9G3",
      totalSessions: 12,
      freeSessions: 3,
      validityMonths: 999, // Never expires
      currentPrice: redeemAnywhere12Pricing.price,
      discountedPrice: redeemAnywhere12Pricing.discountedPrice,
      savingsPerVisit: redeemAnywhere12Pricing.savingsPerVisit,
      totalSavings: redeemAnywhere12Pricing.totalSavings,
      recommendationType: "recommended",
      benefits: [
        "12 total sessions (9 paid + 3 free)",
        "Never expires",
        "Use at any EWC location",
        "Payment plan available",
        "Perfect for monthly visits",
      ],
      installmentOptions: generateInstallmentOptions(
        redeemAnywhere12Pricing.price
      ),
    });

    // Redeem Anywhere Pass - 7 sessions alternative
    const redeemAnywhere7Pricing = calculatePassPricing(
      selectedServices,
      "B6G1"
    );
    passes.push({
      id: "redeem-anywhere-7",
      name: "Redeem Anywhere Pass (7)",
      description: "Flexible starter option with location freedom.",
      passType: "prepaid",
      passLevel: "B6G1",
      totalSessions: 7,
      freeSessions: 1,
      validityMonths: 999, // Never expires
      currentPrice: redeemAnywhere7Pricing.price,
      discountedPrice: redeemAnywhere7Pricing.discountedPrice,
      savingsPerVisit: redeemAnywhere7Pricing.savingsPerVisit,
      totalSavings: redeemAnywhere7Pricing.totalSavings,
      recommendationType: "recommended",
      benefits: [
        "7 total sessions (6 paid + 1 free)",
        "Never expires",
        "Use at any EWC location",
        "Payment plan available",
        "Great starter option",
      ],
      installmentOptions: generateInstallmentOptions(
        redeemAnywhere7Pricing.price
      ),
    });

    // UNLIMITED PASS (only for specific services)
    // Check if selected services qualify for unlimited (underarm, full face, brow, bikini)
    const unlimitedQualifyingServices = selectedServices.filter(
      (service) =>
        service.service_name.toLowerCase().includes("underarm") ||
        service.service_name.toLowerCase().includes("face") ||
        service.service_name.toLowerCase().includes("brow") ||
        service.service_name.toLowerCase().includes("bikini") ||
        service.service_name.toLowerCase().includes("eyebrow")
    );

    if (unlimitedQualifyingServices.length > 0) {
      const unlimitedPricing = calculatePassPricing(selectedServices, "12U2");
      passes.push({
        id: "12u2-unlimited",
        name: "Unlimited Wax Pass",
        description:
          "For guests who prefer to wax more frequently. 12 months of unlimited visits!",
        passType: "unlimited",
        passLevel: "12U2",
        totalSessions: 26, // ~every 2 weeks for 12 months
        validityMonths: 12,
        currentPrice: unlimitedPricing.price,
        discountedPrice: unlimitedPricing.discountedPrice,
        savingsPerVisit: unlimitedPricing.savingsPerVisit,
        totalSavings: unlimitedPricing.totalSavings,
        recommendationType: "premium",
        benefits: [
          "Unlimited visits for 12 months",
          "Valid for underarm, face, brow, bikini services",
          "Use at any location",
          "Payment plan available",
          "Perfect for frequent waxers",
        ],
        installmentOptions: generateInstallmentOptions(unlimitedPricing.price),
      });
    }

    return passes;
  };

  const [waxPasses] = useState<WaxPass[]>(generatePasses());

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "best-value":
        return <TrendingUp className="h-4 w-4" />;
      case "most-popular":
        return <Star className="h-4 w-4" />;
      case "recommended":
        return <Award className="h-4 w-4" />;
      case "premium":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "best-value":
        return "from-green-500 to-emerald-500";
      case "most-popular":
        return "from-yellow-500 to-orange-500";
      case "recommended":
        return "from-blue-500 to-indigo-500";
      case "premium":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const handlePassSelect = (passId: string) => {
    setSelectedPassId(passId);
  };

  const handleInstallmentSelect = (passId: string, installmentId: string) => {
    setSelectedInstallments((prev) => ({
      ...prev,
      [passId]: installmentId,
    }));
  };

  // Helper function to get proper installment amounts for display
  const getInstallmentAmounts = (installment: InstallmentOption) => {
    const { totalAmount, installments } = installment;
    const baseAmount = Math.floor(totalAmount / installments);
    const remainder = totalAmount - baseAmount * (installments - 1);

    const amounts = Array(installments - 1).fill(baseAmount);
    amounts.push(remainder); // Last payment gets any remainder

    return amounts;
  };

  if (!selectedWaxCenter || selectedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass-light border border-white/20 rounded-3xl p-12 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-ultra-light flex items-center justify-center">
            <Calculator className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Incomplete Selection
          </h3>
          <p className="text-gray-600 mb-6">
            Please select a location and services first to see pass
            recommendations.
          </p>
          {onBack && (
            <Button
              onClick={onBack}
              className="glass-micro-interaction bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hover:from-pink-600 hover:to-purple-600"
            >
              Back to Services
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          {/* Header Content */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="sm"
                  className="glass-micro-interaction hover:bg-white/20 border border-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Choose Your Perfect Pass
                </h1>
                <p className="text-gray-600">
                  Select a wax pass and payment plan that fits your needs
                </p>
              </div>
            </div>

            {/* Summary Bar */}
            <Card className="glass-light border-white/20">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800">
                        {selectedWaxCenter?.display_name || "Not selected"}
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Services</p>
                      <p className="font-semibold text-gray-800">
                        {selectedServices.length} selected
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total Value</p>
                      <p className="font-semibold text-gray-800">
                        $
                        {selectedServices.reduce(
                          (sum, service) =>
                            sum + (service.standard_price || 50),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Pass Selection with Integrated Payment Options */}
        {waxPasses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {waxPasses.map((pass) => {
              const isSelected = selectedPassId === pass.id;
              const selectedInstallment = pass.installmentOptions.find(
                (opt) => opt.id === selectedInstallments[pass.id]
              );

              return (
                <Card
                  key={pass.id}
                  className={`glass-card border-white/20 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-pink-500 shadow-xl shadow-pink-500/25 scale-[1.02]"
                      : "hover:shadow-lg hover:scale-[1.01]"
                  }`}
                  onClick={() => handlePassSelect(pass.id)}
                >
                  <CardHeader className="relative pb-4">
                    {/* Recommendation Badge */}
                    <Badge
                      className={`absolute -top-2 -right-2 glass-premium bg-gradient-to-r ${getRecommendationColor(
                        pass.recommendationType
                      )} text-white border-0 shadow-lg`}
                    >
                      {getRecommendationIcon(pass.recommendationType)}
                      <span className="ml-1 capitalize">
                        {pass.recommendationType.replace("-", " ")}
                      </span>
                    </Badge>

                    {/* New Guest Offer Badge */}
                    {(pass.id === "welcome" || pass.id === "new-guest-12") && (
                      <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                        🎁 New Guest
                      </Badge>
                    )}

                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500 shadow-lg"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-gray-800">
                            {pass.name}
                          </CardTitle>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                              $
                              {selectedInstallment?.totalAmount ||
                                pass.currentPrice}
                            </div>
                            {selectedInstallment &&
                              selectedInstallment.installments > 1 && (
                                <div className="text-sm text-pink-600 font-medium">
                                  ${selectedInstallment.amountPerInstallment} ×{" "}
                                  {selectedInstallment.installments}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pass Features Badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {pass.validityMonths === 999 ? (
                        <Badge
                          variant="outline"
                          className="text-xs border-green-300 text-green-700"
                        >
                          ♾️ Never Expires
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs border-orange-300 text-orange-700"
                        >
                          ⏰ {pass.validityMonths} Month
                          {pass.validityMonths > 1 ? "s" : ""}
                        </Badge>
                      )}

                      {pass.id.includes("redeem-anywhere") ||
                      pass.id === "welcome" ||
                      pass.id === "new-guest-12" ||
                      pass.id === "12u2-unlimited" ? (
                        <Badge
                          variant="outline"
                          className="text-xs border-blue-300 text-blue-700"
                        >
                          🌍 Any Location
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 text-gray-700"
                        >
                          📍 Single Center
                        </Badge>
                      )}

                      {pass.id !== "single-center-12" &&
                      pass.id !== "welcome" &&
                      pass.id !== "new-guest-12" ? (
                        <Badge
                          variant="outline"
                          className="text-xs border-purple-300 text-purple-700"
                        >
                          💳 Payment Plan
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 text-gray-600"
                        >
                          💰 Full Payment
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm">{pass.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Payment Options - Integrated */}
                    <div className="glass-ultra-light p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Payment Options
                        </span>
                      </div>

                      {/* Payment Options Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {pass.installmentOptions.map((installment) => (
                          <button
                            key={installment.id}
                            onClick={() =>
                              handleInstallmentSelect(pass.id, installment.id)
                            }
                            className={`text-left p-2 rounded-lg text-xs transition-all duration-200 ${
                              selectedInstallments[pass.id] === installment.id
                                ? "bg-pink-100 border border-pink-300 text-pink-800"
                                : "bg-white/50 border border-gray-200 text-gray-700 hover:bg-white/70"
                            }`}
                          >
                            <div className="font-medium">
                              {installment.installments === 1
                                ? "1 Payment"
                                : `${installment.installments} Payments`}
                            </div>
                            <div className="text-gray-600">
                              {installment.installments === 1
                                ? `$${installment.totalAmount}`
                                : `$${installment.amountPerInstallment}/mo`}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Benefits Preview */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">
                        Key Benefits:
                      </h4>
                      <ul className="space-y-1">
                        {pass.benefits.slice(0, 3).map((benefit, index) => (
                          <li
                            key={index}
                            className="text-xs text-gray-600 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Continue Button */}
        {selectedPassId && (
          <div className="mt-8 text-center">
            <Button
              onClick={onContinue}
              className="glass-micro-interaction bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hover:from-pink-600 hover:to-purple-600 shadow-lg px-8 py-3"
              size="lg"
            >
              Continue to Summary
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
