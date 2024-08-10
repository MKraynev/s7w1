import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtServiceUserAccessTokenLoad } from "../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { DataSource } from "typeorm";
import { UserRepoEntity } from "../../../users/repo/entities/UsersRepoEntity";
import { UserToBlogRepoEntity } from "../../repo/entities/user.to.blog.repo.entity";
import { BlogRepoEntity } from "../../../blogs/repo/entities/blogs.repo.entity";

export class BloggerDeleteBlogsByIdCommand {
  public id: number;
  constructor(
    public tokenLoad: JwtServiceUserAccessTokenLoad,
    id: string,
  ) {
    if (isNaN(+id)) throw new NotFoundException();
    this.id = +id;
  }
}

@Injectable()
@CommandHandler(BloggerDeleteBlogsByIdCommand)
export class BloggerDeleteBlogsByIdUseCase implements ICommandHandler<BloggerDeleteBlogsByIdCommand, number> {
  constructor(private ds: DataSource) {}

  async execute(command: BloggerDeleteBlogsByIdCommand): Promise<number> {
    let user = await this.ds.manager.findOne(UserRepoEntity, { where: { id: +command.tokenLoad.id } });
    if (!user) throw new UnauthorizedException();

    let usersBlog = await this.ds.manager.findOne(UserToBlogRepoEntity, {
      where: { blogId: command.id },
      relations: { blog: true, user: true },
    });

    if (!usersBlog) throw new NotFoundException();

    if (usersBlog.userId !== +command.tokenLoad.id) throw new ForbiddenException();

    let delResult = await this.ds.manager.delete(BlogRepoEntity, usersBlog.blog);

    return delResult.affected;
  }
}
