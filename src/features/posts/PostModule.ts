import { Module } from '@nestjs/common';
import { PostServiceSavePostCommentUseCase } from './use-cases/PostServiceSavePostCommentUsecase';
import { CqrsModule } from '@nestjs/cqrs';
import { PostServiceGetPostCommentsUseCase } from './use-cases/PostServiceGetPostCommentsUsecase';
import { PostServiceGetPostByIdUseCase } from './use-cases/PostServiceGetPostByIdUsecase';
import { PostServiceGetManyUseCase } from './use-cases/PostServiceGetPostsManyUsecase';
import { PostsRepoModule } from './repo/PostsRepoModule';
import { CommentRepoModule } from '../comments/repo/CommentsRepoModule';
import { LikesForPostRepoModule } from '../likes/postLikes/repo/LikesForPostRepoModule';
import { UsersRepoModule } from '../users/repo/UsersRepoModule';
import { PostsController } from './controller/PostsController';

export const PostUseCases = [
  PostServiceSavePostCommentUseCase,
  PostServiceGetPostCommentsUseCase,
  PostServiceGetPostByIdUseCase,
  PostServiceGetManyUseCase,
];

@Module({
  imports: [
    CqrsModule,
    PostsRepoModule,
    CommentRepoModule,
    LikesForPostRepoModule,
    UsersRepoModule,
  ],
  controllers: [PostsController],
  providers: [...PostUseCases],
})
export class PostModule {}
