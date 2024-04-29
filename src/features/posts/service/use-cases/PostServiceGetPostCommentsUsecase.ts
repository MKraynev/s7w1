import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepoService } from '../../repo/PostsRepoService';
import { CommentInfo } from '../entities/PostControllerGetComment';
import { CommentRepoEntity } from '../../../comments/repo/entities/CommentsRepoEntity';
import { CommentsRepoService } from '../../../comments/repo/CommentsRepoService';

export class PostServiceGetPostCommentsCommand {
  constructor(
    public postId: string,
    public sortBy: keyof CommentRepoEntity,
    public sortDirection: 'desc' | 'asc',
    public userId?: string,
    public skip?: number,
    public limit?: number,
  ) {}
}

@Injectable()
@CommandHandler(PostServiceGetPostCommentsCommand)
export class PostServiceGetPostCommentsUseCase
  implements
    ICommandHandler<
      PostServiceGetPostCommentsCommand,
      { count: number; comments: CommentInfo[] }
    >
{
  constructor(
    private commentRepo: CommentsRepoService,
    private postRepo: PostsRepoService,
  ) {}

  async execute(
    command: PostServiceGetPostCommentsCommand,
  ): Promise<{ count: number; comments: CommentInfo[] }> {
    let post = await this.postRepo.ReadById(command.postId);

    if (!post) throw new NotFoundException('Post not found');

    let countAndComments =
      await this.commentRepo.ReadAndCountManyForCertainPost(
        command.postId,
        command.sortBy,
        command.sortDirection,
        command.userId,
        command.skip,
        command.limit,
      );

    return countAndComments;
  }
}
