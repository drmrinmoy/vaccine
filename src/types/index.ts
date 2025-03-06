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