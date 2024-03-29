import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_URL,
  POSTGRES_USERNAME,
} from '../settings';
import { TypeOrmModule } from '@nestjs/typeorm';

export const typeormConfiguration = TypeOrmModule.forRoot({
  type: 'postgres',
  host: POSTGRES_URL,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
});

@Module({
  imports: [typeormConfiguration],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
