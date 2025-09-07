export enum Difficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2
}

export enum FoodType {
  Meat = 0,
  Dairy = 1,
  Parve = 2
}

export interface RecipeIngredientDto {
  id: number;
  recipeId?: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateRecipeIngredientDto {
  recipeId?: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeStepDto {
  id: number;
  recipeId?: number;
  order: number;
  instruction: string;
}

export interface CreateRecipeStepDto {
  recipeId?: number;
  order: number;
  instruction: string;
}

export interface RecipeImageDto {
  id: number;
  recipeId?: number;
  url: string;
  alt?: string;
  isCover: boolean;
}

export interface CreateRecipeImageDto {
  recipeId?: number;
  url: string;
  alt?: string;
  isCover: boolean;
}

export interface RecipeDto {
  id: number;
  title: string;
  description?: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  foodType: FoodType;
  isKosher: boolean;
  createdAt: Date;
  authorName: string;

  ingredients: RecipeIngredientDto[];
  steps: RecipeStepDto[];
  images: RecipeImageDto[];
}

export interface CreateRecipeDto {
  title: string;
  description?: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  foodType: FoodType;
  isKosher: boolean;

  ingredients: CreateRecipeIngredientDto[];
  steps: CreateRecipeStepDto[];
  images: CreateRecipeImageDto[];
}
