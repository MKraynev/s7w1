import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceRepoEntity } from '../../entities/DevicesRepoEntity';
import { DeviceRepoService } from '../../DevicesRepoService';
import {
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_URL,
  POSTGRES_USERNAME,
} from '../../../../../settings';
import { UserRepoEntity } from '../../../../users/repo/entities/UsersRepoEntity';
import { UsersRepoService } from '../../../../users/repo/UsersRepoService';

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

export const TestDevicesRepoTestingModule = Test.createTestingModule({
  imports: [
    testDbConfiguration,
    TypeOrmModule.forFeature([DeviceRepoEntity, UserRepoEntity]),
  ],
  providers: [DeviceRepoService, UsersRepoService],
});
