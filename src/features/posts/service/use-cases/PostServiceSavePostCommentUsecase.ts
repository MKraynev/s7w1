import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentSetEntity } from '../entities/PostControllerSetComment';
import { CommentInfo } from '../entities/PostControllerGetComment';
import { UsersRepoService } from 'src/features/users/repo/UsersRepoService';
import { PostsRepoService } from '../../repo/PostsRepoService';
import { CommentsRepoService } from 'src/features/comments/repo/CommentsRepoService';
import { PostRepoEntity } from '../../repo/entity/PostsRepoEntity';

export class PostServiceSavePostCommentCommand {
  constructor(
    public userId: string,
    public postId: string,
    public comment: CommentSetEntity,
  ) {}
}

@CommandHandler(PostServiceSavePostCommentCommand)
@Injectable()
export class PostServiceSavePostCommentUseCase
  implements ICommandHandler<PostServiceSavePostCommentCommand, CommentInfo>
{
  constructor(
    private userRepo: UsersRepoService,
    private postRepo: PostsRepoService,
    private commentRepo: CommentsRepoService,
  ) {}
  async execute(
    command: PostServiceSavePostCommentCommand,
  ): Promise<CommentInfo> {
    let user = await this.userRepo.ReadOneById(command.userId);
    if (!user) throw new NotFoundException();

    let post = (await this.postRepo.ReadById(command.postId)) as PostRepoEntity;
    if (!post) throw new NotFoundException();

    let savedComment = await this.commentRepo.Create(
      user,
      post,
      command.comment,
    );

    return new CommentInfo(savedComment, user.id.toString(), user.login);
  }
}
