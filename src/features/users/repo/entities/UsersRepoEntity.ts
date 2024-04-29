import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserControllerRegistrationEntity } from 'src/features/users/controllers/entities/UsersControllerRegistrationEntity';
import { UsersControllerGetEntity } from 'src/features/users/controllers/entities/UsersControllerGetEntity';
import { DeviceRepoEntity } from 'src/features/devices/repo/entities/DevicesRepoEntity';
import { LikeForPostRepoEntity } from 'src/features/likes/postLikes/repo/entity/LikeForPostsRepoEntity';
import { bcrypt } from 'bcrypt';
@Entity('Users')
export class UserRepoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @Column()
  emailConfirmed: boolean;

  @OneToMany(() => DeviceRepoEntity, (device) => device.user)
  devices: DeviceRepoEntity[];

  @Column({ nullable: true })
  refreshPasswordTime: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => LikeForPostRepoEntity, (like) => like.user)
  likes: LikeForPostRepoEntity[];

  public static async Init(
    inputUser: UserControllerRegistrationEntity,
    confirmEmail: boolean = false,
  ): Promise<UserRepoEntity> {
    let user: UserRepoEntity = new UserRepoEntity();
    user.login = inputUser.login;
    user.email = inputUser.email;

    await user.UpdatePassword(inputUser.password);

    user.emailConfirmed = confirmEmail;

    return user;
  }

  public async UpdatePassword(password: string) {
    this.salt = (await bcrypt.genSalt()).toString();
    this.hash = await bcrypt.hash(password, this.salt);
    this.refreshPasswordTime = undefined;
  }

  public async PasswordIsValid(password: string): Promise<boolean> {
    try {
      let calculatedHash = await bcrypt.hash(password, this.salt);
      if (calculatedHash === this.hash) return true;

      return false;
    } catch {
      return false;
    }
  }

  public Transform(): UsersControllerGetEntity {
    return new UsersControllerGetEntity(this);
  }
}
