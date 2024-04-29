import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogCreateEntity } from '../../controller/entities/blogs.super.admin.create.entity';
import { PostRepoEntity } from '../../../posts/repo/entity/PostsRepoEntity';

@Entity('Blogs')
export class BlogRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  isMembership: boolean;

  @OneToMany(() => PostRepoEntity, (post) => post.blog)
  posts: PostRepoEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public static Init(
    blogData: BlogCreateEntity,
    isMembership: boolean = false,
  ): BlogRepoEntity {
    let blog = new BlogRepoEntity();
    blog.name = blogData.name;
    blog.description = blogData.description;
    blog.websiteUrl = blogData.websiteUrl;
    blog.isMembership = isMembership;

    return blog;
  }
}
