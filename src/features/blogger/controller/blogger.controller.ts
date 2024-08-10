import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Redirect,
  Res,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../../guards/common/JwtAuthGuard";
import { ReadAccessToken } from "../../../jwt/decorators/JwtRequestReadAccessToken";
import { JwtServiceUserAccessTokenLoad } from "../../../jwt/entities/JwtServiceAccessTokenLoad";
import { ValidateParameters } from "../../../pipes/ValidationPipe";
import { BlogCreateEntity } from "../../blogs/controller/entities/blogs.super.admin.create.entity";
import { BloggerPostBlogCommand, BloggerPostNewBlogResult, BloggerPostBlogUseCase } from "../service/use-cases/blogger.post.blog.usecase";
import { BloggerPutBlogsByIdCommand } from "../service/use-cases/blogger.put.blogs.by.id.usecase";
import { BloggerDeleteBlogsByIdCommand } from "../service/use-cases/blogger.delete.blogs.by.id.usecase";
import { BloggerControllerPostBlogsPostByBlogIdEntity } from "./entities/blogger.controller.post.blogs.post.by.blog.id.entity";
import { NotFoundError } from "rxjs";

@Controller("blogger/blogs")
@UseGuards(JwtAuthGuard)
export class BloggerController {
  constructor(private comandBus: CommandBus) {}

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async UpdateBlogById(
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
    @Param("id") id: string,
    @Body(new ValidateParameters()) newBlogData: BlogCreateEntity,
  ) {
    console.log("PUT inputData:", tokenLoad, id, newBlogData);

    let command = new BloggerPutBlogsByIdCommand(tokenLoad, id, newBlogData);
    let result = await this.comandBus.execute<BloggerPutBlogsByIdCommand, boolean>(command);

    return;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async DeleteBlogById(@ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad, @Param("id") id: string) {
    console.log("Delete inputData:", tokenLoad, id);
    try {
      let command = new BloggerDeleteBlogsByIdCommand(tokenLoad, id);
      let result = await this.comandBus.execute<BloggerDeleteBlogsByIdCommand, number>(command);
      return;
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  @Post(":id/posts")
  @HttpCode(HttpStatus.CREATED)
  public async SaveBlogsPost(
    @ReadAccessToken() tokenLoad: JwtServiceUserAccessTokenLoad,
    @Param("id") id: string,
    @Body(new ValidateParameters()) postData: BloggerControllerPostBlogsPostByBlogIdEntity,
  ) {
    console.log("Delete inputData:", tokenLoad, id, postData);

    let command = new BloggerDeleteBlogsByIdCommand(tokenLoad, id);
    let result = await this.comandBus.execute<BloggerDeleteBlogsByIdCommand, number>(command);
    return;
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
    let command = new BloggerPostBlogCommand(tokenLoad.id, tokenLoad.login, blog.name, blog.description, blog.websiteUrl);
    let result = await this.comandBus.execute<BloggerPostBlogCommand, BloggerPostNewBlogResult>(command);

    return result;
  }

  @Get("")
  public async GetBlogs() {
    return "get";
  }
}
