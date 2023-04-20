import { Post } from "../domain/Post";
import { PostRepository } from "../domain/PostRepository";
import PostModel from "./PostModel";

export default class MongoPostRepository implements PostRepository {
  async save(post: Post): Promise<Post> {
    console.log({ ...post.toPrimitives(), _id: post.id.value });
    const createdPost = await PostModel.findByIdAndUpdate(
      post.id.value,
      { ...post.toPrimitives(), _id: post.id.value },
      { upsert: true, new: true },
    );

    return Post.fromPrimitives(createdPost);
  }
}
