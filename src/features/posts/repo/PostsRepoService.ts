import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PostRepoEntity } from './entity/PostsRepoEntity';
import { NotFoundException } from '@nestjs/common';
import { PostGetResultEntity } from '../service/entities/PostsControllerGetResultEntity';
import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from '../controller/entities/SuperAdminCreatePostEntity';
import { BlogsRepoService } from '../../blogs/repo/blogs.repo.service';
import { BlogRepoEntity } from '../../blogs/repo/entities/blogs.repo.entity';

export class PostsRepoService {
  constructor(
    @InjectRepository(PostRepoEntity)
    private postsRepo: Repository<PostRepoEntity>,
    private blogRepo: BlogsRepoService,
  ) {}

  public async ReadMany(
    sortBy: keyof PostRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
    format: boolean = false,
  ) {
    let orderObj: any = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.postsRepo.count({});
    let posts = await this.postsRepo.find({
      where: {},
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { blog: true },
    });
    if (format) {
      let formatedPosts = await Promise.all(
        posts.map(async (post) => {
          let fpost = new PostGetResultEntity(post);
          let userstatus;
          //TODO доделать обсчет лайков
          fpost.InitLikes();
          return fpost;
        }),
      );

      return { count, posts: formatedPosts };
    }

    return { count, posts };
  }

  public async ReadManyByBlogId(
    blogId: number,
    sortBy: keyof PostRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
    format: boolean = false,
  ) {
    let orderObj: any = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.postsRepo.count({ where: { blogId: blogId } });
    let posts = await this.postsRepo.find({
      where: { blogId: blogId },
      select: [],
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { blog: true },
    });
    if (format) {
      let formatedPosts = posts.map((post) => {
        let fpost = new PostGetResultEntity(post);
        fpost.InitLikes();
        return fpost;
      });

      return { count, posts: formatedPosts };
    }

    //TODO добавить селект имени блога
    return { count, posts };
  }

  public async Create(
    postData: PostCreateEntity | PostWithExpectedBlogIdCreateEntity,
    blogId: string,
    format: boolean = false,
  ): Promise<PostRepoEntity | PostGetResultEntity> {
    let blogId_num = +blogId;
    let post = PostRepoEntity.Init(postData, blogId_num);
    try {
      let blog = (await this.blogRepo.ReadById(blogId_num)) as BlogRepoEntity;
      post.blog = blog;
      post.blogName = blog.name;
      let savedPost = await this.postsRepo.save(post);
      let fulfieldPost = await this.postsRepo.findOne({
        where: { id: savedPost.id },
        relations: { blog: true },
      });

      if (format) {
        let fpost = new PostGetResultEntity(fulfieldPost);
        fpost.InitLikes();
        return fpost;
      }
      return fulfieldPost;
    } catch (e) {
      throw new NotFoundException();
    }
  }

  public async DeleteAll() {
    let del = await this.postsRepo.delete({});
    return del.affected;
  }

  public async IdExist(id: string): Promise<boolean> {
    let count = await this.postsRepo.count({ where: { id: +id } });
    return count === 1;
  }

  public async ReadById(id: string, format: boolean = false) {
    let post = await this.postsRepo.findOne({
      where: { id: +id },
      relations: { blog: true },
    });

    if (format && post) {
      let fpost = new PostGetResultEntity(post);
      return fpost;
    }
    return post;
  }

  public async UpdateOne(
    postId: number,
    blogId: number,
    postData: PostCreateEntity,
    format: boolean = false,
  ) {
    let post = await this.postsRepo.findOne({
      where: { id: postId, blogId: blogId },
    });

    if (!post) return null;

    post.content = postData.content;
    post.shortDescription = postData.shortDescription;
    post.title = postData.title;

    let savedPost = await this.postsRepo.save(post);

    return savedPost;
  }

  public async DeleteOne(postId: number, blogId: number) {
    let post = await this.postsRepo.delete({ id: postId, blogId: blogId });

    return post.affected;
  }
}
