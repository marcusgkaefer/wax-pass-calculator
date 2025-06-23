import React, { useState, useEffect, useRef, KeyboardEvent, useCallback, useMemo } from 'react';
import { MapPin, Search, Compass, RefreshCw, Clock, Phone, ExternalLink, X, Grid3X3, List, LayoutGrid, Rows3, Map, SortAsc, Star, Heart, Navigation, Eye, ChevronDown, MoreHorizontal, Sliders, Loader2, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWaxPass } from '@/lib/WaxPassContext';
import { ZenotiApiService, ZenotiCenter } from '@/lib/zenotiApi';

// Extended type for centers with distance
type ZenotiCenterWithDistance = ZenotiCenter & { distance?: number };

// Display options types
type ViewType = 'grid' | 'list' | 'compact' | 'cards';
type DensityType = 'comfortable' | 'compact' | 'spacious';
type SortType = 'distance' | 'name' | 'rating' | 'availability' | 'newest';

// Virtualization constants
const ITEMS_PER_PAGE = 20;
const INITIAL_VISIBLE_ITEMS = 10;

interface LocationSelectionProps {
  onContinue: () => void;
}

// Simple skeleton component
const Skeleton = ({ className = "", ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className={`bg-gray-200/50 rounded animate-pulse ${className}`} {...props} />
);

// Skeleton loader component
const CenterSkeleton: React.FC<{ viewType: ViewType; density: DensityType }> = ({ viewType, density }) => {
  const getDensityClass = () => {
    const densityClasses = {
      compact: "p-2",
      comfortable: "p-4", 
      spacious: "p-6"
    };
    return densityClasses[density];
  };

  if (viewType === 'compact') {
    return (
      <div className="glass-light rounded-2xl p-3 border border-white/40 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-6 rounded-full ml-4" />
        </div>
      </div>
    );
  }

  if (viewType === 'list') {
    return (
      <Card className="glass-light border-white/40 animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full ml-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-light border-white/40 animate-pulse ${getDensityClass()}`}>
      <CardHeader className={`${density === 'compact' ? 'pb-2' : 'pb-3'}`}>
        <div className="flex items-start justify-between">
          <Skeleton className={`${density === 'compact' ? 'h-4 w-40' : 'h-5 w-48'}`} />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`space-y-${density === 'compact' ? '1' : '2'}`}>
          <div className="flex items-start gap-2">
            <Skeleton className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <div className="flex-1">
              <Skeleton className={`${density === 'compact' ? 'h-3' : 'h-4'} w-full mb-1`} />
              <Skeleton className={`${density === 'compact' ? 'h-3' : 'h-4'} w-3/4`} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <Skeleton className={`${density === 'compact' ? 'h-3' : 'h-4'} w-24`} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <Skeleton className={`${density === 'compact' ? 'h-3' : 'h-4'} w-32`} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <Skeleton className={`${density === 'compact' ? 'h-3' : 'h-4'} w-20`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LocationSelection: React.FC<LocationSelectionProps> = ({ onContinue }) => {
  const { selectedWaxCenter, setSelectedWaxCenter } = useWaxPass();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchChips, setSearchChips] = useState<string[]>([]);
  const [centers, setCenters] = useState<ZenotiCenter[]>([]);
  const [allFilteredCenters, setAllFilteredCenters] = useState<ZenotiCenterWithDistance[]>([]);
  const [displayedCenters, setDisplayedCenters] = useState<ZenotiCenterWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [focusedChipIndex, setFocusedChipIndex] = useState<number>(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  
  // Display preferences
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [density, setDensity] = useState<DensityType>('comfortable');
  const [sortBy, setSortBy] = useState<SortType>('distance');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Refs for virtualization and infinite scroll
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Load all centers on component mount
  useEffect(() => {
    loadAllCenters();
  }, []);

  // Filter and sort centers based on search chips and sort preferences
  useEffect(() => {
    if (searchChips.length === 0) {
      setAllFilteredCenters([]);
      setDisplayedCenters([]);
      setHasSearched(false);
      setCurrentPage(0);
      setHasMoreItems(false);
      return;
    }

    const filtered = centers.filter(center => {
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

    // Apply sorting
    const centersWithDistance: ZenotiCenterWithDistance[] = filtered.map(center => ({ ...center, distance: undefined }));
    
    const sortedFiltered = [...centersWithDistance].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance;
          }
          return 0;
        case 'name':
          return a.display_name.localeCompare(b.display_name);
        case 'rating':
          return Math.random() - 0.5;
        case 'availability':
          return Math.random() - 0.5;
        case 'newest':
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

    setAllFilteredCenters(sortedFiltered);
    
    // Reset pagination and load initial items
    setCurrentPage(0);
    const initialItems = sortedFiltered.slice(0, INITIAL_VISIBLE_ITEMS);
    setDisplayedCenters(initialItems);
    setHasMoreItems(sortedFiltered.length > INITIAL_VISIBLE_ITEMS);
    setHasSearched(true);
  }, [searchChips, centers, sortBy]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreTriggerRef.current || !hasMoreItems || isLoadingMore) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreItems && !isLoadingMore) {
          loadMoreItems();
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '100px 0px',
        threshold: 0.1,
      }
    );

    intersectionObserverRef.current.observe(loadMoreTriggerRef.current);

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [hasMoreItems, isLoadingMore, allFilteredCenters.length]);

  // Load more items for infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || !hasMoreItems) return;

    setIsLoadingMore(true);
    
    // Simulate API delay for realistic loading experience
    await new Promise(resolve => setTimeout(resolve, 500));

    const nextPage = currentPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = allFilteredCenters.slice(startIndex, endIndex);

    if (newItems.length > 0) {
      setDisplayedCenters(prev => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      
      // Check if we've loaded all items
      const totalLoaded = displayedCenters.length + newItems.length;
      setHasMoreItems(totalLoaded < allFilteredCenters.length);
    } else {
      setHasMoreItems(false);
    }

    setIsLoadingMore(false);
  }, [currentPage, allFilteredCenters, displayedCenters.length, isLoadingMore, hasMoreItems]);

  // Scroll to top functionality
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Get container height based on view type and density
  const getContainerHeight = useMemo(() => {
    // Fixed height to ensure buttons remain visible
    return 'calc(100vh - 400px)'; // Adjust based on your layout
  }, []);

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
          setFocusedChipIndex(searchChips.length - 1);
        } else {
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
            
            const centersWithDistance = centers.map(center => {
              const lat1 = latitude;
              const lon1 = longitude;
              const lat2 = center.latitude || 0;
              const lon2 = center.longitude || 0;
              
              const distance = Math.sqrt(
                Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)
              ) * 69;
              
              return { ...center, distance };
            }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

            if (centersWithDistance.length > 0) {
              setAllFilteredCenters(centersWithDistance as ZenotiCenterWithDistance[]);
              const initialItems = centersWithDistance.slice(0, INITIAL_VISIBLE_ITEMS);
              setDisplayedCenters(initialItems as ZenotiCenterWithDistance[]);
              setHasMoreItems(centersWithDistance.length > INITIAL_VISIBLE_ITEMS);
              setSearchChips(["Near your location"]);
              setSortBy('distance');
              setCurrentPage(0);
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
    const { distance, ...zenotiCenter } = center;
    setSelectedWaxCenter(zenotiCenter as ZenotiCenter);
  };

  const handleRefresh = () => {
    loadAllCenters(true);
  };

  const toggleFavorite = (centerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(centerId)) {
        newFavorites.delete(centerId);
      } else {
        newFavorites.add(centerId);
      }
      return newFavorites;
    });
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

  // View Type Configurations
  const getViewConfig = () => {
    const configs = {
      grid: {
        containerClass: "grid gap-4 md:grid-cols-2 lg:grid-cols-2",
        cardClass: "h-full"
      },
      list: {
        containerClass: "space-y-2",
        cardClass: "flex-row items-center"
      },
      compact: {
        containerClass: "space-y-1",
        cardClass: "py-2 px-3"
      },
      cards: {
        containerClass: "grid gap-6 md:grid-cols-1 lg:grid-cols-1",
        cardClass: "h-full"
      }
    };
    return configs[viewType] || configs.grid;
  };

  const getDensityClass = () => {
    const densityClasses = {
      compact: "p-2",
      comfortable: "p-4",
      spacious: "p-6"
    };
    return densityClasses[density];
  };

  // Render functions for different view types
  const renderGridView = (center: ZenotiCenterWithDistance) => (
    <Card
      key={center.id}
      className={`cursor-pointer transition-all duration-300 glass-micro-interaction hover:shadow-lg hover:scale-[1.02] ${
        selectedWaxCenter?.id === center.id
          ? "ring-2 ring-pink-500 glass-premium shadow-lg scale-[1.02] border-pink-200/50"
          : "glass-light border-white/40 hover:glass-card"
      } ${getDensityClass()}`}
      onClick={() => handleCenterSelect(center)}
    >
      <CardHeader className={`${density === 'compact' ? 'pb-2' : 'pb-3'} relative`}>
        <div className="flex items-start justify-between">
          <CardTitle className={`font-semibold ${density === 'compact' ? 'text-base' : 'text-lg'} text-gray-800`}>
            {center.display_name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 glass-micro-interaction hover:glass-light-glow border border-white/30 ${
                      favorites.has(center.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                    onClick={(e) => toggleFavorite(center.id, e)}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${
                        favorites.has(center.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {favorites.has(center.id) ? 'Remove from favorites' : 'Add to favorites'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {selectedWaxCenter?.id === center.id && (
              <Badge className="ml-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0" variant="default">Selected</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`space-y-${density === 'compact' ? '1' : '2'}`}>
          <div className="flex items-start gap-2">
            <MapPin className={`${density === 'compact' ? 'h-3 w-3 mt-0.5' : 'h-4 w-4 mt-0.5'} text-pink-500 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`${density === 'compact' ? 'text-xs' : 'text-sm'} text-gray-600 leading-relaxed`}>
                {center.address_info.address1}
                <br />
                {center.address_info.city}, {center.state.name} {center.address_info.zip_code}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} text-purple-500`} />
            <span className={`${density === 'compact' ? 'text-xs' : 'text-sm'} text-gray-600`}>
              {center.phone || '(555) 123-4567'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} text-cyan-500`} />
            <span className={`${density === 'compact' ? 'text-xs' : 'text-sm'} text-gray-600`}>
              {formatWorkingHours(center.working_hours)}
            </span>
          </div>
          
          {center.distance && (
            <div className="flex items-center gap-2">
              <Navigation className={`${density === 'compact' ? 'h-3 w-3' : 'h-4 w-4'} text-green-500`} />
              <span className={`${density === 'compact' ? 'text-xs' : 'text-sm'} text-gray-600`}>
                ~{Math.round(center.distance)} miles away
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderListView = (center: ZenotiCenterWithDistance) => (
    <Card
      key={center.id}
      className={`cursor-pointer transition-all duration-300 glass-micro-interaction ${
        selectedWaxCenter?.id === center.id
          ? "ring-2 ring-pink-500 glass-premium border-pink-200/50"
          : "glass-light border-white/40 hover:glass-card"
      }`}
      onClick={() => handleCenterSelect(center)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate text-gray-800">{center.display_name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {center.address_info.city}, {center.state.name}
                  {center.distance && ` • ~${Math.round(center.distance)} miles`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  4.{Math.floor(Math.random() * 9) + 1}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.floor(Math.random() * 200) + 50})
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 glass-micro-interaction hover:glass-light-glow border border-white/30 ${
                      favorites.has(center.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                    onClick={(e) => toggleFavorite(center.id, e)}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${
                        favorites.has(center.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {favorites.has(center.id) ? 'Remove from favorites' : 'Add to favorites'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {selectedWaxCenter?.id === center.id && (
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">Selected</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompactView = (center: ZenotiCenterWithDistance) => (
    <div
      key={center.id}
      className={`cursor-pointer transition-all duration-300 glass-micro-interaction rounded-2xl p-3 border ${
        selectedWaxCenter?.id === center.id
          ? "ring-2 ring-pink-500 glass-premium border-pink-200/50"
          : "glass-light border-white/40 hover:glass-card"
      }`}
      onClick={() => handleCenterSelect(center)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm truncate text-gray-800">{center.display_name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className={`p-1 rounded-lg transition-colors ${
                favorites.has(center.id) 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-red-500'
              }`}>
                4.{Math.floor(Math.random() * 9) + 1}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-gray-500 truncate">
              {center.address_info.city}, {center.state.name}
            </span>
            {center.distance && (
              <span className="text-xs text-pink-600 font-medium">
                ~{Math.round(center.distance)} mi
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatWorkingHours(center.working_hours)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 glass-micro-interaction border border-white/30 ${
                    favorites.has(center.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                  onClick={(e) => toggleFavorite(center.id, e)}
                >
                  <Heart 
                    className={`h-3 w-3 ${
                      favorites.has(center.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-500 hover:text-red-500'
                    }`} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {favorites.has(center.id) ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {selectedWaxCenter?.id === center.id && (
            <Badge className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">✓</Badge>
          )}
        </div>
      </div>
    </div>
  );

  // Loading more indicator component
  const LoadingMoreIndicator = () => (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm text-gray-600">Loading more centers...</span>
      </div>
    </div>
  );

  // End of results indicator
  const EndOfResultsIndicator = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex items-center gap-2 text-gray-500 mb-3">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="text-sm px-3">End of results</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Showing {displayedCenters.length} of {allFilteredCenters.length} centers
      </p>
      {displayedCenters.length > 10 && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollToTop}
          className="flex items-center gap-2"
        >
          <ChevronUp className="h-4 w-4" />
          Back to top
        </Button>
      )}
    </div>
  );

  const renderVirtualizedCenters = () => {
    const config = getViewConfig();
    
    return (
      <div className="relative">
        {/* Scrollable container with fixed height */}
        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-4 py-6"
          style={{ height: getContainerHeight }}
        >
          <div className={config.containerClass}>
            {displayedCenters.map((center) => {
              switch (viewType) {
                case 'list':
                  return renderListView(center);
                case 'compact':
                  return renderCompactView(center);
                case 'cards':
                case 'grid':
                default:
                  return renderGridView(center);
              }
            })}
          </div>

          {/* Loading skeletons while loading more */}
          {isLoadingMore && (
            <div className={`mt-4 ${config.containerClass}`}>
              {Array.from({ length: ITEMS_PER_PAGE / 2 }).map((_, index) => (
                <CenterSkeleton key={`skeleton-${index}`} viewType={viewType} density={density} />
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMoreItems && !isLoadingMore && (
            <div 
              ref={loadMoreTriggerRef}
              className="h-20 flex items-center justify-center"
            >
              <LoadingMoreIndicator />
            </div>
          )}

          {/* End of results */}
          {!hasMoreItems && displayedCenters.length > 0 && (
            <EndOfResultsIndicator />
          )}
        </div>

        {/* Scroll position indicator */}
        {displayedCenters.length > 5 && (
          <div className="absolute bottom-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">Choose Your Wax Center</h2>
            <Badge variant="secondary" className="glass-ultra-light border border-white/30">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </div>
              ) : (
                `${displayedCenters.length} location${displayedCenters.length !== 1 ? 's' : ''}`
              )}
            </Badge>
          </div>
        </div>
        
        {/* Search and controls section - fixed */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <div className="relative glass-light border border-white/40 rounded-2xl">
                <div className="flex flex-wrap items-center gap-1 p-3 min-h-[2.5rem]">
                  {searchChips.map((chip, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                        focusedChipIndex === index
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white ring-2 ring-pink-300/50'
                          : 'glass-ultra-light text-gray-700 hover:glass-light border border-white/30'
                      }`}
                    >
                      {chip}
                      <button
                        onClick={() => removeSearchChip(index)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
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
                      className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent placeholder:text-gray-500/70"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 pointer-events-none" />
                  </div>
                </div>
              </div>
              {searchChips.length > 0 && (
                <div className="mt-2 text-xs text-gray-500/80">
                  Press Enter or Tab to add filters • Use arrow keys to navigate • Backspace to remove
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleGeolocation}
              className="flex items-center gap-2 glass-micro-interaction border-white/40 px-4 h-9"
              disabled={isLoadingLocation || isLoading}
            >
              <Compass className={`h-4 w-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
              Near Me
            </Button>
          </div>

          {/* Advanced Display Controls */}
          {hasSearched && allFilteredCenters.length > 0 && (
            <div className="flex items-center justify-between mb-6 glass-light border border-white/40 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="flex items-center glass-ultra-light border border-white/30 rounded-xl">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewType === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewType('grid')}
                          className={`rounded-r-none border-r border-white/30 h-8 ${viewType === 'grid' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : ''}`}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Grid view</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewType === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewType('list')}
                          className={`rounded-none border-r border-white/30 h-8 ${viewType === 'list' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : ''}`}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>List view</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewType === 'compact' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewType('compact')}
                          className={`rounded-none border-r border-white/30 h-8 ${viewType === 'compact' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : ''}`}
                        >
                          <Rows3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Compact view</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewType === 'cards' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewType('cards')}
                          className={`rounded-l-none h-8 ${viewType === 'cards' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : ''}`}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Card view</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Density:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 glass-micro-interaction border-white/30">
                        {density.charAt(0).toUpperCase() + density.slice(1)}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-light border-white/40">
                      <DropdownMenuRadioGroup value={density} onValueChange={(value) => setDensity(value as DensityType)}>
                        <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 glass-micro-interaction border-white/30">
                        {sortBy === 'distance' && searchChips.includes("Near your location") ? 'Distance' :
                         sortBy === 'name' ? 'Name' :
                         sortBy === 'rating' ? 'Rating' :
                         sortBy === 'availability' ? 'Availability' :
                         sortBy === 'newest' ? 'Newest' : 'Distance'}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-light border-white/40">
                      <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
                        {searchChips.includes("Near your location") && (
                          <DropdownMenuRadioItem value="distance">Distance</DropdownMenuRadioItem>
                        )}
                        <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="rating">Rating</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="availability">Availability</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {displayedCenters.length} of {allFilteredCenters.length} center{allFilteredCenters.length !== 1 ? 's' : ''}
                </span>
                {searchChips.includes("Near your location") && (
                  <Badge variant="secondary" className="flex items-center gap-1 glass-ultra-light border border-white/30">
                    <Navigation className="h-3 w-3" />
                    Sorted by distance
                  </Badge>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="glass-light border border-red-200/50 rounded-2xl p-4 mb-4 text-red-600 text-sm bg-gradient-to-r from-red-50/50 to-pink-50/30">
              {error}
            </div>
          )}
        </div>

        {/* Main content area - flexible */}
        <div className="flex-1 min-h-0">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="animate-spin h-12 w-12 border-2 border-pink-200 border-t-pink-600 rounded-full"></div>
                  <div className="absolute inset-0 animate-ping h-12 w-12 border-2 border-pink-300 rounded-full opacity-30"></div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-medium text-gray-700">Loading wax centers...</span>
                  <p className="text-sm text-gray-500 mt-1">Finding the perfect locations for you</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full max-w-4xl">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CenterSkeleton key={`loading-skeleton-${index}`} viewType={viewType} density={density} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isLoading && hasSearched && allFilteredCenters.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <div className="text-center glass-light border border-white/40 rounded-3xl p-12 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-ultra-light flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No centers found</h3>
                <p className="text-gray-600 mb-4">
                  No wax centers found matching all filters: {searchChips.map(chip => `"${chip}"`).join(', ')}
                </p>
                <p className="text-sm text-gray-500">Try removing some filters or searching for different terms</p>
              </div>
            </div>
          )}

          {!isLoading && hasSearched && allFilteredCenters.length > 0 && renderVirtualizedCenters()}

          {!hasSearched && !isLoading && (
            <div className="flex justify-center items-center h-full">
              <div className="text-center glass-light border border-white/40 rounded-3xl p-12 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-ultra-light flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Your Wax Center</h3>
                <p className="text-gray-600 mb-6">
                  Start by searching for your city, state, or zip code to discover nearby wax centers.
                </p>
                <Button 
                  onClick={handleGeolocation}
                  disabled={isLoadingLocation}
                  className="glass-micro-interaction bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hover:from-pink-600 hover:to-purple-600"
                >
                  <Compass className={`h-4 w-4 mr-2 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                  Use My Location
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LocationSelection; 