import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ZenotiCenter } from '@/lib/zenotiApi';
import { ZenotiService } from '@/lib/zenotiApi';
import { GuestInfo, BookingResponse, ZenotiBookingService } from '@/lib/zenotiBooking';
import { BookingStep } from './BookingFlow';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Scissors,
  CheckCircle,
  Gift,
  Edit3,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface BookingData {
  center: ZenotiCenter;
  service: ZenotiService;
  date: string;
  time: string;
  employeeId?: string;
  guestInfo: GuestInfo;
  isFirstVisit: boolean;
}

interface BookingConfirmationProps {
  bookingData: BookingData;
  onConfirm: (booking: BookingResponse) => void;
  onEdit: (step: BookingStep) => void;
  isLoading?: boolean;
}

const BookingConfirmation = ({
  bookingData,
  onConfirm,
  onEdit,
  isLoading = false
}: BookingConfirmationProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const bookingRequest = {
        center_id: bookingData.center.id,
        service_id: bookingData.service.id,
        start_time: `${bookingData.date}T${bookingData.time}:00`,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        employee_id: bookingData.employeeId,
        guest_info: bookingData.guestInfo,
        is_first_visit: bookingData.isFirstVisit,
        notes: bookingData.isFirstVisit 
          ? 'First-time guest - complimentary service' 
          : undefined
      };

      const booking = await ZenotiBookingService.createBooking(bookingRequest);
      onConfirm(booking);
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create your booking. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const getServicePrice = () => {
    if (bookingData.isFirstVisit) {
      const firstTimeServices = ['eyebrow', 'underarm', 'bikini'];
      const isFirstTimeEligible = firstTimeServices.some(term => 
        bookingData.service.name.toLowerCase().includes(term)
      );
      
      if (isFirstTimeEligible) {
        return 'FREE';
      }
    }
    return `$${bookingData.service.price_info.sale_price}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Confirm Your Appointment</h2>
        <p className="text-gray-600">Please review your booking details before confirming</p>
      </div>

      {/* First Time Guest Celebration */}
      {bookingData.isFirstVisit && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-center">
              <Gift className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Congratulations!</h3>
                <p className="text-sm text-green-700">
                  You're eligible for a complimentary service as a first-time guest
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Details */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Scissors className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">{bookingData.service.name}</h3>
                {bookingData.isFirstVisit && (
                  <Badge className="bg-green-100 text-green-800">
                    <Gift className="h-3 w-3 mr-1" />
                    FREE
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {bookingData.service.description || 'Professional waxing service'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Duration: {bookingData.service.duration} minutes</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-700">
                {getServicePrice()}
              </div>
              {bookingData.isFirstVisit && getServicePrice() === 'FREE' && (
                <div className="text-sm text-gray-500 line-through">
                  ${bookingData.service.price_info.sale_price}
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit('service')}
              className="ml-2"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium">Date & Time</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(bookingData.date)} at {formatTime(bookingData.time)}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit('datetime')}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium">{bookingData.center.name}</h4>
                <p className="text-sm text-gray-600">
                  {bookingData.center.address_info.address1}, {bookingData.center.address_info.city}, {bookingData.center.address_info.state_info.code}
                </p>
                <p className="text-sm text-purple-600">
                  {bookingData.center.phone}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit('location')}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Guest Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {bookingData.guestInfo.first_name} {bookingData.guestInfo.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {bookingData.guestInfo.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {formatPhoneNumber(bookingData.guestInfo.phone)}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit('guest')}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Important Information</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 15 minutes early for your appointment</li>
                <li>• Cancellations must be made at least 24 hours in advance</li>
                <li>• First-time guests should avoid sun exposure 24 hours before waxing</li>
                <li>• Hair should be at least 1/4 inch long for optimal results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleConfirmBooking}
            disabled={submitting || isLoading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-lg py-6"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Confirming Appointment...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirm Appointment
              </>
            )}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            By confirming, you agree to receive appointment reminders via email and SMS
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation; 