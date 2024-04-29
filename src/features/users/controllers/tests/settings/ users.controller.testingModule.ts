import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../../UsersController';
import { testDbConfiguration } from '../../../repo/tests/settings/users.repo.testingModule';
import { UserRepoEntity } from '../../../repo/entities/UsersRepoEntity';
import { UsersRepoService } from '../../../repo/UsersRepoService';

export const TestUsersServiceTestingModule = Test.createTestingModule({
  imports: [testDbConfiguration, TypeOrmModule.forFeature([UserRepoEntity])],
  controllers: [UsersController],
  providers: [UsersRepoService],
});
