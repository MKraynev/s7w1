import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BlogsRepoModule } from './repo/blogs.repo.module';
// import { PostsRepoModule } from '../posts/repo/PostsRepoModule';
import { BlogsController } from './controller/blogs.controller';

@Module({
  imports: [BlogsRepoModule, CqrsModule],
  controllers: [BlogsController],
})
export class BlogModule {}
//add to import PostsRepoModule
