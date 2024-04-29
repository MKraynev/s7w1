import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentSetEntity } from 'src/features/posts/service/entities/PostControllerSetComment';
import { CommentsRepoService } from '../repo/CommentsRepoService';

export class CommentServiceUpdateByIdCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public commentData: CommentSetEntity,
  ) {}
}

@Injectable()
@CommandHandler(CommentServiceUpdateByIdCommand)
export class CommentServiceUpdateByIdUseCase
  implements ICommandHandler<CommentServiceUpdateByIdCommand, boolean>
{
  constructor(private commentRepo: CommentsRepoService) {}

  async execute(command: CommentServiceUpdateByIdCommand) {
    let foundComment = await this.commentRepo.ReadOneById(command.commentId);

    if (!foundComment) throw new NotFoundException('Comment id doesnt exist');

    if (foundComment.userId !== +command.userId)
      throw new ForbiddenException('Wrong user');

    foundComment.content = command.commentData.content;

    let savedComment = await this.commentRepo.Update(foundComment);
    return true;
  }
}
