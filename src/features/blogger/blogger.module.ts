import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBlogRepoEntity } from "./repo/entities/user.to.blog.repo.entity";
import { BloggerPostNewBlogUseCase } from "./service/use-cases/blogger.post.new.blog.usecase";

const BloggerUseCases = [BloggerPostNewBlogUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([UserToBlogRepoEntity])],
  controllers: [],
  providers: [...BloggerUseCases],
  exports: [...BloggerUseCases],
})
export class BloggerModule {}
