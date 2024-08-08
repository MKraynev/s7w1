import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtServiceUserAccessTokenLoad } from "../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { BlogCreateEntity } from "../../../blogs/controller/entities/blogs.super.admin.create.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource, Int32 } from "typeorm";
import { UserRepoEntity } from "../../../users/repo/entities/UsersRepoEntity";
import { BlogRepoEntity } from "../../../blogs/repo/entities/blogs.repo.entity";
import { UserToBlogRepoEntity } from "../../repo/entities/user.to.blog.repo.entity";

export class BloggerPutBlogsByIdCommand {
  public id: number;
  constructor(
    public tokenLoad: JwtServiceUserAccessTokenLoad,
    id: string,
    public newBlogData: BlogCreateEntity,
  ) {
    this.id = +id;
    if (isNaN(this.id)) throw new NotFoundException();
  }
}

@Injectable()
@CommandHandler(BloggerPutBlogsByIdCommand)
export class BloggerPutBlogsByIdUseCase implements ICommandHandler<BloggerPutBlogsByIdCommand, boolean> {
  constructor(private ds: DataSource) {}

  async execute(command: BloggerPutBlogsByIdCommand): Promise<boolean> {
    let user = await this.ds.manager.findOne(UserRepoEntity, { where: { id: +command.tokenLoad.id } });
    if (!user) throw new UnauthorizedException();

    let usersBlog = await this.ds.manager.findOne(UserToBlogRepoEntity, {
      where: { userId: +command.tokenLoad.id, blogId: command.id },
      relations: { blog: true },
    });
    if (!usersBlog) throw new ForbiddenException(); //include not found + userId != blog.createrId

    usersBlog.blog.name = command.newBlogData.name;
    usersBlog.blog.description = command.newBlogData.description;
    usersBlog.blog.websiteUrl = command.newBlogData.websiteUrl;

    let updatedBlog = await this.ds.manager.save(BlogRepoEntity, usersBlog.blog);

    return true;
  }
}
