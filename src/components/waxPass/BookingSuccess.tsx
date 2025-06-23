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
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Success Animation Background - Keep this one for special effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Success burst effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-ping"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6 shadow-xl">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-4">Your wax pass and appointment are ready</p>
          
          {/* Confirmation Number */}
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-base px-4 py-2">
            <Gift className="h-4 w-4 mr-2" />
            Confirmation #{confirmationNumber}
          </Badge>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Location Card */}
          <Card className="glass-card border-white/20">
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
          <Card className="glass-card border-white/20">
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

        {/* What's Next */}
        <Card className="glass-card border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Calendar className="h-5 w-5 text-blue-500" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Check Your Email</p>
                  <p className="text-sm text-gray-600">We've sent your pass details and booking confirmation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Schedule Your First Appointment</p>
                  <p className="text-sm text-gray-600">Call or visit our online booking portal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Enjoy Your Service</p>
                  <p className="text-sm text-gray-600">Show your confirmation at the center</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Offers */}
        <Card className="glass-card border-white/20 mb-8">
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

        {/* Contact Info */}
        <Card className="glass-card border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Phone className="h-5 w-5 text-pink-500" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-pink-600">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Call Us</p>
                  <p className="text-sm text-gray-600">1-800-555-1234</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-pink-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email Us</p>
                  <p className="text-sm text-gray-600">support@ewc.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-pink-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Visit Us</p>
                  <p className="text-sm text-gray-600">1234 Main St, Anytown, USA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.print()}
            variant="outline"
            size="lg"
            className="glass-micro-interaction border-white/20 hover:bg-white/20"
          >
            📄 Print Confirmation
          </Button>
          <Button 
            onClick={onComplete}
            size="lg"
            className="glass-micro-interaction border-white/20 hover:bg-white/20"
          >
            <Home className="h-5 w-5 mr-2" />
            Book Another Pass
          </Button>
        </div>
      </div>
    </div>
  );
} 