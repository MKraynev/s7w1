import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AvailableLikeStatus,
  LikeForPostRepoEntity,
} from 'src/features/likes/postLikes/repo/entity/LikeForPostsRepoEntity';
import { PostRepoEntity } from '../repo/entity/PostsRepoEntity';
import { PostsRepoService } from '../repo/PostsRepoService';
import { LikeForPostRepoService } from 'src/features/likes/postLikes/repo/LikesForPostRepoService';

export class LikeLiteInfo {
  constructor(
    public addedAt: string,
    public userId: string,
    public login: string,
  ) {}
}

export class PostInfo {
  public id: string;
  public title: string;
  public shortDescription: string;
  public content: string;
  public blogId: string;
  public blogName: string;
  public createdAt: string;

  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: AvailableLikeStatus;
    newestLikes: LikeLiteInfo[];
  };

  constructor(
    post: PostRepoEntity,
    userLikeStatus: AvailableLikeStatus,
    likes: number,
    dislikes: number,
    lastLikes: LikeForPostRepoEntity[],
  ) {
    this.id = post.id.toString();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId.toString();
    this.blogName = post.blog.name;
    this.createdAt = post.createdAt.toISOString();

    let newestLikes =
      lastLikes.length > 0
        ? lastLikes.map(
            (like) =>
              new LikeLiteInfo(
                like.createdAt.toISOString(),
                like.userId.toString(),
                like.user.login,
              ),
          )
        : [];

    this.extendedLikesInfo = {
      likesCount: likes,
      dislikesCount: dislikes,
      myStatus: userLikeStatus,
      newestLikes: newestLikes,
    };
  }
}

export class PostServiceGetPostByIdCommand {
  constructor(
    public postId: string,
    public userId?: string,
  ) {}
}

@Injectable()
@CommandHandler(PostServiceGetPostByIdCommand)
export class PostServiceGetPostByIdUseCase
  implements ICommandHandler<PostServiceGetPostByIdCommand, PostInfo>
{
  constructor(
    private postRepo: PostsRepoService,
    private likeRepo: LikeForPostRepoService,
  ) {}
  async execute(command: PostServiceGetPostByIdCommand): Promise<PostInfo> {
    // let post = await this.postRepo.ReadById(command.postId) as PostRepoEntity;

    const [post, userlike, statistic, lastLikes] = await Promise.all([
      this.postRepo.ReadById(command.postId),
      this.likeRepo.GetUserStatus(command.postId, command.userId),
      this.likeRepo.Count(command.postId),
      this.likeRepo.ReadManyLikes(command.postId, 'createdAt', 'desc', 0, 3),
    ]);

    if (!post) throw new NotFoundException('post doesnt ');

    let result = new PostInfo(
      post as PostRepoEntity,
      userlike,
      statistic.likes,
      statistic.dislikes,
      lastLikes,
    );
    return result;
  }
}
