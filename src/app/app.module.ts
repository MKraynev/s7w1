import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from 'src/blogs/BlogsModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_URL,
  POSTGRES_USERNAME,
} from '../settings';

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
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
