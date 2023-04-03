import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";

import PostCreator from "../../Context/Posts/application/PostCreator";
import container from "../dependency_injection";

export const postsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed").min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const content = input.content;

      const postCreator = container.get<PostCreator>(
        "Posts.application.PostCreator"
      );
      return await postCreator.execute(authorId, content);
    }),
});
