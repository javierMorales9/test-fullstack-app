import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import container from "~/server/api/dependency_injection";
import PostCreator from "~/server/Context/Posts/application/PostCreator";

export const flowsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji("Only emojis are allowed").min(1).max(280),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const content = input.content;

      const postCreator = container.get<PostCreator>(
        "Posts.application.PostCreator",
      );
      return await postCreator.execute(authorId, content);
    }),
});
