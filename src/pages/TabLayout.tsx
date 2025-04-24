
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLocations, pricingData, Location } from '../data/mockLocations';
import PageHeader from '../components/PageHeader';

const TabLayout = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPassType, setSelectedPassType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("location");

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
          if (!selectedPassType) setActiveTab("passType");
        },
        (error) => {
          console.error("Error accessing location:", error);
        }
      );
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    if (!selectedPassType) setActiveTab("passType");
  };

  const handlePassTypeSelect = (passType: string) => {
    setSelectedPassType(passType);
    if (!selectedPackage) setActiveTab("package");
  };

  const handlePackageSelect = (packageType: string) => {
    setSelectedPackage(packageType);
    if (!selectedService) setActiveTab("service");
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setActiveTab("summary");
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

  // Service options for the selected location
  const serviceOptions = selectedLocation?.services.map(service => ({
    id: service.toLowerCase().replace(' ', ''),
    name: service
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <PageHeader 
          title="Tab-Based Layout" 
          subtitle="Navigate through the selection process with an organized tab interface"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="location" className="data-[state=active]:bg-purple-100">
              1. Location
            </TabsTrigger>
            <TabsTrigger 
              value="passType" 
              disabled={!selectedLocation}
              className="data-[state=active]:bg-purple-100"
            >
              2. Pass Type
            </TabsTrigger>
            <TabsTrigger 
              value="package" 
              disabled={!selectedPassType}
              className="data-[state=active]:bg-purple-100"
            >
              3. Package
            </TabsTrigger>
            <TabsTrigger 
              value="service" 
              disabled={!selectedPackage}
              className="data-[state=active]:bg-purple-100"
            >
              4. Service
            </TabsTrigger>
            <TabsTrigger 
              value="summary" 
              disabled={!selectedService}
              className="data-[state=active]:bg-purple-100"
            >
              5. Summary
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 bg-white p-6 border rounded-lg">
            <TabsContent value="location">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-6">Find Your Local Center</h3>
                
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
                      <Compass className="h-4 w-4" />
                      Near Me
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <Card 
                          key={location.id}
                          className={`cursor-pointer hover:border-purple-300 transition-colors ${
                            selectedLocation?.id === location.id ? 'border-purple-500 ring-1 ring-purple-200' : ''
                          }`}
                          onClick={() => handleLocationSelect(location)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <MapPin className="h-5 w-5 mt-1 flex-shrink-0 text-purple-600" />
                              <div>
                                <div className="font-medium text-purple-900">{location.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {location.address}, {location.city}, {location.state}
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xs">
                                  <span className="text-gray-500">{location.phone}</span>
                                  <span className="text-purple-600 font-medium">
                                    {location.services.length} services available
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : searchQuery ? (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        No locations found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        Start typing to search for locations or use the "Near Me" button
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  {selectedLocation && (
                    <Button onClick={() => setActiveTab("passType")}>
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="passType">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-6">Choose Your Pass Type</h3>

                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedLocation?.passTypes.includes('unlimited') && (
                    <Card 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedPassType === 'unlimited' ? 'border-purple-500 ring-1 ring-purple-200' : ''
                      }`}
                      onClick={() => handlePassTypeSelect('unlimited')}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="bg-purple-100 rounded-full p-3 mb-4">
                          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-purple-900 mb-2">Unlimited Pass</h4>
                        <p className="text-gray-600 mb-4">
                          Monthly membership with unlimited services
                        </p>
                        <div className="bg-purple-50 px-3 py-1 rounded-full text-purple-900 font-medium text-sm">
                          Most Popular
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {selectedLocation?.passTypes.includes('prepaid') && (
                    <Card 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedPassType === 'prepaid' ? 'border-purple-500 ring-1 ring-purple-200' : ''
                      }`}
                      onClick={() => handlePassTypeSelect('prepaid')}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="bg-purple-100 rounded-full p-3 mb-4">
                          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-purple-900 mb-2">Prepaid Pass</h4>
                        <p className="text-gray-600 mb-4">
                          Pre-purchase services at a discount
                        </p>
                        <div className="bg-purple-50 px-3 py-1 rounded-full text-purple-900 font-medium text-sm">
                          Best Value
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("location")}>
                    Back
                  </Button>
                  {selectedPassType && (
                    <Button onClick={() => setActiveTab("package")}>
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="package">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-6">Select Your Package</h3>

                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedPackage === 'basic' ? 'border-purple-500 ring-1 ring-purple-200' : ''
                    }`}
                    onClick={() => handlePackageSelect('basic')}
                  >
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-purple-900 mb-2">Basic Package</h4>
                      <p className="text-gray-600 mb-4">
                        Essential waxing services for common treatment areas
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Standard treatments</span>
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Regular pricing</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedPackage === 'premium' ? 'border-purple-500 ring-1 ring-purple-200' : ''
                    }`}
                    onClick={() => handlePackageSelect('premium')}
                  >
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-purple-900 mb-2">Premium Package</h4>
                      <p className="text-gray-600 mb-4">
                        Complete waxing services with additional premium benefits
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Enhanced treatments</span>
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Premium products</span>
                        </li>
                        <li className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Priority booking</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("passType")}>
                    Back
                  </Button>
                  {selectedPackage && (
                    <Button onClick={() => setActiveTab("service")}>
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="service">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-6">Choose Your Service</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {serviceOptions.map((service) => {
                    // Find base price from pricing data
                    const serviceData = pricingData.services.find(s => s.id === service.id);
                    const basePrice = serviceData ? serviceData.basePrice : 0;
                    
                    return (
                      <Card 
                        key={service.id}
                        className={`cursor-pointer hover:shadow-md transition-shadow ${
                          selectedService === service.id ? 'border-purple-500 ring-1 ring-purple-200' : ''
                        }`}
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        <CardContent className="p-4">
                          <div className="text-center">
                            <h4 className="font-medium text-purple-900 mb-1">{service.name}</h4>
                            <div className="text-sm text-gray-500">
                              Starting from <span className="font-medium text-purple-900">${basePrice}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("package")}>
                    Back
                  </Button>
                  {selectedService && (
                    <Button onClick={() => setActiveTab("summary")}>
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-6">Your Wax Pass Summary</h3>
                
                <div className="max-w-2xl mx-auto">
                  <Card>
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500">Pass Type</div>
                            <div className="font-medium text-purple-900">
                              {selectedPassType === 'unlimited' ? 'Unlimited Pass' : 'Prepaid Pass'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-gray-500">Package</div>
                            <div className="font-medium text-purple-900">
                              {selectedPackage === 'basic' ? 'Basic Package' : 'Premium Package'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium text-gray-500">Service</div>
                            <div className="font-medium text-purple-900">
                              {serviceOptions.find(s => s.id === selectedService)?.name}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-lg font-medium text-gray-600">Total Price</div>
                            <div className="text-xs text-gray-500">Monthly subscription</div>
                          </div>
                          <div className="text-3xl font-bold text-purple-900">${price}</div>
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          *Prices may vary. Additional taxes and fees apply.
                          Cancellation policies and terms of service apply.
                        </p>
                        
                        <Button className="w-full" size="lg">
                          Purchase Pass
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("service")}>
                    Back
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <p className="text-center text-sm text-gray-500 mt-8">
          Subject to applicable taxes. Additional terms may apply.
        </p>
      </div>
    </div>
  );
};

export default TabLayout;
