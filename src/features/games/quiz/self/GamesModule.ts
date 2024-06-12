import { Module } from "@nestjs/common";
import { GameQuizGetMyCurrentUseCase } from "./service/use-cases/game.quiz.get.my.current.usecase";
import { CqrsModule } from "@nestjs/cqrs";
import { GameQuizRepoModule } from "./repo/GamesRepoModule";
import { UsersRepoModule } from "../../../users/repo/UsersRepoModule";
import { GamesPairGameQuizController } from "./controller/GamesPairGameQuizController";
import { QuizGameQuestionsInGameModule } from "../questions.in.game/repo/game.quiz.questions.in.game.repo.module";
import { GameQuizAnswersRepoModule } from "../answers/repo/game.quiz.answers.repo.module";
import { GameQuizGetByIdUseCase } from "./service/use-cases/game.quiz.get.by.id.usecase";
import { QuizQuestRepoModule } from "../questions/repo/QuestionsRepoModule";
import { GameQuizGetPairsMyUseCase } from "./service/use-cases/game.quiz.get.pairs.my.usecase";
import { GameQuizGetMyStatisticUseCase } from "./service/use-cases/game.quiz.get.my.statistic.usecase";
import { GameQuizWinnersRepoModule } from "../winners/repo/game.quiz.winners.repo.module";
import { GameQuizGetUsersTopUseCase } from "./service/use-cases/game.quiz.get.users.top.usecase";
import { GameQuizConnectionV2UseCase } from "./service/use-cases/game.quiz.connection.v2.usecase";
import { GameQuizAnswerTheQuestionV2UseCase } from "./service/use-cases/game.quiz.answer.the.question.v2.usecase";

export const QuizGameUseCases = [
  GameQuizGetMyCurrentUseCase,
  GameQuizConnectionV2UseCase,
  GameQuizGetByIdUseCase,
  GameQuizAnswerTheQuestionV2UseCase,
  GameQuizGetPairsMyUseCase,
  GameQuizGetMyStatisticUseCase,
  GameQuizGetUsersTopUseCase,
];

@Module({
  imports: [
    GameQuizWinnersRepoModule,
    GameQuizRepoModule,
    GameQuizAnswersRepoModule,
    UsersRepoModule,
    QuizGameQuestionsInGameModule,
    CqrsModule,
    QuizQuestRepoModule,
  ],
  controllers: [GamesPairGameQuizController],
  providers: [...QuizGameUseCases],
  exports: [...QuizGameUseCases],
})
export class GamesModule {}
