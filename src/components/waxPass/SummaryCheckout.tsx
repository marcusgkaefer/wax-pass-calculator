import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, CheckCircle, Star, Clock, DollarSign, Sparkles, ShoppingBag, Gift, Users, Phone, Mail } from 'lucide-react';
import { useWaxPass } from '@/lib/WaxPassContext';

interface SummaryCheckoutProps {
  onBack?: () => void;
  onComplete: () => void;
}

export default function SummaryCheckout({ onBack, onComplete }: SummaryCheckoutProps) {
  const { selectedWaxCenter, selectedServices, selectedPasses } = useWaxPass();
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);

  // Calculate totals
  const servicesTotal = selectedServices.reduce((sum, service) => sum + service.standard_price, 0);
  const passTotal = selectedPasses.reduce((sum, pass) => sum + pass.price, 0);

  const handleBookNow = async () => {
    setIsBookingInProgress(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the booking
    onComplete();
  };

  return (
    <div className="min-h-screen glass-ultra-light">
      {/* Floating Gradient Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            {onBack && (
              <Button 
                onClick={onBack}
                variant="ghost" 
                size="sm"
                className="glass-micro-interaction hover:bg-white/20 border border-white/30"
                disabled={isBookingInProgress}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Summary</h1>
              <p className="text-gray-600">Review your selection and confirm your booking</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location & Services */}
            <Card className="glass-card border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <MapPin className="h-5 w-5 text-pink-500" />
                  Location & Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Location */}
                <div className="glass-ultra-light p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">{selectedWaxCenter?.display_name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedWaxCenter?.address_info.address1}, {selectedWaxCenter?.address_info.city}, {selectedWaxCenter?.state.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedWaxCenter?.phone || '(555) 123-4567'}
                    </p>
                  </div>
                </div>

                {/* Selected Services */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Selected Services</h3>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.service_id} className="flex items-center justify-between p-3 glass-ultra-light rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{service.service_name}</p>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">${service.standard_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Pass */}
            {selectedPasses.length > 0 && (
              <Card className="glass-card border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                    <Gift className="h-5 w-5 text-purple-500" />
                    Wax Pass
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPasses.map((pass) => (
                    <div key={pass.service_id} className="glass-ultra-light p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-800">{pass.pass_level} Pass</h3>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {pass.pass_type === 'unlimited' ? 'Unlimited' : 'Prepaid'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Premium wax pass with exclusive benefits</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Pass Value</p>
                            <p className="font-semibold text-gray-800">${pass.price}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Savings</p>
                            <p className="font-semibold text-green-600">${Math.max(0, servicesTotal - pass.price)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Benefits Summary */}
            <Card className="glass-card border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Priority booking access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Professional waxing services</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Premium aftercare products</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Flexible scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Expert consultation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Satisfaction guarantee</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/40 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Services ({selectedServices.length})</span>
                    <span className="text-gray-800">${servicesTotal}</span>
                  </div>
                  
                  {selectedPasses.length > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pass Discount</span>
                        <span className="text-green-600">-${Math.max(0, servicesTotal - passTotal)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-800">Pass Total</span>
                        <span className="text-gray-800">${passTotal}</span>
                      </div>
                    </>
                  )}
                  
                  {selectedPasses.length === 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-gray-800">${servicesTotal}</span>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Next Steps */}
                <div className="glass-ultra-light p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Next Steps:</h4>
                  <ul className="space-y-1">
                    <li className="text-xs text-gray-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                      Confirm your booking details
                    </li>
                    <li className="text-xs text-gray-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                      Schedule your appointment
                    </li>
                    <li className="text-xs text-gray-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                      Receive confirmation email
                    </li>
                  </ul>
                </div>

                {/* Book Now Button */}
                <Button 
                  onClick={handleBookNow}
                  disabled={isBookingInProgress}
                  size="lg"
                  className="w-full glass-micro-interaction bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-pink-500/25 disabled:opacity-50"
                >
                  {isBookingInProgress ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                      <span>Booking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>Book Now</span>
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
