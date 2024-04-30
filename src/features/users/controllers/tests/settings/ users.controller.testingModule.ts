import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../UsersController';
import { testDbConfiguration } from '../../../repo/tests/settings/users.repo.testingModule';
import { UserRepoEntity } from '../../../repo/entities/UsersRepoEntity';
import { UsersRepoService } from '../../../repo/UsersRepoService';
import { UsersAuthController } from '../../UsersAuthController';
import { UsersServiceUseCases } from '../../../UsersModule';
import { UsersRepoModule } from '../../../repo/UsersRepoModule';
import { JwtHandlerModule } from '../../../../../jwt/JwtModule';
import { LikesForPostRepoModule } from '../../../../likes/postLikes/repo/LikesForPostRepoModule';
import { CommentRepoModule } from '../../../../comments/repo/CommentsRepoModule';
import { DeviceRepoModule } from '../../../../devices/repo/DevicesRepoModule';
import { CqrsModule } from '@nestjs/cqrs';

export const TestUsersServiceTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    UsersRepoModule,
    JwtHandlerModule,
    LikesForPostRepoModule,
    CommentRepoModule,
    DeviceRepoModule,
    CqrsModule,
  ],
  controllers: [UsersController, UsersAuthController],
  providers: [...UsersServiceUseCases],
});
