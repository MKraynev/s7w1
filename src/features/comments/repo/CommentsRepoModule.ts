import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepoEntity } from './entities/CommentsRepoEntity';
import { CommentsRepoService } from './CommentsRepoService';
import { PostsRepoModule } from 'src/features/posts/repo/PostsRepoModule';
import { LikesForCommentRepoModule } from 'src/features/likes/commentLikes/repo/LikesForCommentRepoModule';
import { UsersRepoModule } from 'src/features/users/repo/UsersRepoModule';

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
