import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepoEntity } from './entities/UsersRepoEntity';
import { UsersRepoCreateUserUseCase } from './use-cases/UsersRepoCreateUsecase';
import { UsersRepoService } from './UsersRepoService';
import { UsersRepoReadOneByPropertyValueUseCase } from './use-cases/UsersRepoReadOneByPropertyUsecase';
import { UsersRepoClearUseCase } from './use-cases/UsersRepoClearUsecase';
import { UsersRepoReadOneByLoginOrEmailUseCase } from './use-cases/UsersRepoReadOneByLoginOrEmailUsecase';
import { UsersRepoReadManyByLoginByEmailUseCase } from './use-cases/UsersRepoReadManyByLoginByEmailUsecase';
import { UsersRepoUpdateOneUseCase } from './use-cases/UsersRepoUpdateUsecase';

export const UsersRepoUseCases = [
  UsersRepoCreateUserUseCase,
  UsersRepoReadOneByPropertyValueUseCase,
  UsersRepoClearUseCase,
  UsersRepoReadOneByLoginOrEmailUseCase,
  UsersRepoReadManyByLoginByEmailUseCase,
  UsersRepoUpdateOneUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([UserRepoEntity])],
  providers: [UsersRepoService, ...UsersRepoUseCases],
  exports: [UsersRepoService, ...UsersRepoUseCases],
})
export class UsersRepoModule {}
