import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { BlogCreateEntity } from './entities/SuperAdminCreateBlogEntity';
import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from './entities/SuperAdminCreatePostEntity';
import { DataBaseException } from './exceptions/SuperAdminControllerExceptionFilter';
import { _WAIT_ } from 'src/settings';
import { SuperAdminGuard } from 'src/guards/admin/GuardAdmin';
import { InputPaginator } from 'src/paginator/entities/QueryPaginatorInputEntity';
import { QueryPaginator } from 'src/paginator/QueryPaginatorDecorator';
import { OutputPaginator } from 'src/paginator/entities/QueryPaginatorUutputEntity';
import { ValidateParameters } from 'src/pipes/ValidationPipe';
import { BlogsRepoService } from 'src/features/blogs/repo/blogs.repo.service';
import { PostsRepoService } from 'src/features/posts/repo/PostsRepoService';
import { BlogRepoEntity } from 'src/features/blogs/repo/entities/blogs.repo.entity';
import { PostRepoEntity } from 'src/features/posts/repo/entity/PostsRepoEntity';
import { PostGetResultEntity } from 'src/features/posts/service/entities/PostsControllerGetResultEntity';

@Controller('sa/blogs')
@UseGuards(SuperAdminGuard)
export class SuperAdminBlogController {
  constructor(
    private blogRepo: BlogsRepoService,
    private postRepo: PostsRepoService,
  ) {}

  //get -> hometask_13/api/blogs
  @Get()
  async getBlogs(
    @Query('searchNameTerm') nameTerm: string | undefined,
    @Query('sortBy') sortBy: keyof BlogRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let { count, blogs } = await this.blogRepo.CountAndReadManyByName(
      nameTerm,
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
      true,
    );

    let pagedBlogs = new OutputPaginator(count, blogs, paginator);
    await _WAIT_();
    return pagedBlogs;
  }

  //post -> hometask_13/api/blogs
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async saveBlog(@Body(new ValidateParameters()) blog: BlogCreateEntity) {
    await _WAIT_();
    let savedBlog = await this.blogRepo.Create(blog, true);

    return savedBlog;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdateBlog(
    @Param('id') id: string,
    @Body(new ValidateParameters()) blogData: BlogCreateEntity,
  ) {
    let updatedBlog = await this.blogRepo.UpdateById(+id, blogData, true);

    await _WAIT_();

    if (updatedBlog) {
      return updatedBlog;
    }

    throw new NotFoundException();
  }

  //delete -> /hometask_13/api/blogs/{id}
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeleteBlog(@Param('id') id: string) {
    let count = await this.blogRepo.DeleteOne(+id);

    await _WAIT_();

    if (count > 0) return;

    throw new NotFoundException();
  }

  //post -> hometask_13/api/blogs/{blogId}/posts
  @Post(':id/posts')
  // @UseFilters(DataBaseException)
  @HttpCode(HttpStatus.CREATED)
  async SaveBlogsPosts(
    @Param('id') id: string,
    @Body(new ValidateParameters())
    postData: PostCreateEntity,
  ) {
    let createdPost = (await this.postRepo.Create(
      postData,
      id,
      true,
    )) as PostGetResultEntity;

    createdPost.InitLikes();
    await _WAIT_();

    return createdPost;
  }

  @Get(':id/posts')
  @UseFilters(DataBaseException)
  async GetBlogsPosts(
    @Param('id') id: string,
    @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
    @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
    @QueryPaginator() paginator: InputPaginator,
  ) {
    let { count, posts } = await this.postRepo.ReadManyByBlogId(
      +id,
      sortBy,
      sortDirecrion,
      paginator.skipElements,
      paginator.pageSize,
      true,
    );
    let pagedPosts = new OutputPaginator(count, posts, paginator);
    await _WAIT_();
    return pagedPosts;
  }

  //put -> //sa/blogs/:blogId/posts/:postId
  @Put(':blogId/posts/:postId')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body(new ValidateParameters())
    postData: PostCreateEntity,
  ) {
    let updatePost = await this.postRepo.UpdateOne(+postId, +blogId, postData);
    await _WAIT_();
    if (updatePost) return;

    throw new NotFoundException();
  }

  //delete -> //sa/blogs/:blogId/posts/:postId
  @Delete(':blogId/posts/:postId')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async DeletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    let updatePost = await this.postRepo.DeleteOne(+postId, +blogId);
    await _WAIT_();
    if (updatePost > 0) return;

    throw new NotFoundException();
  }
}
