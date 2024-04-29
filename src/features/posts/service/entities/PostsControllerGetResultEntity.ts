import { PostRepoEntity } from '../../repo/entity/PostsRepoEntity';

export class PostGetResultEntity {
  public id: string;
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: string;
  public blogName: string;
  public createdAt: string;

  constructor(post: PostRepoEntity) {
    this.id = post.id.toString();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId.toString();
    this.blogName = post.blog.name;
    this.createdAt = post.createdAt.toISOString();

    this.InitLikes();
  }

  public InitLikes() {
    let likeStat = {
      dislikesCount: 0,
      likesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    this['extendedLikesInfo'] = likeStat;
  }
}
