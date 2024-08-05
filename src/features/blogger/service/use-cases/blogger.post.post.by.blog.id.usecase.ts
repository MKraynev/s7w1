import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtServiceUserAccessTokenLoad } from "../../../../jwt/entities/JwtServiceAccessTokenLoad";
import { BloggerControllerPostBlogsPostByBlogIdEntity } from "../../controller/entities/blogger.controller.post.blogs.post.by.blog.id.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource } from "typeorm";
import { UserRepoEntity } from "../../../users/repo/entities/UsersRepoEntity";
import { UserToBlogRepoEntity } from "../../repo/entities/user.to.blog.repo.entity";
import { PostRepoEntity } from "../../../posts/repo/entity/PostsRepoEntity";
import { PostCreateEntity } from "../../../posts/controller/entities/SuperAdminCreatePostEntity";

export class BloggerPostPostByBlogIdCommand {
  public id: number;
  constructor(
    public tokenLoad: JwtServiceUserAccessTokenLoad,
    id: string,
    public postData: BloggerControllerPostBlogsPostByBlogIdEntity,
  ) {
    this.id = +id;
    if (isNaN(this.id)) throw new NotFoundException();
  }
}

export type BloggerPostPostByBlogIdResult = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: any[];
  };
};

@Injectable()
@CommandHandler(BloggerPostPostByBlogIdCommand)
export class BloggerPostPostByBlogIdUseCase implements ICommandHandler<BloggerPostPostByBlogIdCommand, BloggerPostPostByBlogIdResult> {
  constructor(private ds: DataSource) {}

  async execute(command: BloggerPostPostByBlogIdCommand): Promise<BloggerPostPostByBlogIdResult> {
    let user = await this.ds.manager.findOne(UserRepoEntity, { where: { id: +command.id } });
    if (!user) throw new UnauthorizedException();

    let usersBlog = await this.ds.manager.findOne(UserToBlogRepoEntity, {
      where: { blogId: command.id },
      relations: { blog: true },
    });

    if (!usersBlog) throw new NotFoundException();

    if (usersBlog.userId !== +command.tokenLoad.id) throw new ForbiddenException();

    let postObj = PostRepoEntity.Init(
      new PostCreateEntity(command.postData.title, command.postData.shortDescription, command.postData.content),
      command.id,
    );

    let savedPost = await this.ds.manager.save(PostRepoEntity, postObj);

    let result = {
      id: savedPost.id.toString(),
      title: savedPost.title,
      shortDescription: savedPost.shortDescription,
      content: savedPost.content,
      blogId: usersBlog.blogId.toString(),
      blogName: usersBlog.blog.name,
      createdAt: savedPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [],
      },
    };
    return result;
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
