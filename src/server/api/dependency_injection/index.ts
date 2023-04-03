import { ContainerBuilder, Reference } from "node-dependency-injection";
import PostCreator from "../../Context/Posts/application/PostCreator";
import PrismaPostRepository from "../../Context/Posts/infrastructure/PrismaPostRepository";
import MongoPostRepository from "../../Context/Posts/infrastructure/MongoPostRepository";

const container = new ContainerBuilder();
container.register(
  "Posts.domain.PostRepository",
  //PrismaPostRepository,
  MongoPostRepository
);
container
  .register("Posts.application.PostCreator", PostCreator)
  .addArgument(new Reference("Posts.domain.PostRepository"));
export default container;