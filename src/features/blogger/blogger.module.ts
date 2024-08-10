import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBlogRepoEntity } from "./repo/entities/user.to.blog.repo.entity";
import { BloggerPostBlogUseCase } from "./service/use-cases/blogger.post.blog.usecase";
import { BloggerController } from "./controller/blogger.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { BloggerPutBlogsByIdUseCase } from "./service/use-cases/blogger.put.blogs.by.id.usecase";
import { BloggerDeleteBlogsByIdUseCase } from "./service/use-cases/blogger.delete.blogs.by.id.usecase";
import { BloggerGetBlogsUseCase } from "./service/use-cases/blogger.get.blogs.usecase";
import { BloggerPostPostByBlogIdUseCase } from "./service/use-cases/blogger.post.post.by.blog.id.usecase";

const BloggerUseCases = [
  BloggerPostBlogUseCase,
  BloggerPutBlogsByIdUseCase,
  BloggerDeleteBlogsByIdUseCase,
  BloggerGetBlogsUseCase,
  BloggerPostPostByBlogIdUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserToBlogRepoEntity]), CqrsModule],
  controllers: [BloggerController],
  providers: [...BloggerUseCases],
  exports: [...BloggerUseCases],
})
export class BloggerModule {}
