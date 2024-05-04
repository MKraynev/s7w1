import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizGameAnswerRepoEntity } from "./entities/GamesAnswersRepoEntity";
import { GameQuizAnswersRepoService } from "./game.quiz.answers.repo.service";

@Module({
  imports: [TypeOrmModule.forFeature([QuizGameAnswerRepoEntity])],
  providers: [GameQuizAnswersRepoService],
  exports: [GameQuizAnswersRepoService],
})
export class GameQuizAnswersRepoModule {}
