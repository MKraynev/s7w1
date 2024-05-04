import { Module } from "@nestjs/common";
import { GameQuizGetMyCurrentUseCase } from "./service/use-cases/game.quiz.get.my.current.usecase";
import { CqrsModule } from "@nestjs/cqrs";
import { QuizGameConnectToGameUseCase } from "./service/use-cases/game.quiz.connection.usecase";
import { QuizGameRepoModule } from "./repo/GamesRepoModule";
import { UsersRepoModule } from "../../../users/repo/UsersRepoModule";
import { GamesPairGameQuizController } from "./controller/GamesPairGameQuizController";
import { QuizGameQuestionsModule } from "../questions.in.game/repo/game.quiz.questions.in.game.repo.module";

export const QuizGameUseCases = [GameQuizGetMyCurrentUseCase, QuizGameConnectToGameUseCase];

@Module({
  imports: [QuizGameRepoModule, UsersRepoModule, QuizGameQuestionsModule, CqrsModule],
  controllers: [GamesPairGameQuizController],
  providers: [...QuizGameUseCases],
  exports: [...QuizGameUseCases],
})
export class GamesModule {}
