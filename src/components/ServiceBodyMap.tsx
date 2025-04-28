
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleCheck, CirclePlus } from 'lucide-react';
import { services } from '@/data/servicesData';

interface ServiceBodyMapProps {
  selectedServices: string[];
  toggleService: (serviceId: string) => void;
}

const ServiceBodyMap: React.FC<ServiceBodyMapProps> = ({ 
  selectedServices,
  toggleService 
}) => {
  return (
    <div className="bg-purple-50 rounded-2xl p-6 flex items-center justify-center h-full">
      <div className="relative w-64 h-[500px]">
        {/* This would be replaced with an actual interactive SVG body map */}
        <div className="w-full h-full bg-white/50 rounded-lg flex items-center justify-center">
          <p className="text-center text-purple-600 font-medium">
            Interactive Body Map<br/>
            <span className="text-sm text-purple-400">(Click on areas to select services)</span>
          </p>
        </div>
        
        {/* Face area hotspots */}
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[15%] left-[45%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("eyebrows")}
        >
          {selectedServices.includes("eyebrows") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[17%] left-[30%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("ears")}
        >
          {selectedServices.includes("ears") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[19%] left-[60%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("upper_lip")}
        >
          {selectedServices.includes("upper_lip") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        {/* Upper body hotspots */}
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[35%] left-[31%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("underarms")}
        >
          {selectedServices.includes("underarms") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[35%] left-[59%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("underarms")}
        >
          {selectedServices.includes("underarms") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[32%] left-[45%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("chest_full")}
        >
          {selectedServices.includes("chest_full") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        {/* Middle body hotspots */}
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[45%] left-[45%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("stomach_full")}
        >
          {selectedServices.includes("stomach_full") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        {/* Lower body hotspots */}
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[55%] left-[45%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("bikini_line_v")}
        >
          {selectedServices.includes("bikini_line_v") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[65%] left-[30%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("legs_upper")}
        >
          {selectedServices.includes("legs_upper") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[65%] left-[60%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("legs_upper")}
        >
          {selectedServices.includes("legs_upper") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[80%] left-[30%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("legs_lower")}
        >
          {selectedServices.includes("legs_lower") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[80%] left-[60%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("legs_lower")}
        >
          {selectedServices.includes("legs_lower") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-[62%] left-[45%] rounded-full h-8 w-8 p-0 bg-purple-100 hover:bg-purple-200 border-purple-300"
          onClick={() => toggleService("brazilian_v")}
        >
          {selectedServices.includes("brazilian_v") ? 
            <CircleCheck className="h-4 w-4 text-purple-700" /> :
            <CirclePlus className="h-4 w-4 text-purple-700" />
          }
        </Button>
      </div>
    </div>
  );
};

export default ServiceBodyMap;
