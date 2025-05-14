import { useState, useEffect } from 'react';
import { useWaxPass } from '@/lib/WaxPassContext';
import { formatCurrency, fetchServicesForWaxCenter, WaxService } from '@/lib/waxPassCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, X, Loader2, Heart, ChevronDown, ChevronRight, Grid, List, Clock, DollarSign, Tag, Info, Star } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export interface ServiceSelectionProps {
  onContinue: () => void;
  onBack?: () => void;
}

// View modes
type ViewMode = 'list' | 'grid';
type GroupingMode = 'category' | 'price' | 'duration' | 'bodyArea';
type SortOption = 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc' | 'popularityDesc';

// Body areas for grouping
const bodyAreas = [
  'Face', 'Arms', 'Legs', 'Bikini', 'Back', 'Chest', 'Underarms', 'Full Body', 'Other'
];

// Mock data for service durations (in minutes) - in a real app, this would come from the API
const getDuration = (service: WaxService): number => {
  // Simple mock logic based on price - in a real app, this would be actual data
  return Math.max(15, Math.round((service.standard_price / 15) * 10));
};

// Mock data for popularity - in a real app, this would come from the API
const getPopularity = (service: WaxService): number => {
  // Simple mock logic - in a real app, this would be actual data
  return Math.floor(Math.random() * 100);
};

// Mock data for body areas - in a real app, this would come from the API
const getBodyArea = (service: WaxService): string => {
  const nameLower = service.service_name.toLowerCase();
  if (nameLower.includes('face') || nameLower.includes('lip') || nameLower.includes('chin')) return 'Face';
  if (nameLower.includes('arm')) return 'Arms';
  if (nameLower.includes('leg')) return 'Legs';
  if (nameLower.includes('bikini') || nameLower.includes('brazilian')) return 'Bikini';
  if (nameLower.includes('back')) return 'Back';
  if (nameLower.includes('chest')) return 'Chest';
  if (nameLower.includes('underarm')) return 'Underarms';
  if (nameLower.includes('full')) return 'Full Body';
  return 'Other';
};

export default function ServiceSelection({ onContinue, onBack }: ServiceSelectionProps) {
  const { selectedWaxCenter, selectedServices, addService, removeService } = useWaxPass();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<WaxService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New UI state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('category');
  const [sortOption, setSortOption] = useState<SortOption>('nameAsc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedBodyAreas, setSelectedBodyAreas] = useState<string[]>([]);
  const [groupByBodyArea, setGroupByBodyArea] = useState(true);
  const [favoriteServices, setFavoriteServices] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showPopular, setShowPopular] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([]);
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  
  // Duration options
  const durationOptions = [
    { id: 'quick', label: 'Quick (< 20 min)', range: [0, 20] },
    { id: 'medium', label: 'Medium (20-40 min)', range: [20, 40] },
    { id: 'long', label: 'Long (> 40 min)', range: [40, 999] }
  ];

  // Fetch services when wax center changes
  useEffect(() => {
    if (selectedWaxCenter) {
      setIsLoading(true);
      setError(null);
      
      fetchServicesForWaxCenter(selectedWaxCenter.id)
        .then(fetchedServices => {
          setServices(fetchedServices);
          
          // Set initial price range based on available services
          const prices = fetchedServices.map(s => s.standard_price);
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
          }
          
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching services:", err);
          setError("Unable to load services for this location. Please try again.");
          setIsLoading(false);
        });
    }
  }, [selectedWaxCenter]);

  // Toggle a group's expanded state
  const toggleGroupExpanded = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group) 
        : [...prev, group]
    );
  };

  // Toggle description expanded state
  const toggleDescriptionExpanded = (serviceId: string) => {
    setExpandedDescriptions(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  // Toggle favorite status for a service
  const toggleFavorite = (serviceId: string) => {
    setFavoriteServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Add to recently viewed
  const addToRecentlyViewed = (serviceId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== serviceId);
      return [serviceId, ...filtered].slice(0, 5); // Keep only last 5
    });
  };

  // Filter services based on all criteria
  const filteredServices = services.filter(service => {
    // Search query filter
    if (!service.service_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (service.standard_price < priceRange[0] || service.standard_price > priceRange[1]) {
      return false;
    }
    
    // Duration filter
    if (selectedDurations.length > 0) {
      const duration = getDuration(service);
      const matchesDuration = selectedDurations.some(durId => {
        const option = durationOptions.find(opt => opt.id === durId);
        return option && duration >= option.range[0] && duration <= option.range[1];
      });
      if (!matchesDuration) return false;
    }
    
    // Body area filter
    if (selectedBodyAreas.length > 0) {
      const bodyArea = getBodyArea(service);
      if (!selectedBodyAreas.includes(bodyArea)) return false;
    }
    
    // Popular filter
    if (showPopular && getPopularity(service) < 70) return false;
    
    return true;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortOption) {
      case 'nameAsc':
        return a.service_name.localeCompare(b.service_name);
      case 'nameDesc':
        return b.service_name.localeCompare(a.service_name);
      case 'priceAsc':
        return a.standard_price - b.standard_price;
      case 'priceDesc':
        return b.standard_price - a.standard_price;
      case 'popularityDesc':
        return getPopularity(b) - getPopularity(a);
      default:
        return 0;
    }
  });

  // Group services based on selected grouping mode
  const groupServices = () => {
    if (groupingMode === 'category' && !groupByBodyArea) {
      return sortedServices.reduce((acc, service) => {
        const category = service.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(service);
        return acc;
      }, {} as Record<string, WaxService[]>);
    } else if (groupingMode === 'price' || groupingMode === 'category' && !groupByBodyArea) {
      return sortedServices.reduce((acc, service) => {
        let priceGroup;
        if (service.standard_price < 30) priceGroup = 'Under $30';
        else if (service.standard_price < 60) priceGroup = '$30-$60';
        else if (service.standard_price < 90) priceGroup = '$60-$90';
        else priceGroup = '$90+';
        
        if (!acc[priceGroup]) {
          acc[priceGroup] = [];
        }
        acc[priceGroup].push(service);
        return acc;
      }, {} as Record<string, WaxService[]>);
    } else if (groupingMode === 'duration') {
      return sortedServices.reduce((acc, service) => {
        const duration = getDuration(service);
        let durationGroup;
        if (duration < 20) durationGroup = 'Quick (< 20 min)';
        else if (duration < 40) durationGroup = 'Medium (20-40 min)';
        else durationGroup = 'Long (> 40 min)';
        
        if (!acc[durationGroup]) {
          acc[durationGroup] = [];
        }
        acc[durationGroup].push(service);
        return acc;
      }, {} as Record<string, WaxService[]>);
    } else { // Body area
      return sortedServices.reduce((acc, service) => {
        const bodyArea = getBodyArea(service);
        
        if (!acc[bodyArea]) {
          acc[bodyArea] = [];
        }
        acc[bodyArea].push(service);
        return acc;
      }, {} as Record<string, WaxService[]>);
    }
  };

  const groupedServices = groupServices();

  // Calculate subtotal
  const subtotal = selectedServices.reduce((sum, service) => sum + service.standard_price, 0);

  if (!selectedWaxCenter) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-4">Please select a wax center first.</p>
        {onBack && (
          <Button onClick={onBack}>
            Back to Location Selection
          </Button>
        )}
      </div>
    );
  }

  // Render a single service based on the view mode
  const renderService = (service: WaxService) => {
    const isFavorite = favoriteServices.includes(service.service_id);
    const isPopular = getPopularity(service) > 70;
    const isSelected = selectedServices.some(s => s.service_id === service.service_id);
    const duration = getDuration(service);
    const isDescriptionExpanded = expandedDescriptions.includes(service.service_id);
    
    const serviceCard = (
      <Card key={service.service_id} className={`${viewMode === 'grid' ? 'h-full' : ''} transition duration-200 hover:shadow-md ${isSelected ? 'border-primary border-2' : ''}`}>
        <CardContent className={`p-4 ${viewMode === 'list' ? 'flex flex-col' : 'flex flex-col'}`}>
          {/* Main service row - everything in one line for list view */}
          <div className="flex justify-between items-center w-full">
            <div className="flex-1 flex items-center gap-2">
              <div>
                <h4 className="font-medium">{service.service_name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(service.standard_price)}
                  </span>
                  <div className="flex gap-1">
                    {isPopular && <Badge variant="outline" className="bg-amber-50 text-amber-700">Popular</Badge>}
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Clock size={14} className="mr-1" /> {duration} min
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      <Tag size={14} className="mr-1" /> {getBodyArea(service)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {service.description && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8" 
                  onClick={() => {
                    toggleDescriptionExpanded(service.service_id);
                    addToRecentlyViewed(service.service_id);
                  }}
                >
                  <Info size={16} />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8" 
                onClick={() => toggleFavorite(service.service_id)}
              >
                <Heart size={16} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
              </Button>
              <Button 
                variant={isSelected ? "secondary" : "outline"} 
                size="sm"
                onClick={() => !isSelected ? addService(service) : removeService(service.service_id)}
              >
                {isSelected ? 'Remove' : 'Add'}
              </Button>
            </div>
          </div>
          
          {/* Expandable description row for list view */}
          {service.description && isDescriptionExpanded && (
            <div className="mt-2 pt-2 border-t text-sm text-gray-600">
              <p>{service.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
    
    return serviceCard;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Service Selection List */}
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Choose Your Services</h2>
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        
        <div className="mb-2">
          <p className="text-sm text-gray-600">
            Services available at {selectedWaxCenter.display_name}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Options Expandable Section */}
        <Collapsible 
          open={optionsExpanded} 
          onOpenChange={setOptionsExpanded}
          className="mb-6 border rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Options</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <div className="flex items-center">
                  <span className="mr-2">Filter & View</span>
                  <div className="transform transition-transform duration-200" 
                       style={{ transform: optionsExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filter Options */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Filter Options</h3>
                  
                  {/* Price Range Filter */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium">Price Range</span>
                      <span className="text-xs">
                        {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={200}
                      step={5}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-1"
                    />
                  </div>
                  
                  {/* Duration Filter */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">Duration</h4>
                    <div className="space-y-2">
                      {durationOptions.map(option => (
                        <div key={option.id} className="flex items-center">
                          <Checkbox 
                            id={`duration-${option.id}`}
                            checked={selectedDurations.includes(option.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDurations(prev => [...prev, option.id]);
                              } else {
                                setSelectedDurations(prev => prev.filter(id => id !== option.id));
                              }
                            }}
                          />
                          <label htmlFor={`duration-${option.id}`} className="ml-2 text-xs">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Body Area Filter */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">Body Area</h4>
                    <div className="flex flex-wrap gap-1">
                      {bodyAreas.map(area => (
                        <Badge 
                          key={area}
                          variant={selectedBodyAreas.includes(area) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            if (selectedBodyAreas.includes(area)) {
                              setSelectedBodyAreas(prev => prev.filter(a => a !== area));
                            } else {
                              setSelectedBodyAreas(prev => [...prev, area]);
                            }
                          }}
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Popular Filter */}
                  <div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="popular-filter"
                        checked={showPopular}
                        onCheckedChange={(checked) => setShowPopular(!!checked)}
                      />
                      <label htmlFor="popular-filter" className="ml-2 text-xs">
                        Show Popular Only
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* View Options */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">View Options</h3>
                  
                  {/* Group by Body Area */}
                  <div className="mb-4">
                    <div className="flex items-center">
                      <Checkbox 
                        id="group-by-body-area"
                        checked={groupByBodyArea}
                        onCheckedChange={(checked) => setGroupByBodyArea(!!checked)}
                      />
                      <label htmlFor="group-by-body-area" className="ml-2 text-xs">
                        Group by Body Area
                      </label>
                    </div>
                  </div>
                  
                  {/* View Mode */}
                  <div className="mb-4">
                    <label className="text-xs font-medium block mb-2">Display Style</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant={viewMode === 'list' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="flex-1"
                      >
                        <List size={16} className="mr-1" /> List
                      </Button>
                      <Button 
                        variant={viewMode === 'grid' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="flex-1"
                      >
                        <Grid size={16} className="mr-1" /> Grid
                      </Button>
                    </div>
                  </div>
                  
                  {/* Sort by */}
                  <div className="mb-4">
                    <label className="text-xs font-medium block mb-2">Sort By</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {sortOption === 'nameAsc' ? 'Name (A-Z)' : 
                           sortOption === 'nameDesc' ? 'Name (Z-A)' : 
                           sortOption === 'priceAsc' ? 'Price (Low to High)' : 
                           sortOption === 'priceDesc' ? 'Price (High to Low)' : 
                           'Popularity'}
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSortOption('nameAsc')}>Name (A-Z)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('nameDesc')}>Name (Z-A)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('priceAsc')}>Price (Low to High)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('priceDesc')}>Price (High to Low)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('popularityDesc')}>Popularity</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Group by */}
                  <div>
                    <label className="text-xs font-medium block mb-2">Group By</label>
                    {!groupByBodyArea ? (
                      <Tabs defaultValue="category" onValueChange={(value) => setGroupingMode(value as GroupingMode)}>
                        <TabsList className="w-full">
                          <TabsTrigger value="category" className="flex-1">Category</TabsTrigger>
                          <TabsTrigger value="price" className="flex-1">Price</TabsTrigger>
                          <TabsTrigger value="duration" className="flex-1">Duration</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        Body Area (Use checkbox to change)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Recently Viewed Services */}
        {recentlyViewed.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Recently Viewed</h3>
            <div className="flex overflow-x-auto pb-2 space-x-2">
              {recentlyViewed.map(id => {
                const service = services.find(s => s.service_id === id);
                if (!service) return null;
                return (
                  <div key={id} className="min-w-[200px]">
                    {renderService(service)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : (
          /* Services List */
          <ScrollArea className="h-[500px] pr-4">
            {Object.keys(groupedServices).length === 0 ? (
              <p className="text-center py-8 text-gray-500">No services match your filters.</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedServices).map(([group, groupServices]) => (
                  <Collapsible 
                    key={group} 
                    open={expandedGroups.includes(group)}
                    onOpenChange={(open) => {
                      if (open) {
                        setExpandedGroups(prev => [...prev, group]);
                      } else {
                        setExpandedGroups(prev => prev.filter(g => g !== group));
                      }
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1 mr-2">
                          {expandedGroups.includes(group) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </Button>
                      </CollapsibleTrigger>
                      <h3 className="text-lg font-semibold">
                        {group} <span className="text-xs text-gray-500">({groupServices.length})</span>
                      </h3>
                    </div>
                    
                    <CollapsibleContent>
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 gap-4">
                          {groupServices.map(service => (
                            <div key={service.service_id}>
                              {renderService(service)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {groupServices.map(service => (
                            <div key={service.service_id}>
                              {renderService(service)}
                            </div>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                    
                    {!expandedGroups.includes(group) && (
                      <div className="mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleGroupExpanded(group)}
                          className="text-xs text-gray-500"
                        >
                          View {groupServices.length} services
                        </Button>
                      </div>
                    )}
                  </Collapsible>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </div>
      
      {/* My Selections Summary */}
      <div>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">My Selections</h3>
            
            {selectedServices.length === 0 ? (
              <p className="text-muted-foreground mb-4">No services selected yet.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {selectedServices.map((service) => (
                  <div key={service.service_id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{service.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(service.standard_price)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeService(service.service_id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center font-semibold mb-6">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={onContinue}
              disabled={selectedServices.length === 0}
            >
              Find My Best Pass
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 