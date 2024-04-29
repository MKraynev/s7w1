import { IsEnum } from 'class-validator';
import {
  AvailableLikeStatus,
  AvailableLikeStatusArray,
} from 'src/features/likes/postLikes/repo/entity/LikeForPostsRepoEntity';

export class LikeSetEntity {
  @IsEnum(AvailableLikeStatusArray)
  public likeStatus: AvailableLikeStatus;
}
