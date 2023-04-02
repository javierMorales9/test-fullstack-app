import { Post } from "./Post";

export interface PostRepository {
  save(post: Post): Promise<Post>;
}
