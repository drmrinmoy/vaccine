import { Recipe, MealPlan, NutritionTip, Achievement, UserProfile, Vaccine, Child, VaccineSchedule, DrugInformation, ClinicalParameter, ClinicalCategory, Patient, Procedure, SurgicalSchedule, SurgicalGuideline } from '@/types';

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

export const mockUserProfile = {
  id: 'user1',
  name: 'Parent Account',
  email: 'parent@example.com',
  role: 'parent',
  created: '2023-01-15',
  settings: {
    darkMode: true,
    notifications: true,
    language: 'en',
  }
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
  },
  {
    id: 'v13',
    name: 'Influenza',
    description: 'Protects against seasonal influenza (flu)',
    diseases: ['Influenza'],
    recommendedAges: ['6 weeks', '6 months', '12 months', 'Yearly'],
    doseCount: 2,
    sideEffects: ['Soreness at injection site', 'Low-grade fever', 'Muscle aches'],
    image: '/images/vaccines/influenza.jpg'
  },
  {
    id: 'v14',
    name: 'Hepatitis A',
    description: 'Protects against Hepatitis A virus infection',
    diseases: ['Hepatitis A'],
    recommendedAges: ['12 months', '18 months'],
    doseCount: 2,
    sideEffects: ['Pain at injection site', 'Mild fever', 'Headache'],
    image: '/images/vaccines/hepa.jpg'
  },
  {
    id: 'v15',
    name: 'Varicella',
    description: 'Protects against chickenpox',
    diseases: ['Varicella (Chickenpox)'],
    recommendedAges: ['15 months', '4-6 years'],
    doseCount: 2,
    sideEffects: ['Soreness at injection site', 'Mild rash', 'Fever'],
    image: '/images/vaccines/varicella.jpg'
  },
  {
    id: 'v16',
    name: 'HPV',
    description: 'Protects against human papillomavirus, which can cause cervical cancer and other cancers',
    diseases: ['HPV', 'Cervical Cancer'],
    recommendedAges: ['9-14 years'],
    doseCount: 2,
    sideEffects: ['Pain at injection site', 'Swelling', 'Headache'],
    image: '/images/vaccines/hpv.jpg'
  },
  {
    id: 'v17',
    name: 'Tdap',
    description: 'Booster for tetanus, diphtheria, and acellular pertussis',
    diseases: ['Tetanus', 'Diphtheria', 'Pertussis'],
    recommendedAges: ['10-12 years', '16 years'],
    doseCount: 2,
    sideEffects: ['Pain at injection site', 'Headache', 'Fatigue'],
    image: '/images/vaccines/tdap.jpg'
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

// Mock IAP vaccine schedule (Indian Academy of Pediatrics)
export const mockIAPVaccineSchedule: VaccineSchedule = {
  id: 'vs2',
  name: 'IAP Immunization Schedule',
  description: 'Immunization schedule recommended by the Indian Academy of Pediatrics (IAP)',
  recommendedVaccines: [
    {
      ageRange: 'At birth',
      vaccines: ['v1', 'v2', 'v3'] // BCG, OPV, Hepatitis B
    },
    {
      ageRange: '6 weeks',
      vaccines: ['v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v13'] // OPV, Hep B, DPT, Hib, Rotavirus, PCV, IPV, Influenza
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
      ageRange: '6 months',
      vaccines: ['v13'] // Influenza
    },
    {
      ageRange: '9 months',
      vaccines: ['v9', 'v11'] // Measles, JE 1st dose
    },
    {
      ageRange: '12 months',
      vaccines: ['v7', 'v10', 'v13', 'v14'] // PCV booster, MMR, Influenza, Hepatitis A
    },
    {
      ageRange: '15 months',
      vaccines: ['v15'] // Varicella
    },
    {
      ageRange: '16-18 months',
      vaccines: ['v4', 'v2', 'v8'] // DPT booster, OPV booster, IPV booster
    },
    {
      ageRange: '18 months',
      vaccines: ['v14'] // Hepatitis A 2nd dose
    },
    {
      ageRange: '2 years',
      vaccines: ['v12'] // Typhoid
    },
    {
      ageRange: '4-6 years',
      vaccines: ['v4', 'v10', 'v15'] // DPT booster, MMR booster, Varicella booster
    },
    {
      ageRange: '9-14 years',
      vaccines: ['v16'] // HPV (2 doses)
    },
    {
      ageRange: '10-12 years',
      vaccines: ['v12', 'v17'] // Typhoid booster, Tdap
    },
    {
      ageRange: '16 years',
      vaccines: ['v17'] // Tdap booster
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

// Mock data for drug information
export const mockDrugInformation: DrugInformation[] = [
  {
    id: 'd1',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    description: 'A penicillin antibiotic that fights bacteria in your body. Used to treat many different types of infection.',
    indications: ['Respiratory tract infections', 'Ear infections', 'Urinary tract infections', 'Skin infections'],
    contraindications: ['Allergy to penicillin', 'Mononucleosis'],
    sideEffects: ['Diarrhea', 'Stomach upset', 'Vomiting', 'Rash'],
    dosages: [
      {
        ageRange: '0-3 months',
        dose: '20-30 mg/kg/day',
        frequency: 'divided every 12 hours',
        route: 'oral',
        maxDose: '30 mg/kg/day',
      },
      {
        ageRange: '4 months-18 years',
        dose: '25-45 mg/kg/day',
        frequency: 'divided every 8-12 hours',
        route: 'oral',
        maxDose: '90 mg/kg/day',
      }
    ],
    interactions: ['Probenecid', 'Allopurinol', 'Oral contraceptives'],
    warnings: ['May reduce efficacy of oral contraceptives', 'May cause Clostridium difficile-associated diarrhea']
  },
  {
    id: 'd2',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesics/Antipyretics',
    description: 'Used to treat mild to moderate pain and fever. It has little anti-inflammatory effect.',
    indications: ['Fever', 'Mild to moderate pain', 'Headache', 'Toothache'],
    contraindications: ['Severe liver disease', 'Known hypersensitivity'],
    sideEffects: ['Nausea', 'Rash', 'Liver damage (with overdose)'],
    dosages: [
      {
        ageRange: '0-3 months',
        weightRange: '<5kg',
        dose: '10-15 mg/kg',
        frequency: 'every 6-8 hours as needed',
        route: 'oral',
        maxDose: '60 mg/kg/day',
      },
      {
        ageRange: '3 months-12 years',
        dose: '10-15 mg/kg',
        frequency: 'every 4-6 hours as needed',
        route: 'oral',
        maxDose: '75 mg/kg/day not to exceed 4000 mg/day',
        notes: 'Maximum of 5 doses in 24 hours'
      },
      {
        ageRange: '>12 years',
        dose: '325-650 mg',
        frequency: 'every 4-6 hours as needed',
        route: 'oral',
        maxDose: '4000 mg/day',
        notes: 'Maximum of 5 doses in 24 hours'
      }
    ],
    warnings: ['Avoid alcohol', 'Chronic use may cause liver damage', 'Do not exceed recommended dose']
  },
  {
    id: 'd3',
    name: 'Salbutamol',
    genericName: 'Albuterol',
    category: 'Bronchodilators',
    description: 'A bronchodilator that relaxes muscles in the airways and increases air flow to the lungs.',
    indications: ['Asthma', 'Bronchospasm', 'Exercise-induced bronchoconstriction'],
    contraindications: ['Hypersensitivity to albuterol'],
    sideEffects: ['Tremor', 'Nervousness', 'Headache', 'Tachycardia'],
    dosages: [
      {
        ageRange: '<4 years',
        dose: '0.1-0.15 mg/kg/dose',
        frequency: 'every 4-6 hours as needed',
        route: 'nebulization',
        maxDose: '2.5 mg/dose',
      },
      {
        ageRange: '4-11 years',
        dose: '2.5 mg/dose',
        frequency: 'every 4-6 hours as needed',
        route: 'nebulization',
        maxDose: '2.5 mg/dose',
      },
      {
        ageRange: '>12 years',
        dose: '2.5-5 mg/dose',
        frequency: 'every 4-6 hours as needed',
        route: 'nebulization',
        maxDose: '5 mg/dose',
      }
    ],
    warnings: ['May worsen cardiac conditions', 'Excessive use may lead to tolerance']
  }
];

// Mock data for clinical parameters
export const mockClinicalParameters: ClinicalParameter[] = [
  {
    id: 'cp1',
    name: 'Hemoglobin',
    category: 'Hematology',
    description: 'Protein in red blood cells that carries oxygen throughout the body',
    unit: 'g/dL',
    normalRanges: [
      {
        ageRange: 'Newborn',
        gender: 'all',
        minValue: 14.0,
        maxValue: 24.0
      },
      {
        ageRange: '1 month',
        gender: 'all',
        minValue: 10.0,
        maxValue: 20.0
      },
      {
        ageRange: '2-6 months',
        gender: 'all',
        minValue: 10.0,
        maxValue: 17.0
      },
      {
        ageRange: '6 months-2 years',
        gender: 'all',
        minValue: 10.5,
        maxValue: 13.5
      },
      {
        ageRange: '2-12 years',
        gender: 'all',
        minValue: 11.5,
        maxValue: 15.5
      },
      {
        ageRange: '12-18 years',
        gender: 'male',
        minValue: 13.0,
        maxValue: 16.0
      },
      {
        ageRange: '12-18 years',
        gender: 'female',
        minValue: 12.0,
        maxValue: 16.0
      }
    ],
    interpretations: [
      {
        condition: 'Anemia',
        range: 'Below normal range',
        interpretation: 'May indicate iron deficiency, chronic disease, or blood loss.'
      },
      {
        condition: 'Polycythemia',
        range: 'Above normal range',
        interpretation: 'May indicate dehydration, lung disease, or polycythemia vera.'
      }
    ]
  },
  {
    id: 'cp2',
    name: 'White Blood Cell Count',
    category: 'Hematology',
    description: 'Number of white blood cells that help the body fight infection',
    unit: 'cells/mcL',
    normalRanges: [
      {
        ageRange: 'Newborn',
        gender: 'all',
        minValue: 9000,
        maxValue: 30000
      },
      {
        ageRange: '1 month',
        gender: 'all',
        minValue: 5000,
        maxValue: 21000
      },
      {
        ageRange: '1-3 years',
        gender: 'all',
        minValue: 6000,
        maxValue: 17500
      },
      {
        ageRange: '4-7 years',
        gender: 'all',
        minValue: 5500,
        maxValue: 15500
      },
      {
        ageRange: '8-13 years',
        gender: 'all',
        minValue: 4500,
        maxValue: 13500
      },
      {
        ageRange: '14-18 years',
        gender: 'all',
        minValue: 4500,
        maxValue: 11000
      }
    ],
    interpretations: [
      {
        condition: 'Leukopenia',
        range: 'Below normal range',
        interpretation: 'May indicate bone marrow suppression, viral infection, or certain medications.'
      },
      {
        condition: 'Leukocytosis',
        range: 'Above normal range',
        interpretation: 'May indicate bacterial infection, inflammation, or leukemia.'
      }
    ]
  },
  {
    id: 'cp3',
    name: 'Blood Glucose (Fasting)',
    category: 'Biochemistry',
    description: 'Level of glucose in the blood after fasting for at least 8 hours',
    unit: 'mg/dL',
    normalRanges: [
      {
        ageRange: 'All pediatric ages',
        gender: 'all',
        minValue: 70,
        maxValue: 100
      }
    ],
    interpretations: [
      {
        condition: 'Hypoglycemia',
        range: '<70 mg/dL',
        interpretation: 'Low blood sugar may indicate excess insulin, medication effects, or metabolic disorders.'
      },
      {
        condition: 'Prediabetes',
        range: '100-125 mg/dL',
        interpretation: 'Impaired fasting glucose indicates increased risk for developing diabetes.'
      },
      {
        condition: 'Diabetes',
        range: '≥126 mg/dL',
        interpretation: 'High fasting glucose may indicate diabetes when confirmed with repeat testing.'
      }
    ]
  },
  {
    id: 'cp4',
    name: 'Blood Pressure (Systolic/Diastolic)',
    category: 'Vital Signs',
    description: 'Pressure of blood against the walls of arteries',
    unit: 'mmHg',
    normalRanges: [
      {
        ageRange: 'Newborn-3 months',
        gender: 'all',
        minValue: 65,
        maxValue: 85,
        notes: 'Systolic, 45-55 mmHg Diastolic'
      },
      {
        ageRange: '3-6 months',
        gender: 'all',
        minValue: 70,
        maxValue: 90,
        notes: 'Systolic, 50-65 mmHg Diastolic'
      },
      {
        ageRange: '6-12 months',
        gender: 'all',
        minValue: 80,
        maxValue: 100,
        notes: 'Systolic, 55-65 mmHg Diastolic'
      },
      {
        ageRange: '1-3 years',
        gender: 'all',
        minValue: 90,
        maxValue: 105,
        notes: 'Systolic, 55-70 mmHg Diastolic'
      },
      {
        ageRange: '3-6 years',
        gender: 'all',
        minValue: 95,
        maxValue: 110,
        notes: 'Systolic, 60-75 mmHg Diastolic'
      },
      {
        ageRange: '6-12 years',
        gender: 'all',
        minValue: 100,
        maxValue: 120,
        notes: 'Systolic, 60-75 mmHg Diastolic'
      },
      {
        ageRange: '12-18 years',
        gender: 'all',
        minValue: 110,
        maxValue: 120,
        notes: 'Systolic, 65-80 mmHg Diastolic'
      }
    ],
    interpretations: [
      {
        condition: 'Hypotension',
        range: 'Below normal range',
        interpretation: 'Low blood pressure may indicate dehydration, blood loss, or shock.'
      },
      {
        condition: 'Prehypertension',
        range: '90-95th percentile for age, gender, and height',
        interpretation: 'Indicates increased risk for developing hypertension.'
      },
      {
        condition: 'Hypertension',
        range: '≥95th percentile for age, gender, and height',
        interpretation: 'High blood pressure may indicate renal disease, endocrine disorders, or essential hypertension.'
      }
    ]
  }
];

// Mock data for clinical categories
export const mockClinicalCategories: ClinicalCategory[] = [
  {
    id: 'cc1',
    name: 'Hematology',
    description: 'Blood cell and component parameters',
    parameters: ['cp1', 'cp2'],
    icon: '🩸'
  },
  {
    id: 'cc2',
    name: 'Biochemistry',
    description: 'Chemical components in blood and body fluids',
    parameters: ['cp3'],
    icon: '🧪'
  },
  {
    id: 'cc3',
    name: 'Vital Signs',
    description: 'Essential body measurements',
    parameters: ['cp4'],
    icon: '📊'
  },
  {
    id: 'cc4',
    name: 'Antibiotics',
    description: 'Medications that combat bacterial infections',
    parameters: [],
    icon: '💊'
  },
  {
    id: 'cc5',
    name: 'Analgesics',
    description: 'Pain relievers and fever reducers',
    parameters: [],
    icon: '🌡️'
  },
  {
    id: 'cc6',
    name: 'Respiratory Medications',
    description: 'Medications for respiratory conditions',
    parameters: [],
    icon: '🫁'
  }
];

// Add drugs to their respective categories
mockClinicalCategories.find(cat => cat.id === 'cc4')!.parameters.push('d1');
mockClinicalCategories.find(cat => cat.id === 'cc5')!.parameters.push('d2');
mockClinicalCategories.find(cat => cat.id === 'cc6')!.parameters.push('d3');

// Mock Surgical Data
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'John Smith',
    dateOfBirth: '1985-07-15',
    gender: 'Male',
    weight: 78.5,
    height: 182,
    bloodPressure: '120/80',
    bloodGroup: 'A+',
    procedureHistory: [
      {
        id: 'proc1',
        procedureId: 'proc001',
        status: 'Completed',
        datePerformed: '2022-04-12',
        surgeon: 'Dr. Wilson',
        location: 'General Hospital',
        notes: 'Uncomplicated appendectomy'
      },
      {
        id: 'proc2',
        procedureId: 'proc005',
        status: 'Scheduled',
        dateScheduled: '2023-06-15',
        surgeon: 'Dr. Johnson',
        location: 'Memorial Hospital',
        notes: 'Elective procedure, patient cleared by cardiology'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Emily Johnson',
    dateOfBirth: '1990-03-22',
    gender: 'Female',
    weight: 65.2,
    height: 168,
    bloodPressure: '110/70',
    bloodGroup: 'O+',
    procedureHistory: [
      {
        id: 'proc3',
        procedureId: 'proc002',
        status: 'Completed',
        datePerformed: '2021-08-30',
        surgeon: 'Dr. Martinez',
        location: 'University Medical Center',
        notes: 'Laparoscopic cholecystectomy with minimal blood loss'
      }
    ]
  },
  {
    id: 'p3',
    name: 'Michael Davis',
    dateOfBirth: '1975-11-08',
    gender: 'Male',
    weight: 92.1,
    height: 188,
    bloodPressure: '135/85',
    bloodGroup: 'B-',
    procedureHistory: []
  }
];

export const mockProcedures: Procedure[] = [
  {
    id: 'proc001',
    name: 'Appendectomy',
    category: 'Abdominal',
    description: 'Surgical removal of the appendix',
    estimatedDuration: 60,
    requiresGeneralAnesthesia: true,
    commonComplications: ['Infection', 'Bleeding', 'Adhesions'],
    recoveryTime: '2-4 weeks',
    preOpInstructions: [
      'Nothing to eat or drink 8 hours before surgery',
      'Shower with antibacterial soap the night before'
    ],
    postOpInstructions: [
      'Limit physical activity for 2 weeks',
      'Keep incision clean and dry',
      'Follow up in 10-14 days for suture removal'
    ]
  },
  {
    id: 'proc002',
    name: 'Cholecystectomy',
    category: 'Abdominal',
    description: 'Surgical removal of the gallbladder',
    estimatedDuration: 90,
    requiresGeneralAnesthesia: true,
    commonComplications: ['Bile leak', 'Injury to bile duct', 'Infection'],
    recoveryTime: '1-2 weeks',
    preOpInstructions: [
      'Nothing to eat or drink 8 hours before surgery',
      'Stop certain medications as directed'
    ],
    postOpInstructions: [
      'Low-fat diet initially',
      'Gradually increase activity',
      'Follow up in 2 weeks'
    ]
  },
  {
    id: 'proc003',
    name: 'Hernia Repair',
    category: 'Abdominal',
    description: 'Repair of a hernia using mesh or suture',
    estimatedDuration: 75,
    requiresGeneralAnesthesia: true,
    commonComplications: ['Recurrence', 'Chronic pain', 'Infection'],
    recoveryTime: '3-6 weeks',
    preOpInstructions: [
      'Nothing to eat or drink 8 hours before surgery',
      'Arrange for someone to drive you home'
    ],
    postOpInstructions: [
      'No heavy lifting for 6 weeks',
      'Use pillow when coughing',
      'Follow up in 2 weeks'
    ]
  },
  {
    id: 'proc004',
    name: 'Thyroidectomy',
    category: 'Endocrine',
    description: 'Removal of all or part of the thyroid gland',
    estimatedDuration: 120,
    requiresGeneralAnesthesia: true,
    commonComplications: ['Hypocalcemia', 'Recurrent laryngeal nerve injury', 'Bleeding'],
    recoveryTime: '1-2 weeks',
    preOpInstructions: [
      'Nothing to eat or drink 8 hours before surgery',
      'Stop blood thinners as directed'
    ],
    postOpInstructions: [
      'Voice rest as directed',
      'Monitor for signs of hypocalcemia',
      'Follow up in 1 week'
    ]
  },
  {
    id: 'proc005',
    name: 'Laparoscopic Gastric Bypass',
    category: 'Bariatric',
    description: 'Creation of a small gastric pouch and bypass of the proximal small intestine',
    estimatedDuration: 180,
    requiresGeneralAnesthesia: true,
    commonComplications: ['Leak', 'Stricture', 'Nutritional deficiencies'],
    recoveryTime: '2-4 weeks',
    preOpInstructions: [
      'Follow pre-op diet strictly',
      'Stop smoking at least 6 weeks before surgery'
    ],
    postOpInstructions: [
      'Follow staged diet progression',
      'Take vitamins as prescribed',
      'Follow up at 1 week, 1 month, and 3 months'
    ]
  }
];

export const mockSurgicalSchedule: SurgicalSchedule = {
  id: 'sch1',
  name: 'Standard Surgical Schedule',
  procedures: [
    {
      procedureId: 'proc001',
      name: 'Appendectomy',
      ageInMonths: 0,
      recommended: true
    },
    {
      procedureId: 'proc002',
      name: 'Cholecystectomy',
      ageInMonths: 0,
      recommended: true
    },
    {
      procedureId: 'proc003',
      name: 'Hernia Repair',
      ageInMonths: 0,
      recommended: true
    },
    {
      procedureId: 'proc004',
      name: 'Thyroidectomy',
      ageInMonths: 0,
      recommended: false
    },
    {
      procedureId: 'proc005',
      name: 'Laparoscopic Gastric Bypass',
      ageInMonths: 0,
      recommended: false
    }
  ]
};

export const mockSurgicalGuidelines: SurgicalGuideline[] = [
  {
    id: 'guide1',
    title: 'Pre-operative Antibiotic Prophylaxis',
    content: 'Administer antibiotics within 60 minutes before surgical incision. For most procedures, cefazolin is the first-line agent.',
    category: 'Infection Prevention',
    tags: ['antibiotics', 'prevention', 'pre-op'],
    source: 'American College of Surgeons',
    lastUpdated: '2023-01-15'
  },
  {
    id: 'guide2',
    title: 'Enhanced Recovery After Surgery (ERAS)',
    content: 'Implement multimodal perioperative care pathways designed to achieve early recovery for patients undergoing major surgery.',
    category: 'Post-operative Care',
    tags: ['recovery', 'protocols', 'post-op'],
    source: 'ERAS Society',
    lastUpdated: '2022-11-03'
  },
  {
    id: 'guide3',
    title: 'Venous Thromboembolism Prophylaxis',
    content: 'Risk assessment should be performed for all surgical patients. Mechanical and/or pharmacological prophylaxis should be used based on risk level.',
    category: 'Complication Prevention',
    tags: ['VTE', 'prevention', 'anticoagulation'],
    source: 'American Society of Hematology',
    lastUpdated: '2023-02-20'
  }
];

// National Immunization Schedule Data
export const vaccineSchedule = [
  { id: 'bcg', name: 'BCG', scheduledAt: 'birth', description: 'Protects against tuberculosis' },
  { id: 'hepb0', name: 'Hepatitis B - Birth dose', scheduledAt: 'birth', description: 'First dose for preventing Hepatitis B' },
  { id: 'opv0', name: 'OPV - Birth dose', scheduledAt: 'birth', description: 'Zero dose for polio protection' },
  { id: 'opv1', name: 'OPV 1', scheduledAt: '6 weeks', description: 'First primary dose for polio' },
  { id: 'penta1', name: 'Pentavalent 1', scheduledAt: '6 weeks', description: 'Protects against diphtheria, pertussis, tetanus, Hib, and hepatitis B' },
  { id: 'rota1', name: 'Rotavirus 1', scheduledAt: '6 weeks', description: 'Protects against rotavirus diarrhea' },
  { id: 'pcv1', name: 'PCV 1', scheduledAt: '6 weeks', description: 'Protects against pneumococcal diseases' },
  { id: 'opv2', name: 'OPV 2', scheduledAt: '10 weeks', description: 'Second primary dose for polio' },
  { id: 'penta2', name: 'Pentavalent 2', scheduledAt: '10 weeks', description: 'Second dose of the 5-in-1 vaccine' },
  { id: 'rota2', name: 'Rotavirus 2', scheduledAt: '10 weeks', description: 'Second dose against rotavirus' },
  { id: 'pcv2', name: 'PCV 2', scheduledAt: '10 weeks', description: 'Second dose against pneumococcal diseases' },
  { id: 'opv3', name: 'OPV 3', scheduledAt: '14 weeks', description: 'Third primary dose for polio' },
  { id: 'penta3', name: 'Pentavalent 3', scheduledAt: '14 weeks', description: 'Final primary dose of the 5-in-1 vaccine' },
  { id: 'rota3', name: 'Rotavirus 3', scheduledAt: '14 weeks', description: 'Final dose against rotavirus' },
  { id: 'pcv3', name: 'PCV 3', scheduledAt: '14 weeks', description: 'Final primary dose against pneumococcal diseases' },
  { id: 'ipv', name: 'IPV', scheduledAt: '14 weeks', description: 'Inactivated polio vaccine dose' },
  { id: 'mr1', name: 'MR 1', scheduledAt: '9 months', description: 'First dose against measles and rubella' },
  { id: 'je1', name: 'JE 1', scheduledAt: '9 months', description: 'First dose against Japanese encephalitis' },
  { id: 'vitA1', name: 'Vitamin A', scheduledAt: '9 months', description: 'First dose of Vitamin A supplementation' },
  { id: 'dpt1', name: 'DPT Booster 1', scheduledAt: '16-24 months', description: 'Booster for diphtheria, pertussis, and tetanus' },
  { id: 'mr2', name: 'MR 2', scheduledAt: '16-24 months', description: 'Second dose against measles and rubella' },
  { id: 'opvb', name: 'OPV Booster', scheduledAt: '16-24 months', description: 'Booster dose for polio' },
  { id: 'je2', name: 'JE 2', scheduledAt: '16-24 months', description: 'Second dose against Japanese encephalitis' },
  { id: 'tcv', name: 'Typhoid Conjugate Vaccine', scheduledAt: '9-12 years', description: 'Protects against typhoid fever' },
  { id: 'td', name: 'Td', scheduledAt: '10 years & 16 years', description: 'Tetanus and diphtheria booster doses' },
];

// Sample Children Data (this would typically come from the user's actual data)
export const sampleChildren = [
  {
    id: 'child1',
    name: 'Ajay Kumar',
    dateOfBirth: '2023-01-15',
    gender: 'Male' as const,
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2023-01-15', status: 'Completed' as const, completedDate: '2023-01-15' },
      { id: 'v2', name: 'Hepatitis B - Birth dose', dueDate: '2023-01-15', status: 'Completed' as const, completedDate: '2023-01-15' },
      { id: 'v3', name: 'OPV - Birth dose', dueDate: '2023-01-15', status: 'Completed' as const, completedDate: '2023-01-15' },
      { id: 'v4', name: 'OPV 1', dueDate: '2023-02-26', status: 'Completed' as const, completedDate: '2023-02-28' },
      { id: 'v5', name: 'Pentavalent 1', dueDate: '2023-02-26', status: 'Completed' as const, completedDate: '2023-02-28' },
      { id: 'v6', name: 'Rotavirus 1', dueDate: '2023-02-26', status: 'Completed' as const, completedDate: '2023-02-28' },
      { id: 'v7', name: 'PCV 1', dueDate: '2023-02-26', status: 'Completed' as const, completedDate: '2023-02-28' },
      { id: 'v8', name: 'OPV 2', dueDate: '2023-03-26', status: 'Completed' as const, completedDate: '2023-03-30' },
      { id: 'v9', name: 'Pentavalent 2', dueDate: '2023-03-26', status: 'Completed' as const, completedDate: '2023-03-30' },
      { id: 'v10', name: 'Rotavirus 2', dueDate: '2023-03-26', status: 'Due' as const },
      { id: 'v11', name: 'PCV 2', dueDate: '2023-03-26', status: 'Due' as const },
      { id: 'v12', name: 'OPV 3', dueDate: '2023-04-26', status: 'Upcoming' as const },
      { id: 'v13', name: 'Pentavalent 3', dueDate: '2023-04-26', status: 'Upcoming' as const },
      { id: 'v14', name: 'Rotavirus 3', dueDate: '2023-04-26', status: 'Upcoming' as const },
      { id: 'v15', name: 'PCV 3', dueDate: '2023-04-26', status: 'Upcoming' as const },
      { id: 'v16', name: 'IPV', dueDate: '2023-04-26', status: 'Upcoming' as const },
    ]
  },
  {
    id: 'child2',
    name: 'Priya Singh',
    dateOfBirth: '2022-05-10',
    gender: 'Female' as const,
    vaccinations: [
      { id: 'v1', name: 'BCG', dueDate: '2022-05-10', status: 'Completed' as const, completedDate: '2022-05-10' },
      { id: 'v2', name: 'Hepatitis B - Birth dose', dueDate: '2022-05-10', status: 'Completed' as const, completedDate: '2022-05-10' },
      { id: 'v3', name: 'OPV - Birth dose', dueDate: '2022-05-10', status: 'Completed' as const, completedDate: '2022-05-10' },
      { id: 'v4', name: 'OPV 1', dueDate: '2022-06-21', status: 'Completed' as const, completedDate: '2022-06-22' },
      { id: 'v5', name: 'Pentavalent 1', dueDate: '2022-06-21', status: 'Completed' as const, completedDate: '2022-06-22' },
      { id: 'v6', name: 'Rotavirus 1', dueDate: '2022-06-21', status: 'Completed' as const, completedDate: '2022-06-22' },
      { id: 'v7', name: 'PCV 1', dueDate: '2022-06-21', status: 'Completed' as const, completedDate: '2022-06-22' },
      { id: 'v8', name: 'OPV 2', dueDate: '2022-07-21', status: 'Completed' as const, completedDate: '2022-07-25' },
      { id: 'v9', name: 'Pentavalent 2', dueDate: '2022-07-21', status: 'Completed' as const, completedDate: '2022-07-25' },
      { id: 'v10', name: 'Rotavirus 2', dueDate: '2022-07-21', status: 'Completed' as const, completedDate: '2022-07-25' },
      { id: 'v11', name: 'PCV 2', dueDate: '2022-07-21', status: 'Completed' as const, completedDate: '2022-07-25' },
      { id: 'v12', name: 'OPV 3', dueDate: '2022-08-21', status: 'Completed' as const, completedDate: '2022-08-23' },
      { id: 'v13', name: 'Pentavalent 3', dueDate: '2022-08-21', status: 'Completed' as const, completedDate: '2022-08-23' },
      { id: 'v14', name: 'Rotavirus 3', dueDate: '2022-08-21', status: 'Completed' as const, completedDate: '2022-08-23' },
      { id: 'v15', name: 'PCV 3', dueDate: '2022-08-21', status: 'Completed' as const, completedDate: '2022-08-23' },
      { id: 'v16', name: 'IPV', dueDate: '2022-08-21', status: 'Completed' as const, completedDate: '2022-08-23' },
      { id: 'v17', name: 'MR 1', dueDate: '2023-02-10', status: 'Overdue' as const },
      { id: 'v18', name: 'JE 1', dueDate: '2023-02-10', status: 'Overdue' as const },
      { id: 'v19', name: 'Vitamin A', dueDate: '2023-02-10', status: 'Overdue' as const },
    ]
  }
]; 