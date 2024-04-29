import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForCommentRepoService } from './LikesForCommentRepoService';
import { LikeForCommentRepoEntity } from './entity/LikeForCommentsRepoEntity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeForCommentRepoEntity])],
  providers: [LikeForCommentRepoService],
  exports: [LikeForCommentRepoService],
})
export class LikesForCommentRepoModule {}
