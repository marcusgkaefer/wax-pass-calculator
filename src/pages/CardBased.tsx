
import React, { useState, useEffect } from 'react';
import { MapPin, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { mockLocations, pricingData, Location } from '../data/mockLocations';
import PageHeader from '../components/PageHeader';

const CardBased = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPassType, setSelectedPassType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [view, setView] = useState<'locations' | 'passTypes' | 'packages' | 'services' | 'summary'>('locations');

  const filteredLocations = searchQuery
    ? mockLocations.filter(location =>
        `${location.name} ${location.city} ${location.state} ${location.address}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : mockLocations;

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate finding the closest center
          const closestLocation = mockLocations[0];
          setSelectedLocation(closestLocation);
          setView('passTypes');
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

  const getServiceNameFromId = (serviceId: string) => {
    const service = pricingData.services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  const renderView = () => {
    switch (view) {
      case 'locations':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-purple-900">
                Select a Location
              </h3>
              <Button variant="outline" onClick={handleGeolocation} className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Find Nearby
              </Button>
            </div>

            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <Card 
                  key={location.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedLocation?.id === location.id ? 'border-purple-500 ring-2 ring-purple-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedLocation(location);
                    setView('passTypes');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                      <div>
                        <div className="font-medium text-purple-900">{location.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {location.address}, {location.city}, {location.state}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {location.phone}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-3 text-xs text-gray-600">
                    {location.services.length} services available
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'passTypes':
        return (
          <div>
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => setView('locations')} className="mr-2">
                Back
              </Button>
              <h3 className="text-xl font-semibold text-purple-900">
                Choose Pass Type
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedLocation?.passTypes.includes('unlimited') && (
                <Card 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedPassType === 'unlimited' ? 'border-purple-500 ring-2 ring-purple-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedPassType('unlimited');
                    setView('packages');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <h4 className="text-xl font-semibold text-purple-900 mb-2">Unlimited Pass</h4>
                    <p className="text-gray-600 mb-4">
                      Monthly membership with unlimited services for maximum flexibility
                    </p>
                    <div className="bg-purple-50 p-3 rounded-lg inline-block">
                      <span className="text-purple-900 font-medium">Up to 20% savings</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {selectedLocation?.passTypes.includes('prepaid') && (
                <Card 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedPassType === 'prepaid' ? 'border-purple-500 ring-2 ring-purple-200' : ''
                  }`}
                  onClick={() => {
                    setSelectedPassType('prepaid');
                    setView('packages');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <h4 className="text-xl font-semibold text-purple-900 mb-2">Prepaid Pass</h4>
                    <p className="text-gray-600 mb-4">
                      Pre-purchase services at a discounted rate, no commitment required
                    </p>
                    <div className="bg-purple-50 p-3 rounded-lg inline-block">
                      <span className="text-purple-900 font-medium">Up to 15% savings</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 'packages':
        return (
          <div>
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => setView('passTypes')} className="mr-2">
                Back
              </Button>
              <h3 className="text-xl font-semibold text-purple-900">
                Select Package
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedPackage === 'basic' ? 'border-purple-500 ring-2 ring-purple-200' : ''
                }`}
                onClick={() => {
                  setSelectedPackage('basic');
                  setView('services');
                }}
              >
                <CardContent className="p-6 text-center">
                  <h4 className="text-xl font-semibold text-purple-900 mb-2">Basic Package</h4>
                  <p className="text-gray-600 mb-4">
                    Essential waxing services for common treatment areas
                  </p>
                  <ul className="text-left space-y-2 mb-4">
                    <li className="flex items-center text-gray-700">
                      <span className="bg-purple-100 rounded-full p-1 mr-2">
                        <svg className="h-3 w-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      Standard treatments
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="bg-purple-100 rounded-full p-1 mr-2">
                        <svg className="h-3 w-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      Regular pricing
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedPackage === 'premium' ? 'border-purple-500 ring-2 ring-purple-200' : ''
                }`}
                onClick={() => {
                  setSelectedPackage('premium');
                  setView('services');
                }}
              >
                <CardContent className="p-6 text-center">
                  <h4 className="text-xl font-semibold text-purple-900 mb-2">Premium Package</h4>
                  <p className="text-gray-600 mb-4">
                    Complete waxing services with additional premium benefits
                  </p>
                  <ul className="text-left space-y-2 mb-4">
                    <li className="flex items-center text-gray-700">
                      <span className="bg-purple-100 rounded-full p-1 mr-2">
                        <svg className="h-3 w-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      Enhanced treatments
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="bg-purple-100 rounded-full p-1 mr-2">
                        <svg className="h-3 w-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      Premium products
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="bg-purple-100 rounded-full p-1 mr-2">
                        <svg className="h-3 w-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      Priority booking
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'services':
        return (
          <div>
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => setView('packages')} className="mr-2">
                Back
              </Button>
              <h3 className="text-xl font-semibold text-purple-900">
                Choose Service
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedLocation?.services.map(service => {
                const serviceId = service.toLowerCase().replace(' ', '');
                // Find base price from pricing data
                const serviceData = pricingData.services.find(s => s.id === serviceId);
                const basePrice = serviceData ? serviceData.basePrice : 0;
                
                return (
                  <Card 
                    key={serviceId}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedService === serviceId ? 'border-purple-500 ring-2 ring-purple-200' : ''
                    }`}
                    onClick={() => {
                      setSelectedService(serviceId);
                      setView('summary');
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="text-lg font-medium text-purple-900 mb-2">{service}</h4>
                      <p className="text-sm text-gray-600 mb-2">Base price: ${basePrice}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div>
            <div className="mb-6 flex items-center">
              <Button variant="ghost" onClick={() => setView('services')} className="mr-2">
                Back
              </Button>
              <h3 className="text-xl font-semibold text-purple-900">
                Your Pass Summary
              </h3>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-500">Selected Location</div>
                        <div className="font-medium text-purple-900">{selectedLocation?.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedLocation?.address}, {selectedLocation?.city}, {selectedLocation?.state}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 border-t border-b py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Pass Type</div>
                        <div className="font-medium text-purple-900 mt-1">
                          {selectedPassType === 'unlimited' ? 'Unlimited' : 'Prepaid'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Package</div>
                        <div className="font-medium text-purple-900 mt-1">
                          {selectedPackage === 'basic' ? 'Basic' : 'Premium'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-500">Service</div>
                        <div className="font-medium text-purple-900 mt-1">
                          {getServiceNameFromId(selectedService)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-gray-600">Monthly Price</div>
                      <div className="text-2xl font-bold text-purple-900">${price}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4">
                  <Button className="w-full">
                    Continue to Purchase
                  </Button>
                </CardFooter>
              </Card>
              
              <p className="text-xs text-center text-gray-500">
                Prices may vary by location. Additional taxes and fees apply.
                <br />Cancellation policies and terms of service apply.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <PageHeader 
          title="Card-Based Selection" 
          subtitle="Find your local center and customize your wax pass with our visual card interface"
        />
        
        {/* Selection progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2">
            <span className={view === 'locations' ? 'font-medium text-purple-900' : 'text-gray-500'}>Location</span>
            <span className={view === 'passTypes' ? 'font-medium text-purple-900' : 'text-gray-500'}>Pass Type</span>
            <span className={view === 'packages' ? 'font-medium text-purple-900' : 'text-gray-500'}>Package</span>
            <span className={view === 'services' ? 'font-medium text-purple-900' : 'text-gray-500'}>Service</span>
            <span className={view === 'summary' ? 'font-medium text-purple-900' : 'text-gray-500'}>Summary</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{ 
              width: 
                view === 'locations' ? '20%' : 
                view === 'passTypes' ? '40%' : 
                view === 'packages' ? '60%' : 
                view === 'services' ? '80%' : '100%'
            }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          {renderView()}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Subject to applicable taxes. Additional terms may apply.
        </p>
      </div>
    </div>
  );
};

export default CardBased;
