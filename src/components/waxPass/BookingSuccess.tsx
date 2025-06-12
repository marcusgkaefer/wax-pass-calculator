import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Star, Gift, Sparkles, ArrowRight, Home } from 'lucide-react';
import { ZenotiCenter } from '@/lib/zenotiApi';
import { WaxService, SelectedPass } from '@/data/waxPassData';

interface BookingSuccessProps {
  onComplete: () => void;
  bookingData?: {
    waxCenter: ZenotiCenter | null;
    services: WaxService[];
    passes: SelectedPass[];
  } | null;
}

export default function BookingSuccess({ onComplete, bookingData }: BookingSuccessProps) {
  // Use bookingData or fallback to empty values
  const selectedWaxCenter = bookingData?.waxCenter;
  const selectedServices = bookingData?.services || [];
  const selectedPasses = bookingData?.passes || [];

  // Generate a booking confirmation number
  const confirmationNumber = `EWC${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen glass-ultra-light">
      {/* Floating Gradient Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center glass-premium shadow-lg shadow-green-500/25">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your wax pass has been successfully reserved. Get ready for a premium waxing experience!
            </p>
            
            {/* Confirmation Number */}
            <div className="mt-6 inline-block">
              <Badge className="glass-premium bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-4 py-2">
                <Gift className="h-4 w-4 mr-2" />
                Confirmation #{confirmationNumber}
              </Badge>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Location & Contact Info */}
            <Card className="glass-card border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Your Wax Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass-ultra-light p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">{selectedWaxCenter?.display_name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>{selectedWaxCenter?.address_info.address1}, {selectedWaxCenter?.address_info.city}, {selectedWaxCenter?.state.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>{selectedWaxCenter?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-green-500" />
                      <span>{selectedWaxCenter?.email || 'info@ewc.com'}</span>
                    </div>
                  </div>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9 • Excellent Reviews</span>
                </div>
              </CardContent>
            </Card>

            {/* Pass Summary */}
            <Card className="glass-card border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Your Pass Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPasses.map((pass) => (
                  <div key={pass.service_id} className="glass-ultra-light p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{pass.pass_level} Pass</h3>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {pass.pass_type === 'unlimited' ? 'Unlimited' : 'Prepaid'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Premium wax pass with exclusive benefits</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-600 text-lg">${pass.price}</span>
                      <span className="text-sm text-gray-500">{selectedServices.length} services included</span>
                    </div>
                  </div>
                ))}

                {/* Services Included */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 text-sm">Services Included:</h4>
                  <div className="space-y-1">
                    {selectedServices.slice(0, 3).map((service) => (
                      <div key={service.service_id} className="text-xs text-gray-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {service.service_name}
                      </div>
                    ))}
                    {selectedServices.length > 3 && (
                      <div className="text-xs text-gray-500">+{selectedServices.length - 3} more services</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="glass-card border-white/40 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Calendar className="h-5 w-5 text-blue-500" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Check Your Email</h3>
                  <p className="text-sm text-gray-600">You'll receive a confirmation email with your pass details and booking instructions.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Schedule Your Visit</h3>
                  <p className="text-sm text-gray-600">Call the center or use our mobile app to book your first appointment.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Enjoy Your Services</h3>
                  <p className="text-sm text-gray-600">Present your pass confirmation and enjoy premium waxing services.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offers */}
          <Card className="glass-card border-white/40 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">🎉 Special Welcome Offer</h3>
                  <p className="text-sm text-gray-600">Get 20% off premium aftercare products on your first visit!</p>
                </div>
                <Badge className="glass-premium bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Limited Time
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.print()}
              variant="outline"
              size="lg"
              className="glass-micro-interaction border-white/40 hover:bg-white/20"
            >
              📄 Print Confirmation
            </Button>
            <Button 
              onClick={onComplete}
              size="lg"
              className="glass-micro-interaction bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25"
            >
              <Home className="h-5 w-5 mr-2" />
              Start New Booking
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 