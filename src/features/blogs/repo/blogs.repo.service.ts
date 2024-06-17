import { InjectRepository } from "@nestjs/typeorm";
import { BlogRepoEntity } from "./entities/blogs.repo.entity";
import { FindOptionsOrder, FindOptionsWhere, Raw, Repository } from "typeorm";
import { BlogGetResultEntity } from "../controller/entities/blogs.controller.get.result.entity";
import { BlogCreateEntity } from "../controller/entities/blogs.super.admin.create.entity";

export class BlogsRepoService {
  constructor(
    @InjectRepository(BlogRepoEntity)
    private blogsRepo: Repository<BlogRepoEntity>,
  ) {}

  public async CountAndReadManyByName(
    namePattern: string,
    sortBy: keyof BlogRepoEntity = "createdAt",
    sortDirection: "asc" | "desc" = "desc",
    skip: number = 0,
    limit: number = 10,
    format: boolean = false,
  ): Promise<{
    count: number;
    blogs: BlogRepoEntity[] | BlogGetResultEntity[];
  }> {
    let nameSearchPatten: FindOptionsWhere<BlogRepoEntity> = {};

    let caseInsensitiveSearchPattern = (column: string, inputValue: string) => `LOWER(${column}) Like '%${inputValue.toLowerCase()}%'`;

    if (namePattern) nameSearchPatten["name"] = Raw((alias) => caseInsensitiveSearchPattern(alias, namePattern));

    let orderObj: FindOptionsOrder<BlogRepoEntity> = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.blogsRepo.count({ where: nameSearchPatten });
    let blogs = await this.blogsRepo.find({
      where: nameSearchPatten,
      order: orderObj,
      skip: skip,
      take: limit,
    });

    if (sortBy === "name" && sortDirection === "asc") {
      //TODO sort через БД не проходит тесты
      if (sortDirection === "asc") {
        let sortedList = blogs.sort((blog_1, blog_2) => (blog_1.name > blog_2.name ? 1 : -1));
        blogs = sortedList;
      }
    }
    if (format) {
      let formatedBlogs = blogs.map((blogDb) => new BlogGetResultEntity(blogDb));

      return { count, blogs: formatedBlogs };
    }

    return { count, blogs };
  }

  public async ReadById(id: number, format: boolean = false): Promise<BlogRepoEntity | BlogGetResultEntity> {
    let blog = await this.blogsRepo.findOneBy({ id: id });

    if (blog && format) return new BlogGetResultEntity(blog);

    return blog;
  }

  public async Create(blogData: BlogCreateEntity, format: boolean = false): Promise<BlogRepoEntity | BlogGetResultEntity> {
    let blog = BlogRepoEntity.Init(blogData);

    let savedBlog = await this.blogsRepo.save(blog);

    if (format) return new BlogGetResultEntity(savedBlog);

    return savedBlog;
  }

  public async Update(blog: BlogRepoEntity, format: boolean = false): Promise<BlogRepoEntity | BlogGetResultEntity> {
    let updatedBlog = await this.blogsRepo.save(blog);
    if (format) return new BlogGetResultEntity(updatedBlog);

    return updatedBlog;
  }

  public async UpdateById(blogId: number, blogData: BlogCreateEntity, format: boolean = false) {
    let blog = await this.blogsRepo.findOneBy({ id: blogId });

    if (!blog) return null;

    blog.name = blogData.name;
    blog.description = blogData.description;
    blog.websiteUrl = blogData.websiteUrl;

    let savedBlog = await this.blogsRepo.save(blog);

    if (format) return new BlogGetResultEntity(savedBlog);

    return savedBlog;
  }

  public async DeleteAll() {
    let deleteAll = await this.blogsRepo.delete({});
    //делать удаление последовательно через raw sql

    return deleteAll.affected;
  }
  public async DeleteOne(id: number) {
    let del = await this.blogsRepo.delete({ id: id });

    return del.affected;
  }
}
