
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockLocations, pricingData, Location } from '../data/mockLocations';
import PageHeader from '../components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SinglePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
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

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location accessed:", position.coords);
          // Simulate finding the closest center
          const closestLocation = mockLocations[0];
          setSelectedLocation(closestLocation);
          setShowLocationDropdown(false);
        },
        (error) => {
          console.error("Error accessing location:", error);
        }
      );
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
    setSearchQuery(`${location.name} - ${location.address}`);
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
    } else {
      setPrice(null);
    }
  }, [selectedLocation, selectedPassType, selectedPackage, selectedService]);

  // Set up service options based on the selected location
  const serviceOptions = selectedLocation?.services.map(service => ({
    id: service.toLowerCase().replace(' ', ''),
    name: service
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <PageHeader 
          title="Single Page Experience" 
          subtitle="All your wax pass options in one unified view"
        />

        <div className="space-y-8">
          {/* Sticky location bar */}
          <div className="bg-white sticky top-0 z-10 border-b pb-4 mb-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-purple-900">Find Your Local Center</h3>
            </div>
            
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search for your local center..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    className="w-full pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <Button
                  variant="outline"
                  onClick={handleGeolocation}
                  className="flex items-center gap-2"
                >
                  <Compass className="h-4 w-4" />
                  Near Me
                </Button>
              </div>

              {showLocationDropdown && searchQuery && (
                <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
                  <CardContent className="p-0">
                    <ul>
                      {filteredLocations.map((location) => (
                        <li
                          key={location.id}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                            selectedLocation?.id === location.id ? 'bg-purple-50' : ''
                          }`}
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-purple-600" />
                            <div>
                              <div className="font-medium text-purple-900">{location.name}</div>
                              <div className="text-sm text-gray-600">
                                {location.address}, {location.city}, {location.state} {location.zip}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {selectedLocation && (
              <div className="mt-4 bg-purple-50 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <div className="font-medium text-purple-900">{selectedLocation.name}</div>
                    <div className="text-xs text-purple-700">
                      {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedLocation(null);
                    setSearchQuery("");
                  }}
                  className="text-purple-700"
                >
                  Change
                </Button>
              </div>
            )}
          </div>

          {selectedLocation ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Pass Type Selection Column */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-purple-900 border-b pb-2">Pass Types</h3>
                  {selectedLocation.passTypes.includes('unlimited') && (
                    <div 
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedPassType === 'unlimited'
                          ? 'border-purple-500 bg-purple-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPassType('unlimited')}
                    >
                      <h4 className="font-medium text-purple-900">Unlimited Pass</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Monthly membership with unlimited services
                      </p>
                    </div>
                  )}
                  {selectedLocation.passTypes.includes('prepaid') && (
                    <div 
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedPassType === 'prepaid'
                          ? 'border-purple-500 bg-purple-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedPassType('prepaid')}
                    >
                      <h4 className="font-medium text-purple-900">Prepaid Pass</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Pre-purchase services at a discount
                      </p>
                    </div>
                  )}
                </div>

                {/* Package Selection Column */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-purple-900 border-b pb-2">
                    Package Options
                    {!selectedPassType && (
                      <span className="text-sm font-normal text-gray-400 ml-2">
                        (Select a pass type first)
                      </span>
                    )}
                  </h3>
                  <div 
                    className={`p-4 border rounded-md transition-colors ${
                      !selectedPassType 
                        ? 'opacity-60 cursor-not-allowed bg-gray-50'
                        : selectedPackage === 'basic'
                          ? 'border-purple-500 bg-purple-50 cursor-pointer'
                          : 'cursor-pointer hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (selectedPassType) setSelectedPackage('basic');
                    }}
                  >
                    <h4 className="font-medium text-purple-900">Basic Package</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Essential waxing services
                    </p>
                  </div>
                  <div 
                    className={`p-4 border rounded-md transition-colors ${
                      !selectedPassType 
                        ? 'opacity-60 cursor-not-allowed bg-gray-50'
                        : selectedPackage === 'premium'
                          ? 'border-purple-500 bg-purple-50 cursor-pointer'
                          : 'cursor-pointer hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (selectedPassType) setSelectedPackage('premium');
                    }}
                  >
                    <h4 className="font-medium text-purple-900">Premium Package</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete waxing services with extras
                    </p>
                  </div>
                </div>

                {/* Service Selection Column */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-purple-900 border-b pb-2">
                    Available Services
                    {!selectedPackage && (
                      <span className="text-sm font-normal text-gray-400 ml-2">
                        (Select a package first)
                      </span>
                    )}
                  </h3>
                  <div className={`space-y-2 ${!selectedPackage ? 'opacity-60' : ''}`}>
                    {serviceOptions.map((service) => (
                      <div 
                        key={service.id}
                        className={`p-3 border rounded-md transition-colors ${
                          !selectedPackage 
                            ? 'cursor-not-allowed bg-gray-50'
                            : selectedService === service.id
                              ? 'border-purple-500 bg-purple-50 cursor-pointer'
                              : 'cursor-pointer hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (selectedPackage) setSelectedService(service.id);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-purple-900">{service.name}</span>
                          {price && selectedService === service.id && (
                            <span className="font-bold text-purple-900">${price}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Details Accordion */}
              <div className="mt-8 border-t pt-8">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-lg font-medium text-purple-900">
                      {selectedLocation.name} Details
                    </h3>
                    <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pt-4 pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                        <p className="text-gray-600">
                          {selectedLocation.address}<br />
                          {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zip}
                        </p>
                        <h4 className="font-medium text-gray-700 mb-2 mt-4">Contact</h4>
                        <p className="text-gray-600">{selectedLocation.phone}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Hours</h4>
                        <table className="text-sm w-full">
                          <tbody>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Monday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.monday}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Tuesday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.tuesday}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Wednesday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.wednesday}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Thursday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.thursday}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Friday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.friday}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Saturday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.saturday}</td>
                            </tr>
                            <tr>
                              <td className="py-1 pr-4 font-medium text-gray-600">Sunday</td>
                              <td className="py-1 text-gray-600">{selectedLocation.hours.sunday}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Pricing Summary */}
              {price && (
                <div className="mt-8 border-t pt-8">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-purple-900 mb-4">Your Wax Pass Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="text-sm text-gray-600">Pass Type</div>
                        <div className="font-medium text-purple-900">
                          {selectedPassType === 'unlimited' ? 'Unlimited Pass' : 'Prepaid Pass'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Package</div>
                        <div className="font-medium text-purple-900">
                          {selectedPackage === 'basic' ? 'Basic Package' : 'Premium Package'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Service</div>
                        <div className="font-medium text-purple-900">
                          {serviceOptions.find(s => s.id === selectedService)?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                      <div>
                        <div className="text-gray-600">Monthly Price</div>
                        <div className="text-xs text-gray-500">At {selectedLocation.name}</div>
                      </div>
                      <div className="text-3xl font-bold text-purple-900">${price}</div>
                    </div>
                    <Button className="w-full mt-6">Continue to Purchase</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MapPin className="h-16 w-16 mx-auto text-purple-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Location to Start</h3>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                Find your local center by searching above or use the "Near Me" button 
                to automatically find the closest center to your location.
              </p>
              <Button onClick={handleGeolocation} className="mx-auto">
                <Compass className="h-4 w-4 mr-2" />
                Use My Current Location
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-8">
            Subject to applicable taxes. Additional terms may apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
