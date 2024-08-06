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
    const results = await query.getRawMany();

    return { count: count, blogs: results };
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
      createdAt: "2024-08-06T20:12:06.630Z",
      isMembership: false,
      id: "245",
      blogOwnerInfo: { userId: "174", userLogin: "712lg" },
    },
    {
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:05.762Z",
      isMembership: false,
      id: "244",
      blogOwnerInfo: { userId: "174", userLogin: "712lg" },
    },
    {
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:04.855Z",
      isMembership: false,
      id: "243",
      blogOwnerInfo: { userId: "174", userLogin: "712lg" },
    },
    {
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:03.990Z",
      isMembership: false,
      id: "242",
      blogOwnerInfo: { userId: "174", userLogin: "712lg" },
    },
    {
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:03.082Z",
      isMembership: false,
      id: "241",
      blogOwnerInfo: { userId: "174", userLogin: "712lg" },
    },
    {
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:02.135Z",
      isMembership: false,
      id: "240",
      blogOwnerInfo: { userId: "174", userLogin: "712lg" },
    },
    {
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:01.214Z",
      isMembership: false,
      id: "239",
      blogOwnerInfo: { userId: "173", userLogin: "711lg" },
    },
    {
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:00.294Z",
      isMembership: false,
      id: "238",
      blogOwnerInfo: { userId: "173", userLogin: "711lg" },
    },
    {
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:11:59.370Z",
      isMembership: false,
      id: "237",
      blogOwnerInfo: { userId: "173", userLogin: "711lg" },
    },
    {
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:11:58.461Z",
      isMembership: false,
      id: "236",
      blogOwnerInfo: { userId: "173", userLogin: "711lg" },
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
      id: "245",
      name: "Timma",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:06.630Z",
      isMembership: false,
    },
    {
      id: "244",
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:05.762Z",
      isMembership: false,
    },
    {
      id: "243",
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:04.855Z",
      isMembership: false,
    },
    {
      id: "242",
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:03.990Z",
      isMembership: false,
    },
    {
      id: "241",
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:03.082Z",
      isMembership: false,
    },
    {
      id: "240",
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:02.135Z",
      isMembership: false,
    },
    {
      id: "239",
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:01.214Z",
      isMembership: false,
    },
    {
      id: "238",
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:12:00.294Z",
      isMembership: false,
    },
    {
      id: "237",
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:11:59.370Z",
      isMembership: false,
    },
    {
      id: "236",
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T20:11:58.461Z",
      isMembership: false,
    },
  ],
};
