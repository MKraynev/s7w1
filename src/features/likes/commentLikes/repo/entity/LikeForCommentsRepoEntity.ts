import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AvailableLikeStatus } from '../../../postLikes/repo/entity/LikeForPostsRepoEntity';
import { CommentRepoEntity } from '../../../../comments/repo/entities/CommentsRepoEntity';
import { UserRepoEntity } from '../../../../users/repo/entities/UsersRepoEntity';

@Entity('LikesForComments')
export class LikeForCommentRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CommentRepoEntity, (comment) => comment.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  comment: CommentRepoEntity;
  @Column()
  commentId: number;

  @ManyToOne(() => UserRepoEntity, (user) => user.likes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserRepoEntity;
  @Column()
  userId: number;

  @Column()
  status: AvailableLikeStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    status: AvailableLikeStatus,
    comment: CommentRepoEntity,
    user: UserRepoEntity,
  ) {
    let like = new LikeForCommentRepoEntity();
    like.comment = comment;
    like.commentId = comment.id;

    like.user = user;
    like.userId = user.id;

    like.status = status;

    return like;
  }
}
