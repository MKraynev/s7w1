import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeForCommentRepoService } from 'src/features/likes/commentLikes/repo/LikesForCommentRepoService';
import { AvailableLikeStatus } from 'src/features/likes/postLikes/repo/entity/LikeForPostsRepoEntity';
import { UsersRepoService } from 'src/features/users/repo/UsersRepoService';
import { CommentsRepoService } from '../repo/CommentsRepoService';

export enum CommentServiceSetLikeStatus {
  CommentNotFound,
  UserNotFound,
  Success,
}

export class CommentServicePutLikeStatusCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public status: AvailableLikeStatus,
  ) {}
}

@Injectable()
@CommandHandler(CommentServicePutLikeStatusCommand)
export class CommentServicePutLikeStatusUseCase
  implements
    ICommandHandler<
      CommentServicePutLikeStatusCommand,
      CommentServiceSetLikeStatus
    >
{
  constructor(
    private likeRepo: LikeForCommentRepoService,
    private userRepo: UsersRepoService,
    private commentRepo: CommentsRepoService,
  ) {}

  async execute(
    command: CommentServicePutLikeStatusCommand,
  ): Promise<CommentServiceSetLikeStatus> {
    let { 0: comment, 1: user } = await Promise.all([
      this.commentRepo.ReadOneById(command.commentId),
      this.userRepo.ReadOneById(command.userId),
    ]);
    if (!comment) return CommentServiceSetLikeStatus.CommentNotFound;

    if (!user) return CommentServiceSetLikeStatus.UserNotFound;

    let like = await this.likeRepo.SetUserLikeForComment(
      user,
      command.status,
      comment,
    );

    return CommentServiceSetLikeStatus.Success;
  }
}
