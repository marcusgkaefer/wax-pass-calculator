import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingFlow from '@/components/booking/BookingFlow';
import { BookingResponse } from '@/lib/zenotiBooking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  Share2
} from 'lucide-react';

const Book = () => {
  const [completedBooking, setCompletedBooking] = useState<BookingResponse | null>(null);
  const navigate = useNavigate();

  const handleBookingComplete = (booking: BookingResponse) => {
    setCompletedBooking(booking);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

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

  if (completedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Header */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  Appointment Confirmed!
                </h1>
                <p className="text-green-700">
                  Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Appointment Details
              </CardTitle>
              <CardDescription>
                Confirmation Number: <strong>{completedBooking.confirmation_number}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Service</h4>
                  <p className="text-gray-600">{completedBooking.service.name}</p>
                  {completedBooking.guest.first_name && (
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      First Time Free!
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Date & Time</h4>
                  <p className="text-gray-600">
                    {formatDate(completedBooking.appointment.date)}
                  </p>
                  <p className="text-gray-600">
                    {formatTime(completedBooking.appointment.start_time)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-gray-600">{completedBooking.center.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{completedBooking.center.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Guest</h4>
                  <p className="text-gray-600">
                    {completedBooking.guest.first_name} {completedBooking.guest.last_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{completedBooking.guest.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-700">
                    1
                  </div>
                  <p className="text-gray-700">
                    <strong>Check your email</strong> - You'll receive a confirmation with all the details
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-700">
                    2
                  </div>
                  <p className="text-gray-700">
                    <strong>Arrive 15 minutes early</strong> - This allows time for check-in and preparation
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-sm font-medium text-purple-700">
                    3
                  </div>
                  <p className="text-gray-700">
                    <strong>Prepare for your appointment</strong> - Review our pre-care instructions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Save Details
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Wax Center Appointment',
                    text: `I have an appointment at European Wax Center on ${formatDate(completedBooking.appointment.date)} at ${formatTime(completedBooking.appointment.start_time)}`,
                  });
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button 
              onClick={handleBackToHome}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Back to Home
            </Button>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">
                  Need to make changes? Call your center directly or contact us:
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>1-800-WAX-CENTER</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>support@waxcenter.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingFlow
        onComplete={handleBookingComplete}
        onCancel={() => navigate('/')}
        showFirstTimeOffer={true}
      />
    </div>
  );
};

export default Book; 