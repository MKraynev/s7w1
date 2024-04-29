import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AvailableLikeStatus,
  LikeForPostRepoEntity,
} from './entity/LikeForPostsRepoEntity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { UsersRepoService } from 'src/features/users/repo/UsersRepoService';
import { PostsRepoService } from 'src/features/posts/repo/PostsRepoService';
import { PostRepoEntity } from 'src/features/posts/repo/entity/PostsRepoEntity';

export type AvailableLikeTarget = 'post' | 'comment';

@Injectable()
export class LikeForPostRepoService {
  constructor(
    @InjectRepository(LikeForPostRepoEntity)
    private postLikes: Repository<LikeForPostRepoEntity>,
    private userRepo: UsersRepoService,
    private postRepo: PostsRepoService,
  ) {}

  public async SetUserLikeForPost(
    userId: string,
    userStatus: AvailableLikeStatus,
    postId: string,
  ) {
    let postId_num = +postId;
    let userId_num = +userId;

    if (Number.isNaN(postId_num) || Number.isNaN(userId_num))
      throw new ForbiddenException();

    let userLike = await this.postLikes.findOne({
      where: { userId: userId_num, postId: postId_num },
    });

    if (userLike) {
      //like exist
      userLike.status = userStatus;
    } else {
      let user = await this.userRepo.ReadOneById(userId.toString());
      if (!user) throw new NotFoundException();

      let post = (await this.postRepo.ReadById(postId)) as PostRepoEntity;
      if (!post) throw new NotFoundException();

      userLike = LikeForPostRepoEntity.Init(userStatus, post, user);
    }
    return await this.postLikes.save(userLike);
  }

  public async ReadAll() {
    return await this.postLikes.find({});
  }
  public async DeleteAll() {
    return (await this.postLikes.delete({})).affected;
  }

  public async GetUserStatus(
    postId: string,
    userId: string,
  ): Promise<AvailableLikeStatus> {
    let result: AvailableLikeStatus = 'None';

    let postId_num = +postId;
    let userId_num = +userId;

    if (Number.isNaN(userId_num) || Number.isNaN(postId_num)) return result;

    let like = await this.postLikes.findOne({
      where: {
        postId: postId_num,
        userId: userId_num,
      },
    });

    if (like) return like.status;

    return result;
  }

  public async ReadManyLikes(
    postId: string,
    sortBy: keyof LikeForPostRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    skip: number = 0,
    limit: number = 10,
  ) {
    let orderObj: FindOptionsOrder<LikeForPostRepoEntity> = {};
    orderObj[sortBy] = sortDirection;

    let likes = await this.postLikes.find({
      where: { postId: +postId, status: 'Like' },
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { user: true },
    });

    return likes;
  }

  public async Count(postId: string) {
    let likes = await this.postLikes.count({
      where: { postId: +postId, status: 'Like' },
    });
    let dislikes = await this.postLikes.count({
      where: { postId: +postId, status: 'Dislike' },
    });

    return { likes, dislikes };
  }
}

// Expected: {"pagesCount":1,"page":1,"pageSize":10,"totalCount":6,"items":[{"id":"286","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:01.085Z","extendedLikesInfo":{"dislikesCount":1,"likesCount":1,"myStatus":"Like","newestLikes":[{"addedAt":Any<String>,"userId":"214","login":"8173lg"}]}},{"id":"285","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:01.032Z","extendedLikesInfo":{"dislikesCount":1,"likesCount":1,"myStatus":"None","newestLikes":[{"addedAt":Any<String>,"userId":"215","login":"8174lg"}]}},{"id":"284","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.978Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":4,"myStatus":"Like","newestLikes":[{"addedAt":Any<String>,"userId":"216","login":"8175lg"},{"addedAt":Any<String>,"userId":"215","login":"8174lg"},{"addedAt":Any<String>,"userId":"217","login":"8176lg"}]}},{"id":"283","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.921Z","extendedLikesInfo":{"dislikesCount":1,"likesCount":0,"myStatus":"Dislike","newestLikes":[]}},{"id":"282","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.861Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":2,"myStatus":"None","newestLikes":[{"addedAt":Any<String>,"userId":"216","login":"8175lg"},{"addedAt":Any<String>,"userId":"215","login":"8174lg"}]}},{"id":"281","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.803Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":2,"myStatus":"Like","newestLikes":[{"addedAt":Any<String>,"userId":"215","login":"8174lg"},{"addedAt":Any<String>,"userId":"214","login":"8173lg"}]}}]}

// Received: {"pagesCount":1,"page":1,"pageSize":10,"totalCount":6,"items":[{"id":"286","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:01.085Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":0,"myStatus":"None","newestLikes":[]}},{"id":"285","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:01.032Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":0,"myStatus":"None","newestLikes":[]}},{"id":"284","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.978Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":0,"myStatus":"None","newestLikes":[]}},{"id":"283","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.921Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":0,"myStatus":"None","newestLikes":[]}},{"id":"282","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.861Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":0,"myStatus":"None","newestLikes":[]}},{"id":"281","title":"post title","shortDescription":"description","content":"new post content","blogId":"273","blogName":"new blog","createdAt":"2023-12-14T18:57:00.803Z","extendedLikesInfo":{"dislikesCount":0,"likesCount":0,"myStatus":"None","newestLikes":[]}}]}

// Attention: "addedAt": Any<String> is equal to any date string, don't worry about highlighting this field

// - Expected
// + Received

// @@ -4,20 +4,14 @@
//         "blogId": "273",
//         "blogName": "new blog",
//         "content": "new post content",
//         "createdAt": "2023-12-14T18:57:01.085Z",
//         "extendedLikesInfo": Object {
// -         "dislikesCount": 1,
// -         "likesCount": 1,
// -         "myStatus": "Like",
// -         "newestLikes": Array [
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8173lg",
// -             "userId": "214",
// -           },
// -         ],
// +         "dislikesCount": 0,
// +         "likesCount": 0,
// +         "myStatus": "None",
// +         "newestLikes": Array [],
//         },
//         "id": "286",
//         "shortDescription": "description",
//         "title": "post title",
//       },
// @@ -25,21 +19,15 @@
//         "blogId": "273",
//         "blogName": "new blog",
//         "content": "new post content",
//         "createdAt": "2023-12-14T18:57:01.032Z",
//         "extendedLikesInfo": Object {
// -         "dislikesCount": 1,
// -         "likesCount": 1,
// +         "dislikesCount": 0,
// +         "likesCount": 0,
//           "myStatus": "None",
// -         "newestLikes": Array [
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8174lg",
// -             "userId": "215",
// +         "newestLikes": Array [],
//         },
// -         ],
// -       },
//         "id": "285",
//         "shortDescription": "description",
//         "title": "post title",
//       },
//       Object {
// @@ -47,29 +35,13 @@
//         "blogName": "new blog",
//         "content": "new post content",
//         "createdAt": "2023-12-14T18:57:00.978Z",
//         "extendedLikesInfo": Object {
//           "dislikesCount": 0,
// -         "likesCount": 4,
// -         "myStatus": "Like",
// -         "newestLikes": Array [
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8175lg",
// -             "userId": "216",
// -           },
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8174lg",
// -             "userId": "215",
// -           },
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8176lg",
// -             "userId": "217",
// -           },
// -         ],
// +         "likesCount": 0,
// +         "myStatus": "None",
// +         "newestLikes": Array [],
//         },
//         "id": "284",
//         "shortDescription": "description",
//         "title": "post title",
//       },
// @@ -77,13 +49,13 @@
//         "blogId": "273",
//         "blogName": "new blog",
//         "content": "new post content",
//         "createdAt": "2023-12-14T18:57:00.921Z",
//         "extendedLikesInfo": Object {
// -         "dislikesCount": 1,
// +         "dislikesCount": 0,
//           "likesCount": 0,
// -         "myStatus": "Dislike",
// +         "myStatus": "None",
//           "newestLikes": Array [],
//         },
//         "id": "283",
//         "shortDescription": "description",
//         "title": "post title",
// @@ -93,25 +65,14 @@
//         "blogName": "new blog",
//         "content": "new post content",
//         "createdAt": "2023-12-14T18:57:00.861Z",
//         "extendedLikesInfo": Object {
//           "dislikesCount": 0,
// -         "likesCount": 2,
// +         "likesCount": 0,
//           "myStatus": "None",
// -         "newestLikes": Array [
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8175lg",
// -             "userId": "216",
// -           },
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8174lg",
// -             "userId": "215",
// +         "newestLikes": Array [],
//         },
// -         ],
// -       },
//         "id": "282",
//         "shortDescription": "description",
//         "title": "post title",
//       },
//       Object {
// @@ -119,24 +80,13 @@
//         "blogName": "new blog",
//         "content": "new post content",
//         "createdAt": "2023-12-14T18:57:00.803Z",
//         "extendedLikesInfo": Object {
//           "dislikesCount": 0,
// -         "likesCount": 2,
// -         "myStatus": "Like",
// -         "newestLikes": Array [
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8174lg",
// -             "userId": "215",
// -           },
// -           Object {
// -             "addedAt": Any<String>,
// -             "login": "8173lg",
// -             "userId": "214",
// -           },
// -         ],
// +         "likesCount": 0,
// +         "myStatus": "None",
// +         "newestLikes": Array [],
//         },
//         "id": "281",
//         "shortDescription": "description",
//         "title": "post title",
//       },
