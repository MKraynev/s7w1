import { TestingModule } from '@nestjs/testing';
import { CommentsRepoService } from '../CommentsRepoService';

// describe('CommentsRepo test', () => {
//   let module: TestingModule;

//   let blogRepo: BlogsRepoService;
//   let postRepo: PostsRepoService;
//   let userRepo: UsersRepoService;
//   let likeRepo: LikeForPostRepoService;
//   let commentRepo: CommentsRepoService;

//   beforeAll(async () => {
//     module = await TestCommentsRepoTestingModule.compile();

//     await module.init();

//     userRepo = module.get<UsersRepoService>(UsersRepoService);
//     blogRepo = module.get<BlogsRepoService>(BlogsRepoService);
//     postRepo = module.get<PostsRepoService>(PostsRepoService);
//     likeRepo = module.get<LikeForPostRepoService>(LikeForPostRepoService);
//     commentRepo = module.get<CommentsRepoService>(CommentsRepoService);
//   });

//   afterAll(async () => {
//     await module.close();
//   });

//   it('Comment.Create() create 1 comment', async () => {
//     await blogRepo.DeleteAll();
//     await postRepo.DeleteAll();
//     await userRepo.DeleteAll();
//     await likeRepo.DeleteAll();
//     await commentRepo.DeleteAll();

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

//     let comment = new CommentSetEntity();
//     comment.content = 'some content for comment';

//     let savedComment = await commentRepo.Create(user, createPost, comment);

//     let readAllComments = await commentRepo.ReadAndCountManyForCertainPost(
//       createPost.id.toString(),
//     );

//     expect(readAllComments.comments.length).toEqual(1);
//     expect(savedComment).toMatchObject(readAllComments[0]);
//   });
// });
