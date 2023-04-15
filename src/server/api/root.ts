import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { accountsRouter } from "./routers/accounts";
import { initializeMongo } from "../mongo";
import { usersRouter } from "~/server/api/routers/users";
import { flowsRouter } from "~/server/api/routers/flows";
import { audiencesRouter } from "~/server/api/routers/audiences";
import { offersRouter } from "~/server/api/routers/offers";
import { paymentProvidersRouter } from "~/server/api/routers/paymentProviders";
import { sessionsRouter } from "~/server/api/routers/sessions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
initializeMongo();
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  profile: profileRouter,
  accounts: accountsRouter,
  users: usersRouter,
  flows: flowsRouter,
  audiences: audiencesRouter,
  offers: offersRouter,
  paymentProviders: paymentProvidersRouter,
  sessions: sessionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
