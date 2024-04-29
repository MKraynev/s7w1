import { CommentRepoEntity } from 'src/features/comments/repo/entities/CommentsRepoEntity';
import { LikeForPostRepoEntity } from 'src/features/likes/postLikes/repo/entity/LikeForPostsRepoEntity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  PostCreateEntity,
  PostWithExpectedBlogIdCreateEntity,
} from '../../controller/entities/SuperAdminCreatePostEntity';
import { BlogRepoEntity } from 'src/features/blogs/repo/entities/blogs.repo.entity';

@Entity('Posts')
export class PostRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @OneToMany(() => CommentRepoEntity, (comment) => comment.post)
  @JoinColumn()
  comments: CommentRepoEntity[];

  @ManyToOne(() => BlogRepoEntity, (blog) => blog.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  blog: BlogRepoEntity;
  @Column()
  blogId: number;

  @OneToMany(() => LikeForPostRepoEntity, (like) => like.post)
  likes: LikeForPostRepoEntity[];

  @Column()
  blogName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    postData: PostCreateEntity | PostWithExpectedBlogIdCreateEntity,
    blogId?: number,
  ): PostRepoEntity {
    let post = new PostRepoEntity();
    post.title = postData.title;
    post.shortDescription = postData.shortDescription;
    post.content = postData.content;
    post.blogId = blogId;
    return post;
  }
}
