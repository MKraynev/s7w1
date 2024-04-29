import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInfo } from './PostServiceGetPostByIdUsecase';
import { Injectable } from '@nestjs/common';
import { PostRepoEntity } from '../../repo/entity/PostsRepoEntity';
import { PostsRepoService } from '../../repo/PostsRepoService';
import { LikeForPostRepoService } from '../../../likes/postLikes/repo/LikesForPostRepoService';

export class PostServiceGetManyCommand {
  constructor(
    public blogId?: string,
    public userId?: string,
    public sortBy: keyof PostRepoEntity = 'createdAt',
    public sortDirection: 'asc' | 'desc' = 'desc',
    public skip: number = 0,
    public limit: number = 10,
  ) {}
}

@Injectable()
@CommandHandler(PostServiceGetManyCommand)
export class PostServiceGetManyUseCase
  implements
    ICommandHandler<
      PostServiceGetManyCommand,
      { count: number; postInfos: PostInfo[] }
    >
{
  constructor(
    private postRepo: PostsRepoService,
    private likeRepo: LikeForPostRepoService,
  ) {}

  async execute(
    command: PostServiceGetManyCommand,
  ): Promise<{ count: number; postInfos: PostInfo[] }> {
    let foundCount: number;
    let foundPosts: PostRepoEntity[];

    if (command.blogId) {
      let { count, posts } = (await this.postRepo.ReadManyByBlogId(
        +command.blogId,
        command.sortBy,
        command.sortDirection,
        command.skip,
        command.limit,
      )) as {
        count: number;
        posts: PostRepoEntity[];
      };

      foundCount = count;
      foundPosts = posts;
    } else {
      let { count, posts } = (await this.postRepo.ReadMany(
        command.sortBy,
        command.sortDirection,
        command.skip,
        command.limit,
      )) as {
        count: number;
        posts: PostRepoEntity[];
      };

      foundCount = count;
      foundPosts = posts;
    }

    let postInfos = await Promise.all(
      foundPosts.map(async (post) => {
        const [userlike, statistic, lastLikes] = await Promise.all([
          this.likeRepo.GetUserStatus(post.id.toString(), command.userId),
          this.likeRepo.Count(post.id.toString()),
          this.likeRepo.ReadManyLikes(
            post.id.toString(),
            'createdAt',
            'desc',
            0,
            3,
          ),
        ]);

        let result = new PostInfo(
          post as PostRepoEntity,
          userlike,
          statistic.likes,
          statistic.dislikes,
          lastLikes,
        );
        return result;
      }),
    );

    return { count: foundCount, postInfos: postInfos };
  }
}
