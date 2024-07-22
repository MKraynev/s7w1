import { Body, Controller, Delete, Get, Post, Put, Query, Redirect, Res, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../../guards/common/JwtAuthGuard";
import { ReadAccessToken } from "../../../jwt/decorators/JwtRequestReadAccessToken";
import { JwtServiceUserAccessTokenLoad } from "../../../jwt/entities/JwtServiceAccessTokenLoad";
import { ValidateParameters } from "../../../pipes/ValidationPipe";
import { BlogCreateEntity } from "../../blogs/controller/entities/blogs.super.admin.create.entity";
import {
  BloggerPostNewBlogCommand,
  BloggerPostNewBlogResult,
  BloggerPostBlogUseCase,
} from "../service/use-cases/blogger.post.blog.usecase";
import { QueryPaginator } from "../../../paginator/QueryPaginatorDecorator";
import { PostRepoEntity } from "../../posts/repo/entity/PostsRepoEntity";
import { InputPaginator } from "../../../paginator/entities/QueryPaginatorInputEntity";

@Controller("blogger/blogs")
@UseGuards(JwtAuthGuard)
export class BloggerController {
  constructor(private comandBus: CommandBus) {}

  @Put(":id")
  public async UpdateBlogById() {
    return "put";
  }

  @Delete(":id")
  public async DeleteBlogById() {
    return "delete";
  }

  @Post(":id/posts")
  public async SaveBlogsPost() {
    return "post";
  }

  @Get(":id/posts")
  public async GetBlogsPost() {
    return "get";
  }

  @Put(":blogId/posts/:postId")
  public async UpdateBlogsPost() {
    return "put";
  }

  @Delete(":id/posts/:postId")
  public async DeleteBlogsPost() {
    return "delete";
  }

  @Post("")
  public async SaveBlog(
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
    @Body(new ValidateParameters()) blog: BlogCreateEntity,
  ) {
    let command = new BloggerPostNewBlogCommand(tokenLoad.id, tokenLoad.login, blog.name, blog.description, blog.websiteUrl);
    let result = await this.comandBus.execute<BloggerPostNewBlogCommand, BloggerPostNewBlogResult>(command);

    return result;
  }

  @Get("")
  public async GetBlogs() {
    return "get";
  }
}
