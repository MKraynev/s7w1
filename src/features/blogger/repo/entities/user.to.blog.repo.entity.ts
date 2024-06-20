import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserRepoEntity } from "../../../users/repo/entities/UsersRepoEntity";
import { BlogRepoEntity } from "../../../blogs/repo/entities/blogs.repo.entity";

@Entity("UserToBlogs")
export class UserToBlogRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: "userId" })
  user: UserRepoEntity;
  @Column()
  userId: number;

  @JoinColumn({ name: "blogId" })
  blog: BlogRepoEntity;
  @Column({ nullable: true })
  blogId: number;

  public static Init(user: UserRepoEntity, blog: BlogRepoEntity) {
    let result = new UserToBlogRepoEntity();
    result.user = user;
    result.userId = user.id;
    result.blog = blog;
    result.blogId = blog.id;

    return result;
  }
}
