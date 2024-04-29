import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepoEntity } from './entity/PostsRepoEntity';
import { PostsRepoService } from './PostsRepoService';
import { BlogsRepoModule } from 'src/features/blogs/repo/blogs.repo.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepoEntity]), BlogsRepoModule],
  providers: [PostsRepoService],
  exports: [PostsRepoService],
})
export class PostsRepoModule {}
