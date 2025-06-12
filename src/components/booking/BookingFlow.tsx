import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WaxPassProvider, useWaxPass } from '@/lib/WaxPassContext';
import LocationSelection from '@/components/waxPass/LocationSelection';
import ServiceSelection from './ServiceSelection';
import DateTimeSelection from './DateTimeSelection';
import GuestInformation from './GuestInformation';
import BookingConfirmation from './BookingConfirmation';
import { 
  MapPin, 
  Scissors, 
  Calendar, 
  User, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ZenotiService } from '@/lib/zenotiApi';
import { BookingRequest, BookingResponse } from '@/lib/zenotiBooking';

export type BookingStep = 'location' | 'service' | 'datetime' | 'guest' | 'confirmation';

interface BookingData {
  selectedService?: ZenotiService;
  selectedDate?: string;
  selectedTime?: string;
  employeeId?: string;
  guestInfo?: BookingRequest['guest_info'];
  isFirstVisit?: boolean;
}

interface BookingFlowProps {
  initialStep?: BookingStep;
  onComplete?: (booking: BookingResponse) => void;
  onCancel?: () => void;
  showFirstTimeOffer?: boolean;
}

const BookingFlow = ({ 
  initialStep = 'location', 
  onComplete, 
  onCancel,
  showFirstTimeOffer = true 
}: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { selectedWaxCenter } = useWaxPass();

  const steps = [
    { 
      id: 'location' as BookingStep, 
      title: 'Choose Location', 
      icon: MapPin,
      description: 'Select your preferred wax center'
    },
    { 
      id: 'service' as BookingStep, 
      title: 'Select Service', 
      icon: Scissors,
      description: 'Choose your waxing service'
    },
    { 
      id: 'datetime' as BookingStep, 
      title: 'Pick Date & Time', 
      icon: Calendar,
      description: 'Select your appointment time'
    },
    { 
      id: 'guest' as BookingStep, 
      title: 'Guest Information', 
      icon: User,
      description: 'Enter your contact details'
    },
    { 
      id: 'confirmation' as BookingStep, 
      title: 'Confirmation', 
      icon: CheckCircle,
      description: 'Review and confirm your booking'
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const updateBookingData = (newData: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'location':
        return !!selectedWaxCenter;
      case 'service':
        return !!bookingData.selectedService;
      case 'datetime':
        return !!(bookingData.selectedDate && bookingData.selectedTime);
      case 'guest':
        return !!(bookingData.guestInfo?.first_name && 
                 bookingData.guestInfo?.last_name && 
                 bookingData.guestInfo?.email && 
                 bookingData.guestInfo?.phone);
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    }
  };

  const goToPreviousStep = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'location':
        return (
          <LocationSelection 
            onContinue={() => {
              if (selectedWaxCenter) {
                goToNextStep();
              }
            }}
          />
        );
      
      case 'service':
        return (
          <ServiceSelection
            centerId={selectedWaxCenter?.id || ''}
            showFirstTimeOffer={showFirstTimeOffer}
            onServiceSelect={(service) => {
              updateBookingData({ selectedService: service });
              goToNextStep();
            }}
            selectedService={bookingData.selectedService}
          />
        );
      
      case 'datetime':
        return (
          <DateTimeSelection
            centerId={selectedWaxCenter?.id || ''}
            serviceId={bookingData.selectedService?.id || ''}
            onDateTimeSelect={(date, time, employeeId) => {
              updateBookingData({ 
                selectedDate: date, 
                selectedTime: time, 
                employeeId 
              });
              goToNextStep();
            }}
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTime}
          />
        );
      
      case 'guest':
        return (
          <GuestInformation
            onGuestInfoSubmit={(guestInfo, isFirstVisit) => {
              updateBookingData({ guestInfo, isFirstVisit });
              goToNextStep();
            }}
            initialData={bookingData.guestInfo}
            isFirstVisit={bookingData.isFirstVisit}
            showFirstTimeOffer={showFirstTimeOffer}
          />
        );
      
      case 'confirmation':
        return (
          <BookingConfirmation
            bookingData={{
              center: selectedWaxCenter!,
              service: bookingData.selectedService!,
              date: bookingData.selectedDate!,
              time: bookingData.selectedTime!,
              employeeId: bookingData.employeeId,
              guestInfo: bookingData.guestInfo!,
              isFirstVisit: bookingData.isFirstVisit || false
            }}
            onConfirm={(booking) => {
              onComplete?.(booking);
            }}
            onEdit={(step) => {
              setCurrentStep(step);
            }}
            isLoading={isLoading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
              <CardDescription>
                Follow the steps below to schedule your waxing appointment
              </CardDescription>
            </div>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center text-center flex-1 ${
                      index < steps.length - 1 ? 'border-r border-gray-200 pr-4' : ''
                    } ${index > 0 ? 'pl-4' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-purple-700 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-purple-700' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* First Time Guest Offer */}
      {showFirstTimeOffer && currentStep !== 'confirmation' && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                First Time Free!
              </Badge>
              <p className="text-sm text-green-700">
                New guests can enjoy a complimentary eyebrow, underarm, or bikini wax
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {currentStep !== 'confirmation' && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={goToNextStep}
                disabled={!canProceedToNextStep()}
                className="bg-purple-700 hover:bg-purple-800"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Wrapper component that provides WaxPass context
const BookingFlowWithProvider = (props: BookingFlowProps) => {
  return (
    <WaxPassProvider>
      <BookingFlow {...props} />
    </WaxPassProvider>
  );
};

export default BookingFlowWithProvider; 