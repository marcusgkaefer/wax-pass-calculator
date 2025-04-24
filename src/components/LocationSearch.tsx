
import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Downtown Center",
    address: "123 Main Street",
    city: "Austin",
    state: "TX"
  },
  {
    id: "2",
    name: "Westlake Center",
    address: "456 Lake Drive",
    city: "Austin",
    state: "TX"
  }
];

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredLocations = mockLocations.filter(location =>
    `${location.name} ${location.city} ${location.state} ${location.address}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location);
    setShowResults(false);
    setSearchQuery(`${location.name} - ${location.address}`);
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location accessed:", position.coords);
          // In a real app, we would use these coordinates to find the nearest center
        },
        (error) => {
          console.error("Error accessing location:", error);
        }
      );
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for your local center..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            className="w-full pl-10 pr-4 py-2"
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

      {showResults && searchQuery && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto">
          <ul className="py-2">
            {filteredLocations.map((location) => (
              <li
                key={location.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationClick(location)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-600">
                      {location.address}, {location.city}, {location.state}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;
