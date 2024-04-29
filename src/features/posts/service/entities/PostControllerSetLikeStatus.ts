import { IsEnum } from 'class-validator';
import {
  AvailableLikeStatus,
  AvailableLikeStatusArray,
} from '../../../likes/postLikes/repo/entity/LikeForPostsRepoEntity';

export class LikeSetEntity {
  @IsEnum(AvailableLikeStatusArray)
  public likeStatus: AvailableLikeStatus;
}
