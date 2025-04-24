
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockLocations, pricingData, Location } from '../data/mockLocations';
import PageHeader from '../components/PageHeader';

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedPassType, setSelectedPassType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location accessed:", position.coords);
          // Simulate finding the closest center
          // In a real app, we would calculate the distance to each center
          const closestLocation = mockLocations[0]; // Pretend the first one is closest
          setSelectedLocation(closestLocation);
        },
        (error) => {
          console.error("Error accessing location:", error);
        }
      );
    }
  };

  const filteredLocations = mockLocations.filter(location =>
    `${location.name} ${location.city} ${location.state} ${location.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSelectedPassType("");
    setSelectedPackage("");
    setSelectedService("");
    setPrice(null);
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <PageHeader 
          title="Map-Based Location Search" 
          subtitle="Find your local wax center and customize your service package"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-purple-50 p-4 rounded-lg mb-4 flex justify-between items-center">
              <h3 className="font-semibold text-purple-900">Find Your Local Center</h3>
              <Button 
                variant="outline" 
                onClick={handleGeolocation} 
                className="flex items-center gap-2 bg-white"
              >
                <Compass className="h-4 w-4" />
                Locate Me
              </Button>
            </div>

            {/* Map placeholder - in a real app, this would be an actual map component */}
            <div className="bg-gray-100 rounded-lg h-96 relative overflow-hidden">
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                <p className="text-gray-500 font-medium text-center">
                  Interactive Map Component Would Display Here
                  <br />
                  <span className="text-sm block mt-2">
                    In a production app, this would be integrated with Google Maps, Mapbox, or similar
                  </span>
                </p>
              </div>
              
              {/* Location pins - in a real app these would be positioned on the map */}
              {mockLocations.map((location) => (
                <Button
                  key={location.id}
                  variant="outline"
                  className={`absolute p-2 rounded-full ${
                    selectedLocation?.id === location.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-purple-900'
                  }`}
                  style={{
                    top: `${Math.random() * 70 + 10}%`,
                    left: `${Math.random() * 70 + 10}%`,
                  }}
                  onClick={() => handleLocationSelect(location)}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              ))}
            </div>

            <div className="mt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by city, zip code, or center name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              {searchQuery && (
                <Card className="mt-2 max-h-60 overflow-y-auto">
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
          </div>

          <div>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-purple-900 mb-4">Customize Your Pass</h3>
                
                {selectedLocation ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Location</h4>
                      <div className="p-3 bg-purple-50 rounded-md">
                        <div className="font-medium text-purple-900">{selectedLocation.name}</div>
                        <div className="text-sm text-gray-600">
                          {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Pass Type</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedLocation.passTypes.includes('unlimited') && (
                          <Button 
                            variant={selectedPassType === 'unlimited' ? 'default' : 'outline'} 
                            className={selectedPassType === 'unlimited' ? 'bg-purple-600' : ''}
                            onClick={() => setSelectedPassType('unlimited')}
                          >
                            Unlimited
                          </Button>
                        )}
                        {selectedLocation.passTypes.includes('prepaid') && (
                          <Button 
                            variant={selectedPassType === 'prepaid' ? 'default' : 'outline'}
                            className={selectedPassType === 'prepaid' ? 'bg-purple-600' : ''}
                            onClick={() => setSelectedPassType('prepaid')}
                          >
                            Prepaid
                          </Button>
                        )}
                      </div>
                    </div>

                    {selectedPassType && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Package</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant={selectedPackage === 'basic' ? 'default' : 'outline'}
                            className={selectedPackage === 'basic' ? 'bg-purple-600' : ''}
                            onClick={() => setSelectedPackage('basic')}
                          >
                            Basic
                          </Button>
                          <Button 
                            variant={selectedPackage === 'premium' ? 'default' : 'outline'}
                            className={selectedPackage === 'premium' ? 'bg-purple-600' : ''}
                            onClick={() => setSelectedPackage('premium')}
                          >
                            Premium
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedPackage && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Service</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedLocation.services.map(service => {
                            const serviceId = service.toLowerCase().replace(' ', '');
                            return (
                              <Button 
                                key={serviceId}
                                variant={selectedService === serviceId ? 'default' : 'outline'}
                                className={selectedService === serviceId ? 'bg-purple-600 justify-between' : 'justify-between'}
                                onClick={() => setSelectedService(serviceId)}
                              >
                                <span>{service}</span>
                                {price && selectedService === serviceId && (
                                  <span className="font-bold">${price}</span>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {price && (
                      <div className="bg-purple-100 p-4 rounded-md mt-4">
                        <div className="text-sm text-purple-800 mb-1">Your Selected Package</div>
                        <div className="text-2xl font-bold text-purple-900">${price} per month</div>
                        <div className="text-xs text-purple-700 mt-1">*Price may vary. Taxes not included.</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-purple-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Location Selected</h3>
                    <p className="text-gray-500 mb-4">Please select a location on the map or search for one</p>
                    <Button onClick={handleGeolocation}>
                      <Compass className="h-4 w-4 mr-2" />
                      Use My Current Location
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Subject to applicable taxes. Additional terms may apply.
        </p>
      </div>
    </div>
  );
};

export default MapView;
