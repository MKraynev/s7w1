import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeForPostRepoEntity } from './entity/LikeForPostsRepoEntity';
import { LikeForPostRepoService } from './LikesForPostRepoService';
import { UsersRepoModule } from '../../../users/repo/UsersRepoModule';
import { PostsRepoModule } from '../../../posts/repo/PostsRepoModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeForPostRepoEntity]),
    UsersRepoModule,
    PostsRepoModule,
  ],
  providers: [LikeForPostRepoService],
  exports: [LikeForPostRepoService],
})
export class LikesForPostRepoModule {}
