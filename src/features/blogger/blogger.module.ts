import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBlogRepoEntity } from "./repo/entities/user.to.blog.repo.entity";
import { BloggerPostBlogUseCase } from "./service/use-cases/blogger.post.blog.usecase";
import { BloggerController } from "./controller/blogger.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { BloggerPutBlogsByIdUseCase } from "./service/use-cases/blogger.put.blogs.by.id.usecase";

const BloggerUseCases = [BloggerPostBlogUseCase, BloggerPutBlogsByIdUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([UserToBlogRepoEntity]), CqrsModule],
  controllers: [BloggerController],
  providers: [...BloggerUseCases],
  exports: [...BloggerUseCases],
})
export class BloggerModule {}
