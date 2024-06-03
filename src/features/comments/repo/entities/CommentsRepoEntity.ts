import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRepoEntity } from "../../../users/repo/entities/UsersRepoEntity";
import { PostRepoEntity } from "../../../posts/repo/entity/PostsRepoEntity";
import { LikeForCommentRepoEntity } from "../../../likes/commentLikes/repo/entity/LikeForCommentsRepoEntity";

@Entity("Comments")
export class CommentRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserRepoEntity, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: UserRepoEntity;
  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: false })
  userLogin: string;

  @ManyToOne(() => PostRepoEntity, (post) => post.comments, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "postId" })
  post: PostRepoEntity;
  @Column({ nullable: true })
  postId: number;

  @OneToMany(() => LikeForCommentRepoEntity, (like) => like.comment, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn()
  likes: LikeForCommentRepoEntity[];

  @Column({ nullable: true })
  content: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  public static Init(user: UserRepoEntity, post: PostRepoEntity, content: string) {
    let comment = new CommentRepoEntity();
    comment.user = user;
    comment.userId = user.id;
    comment.userLogin = user.login;

    comment.post = post;
    comment.postId = post.id;

    comment.content = content;

    return comment;
  }
}
