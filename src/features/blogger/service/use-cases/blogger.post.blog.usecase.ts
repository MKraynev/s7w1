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

let Expected = {
  pagesCount: 2,
  page: 1,
  pageSize: 10,
  totalCount: 12,
  items: [
    {
      name: "Timma",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:35.179Z",
      isMembership: false,
      id: "50",
      blogOwnerInfo: { userId: "133", userLogin: "9367lg" },
    },
    {
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:34.317Z",
      isMembership: false,
      id: "49",
      blogOwnerInfo: { userId: "133", userLogin: "9367lg" },
    },
    {
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:33.414Z",
      isMembership: false,
      id: "48",
      blogOwnerInfo: { userId: "133", userLogin: "9367lg" },
    },
    {
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:32.501Z",
      isMembership: false,
      id: "47",
      blogOwnerInfo: { userId: "133", userLogin: "9367lg" },
    },
    {
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:31.602Z",
      isMembership: false,
      id: "46",
      blogOwnerInfo: { userId: "133", userLogin: "9367lg" },
    },
    {
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:30.695Z",
      isMembership: false,
      id: "45",
      blogOwnerInfo: { userId: "133", userLogin: "9367lg" },
    },
    {
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:29.862Z",
      isMembership: false,
      id: "44",
      blogOwnerInfo: { userId: "132", userLogin: "9366lg" },
    },
    {
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:28.955Z",
      isMembership: false,
      id: "43",
      blogOwnerInfo: { userId: "132", userLogin: "9366lg" },
    },
    {
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:28.046Z",
      isMembership: false,
      id: "42",
      blogOwnerInfo: { userId: "132", userLogin: "9366lg" },
    },
    {
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:27.222Z",
      isMembership: false,
      id: "41",
      blogOwnerInfo: { userId: "132", userLogin: "9366lg" },
    },
  ],
};

let Received = {
  pagesCount: 2,
  page: 1,
  pageSize: 10,
  totalCount: 12,
  items: [
    {
      id: "50",
      name: "Timma",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:35.179Z",
      isMembership: false,
    },
    {
      id: "49",
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:34.317Z",
      isMembership: false,
    },
    {
      id: "48",
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:33.414Z",
      isMembership: false,
    },
    {
      id: "47",
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:32.501Z",
      isMembership: false,
    },
    {
      id: "46",
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:31.602Z",
      isMembership: false,
    },
    {
      id: "45",
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:30.695Z",
      isMembership: false,
    },
    {
      id: "44",
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:29.862Z",
      isMembership: false,
    },
    {
      id: "43",
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:28.955Z",
      isMembership: false,
    },
    {
      id: "42",
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:28.046Z",
      isMembership: false,
    },
    {
      id: "41",
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-07-22T20:34:27.222Z",
      isMembership: false,
    },
  ],
};
