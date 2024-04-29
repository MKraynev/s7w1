import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../features/blogs/BlogsModule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_URL,
  POSTGRES_USERNAME,
} from '../settings';
import { UsersModule } from '../features/users/UsersModule';
import { DevicesModule } from '../features/devices/DevicesModule';
import { PostModule } from '../features/posts/PostModule';
import { CommentsModule } from '../features/comments/CommentsModule';
import { QuizQuestionsModule } from '../features/questions/QuizQuestionsModule';
import { QuizGameQuestionsModule } from '../features/quiz_game_questions/quiz_game_questions_repo_module';
import { GamesModule } from '../features/games/GamesModule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SuperAdminModule } from '../superAdmin/SuperAdminModule';
import { APP_GUARD } from '@nestjs/core';

let a: TypeOrmModuleOptions;

export const typeormConfiguration = TypeOrmModule.forRoot({
  type: 'postgres',
  host: POSTGRES_URL,
  port: POSTGRES_PORT,
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
  ssl: true,
});

@Module({
  imports: [
    typeormConfiguration,
    UsersModule,
    DevicesModule,
    BlogModule,
    PostModule,
    CommentsModule,
    QuizQuestionsModule,
    QuizGameQuestionsModule,
    GamesModule,
    ThrottlerModule.forRoot([{ ttl: 20000, limit: 300 }]),
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
