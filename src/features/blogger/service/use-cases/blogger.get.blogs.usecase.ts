import { Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DataSource, FindManyOptions } from "typeorm";
import { BlogRepoEntity } from "../../../blogs/repo/entities/blogs.repo.entity";

export class BloggerGetBlogsCommand {
  constructor(
    public userId: string,
    public userLogin: string,
    public searchNameTerm: string,
    public sortBy: string,
    public sortDirection: string,
    public pageNumber: number,
    public pageSize: number,
  ) {}
}

export class BlogInfo {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean = true,
  ) {}
}

@Injectable()
@CommandHandler(BloggerGetBlogsCommand)
export class BloggerGetBlogsUseCase implements ICommandHandler<BloggerGetBlogsCommand, { count: number; items: BlogInfo[] }> {
  constructor(ds: DataSource) {}

  execute(command: BloggerGetBlogsCommand): Promise<{ count: number; items: BlogInfo[] }> {
    let searchPattern: FindManyOptions<BlogRepoEntity> = {};

    throw new Error("Method not implemented.");
  }
}
