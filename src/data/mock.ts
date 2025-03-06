import { Recipe, MealPlan, NutritionTip, Achievement, UserProfile, Vaccine, Child, VaccineSchedule, VaccineDose } from '@/types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Rainbow Veggie Paratha',
    description: 'Colorful whole wheat flatbread stuffed with mixed vegetables',
    image: '/images/recipes/paratha.jpg',
    prepTime: '20 mins',
    cookTime: '15 mins',
    servings: 4,
    calories: 250,
    nutrition: {
      protein: 6,
      carbs: 30,
      fats: 8,
      fiber: 4
    },
    ingredients: [
      '2 cups whole wheat flour',
      '1 cup mixed grated vegetables (carrot, beetroot, spinach)',
      'Salt to taste',
      'Spices as needed'
    ],
    steps: [
      'Mix flour with vegetables',
      'Knead into soft dough',
      'Roll into flatbreads',
      'Cook on griddle'
    ],
    ageGroup: ['4-6', '7-9', '10-12'],
    region: ['North India'],
    tags: ['breakfast', 'lunch', 'healthy', 'vegetarian'],
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Magic Masala Dosa',
    description: 'Crispy rice and lentil crepe with colorful vegetable filling',
    image: '/images/recipes/dosa.jpg',
    prepTime: '30 mins',
    cookTime: '20 mins',
    servings: 6,
    calories: 180,
    nutrition: {
      protein: 5,
      carbs: 25,
      fats: 6,
      fiber: 3
    },
    ingredients: [
      'Dosa batter',
      'Mixed vegetables',
      'Masala spices',
      'Oil for cooking'
    ],
    steps: [
      'Prepare the filling',
      'Heat griddle',
      'Spread batter in circular motion',
      'Add filling and fold'
    ],
    ageGroup: ['4-6', '7-9', '10-12'],
    region: ['South India'],
    tags: ['breakfast', 'dinner', 'crispy', 'vegetarian'],
    rating: 4.8,
    reviews: 156
  }
];

export const mockNutritionTips: NutritionTip[] = [
  {
    id: '1',
    title: 'Colorful Plate Rule',
    content: 'Make your plate as colorful as a rainbow! Different colored fruits and vegetables provide different nutrients.',
    category: 'General',
    ageGroup: ['4-6', '7-9', '10-12'],
    image: '/images/tips/rainbow-plate.jpg'
  },
  {
    id: '2',
    title: 'Protein Power Heroes',
    content: 'Discover protein-rich foods that help you grow strong like your favorite superheroes!',
    category: 'Protein',
    ageGroup: ['7-9', '10-12'],
    image: '/images/tips/protein-heroes.jpg'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Veggie Explorer',
    description: 'Try 5 different vegetables this week',
    icon: '🥕',
    progress: 3,
    total: 5,
    unlocked: false
  },
  {
    id: '2',
    name: 'Breakfast Champion',
    description: 'Eat healthy breakfast for 7 days straight',
    icon: '🌅',
    progress: 7,
    total: 7,
    unlocked: true
  }
];

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Vasu',
  age: 8,
  region: 'Maharashtra',
  dietaryPreferences: ['Vegetarian'],
  allergies: ['Peanuts'],
  favoriteRecipes: ['1', '2'],
  achievements: mockAchievements,
  streakDays: 7,
  lastActive: new Date().toISOString(),
  role: 'parent'
};

export const mockDoctorProfile: UserProfile = {
  id: '2',
  name: 'Dr. Sharma',
  age: 42,
  region: 'Delhi',
  dietaryPreferences: [],
  allergies: [],
  favoriteRecipes: [],
  achievements: [],
  streakDays: 0,
  lastActive: new Date().toISOString(),
  role: 'doctor',
  children: [] // Will be populated with children under doctor's care
};

export const mockMealPlan: MealPlan = {
  id: '1',
  name: 'Energetic Week Plan',
  description: 'A balanced meal plan for active kids',
  ageGroup: '7-9',
  region: 'Maharashtra',
  days: [
    {
      day: 'Monday',
      meals: [
        {
          type: 'breakfast',
          recipe: mockRecipes[0],
          time: '8:00 AM'
        },
        {
          type: 'lunch',
          recipe: mockRecipes[1],
          time: '1:00 PM'
        }
      ]
    }
  ]
};

// Mock data for vaccines based on National Immunization Schedule (NIS) of India
export const mockVaccines: Vaccine[] = [
  {
    id: 'v1',
    name: 'BCG',
    description: 'Bacillus Calmette-Guerin vaccine protects against tuberculosis',
    diseases: ['Tuberculosis'],
    recommendedAges: ['At birth'],
    doseCount: 1,
    sideEffects: ['Mild fever', 'Small red sore at injection site'],
    image: '/images/vaccines/bcg.jpg'
  },
  {
    id: 'v2',
    name: 'OPV',
    description: 'Oral Polio Vaccine protects against poliomyelitis',
    diseases: ['Polio'],
    recommendedAges: ['At birth', '6 weeks', '10 weeks', '14 weeks'],
    doseCount: 5,
    catchupAges: ['Up to 5 years'],
    sideEffects: ['Rarely causes any side effects'],
    image: '/images/vaccines/opv.jpg'
  },
  {
    id: 'v3',
    name: 'Hepatitis B',
    description: 'Protects against Hepatitis B virus infection',
    diseases: ['Hepatitis B'],
    recommendedAges: ['At birth', '6 weeks', '10 weeks', '14 weeks'],
    doseCount: 4,
    catchupAges: ['Up to 18 years'],
    sideEffects: ['Pain at injection site', 'Mild fever'],
    image: '/images/vaccines/hepb.jpg'
  },
  {
    id: 'v4',
    name: 'DPT',
    description: 'Combined vaccine protecting against Diphtheria, Pertussis (whooping cough), and Tetanus',
    diseases: ['Diphtheria', 'Pertussis', 'Tetanus'],
    recommendedAges: ['6 weeks', '10 weeks', '14 weeks', '16-24 months', '5-6 years'],
    doseCount: 5,
    catchupAges: ['Up to 7 years'],
    sideEffects: ['Fever', 'Pain and swelling at injection site', 'Irritability'],
    image: '/images/vaccines/dpt.jpg'
  },
  {
    id: 'v5',
    name: 'Hib',
    description: 'Protects against Haemophilus influenzae type b bacteria',
    diseases: ['Pneumonia', 'Meningitis'],
    recommendedAges: ['6 weeks', '10 weeks', '14 weeks'],
    doseCount: 3,
    catchupAges: ['Up to 5 years'],
    sideEffects: ['Redness at injection site', 'Fever'],
    image: '/images/vaccines/hib.jpg'
  },
  {
    id: 'v6',
    name: 'Rotavirus',
    description: 'Protects against rotavirus infections which cause severe diarrhea',
    diseases: ['Rotavirus gastroenteritis'],
    recommendedAges: ['6 weeks', '10 weeks', '14 weeks'],
    doseCount: 3,
    catchupAges: ['Up to 8 months'],
    sideEffects: ['Mild diarrhea', 'Vomiting', 'Irritability'],
    image: '/images/vaccines/rotavirus.jpg'
  },
  {
    id: 'v7',
    name: 'PCV',
    description: 'Pneumococcal Conjugate Vaccine protects against pneumococcal infections',
    diseases: ['Pneumonia', 'Meningitis', 'Ear infections'],
    recommendedAges: ['6 weeks', '10 weeks', '14 weeks', '12-15 months'],
    doseCount: 4,
    catchupAges: ['Up to 5 years'],
    sideEffects: ['Pain at injection site', 'Mild fever', 'Irritability'],
    image: '/images/vaccines/pcv.jpg'
  },
  {
    id: 'v8',
    name: 'IPV',
    description: 'Inactivated Polio Vaccine provides additional protection against polio',
    diseases: ['Polio'],
    recommendedAges: ['6 weeks', '14 weeks'],
    doseCount: 2,
    catchupAges: ['Up to 5 years'],
    sideEffects: ['Pain at injection site', 'Irritability'],
    image: '/images/vaccines/ipv.jpg'
  },
  {
    id: 'v9',
    name: 'Measles',
    description: 'Protects against measles virus infection',
    diseases: ['Measles'],
    recommendedAges: ['9-12 months'],
    doseCount: 1,
    catchupAges: ['Up to 5 years'],
    sideEffects: ['Fever', 'Rash', 'Runny nose'],
    image: '/images/vaccines/measles.jpg'
  },
  {
    id: 'v10',
    name: 'MMR',
    description: 'Combined vaccine protecting against Measles, Mumps, and Rubella',
    diseases: ['Measles', 'Mumps', 'Rubella'],
    recommendedAges: ['16-24 months', '5-6 years'],
    doseCount: 2,
    catchupAges: ['Up to 18 years'],
    sideEffects: ['Fever', 'Rash', 'Swollen glands'],
    image: '/images/vaccines/mmr.jpg'
  },
  {
    id: 'v11',
    name: 'JE',
    description: 'Japanese Encephalitis vaccine protects against JE virus',
    diseases: ['Japanese Encephalitis'],
    recommendedAges: ['12-15 months', '16-24 months'],
    doseCount: 2,
    catchupAges: ['Up to 15 years'],
    sideEffects: ['Fever', 'Headache', 'Muscle pain'],
    image: '/images/vaccines/je.jpg'
  },
  {
    id: 'v12',
    name: 'Typhoid',
    description: 'Protects against typhoid fever caused by Salmonella Typhi',
    diseases: ['Typhoid fever'],
    recommendedAges: ['2 years and above'],
    doseCount: 1,
    catchupAges: ['Up to 18 years'],
    sideEffects: ['Pain at injection site', 'Fever', 'Headache'],
    image: '/images/vaccines/typhoid.jpg'
  }
];

// Mock vaccine schedule based on NIS India
export const mockVaccineSchedule: VaccineSchedule = {
  id: 'vs1',
  name: 'National Immunization Schedule (NIS) India',
  description: 'Standard immunization schedule recommended for children in India',
  recommendedVaccines: [
    {
      ageRange: 'At birth',
      vaccines: ['v1', 'v2', 'v3'] // BCG, OPV, Hepatitis B
    },
    {
      ageRange: '6 weeks',
      vaccines: ['v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'] // OPV, Hep B, DPT, Hib, Rotavirus, PCV, IPV
    },
    {
      ageRange: '10 weeks',
      vaccines: ['v2', 'v3', 'v4', 'v5', 'v6', 'v7'] // OPV, Hep B, DPT, Hib, Rotavirus, PCV
    },
    {
      ageRange: '14 weeks',
      vaccines: ['v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'] // OPV, Hep B, DPT, Hib, Rotavirus, PCV, IPV
    },
    {
      ageRange: '9-12 months',
      vaccines: ['v9'] // Measles
    },
    {
      ageRange: '12-15 months',
      vaccines: ['v7', 'v11'] // PCV booster, JE 1st dose
    },
    {
      ageRange: '16-24 months',
      vaccines: ['v4', 'v10', 'v11'] // DPT booster, MMR, JE 2nd dose
    },
    {
      ageRange: '5-6 years',
      vaccines: ['v4', 'v10'] // DPT booster, MMR
    },
    {
      ageRange: '10-16 years',
      vaccines: ['v12'] // Typhoid
    }
  ]
};

// Mock children data
export const mockChildren: Child[] = [
  {
    id: 'c1',
    name: 'Arjun Sharma',
    dateOfBirth: '2022-05-15',
    gender: 'male',
    weight: 12.5,
    height: 85,
    headCircumference: 48.2,
    bloodGroup: 'O+',
    allergies: [],
    medicalConditions: [],
    parentId: '1',
    vaccineHistory: [
      {
        id: 'vd1',
        vaccineId: 'v1',
        doseNumber: 1,
        dateAdministered: '2022-05-15',
        administeredBy: 'Dr. Sharma',
        notes: 'No adverse reactions'
      },
      {
        id: 'vd2',
        vaccineId: 'v2',
        doseNumber: 1,
        dateAdministered: '2022-05-15',
        administeredBy: 'Dr. Sharma',
        notes: 'No adverse reactions'
      },
      {
        id: 'vd3',
        vaccineId: 'v3',
        doseNumber: 1,
        dateAdministered: '2022-05-15',
        administeredBy: 'Dr. Sharma',
        notes: 'No adverse reactions'
      }
    ]
  },
  {
    id: 'c2',
    name: 'Meera Patel',
    dateOfBirth: '2021-11-03',
    gender: 'female',
    weight: 15.2,
    height: 92,
    headCircumference: 49.5,
    bloodGroup: 'A+',
    allergies: ['Penicillin'],
    medicalConditions: [],
    parentId: '1',
    vaccineHistory: [
      {
        id: 'vd4',
        vaccineId: 'v1',
        doseNumber: 1,
        dateAdministered: '2021-11-03',
        administeredBy: 'Dr. Sharma',
        notes: 'No adverse reactions'
      },
      {
        id: 'vd5',
        vaccineId: 'v2',
        doseNumber: 1,
        dateAdministered: '2021-11-03',
        administeredBy: 'Dr. Sharma',
        notes: 'No adverse reactions'
      }
    ]
  }
]; 