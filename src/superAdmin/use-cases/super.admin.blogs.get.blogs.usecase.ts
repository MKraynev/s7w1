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
      .select([
        'b.id AS "id"',
        'b.name AS "name"',
        'b.description AS "description"',
        'b."websiteUrl" AS "websiteUrl"',
        'b."createdAt" AS "createdAt"',
        'b."isMembership" AS "isMembership"',
        "json_build_object('userId', u.id, 'userLogin', u.login) AS \"blogOwnerInfo\"",
      ])
      .orderBy(`b."${command.sortBy}"`, command.sortDirecrion);

    console.log(".orderBy(`b.${command.sortBy}`, command.sortDirecrion):", command.sortBy, command.sortDirecrion);

    if (command.nameTerm) query = query.where("b.name ILIKE :searchNameTerm", { searchNameTerm: `%${command.nameTerm}%` });

    let count = await query.getCount();

    console.log("paginator data:", command.paginator);

    if (count < command.paginator.skipElements) command.paginator.skipElements = count - command.paginator.pageSize;

    console.log("paginator data after culc:", command.paginator);

    console.log("count request:", query.getQuery());

    query = query.offset(command.paginator.skipElements).limit(command.paginator.pageSize);
    console.log("result request:", query.getQuery());
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
      createdAt: "2024-08-07T21:35:16.572Z",
      isMembership: false,
      id: "557",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:15.652Z",
      isMembership: false,
      id: "556",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:14.769Z",
      isMembership: false,
      id: "555",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:13.840Z",
      isMembership: false,
      id: "554",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:12.920Z",
      isMembership: false,
      id: "553",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:12.008Z",
      isMembership: false,
      id: "552",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:11.084Z",
      isMembership: false,
      id: "551",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:10.212Z",
      isMembership: false,
      id: "550",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:09.292Z",
      isMembership: false,
      id: "549",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:08.309Z",
      isMembership: false,
      id: "548",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
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
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:14.769Z",
      isMembership: false,
      id: "555",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Alexey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:13.840Z",
      isMembership: false,
      id: "554",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Andrey",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:12.920Z",
      isMembership: false,
      id: "553",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "Don",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:12.008Z",
      isMembership: false,
      id: "552",
      blogOwnerInfo: { userId: "238", userLogin: "378lg" },
    },
    {
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:11.084Z",
      isMembership: false,
      id: "551",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:10.212Z",
      isMembership: false,
      id: "550",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:09.292Z",
      isMembership: false,
      id: "549",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Dima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:08.309Z",
      isMembership: false,
      id: "548",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "timm",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:07.380Z",
      isMembership: false,
      id: "547",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
    {
      name: "Tim",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-07T21:35:06.447Z",
      isMembership: false,
      id: "546",
      blogOwnerInfo: { userId: "237", userLogin: "377lg" },
    },
  ],
};
