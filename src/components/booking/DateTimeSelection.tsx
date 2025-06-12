import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ZenotiBookingService, ZenotiTimeSlot, ZenotiEmployee } from '@/lib/zenotiBooking';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DateTimeSelectionProps {
  centerId: string;
  serviceId: string;
  onDateTimeSelect: (date: string, time: string, employeeId?: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

const DateTimeSelection = ({
  centerId,
  serviceId,
  onDateTimeSelect,
  selectedDate,
  selectedTime
}: DateTimeSelectionProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  );
  const [availableSlots, setAvailableSlots] = useState<ZenotiTimeSlot[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<ZenotiEmployee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available slots when date changes
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDateObj || !centerId || !serviceId) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      setError(null);

      try {
        const dateString = selectedDateObj.toISOString().split('T')[0];
        const availability = await ZenotiBookingService.getAvailableSlots(
          centerId,
          serviceId,
          dateString,
          selectedEmployeeId
        );
        
        setAvailableSlots(availability.slots);
        setAvailableEmployees(availability.employees);
      } catch (err) {
        console.error('Failed to load available slots:', err);
        setError('Failed to load available appointment times.');
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [selectedDateObj, centerId, serviceId, selectedEmployeeId]);

  const formatDate = (date: Date) => {
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

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable dates more than 60 days in the future
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) return true;
    
    return false;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDateObj(date);
    // Clear selected time when date changes
    if (selectedTime) {
      // Reset time selection
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDateObj) {
      const dateString = selectedDateObj.toISOString().split('T')[0];
      onDateTimeSelect(dateString, time, selectedEmployeeId);
    }
  };

  const groupSlotsByTime = () => {
    const grouped: { [key: string]: ZenotiTimeSlot[] } = {};
    
    availableSlots.forEach(slot => {
      if (!grouped[slot.start_time]) {
        grouped[slot.start_time] = [];
      }
      grouped[slot.start_time].push(slot);
    });
    
    return grouped;
  };

  const morningSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.start_time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.start_time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.start_time.split(':')[0]);
    return hour >= 17;
  });

  const renderTimeSlots = (slots: ZenotiTimeSlot[], title: string) => {
    if (slots.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {slots.map((slot, index) => (
            <Button
              key={`${slot.start_time}-${index}`}
              variant={selectedTime === slot.start_time ? 'default' : 'outline'}
              size="sm"
              disabled={!slot.available}
              onClick={() => slot.available && handleTimeSelect(slot.start_time)}
              className={`${
                selectedTime === slot.start_time 
                  ? 'bg-purple-700 hover:bg-purple-800' 
                  : ''
              } ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {formatTime(slot.start_time)}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred appointment date and time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose your preferred appointment date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
              showOutsideDays={false}
            />
            {selectedDateObj && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">
                  Selected Date: {formatDate(selectedDateObj)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Available Times
            </CardTitle>
            <CardDescription>
              {selectedDateObj 
                ? `Available appointments for ${formatDate(selectedDateObj)}`
                : 'Please select a date to view available times'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedDateObj ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Please select a date first</p>
              </div>
            ) : loadingSlots ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Loading available times...</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, index) => (
                    <Skeleton key={index} className="h-8" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium mb-2">No appointments available</p>
                <p className="text-sm">Please try a different date</p>
              </div>
            ) : (
              <div className="space-y-6">
                {renderTimeSlots(morningSlots, 'Morning (Before 12 PM)')}
                {renderTimeSlots(afternoonSlots, 'Afternoon (12 PM - 5 PM)')}
                {renderTimeSlots(eveningSlots, 'Evening (After 5 PM)')}
                
                {selectedTime && (
                  <div className="mt-6 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">
                      Selected Time: {formatTime(selectedTime)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employee Selection (Optional) */}
      {availableEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Specialist Preference (Optional)
            </CardTitle>
            <CardDescription>
              Choose a specific wax specialist or let us assign one for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant={!selectedEmployeeId ? 'default' : 'outline'}
                onClick={() => setSelectedEmployeeId(undefined)}
                className="flex flex-col items-center p-4 h-auto"
              >
                <User className="h-8 w-8 mb-2" />
                <span className="font-medium">No Preference</span>
                <span className="text-xs text-gray-500">Any available specialist</span>
              </Button>
              
              {availableEmployees.map((employee) => (
                <Button
                  key={employee.id}
                  variant={selectedEmployeeId === employee.id ? 'default' : 'outline'}
                  onClick={() => setSelectedEmployeeId(employee.id)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                    <span className="text-purple-700 font-medium">
                      {employee.personal_info.first_name.charAt(0)}
                      {employee.personal_info.last_name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{employee.display_name}</span>
                  {employee.work_details?.specialties && (
                    <span className="text-xs text-gray-500 text-center">
                      {employee.work_details.specialties.slice(0, 2).join(', ')}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DateTimeSelection; 