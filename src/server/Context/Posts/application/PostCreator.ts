import { Post } from "../domain/Post";
import { PostRepository } from "../domain/PostRepository";
import { PostId } from "../domain/values/PostId";
import { PrismaPostRepository } from "../infrastructure/PrismaPostRepository";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export class PostCreator {
  private postRepo: PostRepository;

  constructor() {
    this.postRepo = new PrismaPostRepository();
  }

  async execute(authorId: string, content: string) {
    const { success } = await ratelimit.limit(authorId);
    if (!success) throw new Error("TOO_MANY_REQUESTS");

    const post = Post.create({
      id: PostId.random(),
      authorId,
      content,
    });

    return await this.postRepo.save(post);
  }
}
