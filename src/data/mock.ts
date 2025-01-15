import { Recipe, MealPlan, NutritionTip, Achievement, UserProfile } from '@/types';

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
  lastActive: new Date().toISOString()
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