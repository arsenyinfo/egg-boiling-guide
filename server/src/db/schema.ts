
import { serial, text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for egg cooking
export const eggDonenessEnum = pgEnum('egg_doneness', ['soft-boiled', 'medium-boiled', 'hard-boiled']);
export const waterStartMethodEnum = pgEnum('water_start_method', ['cold-water', 'boiling-water']);

// Recipes table - stores different egg cooking methods and instructions
export const recipesTable = pgTable('recipes', {
  id: serial('id').primaryKey(),
  doneness: eggDonenessEnum('doneness').notNull(),
  water_start_method: waterStartMethodEnum('water_start_method').notNull(),
  cooking_time_minutes: integer('cooking_time_minutes').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(), // JSON string containing step-by-step instructions
  tips: text('tips').notNull(), // JSON string containing tips array
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Cooking sessions table - tracks user's cooking progress
export const cookingSessionsTable = pgTable('cooking_sessions', {
  id: serial('id').primaryKey(),
  recipe_id: integer('recipe_id').notNull(),
  started_at: timestamp('started_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at'),
  current_step: integer('current_step').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const recipesRelations = relations(recipesTable, ({ many }) => ({
  cookingSessions: many(cookingSessionsTable),
}));

export const cookingSessionsRelations = relations(cookingSessionsTable, ({ one }) => ({
  recipe: one(recipesTable, {
    fields: [cookingSessionsTable.recipe_id],
    references: [recipesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Recipe = typeof recipesTable.$inferSelect;
export type NewRecipe = typeof recipesTable.$inferInsert;
export type CookingSession = typeof cookingSessionsTable.$inferSelect;
export type NewCookingSession = typeof cookingSessionsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  recipes: recipesTable, 
  cookingSessions: cookingSessionsTable 
};
