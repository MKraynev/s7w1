import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepoService } from '../repo/CommentsRepoService';
import { CommentInfo } from '../../posts/service/entities/PostControllerGetComment';
import { LikeForCommentRepoService } from '../../likes/commentLikes/repo/LikesForCommentRepoService';

export class CommentsServiceGetCommentByIdCommand {
  constructor(
    public commentId: string,
    public userId?: string,
  ) {}
}

@CommandHandler(CommentsServiceGetCommentByIdCommand)
@Injectable()
export class CommentsServiceGetCommentByIdUseCase
  implements ICommandHandler<CommentsServiceGetCommentByIdCommand, CommentInfo>
{
  constructor(
    private commentRepo: CommentsRepoService,
    private likeRepo: LikeForCommentRepoService,
  ) {}
  async execute(
    command: CommentsServiceGetCommentByIdCommand,
  ): Promise<CommentInfo> {
    try {
      const [comment, userStatus, statistic] = await Promise.all([
        this.commentRepo.ReadOneById(command.commentId),
        this.likeRepo.GetUserStatus(command.commentId, command.userId),
        this.likeRepo.GetStatistic(command.commentId),
      ]);

      if (!comment) {
        throw new NotFoundException(
          `Comment with ID ${command.commentId} not found`,
        );
      }

      return new CommentInfo(
        comment,
        comment.user.id.toString(),
        comment.user.login,
        userStatus,
        statistic.like,
        statistic.dislike,
      );
    } catch (error) {
      console.error('Error in CommentsServiceGetCommentByIdUseCase:', error);
      throw error;
    }
  }
}
