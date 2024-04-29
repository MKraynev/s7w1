import { TestingModule } from '@nestjs/testing';
import { PostsRepoService } from '../PostsRepoService';
import { PostCreateEntity } from '../../controller/entities/SuperAdminCreatePostEntity';

describe('Blogs test', () => {
  // let module: TestingModule;
  // let blogRepo: BlogsRepoService;
  // let postRepo: PostsRepoService;
  // beforeAll(async () => {
  //   module = await TestBlogsRepoTestingModule.compile();
  //   await module.init();
  //   blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
  //   postRepo = module.get<PostsRepoService>(PostsRepoService);
  // });
  // afterAll(async () => {
  //   await module.close();
  // });
  // it('Post.Create()', async () => {
  //   await blogRepo.DeleteAll();
  //   await postRepo.DeleteAll();
  //   let blog = new BlogCreateEntity(
  //     'some blog',
  //     'some desc',
  //     'www.someurl.com',
  //   );
  //   let createdBlog = await blogRepo.Create(blog);
  //   expect(createdBlog).toMatchObject(blog);
  //   let post = new PostCreateEntity(
  //     'some title',
  //     'some short',
  //     'some content lorem lorem lorem lorem lorem lorem',
  //   );
  //   let createPost = await postRepo.Create(post, createdBlog.id.toString());
  //   expect(createPost).toMatchObject(post);
  // });
});
