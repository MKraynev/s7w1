import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepoEntity } from './entities/CommentsRepoEntity';
import { CommentsRepoService } from './CommentsRepoService';
import { UsersRepoModule } from '../../users/repo/UsersRepoModule';
import { PostsRepoModule } from '../../posts/repo/PostsRepoModule';
import { LikesForCommentRepoModule } from '../../likes/commentLikes/repo/LikesForCommentRepoModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepoEntity]),
    UsersRepoModule,
    PostsRepoModule,
    LikesForCommentRepoModule,
  ],
  providers: [CommentsRepoService],
  exports: [CommentsRepoService],
})
export class CommentRepoModule {}
