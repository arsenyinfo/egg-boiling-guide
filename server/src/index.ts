
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schema types
import { 
  getRecipesInputSchema, 
  getRecipeInputSchema, 
  startCookingSessionInputSchema, 
  updateCookingSessionInputSchema 
} from './schema';

// Import handlers
import { getRecipes } from './handlers/get_recipes';
import { getRecipe } from './handlers/get_recipe';
import { startCookingSession } from './handlers/start_cooking_session';
import { updateCookingSession } from './handlers/update_cooking_session';
import { getCookingSession } from './handlers/get_cooking_session';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Recipe routes
  getRecipes: publicProcedure
    .input(getRecipesInputSchema)
    .query(({ input }) => getRecipes(input)),
    
  getRecipe: publicProcedure
    .input(getRecipeInputSchema)
    .query(({ input }) => getRecipe(input)),
  
  // Cooking session routes
  startCookingSession: publicProcedure
    .input(startCookingSessionInputSchema)
    .mutation(({ input }) => startCookingSession(input)),
    
  updateCookingSession: publicProcedure
    .input(updateCookingSessionInputSchema)
    .mutation(({ input }) => updateCookingSession(input)),
    
  getCookingSession: publicProcedure
    .input(getRecipeInputSchema)
    .query(({ input }) => getCookingSession(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
