import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource } from "typeorm";
import { BlogRepoEntity } from "../../features/blogs/repo/entities/blogs.repo.entity";
import { InputPaginator } from "../../paginator/entities/QueryPaginatorInputEntity";
import { UserToBlogRepoEntity } from "../../features/blogger/repo/entities/user.to.blog.repo.entity";
import { UserRepoEntity } from "../../features/users/repo/entities/UsersRepoEntity";

export class SuperAdminBlogsGetBlogsCommand {
  constructor(
    public nameTerm: string | undefined = undefined,
    public sortBy: keyof BlogRepoEntity = "createdAt",
    public sortDirecrion: "desc" | "asc" = "desc",
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
export class SuperAdminBlogsGetBlogsUseCase implements ICommandHandler<SuperAdminBlogsGetBlogsCommand, any> {
  constructor(private ds: DataSource) {}

  async execute(command: SuperAdminBlogsGetBlogsCommand): Promise<any> {
    const query = this.ds
      .createQueryBuilder(BlogRepoEntity, "b")
      .leftJoinAndSelect(UserToBlogRepoEntity, "utb", 'b.id = utb."blogId"')
      .leftJoinAndSelect(UserRepoEntity, "u", 'utb."userId" = u.id')
      .where("b.name ILIKE :searchNameTerm", { searchNameTerm: `%${command.nameTerm}%` })
      .limit(10)
      .select([
        'b.id AS "id"',
        'b.name AS "name"',
        'b.description AS "description"',
        'b."websiteUrl" AS "websiteUrl"',
        'b."createdAt" AS "createdAt"',
        'b."isMembership" AS "isMembership"',
        "json_build_object(" + "'userId', u.id," + "'userLogin', u.login" + ') AS "blogOwnerInfo"',
      ]);

    const results = await query.getRawMany();

    return results;
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
