import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsServiceGetCommentByIdCommand } from '../use-cases/CommentsServiceGetCommentByIdUsecase';
import { CommentsServiceDeleteByIdCommand } from '../use-cases/CommentsServiceDeleteByIdUsecase';
import { CommentServiceUpdateByIdCommand } from '../use-cases/CommentsServiceUpdateByIdUsecase';
import {
  CommentServicePutLikeStatusCommand,
  CommentServiceSetLikeStatus,
} from '../use-cases/CommentsServicePutLikeStatusUsecase';
import { _WAIT_ } from 'src/settings';
import {
  ReadAccessToken,
  TokenExpectation,
} from 'src/jwt/decorators/JwtRequestReadAccessToken';
import { JwtServiceUserAccessTokenLoad } from 'src/jwt/entities/JwtServiceAccessTokenLoad';
import { CommentInfo } from 'src/features/posts/service/entities/PostControllerGetComment';
import { JwtAuthGuard } from 'src/guards/common/JwtAuthGuard';
import { ValidateParameters } from 'src/pipes/ValidationPipe';
import { CommentSetEntity } from 'src/features/posts/service/entities/PostControllerSetComment';
import { LikeSetEntity } from 'src/features/posts/service/entities/PostControllerSetLikeStatus';

@Controller('comments')
export class CommentsController {
  constructor(private commandBus: CommandBus) {}

  @Get(':id')
  public async GetById(
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let comment = await this.commandBus.execute<
      CommentsServiceGetCommentByIdCommand,
      CommentInfo
    >(new CommentsServiceGetCommentByIdCommand(id, tokenLoad?.id));
    await _WAIT_();
    return comment;
  }

  //delete -> /hometask_14/api/comments/{commentId}
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteComment(
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Expected)
    tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let comment = await this.commandBus.execute<
      CommentsServiceDeleteByIdCommand,
      number
    >(new CommentsServiceDeleteByIdCommand(id, tokenLoad.id));
    return;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdateComment(
    @Param('id') id: string,
    @Body(new ValidateParameters()) commentData: CommentSetEntity,
    @ReadAccessToken(TokenExpectation.Expected)
    tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let commentUpdated = await this.commandBus.execute<
      CommentServiceUpdateByIdCommand,
      boolean
    >(new CommentServiceUpdateByIdCommand(id, tokenLoad.id, commentData));
    await _WAIT_();
    return;
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async SetUserLikeStatus(
    @Body(new ValidateParameters()) likeData: LikeSetEntity,
    @Param('id') id: string,
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let setStatus = await this.commandBus.execute<
      CommentServicePutLikeStatusCommand,
      CommentServiceSetLikeStatus
    >(
      new CommentServicePutLikeStatusCommand(
        id,
        tokenLoad.id,
        likeData.likeStatus,
      ),
    );

    switch (setStatus) {
      case CommentServiceSetLikeStatus.Success:
        return;

      case CommentServiceSetLikeStatus.CommentNotFound:
      case CommentServiceSetLikeStatus.UserNotFound:
        throw new NotFoundException();
    }
  }
}
