import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from '../features/blogs/BlogsModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_URL,
  POSTGRES_USERNAME,
} from '../settings';
import { UsersModule } from 'src/features/users/UsersModule';
import { DevicesModule } from 'src/features/devices/DevicesModule';
import { PostModule } from 'src/features/posts/PostModule';
import { CommentsModule } from 'src/features/comments/CommentsModule';
import { QuizQuestionsModule } from 'src/features/questions/QuizQuestionsModule';
import { QuizGameQuestionsModule } from 'src/features/quiz_game_questions/quiz_game_questions_repo_module';
import { GamesModule } from 'src/features/games/GamesModule';
import { ThrottlerModule } from '@nestjs/throttler';
import { SuperAdminModule } from 'src/superAdmin/SuperAdminModule';

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
