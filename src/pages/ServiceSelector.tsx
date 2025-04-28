import React, { useState } from 'react';
import PageHeader from "@/components/PageHeader";
import { services, serviceCategories } from "@/data/servicesData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, Grid2X2, List, Tag, CirclePlus, CircleCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ServiceBodyMap from "@/components/ServiceBodyMap";
import SelectedServicesSummary from "@/components/SelectedServicesSummary";

const ServiceSelector = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedView, setSelectedView] = useState<string>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeComponent, setActiveComponent] = useState("interactive-map");
  
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader 
        title="Service Selection Experience" 
        subtitle="Explore innovative ways to select waxing services" 
      />

      <Tabs defaultValue="interactive-map" className="mb-8">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap mb-6">
          <TabsTrigger 
            value="interactive-map"
            onClick={() => setActiveComponent("interactive-map")}
          >
            Body Map Explorer
          </TabsTrigger>
          <TabsTrigger 
            value="visual-cards"
            onClick={() => setActiveComponent("visual-cards")}
          >
            Visual Cards
          </TabsTrigger>
          <TabsTrigger 
            value="smart-search"
            onClick={() => setActiveComponent("smart-search")}
          >
            Smart Search
          </TabsTrigger>
          <TabsTrigger 
            value="quick-bundles"
            onClick={() => setActiveComponent("quick-bundles")}
          >
            Quick Bundles
          </TabsTrigger>
          <TabsTrigger 
            value="contextual-filter"
            onClick={() => setActiveComponent("contextual-filter")}
          >
            Contextual Filters
          </TabsTrigger>
        </TabsList>

        {/* Body Map Explorer */}
        <TabsContent value="interactive-map" className="pt-4">
          <div className="grid md:grid-cols-2 gap-8">
            <ServiceBodyMap 
              selectedServices={selectedServices} 
              toggleService={toggleService} 
            />
            
            <div>
              <h3 className="text-xl font-semibold text-purple-900 mb-4">Selected Services</h3>
              <SelectedServicesSummary 
                selectedServiceIds={selectedServices}
                toggleService={toggleService}
              />
            </div>
          </div>
        </TabsContent>

        {/* Visual Cards Component */}
        <TabsContent value="visual-cards" className="pt-4">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-1">
                {["all", ...serviceCategories.map(c => c.id)].map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                    size="sm"
                  >
                    {category === "all" ? "All" : serviceCategories.find(c => c.id === category)?.name}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant={selectedView === "grid" ? "default" : "outline"} 
                  size="icon" 
                  onClick={() => setSelectedView("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={selectedView === "list" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setSelectedView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search services..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {selectedView === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredServices.map(service => (
                <Card 
                  key={service.id} 
                  className={`cursor-pointer transition-all ${
                    selectedServices.includes(service.id) 
                      ? 'ring-2 ring-purple-500 bg-purple-50' 
                      : ''
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-purple-100 p-2 rounded-full">
                        {/* We would use actual icons here */}
                        <div className="w-5 h-5 text-purple-600"></div>
                      </div>
                      {service.popular && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      ${service.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredServices.map(service => (
                <div 
                  key={service.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedServices.includes(service.id) 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center">
                    <Checkbox 
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        {serviceCategories.find(c => c.id === service.category)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {service.popular && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                        Popular
                      </span>
                    )}
                    <span className="font-semibold">${service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredServices.length === 0 && (
            <div className="text-center p-12 text-gray-500">
              No services found matching your search.
            </div>
          )}
          
          {selectedServices.length > 0 && (
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 mt-8 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{selectedServices.length} service(s) selected</p>
                <p className="font-bold">
                  Total: ${selectedServices.reduce((sum, id) => {
                    const service = services.find(s => s.id === id);
                    return sum + (service?.price || 0);
                  }, 0).toFixed(2)}
                </p>
              </div>
              <Button>Continue</Button>
            </div>
          )}
        </TabsContent>

        {/* Smart Search Component */}
        <TabsContent value="smart-search" className="pt-4">
          <div className="max-w-2xl mx-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-16 text-base"
                >
                  <div className="text-left">
                    <div className="font-semibold">What are you looking to wax today?</div>
                    <div className="text-gray-500 text-sm">
                      {selectedServices.length > 0
                        ? `${selectedServices.length} service(s) selected`
                        : "Search or browse services"}
                    </div>
                  </div>
                  <Search className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-5rem)] max-w-xl p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search services..." />
                  <CommandList>
                    <CommandEmpty>No services found.</CommandEmpty>
                    {serviceCategories.map(category => (
                      <CommandGroup key={category.id} heading={category.name}>
                        {services
                          .filter(service => service.category === category.id)
                          .map(service => (
                            <CommandItem
                              key={service.id}
                              onSelect={() => toggleService(service.id)}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="mr-3">
                                  <Checkbox 
                                    checked={selectedServices.includes(service.id)} 
                                    className="h-4 w-4"
                                  />
                                </div>
                                <span>{service.name}</span>
                              </div>
                              <span className="text-sm font-medium">${service.price}</span>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedServices.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Selected Services</h3>
                <div className="bg-purple-50 rounded-lg p-4">
                  {selectedServices.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return null;
                    
                    return (
                      <div 
                        key={service.id} 
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 p-1 rounded-full">
                            {/* Icon would go here */}
                            <div className="w-4 h-4"></div>
                          </div>
                          <span>{service.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">${service.price}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleService(serviceId)}
                            className="h-8 w-8 p-0"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between py-2 border-t border-purple-200 mt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold">
                      ${selectedServices.reduce((sum, id) => {
                        const service = services.find(s => s.id === id);
                        return sum + (service?.price || 0);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full">Continue to booking</Button>
                </div>
              </div>
            )}
            
            {selectedServices.length === 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Popular Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {services
                    .filter(service => service.popular)
                    .slice(0, 6)
                    .map(service => (
                      <Button
                        key={service.id}
                        variant="outline"
                        className="justify-between h-auto py-3 px-4"
                        onClick={() => toggleService(service.id)}
                      >
                        <span>{service.name}</span>
                        <span className="font-semibold">${service.price}</span>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Quick Bundles Component */}
        <TabsContent value="quick-bundles" className="pt-4">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-900">Popular Bundles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    name: "Face Bundle", 
                    services: ["eyebrows", "upper_lip", "chin"], 
                    savings: 15,
                    price: 49
                  },
                  { 
                    name: "Summer Ready", 
                    services: ["bikini_line_v", "underarms", "legs_lower"], 
                    savings: 20,
                    price: 89
                  },
                  { 
                    name: "Full Body", 
                    services: ["legs_full", "arms_full", "underarms", "bikini_line_v"], 
                    savings: 30,
                    price: 159
                  }
                ].map((bundle, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-4">
                      <h3 className="text-white font-bold text-lg">{bundle.name}</h3>
                      <p className="text-purple-100 text-sm">Save ${bundle.savings}</p>
                    </div>
                    <CardContent className="p-4">
                      <ul className="space-y-2 mb-4">
                        {bundle.services.map((serviceId, idx) => {
                          const service = services.find(s => s.id === serviceId);
                          return (
                            <li key={idx} className="flex items-center">
                              <CircleCheck className="h-4 w-4 mr-2 text-green-500" />
                              <span>{service?.name || serviceId}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="text-right font-bold text-xl mb-2">
                        ${bundle.price}
                      </div>
                      <Button className="w-full">Select Bundle</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-900">Build Your Own Bundle</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {serviceCategories.map(category => (
                      <div key={category.id} className="space-y-2">
                        <h3 className="font-medium text-lg">{category.name}</h3>
                        <div className="space-y-1">
                          {services
                            .filter(service => service.category === category.id)
                            .slice(0, 4)
                            .map(service => (
                              <div key={service.id} className="flex items-center">
                                <Checkbox 
                                  id={`custom-${service.id}`}
                                  checked={selectedServices.includes(service.id)}
                                  onCheckedChange={() => toggleService(service.id)}
                                  className="mr-2"
                                />
                                <Label htmlFor={`custom-${service.id}`} className="flex justify-between w-full">
                                  <span>{service.name}</span>
                                  <span className="text-sm font-medium">${service.price}</span>
                                </Label>
                              </div>
                            ))}
                          {services.filter(s => s.category === category.id).length > 4 && (
                            <Button variant="ghost" size="sm" className="w-full mt-1 text-sm h-8">
                              View all {category.name} options
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedServices.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Selected services:</span>
                        <span>{selectedServices.length}</span>
                      </div>
                      
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Total price:</span>
                        <span className="font-bold">
                          ${selectedServices.reduce((sum, id) => {
                            const service = services.find(s => s.id === id);
                            return sum + (service?.price || 0);
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                      
                      <Button className="w-full">Continue with selection</Button>
                    </div>
                  )}
                  
                  {selectedServices.length === 0 && (
                    <div className="text-center text-gray-500">
                      Select services to create your custom bundle
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Contextual Filters Component */}
        <TabsContent value="contextual-filter" className="pt-4">
          <div className="mb-6 flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Body Area</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {serviceCategories.map(category => (
                  <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.id)}>
                    {category.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                  All Areas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Price</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Under $25</DropdownMenuItem>
                <DropdownMenuItem>$25 - $50</DropdownMenuItem>
                <DropdownMenuItem>$50 - $75</DropdownMenuItem>
                <DropdownMenuItem>$75+</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4" />
              <span>Popular Services</span>
            </Button>
            
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search all services..." 
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[500px] pr-4">
            {serviceCategories
              .filter(category => selectedCategory === "all" || category.id === selectedCategory)
              .map(category => (
                <Collapsible key={category.id} className="mb-4" defaultOpen={true}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <h3 className="font-semibold text-purple-900">{category.name}</h3>
                    <div className="text-purple-700">+</div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {services
                        .filter(service => 
                          service.category === category.id && 
                          service.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(service => (
                          <div 
                            key={service.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              selectedServices.includes(service.id) 
                                ? 'border-purple-300 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-200'
                            } cursor-pointer`}
                            onClick={() => toggleService(service.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                checked={selectedServices.includes(service.id)} 
                                className="pointer-events-none"
                              />
                              <span>{service.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {service.popular && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                                  Popular
                                </span>
                              )}
                              <span className="font-medium">${service.price}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                    {services.filter(
                      s => s.category === category.id && 
                      s.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="text-center p-4 text-gray-500">
                        No services found.
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </ScrollArea>
          
          {selectedServices.length > 0 && (
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 mt-8 flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-3 sm:mb-0 text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  {selectedServices.length} service(s) selected
                </p>
                <p className="font-bold">
                  Total: ${selectedServices.reduce((sum, id) => {
                    const service = services.find(s => s.id === id);
                    return sum + (service?.price || 0);
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-none" variant="outline" onClick={() => setSelectedServices([])}>
                  Clear All
                </Button>
                <Button className="flex-1 sm:flex-none">
                  Continue
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceSelector;
