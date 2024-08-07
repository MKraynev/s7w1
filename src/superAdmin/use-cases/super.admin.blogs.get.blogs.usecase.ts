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

    if (command.nameTerm) query = query.where("b.name ILIKE :searchNameTerm", { searchNameTerm: `%${command.nameTerm}%` });

    let count = await query.getCount();

    if (count < command.paginator.skipElements) {
      let newSkipElements = count - command.paginator.pageSize;

      //Если новое значение отрицательное, устанавливаем его в 0
      command.paginator.skipElements = newSkipElements > 0 ? newSkipElements : 0;
    }

    query = query.offset(command.paginator.skipElements).limit(command.paginator.pageSize);

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
