import { TestingModule } from '@nestjs/testing';
import { LikeForPostRepoService } from '../LikesForPostRepoService';

// describe('Blogs test', () => {
//   let module: TestingModule;

//   let blogRepo: BlogsRepoService;
//   let postRepo: PostsRepoService;
//   let userRepo: UsersRepoService;
//   let likeRepo: LikeForPostRepoService;

//   beforeAll(async () => {
//     module = await TestLikesForPostsRepoTestingModule.compile();

//     await module.init();

//     userRepo = module.get<UsersRepoService>(UsersRepoService);
//     blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
//     postRepo = module.get<PostsRepoService>(PostsRepoService);
//     likeRepo = module.get<LikeForPostRepoService>(LikeForPostRepoService);
//   });

//   afterAll(async () => {
//     await module.close();
//   });

//   it('Like.SetUserLikeForPost() create 1 like', async () => {
//     await blogRepo.DeleteAll();
//     await postRepo.DeleteAll();
//     await userRepo.DeleteAll();
//     await likeRepo.DeleteAll();

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
//     let createPost = (await postRepo.Create(
//       post,
//       createdBlog.id.toString(),
//     )) as PostRepoEntity;

//     let userCreateData = new UserControllerRegistrationEntity(
//       'somelogin',
//       'someemail@mail.com',
//       'somepass',
//     );
//     let user = await userRepo.Create(userCreateData, true);

//     let savedLike = await likeRepo.SetUserLikeForPost(
//       user.id.toString(),
//       'Like',
//       createPost.id.toString(),
//     );

//     let readAllLikes = await likeRepo.ReadAll();

//     expect(readAllLikes.length).toEqual(1);
//     expect(savedLike).toMatchObject(readAllLikes[0]);
//   });
// });
