import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBlogRepoEntity } from "./repo/entities/user.to.blog.repo.entity";
import { BloggerPostBlogUseCase } from "./service/use-cases/blogger.post.blog.usecase";
import { BloggerController } from "./controller/blogger.controller";

const BloggerUseCases = [BloggerPostBlogUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([UserToBlogRepoEntity])],
  controllers: [BloggerController],
  providers: [...BloggerUseCases],
  exports: [...BloggerUseCases],
})
export class BloggerModule {}
