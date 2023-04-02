import { PostId } from "./values/PostId";

export class Post {
  private id: PostId;
  private authorId: string;
  private content: string;
  private createdAt: Date;

  private constructor({
    id,
    authorId,
    content,
    createdAt,
  }: {
    id: PostId;
    authorId: string;
    content: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.createdAt = createdAt;
  }

  static create({
    id,
    authorId,
    content,
  }: {
    id: PostId;
    authorId: string;
    content: string;
  }){

    return new Post({
        id,
        authorId,
        content,
        createdAt: new Date(),
    });
  }

  static fromPrimitives(data: any){
    return new Post({
        id: new PostId(data.id),
        authorId: data.authorId,
        content: data.content,
        createdAt: data.createdAt,
    });
  }

  toPrimitives(){
    return {
        id: this.id.value,
        authorId: this.authorId,
        content: this.content,
        createdAt: this.createdAt,
    };
  }
}
