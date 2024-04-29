import { TestingModule } from '@nestjs/testing';

// describe('Blogs test', () => {
//   let module: TestingModule;

//   let blogRepo: BlogsRepoService;
//   let postRepo: PostsRepoService;

//   beforeAll(async () => {
//     module = await TestBlogsRepoTestingModule.compile();

//     await module.init();

//     blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
//     postRepo = module.get<PostsRepoService>(PostsRepoService);
//   });

//   afterAll(async () => {
//     await module.close();
//   });

//   it('Post.Create()', async () => {
//     await blogRepo.DeleteAll();
//     await postRepo.DeleteAll();

//     let blog = new BlogCreateEntity(
//       'some blog',
//       'some desc',
//       'www.someurl.com',
//     );

//     let createdBlog = await blogRepo.Create(blog);
//     expect(createdBlog).toMatchObject(blog);

//     let post = new PostCreateEntity(
//       'some title',
//       'some short',
//       'some content lorem lorem lorem lorem lorem lorem',
//     );
//     let createPost = await postRepo.Create(post, createdBlog.id.toString());
//     expect(createPost).toMatchObject(post);
//   });

//   it('Blog.Create() id not exist => exception', async () => {
//     await blogRepo.DeleteAll();
//     let blog = new BlogCreateEntity(
//       'blog name',
//       'blog description',
//       'someweb.com',
//     );
//     let createBlog = await blogRepo.Create(blog);

//     expect(createBlog).toMatchObject(blog);
//   });

//   it('Blog.ReadManyByName()', async () => {
//     await blogRepo.DeleteAll();
//     await postRepo.DeleteAll();

//     let blog = new BlogCreateEntity('blog', 'some desc', 'www.someurl.com');
//     let blog2 = new BlogCreateEntity('blooooo', 'some desc', 'www.someurl.com');
//     let blog3 = new BlogCreateEntity(
//       'blllllll',
//       'some desc',
//       'www.someurl.com',
//     );
//     let blog4 = new BlogCreateEntity('zxczxc', 'some desc', 'www.someurl.com');

//     let createdBlog = await blogRepo.Create(blog);
//     let createdBlog2 = await blogRepo.Create(blog2);
//     let createdBlog3 = await blogRepo.Create(blog3);
//     let createdBlog4 = await blogRepo.Create(blog4);

//     let readmany = await blogRepo.CountAndReadManyByName(
//       'bl',
//       'createdAt',
//       'asc',
//     );
//     expect(readmany.count).toEqual(3);
//     expect(readmany.blogs).toEqual([createdBlog, createdBlog2, createdBlog3]);
//   });
// });
