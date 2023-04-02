import { prisma } from "../../../db";
import { Post } from "../domain/Post";
import { PostRepository } from "../domain/PostRepository";

export default class PrismaPostRepository implements PostRepository {
  async save(post: Post) {
    const createdPost = await prisma.post.create({
      data: { ...post.toPrimitives() },
    });

    return Post.fromPrimitives(createdPost);
  }
}
