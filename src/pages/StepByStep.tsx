
import React, { useState, useEffect } from 'react';
import { MapPin, Search, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockLocations, pricingData, Location } from '../data/mockLocations';
import PageHeader from '../components/PageHeader';

const StepByStep = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPassType, setSelectedPassType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const filteredLocations = mockLocations.filter(location =>
    `${location.name} ${location.city} ${location.state} ${location.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setCurrentStep(2);
  };

  const handlePassTypeSelect = (passType: string) => {
    setSelectedPassType(passType);
    setCurrentStep(3);
  };

  const handlePackageSelect = (packageType: string) => {
    setSelectedPackage(packageType);
    setCurrentStep(4);
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setCurrentStep(5);
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location accessed:", position.coords);
          // Simulate finding the closest center
          const closestLocation = mockLocations[0];
          setSelectedLocation(closestLocation);
          setCurrentStep(2);
        },
        (error) => {
          console.error("Error accessing location:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (selectedLocation && selectedPassType && selectedPackage && selectedService) {
      const calculatedPrice = pricingData.getPrice(
        selectedService, 
        selectedPassType, 
        selectedPackage, 
        selectedLocation.id
      );
      setPrice(calculatedPrice);
    }
  }, [selectedLocation, selectedPassType, selectedPackage, selectedService]);

  const steps = [
    { id: 1, title: "Select Location", isCompleted: currentStep > 1 },
    { id: 2, title: "Choose Pass Type", isCompleted: currentStep > 2 },
    { id: 3, title: "Select Package", isCompleted: currentStep > 3 },
    { id: 4, title: "Choose Service", isCompleted: currentStep > 4 },
    { id: 5, title: "Review & Confirm", isCompleted: false },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Find Your Local Center
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search by city, zip code, or center name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <Button
                  variant="outline"
                  onClick={handleGeolocation}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Near Me
                </Button>
              </div>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-0 max-h-80 overflow-y-auto">
                  <ul className="divide-y divide-gray-100">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <li
                          key={location.id}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                            <div>
                              <div className="font-medium text-purple-900">{location.name}</div>
                              <div className="text-sm text-gray-600">
                                {location.address}, {location.city}, {location.state} {location.zip}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {location.phone}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 ml-auto text-gray-400" />
                          </div>
                        </li>
                      ))
                    ) : searchQuery ? (
                      <li className="px-4 py-6 text-center text-gray-500">
                        No locations found matching "{searchQuery}"
                      </li>
                    ) : (
                      <li className="px-4 py-6 text-center text-gray-500">
                        Start typing to search for locations
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Choose Your Pass Type
            </h3>
            <div className="space-y-4">
              {selectedLocation?.passTypes.includes('unlimited') && (
                <Card 
                  className="cursor-pointer hover:border-purple-300 transition-colors"
                  onClick={() => handlePassTypeSelect('unlimited')}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-purple-900">Unlimited Pass</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Monthly subscription with unlimited services
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              )}
              
              {selectedLocation?.passTypes.includes('prepaid') && (
                <Card 
                  className="cursor-pointer hover:border-purple-300 transition-colors"
                  onClick={() => handlePassTypeSelect('prepaid')}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-purple-900">Prepaid Pass</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Pre-purchase services at a discount
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Select Your Package
            </h3>
            <div className="space-y-4">
              <Card 
                className="cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => handlePackageSelect('basic')}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-purple-900">Basic Package</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Essential waxing services
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:border-purple-300 transition-colors"
                onClick={() => handlePackageSelect('premium')}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-purple-900">Premium Package</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Complete waxing services with extras
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Choose Your Service
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedLocation?.services.map(service => {
                const serviceId = service.toLowerCase().replace(' ', '');
                return (
                  <Card 
                    key={serviceId}
                    className="cursor-pointer hover:border-purple-300 transition-colors"
                    onClick={() => handleServiceSelect(serviceId)}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <h4 className="text-lg font-medium text-purple-900">{service}</h4>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                Back
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Review Your Selection
            </h3>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Selected Location</h4>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                      <div>
                        <div className="font-medium text-purple-900">{selectedLocation?.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedLocation?.address}, {selectedLocation?.city}, {selectedLocation?.state}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Pass Type</h4>
                    <div className="font-medium text-purple-900">
                      {selectedPassType === 'unlimited' ? 'Unlimited Pass' : 'Prepaid Pass'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Package</h4>
                    <div className="font-medium text-purple-900">
                      {selectedPackage === 'basic' ? 'Basic Package' : 'Premium Package'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">Service</h4>
                    <div className="font-medium text-purple-900">
                      {selectedLocation?.services.find(s => 
                        s.toLowerCase().replace(' ', '') === selectedService
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-500">Monthly Price</div>
                      <div className="text-2xl font-bold text-purple-900">${price}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      *Price subject to change. Additional taxes and fees may apply.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button className="w-full" size="lg">
                    Continue to Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                Back
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <PageHeader 
          title="Step-by-Step Selection" 
          subtitle="Follow the steps below to find your local center and customize your wax pass"
        />

        <div className="mb-12">
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
            {steps.map((step, index) => (
              <li 
                key={step.id}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'w-full' : ''
                }`}
              >
                <span className="flex items-center justify-center">
                  {step.isCompleted ? (
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </span>
                  ) : currentStep === step.id ? (
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full shrink-0 text-white">
                      {step.id}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full shrink-0 text-gray-500">
                      {step.id}
                    </span>
                  )}
                </span>
                <span className={`ml-2 ${currentStep === step.id ? 'text-purple-600 font-semibold' : ''}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200"></div>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          {renderStepContent()}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Subject to applicable taxes. Additional terms may apply.
        </p>
      </div>
    </div>
  );
};

export default StepByStep;
