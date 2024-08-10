import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource } from "typeorm";
import { UserRepoEntity } from "../../../users/repo/entities/UsersRepoEntity";
import { BlogRepoEntity } from "../../../blogs/repo/entities/blogs.repo.entity";
import { BlogCreateEntity } from "../../../blogs/controller/entities/blogs.super.admin.create.entity";
import { UserToBlogRepoEntity } from "../../repo/entities/user.to.blog.repo.entity";

export class BloggerPostBlogCommand {
  constructor(
    public userId: string,
    public login: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export class BloggerPostNewBlogResult {
  public id: string;
  constructor(
    id: number,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean = true,
  ) {
    this.id = id.toString();
  }
}

@Injectable()
@CommandHandler(BloggerPostBlogCommand)
export class BloggerPostBlogUseCase implements ICommandHandler<BloggerPostBlogCommand, BloggerPostNewBlogResult> {
  constructor(private ds: DataSource) {}

  async execute(command: BloggerPostBlogCommand): Promise<BloggerPostNewBlogResult> {
    try {
      let user = await this.ds.manager.findOne(UserRepoEntity, { where: { id: +command.userId } });
      if (!user) throw new UnauthorizedException();

      let savedBlog = await this.ds.manager.save(
        BlogRepoEntity,
        BlogRepoEntity.Init(new BlogCreateEntity(command.name, command.description, command.websiteUrl)),
      );

      let savedLink = await this.ds.manager.save(UserToBlogRepoEntity, UserToBlogRepoEntity.Init(user, savedBlog));

      return new BloggerPostNewBlogResult(
        savedBlog.id,
        savedBlog.name,
        savedBlog.description,
        savedBlog.websiteUrl,
        savedBlog.createdAt,
        false,
      );
    } catch (e) {
      console.log(e);
      throw new ForbiddenException();
    }
  }
}
