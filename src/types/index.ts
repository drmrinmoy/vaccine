export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: number;
  nutrition: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  ingredients: string[];
  steps: string[];
  ageGroup: string[];
  region: string[];
  tags: string[];
  rating: number;
  reviews: number;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  region: string;
  days: {
    day: string;
    meals: {
      type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
      recipe: Recipe;
      time: string;
    }[];
  }[];
}

export interface NutritionTip {
  id: string;
  title: string;
  content: string;
  category: string;
  ageGroup: string[];
  image?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  region: string;
  dietaryPreferences: string[];
  allergies: string[];
  favoriteRecipes: string[];
  achievements: Achievement[];
  streakDays: number;
  lastActive: string;
  children?: Child[];
  role?: 'doctor' | 'parent';
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  diseases: string[];
  recommendedAges: string[];
  doseCount: number;
  catchupAges?: string[];
  sideEffects?: string[];
  contraindications?: string[];
  image?: string;
}

export interface VaccineDose {
  id: string;
  vaccineId: string;
  doseNumber: number;
  dateAdministered?: string;
  administeredBy?: string;
  notes?: string;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  headCircumference?: number;
  bloodGroup?: string;
  allergies?: string[];
  medicalConditions?: string[];
  parentId?: string;
  vaccineHistory: VaccineDose[];
}

export interface VaccineSchedule {
  id: string;
  name: string;
  description: string;
  recommendedVaccines: {
    ageRange: string;
    vaccines: string[];
  }[];
}

export interface DrugInformation {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  dosages: {
    ageRange: string;
    weightRange?: string;
    dose: string;
    frequency: string;
    route: string;
    maxDose?: string;
    notes?: string;
  }[];
  interactions?: string[];
  warnings?: string[];
  image?: string;
}

export interface ClinicalParameter {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  normalRanges: {
    ageRange: string;
    gender?: 'male' | 'female' | 'all';
    weightRange?: string;
    minValue: number;
    maxValue: number;
    notes?: string;
  }[];
  interpretations?: {
    condition: string;
    range: string;
    interpretation: string;
  }[];
  image?: string;
}

export interface ClinicalCategory {
  id: string;
  name: string;
  description: string;
  parameters: string[]; // IDs of clinical parameters in this category
  icon: string;
} 