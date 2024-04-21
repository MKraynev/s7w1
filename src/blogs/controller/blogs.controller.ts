import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseFilters,
} from '@nestjs/common';
import { BlogsRepoService } from '../repo/blogs.repo.service';
import { BlogRepoEntity } from '../repo/entities/blogs.repo.entity';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogRepo: BlogsRepoService,
    // private comandBus: CommandBus,
  ) {}

  // @Get()
  // async GetAll(
  //   @Query('searchNameTerm') nameTerm: string | undefined,
  //   @Query('sortBy') sortBy: keyof BlogRepoEntity = 'createdAt',
  //   @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
  //   @QueryPaginator() paginator: InputPaginator,
  // ) {
  //   let { count, blogs } = await this.blogRepo.CountAndReadManyByName(
  //     nameTerm,
  //     sortBy,
  //     sortDirecrion,
  //     paginator.skipElements,
  //     paginator.pageSize,
  //     true,
  //   );

  //   let pagedBlogs = new OutputPaginator(count, blogs, paginator);
  //   return pagedBlogs;
  // }

  @Get(':id')
  public async GetById(@Param('id') id: string) {
    let numId = +id;
    let blog = await this.blogRepo.ReadById(numId, true);

    if (blog) return blog;

    throw new NotFoundException();
  }

  //get -> hometask_13/api/blogs/{blogId}/posts
  // @Get(':id/posts')
  // @UseFilters(DataBaseException)
  // async GetBlogsPosts(
  //   @Param('id') id: string,
  //   @Query('sortBy') sortBy: keyof PostRepoEntity = 'createdAt',
  //   @Query('sortDirection') sortDirecrion: 'desc' | 'asc' = 'desc',
  //   @QueryPaginator() paginator: InputPaginator,
  //   @ReadAccessToken(TokenExpectation.Possibly)
  //   tokenLoad: JwtServiceUserAccessTokenLoad | undefined,
  // ) {
  //   let { count, postInfos } = await this.comandBus.execute<
  //     PostServiceGetManyCommand,
  //     { count: number; postInfos: PostInfo[] }
  //   >(
  //     new PostServiceGetManyCommand(
  //       id,
  //       tokenLoad?.id,
  //       sortBy,
  //       sortDirecrion,
  //       paginator.skipElements,
  //       paginator.pageSize,
  //     ),
  //   );

  //   let pagedPosts = new OutputPaginator(count, postInfos, paginator);

  //   return pagedPosts;
  // }
}
