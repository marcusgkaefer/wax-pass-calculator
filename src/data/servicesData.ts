
// Service categories for grouping
export type ServiceCategory = 
  | "face" 
  | "body" 
  | "intimate"
  | "limbs";

export interface Service {
  id: string;
  name: string;
  price: number;
  category: ServiceCategory;
  icon: string; // Lucide icon name
  popular?: boolean;
  duration?: number; // in minutes
  painLevel?: number; // 1-5 scale
}

export const serviceCategories = [
  {
    id: "face",
    name: "Face",
    description: "Services for facial areas"
  },
  {
    id: "body", 
    name: "Body",
    description: "Services for torso and back"
  },
  {
    id: "intimate",
    name: "Intimate Areas",
    description: "Services for bikini and sensitive areas"
  },
  {
    id: "limbs",
    name: "Arms & Legs",
    description: "Services for arms and legs"
  }
];

export const services: Service[] = [
  // Face category
  { id: "chin", name: "Chin", price: 19, category: "face", icon: "chin" },
  { id: "ears", name: "Ears", price: 19, category: "face", icon: "ears" },
  { id: "eyebrows", name: "Eyebrows", price: 28, category: "face", icon: "eyebrow", popular: true },
  { id: "eyebrow_tint", name: "Eyebrow Tint", price: 20, category: "face", icon: "eyebrow" },
  { id: "hair_line", name: "Hair Line", price: 18, category: "face", icon: "hair-line" },
  { id: "lower_lip", name: "Lower Lip", price: 15, category: "face", icon: "lower-lip" },
  { id: "neck", name: "Neck", price: 19, category: "face", icon: "neck" },
  { id: "nose", name: "Nose", price: 19, category: "face", icon: "nose" },
  { id: "sideburns", name: "Sideburns", price: 18, category: "face", icon: "sideburns" },
  { id: "upper_lip", name: "Upper Lip", price: 18, category: "face", icon: "upper-lip", popular: true },
  { id: "ultimate_brow", name: "The Ultimate Eyebrow", price: 43.20, category: "face", icon: "eyebrow", popular: true },

  // Body category
  { id: "back_full", name: "Back (Full)", price: 80, category: "body", icon: "back", popular: true },
  { id: "back_lower", name: "Back (Lower)", price: 30, category: "body", icon: "back" },
  { id: "back_mid", name: "Back (Mid)", price: 34, category: "body", icon: "back" },
  { id: "back_upper", name: "Back (Upper)", price: 34, category: "body", icon: "back" },
  { id: "cheeks", name: "Cheeks", price: 19, category: "body", icon: "cheeks" },
  { id: "chest_full", name: "Chest (Full)", price: 41, category: "body", icon: "chest", popular: true },
  { id: "chest_strip", name: "Chest (Strip)", price: 31, category: "body", icon: "chest" },
  { id: "nipples", name: "Nipples", price: 20, category: "body", icon: "nipples" },
  { id: "shoulders", name: "Shoulders", price: 33, category: "body", icon: "shoulders" },
  { id: "stomach_full", name: "Stomach (Full)", price: 40, category: "body", icon: "stomach", popular: true },
  { id: "stomach_strip", name: "Stomach (Strip)", price: 20, category: "body", icon: "stomach" },
  { id: "underarms", name: "Underarms", price: 29, category: "body", icon: "underarms", popular: true },

  // Intimate category
  { id: "bikini_full_v", name: "Bikini Full - (V)", price: 63, category: "intimate", icon: "bikini-full", popular: true },
  { id: "bikini_full_p", name: "Bikini Full (P)", price: 63, category: "intimate", icon: "bikini-full" },
  { id: "bikini_line_v", name: "Bikini Line - (V)", price: 53, category: "intimate", icon: "bikini-line", popular: true },
  { id: "bikini_line_p", name: "Bikini Line (P)", price: 53, category: "intimate", icon: "bikini-line" },
  { id: "brazilian_v", name: "Brazilian - (V)", price: 77, category: "intimate", icon: "brazilian", popular: true },
  { id: "brazilian_p", name: "Brazilian (P)", price: 77, category: "intimate", icon: "brazilian" },
  { id: "butt_full_v", name: "Butt Full - (V)", price: 34, category: "intimate", icon: "butt-full" },
  { id: "butt_full_p", name: "Butt Full (P)", price: 34, category: "intimate", icon: "butt-full" },
  { id: "butt_strip_v", name: "Butt Strip - (V)", price: 25, category: "intimate", icon: "butt-strip" },
  { id: "butt_strip_p", name: "Butt Strip (P)", price: 25, category: "intimate", icon: "butt-strip" },
  { id: "inner_thighs", name: "Inner Thighs", price: 25, category: "intimate", icon: "inner-thighs" },

  // Arms & Legs category
  { id: "arms_full", name: "Arms (Full)", price: 55, category: "limbs", icon: "arms", popular: true },
  { id: "arms_half", name: "Arms (Half)", price: 47, category: "limbs", icon: "arms" },
  { id: "hands", name: "Hands", price: 20, category: "limbs", icon: "hands" },
  { id: "knees", name: "Knees", price: 22, category: "limbs", icon: "knees" },
  { id: "legs_full", name: "Legs (Full)", price: 88, category: "limbs", icon: "legs", popular: true },
  { id: "legs_lower", name: "Legs (Lower)", price: 56, category: "limbs", icon: "legs" },
  { id: "legs_upper", name: "Legs (Upper)", price: 58, category: "limbs", icon: "legs" },
  { id: "toes", name: "Toes", price: 20, category: "limbs", icon: "toes" },
];
