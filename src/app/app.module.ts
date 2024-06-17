import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlogModule } from "../features/blogs/BlogsModule";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_SSL_STATUS, POSTGRES_URL, POSTGRES_USERNAME } from "../settings";
import { UsersModule } from "../features/users/UsersModule";
import { DevicesModule } from "../features/devices/DevicesModule";
import { PostModule } from "../features/posts/PostModule";
import { CommentsModule } from "../features/comments/CommentsModule";
import { QuizQuestionsModule } from "../features/games/quiz/questions/service/QuizQuestionsModule";
import { GamesModule } from "../features/games/quiz/self/GamesModule";
import { ThrottlerModule } from "@nestjs/throttler";
import { SuperAdminModule } from "../superAdmin/SuperAdminModule";
import { QuizGameQuestionsInGameModule } from "../features/games/quiz/questions.in.game/repo/game.quiz.questions.in.game.repo.module";
import { ScheduleModule } from "@nestjs/schedule";

let a: TypeOrmModuleOptions;

export const typeormConfiguration = TypeOrmModule.forRoot({
  type: "postgres",
  url: POSTGRES_URL,
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
    QuizGameQuestionsInGameModule,
    GamesModule,
    ThrottlerModule.forRoot([{ ttl: 20000, limit: 300 }]),
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
