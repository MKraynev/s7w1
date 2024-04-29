import { CommentRepoEntity } from '../../../comments/repo/entities/CommentsRepoEntity';
import { AvailableLikeStatus } from '../../../likes/postLikes/repo/entity/LikeForPostsRepoEntity';

export class CommentInfo {
  public id: string;
  public content: string;
  public commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  public createdAt: string;
  public likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: AvailableLikeStatus;
  };

  constructor(
    comment: CommentRepoEntity,
    userId: string,
    userLogin: string,
    userStatus: AvailableLikeStatus = 'None',
    likeCount: number = 0,
    dislikeCount: number = 0,
  ) {
    this.id = comment.id.toString();
    this.content = comment.content;
    this.createdAt = comment.createdAt.toISOString();

    this.commentatorInfo = {
      userId: userId,
      userLogin: userLogin,
    };

    this.likesInfo = {
      myStatus: userStatus,
      likesCount: likeCount,
      dislikesCount: dislikeCount,
    };
  }
}
