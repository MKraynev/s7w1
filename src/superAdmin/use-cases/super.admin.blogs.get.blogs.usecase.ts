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

    if (count < (command.paginator.pageNumber + 1) * command.paginator.pageSize)
      command.paginator.skipElements = count - command.paginator.pageSize;

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

/*
sort params: undefined createdAt DESC InputPaginator {
  sortDirection: 'desc',
  pageNumber: 3,
  pageSize: 3,
  skipElements: 6
}
*/
let Expected = {
  pagesCount: 4,
  page: 3,
  pageSize: 3,
  totalCount: 12,
  items: [
    {
      name: "John",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:23:17.395Z",
      isMembership: false,
      id: "317",
      blogOwnerInfo: { userId: "189", userLogin: "6794lg" },
    },
    {
      name: "Gggrrttt",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:23:16.446Z",
      isMembership: false,
      id: "316",
      blogOwnerInfo: { userId: "189", userLogin: "6794lg" },
    },
    {
      name: "Mima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:23:15.526Z",
      isMembership: false,
      id: "315",
      blogOwnerInfo: { userId: "189", userLogin: "6794lg" },
    },
  ],
};

let Received = {
  pagesCount: 4,
  page: 3,
  pageSize: 3,
  totalCount: 12,
  items: [
    {
      name: "Timma",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:23:22.804Z",
      isMembership: false,
      id: "323",
      blogOwnerInfo: { userId: "190", userLogin: "6795lg" },
    },
    {
      name: "Tima",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:23:21.888Z",
      isMembership: false,
      id: "322",
      blogOwnerInfo: { userId: "190", userLogin: "6795lg" },
    },
    {
      name: "Alex",
      description: "description",
      websiteUrl: "https://someurl.com",
      createdAt: "2024-08-06T21:23:20.977Z",
      isMembership: false,
      id: "321",
      blogOwnerInfo: { userId: "190", userLogin: "6795lg" },
    },
  ],
};
