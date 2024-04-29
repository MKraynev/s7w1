import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CommentRepoEntity } from './entities/CommentsRepoEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeForCommentRepoService } from '../../likes/commentLikes/repo/LikesForCommentRepoService';
import { UsersRepoService } from '../../users/repo/UsersRepoService';
import { PostsRepoService } from '../../posts/repo/PostsRepoService';
import { UserRepoEntity } from '../../users/repo/entities/UsersRepoEntity';
import { PostRepoEntity } from '../../posts/repo/entity/PostsRepoEntity';
import { CommentSetEntity } from '../../posts/service/entities/PostControllerSetComment';
import { CommentInfo } from '../../posts/service/entities/PostControllerGetComment';

@Injectable()
export class CommentsRepoService {
  constructor(
    @InjectRepository(CommentRepoEntity)
    private commentRepo: Repository<CommentRepoEntity>,
    private likeRepo: LikeForCommentRepoService,
    private userRepoService: UsersRepoService,
    private postRepoService: PostsRepoService,
  ) {}

  public async Create(
    user: UserRepoEntity,
    post: PostRepoEntity,
    commentData: CommentSetEntity,
  ) {
    let comment = CommentRepoEntity.Init(user, post, commentData.content);

    return await this.commentRepo.save(comment);
  }

  public Update = async (comment: CommentRepoEntity) =>
    await this.commentRepo.save(comment);

  public ReadOneById = async (id: string) =>
    await this.commentRepo.findOne({
      where: { id: +id },
      relations: { user: true },
    });

  public async ReadAndCountManyForCertainPost(
    postId: string,
    sortBy: keyof CommentRepoEntity = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    userId?: string,
    skip: number = 0,
    limit: number = 10,
  ) {
    let orderObj: FindOptionsOrder<CommentRepoEntity> = {};
    orderObj[sortBy] = sortDirection;

    let count = await this.commentRepo.count({ where: { postId: +postId } });

    let comments = await this.commentRepo.find({
      where: { postId: +postId },
      order: orderObj,
      skip: skip,
      take: limit,
      relations: { user: true, likes: true },
    });

    let commentsInfo = await Promise.all(
      comments.map(async (comment) => {
        let likesCount = comment.likes.filter(
          (like) => like.status === 'Like',
        ).length;
        let dislikes = comment.likes.length - likesCount;

        let userStatus = await this.likeRepo.GetUserStatus(
          comment.id.toString(),
          userId,
        );

        let comInfo = new CommentInfo(
          comment,
          comment.userId.toString(),
          comment.user.login,
          userStatus,
          likesCount,
          dislikes,
        );

        return comInfo;
      }),
    );

    return { count: count, comments: commentsInfo };
  }

  public DeleteAll = async () => (await this.commentRepo.delete({})).affected;

  public DeleteById = async (id: string) =>
    (await this.commentRepo.delete({ id: +id })).affected;
}
