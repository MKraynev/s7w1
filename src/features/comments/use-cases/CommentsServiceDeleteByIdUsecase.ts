import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepoService } from '../repo/CommentsRepoService';

export class CommentsServiceDeleteByIdCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(CommentsServiceDeleteByIdCommand)
@Injectable()
export class CommentsServiceDeleteByIdUseCase
  implements ICommandHandler<CommentsServiceDeleteByIdCommand, number>
{
  static CommentServiceUpdateByIdUseCase: any;

  constructor(private commentRepo: CommentsRepoService) {}
  async execute(command: CommentsServiceDeleteByIdCommand): Promise<any> {
    let comment = await this.commentRepo.ReadOneById(command.commentId);
    if (!comment) throw new NotFoundException('User doesnt exist');

    if (comment.userId !== +command.userId)
      throw new ForbiddenException('Wrong user');

    let delComment = await this.commentRepo.DeleteById(command.commentId);
    return delComment;
  }
}
