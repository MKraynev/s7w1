import { Module } from '@nestjs/common';
import { CommentsServiceGetCommentByIdUseCase } from './use-cases/CommentsServiceGetCommentByIdUsecase';
import { CommentsController } from './controller/CommentsController';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsServiceDeleteByIdUseCase } from './use-cases/CommentsServiceDeleteByIdUsecase';
import { CommentServiceUpdateByIdUseCase } from './use-cases/CommentsServiceUpdateByIdUsecase';
import { CommentServicePutLikeStatusUseCase } from './use-cases/CommentsServicePutLikeStatusUsecase';
import { CommentRepoModule } from './repo/CommentsRepoModule';
import { LikesForCommentRepoModule } from '../likes/commentLikes/repo/LikesForCommentRepoModule';
import { UsersRepoModule } from '../users/repo/UsersRepoModule';

const CommentUseCases = [
  CommentsServiceGetCommentByIdUseCase,
  CommentsServiceDeleteByIdUseCase,
  CommentServiceUpdateByIdUseCase,
  CommentServicePutLikeStatusUseCase,
];

@Module({
  imports: [
    CqrsModule,
    CommentRepoModule,
    LikesForCommentRepoModule,
    UsersRepoModule,
  ],
  controllers: [CommentsController],
  providers: [...CommentUseCases],
})
export class CommentsModule {}
