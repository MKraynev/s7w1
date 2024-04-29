import { CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepoEntity } from '../../entities/UsersRepoEntity';
import { UsersRepoService } from '../../UsersRepoService';
import { UsersRepoUseCases } from '../../UsersRepoModule';
import {
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_URL,
  POSTGRES_USERNAME,
} from '../../../../../settings';
import { DeviceRepoEntity } from '../../../../devices/repo/entities/DevicesRepoEntity';
import { DeviceRepoService } from '../../../../devices/repo/DevicesRepoService';

export const testDbConfiguration = TypeOrmModule.forRoot({
  type: 'postgres',
  host: POSTGRES_URL,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: 'Test',
  autoLoadEntities: true,
  synchronize: true,
});

export const TestUsersRepoTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    CqrsModule,
    TypeOrmModule.forFeature([UserRepoEntity, DeviceRepoEntity]),
  ],
  providers: [UsersRepoService, DeviceRepoService, ...UsersRepoUseCases],
});
