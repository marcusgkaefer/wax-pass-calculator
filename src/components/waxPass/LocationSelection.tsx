import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { MapPin, Search, Compass, RefreshCw, Clock, Phone, ExternalLink, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWaxPass } from '@/lib/WaxPassContext';
import { ZenotiApiService, ZenotiCenter } from '@/lib/zenotiApi';

// Extended type for centers with distance
type ZenotiCenterWithDistance = ZenotiCenter & { distance?: number };

interface LocationSelectionProps {
  onContinue: () => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({ onContinue }) => {
  const { selectedWaxCenter, setSelectedWaxCenter } = useWaxPass();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchChips, setSearchChips] = useState<string[]>([]);
  const [centers, setCenters] = useState<ZenotiCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<ZenotiCenterWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [focusedChipIndex, setFocusedChipIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load all centers on component mount
  useEffect(() => {
    loadAllCenters();
  }, []);

  // Filter centers based on search chips
  useEffect(() => {
    if (searchChips.length === 0) {
      setFilteredCenters([]);
      setHasSearched(false);
      return;
    }

    const filtered = centers.filter(center => {
      // AND logic: center must match ALL search chips
      return searchChips.every(chip => {
        const searchTerm = chip.toLowerCase();
        return (
          center.name.toLowerCase().includes(searchTerm) ||
          center.display_name.toLowerCase().includes(searchTerm) ||
          center.address_info.city.toLowerCase().includes(searchTerm) ||
          center.state.name.toLowerCase().includes(searchTerm) ||
          `${center.address_info.city}, ${center.state.name}`.toLowerCase().includes(searchTerm) ||
          center.address_info.zip_code.includes(searchTerm)
        );
      });
    });

    setFilteredCenters(filtered.map(center => ({ ...center, distance: undefined } as ZenotiCenterWithDistance)));
    setHasSearched(true);
  }, [searchChips, centers]);

  const addSearchChip = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !searchChips.includes(trimmedValue)) {
      setSearchChips(prev => [...prev, trimmedValue]);
      setSearchQuery("");
      setFocusedChipIndex(-1);
    }
  };

  const removeSearchChip = (index: number) => {
    setSearchChips(prev => prev.filter((_, i) => i !== index));
    setFocusedChipIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (searchQuery.trim()) {
        addSearchChip(searchQuery);
      }
    } else if (e.key === 'Backspace') {
      if (!searchQuery && searchChips.length > 0) {
        if (focusedChipIndex === -1) {
          // Focus on the last chip
          setFocusedChipIndex(searchChips.length - 1);
        } else {
          // Remove the focused chip
          removeSearchChip(focusedChipIndex);
        }
      } else {
        setFocusedChipIndex(-1);
      }
    } else if (e.key === 'ArrowLeft' && !searchQuery) {
      e.preventDefault();
      if (focusedChipIndex === -1 && searchChips.length > 0) {
        setFocusedChipIndex(searchChips.length - 1);
      } else if (focusedChipIndex > 0) {
        setFocusedChipIndex(focusedChipIndex - 1);
      }
    } else if (e.key === 'ArrowRight' && !searchQuery) {
      e.preventDefault();
      if (focusedChipIndex < searchChips.length - 1) {
        setFocusedChipIndex(focusedChipIndex + 1);
      } else {
        setFocusedChipIndex(-1);
        inputRef.current?.focus();
      }
    } else if (e.key === 'Delete' && focusedChipIndex !== -1) {
      e.preventDefault();
      removeSearchChip(focusedChipIndex);
    } else {
      setFocusedChipIndex(-1);
    }
  };

  const loadAllCenters = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const allCenters = await ZenotiApiService.getAllCenters(forceRefresh);
      setCenters(allCenters);
      console.log(`Loaded ${allCenters.length} centers`);
    } catch (err) {
      console.error("Error loading centers:", err);
      setError("Failed to load wax centers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocation = () => {
    setError(null);
    setIsLoadingLocation(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log("Location accessed:", latitude, longitude);
            
            // Calculate distances and find nearest centers
            const centersWithDistance = centers.map(center => {
              // Simple distance calculation (not perfectly accurate but good enough for demo)
              const lat1 = latitude;
              const lon1 = longitude;
              const lat2 = center.latitude || 0;
              const lon2 = center.longitude || 0;
              
              const distance = Math.sqrt(
                Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)
              ) * 69; // Rough miles conversion
              
              return { ...center, distance };
            }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

            if (centersWithDistance.length > 0) {
              setFilteredCenters(centersWithDistance.slice(0, 10) as ZenotiCenterWithDistance[]);
              setSearchChips(["Near your location"]);
              setHasSearched(true);
            } else {
              setError("No wax centers found near your location. Please search manually.");
            }
            setIsLoadingLocation(false);
          } catch (err) {
            console.error("Error finding nearest centers:", err);
            setError("Error finding centers near you. Please try again or search manually.");
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error accessing location:", error);
          setError("Unable to access your location. Please try again or search manually.");
          setIsLoadingLocation(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please search manually.");
      setIsLoadingLocation(false);
    }
  };

  const handleCenterSelect = (center: ZenotiCenterWithDistance) => {
    // Remove the distance property before setting in context
    const { distance, ...zenotiCenter } = center;
    setSelectedWaxCenter(zenotiCenter as ZenotiCenter);
  };

  const handleRefresh = () => {
    loadAllCenters(true); // Force refresh
  };

  const formatWorkingHours = (workingHours: ZenotiCenter['working_hours']) => {
    if (!workingHours || workingHours.length === 0) return "Hours not available";
    
    const today = new Date().getDay();
    const todayHours = workingHours.find(h => h.day_of_week === today);
    
    if (todayHours) {
      if (todayHours.is_closed) {
        return "Closed today";
      }
      return `Open today: ${todayHours.start_time} - ${todayHours.end_time}`;
    }
    
    return "Hours available";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Select Your Wax Center</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <div className="relative border rounded-md bg-white">
              <div className="flex flex-wrap items-center gap-1 p-2 min-h-[2.5rem]">
                {searchChips.map((chip, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
                      focusedChipIndex === index
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {chip}
                    <button
                      onClick={() => removeSearchChip(index)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="relative flex-1 min-w-[200px]">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={searchChips.length === 0 ? "Search by city, state, zip code, or center name..." : "Add another filter..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
            {searchChips.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Press Enter or Tab to add filters • Use arrow keys to navigate • Backspace to remove
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleGeolocation}
            className="flex items-center gap-2"
            disabled={isLoadingLocation || isLoading}
          >
            <Compass className={`h-4 w-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
            Near Me
          </Button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3 text-lg">Loading wax centers...</span>
          </div>
        )}

        {!isLoading && hasSearched && filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No wax centers found matching all filters: {searchChips.map(chip => `"${chip}"`).join(', ')}
            </p>
            <p className="text-sm text-gray-400">Try removing some filters or searching for different terms</p>
          </div>
        )}

        {!isLoading && hasSearched && filteredCenters.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Found {filteredCenters.length} center{filteredCenters.length !== 1 ? 's' : ''} matching all filters
              </h3>
              {searchChips.includes("Near your location") && (
                <Badge variant="secondary">
                  <MapPin className="h-3 w-3 mr-1" />
                  Sorted by distance
                </Badge>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCenters.map((center) => (
                <Card
                  key={center.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedWaxCenter?.id === center.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleCenterSelect(center)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {center.display_name}
                      </CardTitle>
                      {selectedWaxCenter?.id === center.id && (
                        <Badge className="ml-2">Selected</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600">
                          <div>{center.address_info.address1}</div>
                          {center.address_info.address2 && (
                            <div>{center.address_info.address2}</div>
                          )}
                          <div>
                            {center.address_info.city}, {center.state.name} {center.address_info.zip_code}
                          </div>
                        </div>
                      </div>
                      
                      {center.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{center.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatWorkingHours(center.working_hours)}
                        </span>
                      </div>
                      
                      {/* Distance if available */}
                      {'distance' in center && center.distance !== undefined && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm text-primary font-medium">
                            ~{Math.round(center.distance)} miles away
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Start by searching for your city or using location</p>
            <p className="text-sm text-gray-400">
              Type search terms and press Enter or Tab to add filters
            </p>
          </div>
        )}
      </div>

      {selectedWaxCenter && (
        <div className="flex justify-center">
          <Button onClick={onContinue} size="lg" className="px-8">
            Continue to Service Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationSelection; 