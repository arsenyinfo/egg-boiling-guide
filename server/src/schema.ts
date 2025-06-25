
import { z } from 'zod';

// Enum for egg doneness levels
export const eggDonenessSchema = z.enum(['soft-boiled', 'medium-boiled', 'hard-boiled']);
export type EggDoneness = z.infer<typeof eggDonenessSchema>;

// Enum for water start methods
export const waterStartMethodSchema = z.enum(['cold-water', 'boiling-water']);
export type WaterStartMethod = z.infer<typeof waterStartMethodSchema>;

// Recipe schema
export const recipeSchema = z.object({
  id: z.number(),
  doneness: eggDonenessSchema,
  water_start_method: waterStartMethodSchema,
  cooking_time_minutes: z.number(),
  title: z.string(),
  description: z.string(),
  instructions: z.string(), // JSON string containing step-by-step instructions
  tips: z.string(), // JSON string containing tips array
  created_at: z.coerce.date()
});

export type Recipe = z.infer<typeof recipeSchema>;

// Input schema for getting recipes
export const getRecipesInputSchema = z.object({
  doneness: eggDonenessSchema.optional(),
  water_start_method: waterStartMethodSchema.optional()
});

export type GetRecipesInput = z.infer<typeof getRecipesInputSchema>;

// Input schema for getting a single recipe
export const getRecipeInputSchema = z.object({
  id: z.number()
});

export type GetRecipeInput = z.infer<typeof getRecipeInputSchema>;

// Cooking session schema for tracking user's cooking progress
export const cookingSessionSchema = z.object({
  id: z.number(),
  recipe_id: z.number(),
  started_at: z.coerce.date(),
  completed_at: z.coerce.date().nullable(),
  current_step: z.number().int(),
  created_at: z.coerce.date()
});

export type CookingSession = z.infer<typeof cookingSessionSchema>;

// Input schema for starting a cooking session
export const startCookingSessionInputSchema = z.object({
  recipe_id: z.number()
});

export type StartCookingSessionInput = z.infer<typeof startCookingSessionInputSchema>;

// Input schema for updating cooking session progress
export const updateCookingSessionInputSchema = z.object({
  id: z.number(),
  current_step: z.number().int().optional(),
  completed_at: z.coerce.date().nullable().optional()
});

export type UpdateCookingSessionInput = z.infer<typeof updateCookingSessionInputSchema>;
