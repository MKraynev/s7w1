import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource, SelectQueryBuilder } from "typeorm";
import { BlogRepoEntity } from "../../features/blogs/repo/entities/blogs.repo.entity";
import { InputPaginator } from "../../paginator/entities/QueryPaginatorInputEntity";
import { UserToBlogRepoEntity } from "../../features/blogger/repo/entities/user.to.blog.repo.entity";
import { UserRepoEntity } from "../../features/users/repo/entities/UsersRepoEntity";

export class SuperAdminBlogsGetBlogsCommand {
  constructor(
    public nameTerm: string | undefined = undefined,
    public sortBy: keyof BlogRepoEntity = "createdAt",
    public sortDirecrion: "ASC" | "DESC" = "DESC",
    public paginator: InputPaginator,
  ) {}
}

export class SuperAdminBlogsGetBlogsUseCaseResult {
  public blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
    public id: string,
    blogOwnerUserId: number,
    blogOwnerUserLogin: string,
  ) {
    this.blogOwnerInfo.userId = blogOwnerUserId.toString();
    this.blogOwnerInfo.userLogin = blogOwnerUserLogin;
  }
}

@Injectable()
@CommandHandler(SuperAdminBlogsGetBlogsCommand)
export class SuperAdminBlogsGetBlogsUseCase implements ICommandHandler<SuperAdminBlogsGetBlogsCommand, { count: number; blogs: any }> {
  constructor(private ds: DataSource) {}

  async execute(command: SuperAdminBlogsGetBlogsCommand): Promise<{ count: number; blogs: any }> {
    let query = this.ds
      .createQueryBuilder(BlogRepoEntity, "b")
      .leftJoinAndSelect(UserToBlogRepoEntity, "utb", 'b.id = utb."blogId"')
      .leftJoinAndSelect(UserRepoEntity, "u", 'utb."userId" = u.id')
      .limit(command.paginator.pageSize)
      .select([
        'b.id AS "id"',
        'b.name AS "name"',
        'b.description AS "description"',
        'b."websiteUrl" AS "websiteUrl"',
        'b."createdAt" AS "createdAt"',
        'b."isMembership" AS "isMembership"',
        "json_build_object('userId', u.id, 'userLogin', u.login) AS \"blogOwnerInfo\"",
      ])
      .orderBy(`b.${command.sortBy}`, command.sortDirecrion);

    if (command.nameTerm) query = query.where("b.name ILIKE :searchNameTerm", { searchNameTerm: `%${command.nameTerm}%` });

    let count = await query.getCount();
    if (count < (command.paginator.pageNumber + 1) * command.paginator.pageSize)
      command.paginator.skipElements = count - command.paginator.pageSize;

    query = query.skip(command.paginator.skipElements);
    const results = (await query.getRawMany()) as {
      id: number;
      name: string;
      description: string;
      websiteUrl: string;
      createdAt: string;
      isMembership: boolean;
      blogOwnerInfo: {
        userId: number;
        userLogin: string;
      };
    }[];

    const formatedResult = results.map((blogInfo) => {
      return {
        name: blogInfo.name,
        description: blogInfo.description,
        websiteUrl: blogInfo.websiteUrl,
        createdAt: blogInfo.createdAt,
        isMembership: blogInfo.isMembership,
        id: blogInfo.id.toString(),
        blogOwnerInfo: {
          userId: blogInfo.blogOwnerInfo.userId.toString(),
          userLogin: blogInfo.blogOwnerInfo.userLogin,
        },
      };
    });

    return { count: count, blogs: formatedResult };
  }
}
/*
SELECT 
    b.id AS "id",
    b.name AS "name",
    b.description AS "description",
    b."websiteUrl" AS "websiteUrl",
    b."createdAt" AS "createdAt",
    b."isMembership" AS "isMembership",
    json_build_object(
        'userId', u.id,
        'userLogin', u.login
    ) AS "blogOwnerInfo"
FROM 
    public."Blogs" b
JOIN 
    public."UserToBlogs" utb ON b.id = utb."blogId"
JOIN 
    public."Users" u ON utb."userId" = u.id;

*/

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
      createdAt: "2024-08-06T21:07:45.095Z",
      isMembership: false,
      id: "284",
      blogOwnerInfo: { userId: "182", userLogin: "9148lg" },
    },
    {
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:44.192Z",
      isMembership: false,
      id: "283",
      blogOwnerInfo: { userId: "182", userLogin: "9148lg" },
    },
    {
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:43.277Z",
      isMembership: false,
      id: "282",
      blogOwnerInfo: { userId: "182", userLogin: "9148lg" },
    },
    {
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:42.369Z",
      isMembership: false,
      id: "281",
      blogOwnerInfo: { userId: "182", userLogin: "9148lg" },
    },
    {
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:41.461Z",
      isMembership: false,
      id: "280",
      blogOwnerInfo: { userId: "182", userLogin: "9148lg" },
    },
    {
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:40.541Z",
      isMembership: false,
      id: "279",
      blogOwnerInfo: { userId: "182", userLogin: "9148lg" },
    },
    {
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:39.621Z",
      isMembership: false,
      id: "278",
      blogOwnerInfo: { userId: "181", userLogin: "9147lg" },
    },
    {
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:38.745Z",
      isMembership: false,
      id: "277",
      blogOwnerInfo: { userId: "181", userLogin: "9147lg" },
    },
    {
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:37.833Z",
      isMembership: false,
      id: "276",
      blogOwnerInfo: { userId: "181", userLogin: "9147lg" },
    },
    {
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:36.953Z",
      isMembership: false,
      id: "275",
      blogOwnerInfo: { userId: "181", userLogin: "9147lg" },
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
      id: 284,
      name: "Timma",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:45.095Z",
      isMembership: false,
      blogOwnerInfo: { userId: 182, userLogin: "9148lg" },
    },
    {
      id: 283,
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:44.192Z",
      isMembership: false,
      blogOwnerInfo: { userId: 182, userLogin: "9148lg" },
    },
    {
      id: 282,
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:43.277Z",
      isMembership: false,
      blogOwnerInfo: { userId: 182, userLogin: "9148lg" },
    },
    {
      id: 281,
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:42.369Z",
      isMembership: false,
      blogOwnerInfo: { userId: 182, userLogin: "9148lg" },
    },
    {
      id: 280,
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:41.461Z",
      isMembership: false,
      blogOwnerInfo: { userId: 182, userLogin: "9148lg" },
    },
    {
      id: 279,
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:40.541Z",
      isMembership: false,
      blogOwnerInfo: { userId: 182, userLogin: "9148lg" },
    },
    {
      id: 278,
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:39.621Z",
      isMembership: false,
      blogOwnerInfo: { userId: 181, userLogin: "9147lg" },
    },
    {
      id: 277,
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:38.745Z",
      isMembership: false,
      blogOwnerInfo: { userId: 181, userLogin: "9147lg" },
    },
    {
      id: 276,
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:37.833Z",
      isMembership: false,
      blogOwnerInfo: { userId: 181, userLogin: "9147lg" },
    },
    {
      id: 275,
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:07:36.953Z",
      isMembership: false,
      blogOwnerInfo: { userId: 181, userLogin: "9147lg" },
    },
  ],
};
