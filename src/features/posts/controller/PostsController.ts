import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PostServiceSavePostCommentCommand } from '../use-cases/PostServiceSavePostCommentUsecase';
import { PostServiceGetPostCommentsCommand } from '../use-cases/PostServiceGetPostCommentsUsecase';
import {
  PostInfo,
  PostServiceGetPostByIdCommand,
} from '../use-cases/PostServiceGetPostByIdUsecase';
import { PostServiceGetManyCommand } from '../use-cases/PostServiceGetPostsManyUsecase';
import { PostRepoEntity } from '../repo/entity/PostsRepoEntity';
import { CommentSetEntity } from '../service/entities/PostControllerSetComment';
import { CommentInfo } from '../service/entities/PostControllerGetComment';
import { LikeSetEntity } from '../service/entities/PostControllerSetLikeStatus';
import { LikeForPostRepoService } from '../../likes/postLikes/repo/LikesForPostRepoService';
import { QueryPaginator } from '../../../paginator/QueryPaginatorDecorator';
import { InputPaginator } from '../../../paginator/entities/QueryPaginatorInputEntity';
import {
  ReadAccessToken,
  TokenExpectation,
} from '../../../jwt/decorators/JwtRequestReadAccessToken';
import { JwtServiceUserAccessTokenLoad } from '../../../jwt/entities/JwtServiceAccessTokenLoad';
import { OutputPaginator } from '../../../paginator/entities/QueryPaginatorUutputEntity';
import { JwtAuthGuard } from '../../../guards/common/JwtAuthGuard';
import { ValidateParameters } from '../../../pipes/ValidationPipe';
import { CommentRepoEntity } from '../../comments/repo/entities/CommentsRepoEntity';

@Controller('posts')
export class PostsController {
  constructor(
    private likeRepo: LikeForPostRepoService,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async GetPosts(
    @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    let { count, postInfos } = await this.commandBus.execute<
      PostServiceGetManyCommand,
      { count: number; postInfos: PostInfo[] }
    >(
      new PostServiceGetManyCommand(
        undefined,
        tokenLoad?.id,
        sortBy,
        sortDirecrion,
        paginator.skipElements,
        paginator.pageSize,
      ),
    );
    let pagedPosts = new OutputPaginator(count, postInfos, paginator);
    return pagedPosts;
  }

  @Get(':id')
  async GetPostById(
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    let post = await this.commandBus.execute<
      PostServiceGetPostByIdCommand,
      PostInfo
    >(new PostServiceGetPostByIdCommand(id, tokenLoad?.id));

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async SaveComment(
    @Param('id') id: string,
    @Body(new ValidateParameters()) commentData: CommentSetEntity,
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let comment = await this.commandBus.execute<
      PostServiceSavePostCommentCommand,
      CommentInfo
    >(new PostServiceSavePostCommentCommand(tokenLoad.id, id, commentData));

    return comment;
  }

  @Get(':id/comments')
  async GetPostComments(
    @Query('searchNameTerm') nameTerm: string | undefined,
    @Query('sortBy') sortBy: keyof CommentRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
    @Param('id') id: string,
    @ReadAccessToken(TokenExpectation.Possibly)
    tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  ) {
    let { count, comments } = await this.commandBus.execute<
      PostServiceGetPostCommentsCommand,
      { count: number; comments: CommentInfo[] }
    >(
      new PostServiceGetPostCommentsCommand(
        id,
        sortBy,
        sortDirecrion,
        tokenLoad?.id,
        paginator.skipElements,
        paginator.pageSize,
      ),
    );

    let result = new OutputPaginator(count, comments, paginator);

    return result;
  }

  ///hometask_19/api/posts/{postId}/like-status
  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async PutLike(
    @Body(new ValidateParameters()) likeData: LikeSetEntity,
    @Param('id') id: string,
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
  ) {
    let savedLikestatus = await this.likeRepo.SetUserLikeForPost(
      tokenLoad.id,
      likeData.likeStatus,
      id,
    );

    return;
  }
}
