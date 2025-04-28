
import React from 'react';
import { Service } from '@/data/servicesData';

interface HumanBodySVGProps {
  selectedServices: string[];
  toggleService: (serviceId: string) => void;
  highlightBodyPart?: string;
}

const HumanBodySVG: React.FC<HumanBodySVGProps> = ({
  selectedServices,
  toggleService,
  highlightBodyPart
}) => {
  // Map body parts to service IDs
  const bodyPartToServiceMap: Record<string, string> = {
    'head': 'eyebrows',
    'face': 'upper_lip',
    'ears': 'ears',
    'underarms': 'underarms',
    'chest': 'chest_full',
    'stomach': 'stomach_full',
    'bikini': 'bikini_line_v',
    'brazilian': 'brazilian_v',
    'arms-upper': 'arms_full',
    'arms-lower': 'arms_half',
    'legs-upper': 'legs_upper',
    'legs-lower': 'legs_lower',
    'back': 'back_full',
    'shoulders': 'shoulders',
    'buttocks': 'butt_full_v'
  };

  // Check if a body part is selected
  const isSelected = (bodyPart: string) => {
    const serviceId = bodyPartToServiceMap[bodyPart];
    return selectedServices.includes(serviceId);
  };

  // Handle click on body part
  const handleBodyPartClick = (bodyPart: string) => {
    const serviceId = bodyPartToServiceMap[bodyPart];
    if (serviceId) {
      toggleService(serviceId);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 200 400"
        className="w-64 h-[500px] max-w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle
          cx="100"
          cy="40"
          r="30"
          className={`${
            isSelected('head') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('head')}
        />
        
        {/* Face */}
        <path
          d="M85 40 Q100 60, 115 40"
          fill="none"
          className={`${
            isSelected('face') 
              ? 'stroke-purple-500' 
              : 'stroke-gray-400'
          } stroke-2 cursor-pointer hover:stroke-purple-400 transition-colors`}
          onClick={() => handleBodyPartClick('face')}
        />
        
        {/* Ears */}
        <circle
          cx="70"
          cy="40"
          r="5"
          className={`${
            isSelected('ears') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('ears')}
        />
        <circle
          cx="130"
          cy="40"
          r="5"
          className={`${
            isSelected('ears') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('ears')}
        />
        
        {/* Neck */}
        <rect
          x="90"
          y="70"
          width="20"
          height="15"
          className="fill-white stroke-gray-400 stroke-2"
        />
        
        {/* Torso */}
        <rect
          x="70"
          y="85"
          width="60"
          height="90"
          rx="20"
          className="fill-white stroke-gray-400 stroke-2"
        />
        
        {/* Chest */}
        <path
          d="M80 100 Q100 120, 120 100"
          fill="none"
          className={`${
            isSelected('chest') 
              ? 'stroke-purple-500' 
              : 'stroke-gray-400'
          } stroke-2 cursor-pointer hover:stroke-purple-400 transition-colors`}
          onClick={() => handleBodyPartClick('chest')}
        />
        
        {/* Underarms */}
        <circle
          cx="65"
          cy="105"
          r="6"
          className={`${
            isSelected('underarms') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('underarms')}
        />
        <circle
          cx="135"
          cy="105"
          r="6"
          className={`${
            isSelected('underarms') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('underarms')}
        />
        
        {/* Stomach */}
        <ellipse
          cx="100"
          cy="140"
          rx="20"
          ry="25"
          className={`${
            isSelected('stomach') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('stomach')}
        />
        
        {/* Bikini area */}
        <path
          d="M80 175 Q100 185, 120 175"
          fill="none"
          className={`${
            isSelected('bikini') 
              ? 'stroke-purple-500' 
              : 'stroke-gray-400'
          } stroke-2 cursor-pointer hover:stroke-purple-400 transition-colors`}
          onClick={() => handleBodyPartClick('bikini')}
        />
        
        {/* Brazilian area (represented by small dot) */}
        <circle
          cx="100"
          cy="180"
          r="5"
          className={`${
            isSelected('brazilian') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('brazilian')}
        />
        
        {/* Arms */}
        {/* Left arm upper */}
        <rect
          x="40"
          y="90"
          width="30"
          height="20"
          rx="10"
          className={`${
            isSelected('arms-upper') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('arms-upper')}
        />
        
        {/* Right arm upper */}
        <rect
          x="130"
          y="90"
          width="30"
          height="20"
          rx="10"
          className={`${
            isSelected('arms-upper') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('arms-upper')}
        />
        
        {/* Left arm lower */}
        <rect
          x="20"
          y="100"
          width="20"
          height="40"
          rx="10"
          className={`${
            isSelected('arms-lower') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('arms-lower')}
        />
        
        {/* Right arm lower */}
        <rect
          x="160"
          y="100"
          width="20"
          height="40"
          rx="10"
          className={`${
            isSelected('arms-lower') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('arms-lower')}
        />
        
        {/* Hips */}
        <rect
          x="70"
          y="175"
          width="60"
          height="30"
          rx="15"
          className="fill-white stroke-gray-400 stroke-2"
        />
        
        {/* Legs */}
        {/* Left leg upper */}
        <rect
          x="75"
          y="205"
          width="20"
          height="70"
          rx="10"
          className={`${
            isSelected('legs-upper') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('legs-upper')}
        />
        
        {/* Right leg upper */}
        <rect
          x="105"
          y="205"
          width="20"
          height="70"
          rx="10"
          className={`${
            isSelected('legs-upper') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('legs-upper')}
        />
        
        {/* Left leg lower */}
        <rect
          x="75"
          y="275"
          width="20"
          height="80"
          rx="10"
          className={`${
            isSelected('legs-lower') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('legs-lower')}
        />
        
        {/* Right leg lower */}
        <rect
          x="105"
          y="275"
          width="20"
          height="80"
          rx="10"
          className={`${
            isSelected('legs-lower') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('legs-lower')}
        />
        
        {/* Back (shown as a small indicator that can be clicked to flip) */}
        <rect
          x="150"
          y="20"
          width="30"
          height="15"
          rx="5"
          className={`${
            isSelected('back') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('back')}
        />
        <text 
          x="165" 
          y="30" 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-xs font-medium fill-gray-600"
        >
          Back
        </text>
        
        {/* Shoulders indicator */}
        <rect
          x="150"
          y="40"
          width="30"
          height="15"
          rx="5"
          className={`${
            isSelected('shoulders') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('shoulders')}
        />
        <text 
          x="165" 
          y="50" 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-xs font-medium fill-gray-600"
        >
          Shoulders
        </text>
        
        {/* Buttocks indicator */}
        <rect
          x="150"
          y="60"
          width="30"
          height="15"
          rx="5"
          className={`${
            isSelected('buttocks') 
              ? 'fill-purple-200 stroke-purple-500' 
              : 'fill-white stroke-gray-400'
          } stroke-2 cursor-pointer hover:fill-purple-100 transition-colors`}
          onClick={() => handleBodyPartClick('buttocks')}
        />
        <text 
          x="165" 
          y="70" 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-xs font-medium fill-gray-600"
        >
          Buttocks
        </text>
        
        {/* Labels for body parts */}
        <text x="100" y="15" textAnchor="middle" className="text-xs font-medium fill-gray-600">Head</text>
        <text x="140" y="105" textAnchor="start" className="text-xs font-medium fill-gray-600">Underarm</text>
        <text x="100" y="130" textAnchor="middle" className="text-xs font-medium fill-gray-600">Stomach</text>
        <text x="45" y="95" textAnchor="middle" className="text-xs font-medium fill-gray-600">Arms</text>
        <text x="85" y="250" textAnchor="middle" className="text-xs font-medium fill-gray-600">Thigh</text>
        <text x="85" y="320" textAnchor="middle" className="text-xs font-medium fill-gray-600">Lower Leg</text>
      </svg>
      
      {/* Optional tooltips or interactive elements */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md text-sm">
        Click on body parts to select services
      </div>
    </div>
  );
};

export default HumanBodySVG;
