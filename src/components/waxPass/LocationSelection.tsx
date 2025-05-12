import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useWaxPass } from '@/lib/WaxPassContext';
import { mockCities, fetchWaxCentersForCity, fetchNearestWaxCenter } from '@/lib/waxPassCalculations';

interface City {
  id: string;
  name: string;
  state: string;
}

interface WaxCenter {
  id: string;
  display_name: string;
}

interface LocationSelectionProps {
  onContinue: () => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({ onContinue }) => {
  const { selectedWaxCenter, setSelectedWaxCenter } = useWaxPass();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [waxCenters, setWaxCenters] = useState<WaxCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter cities based on search query
  const filteredCities = mockCities.filter(city =>
    `${city.name} ${city.state}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGeolocation = () => {
    setError(null);
    setIsLoading(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log("Location accessed:", latitude, longitude);
            
            const nearestCenter = await fetchNearestWaxCenter(latitude, longitude);
            
            if (nearestCenter) {
              setSelectedWaxCenter(nearestCenter);
              setWaxCenters([nearestCenter]);
            } else {
              setError("No wax centers found near your location. Please search for a city manually.");
            }
            setIsLoading(false);
          } catch (err) {
            console.error("Error finding nearest center:", err);
            setError("Error finding a center near you. Please try again or search manually.");
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error accessing location:", error);
          setError("Unable to access your location. Please try again or search manually.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please search for a location manually.");
      setIsLoading(false);
    }
  };

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    setSearchQuery(`${city.name}, ${city.state}`);
    setIsLoading(true);
    setError(null);

    try {
      const centers = await fetchWaxCentersForCity(city.id);
      setWaxCenters(centers);
      
      // Automatically select if there's only one wax center
      if (centers.length === 1) {
        setSelectedWaxCenter(centers[0]);
      } else if (centers.length === 0) {
        setError(`No wax centers found in ${city.name}. Please try another location.`);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching wax centers:", err);
      setError("Error fetching wax centers. Please try again.");
      setIsLoading(false);
    }
  };

  const handleWaxCenterSelect = (waxCenter: WaxCenter) => {
    setSelectedWaxCenter(waxCenter);
  };

  // If there's already a selected wax center, populate the UI accordingly
  useEffect(() => {
    if (selectedWaxCenter && waxCenters.length === 0) {
      setWaxCenters([selectedWaxCenter]);
    }
  }, [selectedWaxCenter, waxCenters.length]);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Select Your Wax Center</h2>
      
      <div className="mb-8">
        <div className="relative mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <Button
              variant="outline"
              onClick={handleGeolocation}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Compass className="h-4 w-4" />
              Near Me
            </Button>
          </div>

          {showCityDropdown && searchQuery && (
            <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
              <CardContent className="p-0">
                {filteredCities.length > 0 ? (
                  <ul>
                    {filteredCities.map((city) => (
                      <li
                        key={city.id}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>
                            {city.name}, {city.state}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-gray-500">No cities found</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Searching...</span>
          </div>
        )}

        {selectedCity && waxCenters.length > 0 && !isLoading && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Wax Centers in {selectedCity.name}</h3>
            <div className="space-y-2">
              {waxCenters.map((center) => (
                <div
                  key={center.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors 
                    ${
                      selectedWaxCenter?.id === center.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-gray-50"
                    }`}
                  onClick={() => handleWaxCenterSelect(center)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{center.display_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show when we have wax centers but no city (from geolocation) */}
        {!selectedCity && waxCenters.length > 0 && selectedWaxCenter && !isLoading && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Nearest Wax Center</h3>
            <div className="p-3 border rounded-md border-primary bg-primary/5">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{selectedWaxCenter.display_name}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!selectedWaxCenter}
          className="px-6"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default LocationSelection; 